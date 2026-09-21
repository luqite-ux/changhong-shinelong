"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

type FactoryVideoProps = {
  /**
   * Path to the customer-still montage video. Left undefined until Codex
   * integrates the derived factory-still montage — the component renders a
   * static poster with a disabled control affordance instead of a black
   * empty player.
   */
  src?: string
  poster: string
  posterAlt: string
}

/**
 * 16:9 (desktop) / 16:10 (mobile) customer-factory video slot.
 * Never autoplays with sound, pauses when scrolled out of view or the page
 * is hidden, and always shows a static poster fallback. Controls remain
 * available at all times (MOT-CHXL-04).
 */
export function FactoryVideo({ src, poster, posterAlt }: FactoryVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container || !hasStarted) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            video.pause()
          }
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(container)

    const handleVisibility = () => {
      if (document.hidden) video.pause()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [hasStarted])

  return (
    <div
      ref={containerRef}
      className="relative aspect-video overflow-hidden rounded-sm border border-border bg-card sm:aspect-video"
    >
      {src && hasStarted ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          controls
          muted
          playsInline
          poster={poster}
          autoPlay
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <button
          type="button"
          onClick={() => src && setHasStarted(true)}
          disabled={!src}
          aria-label={src ? "Play factory manufacturing video" : "Factory video coming soon"}
          className="group relative flex h-full w-full items-center justify-center disabled:cursor-default"
        >
          <Image
            src={poster || "/placeholder.svg"}
            alt={posterAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <span className="absolute inset-0 bg-graphite/25 transition-opacity group-hover:bg-graphite/35" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-transform group-hover:scale-105 group-focus-visible:scale-105">
            <Play className="size-6 fill-current" aria-hidden="true" />
          </span>
          {!src && (
            <span className="absolute bottom-3 left-3 rounded-sm bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
              Manufacturing montage — integration in progress
            </span>
          )}
        </button>
      )}
    </div>
  )
}
