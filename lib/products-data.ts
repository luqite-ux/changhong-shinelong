import type { ProductFamily, ProductImage } from "./types"

const pendingImage = (label: string): ProductImage => ({
  src: `/placeholder.svg?height=480&width=640&query=${encodeURIComponent(label)}`,
  alt: `${label} — family visual pending catalogue integration`,
  status: "pending",
})

const commonMaterials = ["Cast iron", "Carbon steel", "Stainless steel"]
const commonCustomization = ["OEM/ODM", "Non-standard sizing on request", "MOQ 1 unit"]

export const productFamilies: ProductFamily[] = [
  {
    slug: "tgf",
    code: "TGF",
    name: { en: "TGF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "General-purpose rotary valve for controlled material discharge under hoppers, bins and dust collectors.",
    },
    description: [
      {
        en: "The TGF family is Chanhong ShineLong's baseline rotary valve, used to meter and discharge bulk material while limiting air ingress between a hopper or silo and downstream conveying equipment.",
      },
      {
        en: "It is built from cast iron, carbon steel or stainless steel depending on the process, and can be configured to non-standard flange and rotor dimensions on request.",
      },
    ],
    industries: ["Grain", "Feed", "Chemical", "Drying", "Dust collection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Rotary discharge / airlock" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer, direct-coupled" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [
      { src: "/images/products/tgf-rotary-valve.jpeg", alt: "TGF rotary valve with direct-coupled motor drive", status: "available" },
    ],
    relatedSlugs: ["zgf", "zgb", "zgc"],
  },
  {
    slug: "zgf",
    code: "ZGF",
    name: { en: "ZGF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Standard-duty rotary valve for grain, feed and chemical powder discharge lines.",
    },
    description: [
      {
        en: "ZGF is a standard rotary valve body used across grain, feed and chemical process lines where consistent metering and a positive air seal are required beneath a hopper or cyclone.",
      },
      {
        en: "Housing and rotor materials follow the same cast iron, carbon steel or stainless steel options used across the catalogue.",
      },
    ],
    industries: ["Grain", "Feed", "Chemical", "Environmental protection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Rotary discharge / airlock" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zgf-rotary-valve.jpeg", alt: "ZGF rotary valve", status: "available" }],
    relatedSlugs: ["tgf", "zgfwe-zgfwf", "zgb"],
  },
  {
    slug: "zgfwe-zgfwf",
    code: "ZGFWE / ZGFWF",
    name: { en: "ZGFWE / ZGFWF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Multi-outlet configuration valve for distributing discharge across several downstream lines.",
    },
    description: [
      {
        en: "The ZGFWE / ZGFWF configuration groups a rotary valve body with multiple downstream drive and outlet stations, suited to installations that need to split or stage discharge across several lines.",
      },
      {
        en: "Available in cast iron, carbon steel or stainless steel, with non-standard outlet arrangements available on request.",
      },
    ],
    industries: ["Chemical", "Petrochemical", "Pharmaceutical", "Dust collection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Multi-outlet rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Multiple motor + reducer stations" },
      { label: "Customization", value: "OEM/ODM, non-standard outlet count" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [
      { src: "/images/products/zgfwe-zgfwf-high-temperature.jpeg", alt: "ZGFWE / ZGFWF rotary valve with multiple drive stations", status: "available" },
    ],
    relatedSlugs: ["zgfe-zgff", "lgfwe-lgfwf", "zgf"],
  },
  {
    slug: "zgfe-zgff",
    code: "ZGFE / ZGFF",
    name: { en: "ZGFE / ZGFF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Enclosed-drive rotary valve variant for dust-sensitive and washdown-adjacent installations.",
    },
    description: [
      {
        en: "ZGFE / ZGFF pairs the standard rotary body with an enclosed drive arrangement, aimed at installations where the drive housing benefits from additional protection from ambient dust.",
      },
    ],
    industries: ["Food", "Pharmaceutical", "Feed", "Dust collection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Rotary discharge, enclosed drive" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Enclosed motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zgfe-zgff-rotary-valve.jpeg", alt: "ZGFE ZGFF rotary valve", status: "available" }],
    relatedSlugs: ["zgfwe-zgfwf", "lgfwe-lgfwf", "bzgfwf"],
  },
  {
    slug: "lgfwe-lgfwf",
    code: "LGFWE / LGFWF",
    name: { en: "LGFWE / LGFWF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Elongated-body rotary valve variant for longer discharge runs or wider inlet spans.",
    },
    description: [
      {
        en: "LGFWE / LGFWF extends the rotary valve body length relative to the standard ZGF-series footprint, supporting installations with a wider inlet span while keeping the same drive logic.",
      },
    ],
    industries: ["Grain", "Feed", "Chemical", "Drying"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Elongated-body rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard length" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/lgfwe-lgfwf-chain-drive.jpeg", alt: "LGFWE LGFWF rotary valve", status: "available" }],
    relatedSlugs: ["zgfe-zgff", "zgfwe-zgfwf", "bzgfwf"],
  },
  {
    slug: "bzgfwf",
    code: "BZGFWF",
    name: { en: "BZGFWF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Reinforced-body rotary valve configuration for higher-duty discharge points.",
    },
    description: [
      {
        en: "BZGFWF reinforces the standard rotary valve housing for installations with heavier duty cycles or coarser bulk material, while keeping the same cast iron, carbon steel or stainless steel material choice.",
      },
    ],
    industries: ["Chemical", "Petrochemical", "Environmental protection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Reinforced rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [
      { src: "/images/products/bzgfwf-pressure-conveying.jpeg", alt: "BZGFWF reinforced rotary valve with safety-yellow drive guard", status: "available" },
    ],
    relatedSlugs: ["lgfwe-lgfwf", "bzgfwk", "zfs"],
  },
  {
    slug: "zfs",
    code: "ZFS",
    name: { en: "ZFS Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Compact rotary valve variant for space-constrained installation points.",
    },
    description: [
      {
        en: "ZFS reduces the overall installed footprint of the rotary valve assembly for locations where headroom or lateral clearance beneath a hopper is limited.",
      },
    ],
    industries: ["Feed", "Food", "Chemical"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Compact rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zfs-rotary-valve.jpeg", alt: "ZFS rotary valve", status: "available" }],
    relatedSlugs: ["bzgfwf", "bzgfwk", "zgp"],
  },
  {
    slug: "bzgfwk",
    code: "BZGFWK",
    name: { en: "BZGFWK Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Reinforced multi-station rotary valve configuration for higher-duty distribution points.",
    },
    description: [
      {
        en: "BZGFWK combines the reinforced housing approach of the BZGFWF line with a multi-station outlet layout, for installations needing both durability and discharge distribution.",
      },
    ],
    industries: ["Chemical", "Petrochemical", "Dust collection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Reinforced multi-outlet rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Multiple motor + reducer stations" },
      { label: "Customization", value: "OEM/ODM, non-standard outlet count" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/bzgfwk-quick-clean.jpeg", alt: "BZGFWK rotary valve", status: "available" }],
    relatedSlugs: ["bzgfwf", "zfs", "zqx"],
  },
  {
    slug: "zgb",
    code: "ZGB",
    name: { en: "ZGB Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Base-mount rotary valve variant for standalone or skid-mounted installation.",
    },
    description: [
      {
        en: "ZGB is configured for standalone base-mount installation rather than direct flange mounting beneath a hopper, suited to skid-mounted or retrofit conveying layouts.",
      },
    ],
    industries: ["Grain", "Feed", "New energy (including lithium battery)"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Base-mount rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zgb-heavy-duty.jpeg", alt: "ZGB rotary valve", status: "available" }],
    relatedSlugs: ["tgf", "zqx", "zgp"],
  },
  {
    slug: "zqx",
    code: "ZQX",
    name: { en: "ZQX Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Rotary valve variant configured for finer powder and dust-collection duty.",
    },
    description: [
      {
        en: "ZQX is configured for finer powder handling, commonly positioned under cyclones and dust-collection hoppers where a consistent air seal matters as much as metering accuracy.",
      },
    ],
    industries: ["Dust collection", "Environmental protection", "Chemical"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Fine-powder rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zqx-rotary-valve.jpeg", alt: "ZQX rotary valve", status: "available" }],
    relatedSlugs: ["bzgfwk", "zgb", "zgp"],
  },
  {
    slug: "zgp",
    code: "ZGP",
    name: { en: "ZGP Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "General rotary valve variant configured for pharmaceutical and food-adjacent lines.",
    },
    description: [
      {
        en: "ZGP is specified with stainless steel construction most often, aimed at pharmaceutical, food and feed lines where cleanability of the housing and rotor is a priority.",
      },
    ],
    industries: ["Pharmaceutical", "Food", "Feed"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Rotary discharge, cleanable housing" },
      { label: "Material options", value: "Stainless steel (cast iron / carbon steel available)" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zgp-rotary-valve.jpeg", alt: "ZGP rotary valve", status: "available" }],
    relatedSlugs: ["zfs", "zqx", "zgc"],
  },
  {
    slug: "zgc",
    code: "ZGC",
    name: { en: "ZGC Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Rotary valve variant configured for higher-temperature drying-line duty.",
    },
    description: [
      {
        en: "ZGC is positioned for drying-line installations, where housing seals and rotor clearances are set for the thermal conditions typical of a drying process.",
      },
    ],
    industries: ["Drying", "Grain", "Chemical"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Drying-line rotary discharge" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/zgc-rotary-valve.jpeg", alt: "ZGC rotary valve", status: "available" }],
    relatedSlugs: ["tgf", "zgp", "qnlzgfwf"],
  },
  {
    slug: "qnlzgfwf",
    code: "QNLZGFWF",
    name: { en: "QNLZGFWF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Rotary valve configuration referenced for new-energy material lines, including lithium battery material handling.",
    },
    description: [
      {
        en: "QNLZGFWF is referenced in the selection manual against new-energy material lines, including lithium battery material handling, alongside the standard rotary discharge function.",
      },
    ],
    industries: ["New energy (including lithium battery)", "Chemical"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Rotary discharge, new-energy line reference" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor + reducer" },
      { label: "Customization", value: "OEM/ODM, non-standard sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/qnlzgfwf-lined.jpeg", alt: "QNLZGFWF lined rotary valve", status: "available" }],
    relatedSlugs: ["zgc", "tazgfwf", "zgfwe-zgfwf"],
  },
  {
    slug: "tazgfwf",
    code: "TAZGFWF",
    name: { en: "TAZGFWF Rotary Valve" },
    category: "rotary-valve",
    categoryLabel: { en: "Rotary Valve / Airlock" },
    summary: {
      en: "Titanium-alloy variant of the multi-outlet rotary valve configuration.",
    },
    description: [
      {
        en: "TAZGFWF is the titanium-alloy variant referenced in the selection manual, combined with the multi-outlet ZGFWF-series body for corrosive or high-purity material lines.",
      },
    ],
    industries: ["Chemical", "Petrochemical", "New energy (including lithium battery)"],
    materials: [...commonMaterials, "Titanium-alloy variants"],
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Multi-outlet rotary discharge, titanium-alloy variant" },
      { label: "Material options", value: "Titanium-alloy variant (cast iron / carbon steel / stainless steel also available)" },
      { label: "Drive", value: "Multiple motor + reducer stations" },
      { label: "Customization", value: "OEM/ODM, non-standard outlet count" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [{ src: "/images/products/tazgfwf-titanium.jpeg", alt: "TAZGFWF titanium-alloy rotary valve", status: "available" }],
    relatedSlugs: ["qnlzgfwf", "zgfwe-zgfwf", "bzgfwk"],
  },
  {
    slug: "screw-conveyor",
    code: "Screw Conveyor",
    name: { en: "Screw Conveyor" },
    category: "screw-conveyor",
    categoryLabel: { en: "Screw Conveyor" },
    summary: {
      en: "Enclosed screw conveyor for horizontal or inclined bulk material transfer between process points.",
    },
    description: [
      {
        en: "The screw conveyor moves bulk material through an enclosed tube between two or more inlet/outlet points, commonly paired with a rotary valve at the feed or discharge end.",
      },
      {
        en: "Housing is available in cast iron, carbon steel or stainless steel, with liner options in nylon or ceramic for abrasive material.",
      },
    ],
    industries: ["Grain", "Feed", "Chemical", "Environmental protection"],
    materials: [...commonMaterials, "Nylon lining", "Ceramic lining"],
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Horizontal / inclined material transfer" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel; nylon or ceramic lining" },
      { label: "Drive", value: "Motor + reducer, end-mounted" },
      { label: "Customization", value: "OEM/ODM, non-standard length and inlet/outlet count" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [
      { src: "/images/products/screw-conveyor.jpeg", alt: "Screw conveyor tube with two inlet ports and end-mounted motor drive", status: "available" },
    ],
    relatedSlugs: ["tgf", "electric-crushing-valve", "zgb"],
  },
  {
    slug: "electric-crushing-valve",
    code: "Electric Crushing Valve",
    name: { en: "Electric Crushing Valve" },
    category: "crushing-valve",
    categoryLabel: { en: "Electric Crushing Valve" },
    summary: {
      en: "Motor-driven crushing valve that breaks up agglomerated or lump material inline before discharge.",
    },
    description: [
      {
        en: "The electric crushing valve uses a motor-driven rotor with crushing blades to break up agglomerated, caked or lump material as it passes through the flange, protecting downstream conveying equipment.",
      },
      {
        en: "It is typically installed ahead of a rotary valve or screw conveyor and shares the same cast iron, carbon steel or stainless steel material options.",
      },
    ],
    industries: ["Chemical", "Feed", "Environmental protection", "Dust collection"],
    materials: commonMaterials,
    customization: commonCustomization,
    specs: [
      { label: "Function", value: "Inline crushing of lump / agglomerated material" },
      { label: "Material options", value: "Cast iron, carbon steel, stainless steel" },
      { label: "Drive", value: "Motor-driven crushing rotor" },
      { label: "Customization", value: "OEM/ODM, non-standard flange sizing" },
      { label: "Minimum order", value: "1 unit" },
    ],
    images: [
      { src: "/images/products/electric-crushing-valve.jpeg", alt: "Electric crushing valve flange with visible internal crushing blades and motor drive", status: "available" },
    ],
    relatedSlugs: ["screw-conveyor", "tgf", "bzgfwf"],
  },
]

export function getProductBySlug(slug: string): ProductFamily | undefined {
  return productFamilies.find((p) => p.slug === slug)
}

export function getRelatedProducts(family: ProductFamily): ProductFamily[] {
  return family.relatedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is ProductFamily => Boolean(p))
}

export const productCategories: { value: ProductFamily["category"]; label: string }[] = [
  { value: "rotary-valve", label: "Rotary Valves / Airlocks" },
  { value: "screw-conveyor", label: "Screw Conveyors" },
  { value: "crushing-valve", label: "Electric Crushing Valves" },
]
