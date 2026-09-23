import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { siteConfig } from '@/lib/site-config'

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
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: siteConfig.brandName, title: 'Chanhong ShineLong | Rotary Valves, Screw Conveyors & Crushing Valves', description: 'Rotary valves, screw conveyors and electric crushing valves for overseas B2B material-handling applications.', images: [{ url: '/images/ai-banners/product-family-hero-v2.png', width: 1536, height: 1024, alt: 'Chanhong ShineLong rotary valve product family' }] },
  twitter: { card: 'summary_large_image', images: ['/images/ai-banners/product-family-hero-v2.png'] },
  icons: {
    icon: [{ url: '/images/logo-transparent.png', type: 'image/png' }],
    apple: [{ url: '/images/logo-transparent.png', type: 'image/png' }],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':`${siteConfig.siteUrl}/#organization`,name:siteConfig.legalNameEn,alternateName:siteConfig.brandName,url:siteConfig.siteUrl,logo:`${siteConfig.siteUrl}/images/logo-transparent.png`,email:siteConfig.email,telephone:siteConfig.phone,address:{'@type':'PostalAddress',streetAddress:siteConfig.addressEn,addressCountry:'CN'}},{'@type':'WebSite','@id':`${siteConfig.siteUrl}/#website`,url:siteConfig.siteUrl,name:siteConfig.brandName,publisher:{'@id':`${siteConfig.siteUrl}/#organization`},inLanguage:'en'}]})}} />
        <SiteHeader />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
