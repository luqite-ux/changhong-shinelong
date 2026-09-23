"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { navigation } from "@/lib/site-config"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Chanhong ShineLong home">
          <Image
            src="/images/logo.png"
            alt="Chanhong ShineLong company logo"
            width={160}
            height={64}
            className="h-12 w-auto max-w-[190px] object-contain sm:h-14"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
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
            <Link href="/contact#rfq">Request a Quote</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  )
}
