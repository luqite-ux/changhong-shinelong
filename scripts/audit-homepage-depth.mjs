import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
const sections = readFileSync(new URL('../components/home-buyer-sections.tsx', import.meta.url), 'utf8')

const requiredSections = [
  'application-industries',
  'configuration-capability',
  'manufacturing-evidence',
  'selection-resources',
]

if (!page.includes('<HomeBuyerSections')) {
  throw new Error('Homepage does not render the buyer-decision sections')
}

for (const section of requiredSections) {
  if (!sections.includes(`id="${section}"`)) {
    throw new Error(`Homepage section is missing: ${section}`)
  }
}

if (!sections.includes('siteConfig.email')) {
  throw new Error('Homepage buyer sections do not use the shared formal contact identity')
}

if (!sections.includes('data-product-image-stage="full-bleed"')) {
  throw new Error('Configuration product image is not rendered as a full-bleed stage')
}

if (sections.includes('[background-image:linear-gradient(rgba(44,164,200,.09)')) {
  throw new Error('Configuration product image still uses the grey grid frame')
}

if (/qnlzgfwf\.png[^>]+\b(?:p-8|sm:p-12)\b/.test(sections)) {
  throw new Error('Configuration product image still has inset padding')
}

console.log('PASS homepage depth audit')
