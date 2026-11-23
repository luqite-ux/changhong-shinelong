import test from "node:test"
import assert from "node:assert/strict"

import { productOptionLabel, toPlainTextParagraphs } from "../lib/product-content.ts"

test("toPlainTextParagraphs removes stored HTML while preserving paragraph boundaries", () => {
  const source = '<p><span style="font-size: 11pt;">Первый абзац &amp; данные.</span></p><p>Второй<br>ряд.</p>'

  assert.deepEqual(toPlainTextParagraphs(source), [
    "Первый абзац & данные.",
    "Второй",
    "ряд.",
  ])
})
test("productOptionLabel avoids duplicated model codes in Russian labels", () => {
  assert.equal(
    productOptionLabel("ZGFWE / ZGFWF", "Роторный питатель ZGFWE / ZGFWF", "ru"),
    "Роторный питатель ZGFWE / ZGFWF",
  )
})

test("productOptionLabel omits an English code when Russian name is available", () => {
  assert.equal(
    productOptionLabel("Electric Crushing Valve", "Электрический дробильный затвор", "ru"),
    "Электрический дробильный затвор",
  )
})

