# Dental & Healthcare Demo Standards

Persistent rules for both demos in this vertical: **Modern Family Dental Clinic** and **Cosmetic Orthodontics Studio**. OpenCode loads this file automatically from the project root — keep it in sync with the per-demo prompts.

## Mission
Each demo is a cold-outreach sales asset for a web-dev agency targeting European SMEs found via Google Maps. It must read as a bespoke, boutique-agency build — never a template, never "AI-generated" — and must run flawlessly on a prospect's phone over 4G, since that's usually how it's opened the first time.

## Design system

**Palette (hard constraint):**
- Primary — deep clinical forest green `#0F2E28`
- Base/background — warm ecru `#F9F6F0`
- Accent — sterile ice blue `#DDEAEB`

**Typography:**
- One editorial display face for headlines (Fraunces, Playfair Display, Cinzel, Syne, or Clash Display) — used as an active design element, not neutral text styling.
- One clean sans for UI/body (Inter, Plus Jakarta Sans, or General Sans).
- A disciplined type scale: deliberate weights/widths/spacing, line length under ~80 characters, slightly more line-height on serif body copy.

**Surfaces & depth:**
- Glassmorphism on key panels: `backdrop-filter: blur(16px)`, `1px solid rgba(255,255,255,.12)` border, layered soft inner shadows — crisp, never muddy.
- Liquid/water-morphism on primary CTAs: pill buttons, soft ambient glow, liquid-wave fill on hover.
- Neomorphism only for tactile controls (toggles, date pickers, segmented controls) — keep contrast WCAG-AA compliant.
- Asymmetrical, editorial layout: overlapping hero imagery, a sticky sidebar or floating booking CTA, staggered magazine-style collages. Break the standard 3-card grid habit.

**Reject on sight — these read as AI-generated:**
- Indigo-to-purple gradients; cyan glow on dark `#0f172a`; any generic SaaS palette.
- Identical rounded cards, one uniform border-radius and the same soft grey shadow on everything.
- The warm-cream + high-contrast-serif + terracotta-accent combo — a different cliché, still a cliché.
- Tracked-out ALL-CAPS eyebrows above every heading; meta text joined with middle dots; "WORD — fragment" labels; a `→` tacked onto every button; numbered markers (01/02/03) on content that isn't actually a sequence.
- Reflexive single-word accent styling in headlines (one word bolded/recolored for no reason).

## Motion
- 3+ distinct animation types are required by the client brief, but vary the treatment per section — one identical fade-and-slide-up on every block reads as generated. Spend the single boldest, most orchestrated motion moment on the flagship feature below; keep everything else quieter.
- Magnetic or liquid-fill hover states on primary buttons.
- 3D perspective tilt (`rotateX`/`rotateY`, cursor-responsive) on the showcase/comparison card.
- Modal/drawer/accordion transitions: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Respect `prefers-reduced-motion`; keep keyboard focus states visible throughout.

## Mandatory interactive features (every demo)
1. **Live calculation tool** — e.g. a treatment-cost estimator or payment-plan calculator.
2. **Booking/reservation drawer** — slide-out or modal with real step states: concern/treatment → date & time → patient details → confirmation. No backend needed; simulate convincingly.
3. **Before/after comparer** — drag-to-slide visual comparison, paired with the 3D tilt above.

## Performance budget (verify with Lighthouse before calling anything done)
- Performance score ≥ 90, mobile and desktop.
- LCP < 1.8s · INP < 100ms · CLS = 0.00.
- All photography as `.webp`/`.avif`, under 200KB each; `<picture>`/`srcset` so phones never pull desktop-resolution heroes.
- `font-display: swap`; preload the primary display-font weight.
- Vanilla JS or a few deliberately-chosen lightweight libraries only — justify anything over ~30KB gzipped.
- Skeleton/shimmer placeholders for anything loading after first paint.

## Responsive & browser matrix
| Range | Focus |
|---|---|
| 360–390px | No font overflow in cards; sticky bottom CTA must never cover content. |
| 390–430px | iOS safe areas (`env(safe-area-inset-bottom)`) and Dynamic Island clearance. |
| 768–1024px | Clean 2-column adaptation, no orphaned whitespace. |
| 1280–1440px | Primary design target — balanced whitespace, crisp type, real hover states. |
| 1920–2560px+ | Wrap everything in a `max-w-7xl` (~1440px) container. |

- iOS Safari — sticky headers, `backdrop-filter` rendering, `100dvh` (no URL-bar jump).
- Chrome/Edge/Brave — scroll smoothness, shadow rendering.
- Firefox — `backdrop-filter` fallback, custom scrollbar styling.

## EU compliance & localization (every page)
- Real GDPR cookie banner (bottom-pinned or slide-in): "Accept Necessary" / "Settings" / "Accept All".
- Footer: Impressum, Privacy Policy, Terms of Service.
- Currency shown as €/£/CHF as relevant; visible navbar language switcher (e.g. EN | DE, EN | FR).
- Floating quick-actions: Call, WhatsApp, "Open in Google Maps" — reachable on mobile scroll.

## Tech stack
Static-first (Astro, or plain HTML/CSS + Vite) — a full SPA framework makes the CLS/LCP budget above much harder to hit. GSAP or Framer Motion is fine if tree-shaken/lazy-loaded. No backend required; booking/estimator flows are client-side/simulated.

## Process
1. Before writing code, draft a short design-token plan (4–6 named hex colors, type roles, a one-sentence layout concept + ASCII wireframe). Check it against "reject on sight" above — if it resembles a generic default, revise and note what changed.
2. Build order: layout shell → hero + content sections → flagship feature → remaining interactive tools → motion pass → image/font optimization → responsive QA → Lighthouse pass → deploy.
3. Before declaring done, do one restraint pass — remove one decorative element, like editing a final accessory off an outfit.

## QA checklist — all must be true
- [ ] Custom visual identity; zero generic AI/SaaS schemes or default Bootstrap components.
- [ ] 3+ distinct animations, plus the booking drawer, estimator, and comparer all functional.
- [ ] Mobile PageSpeed ≥ 90, images in WebP/AVIF.
- [ ] Verified on iOS Safari + Android Chrome — zero horizontal overflow, no broken touch targets.
- [ ] Cookie banner, WhatsApp button, and booking/contact modal all functional.
- [ ] Deployed to Vercel/Netlify/Cloudflare Pages on a clean custom subdomain.
