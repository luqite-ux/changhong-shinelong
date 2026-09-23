import Image from "next/image"

const facilityStories = [
  { category: "Manufacturing workflow", title: "Production floor overview", description: "A clear view of the main production area and the flow between component preparation, assembly and staging.", image: "/images/ai-facility/production-floor-overview.png" },
  { category: "Precision work", title: "Raw materials and machining", description: "Prepared metal components and machining resources organized for repeatable valve production.", image: "/images/ai-facility/raw-materials-machining.png" },
  { category: "Fabrication", title: "Welding and component preparation", description: "Fabrication work arranged around the components required for the next production stage.", image: "/images/ai-facility/welding-component-preparation.png" },
  { category: "Product build", title: "Assembly and finished units", description: "Rotary-valve assemblies and finished units prepared for checking and order handling.", image: "/images/ai-facility/assembly-finished-units.png" },
  { category: "Quality control", title: "Inspection and quality check", description: "Inspection activity focused on component condition, assembly quality and order requirements.", image: "/images/ai-facility/inspection-quality-check.png" },
  { category: "Logistics", title: "Packing and dispatch", description: "Finished equipment organized for protective packing and onward dispatch.", image: "/images/ai-facility/packing-dispatch.png" },
  { category: "Engineering", title: "Engineering and customer support", description: "The team coordinates drawings, operating conditions and order details with customers.", image: "/images/ai-facility/engineering-customer-support.png" },
  { category: "Company", title: "Changzhou facility", description: "The company facility in Changzhou, Jiangsu, supporting production and customer service.", image: "/images/ai-facility/facility-entrance.png" },
]

function FacilityCard({ item, compact = false }: { item: (typeof facilityStories)[number]; compact?: boolean }) {
  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-sm border bg-card">
      <div className={`relative overflow-hidden bg-[#edf2f3] ${compact ? "aspect-[16/8] lg:h-40 lg:flex-none lg:aspect-auto" : "aspect-[4/3] lg:flex-1 lg:aspect-auto"}`}>
        <Image src={item.image} alt={item.title} fill sizes={compact ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 66vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
      <figcaption className={`border-t ${compact ? "p-4" : "p-5"}`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{item.category}</span>
        <h3 className={`${compact ? "mt-1.5 text-base" : "mt-2 text-lg"} font-semibold text-foreground`}>{item.title}</h3>
        <p className={`${compact ? "mt-1.5 line-clamp-2" : "mt-2"} text-sm leading-6 text-muted-foreground`}>{item.description}</p>
      </figcaption>
    </figure>
  )
}

export function MaterialEvidence() {
  return (
    <section id="manufacturing-capabilities" className="mt-16 scroll-mt-24 border-t pt-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Inside our operation</p>
      <h2 className="mt-2 text-3xl font-semibold">From component preparation to dispatch</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">Explore the working areas behind our rotary valves and conveying equipment, organized by the role each area plays in production.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <FacilityCard item={facilityStories[0]} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          {facilityStories.slice(1, 3).map((item) => <FacilityCard key={item.title} item={item} compact />)}
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {facilityStories.slice(3).map((item) => <FacilityCard key={item.title} item={item} />)}
      </div>
    </section>
  )
}
