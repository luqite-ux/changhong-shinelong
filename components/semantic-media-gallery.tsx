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
  const items = media.filter((item) => item.business_entity === businessEntity)
  if (!items.length) return null
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4 border-b pb-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">{items.length} source visuals</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure id={`media-${item.id}`} key={item.id} className="overflow-hidden rounded-sm border bg-card">
            <div className="flex min-h-56 items-center justify-center bg-white p-5">
              <Image src={item.src} alt={`${item.label}, customer-supplied product visual`} width={900} height={700} className="max-h-96 h-auto w-full object-contain" />
            </div>
            <figcaption className="border-t p-3 text-sm text-muted-foreground">{item.placement_reason}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
