import { unstable_cache } from "next/cache"
import { getSupabaseClient, getTenantId } from "@/lib/supabase"
import { createPublicReadCache } from "@/lib/public-read-cache"

export type Article = {
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage: string | null
  publishedAt: string | null
  updatedAt: string | null
}

type ArticleRow = {
  slug: string
  title?: string | null
  title_i18n?: Record<string, string> | null
  excerpt?: string | null
  excerpt_i18n?: Record<string, string> | null
  content?: string | null
  content_i18n?: Record<string, string> | null
  featured_image?: string | null
  published_at?: string | null
  updated_at?: string | null
}

function translated(value: Record<string, string> | null | undefined, locale: "en" | "zh" | "ru", fallback: string) {
  return value?.[locale] || value?.en || Object.values(value || {}).find(Boolean) || fallback
}

async function queryPublishedArticleRows(tenant: string) {
  const db = getSupabaseClient()
  if (!db) throw new Error("Supabase article configuration is missing")
  const { data, error } = await db.from("articles")
    .select("slug,title,title_i18n,excerpt,excerpt_i18n,content,content_i18n,featured_image,published_at,updated_at")
    .eq("tenant_id", tenant)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ArticleRow[]
}

const loadArticleRowsWithNextCache = unstable_cache(
  queryPublishedArticleRows,
  ["chxl-public-articles-v2"],
  { revalidate: 300, tags: ["chxl-articles"] },
)

const articleReadCache = createPublicReadCache(async () => {
  const tenant = getTenantId()
  if (!tenant) throw new Error("Supabase article configuration is missing")
  return loadArticleRowsWithNextCache(tenant)
}, { ttlMs: 300_000, timeoutMs: 8_000 })

export async function getPublishedArticles(locale: "en" | "zh" | "ru" = "en") {
  const rows = await articleReadCache.read()
  return rows.map(row => ({
    slug: row.slug,
    title: translated(row.title_i18n, locale, row.title || ""),
    excerpt: translated(row.excerpt_i18n, locale, row.excerpt || ""),
    content: translated(row.content_i18n, locale, row.content || ""),
    featuredImage: row.featured_image || null,
    publishedAt: row.published_at || null,
    updatedAt: row.updated_at || null,
  })) satisfies Article[]
}

export async function getArticle(slug: string, locale: "en" | "zh" | "ru" = "en") {
  return (await getPublishedArticles(locale)).find(article => article.slug === slug)
}
