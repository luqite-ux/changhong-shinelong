import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"
import { navigation, siteConfig } from "@/lib/site-config"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const copyrightOwner = siteConfig.legalNameEn.replace(/[\s.;:!?。；：！？]+$/u, '')

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Chanhong ShineLong home" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Chanhong ShineLong company logo"
                width={160}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Manufacturer of rotary valves/airlocks, screw conveyors and electric crushing valves since{" "}
              {siteConfig.foundedYear}, serving grain, food, feed, chemical, petrochemical, pharmaceutical, drying,
              environmental protection, dust collection and new-energy applications.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Site</h2>
            <ul className="mt-4 space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-foreground">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground break-all">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{siteConfig.addressEn}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {copyrightOwner}. All rights reserved.
          </p>
          <p className="text-muted-foreground/80">{siteConfig.legalNameZh}</p>
          <Link href="/media-library" className="text-muted-foreground/80 hover:text-foreground">
            Customer media &amp; catalogue archive
          </Link>
        </div>
      </div>
    </footer>
  )
}
