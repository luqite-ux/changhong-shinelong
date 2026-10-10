import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { RfqForm } from "@/components/rfq-form"
import { getProduct, getProducts } from "@/lib/products-db"
import { siteConfig } from "@/lib/site-config"
import { t } from "@/lib/types"
import { technicalZh } from "@/lib/technical-zh"
import { bilingualAlternates } from "@/lib/locale"

export const dynamicParams = true
export const revalidate = 60
export async function generateStaticParams() { return (await getProducts()).map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return { title: t(product.name, "zh"), description: t(product.summary, "zh"), alternates: bilingualAlternates(`/products/${slug}`, "zh"), openGraph: { url: `/zh/products/${slug}`, title: t(product.name, "zh"), description: t(product.summary, "zh"), locale: "zh_CN", images: product.images[0] ? [{ url: product.images[0].src }] : [] } }
}

export default async function ChineseProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const options = (await getProducts()).map(p => ({ slug: p.slug, label: `${p.code} — ${t(p.name, "zh")}` }))
  const url = `${siteConfig.siteUrl}/zh/products/${slug}`
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, name: t(product.name, "zh"), description: t(product.summary, "zh"), url, image: product.images.map(x => x.src), model: product.code, manufacturer: { "@id": `${siteConfig.siteUrl}/#organization` }, inLanguage: "zh-CN" }
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><section className="border-b bg-secondary/40"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-16"><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm border bg-[#f7f9fa] p-6 sm:p-10"><Image src={product.images[0].src} alt={`${t(product.name, "zh")}产品图片`} width={720} height={540} className="h-auto max-h-[30rem] w-[78%] max-w-[28rem] object-contain sm:w-[72%]" /></div><div><Link href="/zh/products" className="text-sm text-muted-foreground hover:text-primary">产品 / {t(product.categoryLabel, "zh")}</Link><p className="mt-6 text-sm font-semibold tracking-wider text-primary">{product.code}</p><h1 className="mt-2 text-balance text-4xl font-semibold sm:text-5xl">{t(product.name, "zh")}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{t(product.summary, "zh")}</p><div className="mt-6 flex flex-wrap gap-2">{product.materials.map(x => <span key={x} className="rounded-sm border bg-background px-3 py-1 text-sm">{technicalZh(x)}</span>)}</div><Link href="#rfq" className="mt-8 inline-block rounded-sm bg-primary px-5 py-3 font-semibold text-primary-foreground">咨询该产品配置</Link></div></div></section><section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8"><div><h2 className="text-2xl font-semibold">产品概述</h2>{product.description.map((x, i) => <p key={i} className="mt-4 leading-7 text-muted-foreground">{t(x, "zh")}</p>)}<h2 className="mt-10 text-2xl font-semibold">规格参数</h2><dl className="mt-4 divide-y rounded-sm border">{product.specs.map(x => <div key={x.label} className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-4 p-4"><dt className="font-medium">{technicalZh(x.label)}</dt><dd className="text-muted-foreground">{technicalZh(x.value)}</dd></div>)}</dl><Link href="/zh/catalogue" className="mt-8 inline-block font-semibold text-primary">查阅完整选型手册 →</Link></div><div id="rfq" className="h-fit rounded-sm border bg-card p-6 shadow-sm lg:sticky lg:top-28"><h2 className="text-2xl font-semibold">发送询盘</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">请提供物料、产能、温度与压力及连接尺寸，以便沟通配置。</p><div className="mt-6"><RfqForm locale="zh" defaultTopic={product.slug} productOptions={options} /></div></div></section></main>
}
