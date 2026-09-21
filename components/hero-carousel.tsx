"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export type HeroSlide = {
  id: string
  eyebrow: string
  heading: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: { src: string; alt: string }
  focus?: string
}

/**
 * Three hero themes: product recognition, manufacturing proof, and
 * application/selection support. The first slide renders as real, visible
 * DOM content with no JS dependency; switching slides is a progressive
 * enhancement (MOT-CHXL-01 iris reveal on the active product image).
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)

  return (
    <section aria-label="Featured highlights" className="relative overflow-hidden border-b border-border bg-graphite">
      <div className="relative">
        {slides.map((slide, index) => {
          const isActive = index === active
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={isActive ? "block" : "hidden"}
            >
              <div className="relative mx-auto grid min-h-[520px] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:min-h-[600px] lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
                <div className="relative z-10 max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-wider text-technical-cyan-light">
                    {slide.eyebrow}
                  </p>
                  <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[3.25rem]">
                    {slide.heading}
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">{slide.description}</p>
                  <div className="mt-8">
                    <Button asChild size="lg">
                      <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                    </Button>
                  </div>
                </div>

                <div
                  key={`${slide.id}-${isActive}`}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-white lg:aspect-[5/4] ${isActive ? "iris-reveal is-revealed" : ""}`}
                >
                  <Image
                    src={slide.image.src || "/placeholder.svg"}
                    alt={slide.image.alt}
                    fill
                    priority={index === 0}
                    className="object-contain p-6"
                    style={{ objectPosition: slide.focus ?? "center" }}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl justify-center gap-2 px-4 pb-6 sm:justify-start sm:px-6 lg:px-8">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${slide.eyebrow} highlight`}
            aria-pressed={index === active}
            className={`h-1.5 rounded-full transition-all ${
              index === active ? "w-8 bg-technical-cyan-light" : "w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
