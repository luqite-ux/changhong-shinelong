import { Boxes, Factory, FlaskConical, Leaf, Pill, Wheat } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { applicationAreas } from "@/lib/applications-data"
import { ApplicationSelectionGuide } from "@/components/application-selection-guide"
export const metadata={title:'Bulk Material Handling Applications',description:'Rotary valve and conveying applications across grain, food, feed, chemical, pharmaceutical and new-energy operations.',alternates:{canonical:'/applications'}}
const icons=[Wheat,Boxes,FlaskConical,Factory,Pill,Leaf]
export default function ApplicationsPage(){return <><PageHero title="Applications" description="Application-led configurations across ten bulk-material handling sectors."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2">{applicationAreas.map((a,i)=>{const Icon=icons[i%icons.length];return <Reveal key={a.slug} className="rounded-sm border bg-card p-6"><div className="inline-flex rounded-sm bg-accent p-3"><Icon className="size-7 text-primary"/></div><h2 className="mt-5 text-xl font-semibold">{a.name}</h2><p className="mt-3 leading-7 text-muted-foreground">{a.description}</p></Reveal>})}</div><ApplicationSelectionGuide/></main></>}
