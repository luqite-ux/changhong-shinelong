"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { navigation } from "@/lib/site-config"
import { localeFromPathname, localizedPath, navigationRu, navigationZh, stripLocalePrefix } from "@/lib/locale"

export function SiteHeader() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const items = locale === "zh" ? navigationZh : locale === "ru" ? navigationRu : navigation
  const basePath = stripLocalePrefix(pathname)
  const quoteHref = `${localizedPath("/contact", locale)}#rfq`

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href={localizedPath("/", locale)} className="flex items-center gap-2 shrink-0" aria-label={locale === "zh" ? "常宏祥隆首页" : locale === "ru" ? "Главная страница Chanhong ShineLong" : "Chanhong ShineLong home"}>
          <Image
            src="/images/logo-transparent.png"
            alt="Chanhong ShineLong company logo"
            width={220}
            height={118}
            className="h-14 w-auto max-w-[200px] object-contain sm:h-[4.5rem] sm:max-w-[240px]"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
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

        <div className="hidden lg:block">
          <Button asChild size="sm">
            <Link href={quoteHref}>{locale === "zh" ? "获取报价" : locale === "ru" ? "Запросить предложение" : "Request a Quote"}</Link>
          </Button>
        </div>

        <div className="hidden items-center gap-1 lg:flex" aria-label="Language selector">
          {[{ code: "en" as const, label: "EN", lang: "en" }, { code: "zh" as const, label: "中文", lang: "zh-CN" }, { code: "ru" as const, label: "RU", lang: "ru" }].map((item) => (
            <a key={item.code} href={localizedPath(basePath, item.code)} hrefLang={item.lang} lang={item.lang} aria-current={locale === item.code ? "page" : undefined} className={`rounded-sm border px-2 py-2 text-xs font-medium hover:border-primary ${locale === item.code ? "border-primary text-primary" : ""}`}>{item.label}</a>
          ))}
        </div>

        <MobileNav />
      </div>
    </header>
  )
}
