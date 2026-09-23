import Image from "next/image"
import media from "@/lib/customer-media-manifest.json"

export function SemanticMediaGallery({
  businessEntity,
  title,
  id,
}: {
  businessEntity: string
  title: string
  id: string
}) {
  // Product and company pages now use the curated AI-restored visual system.
  // The legacy catalogue extracts remain available only in the catalogue.
  if (businessEntity.startsWith("product:") || businessEntity === "product-portfolio" || businessEntity === "company-profile") return null
  const items = media.filter((item) => item.business_entity === businessEntity)
  if (!items.length) return null
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4 border-b pb-3">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Additional configurations</p><h2 className="mt-1 text-2xl font-semibold">{title}</h2></div>
        <span className="text-sm text-muted-foreground">{items.length} references</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure id={`media-${item.id}`} key={item.id} className="overflow-hidden rounded-sm border bg-card">
            <div className="flex min-h-48 items-center justify-center bg-[#f7f9fa] sm:min-h-56">
              <Image src={item.src} alt={`${title} reference ${items.indexOf(item)+1}`} width={900} height={700} className="max-h-80 h-auto w-full object-contain" />
            </div>
            <figcaption className="border-t p-3 text-sm font-medium text-foreground">Configuration reference {String(items.indexOf(item)+1).padStart(2,"0")}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
