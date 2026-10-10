import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { bilingualAlternates } from "@/lib/locale"
import { siteConfig } from "@/lib/site-config"

export const metadata = { title: "关于我们", description: "了解常州市常宏祥隆机械科技有限公司的产品、应用领域和生产场地。", alternates: bilingualAlternates("/about", "zh") }
export default function ChineseAboutPage() {
  return <><PageHero title="关于常宏祥隆" description="专注旋转阀、气锁、螺旋输送机及电动破碎阀。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr]"><div><p className="text-sm font-semibold text-primary">围绕工况组织生产</p><h2 className="mt-2 text-3xl font-semibold">根据物料处理需求配置设备</h2><p className="mt-5 max-w-xl leading-8 text-muted-foreground">{siteConfig.legalNameZh}专业生产旋转阀／气锁、螺旋输送机以及电动破碎阀，至今已有20年的历史。产品用于粮食、食品、饲料、化工、石化、制药、干燥、环保、除尘及新能源领域。</p><p className="mt-4 max-w-xl leading-8 text-muted-foreground">公司位于江苏常州，生产场地约 {siteConfig.siteAreaSqm.toLocaleString()} 平方米，设有机加工、打磨焊接、装配、检验和仓储区域。</p><dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6">{[["生产经验", "20 年"], ["生产场地", `${siteConfig.siteAreaSqm.toLocaleString()} 平方米`], ["月产能", `${siteConfig.monthlyCapacityUnits} 台`], ["最小起订量", `${siteConfig.moqUnits} 台`]].map(([label, value]) => <div key={label} className="border-l-2 border-primary pl-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 text-xl font-semibold">{value}</dd></div>)}</dl></div><div className="relative overflow-hidden rounded-sm bg-secondary"><Image src="/images/ai-facility/facility-entrance.png" alt="常宏祥隆常州生产场地入口" width={1000} height={750} className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-0 left-0 bg-graphite/90 px-5 py-3 text-sm font-medium text-white">中国江苏常州</div></div></div></main></>
}
