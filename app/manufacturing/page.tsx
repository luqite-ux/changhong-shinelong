import { FactoryVideo } from "@/components/factory-video"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { siteConfig } from "@/lib/site-config"
export default function ManufacturingPage(){return <><PageHero title="Manufacturing" description="A documented view of machining, welding, assembly, inspection and warehouse operations."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><FactoryVideo src="/media/factory-tour.mp4" poster="/images/factory-panorama.jpg" posterAlt="Customer factory production floor"/><div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{siteConfig.facilityAreas.map(x=><Reveal key={x.name} className="rounded-sm border p-5"><h2 className="font-semibold">{x.name}</h2><p className="mt-2 text-sm text-muted-foreground">{x.description}</p></Reveal>)}</div></main></>}
