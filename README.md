# zahnwald — Modern Family Dental demo

A static, static-first cold-outreach site for a fictional family dental practice in Prenzlauer Berg, Berlin. Built to the rules in `AGENTS .md`: bespoke editorial identity, mandatory estimator / booking drawer / before-after comparer, EU compliance, and a strict mobile performance budget.

## Run locally

```bash
npm install
npm run assets    # download + optimise photos, copy self-hosted fonts
npm run dev       # Vite dev server
npm run build     # production output in dist/
npm run preview   # serve dist/ at http://localhost:4173
```

`npm run assets` needs network access once. The generated files in `public/` are checked into the working tree, so a normal `npm run build` does not need the network.

## Verification

```bash
npm run preview                       # in one terminal
npm run lighthouse                    # in another; expects Chrome on :9222
node scripts/check-viewport.mjs       # expects the same debugging port
```

The Lighthouse helper connects to an already-running Chrome. To start one on Windows:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --no-sandbox --disable-gpu --remote-debugging-port=9222 --user-data-dir="$env:TEMP\lh-profile" about:blank
```

Latest lab results and the interaction/viewport QA log are in `docs/REVIEW.md`. Full reports are in `reports/`.

## What is where

| Path | Purpose |
|---|---|
| `index.html` | Main page, semantic markup, all interactive shells |
| `impressum.html`, `privacy.html`, `terms.html` | EU legal pages |
| `src/styles.css` | Design tokens, layout, surfaces, motion, responsive rules |
| `src/i18n.js` | EN/DE dictionary and static translation pass |
| `src/booking.js` | Four-step drawer, validation, focus trap, confirmation |
| `src/estimator.js` | Live fee calculation with payment plans |
| `src/comparer.js` | Drag slider and cursor-driven 3D tilt |
| `src/cookies.js` | GDPR consent banner and preferences dialog |
| `src/motion.js` | Skeleton clearing, scroll reveals, accordion, magnetic buttons |
| `scripts/prepare-assets.mjs` | Unsplash download, AVIF/WebP encoding, font copy |
| `scripts/lighthouse.mjs` | Mobile + desktop Lighthouse runs |
| `scripts/check-viewport.mjs` | CDP width/overflow sweep |
| `docs/` | Token plan, image credits, review notes |

## Deploy

The `dist/` directory is entirely static. Deploy-ready configs for Netlify (`netlify.toml`), Vercel (`vercel.json`) and Cloudflare Pages (`public/_headers`) are included.

Suggested clean subdomain: `zahnwald.agency.example` or `demo.zahnwald.example` — replace with a domain you control before going live.

```bash
# Netlify, after `npx netlify login`
npx netlify deploy --dir=dist --prod

# Vercel, after `npx vercel login`
npx vercel deploy --prebuilt --prod

# Cloudflare Pages, after `npx wrangler login`
npx wrangler pages deploy dist --project-name=zahnwald-demo
```

## Honest caveats

- The practice, address, phone number and legal details are fictional demo content.
- The before/after pair uses the same consented-style stock smile with a subtle warm shift; it is not a clinical record.
- No backend exists. Booking and consent states are simulated locally; the estimator never sends data.
- Real-device iOS Safari / Android Chrome testing was not possible here; Chromium emulation and Lighthouse mobile throttling were used instead.
