# Design token plan — Modern Family Dental Clinic

Drafted before implementation, per `AGENTS .md` process step 1.

## Named palette

| Token | Hex | Role |
|---|---|---|
| `forest` | `#0F2E28` | Primary: headlines, dark surfaces, buttons, footer |
| `forest-deep` | `#09201C` | Pressed states, dark gradients, drawer scrim tint |
| `ecru` | `#F9F6F0` | Base page background |
| `ice` | `#DDEAEB` | Accent: comparator wash, glass highlights, image mattes |
| `chalk` | `#FFFDF8` | Raised surfaces and both image mattes |
| `moss` | `#52665E` | Muted body text, hairlines, secondary controls |

Only forest / ecru / ice carry visual weight; the other three are tonal neutrals derived from them. No terracotta, indigo, cyan-on-navy, or SaaS grey.

## Type roles

- **Display** — Fraunces, weight 500/600, optical size large, occasional italic for a whole phrase (never a single recolored word). Desktop `clamp(3rem, 5.6vw, 5.25rem)`, section headings `clamp(2rem, 3vw, 3rem)`, line-height 0.98–1.08, tight tracking `−0.035em`.
- **Body / UI** — Inter 400/500/600; 1rem base / 1.6 line-height; measure capped at 66ch. Small labels are sentence case, 0.8125rem, weight 500 — not tracked-out all-caps eyebrows.
- **Editorial aside** — Fraunces italic at 1.375rem / 1.5 for pull quotes and the treatment journal, with more generous line-height than the sans copy.
- **Numerals** — Inter tabular-nums in the estimator and booking summary.

## Layout concept

An off-axis editorial page: an oversized Fraunces headline leans over a staggered photographic collage, a hairline-ruled "treatment journal" replaces the expected three-card services grid, and a single glass comparator card is the one loud, orchestrated centerpiece.

```
┌─────────────────────────────────────────────────────┐
│  wald & zahn   treatments  practice  fees   EN|DE  │  ← sticky glass header
│ ┌─────────────────────────────────────────────────┐ │
│ │  Care that feels   ╱╱╱ photo A (tall)          │ │
│ │  like being known. ╱  glass practice note      │ │
│ │  short sans lede   photo B ╱                   │ │
│ │  [ pill booking CTA ]                          │ │
│ └─────────────────────────────────────────────────┘ │
│  ── quiet horizontal practice-note drift ──         │
│  treatment journal — ruled rows, staggered image   │
│ ┌─── flagship: before/after comparator + 3D tilt ─┐ │
│ │  photo | drag handle | photo    (glass panel)   │ │
│ └─────────────────────────────────────────────────┘ │
│  fee estimator   ║  sticky booking rail / sidebar  │
│  footer: impressum · privacy · terms               │
└─────────────────────────────────────────────────────┘
```

## Reject-on-sight check and revisions

- Initial instinct was three equal "service cards" with a soft grey shadow — **revised** to asymmetric ruled journal rows with one inset image, because identical cards read as template output.
- Initial instinct was a tracked-out all-caps label over every section — **revised** to a short sentence-case label with a leading hairline, used only twice.
- No `→` on buttons: CTAs use a small circular dot or the verb itself.
- No middle-dot meta strings, no numbered markers on non-sequential content (numbers appear only inside the real four-step booking flow).
- No single-word accent styling in headings; typographic contrast comes from italic phrases and scale.
- No uniform border radius: hero image uses an arch, comparator a 28px radius, glass notes a 18px radius, controls are pills/squarcles by function.
- Restraint pass recorded in `docs/REVIEW.md`: one decorative element is removed after the motion pass rather than added.
