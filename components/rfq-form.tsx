"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"

type SubmitState = "idle" | "submitting" | "success" | "error"

/**
 * RFQ intake form. No pricing/cart/checkout. Submission does not fake a
 * backend response — Codex connects Supabase storage and the CAPTCHA
 * verification after handoff, so the form honestly reports that state
 * instead of simulating success.
 */
export function RfqForm({ defaultTopic, productOptions = [], locale = "en" }: { defaultTopic?: string; productOptions?: Array<{slug:string;label:string}>; locale?: "en" | "zh" }) {
  const [status, setStatus] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form=event.currentTarget
    const data=new FormData(form)
    setStatus("submitting");setMessage("")
    const response=await fetch('/api/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:data.get('name'),company:data.get('company'),email:data.get('email'),phone:data.get('phone'),subject:data.get('product')?`Product inquiry: ${data.get('product')}`:'Website inquiry',message:[data.get('message'),data.get('material')&&`Material / application: ${data.get('material')}`,data.get('capacity')&&`Capacity / specification: ${data.get('capacity')}`].filter(Boolean).join('\n\n'),captchaScope:data.get('captchaScope'),captchaToken:data.get('captchaToken'),captchaAnswer:data.get('captchaAnswer')})}).catch(()=>null)
    const result=response?await response.json().catch(()=>({})):{}
    if(response?.ok){setStatus('success');setMessage(locale === 'zh' ? `询盘已提交${result.reference?`，编号 ${result.reference}`:''}。` : `Inquiry submitted${result.reference?` — reference ${result.reference}`:''}.`);form.reset()}else{setStatus('error');setMessage(locale === 'zh' ? '提交失败，请检查信息并重试。' : (result.message??'Submission failed. Please try again.'))}
    setCaptchaRefreshKey(x=>x+1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-describedby="rfq-status">
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="name">{locale === "zh" ? "姓名" : "Full name"}</FieldLabel>
          <Input id="name" name="name" required autoComplete="name" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="company">{locale === "zh" ? "公司" : "Company"}</FieldLabel>
          <Input id="company" name="company" required autoComplete="organization" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="email">{locale === "zh" ? "电子邮箱" : "Email"}</FieldLabel>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="phone">{locale === "zh" ? "电话" : "Phone / WhatsApp"}</FieldLabel>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="product">{locale === "zh" ? "意向产品" : "Target product"}</FieldLabel>
          <Select name="product" defaultValue={defaultTopic}>
            <SelectTrigger id="product" className="w-full">
              <SelectValue placeholder={locale === "zh" ? "选择产品系列（可选）" : "Select a product family (optional)"} />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.label}
                </SelectItem>
              ))}
              <SelectItem value="not-sure">{locale === "zh" ? "尚不确定，需要选型建议" : "Not sure — need selection support"}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="material">{locale === "zh" ? "物料／应用场景" : "Material / application"}</FieldLabel>
          <Input
            id="material"
            name="material"
            placeholder={locale === "zh" ? "例如：食品粉料、锂电材料及其磨蚀性或粘性" : "e.g. stainless steel, food-grade powder, lithium battery material"}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacity">{locale === "zh" ? "产能／规格要求" : "Capacity / specification requirements"}</FieldLabel>
          <Input id="capacity" name="capacity" placeholder={locale === "zh" ? "例如：吞吐量、温度与压力、法兰尺寸、电机与减速机" : "e.g. throughput, temperature and pressure, flange size, motor and reducer"} />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">{locale === "zh" ? "需求说明" : "Message"}</FieldLabel>
          <Textarea id="message" name="message" rows={5} required />
        </Field>

        <InquiryCaptchaField refreshKey={captchaRefreshKey} locale={locale} className="rounded-sm border bg-muted/40 p-4" />
      </FieldGroup>

      <div>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {locale === "zh" ? "提交中" : "Processing"}
            </>
          ) : (
            locale === "zh" ? "提交询盘" : "Submit inquiry"
          )}
        </Button>
      </div>

      <div id="rfq-status" role="status" aria-live="polite">
        {status === "success" && <div className="flex items-start gap-2 rounded-sm border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 size-4 shrink-0"/><p>{message}</p></div>}
        {status === "error" && <div className="flex items-start gap-2 rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-900"><AlertCircle className="mt-0.5 size-4 shrink-0"/><p>{message}</p></div>}
      </div>
    </form>
  )
}
