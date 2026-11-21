import Link from "next/link"
import { Boxes, Factory, FlaskConical, Leaf, Pill, Wheat } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { SelectionFlow } from "@/components/selection-flow"
import { multilingualAlternates } from "@/lib/locale"

export const metadata = { title: "Области применения", description: "Оборудование для пищевой, кормовой, химической, фармацевтической и других отраслей.", alternates: multilingualAlternates("/applications", "ru") }
const areas = [
  ["Зерно и корма", "Контролируемая выгрузка и дозирование зерна, кормовых компонентов и порошков."],
  ["Пищевая промышленность", "Конфигурации с учётом требований к чистоте, материалам и обслуживанию."],
  ["Химическая и нефтехимическая промышленность", "Подбор исполнения по температуре, давлению, абразивности и коррозионной среде."],
  ["Фармацевтика", "Решения для перемещения порошков с учётом требований технологической линии."],
  ["Сушка и пылеулавливание", "Роторная выгрузка для бункеров, сушильных линий и пылеулавливающего оборудования."],
  ["Новая энергетика", "Конфигурации для порошковых материалов аккумуляторных и смежных производств."],
] as const
const icons = [Wheat, Boxes, FlaskConical, Pill, Factory, Leaf]
export default function RussianApplicationsPage() { return <><PageHero title="Области применения" description="Подбор оборудования по свойствам материала и рабочим условиям." /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2">{areas.map(([name, description], index) => { const Icon = icons[index]; return <Reveal key={name} className="rounded-sm border bg-card p-6"><div className="inline-flex rounded-sm bg-accent p-3"><Icon className="size-7 text-primary" aria-hidden="true" /></div><h2 className="mt-5 text-xl font-semibold">{name}</h2><p className="mt-3 leading-7 text-muted-foreground">{description}</p></Reveal> })}</div><section className="mt-20 border-t pt-16"><p className="text-sm font-semibold text-primary">Данные для подбора</p><h2 className="mt-2 text-3xl font-semibold">Начните с рабочих условий</h2><div className="mt-10 rounded-sm border bg-secondary/35 p-6 sm:p-8"><SelectionFlow locale="ru" /></div><Link href="/ru/contact#rfq" className="mt-10 inline-block rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">Передать исходные данные</Link></section></main></> }
