import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const files = [
  "app/page.tsx",
  "app/about/page.tsx",
  "app/applications/page.tsx",
  "app/catalogue/page.tsx",
  "app/manufacturing/page.tsx",
  "app/products/page.tsx",
  "app/products/[slug]/page.tsx",
  "components/hero-carousel.tsx",
  "components/material-evidence.tsx",
  "components/semantic-media-gallery.tsx",
  "lib/products-data.ts",
]

const sources = Object.fromEntries(
  await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), "utf8")]))
)
const publicCopy = Object.values(sources).join("\n")

for (const phrase of [
  "customer-supplied",
  "supplied material",
  "source visual",
  "placement_reason",
  "Customer-provided product facts",
]) {
  assert.equal(publicCopy.toLowerCase().includes(phrase.toLowerCase()), false, `Public UI still exposes internal wording: ${phrase}`)
}

assert.match(sources["components/hero-carousel.tsx"], /hero-product-stage/, "Hero must use the integrated product stage")
assert.doesNotMatch(sources["components/hero-carousel.tsx"], /lg:grid-cols-2/, "Hero must not return to a mechanical 50/50 split")
assert.match(sources["components/semantic-media-gallery.tsx"], /Additional configurations/, "Gallery needs buyer-facing context")
assert.match(sources["app/products/[slug]/page.tsx"], /max-h-\[30rem\]/, "Product detail image needs a controlled optical size")
assert.equal((sources["lib/products-data.ts"].match(/\/images\/ai-products\//g) ?? []).length, 16, "All 16 product families must use the unified AI product set")
assert.equal((sources["app/page.tsx"].match(/\/images\/ai-banners\//g) ?? []).length, 3, "Homepage must use three purpose-built Banner assets")
assert.doesNotMatch(sources["components/material-evidence.tsx"], /image\d+\.|Manufacturing area \{|audited source-fact/i, "Facility gallery must use business categories, never filenames or audit labels")

console.log("PASS public visual-language audit")
