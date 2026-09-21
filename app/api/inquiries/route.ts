import {
  createSupabaseCaptchaContextFromEnv,
  verifyCaptchaSubmission,
} from '@/lib/inquiry-captcha'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' }

type InquiryBody = {
  name?: unknown
  email?: unknown
  phone?: unknown
  company?: unknown
  subject?: unknown
  message?: unknown
  captchaScope?: unknown
  captchaToken?: unknown
  captchaAnswer?: unknown
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as InquiryBody | null
  const secret = process.env.CAPTCHA_SECRET?.trim()
  if (!secret) return Response.json({ message: 'Verification service is temporarily unavailable.' }, { status: 503, headers: NO_STORE_HEADERS })
  const captchaScope = text(body?.captchaScope, 160)
  const captchaToken = text(body?.captchaToken, 4096)
  const captchaAnswer = text(body?.captchaAnswer, 16)

  let captcha: Awaited<ReturnType<typeof verifyCaptchaSubmission>>
  try {
    const { tenantId, siteScope, store } = createSupabaseCaptchaContextFromEnv()
    captcha = await verifyCaptchaSubmission({
      secret,
      tenantId,
      siteScope,
      store,
      scope: captchaScope,
      token: captchaToken,
      answer: captchaAnswer,
    })
  } catch {
    return Response.json({ message: 'Verification service is temporarily unavailable.' }, { status: 503, headers: NO_STORE_HEADERS })
  }
  if (!captcha.ok) return Response.json({ message: 'The verification code is incorrect or expired. Please try again.' }, { status: 400, headers: NO_STORE_HEADERS })

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim() ?? ''
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '') ?? ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ''
  const inquiry = {
    tenant_id: tenantId,
    name: text(body?.name, 200),
    email: text(body?.email, 320),
    phone: text(body?.phone, 80) || null,
    company: text(body?.company, 200) || null,
    subject: text(body?.subject, 300) || null,
    message: text(body?.message, 10_000),
  }
  if (!tenantId || !supabaseUrl || !serviceRoleKey || !inquiry.name || !inquiry.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return Response.json({ message: 'Please complete all required inquiry fields.' }, { status: 400, headers: NO_STORE_HEADERS })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await supabase.from('inquiries').insert(inquiry).select('id').single()
  if (error) return Response.json({ message: 'Submission failed. Please try again.' }, { status: 503, headers: NO_STORE_HEADERS })
  return Response.json({ message: 'Inquiry submitted.', reference: data.id }, { status: 201, headers: NO_STORE_HEADERS })
}
