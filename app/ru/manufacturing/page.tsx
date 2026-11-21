import { FactoryVideo } from "@/components/factory-video"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { multilingualAlternates } from "@/lib/locale"

export const metadata = { title: "Производство", description: "Механическая обработка, сварка, сборка, контроль и складские операции в Чанчжоу.", alternates: multilingualAlternates("/manufacturing", "ru") }
const areas = [["Механическая обработка", "Изготовление деталей и подготовка узлов."], ["Сварка и зачистка", "Сварочные работы и подготовка поверхностей."], ["Сборка", "Сборка корпуса, ротора, привода и присоединительных элементов."], ["Контроль", "Проверка готовой продукции перед отгрузкой."], ["Склад", "Хранение материалов и готовой продукции."]] as const
export default function RussianManufacturingPage() { return <><PageHero title="Производство" description="Последовательный процесс от обработки деталей до сборки и контроля." /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><FactoryVideo src="/media/factory-tour-focused.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="Производственный цех Chanhong ShineLong" locale="ru" /><div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{areas.map(([name, description]) => <Reveal key={name} className="rounded-sm border bg-card p-5"><h2 className="font-semibold">{name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Reveal>)}</div></main></> }
