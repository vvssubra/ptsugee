# Task 2 report: locale routing and typed content contracts

## Delivered

- Added `next-intl` routing for `en` and `id`, with English unprefixed, `localePrefix: "as-needed"`, and locale detection disabled.
- Added request configuration, localized navigation helpers, and a proxy matcher that excludes API, Studio, Next internals, and static files.
- Moved the home route into the shared `[locale]` route tree and removed the temporary root page.
- Added the six typed service records, canonical slugs, technical in-situ machining ranges, related-service relationships, and gallery categories.
- Added complete paired English and Bahasa message dictionaries for the approved public copy, plus a structural parity test.
- Updated the smoke test to supply English messages to the locale-owned home page.

## Test-first evidence

The three contract test files were written before their implementation. The initial focused run failed because the required routing, content, and message modules did not exist. The documented `pnpm` command could not run because `pnpm` is not installed in this environment, so the repository-local Vitest binary was used for all subsequent verification.

## Verification

- `./node_modules/.bin/vitest run src/i18n/routing.test.ts src/content/messages.test.ts src/content/services.test.ts` — 3 files, 3 tests passed.
- `./node_modules/.bin/vitest run` — 5 files, 5 tests passed.
- `./node_modules/.bin/eslint .` — passed.
- `./node_modules/.bin/next typegen && ./node_modules/.bin/tsc --noEmit` — passed.
- `./node_modules/.bin/next build` — passed.
- JSON parse validation and `git diff --check` — passed.

## Self-review

- Confirmed the route tree has only `[locale]` as the public page owner and the proxy is present in the production build.
- Confirmed the message dictionaries have matching nested key structures and the six service records use the approved slugs.
- No unresolved implementation blockers. Hero image paths are typed content placeholders for the local approved assets scheduled by the later asset task; they are not rendered by this task's minimal locale-page scaffold.
