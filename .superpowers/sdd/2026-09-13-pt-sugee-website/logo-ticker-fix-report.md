# Company logo ticker fix

## Outcome

- Kept one semantic eight-item client-logo list and preserved the mobile two-row marquee with hover/focus pause and reduced-motion behavior.
- Changed tablet layout to a static 4×2 grid and desktop layout to a static single-row eight-logo strip.
- Constrained every logo image to its cell's content width and adjusted responsive padding so logos cannot collide or create horizontal overflow.
- Updated only the tablet homepage visual baseline because the intentional 4×2 layout adds one row; mobile and desktop baselines remained unchanged.

## TDD evidence

- RED: `npx playwright test e2e/client-logo-strip.spec.ts --project=tablet-768` failed because logo 1 began at `17.75px`, outside its cell's `31.5px` left-edge tolerance.
- GREEN: `npx playwright test e2e/client-logo-strip.spec.ts` passed in all three projects (`3 passed`) at 375px, 768px, and 1440px.
- The regression measures all image and cell bounding boxes, requires every image to remain within its own cell, and rejects overlapping cells.

## Verification

- `npm test -- --run`: 20 files, 75 tests passed. An earlier concurrent run had one 5-second timeout; the isolated rerun passed cleanly.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; all 25 static pages generated.
- `npx playwright test e2e/accessibility.spec.ts e2e/public-routes.spec.ts`: 93 passed across 375px, 768px, and 1440px, including Axe, reduced motion, and horizontal-overflow checks.
- `npx playwright test e2e/visual.spec.ts --grep home`: mobile and desktop passed unchanged; tablet produced the expected intentional 4×2 diff.
- `npx playwright test e2e/visual.spec.ts --grep home --project=tablet-768 --update-snapshots`: passed and refreshed the inspected tablet baseline.
