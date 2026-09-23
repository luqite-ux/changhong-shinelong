import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { SelectionFlow } from "@/components/selection-flow"

const selectionInputs = [
  "Material type, particle size and abrasiveness",
  "Required throughput and operating cycle",
  "Temperature, pressure and air-seal requirement",
  "Inlet, outlet and available installation space",
  "Discharge, metering, crushing or transfer duty",
  "Motor power, mounting and control preference",
]

const recommendationPaths = [
  {
    eyebrow: "Controlled discharge",
    title: "Rotary valve and airlock duty",
    description: "For hopper, silo, drying-line and dust-collection discharge where controlled flow and a consistent air seal matter.",
    families: "TGF · ZGF · ZGC · BZ family",
    href: "/products/tgf",
    image: "/images/ai-products/tgf.png",
    alt: "TGF rotary valve for controlled discharge",
  },
  {
    eyebrow: "Clean or demanding materials",
    title: "Material-specific valve construction",
    description: "For food-adjacent, pharmaceutical, chemical and new-energy materials requiring cleanable, lined or special-alloy configurations.",
    families: "ZGP · QNLZGFWF · TAZGFWF",
    href: "/products/qnlzgfwf",
    image: "/images/ai-products/qnlzgfwf.png",
    alt: "Lined rotary valve for demanding materials",
  },
  {
    eyebrow: "Transfer and size reduction",
    title: "Conveying or crushing duty",
    description: "For horizontal material transfer, feed handling and applications that need conveying or controlled size reduction before discharge.",
    families: "Screw conveyor · Electric crushing valve",
    href: "/products/screw-conveyor",
    image: "/images/ai-products/screw-conveyor.png",
    alt: "Industrial screw conveyor for material transfer",
  },
]

export function ApplicationSelectionGuide() {
  return (
    <section className="mt-20 border-t pt-16" id="selection-guide">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Selection guide</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold sm:text-4xl">Start with the operating conditions</h2>
        </div>
        <p className="max-w-2xl leading-7 text-muted-foreground">
          A useful recommendation starts with the duty point, not a model number. Share the following information so the product family and configuration can be narrowed efficiently.
        </p>
      </div>

      <div className="mt-10 rounded-sm border bg-secondary/35 p-6 sm:p-8">
        <SelectionFlow />
        <div className="mt-8 grid gap-x-8 gap-y-3 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {selectionInputs.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Recommendation paths</p>
          <h2 className="mt-2 text-3xl font-semibold">Match the duty to a product family</h2>
        </div>
        <Link href="/contact#rfq" className="hidden text-sm font-semibold text-foreground hover:text-primary sm:inline-flex">Send operating data →</Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {recommendationPaths.map((path) => (
          <article key={path.title} className="group flex h-full flex-col overflow-hidden rounded-sm border bg-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f6f7] p-3">
              <Image src={path.image} alt={path.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.018]" />
            </div>
            <div className="flex flex-1 flex-col border-t p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{path.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold">{path.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.description}</p>
              <p className="mt-4 text-sm font-medium text-foreground">{path.families}</p>
              <Link href={path.href} className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-foreground hover:text-primary">
                View suitable families <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-sm bg-graphite px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8">
        <div>
          <h3 className="text-xl font-semibold">Need help narrowing the configuration?</h3>
          <p className="mt-1 text-sm text-white/75">Send the material, capacity, pressure and connection details for a focused response.</p>
        </div>
        <Link href="/contact#rfq" className="inline-flex min-h-11 items-center rounded-sm bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-technical-cyan-light">Request selection support</Link>
      </div>
    </section>
  )
}
