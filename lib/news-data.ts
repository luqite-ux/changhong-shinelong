import type { NewsPost } from "./types"

/**
 * No verified news/insights content has been supplied by the customer yet.
 * This array is intentionally empty so the /news route renders an honest
 * empty state rather than fabricated posts. Populate with real posts once
 * the customer provides them.
 */
export const newsPosts: NewsPost[] = []

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug)
}
