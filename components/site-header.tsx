"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { navigation } from "@/lib/site-config"
import { navigationZh } from "@/lib/locale"

export function SiteHeader() {
  const pathname = usePathname()
  const locale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en"
  const items = locale === "zh" ? navigationZh : navigation
  const peerPath = locale === "zh" ? pathname.replace(/^\/zh(?=\/|$)/, "") || "/" : pathname === "/" ? "/zh" : `/zh${pathname}`

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href={locale === "zh" ? "/zh" : "/"} className="flex items-center gap-2 shrink-0" aria-label={locale === "zh" ? "常宏祥隆首页" : "Chanhong ShineLong home"}>
          <Image
            src="/images/logo-transparent.png"
            alt="Chanhong ShineLong company logo"
            width={220}
            height={118}
            className="h-14 w-auto max-w-[200px] object-contain sm:h-[4.5rem] sm:max-w-[240px]"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href={locale === "zh" ? "/zh/contact#rfq" : "/contact#rfq"}>{locale === "zh" ? "获取报价" : "Request a Quote"}</Link>
          </Button>
        </div>

        <a href={peerPath} hrefLang={locale === "zh" ? "en" : "zh-CN"} lang={locale === "zh" ? "en" : "zh-CN"} className="rounded-sm border px-2.5 py-2 text-sm font-medium hover:border-primary">{locale === "zh" ? "EN" : "中文"}</a>

        <MobileNav />
      </div>
    </header>
  )
}
