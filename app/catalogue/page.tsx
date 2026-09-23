import Image from "next/image"
import media from "@/lib/customer-media-manifest.json"
import { PageHero } from "@/components/page-hero"

export const metadata = {
  title: "Rotary Valve Selection Catalogue",
  description: "Read the rotary valve selection manual with model notes, dimensional drawings, specification tables and application guidance.",
  alternates: { canonical: "/catalogue" },
}

export default function CataloguePage() {
  const pages = media.filter((item) => item.semantic_destination === "selection-catalogue-reader")
  const cover = media.filter((item) => item.semantic_destination === "selection-catalogue-cover")
  return (
    <>
      <PageHero title="Selection Catalogue" description="Review model notes, engineering drawings, specification tables and application-selection guidance in one place." />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {cover.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-5 text-2xl font-semibold">Catalogue identity</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cover.map((item) => <Image key={item.id} id={`media-${item.id}`} src={item.src} alt={`${item.label}, catalogue cover visual`} width={900} height={700} className="max-h-96 h-auto w-full rounded-sm border bg-white object-contain p-4" />)}
            </div>
          </section>
        )}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4 border-b pb-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Complete manual</h2>
            <p className="text-sm text-muted-foreground">{pages.length} pages</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {pages.map((item) => (
              <figure id={`media-${item.id}`} key={item.id} className="scroll-mt-24 overflow-hidden rounded-sm border bg-card">
                <div className="bg-white p-3"><Image src={item.src} alt={`${item.label}, complete selection manual page`} width={1600} height={1000} className="h-auto w-full object-contain" /></div>
                <figcaption className="border-t p-4 text-sm font-medium text-foreground">Selection manual · Page {pages.indexOf(item)+1}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
