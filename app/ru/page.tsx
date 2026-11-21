import Link from "next/link"
import { FactoryVideo } from "@/components/factory-video"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { SelectionFlow } from "@/components/selection-flow"
import { getProducts } from "@/lib/products-db"

const slides = [
  { id: "products", tone: "light" as const, eyebrow: "Оборудование для сыпучих материалов", heading: "Роторные питатели с учётом свойств материала и условий процесса", description: "Линейка оборудования для контролируемой выгрузки, транспортировки и дробления.", ctaLabel: "Смотреть продукцию", ctaHref: "/ru/products", image: { src: "/images/ai-banners/product-family-hero-v2.png", alt: "Роторные питатели и транспортирующее оборудование" }, mobileImage: { src: "/images/ai-products/bzgfwk.png", alt: "Промышленный роторный питатель" } },
  { id: "factory", eyebrow: "Производственные возможности", heading: "Механическая обработка, сварка, сборка и контроль", description: "Производственная площадка площадью 6 000 м² в Чанчжоу включает пять рабочих зон.", ctaLabel: "О производстве", ctaHref: "/ru/manufacturing", image: { src: "/images/ai-banners/manufacturing-capability-hero.png", alt: "Производственный цех Chanhong ShineLong" }, mobileImage: { src: "/images/ai-facility/production-floor-overview.png", alt: "Производственный цех" } },
  { id: "selection", eyebrow: "Подбор по условиям эксплуатации", heading: "Начните с материала, производительности и рабочих условий", description: "Передайте исходные данные, чтобы определить подходящую серию и комплектацию.", ctaLabel: "Получить помощь с подбором", ctaHref: "/ru/contact#rfq", image: { src: "/images/ai-banners/selection-support-hero.png", alt: "Шнековый конвейер и дробильный затвор" }, mobileImage: { src: "/images/ai-products/screw-conveyor.png", alt: "Промышленный шнековый конвейер" } },
]

export default async function RussianHomePage() {
  const products = await getProducts()
  return <>
    <HeroCarousel slides={slides} locale="ru" />
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold text-primary">Серии продукции</p><h2 className="mt-2 text-3xl font-semibold">Контролируемое перемещение сыпучих материалов</h2></div><Link href="/ru/products" className="hidden font-medium sm:block">Вся продукция →</Link></div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map(product => <ProductCard key={product.slug} product={product} locale="ru" />)}</div></Reveal>
    <Reveal as="section" className="border-y bg-secondary/40"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8"><div><p className="text-sm font-semibold text-primary">Производство</p><h2 className="mt-2 text-3xl font-semibold">Единый процесс от обработки до финального контроля</h2><p className="mt-4 leading-7 text-muted-foreground">Механическая обработка, сварка, сборка, контроль и складские операции организованы на площадке в Чанчжоу.</p><div className="mt-8 grid grid-cols-2 gap-4">{["5 производственных зон", "500 единиц в месяц", "Площадь 6 000 м²", "OEM / ODM"].map(item => <div key={item} className="rounded-sm border bg-background p-4 text-sm font-medium">{item}</div>)}</div></div><FactoryVideo src="/media/factory-tour-focused.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="Производственный цех Chanhong ShineLong" locale="ru" /></div></Reveal>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-primary">Порядок подбора</p><h2 className="mt-2 text-3xl font-semibold">Пять исходных параметров для подбора оборудования</h2><div className="mt-10"><SelectionFlow locale="ru" /></div></Reveal>
    <section className="bg-graphite text-white"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8"><div><h2 className="text-3xl font-semibold">Обсудим вашу задачу по работе с материалом</h2><p className="mt-2 text-white/75">Укажите материал, производительность, температуру, давление и присоединительные размеры.</p></div><Link href="/ru/contact#rfq" className="rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">Отправить запрос</Link></div></section>
  </>
}
