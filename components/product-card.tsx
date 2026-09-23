import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { ProductFamily } from "@/lib/types"
import { t } from "@/lib/types"

export function ProductCard({ product }: { product: ProductFamily }) {
  const cover = product.images[0]
  const darkStage = /bzgfwf|bzgfwk|qnlzgfwf|tazgfwf|electric-crushing|screw-conveyor/.test(product.slug)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_rgba(15,23,42,.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${darkStage ? "bg-[#111820]" : "bg-[#f7f9fa]"}`}>
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(44,164,200,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(44,164,200,.09)_1px,transparent_1px)] [background-size:30px_30px]" />
        <Image
          src={cover.src || "/placeholder.svg"}
          alt={cover.alt}
          width={320}
          height={240}
          className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]"
        />
        {cover.status === "pending" && (
          <span className="absolute left-2 top-2 rounded-sm bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            Visual pending
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-border p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">{product.code}</span>
        <h3 className="text-base font-semibold text-foreground">{t(product.name)}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{t(product.summary)}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground">
          View specifications
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
