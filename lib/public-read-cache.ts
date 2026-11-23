type PublicReadCacheOptions = {
  ttlMs: number
  timeoutMs: number
  failureCooldownMs?: number
}
export function createPublicReadCache<T>(
  loader: () => Promise<T>,
  { ttlMs, timeoutMs, failureCooldownMs = 30_000 }: PublicReadCacheOptions,
) {
  let cached: { value: T; expiresAt: number } | undefined
  let inFlight: Promise<T> | undefined
  let blockedUntil = 0

  async function load() {
    let timeout: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        loader(),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => reject(new Error(`Public data read timed out after ${timeoutMs}ms`)), timeoutMs)
        }),
      ])
    } finally {
      if (timeout) clearTimeout(timeout)
    }
  }

  return {
    async read() {
      const now = Date.now()
      if (cached && cached.expiresAt > now) return cached.value
      if (blockedUntil > now) {
        if (cached) return cached.value
        throw new Error("Public data read is temporarily unavailable")
      }
      if (!inFlight) {
        inFlight = load()
          .then(value => {
            cached = { value, expiresAt: Date.now() + ttlMs }
            blockedUntil = 0
            return value
          })
          .catch(error => {
            blockedUntil = Date.now() + failureCooldownMs
            if (cached) return cached.value
            throw error
          })
          .finally(() => {
            inFlight = undefined
          })
      }
      return inFlight
    },
  }
}

