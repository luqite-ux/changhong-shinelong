import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { discoverDocumentEmbeddedMedia, reconcileMaterialFactCoverage } from 'file:///C:/Users/Grandlin/.codex/skills/huanqiu-customer-site-delivery/scripts/material-fact-coverage.mjs'

const phase = process.argv[2] ?? 'terminal'
const manifestPath = path.resolve('.codex-delivery/material-fact-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const discoveredPaths = []
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(candidate)
    else if (entry.isFile() && !entry.name.startsWith('~$')) discoveredPaths.push(candidate)
  }
}
for (const root of manifest.material_roots) await walk(path.resolve(root))
const discoveredEmbeddedMedia = await discoverDocumentEmbeddedMedia(discoveredPaths)
const report = reconcileMaterialFactCoverage(manifest, { phase, discoveredPaths, discoveredEmbeddedMedia })
const output = path.resolve(`.codex-delivery/material-fact-coverage-${phase}.json`)
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ pass: report.pass, phase, counts: report.counts, problems: {
  invalidFacts: report.invalid_fact_ids.length,
  missingDestinations: report.missing_destination_fact_ids.length,
  valueMismatches: report.value_mismatch_fact_ids.length,
  missingMediaDestinations: report.missing_embedded_media_destination_ids.length,
} }))
if (!report.pass) process.exitCode = 2
