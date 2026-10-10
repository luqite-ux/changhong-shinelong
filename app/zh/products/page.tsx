import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/products-db"
import { bilingualAlternates } from "@/lib/locale"

export const revalidate = 60
export const metadata = { title: "产品中心", description: "浏览常宏祥隆的旋转阀、螺旋输送机及电动破碎阀产品系列。", alternates: bilingualAlternates("/products", "zh") }

export default async function ChineseProductsPage() {
  const products = await getProducts()
  return <><PageHero title="产品中心" description="面向大宗物料排放、计量和输送工况的旋转阀、螺旋输送机与电动破碎阀。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-10 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl leading-7 text-muted-foreground">选择产品系列查看配置，或在选型手册中查阅型号说明、尺寸图及规格表。</p><Link href="/zh/catalogue" className="rounded-sm border px-4 py-2 font-medium hover:border-primary hover:bg-secondary">查看选型手册</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(p => <ProductCard key={p.slug} product={p} locale="zh" />)}</div></main></>
}
