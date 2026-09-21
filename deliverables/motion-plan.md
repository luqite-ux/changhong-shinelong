# Motion Plan

Industry: rotary valves, powder handling and material conveying machinery. Brand character: precise, practical, factory-backed, technically dense.

## Selected scenes

1. **MOT-CHXL-01 / Rotor aperture reveal (narrative)** — Hero product image uses a short radial/iris mask reveal inspired by the circular valve opening, 550–650ms. It runs once, leaves DOM text independent, and becomes an immediate static image under reduced motion.
2. **MOT-CHXL-02 / Bounded viewport sections (content)** — Every major section on every public page receives a 20px/550ms once-only reveal. Repeated cards stagger 70ms with a 210ms cap. No global timeout may mark off-screen content complete; failure only restores visibility.
3. **MOT-CHXL-03 / Material-flow selection path (industry feature)** — The buyer-selection checklist draws a restrained path through purpose → material → capacity → pressure → motor. Desktop is horizontal, 390px is vertical; reduced motion shows the complete static path.
4. **MOT-CHXL-04 / Controls and evidence media (interaction)** — Product cards and CTA arrows use short hover/focus/press feedback. Customer-still video plays only when explicitly started or safely in view muted, pauses out of view/page hidden, and always retains controls and poster fallback.

## External candidates

- Motion official `whileInView` / `useInView`: adopted for one-shot viewport entry and observer lifecycle.
- Motion official scroll image reveal: partially adopted only for the rotor-aperture/machining image mask, not for every section.
- Deep parallax/pinned horizontal narrative: rejected; it competes with technical comparison, adds 390px friction and resembles recent industrial motion combinations.

## Freshness and implementation

This combination differs from recent assembly-line scans, HVAC airflow, glass layers and textile threads by using the actual circular valve aperture and a buyer selection flow. Implementation may use Motion for React if present; an IntersectionObserver + CSS fallback is acceptable. Base content remains visible before enhancement. All observers/listeners/timers must clean up.

## Pre-generation readiness

- Scene count: 4 — PASS.
- External candidates: 3 — PASS.
- Desktop plan: PASS; no pinned scroll or CTA obstruction.
- 390px plan: PASS; reduced displacement, vertical flow, direct controls.
- Reduced-motion plan: PASS; no autoplay, no mask/translation dependency, all content immediately visible.

