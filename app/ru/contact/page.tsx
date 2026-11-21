import { Mail, MapPin, Phone } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { RfqForm } from "@/components/rfq-form"
import { getProducts } from "@/lib/products-db"
import { multilingualAlternates } from "@/lib/locale"
import { siteConfig } from "@/lib/site-config"
import { t } from "@/lib/types"

export const metadata = { title: "Контакты и запрос предложения", description: "Передайте данные о материале, производительности и рабочих условиях для подбора оборудования.", alternates: multilingualAlternates("/contact", "ru") }
export default async function RussianContactPage() { const options = (await getProducts()).map(product => ({ slug: product.slug, label: `${product.code} — ${t(product.name, "ru")}` })); return <><PageHero title="Контакты и запрос предложения" description="Опишите материал, рабочие условия и требуемую производительность." /><main className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><aside><h2 className="text-2xl font-semibold">Контактные данные</h2><div className="mt-6 space-y-5 text-muted-foreground"><p className="flex gap-3"><Phone className="size-5 text-primary" /><a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a></p><p className="flex gap-3"><Mail className="size-5 text-primary" /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p><p className="flex gap-3"><MapPin className="size-5 shrink-0 text-primary" /><span>{siteConfig.addressRu}</span></p></div></aside><section id="rfq" className="rounded-sm border bg-card p-6 sm:p-8"><h2 className="text-2xl font-semibold">Отправить запрос</h2><p className="mb-8 mt-2 text-muted-foreground">Поля, отмеченные браузером, обязательны для заполнения.</p><RfqForm locale="ru" productOptions={options} /></section></main></> }
