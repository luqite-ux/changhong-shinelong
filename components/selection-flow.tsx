"use client"

import { useEffect, useRef, useState } from "react"

const steps = [
  { label: "Purpose", detail: "Discharge, metering, crushing or transfer function" },
  { label: "Material", detail: "Bulk material type, particle size and abrasiveness" },
  { label: "Capacity", detail: "Required throughput and duty cycle" },
  { label: "Pressure", detail: "Operating pressure and air-seal requirement" },
  { label: "Motor", detail: "Drive power, mounting and control preference" },
] as const

/**
 * Material-selection flow path (MOT-CHXL-03). Desktop lays the path out
 * horizontally, 390px stacks it vertically. The connecting line draws in
 * once the section enters the viewport; under reduced motion the complete
 * static path is shown immediately.
 */
export function SelectionFlow() {
  const ref = useRef<HTMLOListElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <ol
      ref={ref}
      className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
    >
      <li
        aria-hidden="true"
        className={`absolute left-3 top-3 h-[calc(100%-1.5rem)] w-px bg-border origin-top transition-transform duration-700 ease-out sm:left-0 sm:right-0 sm:top-3 sm:h-px sm:w-full sm:origin-left ${
          isRevealed ? "scale-y-100 sm:scale-x-100" : "scale-y-0 sm:scale-x-0"
        }`}
      />
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex flex-1 gap-4 sm:flex-col sm:gap-3">
          <span
            className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-semibold text-primary transition-colors duration-300 ${
              isRevealed ? "bg-primary text-primary-foreground" : ""
            }`}
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{step.label}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
