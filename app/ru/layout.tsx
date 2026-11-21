import type { Metadata } from "next"
import { multilingualAlternates } from "@/lib/locale"

export const metadata: Metadata = {
  title: { default: "Chanhong ShineLong | Оборудование для сыпучих материалов", template: "%s | Chanhong ShineLong" },
  description: "Роторные питатели, шлюзовые затворы, шнековые конвейеры и электрические дробильные затворы для промышленных линий.",
  alternates: multilingualAlternates("/", "ru"),
  openGraph: { locale: "ru_RU", url: "/ru", title: "Chanhong ShineLong | Оборудование для сыпучих материалов", description: "Промышленное оборудование для контролируемой выгрузки, транспортировки и дробления сыпучих материалов." },
}

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return children
}
