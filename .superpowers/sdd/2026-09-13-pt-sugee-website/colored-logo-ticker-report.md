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

## Fix round 1 — deterministic normal-motion coverage

Reviewer feedback identified that the first normal-motion test asserted animation configuration but did not prove the seamless geometry. The focused Playwright suite now deterministically pauses the Web Animation, constrains it to one iteration, samples the exact end time and 37.5% progress, and verifies at 375px, 768px, and 1440px that:

- the primary and duplicate logo groups have equal widths;
- the seam gap equals an internal cell gap, with no negative overlap or oversized blank boundary;
- the end translation is negative and equals exactly one primary-group width;
- all 16 visual cells remain distinct and every image stays inside its cell during normal motion.

The first strengthened run reported three failures because off-screen duplicate images correctly remained lazy and incomplete. After removing that unrelated load prerequisite, the next run exposed a test-instrumentation parsing issue rather than a product defect. Replacing percentage-string parsing with deterministic Web Animations timing and a computed transform produced the required direct behavioral proof. No production source correction was necessary.

Fresh verification:

- `npx playwright test e2e/client-logo-strip.spec.ts --workers=1` — **15 passed** across all three viewport projects.
- `npm test -- --run` — **20 files passed, 75 tests passed**.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; all 25 static pages generated.
- `npx playwright test e2e/accessibility.spec.ts --workers=3` — **30 passed** across all three viewport projects.
