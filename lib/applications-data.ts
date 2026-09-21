export type ApplicationArea = {
  slug: string
  name: string
  description: string
  relevantFamilySlugs: string[]
}

export const applicationAreas: ApplicationArea[] = [
  {
    slug: "grain",
    name: "Grain",
    description:
      "Metering and airlock discharge under grain hoppers, silos and drying lines, with rotary valve and screw conveyor combinations sized to the material and layout.",
    relevantFamilySlugs: ["tgf", "zgf", "zgc", "screw-conveyor"],
  },
  {
    slug: "food",
    name: "Food",
    description:
      "Cleanable stainless steel rotary valves and conveyors for food-adjacent bulk material lines.",
    relevantFamilySlugs: ["zgp", "zgfe-zgff", "screw-conveyor"],
  },
  {
    slug: "feed",
    name: "Feed",
    description:
      "Rotary valve and screw conveyor combinations for feed mill discharge, transfer and dust-collection points.",
    relevantFamilySlugs: ["tgf", "zgb", "screw-conveyor", "electric-crushing-valve"],
  },
  {
    slug: "chemical",
    name: "Chemical",
    description:
      "Rotary valves and crushing valves configured for chemical powder handling, including finer-powder and reinforced variants.",
    relevantFamilySlugs: ["zqx", "bzgfwf", "bzgfwk", "electric-crushing-valve"],
  },
  {
    slug: "petrochemical",
    name: "Petrochemical",
    description:
      "Reinforced and multi-outlet rotary valve configurations for petrochemical process material discharge.",
    relevantFamilySlugs: ["zgfwe-zgfwf", "bzgfwk", "tazgfwf"],
  },
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical",
    description:
      "Cleanable stainless steel rotary valve configurations for pharmaceutical material transfer.",
    relevantFamilySlugs: ["zgp", "zgfwe-zgfwf"],
  },
  {
    slug: "drying",
    name: "Drying",
    description: "Rotary valves specified for the thermal conditions typical of drying-line discharge points.",
    relevantFamilySlugs: ["zgc", "tgf"],
  },
  {
    slug: "environmental-protection",
    name: "Environmental Protection",
    description: "Rotary valves and screw conveyors for environmental protection and treatment process lines.",
    relevantFamilySlugs: ["bzgfwf", "screw-conveyor", "electric-crushing-valve"],
  },
  {
    slug: "dust-collection",
    name: "Dust Collection",
    description:
      "Rotary valves positioned under cyclones and dust-collection hoppers, prioritizing a consistent air seal.",
    relevantFamilySlugs: ["zqx", "bzgfwk", "electric-crushing-valve"],
  },
  {
    slug: "new-energy",
    name: "New Energy",
    description:
      "Rotary valve configurations referenced for new-energy material lines, including lithium battery material handling, with a titanium-alloy variant available.",
    relevantFamilySlugs: ["qnlzgfwf", "tazgfwf", "zgb"],
  },
]
