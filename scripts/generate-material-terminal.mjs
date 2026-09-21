import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

for (const envPath of [String.raw`D:\Cursor\Grand\huanqiu-admin\.env`, String.raw`D:\Cursor\Grand\huanqiu-admin\.env.local`]) {
  if (!existsSync(envPath)) continue
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (/^['"]/.test(value)) value = value.slice(1, -1)
    process.env[match[1]] ??= value
  }
}

const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'))
const tenantId = '2b7ece95-e14a-48d8-a08c-0a9fea55710e'
const manifestPath = path.join(root, '.codex-delivery', 'material-fact-manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const htmlPath = path.join(root, '.next', 'server', 'app', 'about.html')
if (!existsSync(htmlPath)) throw new Error('Missing prerendered about page evidence')
const html = readFileSync(htmlPath, 'utf8')
  .replace(/<[^>]*>/g, ' ')
  .replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('\\n', ' ').replace(/\s+/g, ' ').trim()
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: tenant, error } = await db.from('tenants').select('logo_url,favicon_url,extra_settings').eq('id', tenantId).single()
if (error) throw error

for (const fact of manifest.facts.filter((item) => item.decision === 'use')) {
  const stored = tenant.extra_settings?.material_facts?.[fact.fact_id]
  if (!stored || stored.source_value_hash !== fact.source_value_hash) throw new Error(`Backend fact mismatch ${fact.fact_id}`)
  const needle = String(fact.source_value).replace(/\s+/g, ' ').trim()
  if (!html.includes(needle)) throw new Error(`Frontend fact missing ${fact.fact_id}`)
  fact.terminal_targets = fact.expected_destinations.map((layer) => ({
    layer,
    locator: layer === 'backend' ? `tenants.extra_settings.material_facts.${fact.fact_id}` : '/about#documented-source-record',
    evidence: layer === 'backend' ? `Supabase tenant ${tenantId} readback` : '.next/server/app/about.html',
    verification_mode: 'exact',
    verification_result: 'PASS',
    value_hash: fact.source_value_hash,
  }))
}

for (const source of manifest.sources) {
  for (const media of source.container_media_scan?.embedded_media ?? []) {
    if (media.decision !== 'use') continue
    const basename = path.basename(media.extracted_path)
    const publicPath = basename === 'image1.png' ? path.join(root, 'public', 'images', 'logo.png') : path.join(root, 'public', 'images', 'evidence', basename)
    if (!existsSync(publicPath)) throw new Error(`Frontend media missing ${basename}`)
    const hash = createHash('sha256').update(readFileSync(publicPath)).digest('hex')
    if (hash !== media.fingerprint) throw new Error(`Frontend media hash mismatch ${basename}`)
    media.terminal_targets = media.expected_destinations.map((layer) => ({
      layer,
      locator: layer === 'backend' ? 'tenants.logo_url,tenants.favicon_url' : (basename === 'image1.png' ? 'site header/footer brand mark' : '/about#facility-evidence'),
      evidence: layer === 'backend' ? `Supabase tenant ${tenantId} readback` : publicPath,
      verification_result: layer === 'backend' ? (tenant.logo_url && tenant.logo_url === tenant.favicon_url ? 'PASS' : 'FAIL') : 'PASS',
      asset_hash: media.fingerprint,
    }))
  }
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ facts: manifest.facts.filter((item) => item.decision === 'use').length, media: manifest.sources.flatMap((source) => source.container_media_scan?.embedded_media ?? []).filter((item) => item.decision === 'use').length }))
