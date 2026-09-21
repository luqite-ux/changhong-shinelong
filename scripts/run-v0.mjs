import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { createClient } from '../../huanqiu-admin/node_modules/v0-sdk/dist/index.js'
import s3Sdk from '../../huanqiu-admin/node_modules/@aws-sdk/client-s3/dist-cjs/index.js'

const { PutObjectCommand, S3Client } = s3Sdk

for (const envPath of [
  String.raw`D:\Cursor\Grand\huanqiu-admin\.env`,
  String.raw`D:\Cursor\Grand\huanqiu-admin\.env.local`,
  String.raw`D:\Cursor\Grand\huanqiu-admin\_migrate-batch\.env`,
]) {
  if (!existsSync(envPath)) continue
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (/^['"]/.test(value)) value = value.slice(1, -1)
    process.env[match[1]] ??= value
  }
}

const mode = process.argv[2] || 'doctor'
const requiredTeam = 'team_v0pxRIIzSUGJleUTRNSz6GS4'
const projectName = 'changhong-shinelong'
const root = String.raw`D:\Cursor\Grand\changhong-shinelong`
const delivery = join(root, '.codex-delivery')
const statePath = join(delivery, 'v0-state.json')
const key = process.env.V0_API_KEY || process.env.V0_TOKEN
if (!key) throw new Error('Missing V0_API_KEY/V0_TOKEN')
if (!key.includes(requiredTeam)) throw new Error('Wrong v0 team')
const v0 = createClient({ apiKey: key })

function required(name) {
  if (!process.env[name]) throw new Error(`Missing ${name}`)
  return process.env[name]
}

const assetPack = JSON.parse(readFileSync(join(delivery, 'v0-asset-pack.json'), 'utf8'))
const localAssets = assetPack.assets.map((item) => item.path)

if (mode === 'upload') {
  const s3 = new S3Client({
    region: 'auto', endpoint: required('R2_S3_ENDPOINT'),
    requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
    credentials: { accessKeyId: required('R2_ACCESS_KEY_ID'), secretAccessKey: required('R2_SECRET_ACCESS_KEY') },
  })
  const bucket = process.env.R2_BUCKET_NAME || 'sscewebsite'
  const publicBase = (process.env.R2_PUBLIC_URL || required('R2_PUBLIC_URL_PREFIX')).replace(/\/$/, '')
  const attachments = []
  for (const [index, file] of localAssets.entries()) {
    if (!existsSync(file)) throw new Error(`Missing attachment ${file}`)
    const bytes = readFileSync(file)
    const digest = createHash('sha256').update(bytes).digest('hex')
    const extension = extname(file).toLowerCase()
    const objectKey = `site-assets/${projectName}/v0-input/${String(index + 1).padStart(2, '0')}-${digest.slice(0, 12)}${extension}`
    const contentType = extension === '.png' ? 'image/png' : 'image/jpeg'
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: objectKey, Body: bytes, ContentType: contentType, CacheControl: 'public, max-age=31536000, immutable' }))
    attachments.push({ localPath: file, sourceName: basename(file), sha256: digest, bytes: bytes.length, url: `${publicBase}/${objectKey}` })
  }
  writeFileSync(join(delivery, 'v0-attachments.json'), `${JSON.stringify({ attachments }, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ result: 'PASS', attachmentCount: attachments.length, totalBytes: attachments.reduce((sum, item) => sum + item.bytes, 0) }))
  process.exit()
}

const attachmentsPath = join(delivery, 'v0-attachments.json')
if (!existsSync(attachmentsPath)) throw new Error('Run upload first')
const attachments = JSON.parse(readFileSync(attachmentsPath, 'utf8')).attachments
const prompt = [
  readFileSync(join(root, 'deliverables', 'v0-prompt.md'), 'utf8'),
  readFileSync(join(root, 'deliverables', 'material-brief.md'), 'utf8'),
  readFileSync(join(root, 'deliverables', 'homepage-media-slot-plan.md'), 'utf8'),
  readFileSync(join(root, 'deliverables', 'motion-plan.md'), 'utf8'),
  `IMPLEMENTATION CONTRACT
Create complete editable runnable Next.js 16 App Router source. Required routes: app/page.tsx; app/products/page.tsx; app/products/[slug]/page.tsx; app/applications/page.tsx; app/manufacturing/page.tsx; app/about/page.tsx; app/news/page.tsx; app/news/[slug]/page.tsx; app/contact/page.tsx; app/not-found.tsx. Include Header, Footer, mobile navigation, breadcrumbs, hero carousel, scalable product cards/detail, a maintainable 16:9 customer-factory video slot with poster/photo fallback, material-selection flow, true viewport section/card reveal, honest news empty state and complete enquiry form UI. Reserve a labelled 4-character image CAPTCHA position, but do not fake success, connect Supabase, add admin/auth or secrets. The 10 attachments are representative only; Codex will integrate the full 16-family catalogue, all factory media and the derived customer-still video after handoff. No prices, cart, checkout, stock, fabricated certifications, customer logos, warranty, guarantee or unsupported facts.`,
].join('\n\n')

if (mode === 'doctor') {
  const user = await v0.user.get()
  const found = await v0.projects.find()
  const list = Array.isArray(found) ? found : (found.data ?? found.projects ?? [])
  const matches = list.filter((item) => item.name === projectName).map(({ id, name }) => ({ id, name }))
  console.log(JSON.stringify({ ok: true, userId: user?.id, attachmentCount: attachments.length, promptBytes: Buffer.byteLength(prompt), requiredTeam, projectMatches: matches }))
  process.exit()
}

if (mode === 'create') {
  const found = await v0.projects.find()
  const list = Array.isArray(found) ? found : (found.data ?? found.projects ?? [])
  const matches = list.filter((item) => item.name === projectName)
  if (matches.length > 1) throw new Error(`Duplicate v0 projects found for ${projectName}`)
  const project = matches[0] ?? await v0.projects.create({ name: projectName, description: 'Changhong Xianglong rotary valve and conveying machinery B2B website' })
  const existing = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : null
  if (existing?.projectId === project.id && existing?.chatId) {
    console.log(JSON.stringify({ reused: true, teamId: requiredTeam, projectId: existing.projectId, chatId: existing.chatId, webUrl: existing.webUrl, attachmentCount: attachments.length }))
    process.exit()
  }
  if (matches.length === 1) throw new Error(`Existing v0 project ${project.id} has no validated local chat state; refusing to create a duplicate chat`)
  const chat = await v0.chats.create({ projectId: project.id, message: prompt, attachments: attachments.map(({ url }) => ({ url })), chatPrivacy: 'private', responseMode: 'async', modelConfiguration: { imageGenerations: false } })
  if (chat instanceof ReadableStream) throw new Error('Unexpected stream')
  const now = new Date().toISOString()
  const state = { teamId: requiredTeam, projectId: project.id, chatId: chat.id, webUrl: chat.webUrl, createdAt: now, attachments, v0_calls: [{ chat_id: chat.id, purpose: 'first full-site visual generation', scope: 'Home, Products/detail, Applications, Manufacturing, About, News/detail, Contact and MOT-CHXL-01..04', cost_usd: null, outcome: 'legacy_unclassified', effective_full_site_generation: false, recorded_at: now }] }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ reused: false, teamId: requiredTeam, projectId: project.id, chatId: chat.id, webUrl: chat.webUrl, attachmentCount: attachments.length }))
  process.exit()
}

if (mode === 'status') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const chat = await v0.chats.getById({ chatId: state.chatId })
  const versions = await v0.chats.findVersions({ chatId: state.chatId, limit: 100 })
  console.log(JSON.stringify({ chatId: state.chatId, webUrl: state.webUrl, text: String(chat.text ?? '').slice(0, 800), versionId: chat.latestVersion?.id ?? chat.latestVersionId ?? null, status: chat.latestVersion?.status ?? null, demoUrl: chat.latestVersion?.demoUrl ?? null, fileCount: Array.isArray(chat.latestVersion?.files) ? chat.latestVersion.files.length : Array.isArray(chat.files) ? chat.files.length : null, versions: (versions.data ?? []).map((item) => ({ id: item.id, status: item.status, createdAt: item.createdAt })) }))
  process.exit()
}

if (mode === 'download') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const chat = await v0.chats.getById({ chatId: state.chatId })
  const versionId = process.argv[3] || (chat.latestVersion?.status === 'completed' ? chat.latestVersion?.id : null)
  if (!versionId) throw new Error('Latest version is not completed')
  const response = await fetch(`https://api.v0.dev/v1/chats/${state.chatId}/versions/${versionId}/download?format=zip&includeDefaultFiles=true`, { headers: { Authorization: `Bearer ${key}` } })
  if (!response.ok) throw new Error(`download ${response.status}`)
  const sourceDir = join(delivery, 'source')
  mkdirSync(sourceDir, { recursive: true })
  const target = join(sourceDir, `${projectName}-v0-source.zip`)
  const bytes = Buffer.from(await response.arrayBuffer())
  writeFileSync(target, bytes)
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  state.completedVersionId = versionId
  state.v0_calls[state.v0_calls.length - 1] = { ...state.v0_calls[state.v0_calls.length - 1], outcome: 'usable_source', effective_full_site_generation: true, version_id: versionId, recorded_at: new Date().toISOString() }
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ target, bytes: bytes.length, sha256, versionId }))
  process.exit()
}

if (mode === 'revise-source') {
  const state = JSON.parse(readFileSync(statePath, 'utf8'))
  const message = `SOURCE-INTEGRITY-CHXL-001: Continue in this same project and chat. Preserve the current visual direction, all supplied assets and MOT-CHXL-01 through MOT-CHXL-04. Add any missing complete editable runnable Next.js source required by the original prompt: layout, global styles, every enumerated route, and shared Header, Footer, HeroCarousel, ProductGrid, ProductDetail, ManufacturingVideoSlot, MaterialSelectionFlow, SectionReveal, NewsEmptyState and ContactForm components. Do not redesign, explain, add backend code, fake form success, invent facts, certifications, prices, stock, warranty or guarantee language. Completion means the downloadable ZIP physically contains all requested paths and builds.`
  await v0.chats.sendMessage({ chatId: state.chatId, message, responseMode: 'async' })
  state.v0_calls.push({ chat_id: state.chatId, purpose: 'recover exact missing executable source', scope: 'SOURCE-INTEGRITY-CHXL-001', cost_usd: null, outcome: 'legacy_unclassified', effective_full_site_generation: false, recorded_at: new Date().toISOString() })
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ ok: true, chatId: state.chatId, scope: 'SOURCE-INTEGRITY-CHXL-001' }))
  process.exit()
}

throw new Error(`Unknown mode ${mode}`)
