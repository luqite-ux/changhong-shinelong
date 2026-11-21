import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/products-db"
import { multilingualAlternates } from "@/lib/locale"

export const metadata = { title: "Промышленные роторные питатели и конвейеры", description: "Роторные питатели, шнековые конвейеры и электрические дробильные затворы.", alternates: multilingualAlternates("/products", "ru") }
export const revalidate = 60
export default async function RussianProductsPage() { const products = await getProducts(); return <><PageHero title="Продукция" description="Оборудование для контролируемой выгрузки, дозирования, транспортировки и дробления сыпучих материалов." /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-10 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl leading-7 text-muted-foreground">Выберите серию продукции или откройте каталог с чертежами и таблицами размеров.</p><Link href="/ru/catalogue" className="rounded-sm border px-4 py-2 font-medium hover:border-primary hover:bg-secondary">Открыть каталог</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <ProductCard key={product.slug} product={product} locale="ru" />)}</div></main></> }
