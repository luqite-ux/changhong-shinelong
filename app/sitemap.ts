import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/products-db"
import { getPublishedArticles } from "@/lib/articles-db"
import { localizedPath } from "@/lib/locale"
import { siteConfig } from "@/lib/site-config"

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPaths = ["/", "/products", "/applications", "/manufacturing", "/about", "/catalogue", "/news", "/contact"]
  const [products, articles] = await Promise.all([getProducts(), getPublishedArticles()])
  const paths = [
    ...staticPaths.map(path => ({ path, lastModified: now })),
    ...products.map(product => ({ path: `/products/${product.slug}`, lastModified: now })),
    ...articles.map(article => ({ path: `/news/${article.slug}`, lastModified: new Date(article.updatedAt || article.publishedAt || now) })),
  ]
  return paths.flatMap(({ path, lastModified }) => {
    const en = `${siteConfig.siteUrl}${localizedPath(path, "en")}`
    const zh = `${siteConfig.siteUrl}${localizedPath(path, "zh")}`
    const alternates = { languages: { en, "zh-CN": zh } }
    return [{ url: en, lastModified, alternates }, { url: zh, lastModified, alternates }]
  })
}
