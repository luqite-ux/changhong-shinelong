import Link from "next/link"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { FactoryVideo } from "@/components/factory-video"
import { Reveal } from "@/components/reveal"
import { SelectionFlow } from "@/components/selection-flow"
import { getProducts } from "@/lib/products-db"

const slides = [
  { id:"products", eyebrow:"Bulk material handling", heading:"Rotary valves engineered around your material and process", description:"Sixteen product families for controlled discharge, conveying and crushing duties.", ctaLabel:"Explore products", ctaHref:"/products", image:{src:"/images/ai-banners/product-family-hero.png",alt:"Rotary valve and crushing equipment product family"}, mobileImage:{src:"/images/ai-products/bzgfwk.png",alt:"Industrial rotary valve"}},
  { id:"factory", eyebrow:"Manufacturing capability", heading:"From machining and welding to assembly and inspection", description:"A 6,000 m² facility in Changzhou organized across five production areas.", ctaLabel:"See manufacturing", ctaHref:"/manufacturing", image:{src:"/images/ai-banners/manufacturing-capability-hero.png",alt:"Organized Changhong ShineLong production floor"}, mobileImage:{src:"/images/ai-facility/production-floor-overview.png",alt:"Changhong ShineLong production floor"}},
  { id:"selection", eyebrow:"Application-led selection", heading:"Start with the material, capacity and operating conditions", description:"Share the duty point and our team will help identify a suitable configuration.", ctaLabel:"Request selection support", ctaHref:"/contact#rfq", image:{src:"/images/ai-banners/selection-support-hero.png",alt:"Screw conveyor and electric crushing valve selection"}, mobileImage:{src:"/images/ai-products/screw-conveyor.png",alt:"Industrial screw conveyor"}},
]

export default async function HomePage() {
  const productFamilies=await getProducts()
  return <>
    <HeroCarousel slides={slides} />
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Product families</p><h2 className="mt-2 text-3xl font-semibold">Built for controlled bulk-material flow</h2></div><Link href="/products" className="hidden font-medium sm:block">View all products →</Link></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{productFamilies.slice(0,6).map((p)=><ProductCard key={p.slug} product={p}/>)}</div>
    </Reveal>
    <Reveal as="section" className="border-y border-border bg-secondary/40"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Manufacturing</p><h2 className="mt-2 text-3xl font-semibold">One workflow from machining to final inspection</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Machining, grinding and welding, assembly, inspection and warehouse operations are coordinated within our Changzhou facility.</p><div className="mt-8 grid grid-cols-2 gap-4">{["5 production areas","500 units / month","6,000 m² facility","OEM / ODM"].map(label=><div key={label} className="rounded-sm border bg-background p-4 text-sm font-medium">{label}</div>)}</div></div><FactoryVideo src="/media/factory-tour.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="Organized Changhong ShineLong production floor"/></div></Reveal>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Selection path</p><h2 className="mt-2 text-3xl font-semibold">Five inputs for a focused recommendation</h2><div className="mt-10"><SelectionFlow/></div></Reveal>
    <section className="bg-graphite text-white"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8"><div><h2 className="text-3xl font-semibold">Discuss your material-handling requirement</h2><p className="mt-2 text-white/75">Send the material, capacity, pressure and connection details.</p></div><Link href="/contact#rfq" className="rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground">Request a quote</Link></div></section>
  </>
}
