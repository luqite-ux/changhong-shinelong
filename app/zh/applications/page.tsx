import Link from "next/link"
import { Boxes, Factory, FlaskConical, Leaf, Pill, Wheat } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { SelectionFlow } from "@/components/selection-flow"
import { bilingualAlternates } from "@/lib/locale"

export const metadata = { title: "应用领域", description: "旋转阀与输送设备在粮食、食品、饲料、化工、制药和新能源等领域的应用。", alternates: bilingualAlternates("/applications", "zh") }

const areas = [
  { name: "粮食", description: "用于粮仓、料斗及干燥线下方的计量与气锁排料，可结合物料和现场布局配置旋转阀及螺旋输送机。" },
  { name: "食品", description: "为食品相关散装物料输送线提供易清洁的不锈钢旋转阀与输送设备配置。" },
  { name: "饲料", description: "用于饲料生产中的排料、输送及除尘工位。" },
  { name: "化工", description: "围绕化工粉体的物料特性、密封与运行条件配置旋转阀和破碎阀。" },
  { name: "石化", description: "面向石化工艺的物料排放工位，可选加强型和多出料口旋转阀。" },
  { name: "制药", description: "针对制药物料输送，选择便于清洁的不锈钢旋转阀结构。" },
  { name: "干燥", description: "根据干燥线排料工位的温度条件选择旋转阀。" },
  { name: "环保", description: "为环保处理工艺中的物料排放与输送提供旋转阀和螺旋输送机。" },
  { name: "除尘", description: "旋转阀可用于旋风分离器和除尘料斗下方，选型时关注气密性。" },
  { name: "新能源", description: "包括锂电材料处理在内的新能源物料生产线，可按工况选择衬里或钛合金型配置。" },
]
const icons = [Wheat, Boxes, FlaskConical, Factory, Pill, Leaf]

export default function ChineseApplicationsPage() {
  return <><PageHero title="应用领域" description="根据物料特性与工况，为不同行业选择合适的设备配置。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2">{areas.map((area, i) => { const Icon = icons[i % icons.length]; return <Reveal key={area.name} className="rounded-sm border bg-card p-6"><div className="inline-flex rounded-sm bg-accent p-3"><Icon className="size-7 text-primary" aria-hidden="true" /></div><h2 className="mt-5 text-xl font-semibold">{area.name}</h2><p className="mt-3 leading-7 text-muted-foreground">{area.description}</p></Reveal> })}</div><section className="mt-20 border-t pt-16"><p className="text-sm font-semibold text-primary">选型指南</p><h2 className="mt-2 text-3xl font-semibold">从运行条件出发</h2><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">选型应先确认工况，再确定型号。请提供以下五项信息，以便缩小产品系列与配置范围。</p><div className="mt-10 rounded-sm border bg-secondary/35 p-6 sm:p-8"><SelectionFlow locale="zh" /></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[{ title: "旋转排料与气锁", text: "适用于料斗、料仓、干燥线和除尘设备的受控排料。", href: "/zh/products/tgf" }, { title: "按物料特性配置", text: "可结合清洁要求、磨蚀性、粘性和温度选择衬里或特殊材质。", href: "/zh/products/qnlzgfwf" }, { title: "输送与破碎", text: "面向物料输送和结块物料在线破碎等不同工况。", href: "/zh/products/screw-conveyor" }].map(item => <article key={item.title} className="flex h-full flex-col rounded-sm border bg-card p-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 flex-1 leading-7 text-muted-foreground">{item.text}</p><Link href={item.href} className="mt-6 font-semibold text-primary">查看相关产品 →</Link></article>)}</div><Link href="/zh/contact#rfq" className="mt-10 inline-block rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">提交工况信息</Link></section></main></>
}
