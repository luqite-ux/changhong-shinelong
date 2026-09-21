import Image from "next/image"
import media from "@/lib/customer-media-manifest.json"
import { PageHero } from "@/components/page-hero"

export const metadata = {
  title: "Customer Media & Technical Catalogue",
  description: "Customer-supplied factory media and the complete rotary-valve selection catalogue visual archive.",
  alternates: { canonical: "/media-library" },
}

const groups = [
  { key: "facility", title: "Factory, office and production evidence" },
  { key: "brand_logo", title: "Brand source" },
  { key: "catalogue_page_visual", title: "Complete selection catalogue pages" },
  { key: "brand_or_cover_visual", title: "Catalogue cover and brand visuals" },
  { key: "catalogue_product_visual", title: "Product and application visuals" },
  { key: "catalogue_rendering_component", title: "Embedded catalogue rendering components" },
] as const

export default function MediaLibraryPage() {
  return (
    <>
      <PageHero
        title="Customer Media & Technical Catalogue"
        description="A traceable visual archive of the customer-supplied factory record and rotary-valve selection manual. Product specifications remain on their corresponding product pages."
      />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {groups.map((group) => {
          const items = media.filter((item) => item.category === group.key)
          if (!items.length) return null
          return (
            <section key={group.key} className="mb-16" aria-labelledby={`group-${group.key}`}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b pb-4">
                <h2 id={`group-${group.key}`} className="text-2xl font-semibold sm:text-3xl">{group.title}</h2>
                <p className="shrink-0 text-sm text-muted-foreground">{items.length} items</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <figure id={`media-${item.id}`} key={item.id} className="scroll-mt-24 overflow-hidden rounded-sm border bg-card">
                    <div className="flex min-h-64 items-center justify-center bg-white p-4">
                      <Image
                        src={item.src}
                        alt={`${item.label}, customer-supplied source visual`}
                        width={900}
                        height={700}
                        className="max-h-[32rem] h-auto w-full object-contain"
                      />
                    </div>
                    <figcaption className="border-t p-4">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-primary">{item.id}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{item.label}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </>
  )
}
