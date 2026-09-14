# Full-colour client logo ticker report

## Scope

- Replaced the responsive grid/alternating marquee with one continuous left-moving ticker at every viewport.
- Preserved one accessible list of eight client logos and added one `aria-hidden` visual duplicate with empty image alternatives for a seamless loop.
- Removed grayscale filtering and normalized each logo inside a fixed-height, responsive-width cell.
- Pauses on pointer hover and keyboard focus.
- Under `prefers-reduced-motion: reduce`, stops animation, hides the duplicate group, and exposes the original row through horizontal scrolling.

## RED evidence

Command:

`npx playwright test e2e/client-logo-strip.spec.ts --project=mobile-375 --workers=1`

Result before production changes: **4 failed**. The expected failures showed the missing `.client-logo-track`, missing accessible/duplicate loop groups, missing track pause behavior, and missing reduced-motion single-row geometry contract.

## GREEN evidence

- `npx playwright test e2e/client-logo-strip.spec.ts --workers=1` — **12 passed** across `mobile-375`, `tablet-768`, and `desktop-1440`.
- `npm test -- --run` — **20 files passed, 75 tests passed**.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; Next.js 16.3.3 compiled and generated all 25 static pages.
- `npx playwright test e2e/accessibility.spec.ts e2e/public-routes.spec.ts --workers=3` — **93 passed** across all three responsive projects.
- `git diff --check` — passed.

## Visual verification

Manually inspected component screenshots rendered from the live local site at 375px, 768px, and 1440px. The logos retain their source colours, remain centered and readable, do not overlap, and are clipped only by the intentional ticker viewport boundary.
