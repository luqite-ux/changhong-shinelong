"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Factory, Gauge, Layers3 } from "lucide-react"

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
    <section aria-label="Featured highlights" className="relative overflow-hidden border-b border-white/10 bg-graphite text-white">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-technical-cyan/25 blur-3xl" />
      <div className="relative">
        {slides.map((slide, index) => {
          const isActive = index === active
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={isActive ? "block" : "hidden"}
            >
              <div className="relative mx-auto min-h-[680px] max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:min-h-[640px] lg:px-8 lg:py-20">
                <div className="relative z-20 max-w-2xl lg:pt-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-technical-cyan-light">
                    {slide.eyebrow}
                  </p>
                  <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[3.25rem]">
                    {slide.heading}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{slide.description}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={slide.ctaHref} className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-technical-cyan-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      {slide.ctaLabel}<ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    <span className="text-sm text-white/65">Application-led configuration support</span>
                  </div>
                  <div className="mt-10 hidden max-w-xl grid-cols-3 gap-3 sm:grid">
                    {[{Icon:Layers3,label:"16 product families"},{Icon:Factory,label:"5 production areas"},{Icon:Gauge,label:"MOQ from 1 unit"}].map(({Icon,label})=><div key={label} className="flex items-center gap-2 border-l border-white/20 pl-3 text-xs text-white/70"><Icon className="size-4 text-technical-cyan-light" aria-hidden="true"/>{label}</div>)}
                  </div>
                </div>

                <div
                  key={`${slide.id}-${isActive}`}
                  className={`hero-product-stage relative z-10 mt-10 aspect-[5/3] w-full overflow-hidden rounded-sm border border-white/10 bg-[radial-gradient(circle_at_60%_45%,rgba(44,164,200,.24),rgba(21,27,37,.92)_48%,rgba(15,20,28,1)_78%)] lg:absolute lg:bottom-12 lg:right-8 lg:mt-0 lg:h-[34rem] lg:w-[58%] ${isActive ? "iris-reveal is-revealed" : ""}`}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-gradient-to-r from-graphite via-graphite/85 to-transparent lg:w-2/5" />
                  <Image
                    src={slide.image.src || "/placeholder.svg"}
                    alt={slide.image.alt}
                    fill
                    priority={index === 0}
                    className={`object-contain p-4 sm:p-8 lg:p-10 ${slide.id === "factory" ? "object-cover !p-0 opacity-70" : "drop-shadow-[0_28px_30px_rgba(0,0,0,.35)]"}`}
                    style={{ objectPosition: slide.focus ?? (slide.id === "factory" ? "center" : "72% center") }}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-30 mx-auto -mt-1 flex max-w-7xl justify-center gap-2 px-4 pb-7 sm:justify-start sm:px-6 lg:-mt-16 lg:px-8">
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
