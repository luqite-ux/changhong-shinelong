export type SiteLocale = "en" | "zh"

export function localizedPath(path: string, locale: SiteLocale) {
  if (locale === "en") return path || "/"
  if (!path || path === "/") return "/zh"
  return `/zh${path.startsWith("/") ? path : `/${path}`}`
}

export const navigationZh = [
  { label: "首页", href: "/zh" },
  { label: "产品", href: "/zh/products" },
  { label: "应用领域", href: "/zh/applications" },
  { label: "生产制造", href: "/zh/manufacturing" },
  { label: "关于我们", href: "/zh/about" },
  { label: "新闻", href: "/zh/news" },
  { label: "联系我们", href: "/zh/contact" },
] as const

export function bilingualAlternates(path: string, locale: SiteLocale) {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      en: localizedPath(path, "en"),
      "zh-CN": localizedPath(path, "zh"),
      "x-default": localizedPath(path, "en"),
    },
  }
}
