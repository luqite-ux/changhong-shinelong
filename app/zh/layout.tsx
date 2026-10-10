import type { Metadata } from "next"
import { bilingualAlternates } from "@/lib/locale"

export const metadata: Metadata = {
  title: { default: "常宏祥隆｜旋转阀、螺旋输送机与电动破碎阀", template: "%s｜常宏祥隆" },
  description: "常州市常宏祥隆机械科技有限公司生产旋转阀、螺旋输送机和电动破碎阀，面向大宗物料排放、计量与输送应用。",
  alternates: bilingualAlternates("/", "zh"),
  openGraph: { locale: "zh_CN", url: "/zh", title: "常宏祥隆｜大宗物料处理设备", description: "旋转阀、螺旋输送机和电动破碎阀。" },
}

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return children
}
