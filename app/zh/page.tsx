import Image from "next/image"
import Link from "next/link"
import { Boxes, Gauge, Settings2, ShieldCheck } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { FactoryVideo } from "@/components/factory-video"
import { SelectionFlow } from "@/components/selection-flow"
import { Reveal } from "@/components/reveal"
import { getProducts } from "@/lib/products-db"
import { bilingualAlternates } from "@/lib/locale"

export const revalidate = 60
export const metadata = {
  title: { absolute: "常宏祥隆｜旋转阀、螺旋输送机与电动破碎阀" },
  description: "常宏祥隆提供旋转阀、螺旋输送机和电动破碎阀，围绕物料特性、产能、温度与压力配置设备。",
  alternates: bilingualAlternates("/", "zh"),
}

const slides = [
  { id: "products", tone: "light" as const, eyebrow: "大宗物料处理", heading: "围绕物料与工况配置旋转阀", description: "旋转阀、螺旋输送机及电动破碎阀，服务于排料、计量和输送工况。", ctaLabel: "查看产品", ctaHref: "/zh/products", image: { src: "/images/ai-banners/product-family-hero-v2.png", alt: "旋转阀与输送设备产品组合" }, mobileImage: { src: "/images/ai-products/bzgfwk.png", alt: "工业旋转阀" } },
  { id: "factory", eyebrow: "生产制造", heading: "从机加工、焊接到装配与检验", description: "常州生产场地设有机加工、打磨焊接、装配、检验和仓储区域。", ctaLabel: "了解生产", ctaHref: "/zh/manufacturing", image: { src: "/images/ai-banners/manufacturing-capability-hero.png", alt: "常宏祥隆生产区域" }, mobileImage: { src: "/images/ai-facility/production-floor-overview.png", alt: "生产车间" } },
  { id: "selection", eyebrow: "按工况选型", heading: "从物料、产能和运行条件开始", description: "提供工况信息后，可进一步确认合适的产品系列与配置。", ctaLabel: "咨询选型", ctaHref: "/zh/contact#rfq", image: { src: "/images/ai-banners/selection-support-hero.png", alt: "螺旋输送机与电动破碎阀" }, mobileImage: { src: "/images/ai-products/screw-conveyor.png", alt: "工业螺旋输送机" } },
]

const capabilities = [
  { title: "材质选项", text: "可按工况选择铸铁、碳钢或不锈钢结构。", icon: Boxes },
  { title: "耐磨衬里", text: "针对特定物料可选尼龙、陶瓷衬里及钛合金方案。", icon: ShieldCheck },
  { title: "工况匹配", text: "容量、温度、压力和转速是选型的重要依据。", icon: Gauge },
  { title: "连接细节", text: "进料口、出料口、驱动接口及安装接口均按项目要求确认。", icon: Settings2 },
]

export default async function ChineseHome() {
  const products = await getProducts()
  return <>
    <HeroCarousel slides={slides} locale="zh" />
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold text-primary">产品系列</p><h2 className="mt-2 text-3xl font-semibold">大宗物料流量控制解决方案</h2></div><Link href="/zh/products" className="hidden font-medium sm:block">查看全部产品 →</Link></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map(p => <ProductCard key={p.slug} product={p} locale="zh" />)}</div>
    </Reveal>
    <Reveal as="section" className="border-y border-border bg-secondary/40"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8"><div><p className="text-sm font-semibold text-primary">生产制造</p><h2 className="mt-2 text-3xl font-semibold">从机加工到最终检验的生产流程</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">机加工、打磨焊接、装配、检验及仓储环节在常州生产场地有序衔接。</p><div className="mt-8 grid grid-cols-2 gap-4">{["5 个生产区域", "月产能 500 台", "6,000 平方米场地", "OEM / ODM"].map(label => <div key={label} className="rounded-sm border bg-background p-4 text-sm font-medium">{label}</div>)}</div></div><FactoryVideo src="/media/factory-tour-focused.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="常宏祥隆生产车间" locale="zh" /></div></Reveal>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-primary">选型路径</p><h2 className="mt-2 text-3xl font-semibold">精准推荐所需的五项参数</h2><div className="mt-10"><SelectionFlow locale="zh" /></div></Reveal>
    <section className="bg-graphite text-white"><Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-cyan-300">应用领域</p><h2 className="mt-3 text-3xl font-semibold">按物料与工况选择设备</h2><p className="mt-4 max-w-3xl leading-7 text-white/75">产品应用涉及粮食、食品、饲料、化工、石化、制药、干燥、环保、除尘和新能源等领域。具体结构与配置应结合物料特性确认。</p><Link href="/zh/applications" className="mt-7 inline-block rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">查看应用领域 →</Link></Reveal></section>
    <Reveal as="section" className="bg-[#f3f6f7]"><div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8"><div className="relative overflow-hidden"><Image src="/images/ai-products/qnlzgfwf.png" alt="衬里旋转阀配置" width={1450} height={1086} className="h-auto w-full object-contain" /><span className="absolute bottom-0 left-0 bg-graphite px-5 py-3 text-sm text-white">图示配置：衬里旋转阀</span></div><div><p className="text-sm font-semibold text-primary">配置能力</p><h2 className="mt-3 text-3xl font-semibold">先确认工况，再选择设备</h2><p className="mt-5 leading-7 text-muted-foreground">物料特性、温度、压力和连接尺寸影响阀体、转子、衬里及驱动方案。</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{capabilities.map(({ title, text, icon: Icon }) => <div key={title} className="border-l-2 border-primary bg-white p-5"><Icon aria-hidden="true" className="size-6 text-primary" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div><Link href="/zh/applications" className="mt-8 inline-block font-semibold text-primary">查看应用路径 →</Link></div></div></Reveal>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="grid items-center gap-10 lg:grid-cols-2"><div><p className="text-sm font-semibold text-primary">关于常宏祥隆</p><h2 className="mt-3 text-3xl font-semibold">以工况需求为基础提供设备配置</h2><p className="mt-5 leading-8 text-muted-foreground">常州市常宏祥隆机械科技有限公司专业生产旋转阀／气锁、螺旋输送机及电动破碎阀，至今已有20年的历史。产品应用于粮食、食品、饲料、化工、石化、制药、干燥、环保、除尘及新能源领域。</p><Link href="/zh/about" className="mt-7 inline-block font-semibold text-primary">了解公司 →</Link></div><Image src="/images/ai-facility/facility-entrance.png" alt="常宏祥隆常州生产场地" width={1000} height={750} className="h-auto w-full rounded-sm object-cover" /></div></Reveal>
    <section className="bg-graphite text-white"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8"><div><h2 className="text-3xl font-semibold">沟通您的物料处理需求</h2><p className="mt-2 text-white/75">请提供物料、产能、温度与压力及连接尺寸。</p></div><Link href="/zh/contact#rfq" className="rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">获取报价</Link></div></section>
  </>
}
