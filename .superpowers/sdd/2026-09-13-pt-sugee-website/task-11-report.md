# Task 11 — end-to-end responsive and accessibility verification

Date: 2026-09-14

Branch: `codex/pt-sugee-nextjs`

Runtime under test: Next.js production build served at `127.0.0.1:3107`

## Result

Task 11 passes the current, reprioritized public-site acceptance boundary.

| Command | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm test -- --run` | Pass — 20 files, 75 tests |
| `npm run build` | Pass |
| `npx playwright test` | Pass — 175 passed, 44 intentionally skipped, 0 failed |

The 44 Playwright skips are deliberate duplicate avoidance: 21 viewport-independent SEO/error tests run only in the desktop project (42 skips across mobile and tablet), and the mobile-menu test runs only at 375px (2 skips at tablet and desktop).

## Public route matrix

Every cell below performs a real browser navigation against the production server and asserts HTTP 200, no redirect, the expected `html[lang]`, exactly one H1, zero body/document horizontal overflow, valid internal route destinations, and no browser console/page errors.

| Route | 375×812 | 768×1024 | 1440×900 |
|---|---:|---:|---:|
| `/` | Pass | Pass | Pass |
| `/about` | Pass | Pass | Pass |
| `/service` | Pass | Pass | Pass |
| `/machinery-equipment-installation` | Pass | Pass | Pass |
| `/machinery-equipment-overhauling` | Pass | Pass | Pass |
| `/epocast` | Pass | Pass | Pass |
| `/laser-alignment-service` | Pass | Pass | Pass |
| `/in-situ-machining` | Pass | Pass | Pass |
| `/flange-management` | Pass | Pass | Pass |
| `/id` | Pass | Pass | Pass |
| `/id/about` | Pass | Pass | Pass |
| `/id/service` | Pass | Pass | Pass |
| `/id/machinery-equipment-installation` | Pass | Pass | Pass |
| `/id/machinery-equipment-overhauling` | Pass | Pass | Pass |
| `/id/epocast` | Pass | Pass | Pass |
| `/id/laser-alignment-service` | Pass | Pass | Pass |
| `/id/in-situ-machining` | Pass | Pass | Pass |
| `/id/flange-management` | Pass | Pass | Pass |

Total direct public-route checks: 54/54 pass.

## Behavior and accessibility coverage

- Equivalent English/Bahasa switching passes on all nine page types at all three target widths. Explicit locale choice persists after internal navigation.
- The 375px mobile menu moves focus into the open panel and restores focus to the trigger on Escape.
- English and Bahasa FAQ controls operate by keyboard at all three widths.
- The persistent WhatsApp action points to `https://wa.me/6591004649`; the localized contact navigation reaches the existing contact boundary.
- A test-only, runtime-gated gallery harness exercises three mocked Sanity projects, service filtering, keyboard activation of carousel controls, empty results, and unavailable results at every width. It returns 404 unless `PLAYWRIGHT_TEST_MODE=1`, is marked `noindex`, is excluded from locale proxying, and is disallowed by robots.
- Reduced-motion mode disables smooth scrolling and marquee animation at every width.
- Axe scans cover Home, About, Services, and Laser Alignment in both English and Bahasa at every width: 24/24 scans pass with no serious or critical violations.
- Localized metadata checks cover all 18 routes. Canonicals, English/Bahasa/x-default alternates, Organization JSON-LD, Service JSON-LD, robots, the complete bilingual sitemap, English 404, and Bahasa 404 pass against the production build.

## Visual baselines

Twelve committed baselines cover Home, About, Services, and Laser Alignment at 375×812, 768×1024, and 1440×900. The visual test scrolls through each page before capture so below-the-fold optimized images and client logos are represented rather than snapshotted as unloaded placeholders.

Artifacts:

- `e2e/__screenshots__/visual.spec.ts/` — approved PNG baselines
- `playwright-report/` — generated local HTML report (gitignored)
- `test-results/` — failure-only traces, screenshots, and videos (gitignored)

## Product defects found and corrected

1. Internal App Router links used raw `next/link` in shared localized components, causing unprefixed English client navigation and prefetch failures. Shared navigation now uses the typed `next-intl` navigation contract.
2. The Indonesian homepage pre-localized `/id/service` before passing it to the localized Link, producing `/id/id/service`. The homepage now passes the locale-neutral route.
3. The locale proxy overwrote an explicit visitor choice during page/RSC/prefetch traffic. Locale persistence is now owned by the explicit language control.
4. The original green token did not meet contrast requirements on light backgrounds. Accessible light/dark-context green tokens now pass the representative axe matrix.
5. A long Indonesian service-response heading created 5px horizontal overflow at 375px. The response grid child can now shrink and long headings wrap safely.

## Deferred Task 8 acceptance

The contact form and Resend action do not exist because the user explicitly reprioritized Tasks 9–11 ahead of Task 8. Task 11 therefore does not claim coverage for invalid-field feedback, retained values after a failed submission, honeypot/timestamp validation, mocked Resend success/failure, or a labelled production enquiry. Those scenarios remain acceptance requirements for Task 8. Current coverage is limited to the implemented bilingual contact boundary, telephone/email copy, contact navigation, and WhatsApp action.
