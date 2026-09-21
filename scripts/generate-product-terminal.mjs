import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const manifestPath = new URL('../.codex-delivery/product-coverage-manifest.json', import.meta.url)
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const { data: rows, error } = await db.from('products').select('slug,image_url,extra_data').eq('tenant_id', tenantId).eq('is_active', true).order('sort_order')
if (error) throw error
if (rows.length !== manifest.source_entries.length) throw new Error(`Backend count ${rows.length} does not equal source ${manifest.source_entries.length}`)

const slugByKey = {
  'tgf-rotary-valve':'tgf','zgf-rotary-valve':'zgf','zgfwe-zgfwf-high-temperature':'zgfwe-zgfwf','zgfe-zgff-rotary-valve':'zgfe-zgff','lgfwe-lgfwf-chain-drive':'lgfwe-lgfwf','bzgfwf-pressure-conveying':'bzgfwf','zfs-rotary-valve':'zfs','bzgfwk-quick-clean':'bzgfwk','zgb-heavy-duty':'zgb','zqx-rotary-valve':'zqx','zgp-rotary-valve':'zgp','zgc-rotary-valve':'zgc','qnlzgfwf-lined':'qnlzgfwf','tazgfwf-titanium':'tazgfwf','screw-conveyor':'screw-conveyor','electric-crushing-valve':'electric-crushing-valve',
}
const rowBySlug = new Map(rows.map(row => [row.slug, row]))
const mediaByKey = new Map(manifest.product_media.map(row => [row.product_key, row]))
const contentByKey = new Map(manifest.product_content.map(row => [row.product_key, row]))
const backendMedia=[]; const backendContent=[]; const frontendContent=[]

function decodeHtml(value){return value.replace(/<[^>]*>/g,' ').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('\\n',' ').replace(/\s+/g,' ').trim()}
function visibleText(value){if(typeof value==='string')return value; if(value?.raw_page_text)return value.raw_page_text; return JSON.stringify(value)}

for (const source of manifest.source_entries) {
  const key=source.product_key, slug=slugByKey[key], row=rowBySlug.get(slug)
  if(!row) throw new Error(`Missing backend product ${key}/${slug}`)
  const expected=contentByKey.get(key)
  const backendFields=row.extra_data?.source_field_hashes??{}
  for(const field of expected.provided_fields.filter(x=>x.disposition!=='excluded')) if(backendFields[field.field_key]!==field.source_hash) throw new Error(`Backend field mismatch ${key}:${field.field_key}`)
  const htmlPath=new URL(`../.next/server/app/products/${slug}.html`,import.meta.url)
  if(!existsSync(htmlPath)) throw new Error(`Missing prerendered detail ${slug}`)
  const html=decodeHtml(readFileSync(htmlPath,'utf8'))
  const frontendHashes={}
  for(const field of expected.provided_fields.filter(x=>x.disposition==='publish')) {
    const needle=visibleText(field.source_value).replace(/\s+/g,' ').trim()
    const probe=needle.length>180?needle.slice(0,180):needle
    if(!html.includes(probe)) throw new Error(`Frontend field not rendered ${key}:${field.field_key}`)
    frontendHashes[field.field_key]=field.source_hash
  }
  const gallery=[...(row.extra_data?.images??[])].filter(Boolean)
  if(!gallery.includes(row.image_url)) gallery.unshift(row.image_url)
  const imageResponse=await fetch(row.image_url)
  if(!imageResponse.ok) throw new Error(`Cover unavailable ${key}: ${imageResponse.status}`)
  const coverHash=createHash('sha256').update(Buffer.from(await imageResponse.arrayBuffer())).digest('hex')
  backendMedia.push({product_key:key,cover_url:row.image_url,cover_hash:coverHash,source_asset:mediaByKey.get(key).cover_asset,gallery_urls:gallery})
  const descriptionHash=expected.description.source_status==='provided'?expected.description.source_hash:null
  const specificationKeys=expected.specifications.source_status==='provided'?expected.specifications.source_keys:[]
  backendContent.push({product_key:key,description_hash:descriptionHash,specification_keys:specificationKeys,field_hashes:backendFields})
  frontendContent.push({product_key:key,description_hash:descriptionHash,specification_keys:specificationKeys,field_hashes:frontendHashes,gallery_urls:gallery,evidence:`.next/server/app/products/${slug}.html#Customer-provided-product-facts`})
}
manifest.backend_product_keys=manifest.source_entries.map(x=>x.product_key)
manifest.frontend_product_keys=[...manifest.backend_product_keys]
manifest.featured_product_keys=manifest.backend_product_keys.slice(0,8)
manifest.backend_product_media=backendMedia
manifest.backend_product_content=backendContent
manifest.frontend_product_content=frontendContent
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n','utf8')
console.log(JSON.stringify({products:rows.length,backendFields:backendContent.reduce((n,x)=>n+Object.keys(x.field_hashes).length,0),frontendFields:frontendContent.reduce((n,x)=>n+Object.keys(x.field_hashes).length,0),detailEvidence:frontendContent.length}))
process.exit(0)
