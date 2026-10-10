import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { getPublishedArticles } from "@/lib/articles-db"
import { bilingualAlternates } from "@/lib/locale"

export const revalidate = 60
export const metadata = { title: "新闻资讯", description: "常宏祥隆发布的技术文章和企业动态。", alternates: bilingualAlternates("/news", "zh") }
export default async function ChineseNewsPage() {
  const articles = await getPublishedArticles("zh")
  return <><PageHero title="新闻资讯" description="常宏祥隆的技术文章和企业动态。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">{articles.length ? <div className="grid gap-6 md:grid-cols-3">{articles.map(article => <article key={article.slug} className="flex h-full flex-col rounded-sm border p-6"><time className="text-xs text-muted-foreground">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("zh-CN") : ""}</time><h2 className="mt-3 line-clamp-2 text-xl font-semibold">{article.title}</h2><p className="mt-3 line-clamp-3 flex-1 text-muted-foreground">{article.excerpt}</p><Link href={`/zh/news/${article.slug}`} className="mt-6 font-medium text-primary">阅读文章 →</Link></article>)}</div> : <div className="py-16 text-center"><h2 className="text-2xl font-semibold">暂无已发布文章</h2><p className="mt-3 text-muted-foreground">经核实的技术文章和企业动态发布后将在此展示。</p></div>}</main></>
}
