import { siteConfig } from "@/lib/site-config"

export type SiteLocale = "en" | "zh" | "ru"

export const SITE_LOCALES: readonly SiteLocale[] = ["en", "zh", "ru"] as const

export function localeFromPathname(pathname: string): SiteLocale {
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return "zh"
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru"
  return "en"
}

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(?:zh|ru)(?=\/|$)/, "")
  return stripped || "/"
}

export function localizedPath(path: string, locale: SiteLocale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const base = stripLocalePrefix(normalized)
  if (locale === "en") return base
  return base === "/" ? `/${locale}` : `/${locale}${base}`
}

export function htmlLangForLocale(locale: SiteLocale): string {
  if (locale === "zh") return "zh-CN"
  if (locale === "ru") return "ru"
  return "en"
}

export function ogLocaleForLocale(locale: SiteLocale): string {
  if (locale === "zh") return "zh_CN"
  if (locale === "ru") return "ru_RU"
  return "en_US"
}

export function multilingualAlternates(path: string, locale: SiteLocale) {
  const en = `${siteConfig.siteUrl}${localizedPath(path, "en")}`
  const zh = `${siteConfig.siteUrl}${localizedPath(path, "zh")}`
  const ru = `${siteConfig.siteUrl}${localizedPath(path, "ru")}`
  const canonical = locale === "zh" ? zh : locale === "ru" ? ru : en
  return {
    canonical,
    languages: {
      en,
      "zh-CN": zh,
      ru,
      "x-default": en,
    },
  }
}

export const navigationZh = [
  { label: "首页", href: "/zh" },
  { label: "产品中心", href: "/zh/products" },
  { label: "应用领域", href: "/zh/applications" },
  { label: "生产制造", href: "/zh/manufacturing" },
  { label: "关于我们", href: "/zh/about" },
  { label: "新闻资讯", href: "/zh/news" },
  { label: "联系我们", href: "/zh/contact" },
] as const

export const navigationRu = [
  { label: "Главная", href: "/ru" },
  { label: "Продукция", href: "/ru/products" },
  { label: "Применение", href: "/ru/applications" },
  { label: "Производство", href: "/ru/manufacturing" },
  { label: "О компании", href: "/ru/about" },
  { label: "Новости", href: "/ru/news" },
  { label: "Контакты", href: "/ru/contact" },
] as const
