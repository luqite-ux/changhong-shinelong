import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '../../huanqiu-admin/node_modules/@supabase/supabase-js/dist/index.mjs'
import bcrypt from '../../huanqiu-admin/node_modules/bcryptjs/index.js'

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

const apply = process.argv.includes('--apply')
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const displayName = '常州市常宏祥隆机械科技有限公司'
const name = 'changhong-shinelong'
const temporaryDomain = 'changhong-shinelong.vercel.app'
const adminEmail = '1390339757@qq.com'

const { data: matches, error: lookupError } = await db.from('tenants').select('id,name,display_name,domain,admin_group').or(`display_name.eq.${displayName},name.eq.${name},domain.eq.${temporaryDomain}`)
if (lookupError) throw lookupError
if (!apply) {
  console.log(JSON.stringify({ mode: 'dry-run', exactIdentity: { displayName, name, temporaryDomain }, matches }, null, 2))
  process.exit(0)
}
if (matches.length > 1) throw new Error(`Conflicting tenant matches: ${matches.map(x => x.id).join(',')}`)

const tenantPayload = {
  name,
  display_name: displayName,
  domain: temporaryDomain,
  email: adminEmail,
  password_hash: 'customer-login-is-managed-in-admin-users',
  admin_group: 2,
  brand_color: '#2789a8',
  default_language: 'en',
  supported_languages: ['en'],
  site_title_i18n: { en: 'Chanhong ShineLong | Rotary Valves & Bulk Material Handling' },
  site_tagline_i18n: { en: 'Rotary valves engineered around your material and process' },
  site_description_i18n: { en: 'Manufacturer of rotary valves, screw conveyors and electric crushing valves for bulk material handling applications.' },
  contact_email: adminEmail,
  contact_phone: '13961228745',
  contact_address_short: 'Changzhou, Jiangsu, China',
  contact_address_i18n: { en: 'No. 2-101, Datong West Road, Niutang Town, Wujin District, Changzhou City, Jiangsu, China', zh: '常州市武进区牛塘镇大通西路197号2-101' },
  social_links: {},
  seo_title_i18n: { en: 'Chanhong ShineLong | Rotary Valves & Bulk Material Handling' },
  seo_description_i18n: { en: 'Rotary valves, screw conveyors and electric crushing valves for grain, feed, chemical, pharmaceutical, dust collection and new-energy material handling.' },
  seo_keywords_i18n: { en: ['rotary valve', 'rotary airlock', 'screw conveyor', 'electric crushing valve'] },
  extra_settings: { translation_profile: { industry: 'Bulk material handling machinery', company_summary: 'Changzhou manufacturer of rotary valves, screw conveyors and electric crushing valves.', main_products: ['Rotary valves', 'Screw conveyors', 'Electric crushing valves'], target_markets: [], glossary: { '旋转阀': 'rotary valve', '螺旋输送机': 'screw conveyor', '电动破碎阀': 'electric crushing valve' } }, site_settings_source: 'customer_material_2026-09-02', legal_name_en_status: 'derived_direct_translation' },
}

let tenant
if (matches[0]) {
  const { data, error } = await db.from('tenants').update(tenantPayload).eq('id', matches[0].id).select('id,name,display_name,domain,admin_group').single()
  if (error) throw error
  tenant = data
} else {
  const { data, error } = await db.from('tenants').insert(tenantPayload).select('id,name,display_name,domain,admin_group').single()
  if (error) throw error
  tenant = data
}

const { data: emailOwner } = await db.from('admin_users').select('id,tenant_id,email').eq('email', adminEmail).maybeSingle()
if (emailOwner && emailOwner.tenant_id !== tenant.id) throw new Error(`Admin email already belongs to tenant ${emailOwner.tenant_id}`)
const hash = await bcrypt.hash('info12345', 12)
const userPayload = { tenant_id: tenant.id, email: adminEmail, password_hash: hash, role: 'admin', is_active: true, must_change_password: false }
if (emailOwner) {
  const { error } = await db.from('admin_users').update(userPayload).eq('id', emailOwner.id)
  if (error) throw error
} else {
  const { error } = await db.from('admin_users').insert(userPayload)
  if (error) throw error
}

const categories = [
  { slug: 'rotary-valve', name: 'Rotary Valves / Airlocks', description: 'Rotary discharge and airlock equipment.' },
  { slug: 'screw-conveyor', name: 'Screw Conveyors', description: 'Bulk material transfer equipment.' },
  { slug: 'crushing-valve', name: 'Electric Crushing Valves', description: 'Crushing and deagglomeration equipment.' },
]
for (const [sort_order, item] of categories.entries()) {
  const { error } = await db.from('product_categories').upsert({ tenant_id: tenant.id, slug: item.slug, name: item.name, name_en: item.name, name_i18n: { en: item.name }, description: item.description, description_en: item.description, description_i18n: { en: item.description }, sort_order, is_active: true }, { onConflict: 'tenant_id,slug' })
  if (error) throw error
}

const js = readFileSync(new URL('../lib/products-data.ts', import.meta.url), 'utf8')
const sourceAudit = JSON.parse(readFileSync(new URL('../lib/product-source-audit.json', import.meta.url), 'utf8'))
const auditByKey = new Map(sourceAudit.map(item => [item.product_key, item]))
const auditKeyBySlug = {
  tgf: 'tgf-rotary-valve', zgf: 'zgf-rotary-valve', 'zgfwe-zgfwf': 'zgfwe-zgfwf-high-temperature',
  'zgfe-zgff': 'zgfe-zgff-rotary-valve', 'lgfwe-lgfwf': 'lgfwe-lgfwf-chain-drive', bzgfwf: 'bzgfwf-pressure-conveying',
  zfs: 'zfs-rotary-valve', bzgfwk: 'bzgfwk-quick-clean', zgb: 'zgb-heavy-duty', zqx: 'zqx-rotary-valve',
  zgp: 'zgp-rotary-valve', zgc: 'zgc-rotary-valve', qnlzgfwf: 'qnlzgfwf-lined', tazgfwf: 'tazgfwf-titanium',
  'screw-conveyor': 'screw-conveyor', 'electric-crushing-valve': 'electric-crushing-valve',
}
const ts = await import('../../huanqiu-admin/node_modules/typescript/lib/typescript.js')
const compiled = ts.default.transpileModule(js, { compilerOptions: { target: ts.default.ScriptTarget.ES2022, module: ts.default.ModuleKind.ESNext } }).outputText
const mod = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
for (const [sort_order, product] of mod.productFamilies.entries()) {
  const source = auditByKey.get(auditKeyBySlug[product.slug])
  const payload = { tenant_id: tenant.id, slug: product.slug, name: product.name.en, name_en: product.name.en, name_i18n: product.name, description: product.summary.en, description_en: product.summary.en, description_i18n: product.summary, overview: product.description.map(x => x.en).join('\n\n'), overview_en: product.description.map(x => x.en).join('\n\n'), overview_i18n: { en: product.description.map(x => x.en).join('\n\n') }, image_url: product.images[0].src, category: product.categoryLabel.en, category_slug: product.category, model: product.code, features: product.customization, features_i18n: { en: product.customization }, applications: product.industries, applications_i18n: { en: product.industries }, advantages: [], advantages_i18n: { en: [] }, specs: Object.fromEntries(product.specs.map(x => [x.label, x.value])), extra_data: { images: product.images.map(x => x.src), related_slugs: product.relatedSlugs, material_options: product.materials, source_product_key: source?.product_key, source_fields: source?.fields ?? [], source_field_hashes: Object.fromEntries((source?.fields ?? []).filter(x => x.disposition !== 'excluded').map(x => [x.field_key, x.source_hash])) }, sort_order, is_active: true }
  const { error } = await db.from('products').upsert(payload, { onConflict: 'tenant_id,slug' })
  if (error) throw new Error(`${product.slug}: ${error.message}`)
}

const [{ count: products }, { count: categoryCount }, { data: readback }] = await Promise.all([
  db.from('products').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
  db.from('product_categories').select('id', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
  db.from('tenants').select('id,display_name,domain,admin_group,default_language,supported_languages').eq('id', tenant.id).single(),
])
console.log(JSON.stringify({ mode: 'applied', tenant: readback, products, categories: categoryCount, adminEmail, mustChangePassword: false }, null, 2))
