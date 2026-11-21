import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { siteConfig } from '@/lib/site-config'
import { headers } from 'next/headers'
import { htmlLangForLocale, localeFromPathname, multilingualAlternates, type SiteLocale } from '@/lib/locale'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Chanhong ShineLong | Rotary Valves, Screw Conveyors & Crushing Valves',
    template: '%s | Chanhong ShineLong',
  },
  description:
    'Chanhong ShineLong manufactures rotary valves/airlocks, screw conveyors and electric crushing valves for grain, food, feed, chemical, petrochemical, pharmaceutical, drying, dust collection and new-energy applications. OEM/ODM and non-standard customization, MOQ 1 unit.',
  alternates: multilingualAlternates('/', 'en'),
  openGraph: { type: 'website', url: '/', siteName: siteConfig.brandName, title: 'Chanhong ShineLong | Rotary Valves, Screw Conveyors & Crushing Valves', description: 'Rotary valves, screw conveyors and electric crushing valves for overseas B2B material-handling applications.', images: [{ url: '/images/ai-banners/product-family-hero-v2.png', width: 1536, height: 1024, alt: 'Chanhong ShineLong rotary valve product family' }] },
  twitter: { card: 'summary_large_image', images: ['/images/ai-banners/product-family-hero-v2.png'] },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#12161d' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerLocale = (await headers()).get('x-site-locale')
  const locale: SiteLocale = headerLocale === 'zh' || headerLocale === 'ru' ? headerLocale : localeFromPathname('/')
  return (
    <html lang={htmlLangForLocale(locale)}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':`${siteConfig.siteUrl}/#organization`,name:locale === 'zh' ? siteConfig.legalNameZh : siteConfig.legalNameEn,alternateName:siteConfig.brandName,url:siteConfig.siteUrl,logo:`${siteConfig.siteUrl}/images/logo-transparent.png`,email:siteConfig.email,telephone:siteConfig.phone,address:{'@type':'PostalAddress',streetAddress:locale === 'zh' ? siteConfig.addressZh : locale === 'ru' ? siteConfig.addressRu : siteConfig.addressEn,addressCountry:'CN'}},{'@type':'WebSite','@id':`${siteConfig.siteUrl}/#website`,url:siteConfig.siteUrl,name:locale === 'zh' ? siteConfig.legalNameZh : siteConfig.brandName,publisher:{'@id':`${siteConfig.siteUrl}/#organization`},inLanguage:htmlLangForLocale(locale)}]})}} />
        <SiteHeader />
        {children}
        <SiteFooter locale={locale} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
