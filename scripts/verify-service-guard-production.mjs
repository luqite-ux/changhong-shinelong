import { createClient } from '@supabase/supabase-js'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

for (const file of ['D:/Cursor/Grand/huanqiu-admin/.env', 'D:/Cursor/Grand/huanqiu-admin/.env.local', 'D:/Cursor/Grand/huanqiu-admin/_migrate-batch/.env']) {
  if (!existsSync(file)) continue
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Z0-9_]+)=(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (/^['"]/.test(value)) value = value.slice(1, -1)
    process.env[match[1]] ??= value
  }
}

const realTenantId = '2b7ece95-e14a-48d8-a08c-0a9fea55710e'
const syntheticTenantId = randomUUID()
const suffix = Date.now().toString(36)
const projectName = `changhong-guard-${suffix}`
const teamId = process.env.VERCEL_TEAM_ID
const vercelHeaders = { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'Content-Type': 'application/json' }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
let projectId = null
const evidence = { projectName, syntheticTenantId, checks: {}, cleanup: {} }

async function vercel(path, options = {}) {
  const join = path.includes('?') ? '&' : '?'
  const response = await fetch(`https://api.vercel.com${path}${join}teamId=${teamId}`, { ...options, headers: { ...vercelHeaders, ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`Vercel ${response.status}: ${body.error?.code || body.error?.message || JSON.stringify(body)}`)
  return body
}

try {
  const { data: realTenant, error: tenantReadError } = await db.from('tenants').select('*').eq('id', realTenantId).single()
  if (tenantReadError) throw tenantReadError
  const synthetic = { ...realTenant, id: syntheticTenantId, name: `${realTenant.name}-guard-${suffix}`, display_name: `CODEX GUARD CHECK ${suffix}`, domain: `${projectName}.vercel.app`, email: `codex-guard-${suffix}@example.invalid`, contact_email: null, extra_settings:{...(realTenant.extra_settings||{}),service_expiry:{expires_on:'2020-01-01',enforcement_enabled:true,guard_version:'1'}}, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  const { error: tenantInsertError } = await db.from('tenants').insert(synthetic)
  if (tenantInsertError) throw tenantInsertError
  const { error: termInsertError } = await db.from('tenant_service_terms').insert({ tenant_id: syntheticTenantId, expires_on: '2020-01-01', enforcement_enabled: true, guard_version: '1' })
  if (termInsertError) throw termInsertError

  const project = await vercel('/v10/projects', { method: 'POST', body: JSON.stringify({ name: projectName, framework: 'nextjs' }) })
  projectId = project.id
  await vercel(`/v9/projects/${projectId}`, { method: 'PATCH', body: JSON.stringify({ ssoProtection: null }) })
  const targets = ['production', 'preview', 'development']
  const captchaSecret = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')
  const envs = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL, 'plain'],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'encrypted'],
    ['NEXT_PUBLIC_TENANT_ID', syntheticTenantId, 'plain'],
    ['NEXT_PUBLIC_ADMIN_URL', 'https://admin.globle-trade.com', 'plain'],
    ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY, 'encrypted'],
    ['CAPTCHA_SECRET', captchaSecret, 'encrypted'],
    ['CAPTCHA_SITE_SCOPE', projectName, 'encrypted'],
    ['NEXT_PUBLIC_SITE_URL', `https://${projectName}.vercel.app`, 'plain'],
  ]
  for (const [key, value, type] of envs) await vercel(`/v10/projects/${projectId}/env`, { method: 'POST', body: JSON.stringify({ key, value, type, target: targets }) })

  const ghResponse = await fetch('https://api.github.com/repos/luqite-ux/changhong-shinelong', { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'Codex' } })
  const repo = await ghResponse.json()
  const branchResponse = await fetch('https://api.github.com/repos/luqite-ux/changhong-shinelong/branches/main', { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'Codex' } })
  const branch = await branchResponse.json()
  const deployment = await vercel('/v13/deployments', { method: 'POST', body: JSON.stringify({ name: projectName, project: projectId, target: 'production', gitSource: { type: 'github', repoId: repo.id, ref: 'main', sha: branch.commit.sha }, projectSettings: { framework: 'nextjs' } }) })
  let ready = deployment
  for (let attempt = 0; attempt < 24 && !['READY', 'ERROR', 'CANCELED'].includes(ready.readyState); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    ready = await vercel(`/v13/deployments/${deployment.id}`)
  }
  if (ready.readyState !== 'READY') throw new Error(`Synthetic deployment ended ${ready.readyState}`)
  const base = `https://${projectName}.vercel.app`
  const statusResponse = await fetch(`https://admin.globle-trade.com/api/public/service-status/${syntheticTenantId}?check=${Date.now()}`,{cache:'no-store'})
  const statusBody = await statusResponse.json().catch(() => null)
  evidence.checks.publicExpiredStatus = { result: statusResponse.status === 200 && statusBody?.available === false && statusBody?.status === 'expired' ? 'PASS' : 'FAIL', status: statusResponse.status, body: statusBody }
  const expired = await fetch(base, { redirect: 'manual' })
  const expiredHtml = await expired.text()
  evidence.checks.simulatedExpired = { result: expired.status === 200 && expiredHtml.includes('Website service is temporarily unavailable') ? 'PASS' : 'FAIL', status: expired.status }
  const admin = await fetch(`${base}/admin/login`, { redirect: 'manual' })
  evidence.checks.adminReachable = { result: admin.status === 200 ? 'PASS' : 'FAIL', status: admin.status }

  const { error: renewalError } = await db.from('tenant_service_terms').update({ expires_on: '2099-12-31', enforcement_enabled: true }).eq('tenant_id', syntheticTenantId)
  if (renewalError) throw renewalError
  const { error: tenantRenewError } = await db.from('tenants').update({extra_settings:{...(synthetic.extra_settings||{}),service_expiry:{expires_on:'2099-12-31',enforcement_enabled:true,guard_version:'1'}}}).eq('id',syntheticTenantId)
  if (tenantRenewError) throw tenantRenewError
  const renewed = await fetch(base, { redirect: 'manual' })
  const renewedHtml = await renewed.text()
  evidence.checks.renewalRecovery = { result: renewed.status === 200 && renewedHtml.includes('Chanhong ShineLong') && !renewedHtml.includes('Website service is temporarily unavailable') ? 'PASS' : 'FAIL', status: renewed.status }
  const normal = await fetch('https://changhong-shinelong.vercel.app', { redirect: 'manual' })
  const normalHtml = await normal.text()
  evidence.checks.normal = { result: normal.status === 200 && normalHtml.includes('Chanhong ShineLong') ? 'PASS' : 'FAIL', status: normal.status }
  if (Object.values(evidence.checks).some((check) => check.result !== 'PASS')) throw new Error(`Guard verification failed: ${JSON.stringify(evidence.checks)}`)
} finally {
  if (projectId) {
    try { await vercel(`/v9/projects/${projectId}`, { method: 'DELETE' }); evidence.cleanup.vercelProject = 'DELETED' } catch (error) { evidence.cleanup.vercelProject = `FAILED: ${error.message}` }
  }
  const { error: termDeleteError } = await db.from('tenant_service_terms').delete().eq('tenant_id', syntheticTenantId)
  const { error: tenantDeleteError } = await db.from('tenants').delete().eq('id', syntheticTenantId)
  const [{ count: termCount }, { count: tenantCount }] = await Promise.all([
    db.from('tenant_service_terms').select('*', { count: 'exact', head: true }).eq('tenant_id', syntheticTenantId),
    db.from('tenants').select('*', { count: 'exact', head: true }).eq('id', syntheticTenantId),
  ])
  evidence.cleanup.serviceTermRows = termDeleteError ? -1 : termCount
  evidence.cleanup.tenantRows = tenantDeleteError ? -1 : tenantCount
  writeFileSync('D:/Cursor/Grand/changhong-shinelong/deliverables/evidence/service-expiry-production-verification.json', JSON.stringify(evidence, null, 2) + '\n')
}

console.log(JSON.stringify({ checks: evidence.checks, cleanup: evidence.cleanup }))
