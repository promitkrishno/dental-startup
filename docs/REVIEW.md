# Restraint pass and review notes

## Restraint pass

Removed the offset hairline border behind the practice photograph (`.practice-media::before`). It was a decorative frame that added detail without meaning; the section now breathes through whitespace instead. Nothing was added to replace it.

## Reject-on-sight check

- No indigo/purple gradient, no cyan-on-navy, no SaaS grey, no terracotta accent.
- No identical card grid: services are hairline-ruled accordion rows with one staggered image; other sections use different structures.
- No tracked-out all-caps eyebrow system; labels are short sentence-case lines with a hairline.
- No middle-dot meta strings, no arrow suffixes on buttons, no decorative 01/02/03 markers. Numbers appear only in the four-step booking sequence.
- No single-word recoloured headline accents; emphasis comes from Fraunces italic across a whole phrase.
- Four radii by function: arch hero, 28px glass comparator, 18px notes, pill controls.
- No framework UI kit; 24.8 KB of first-party JS (gzip) with no runtime dependencies.

## Motion inventory

1. Orchestrated hero entrance — clip-path line reveals, photo wipe, staggered soft-in elements.
2. Continuous editorial ticker drift — transform-only, compositor friendly.
3. Three distinct scroll-reveal vocabularies (`rise`, `clip`, `drift`) triggered by IntersectionObserver.
4. Magnetic pointer response and liquid-wave fill on primary buttons.
5. Cursor-responsive 3D tilt and glare on the flagship comparer.
6. Accordion and drawer/dialog transitions on `cubic-bezier(0.16, 1, 0.3, 1)`.
7. Full `prefers-reduced-motion` fallback; focus states retained throughout.

## Verification record

- `npm run build` — four HTML entries emitted, hashed CSS/JS, no build warnings.
- Lighthouse on the production preview, mobile 360px and desktop 1350px:
  - Mobile: performance 99, accessibility 100, best practices 100, SEO 100. LCP 0.8s, CLS 0, TBT 140ms.
  - Desktop: performance 100, accessibility 100, best practices 100, SEO 100. LCP 0.3s, CLS 0, TBT 0ms.
- Interaction QA in Chromium: accordion open/close, estimator recalculation and prefill, comparer drag range, four-step booking flow with validation and confirmation, cookie settings persistence, EN/DE switching, legal page language switching. No console errors.
- Viewport emulation at 360, 390, 768, 1024, 1280 and 1920px: document scroll width equals viewport width at every size. The only overflowing elements are inside the intentionally clipped ticker.
- Real iOS Safari and Android Chrome hardware were not available in this environment; verification was via Chromium mobile emulation and Lighthouse mobile throttling. This should be called out before claiming device-level sign-off.
- Deployment is pending credentials; Netlify, Vercel and Cloudflare Pages configs are included.
