import { FactoryVideo } from "@/components/factory-video"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { siteConfig } from "@/lib/site-config"
export const metadata={title:'Manufacturing & Inspection',description:'Machining, welding, assembly, inspection and warehouse operations in Changzhou.',alternates:{canonical:'/manufacturing'}}
export default function ManufacturingPage(){return <><PageHero title="Manufacturing" description="Machining, welding, assembly and inspection organized around a consistent production workflow."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><FactoryVideo src="/media/factory-tour.mp4" poster="/images/ai-facility/production-floor-overview.png" posterAlt="Organized Changhong ShineLong production floor"/><div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{siteConfig.facilityAreas.map(x=><Reveal key={x.name} className="rounded-sm border bg-card p-5"><h2 className="font-semibold">{x.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{x.description}</p></Reveal>)}</div></main></>}
