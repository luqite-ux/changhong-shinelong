import { Boxes, Factory, FlaskConical, Leaf, Pill, Wheat } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { applicationAreas } from "@/lib/applications-data"
const icons=[Wheat,Boxes,FlaskConical,Factory,Pill,Leaf]
export default function ApplicationsPage(){return <><PageHero title="Applications" description="Application-led configurations for ten documented bulk-material handling sectors."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2">{applicationAreas.map((a,i)=>{const Icon=icons[i%icons.length];return <Reveal key={a.slug} className="rounded-sm border bg-card p-6"><Icon className="size-8 text-primary"/><h2 className="mt-5 text-xl font-semibold">{a.name}</h2><p className="mt-3 leading-7 text-muted-foreground">{a.description}</p></Reveal>})}</div></main></>}
