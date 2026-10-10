import { FactoryVideo } from "@/components/factory-video"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { bilingualAlternates } from "@/lib/locale"

export const metadata = { title: "生产制造", description: "了解常宏祥隆在常州的机加工、焊接、装配、检验与仓储流程。", alternates: bilingualAlternates("/manufacturing", "zh") }
const areas = [
  { name: "机加工", description: "加工转子、阀体和轴类部件。" },
  { name: "打磨与焊接", description: "对阀体结构件进行打磨和焊接。" },
  { name: "装配", description: "组装转子、轴承、密封件和驱动装置。" },
  { name: "检验", description: "出货前检查尺寸及设备功能。" },
  { name: "仓储", description: "存放和安排成品、半成品的发运。" },
]
export default function ChineseManufacturingPage() {
  return <><PageHero title="生产制造" description="机加工、焊接、装配和检验环节围绕生产流程有序衔接。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><FactoryVideo src="/media/factory-tour-focused.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="常宏祥隆生产车间" locale="zh" /><div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{areas.map(area => <Reveal key={area.name} className="rounded-sm border bg-card p-5"><h2 className="font-semibold">{area.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{area.description}</p></Reveal>)}</div></main></>
}
