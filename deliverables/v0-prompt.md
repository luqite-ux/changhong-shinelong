# v0 Prompt — Chanhong ShineLong

Create a complete, runnable Next.js 16 App Router frontend for an English-first, future-multilingual B2B inquiry website for **Chanhong ShineLong**, operated by 常州市常宏祥隆机械科技有限公司. The company was established in 2010 and manufactures rotary valves/airlocks, screw conveyors and electric crushing valves for grain, food, feed, chemical, petrochemical, pharmaceutical, drying, environmental protection, dust collection and new-energy applications.

Use only the attached customer assets and facts. The representative attachments are not the complete product catalogue; Codex will integrate all 16 product families and all media after download. Do not infer total product count from attachment count.

Visual direction: precise industrial editorial design, not a generic blue technology template. Use the customer catalogue cyan/blue as the technical primary, dark graphite for authority, white/light neutral product stages, and small restrained magenta/orange accents from the formal rainbow logo. Typography should be compact and technical in specifications but spacious and confident in headings. Avoid excessive rounded cards, floating glow balls, cheap gradients and repetitive card grids.

Use the formal customer logo unchanged in the header and footer, preserving aspect ratio. Provide a customer favicon derived from the recognizable rainbow-arc symbol, not the unreadable full horizontal logo. Remove all v0/Next.js/template icon sources.

Build independent routes: Home, Products, Product detail, Applications, Manufacturing, About Us, News/Insights list with an honest empty state, News detail template, and Contact/Request a Quote. Navigation must explicitly include Home; the logo also links home. Products need extensible categories, filtering, unique detail templates, technical specifications and related RFQ context. Keep locale-aware data interfaces and fallback logic but launch only English.

Homepage buyer journey: product recognition → family comparison/selection → real manufacturing evidence → applications/customization → selection checklist → FAQ → RFQ. Follow `homepage-media-slot-plan.md`. Reserve a real 16:9 customer-factory video slot with poster, controls, paused/off-screen behavior and static fallback; do not render a black empty player. Codex will replace the placeholder with a montage made only from customer factory stills.

Hero must feel like a finished industrial advertisement, not a left text card plus a right rectangular image. Prepare three distinct hero themes: rotary-valve product recognition, factory/manufacturing proof, and material-handling/selection support. Use real DOM headings, copy and CTA. Preserve product shape, labels and proportions; do not invent equipment. Desktop and 390px need separate focal/safe-area treatment.

Use the provided motion plan: circular rotor-aperture hero reveal, bounded once-only viewport reveals for every major section and every repeated card, a material-selection flow path, and short hover/focus/press feedback. Never use a fixed/global timeout to mark off-screen sections revealed. Base content must remain visible if JavaScript or animation fails. Under `prefers-reduced-motion`, show all content immediately and stop autoplay/nonessential movement.

RFQ experience: no pricing, cart, checkout or payment. Forms include name, company, email, phone/WhatsApp, target product, material/application, capacity/specification requirements and message, with credible loading/success/error UI. Do not fake a backend with alert, console.log or setTimeout; Codex will connect Supabase and CAPTCHA after handoff.

Facts allowed: 6,000 m² site; five areas (machining, grinding/welding, assembly, inspection, warehouse); 500 units/month stated capacity; normal lead time 40 working days; cast iron, carbon steel and stainless steel; OEM/ODM/non-standard customization; MOQ 1 unit; public phone 13961228745; source email 1390339757@qq.com; address 常州市武进区牛塘镇大通西路197号2-101. Do not invent certifications, customers, export countries, awards, patents, performance claims, prices or response times.

Prohibited everywhere: warranty, warranties, guarantee, guaranteed, 质保, 保修 and equivalent commitments. Do not publish the business licence image. Do not use other customers' imagery. Do not alter product structure, logo, model names or catalogue values.

The footer legal owner is the documented direct translation **Changzhou Changhong Xianglong Machinery Technology Co., Ltd.** with a runtime current year and normalized trailing punctuation. This is a delivery translation, not a claim of registered English name.

Deliver complete page code and reusable components, responsive at 1440px and 390px, accessible focus states, WCAG AA contrast, clean `contain` product stages, no cropped product bodies, and maintainable Server/Client boundaries. List all delivered routes, used assets and known missing formal overseas domain/mailbox in the result.

