import { notFound } from "next/navigation"
import { getArticle } from "@/lib/articles-db"
import { siteConfig } from "@/lib/site-config"
import { bilingualAlternates } from "@/lib/locale"

export const dynamicParams = true
export const revalidate = 60
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug, "zh")
  if (!article) return {}
  return { title: article.title, description: article.excerpt, alternates: bilingualAlternates(`/news/${slug}`, "zh"), openGraph: { type: "article" as const, url: `/zh/news/${slug}`, title: article.title, description: article.excerpt, locale: "zh_CN", images: article.featuredImage ? [{ url: article.featuredImage }] : [] } }
}
export default async function ChineseNewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug, "zh")
  if (!article) notFound()
  const url = `${siteConfig.siteUrl}/zh/news/${slug}`
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: article.title, description: article.excerpt, url, image: article.featuredImage ? [article.featuredImage] : undefined, datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt, publisher: { "@id": `${siteConfig.siteUrl}/#organization` }, mainEntityOfPage: url, inLanguage: "zh-CN" }
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><time className="text-sm text-muted-foreground">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("zh-CN") : ""}</time><h1 className="mt-3 text-4xl font-semibold">{article.title}</h1><p className="mt-5 text-lg text-muted-foreground">{article.excerpt}</p><div className="article-prose mt-10" dangerouslySetInnerHTML={{ __html: article.content }} /></article>
}
