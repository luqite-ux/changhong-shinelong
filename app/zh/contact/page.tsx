import { Mail, MapPin, Phone } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { RfqForm } from "@/components/rfq-form"
import { getProducts } from "@/lib/products-db"
import { siteConfig } from "@/lib/site-config"
import { t } from "@/lib/types"
import { bilingualAlternates } from "@/lib/locale"

export const metadata = { title: "联系我们与询价", description: "提交物料、产能、温度与压力、连接尺寸等信息，沟通设备选型。", alternates: bilingualAlternates("/contact", "zh") }
export default async function ChineseContactPage() {
  const options = (await getProducts()).map(p => ({ slug: p.slug, label: `${p.code} — ${t(p.name, "zh")}` }))
  return <><PageHero title="联系我们与询价" description="请说明物料特性、运行条件和目标产能，以便沟通设备配置。" /><main className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><aside><h2 className="text-2xl font-semibold">联系方式</h2><div className="mt-6 space-y-5 text-muted-foreground"><p className="flex gap-3"><Phone className="size-5 text-primary" /><a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a></p><p className="flex gap-3"><Mail className="size-5 text-primary" /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p><p className="flex gap-3"><MapPin className="size-5 shrink-0 text-primary" /><span>{siteConfig.addressZh}</span></p></div></aside><section id="rfq" className="rounded-sm border bg-card p-6 sm:p-8"><h2 className="text-2xl font-semibold">提交询价</h2><p className="mb-8 mt-2 text-muted-foreground">请填写以下信息；浏览器标记的字段为必填项。</p><RfqForm locale="zh" productOptions={options} /></section></main></>
}
