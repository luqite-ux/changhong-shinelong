import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BatteryCharging,
  Beaker,
  Boxes,
  Factory,
  FlaskConical,
  Gauge,
  PackageCheck,
  Pill,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Sprout,
  Utensils,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { siteConfig } from "@/lib/site-config"

const industries = [
  { label: "Grain & feed", note: "Controlled discharge beneath bins, hoppers and dust collectors.", icon: Sprout },
  { label: "Food processing", note: "Material-contact configurations for powders and granular ingredients.", icon: Utensils },
  { label: "Chemical processing", note: "Selection around material behavior, sealing and operating conditions.", icon: Beaker },
  { label: "Pharmaceutical", note: "Cleanable configurations for demanding powder-handling duties.", icon: Pill },
  { label: "Environmental systems", note: "Rotary discharge and transfer for dust-collection processes.", icon: Factory },
  { label: "New energy", note: "Wear-conscious handling options for battery-material production lines.", icon: BatteryCharging },
]

const capabilities = [
  { title: "Material options", text: "Cast iron, carbon steel and stainless-steel configurations.", icon: Boxes },
  { title: "Wear protection", text: "Nylon, ceramic and titanium-alloy variants for specific duties.", icon: ShieldCheck },
  { title: "Duty-point matching", text: "Capacity, temperature, pressure and speed guide the selection.", icon: Gauge },
  { title: "Connection details", text: "Inlet, outlet, drive and installation interfaces are confirmed per project.", icon: Settings2 },
]

const evidence = [
  { src: "/images/ai-facility/raw-materials-machining.png", alt: "Prepared metal components in the machining area", label: "Machining preparation" },
  { src: "/images/ai-facility/inspection-quality-check.png", alt: "Finished rotary valve units prepared for inspection", label: "Finished-unit inspection" },
  { src: "/images/ai-facility/packing-dispatch.png", alt: "Industrial equipment prepared for packing and dispatch", label: "Packing and dispatch" },
]

const selectionInputs = ["Material and particle characteristics", "Required throughput", "Operating temperature and pressure", "Connection dimensions", "Drive and control preference"]

export function HomeBuyerSections() {
  return (
    <>
      <section id="application-industries" className="bg-graphite text-white">
        <Reveal>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Application industries</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">One product platform, configured around different materials</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-white/70 lg:justify-self-end">Our rotary valves and conveying equipment are selected around the process duty—not just a model number.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(({ label, note, icon: Icon }) => (
              <div key={label} className="bg-graphite p-6 transition-colors hover:bg-white/[0.06] sm:p-7">
                <Icon aria-hidden="true" className="size-7 text-cyan-300" strokeWidth={1.6} />
                <h3 className="mt-6 text-lg font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{note}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      <section id="configuration-capability" className="border-b border-border bg-[#f3f6f7]">
        <Reveal>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div data-product-image-stage="full-bleed" className="relative overflow-hidden">
            <Image src="/images/ai-products/qnlzgfwf.png" alt="Lined rotary valve configuration" width={1450} height={1086} className="block h-auto w-full object-contain" />
            <div className="absolute bottom-0 left-0 bg-graphite px-5 py-3 text-sm font-medium text-white">Configuration shown: lined rotary valve</div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Configuration capability</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">Define the duty point before choosing the equipment</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Material behavior, process temperature, pressure and connection dimensions determine the appropriate body, rotor, lining and drive arrangement.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {capabilities.map(({ title, text, icon: Icon }) => (
                <div key={title} className="border-l-2 border-primary bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                  <Icon aria-hidden="true" className="size-6 text-primary" strokeWidth={1.7} />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
            <Link href="/applications" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline">Review application paths <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        </Reveal>
      </section>

      <section id="manufacturing-evidence">
        <Reveal className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Manufacturing evidence</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">Visible checkpoints across the production workflow</h2>
          </div>
          <Link href="/manufacturing" className="inline-flex items-center gap-2 font-semibold hover:text-primary">Explore manufacturing <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <figure className="group relative overflow-hidden rounded-sm bg-secondary">
            <Image src={evidence[0].src} alt={evidence[0].alt} width={1200} height={820} className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-5 pt-16 text-lg font-semibold text-white">{evidence[0].label}</figcaption>
          </figure>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {evidence.slice(1).map((item) => (
              <figure key={item.label} className="group relative overflow-hidden rounded-sm bg-secondary">
                <Image src={item.src} alt={item.alt} width={900} height={520} className="aspect-[16/9] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-12 font-semibold text-white">{item.label}</figcaption>
              </figure>
            ))}
          </div>
          </div>
        </Reveal>
      </section>

      <section id="selection-resources" className="border-y border-border bg-cyan-50/60">
        <Reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Selection resources</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold sm:text-4xl">Prepare the key inputs before requesting a configuration</h2>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">A focused enquiry helps narrow the valve type, size, material and drive arrangement more efficiently.</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {selectionInputs.map((item) => <li key={item} className="flex items-start gap-3 text-sm font-medium"><ScanSearch aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.8} /><span>{item}</span></li>)}
            </ul>
          </div>
          <div className="border border-primary/20 bg-white p-7 shadow-[0_18px_60px_rgba(20,54,72,0.08)] sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><FlaskConical aria-hidden="true" className="size-6" /></div>
            <h3 className="mt-6 text-2xl font-semibold">Technical selection catalogue</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Review product families and dimensional references, then send the operating details for a project-specific discussion.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogue" className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 font-semibold text-primary-foreground">Open catalogue <ArrowRight className="size-4" /></Link>
              <Link href="/contact#rfq" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 font-semibold hover:border-primary hover:text-primary"><PackageCheck className="size-4" /> Send requirements</Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Direct contact: <a className="font-medium text-foreground hover:text-primary" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
          </div>
        </div>
        </Reveal>
      </section>
    </>
  )
}
