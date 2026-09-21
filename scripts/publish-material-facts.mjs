import { existsSync, readFileSync } from 'node:fs'
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

const tenantId = '2b7ece95-e14a-48d8-a08c-0a9fea55710e'
const manifest = JSON.parse(readFileSync(new URL('../.codex-delivery/material-fact-manifest.json', import.meta.url), 'utf8'))
const attachments = JSON.parse(readFileSync(new URL('../.codex-delivery/v0-attachments.json', import.meta.url), 'utf8')).attachments
const logo = attachments.find((item) => item.sourceName === 'image1.png')
if (!logo?.url) throw new Error('Uploaded customer logo is missing')

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: tenant, error: readError } = await db.from('tenants').select('extra_settings').eq('id', tenantId).single()
if (readError) throw readError
const materialFacts = Object.fromEntries(manifest.facts.filter((fact) => fact.decision === 'use').map((fact) => [fact.fact_id, {
  entity_key: fact.entity_key,
  field: fact.field,
  source_value: fact.source_value,
  source_value_hash: fact.source_value_hash,
  source_refs: fact.source_refs,
}]))
const materialMedia = Object.fromEntries(manifest.sources.flatMap((source) => source.container_media_scan?.embedded_media ?? []).filter((media) => media.decision === 'use').map((media) => [media.media_id, {
  source_id: 'source-xlsx',
  container_path: media.container_path,
  fingerprint: media.fingerprint,
  expected_destinations: media.expected_destinations,
}]))
const extraSettings = {
  ...(tenant.extra_settings ?? {}),
  material_facts: materialFacts,
  material_media: materialMedia,
  material_fact_audit: { source: 'customer_materials', audited_at: new Date().toISOString(), manifest_version: manifest.version },
}
const { error: updateError } = await db.from('tenants').update({ logo_url: logo.url, favicon_url: logo.url, extra_settings: extraSettings }).eq('id', tenantId)
if (updateError) throw updateError
const { data: check, error: checkError } = await db.from('tenants').select('logo_url,favicon_url,extra_settings').eq('id', tenantId).single()
if (checkError) throw checkError
if (Object.keys(check.extra_settings?.material_facts ?? {}).length !== Object.keys(materialFacts).length) throw new Error('Material fact backend readback count mismatch')
console.log(JSON.stringify({ facts: Object.keys(materialFacts).length, media: Object.keys(materialMedia).length, logoConfigured: check.logo_url === logo.url && check.favicon_url === logo.url }))
