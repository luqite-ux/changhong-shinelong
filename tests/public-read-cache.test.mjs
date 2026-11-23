import test from "node:test"
import assert from "node:assert/strict"

import { createPublicReadCache } from "../lib/public-read-cache.ts"

test("createPublicReadCache merges concurrent reads and reuses the cached value", async () => {
  let calls = 0
  const cache = createPublicReadCache(async () => {
    calls += 1
    await new Promise(resolve => setTimeout(resolve, 20))
    return ["published"]
  }, { ttlMs: 1_000, timeoutMs: 200 })

  const [first, second] = await Promise.all([cache.read(), cache.read()])
  const third = await cache.read()

  assert.deepEqual(first, ["published"])
  assert.deepEqual(second, ["published"])
  assert.deepEqual(third, ["published"])
  assert.equal(calls, 1)
})
test("createPublicReadCache times out a stalled public read", async () => {
  const cache = createPublicReadCache(
    () => new Promise(() => {}),
    { ttlMs: 1_000, timeoutMs: 20 },
  )

  await assert.rejects(cache.read(), /timed out/i)
})

