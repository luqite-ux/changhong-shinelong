/**
 * Locale-aware text. English is the only populated locale at launch;
 * other locales are reserved for future translation without a schema change.
 */
export type LocalizedText = {
  en: string
  zh?: string
}

export function t(text: LocalizedText, _locale: "en" | "zh" = "en"): string {
  return text[_locale] ?? text.en
}

export type ProductImage = {
  src: string
  alt: string
  status: "available" | "pending"
}

export type SpecRow = {
  label: string
  value: string
}

export type ProductCategory = "rotary-valve" | "screw-conveyor" | "crushing-valve"

export type ProductFamily = {
  slug: string
  code: string
  name: LocalizedText
  category: ProductCategory
  categoryLabel: LocalizedText
  summary: LocalizedText
  description: LocalizedText[]
  industries: string[]
  materials: string[]
  customization: string[]
  specs: SpecRow[]
  images: ProductImage[]
  relatedSlugs: string[]
  sourceFields?: Array<{field_key:string;source_hash:string;source_value:unknown;disposition:"publish"|"backend_only"|"excluded";source_locator:string;reason?:string}>
}

export type NewsPost = {
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText[]
  publishedAt: string | null
}
