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
export function RfqForm({ defaultTopic, productOptions = [] }: { defaultTopic?: string; productOptions?: Array<{slug:string;label:string}> }) {
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
    if(response?.ok){setStatus('success');setMessage(`Inquiry submitted${result.reference?` — reference ${result.reference}`:''}.`);form.reset()}else{setStatus('error');setMessage(result.message??'Submission failed. Please try again.')}
    setCaptchaRefreshKey(x=>x+1)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-describedby="rfq-status">
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" name="name" required autoComplete="name" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <Input id="company" name="company" required autoComplete="organization" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="phone">Phone / WhatsApp</FieldLabel>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="product">Target product</FieldLabel>
          <Select name="product" defaultValue={defaultTopic}>
            <SelectTrigger id="product" className="w-full">
              <SelectValue placeholder="Select a product family (optional)" />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.label}
                </SelectItem>
              ))}
              <SelectItem value="not-sure">Not sure — need selection support</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="material">Material / application</FieldLabel>
          <Input
            id="material"
            name="material"
            placeholder="e.g. stainless steel, food-grade powder, lithium battery material"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacity">Capacity / specification requirements</FieldLabel>
          <Input id="capacity" name="capacity" placeholder="e.g. throughput, pressure, flange size, motor power" />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" name="message" rows={5} required />
        </Field>

        <InquiryCaptchaField refreshKey={captchaRefreshKey} className="rounded-sm border bg-muted/40 p-4" />
      </FieldGroup>

      <div>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Processing
            </>
          ) : (
            "Submit inquiry"
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
