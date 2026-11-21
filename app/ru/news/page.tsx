import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { getPublishedArticles } from "@/lib/articles-db"
import { multilingualAlternates } from "@/lib/locale"

export const metadata = { title: "Новости", description: "Технические материалы и новости Chanhong ShineLong.", alternates: multilingualAlternates("/news", "ru") }
export const revalidate = 60
export default async function RussianNewsPage() { const articles = await getPublishedArticles("ru"); return <><PageHero title="Новости" description="Технические материалы и новости компании Chanhong ShineLong." /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">{articles.length ? <div className="grid gap-6 md:grid-cols-3">{articles.map(article => <article key={article.slug} className="flex h-full flex-col rounded-sm border p-6"><time className="text-xs text-muted-foreground">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ru-RU") : ""}</time><h2 className="mt-3 line-clamp-2 text-xl font-semibold">{article.title}</h2><p className="mt-3 line-clamp-3 flex-1 text-muted-foreground">{article.excerpt}</p><Link href={`/ru/news/${article.slug}`} className="mt-6 font-medium text-primary">Читать →</Link></article>)}</div> : <div className="py-16 text-center"><h2 className="text-2xl font-semibold">Опубликованных материалов пока нет</h2><p className="mt-3 text-muted-foreground">После публикации технические материалы появятся в этом разделе.</p></div>}</main></> }
