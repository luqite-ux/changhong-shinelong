import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const root = new URL("../", import.meta.url)

async function source(relativePath) {
  return readFile(new URL(relativePath, root), "utf8")
}

test("RFQ product select constrains long translated labels", async () => {
  const rfq = await source("components/rfq-form.tsx")
  assert.match(rfq, /min-w-0/)
  assert.match(rfq, /truncate/)
  assert.match(rfq, /productOptionLabel/)
})
test("all product detail locales render normalized product paragraphs", async () => {
  for (const page of [
    "app/products/[slug]/page.tsx",
    "app/zh/products/[slug]/page.tsx",
    "app/ru/products/[slug]/page.tsx",
  ]) {
    const content = await source(page)
    assert.match(content, /toPlainTextParagraphs/)
  }
})

test("public product and article reads use Next cross-request caching", async () => {
  const products = await source("lib/products-db.ts")
  const articles = await source("lib/articles-db.ts")
  assert.match(products, /unstable_cache/)
  assert.match(articles, /unstable_cache/)
})

test("Russian product breadcrumbs include the singular product-family translation", async () => {
  const terms = await source("lib/technical-ru.ts")
  assert.match(terms, /"Rotary Valve \/ Airlock": "Роторный питатель \/ шлюзовой затвор"/)
})

