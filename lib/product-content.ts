const BLOCK_BREAKS = /<\/?(?:p|div|section|article|h[1-6]|li|ul|ol|blockquote|pre|table|tr|br)\b[^>]*>/gi
const TAGS = /<[^>]+>/g

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
}
function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))
    return HTML_ENTITIES[entity.toLowerCase()] ?? match
  })
}

export function toPlainTextParagraphs(value: string | null | undefined) {
  if (!value) return []
  return decodeHtmlEntities(value.replace(BLOCK_BREAKS, "\n").replace(TAGS, ""))
    .split(/\n+/)
    .map(paragraph => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
}

export function productOptionLabel(code: string, name: string, locale: "en" | "zh" | "ru") {
  const safeCode = code.trim()
  const safeName = name.trim() || safeCode
  if (locale === "ru") return safeName
  if (!safeCode || safeName.toLocaleLowerCase().includes(safeCode.toLocaleLowerCase())) return safeName
  return `${safeCode} — ${safeName}`
}

