import Image from "next/image"
import media from "@/lib/customer-media-manifest.json"
import { PageHero } from "@/components/page-hero"
import { bilingualAlternates } from "@/lib/locale"

export const metadata = { title: "选型手册", description: "查阅旋转阀型号说明、尺寸图、规格表及应用选型资料。", alternates: bilingualAlternates("/catalogue", "zh") }
export default function ChineseCataloguePage() {
  const pages = media.filter(item => item.semantic_destination === "selection-catalogue-reader")
  const cover = media.filter(item => item.semantic_destination === "selection-catalogue-cover")
  return <><PageHero title="选型手册" description="集中查阅型号说明、工程图、规格参数表和应用选型参考资料。" /><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">{cover.length > 0 && <section className="mb-14"><h2 className="mb-5 text-2xl font-semibold">手册封面</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cover.map(item => <Image key={item.id} id={`media-${item.id}`} src={item.src} alt="常宏祥隆选型手册封面" width={900} height={700} className="max-h-96 h-auto w-full rounded-sm border bg-white object-contain p-4" />)}</div></section>}<section><div className="mb-6 flex items-end justify-between gap-4 border-b pb-4"><h2 className="text-2xl font-semibold sm:text-3xl">完整手册</h2><p className="text-sm text-muted-foreground">共 {pages.length} 页</p></div><div className="grid gap-6 lg:grid-cols-2">{pages.map((item, i) => <figure id={`media-${item.id}`} key={item.id} className="scroll-mt-24 overflow-hidden rounded-sm border bg-card"><div className="bg-white p-3"><Image src={item.src} alt={`选型手册第 ${i + 1} 页`} width={1600} height={1000} className="h-auto w-full object-contain" /></div><figcaption className="border-t p-4 text-sm font-medium">选型手册 · 第 {i + 1} 页</figcaption></figure>)}</div></section></main></>
}
