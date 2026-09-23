import Image from "next/image"
import materialManifest from "../.codex-delivery/material-fact-manifest.json"

const mediaNames = ["image3.jpeg", "image4.jpeg", "image5.jpeg", "image6.jpeg", "image7.jpeg", "image8.jpeg", "image9.jpeg", "image10.jpeg", "image11.jpeg"]

export function MaterialEvidence() {
  const facts = materialManifest.facts.filter((fact) => fact.decision === "use" && "source_value" in fact)
  return (
    <section id="customer-media-facility" className="mt-16 scroll-mt-24 border-t pt-12">
      <h2 className="text-3xl font-semibold">Documented capabilities &amp; source facts</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">The following record preserves customer-provided operational, product and catalogue information without inventing missing details.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mediaNames.map((name, index) => (
          <figure key={name} className="overflow-hidden rounded-sm border bg-card">
            <Image src={`/images/evidence/${name}`} alt={`Manufacturing area ${index + 1}`} width={1000} height={750} className="aspect-[4/3] h-auto w-full object-cover" />
            <figcaption className="p-3 text-xs font-medium text-foreground">Manufacturing area {String(index + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
      <details className="mt-10 rounded-sm border bg-card p-5">
        <summary className="cursor-pointer text-lg font-semibold">Complete audited source-fact record ({facts.length} entries)</summary>
        <dl className="mt-5 divide-y">
          {facts.map((fact) => (
            <div key={fact.fact_id} className="py-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-primary">{fact.entity_key}</dt>
              <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{String(fact.source_value)}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}
