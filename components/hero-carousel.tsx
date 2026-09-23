"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export type HeroSlide = {
  id: string
  eyebrow: string
  heading: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: { src: string; alt: string }
  mobileImage: { src: string; alt: string }
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)

  return (
    <section aria-label="Featured highlights" className="relative overflow-hidden border-b border-white/10 bg-graphite text-white">
      {slides.map((slide, index) => {
        const isActive = index === active
        return (
          <div key={slide.id} aria-hidden={!isActive} className={isActive ? "relative block" : "hidden"}>
            <Image src={slide.image.src} alt={slide.image.alt} fill priority={index === 0} className="hidden object-cover lg:block" sizes="100vw" />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-graphite via-graphite/35 to-transparent lg:block" />

            <div className="relative mx-auto min-h-[690px] max-w-7xl px-4 pb-9 pt-14 sm:px-6 lg:min-h-[640px] lg:px-8 lg:py-20">
              <div className="relative z-10 max-w-xl lg:pt-9">
                <p className="text-sm font-semibold uppercase tracking-wider text-technical-cyan-light">{slide.eyebrow}</p>
                <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[3.25rem]">{slide.heading}</h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">{slide.description}</p>
                <Link href={slide.ctaHref} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-technical-cyan-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  {slide.ctaLabel}<ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="hero-product-stage relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 bg-[#f3f6f7] lg:hidden">
                <Image src={slide.mobileImage.src} alt={slide.mobileImage.alt} fill priority={index === 0} className="object-contain" sizes="calc(100vw - 2rem)" />
              </div>
            </div>
          </div>
        )
      })}

      <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl justify-center gap-2 px-4 sm:justify-start sm:px-6 lg:px-8">
        {slides.map((slide, index) => (
          <button key={slide.id} type="button" onClick={() => setActive(index)} aria-label={`Show ${slide.eyebrow} highlight`} aria-pressed={index === active} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-technical-cyan-light" : "w-4 bg-white/35 hover:bg-white/60"}`} />
        ))}
      </div>
    </section>
  )
}
