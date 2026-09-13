# Task 4 report: responsive bilingual shared shell

## Delivered

- Added a single responsive header navigation tree with the approved five public destinations, both locale links, a compact mobile toggle, first-link focus on open, Escape dismissal, and focus return.
- Added locale-preserving English/Bahasa links and persisted explicit language choices with the `NEXT_LOCALE` cookie.
- Added the approved contact identity and Singapore/Indonesia offices to the localized footer, with telephone, email, and map-search links and no personal social links.
- Added the localized floating WhatsApp action, including the approved Singapore number, exact English prefill, equivalent Bahasa prefill, `_blank`, and `noopener noreferrer`.
- Added reusable `Container`, `ButtonLink`, and `SectionHeading` primitives.
- Loaded Instrument Sans and Inter once in the localized layout using `next/font/google`, and applied the complete color/radius/content-width token set, responsive gutters and section spacing, display/body typography, sticky header, visible two-color focus indicator, 48 px controls, and reduced-motion overrides.
- Added localized menu and navigation landmark names to both message dictionaries so interactive component copy remains data-driven and key parity remains intact.

## TDD evidence

- `pnpm test --run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts` - could not start because `pnpm` is not installed on this host (`zsh: command not found: pnpm`). The repository-local package binaries were used for all verification instead.
- Initial RED: `node_modules/.bin/vitest run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts` - failed as expected because `@/components/site-header` and `@/lib/whatsapp` did not exist.
- First GREEN: `node_modules/.bin/vitest run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts` - passed: 2 files, 5 tests.
- Encoding RED: `node_modules/.bin/vitest run src/lib/whatsapp.test.ts` - failed 1 of 3 tests because `URLSearchParams` emitted `+` separators rather than the specification's exact `%20` encoding.
- Encoding GREEN and focused final: `node_modules/.bin/vitest run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts` - passed: 2 files, 6 tests.

## Verification

- `node_modules/.bin/vitest run` - passed: 8 files, 16 tests.
- `node_modules/.bin/tsc --noEmit` - passed with no diagnostics.
- `node_modules/.bin/eslint src` - passed with no diagnostics.
- `node_modules/.bin/next build` - passed; Next.js 16.3.3 compiled, type-checked, generated static pages, and finalized successfully.
- `git diff --check` - passed.

## Concerns / follow-up

- The current public route set still contains only the scaffold home page; later page tasks must add the `projects` and `contact` targets used by the shared anchor navigation.
- The root scaffold layout owns the document-level `<html lang="en">`; this task applies the verified locale to the shared localized shell. A later routing/metadata pass should move the locale to the document element if the root-layout structure is revised.

## Review fix round 1

- Moved the single locale control outside the collapsible primary navigation so it remains visible beside the closed mobile menu button. At desktop width CSS ordering keeps the primary links first and the same locale control second; no navigation or locale links are duplicated.
- Added a focused regression assertion that the menu starts with `aria-expanded="false"`, controls the primary navigation by ID, and does not contain the locale group, while the equivalent-page Bahasa link remains `/id/about`.
- RED: `node_modules/.bin/vitest run src/components/site-shell.test.tsx` - failed 1 of 4 tests because the primary navigation contained the locale group.
- GREEN: `node_modules/.bin/vitest run src/components/site-shell.test.tsx` - passed: 1 file, 4 tests.
- Focused final: `node_modules/.bin/vitest run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts` - passed: 2 files, 7 tests.
- Full final: `node_modules/.bin/vitest run` - passed: 8 files, 17 tests.
- `node_modules/.bin/tsc --noEmit` - passed with no diagnostics.
- `node_modules/.bin/eslint src` - passed with no diagnostics.
- `node_modules/.bin/next build` - passed; Next.js 16.3.3 compiled, type-checked, generated static pages, and finalized successfully.
- `git diff --check` - passed.
