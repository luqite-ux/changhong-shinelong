import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products-db'
import { getPublishedArticles } from '@/lib/articles-db'
import { siteConfig } from '@/lib/site-config'
export const revalidate=60
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const now=new Date();const staticPaths=['','/products','/applications','/manufacturing','/about','/news','/contact'];const [products,articles]=await Promise.all([getProducts(),getPublishedArticles()]);return [...staticPaths.map(path=>({url:`${siteConfig.siteUrl}${path}`,lastModified:now})),...products.map(p=>({url:`${siteConfig.siteUrl}/products/${p.slug}`,lastModified:now})),...articles.map(a=>({url:`${siteConfig.siteUrl}/news/${a.slug}`,lastModified:new Date(a.updatedAt||a.publishedAt||now)}))]}
