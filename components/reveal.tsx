"use client"

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react"

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  delayMs?: number
  variant?: "fade-up" | "iris"
}

/**
 * Bounded, once-only viewport reveal (MOT-CHXL-02).
 * Uses IntersectionObserver; content is visible by default (no JS / animation
 * failure keeps base content shown), and prefers-reduced-motion is handled
 * purely in CSS (see .reveal rules in globals.css).
 */
export function Reveal({ children, as: Tag = "div", className = "", delayMs = 0, variant = "fade-up" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Comp = Tag as ElementType

  return (
    <Comp
      ref={ref}
      className={`${variant === "iris" ? "iris-reveal" : "reveal"} ${isRevealed ? "is-revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Comp>
  )
}
