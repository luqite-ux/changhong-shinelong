"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navigation } from "@/lib/site-config"
import { localeFromPathname, localizedPath, navigationRu, navigationZh, stripLocalePrefix } from "@/lib/locale"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const items = locale === "zh" ? navigationZh : locale === "ru" ? navigationRu : navigation
  const basePath = stripLocalePrefix(pathname)
  const menuLabel = open
    ? locale === "zh" ? "关闭导航菜单" : locale === "ru" ? "Закрыть меню" : "Close navigation menu"
    : locale === "zh" ? "打开导航菜单" : locale === "ru" ? "Открыть меню" : "Open navigation menu"

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={menuLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div className="fixed inset-x-0 top-[var(--header-h,64px)] z-40 border-t border-border bg-background">
          <nav aria-label="Mobile" className="flex flex-col p-4">
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-sm px-3 py-3 text-base font-medium transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href={`${localizedPath("/contact", locale)}#rfq`}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
            >
              {locale === "zh" ? "获取报价" : locale === "ru" ? "Запросить предложение" : "Request a Quote"}
            </Link>
            <div className="mt-4 flex gap-2 border-t pt-4" aria-label="Language selector">
              {[{ code: "en" as const, label: "EN", lang: "en" }, { code: "zh" as const, label: "中文", lang: "zh-CN" }, { code: "ru" as const, label: "RU", lang: "ru" }].map((item) => (
                <a key={item.code} href={localizedPath(basePath, item.code)} hrefLang={item.lang} lang={item.lang} aria-current={locale === item.code ? "page" : undefined} className={`flex-1 rounded-sm border px-3 py-2 text-center text-sm font-medium ${locale === item.code ? "border-primary text-primary" : ""}`}>{item.label}</a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
