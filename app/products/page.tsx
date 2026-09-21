import { PageHero } from "@/components/page-hero"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/products-db"
export const metadata={title:'Industrial Rotary Valves & Conveying Equipment',description:'Explore 16 documented rotary valve, screw conveyor and electric crushing valve product families.',alternates:{canonical:'/products'}}
export const revalidate=60
export default async function ProductsPage(){const productFamilies=await getProducts();return <><PageHero title="Products" description="Rotary valves, screw conveyors and electric crushing valves documented in the supplied selection catalogue."/><main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{productFamilies.map(p=><ProductCard key={p.slug} product={p}/>)}</div></main></>}
