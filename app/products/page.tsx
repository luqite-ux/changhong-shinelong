import { PageHero } from "@/components/page-hero"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/products-db"
import Link from "next/link"
import { SemanticMediaGallery } from "@/components/semantic-media-gallery"
export const metadata={title:'Industrial Rotary Valves & Conveying Equipment',description:'Explore 16 rotary valve, screw conveyor and electric crushing valve product families.',alternates:{canonical:'/products'}}
export const revalidate=60
export default async function ProductsPage(){const productFamilies=await getProducts();return <><PageHero title="Products" description="Rotary valves, screw conveyors and electric crushing valves for controlled bulk-material flow."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-10 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl leading-7 text-muted-foreground">Select a product family below, or open the complete selection manual for dimensional drawings and model tables.</p><Link href="/catalogue" className="rounded-sm border px-4 py-2 font-medium transition-colors hover:border-primary hover:bg-secondary">Read selection catalogue</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{productFamilies.map(p=><ProductCard key={p.slug} product={p}/>)}</div><SemanticMediaGallery businessEntity="product-portfolio" title="More product configurations" id="catalogue-overview"/></main></>}
