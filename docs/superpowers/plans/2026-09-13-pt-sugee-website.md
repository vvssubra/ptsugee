# PT SUGEE Bilingual Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the approved bilingual PT SUGEE marketing website with six service pages, Resend enquiries, WhatsApp contact, and a narrowly scoped Sanity project-gallery studio.

**Architecture:** A Next.js 16 App Router application renders localized, typed static marketing content under unprefixed English routes and `/id` Bahasa Indonesia routes. Server Components render pages and Sanity gallery data; small Client Components handle navigation, locale switching, accordions, carousels, motion, and form feedback. Sanity manages only project-gallery media, while a validated Server Action delivers enquiries through Resend.

**Tech Stack:** Next.js 16.3.3, React 19, TypeScript, Tailwind CSS 4, next-intl, Motion, Leaflet/OpenStreetMap, Zod, Resend, Sanity/next-sanity, Vitest, Testing Library, Playwright, axe-core, Vercel

**Spec:** `design.md` with content from `copywriting.md` and layouts from `wireframes.md`

## Global Constraints

- Treat `/Users/subramaniampalaniapan/Downloads/DOC-20260902-WA0052.pdf` as the factual source and `copywriting.md` as the final editorial source.
- Keep English routes unprefixed and Bahasa Indonesia routes under `/id`; switching language must preserve the equivalent route.
- Do not claim that PT SUGEE currently holds active ISO certification.
- Sanity may manage only project/gallery media and bilingual image text.
- Send production enquiries to `sathish@ptsugee.com`; never log submitted personal information.
- Use real approved source imagery only; do not generate or substitute unrelated industrial imagery.
- Meet WCAG 2.2 AA, support reduced motion, and prevent horizontal overflow from 320 through 1,920 px.
- Preserve all nine English public routes and all nine Bahasa equivalents.
- Use test-first development and commit after every independently testable task.

---

### Task 1: Scaffold the tested Next.js application

**Files:**
- Create: `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `vitest.config.ts`, `playwright.config.ts`, `src/test/setup.ts`
- Create: `.env.example`, `.gitignore`
- Test: `src/test/smoke.test.tsx`

**Interfaces:**
- Produces the `@/* -> ./src/*` path alias, `pnpm test`, `pnpm test:e2e`, `pnpm typecheck`, and `pnpm build` commands.
- Establishes Node.js runtime and a `src/` App Router layout for every later task.

- [ ] **Step 1: Initialize Next.js without overwriting approved documents**

Run:

```bash
pnpm create next-app@16.3.3 /tmp/pt-sugee-starter --ts --tailwind --eslint --app --src-dir --import-alias '@/*' --use-pnpm
```

Copy only generated application/configuration files into the repository. Preserve `wireframes.md`, `copywriting.md`, `design.md`, `.git`, and `docs/`.

- [ ] **Step 2: Add runtime and test dependencies**

Run:

```bash
pnpm add next@16.3.3 next-intl motion leaflet zod resend next-sanity @sanity/vision sanity @sanity/image-url
pnpm add -D @types/leaflet vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react playwright @axe-core/playwright
```

- [ ] **Step 3: Write the initial failing smoke test**

```tsx
import {render, screen} from '@testing-library/react';
import Home from '@/app/page';

it('renders the PT SUGEE brand', () => {
  render(<Home />);
  expect(screen.getByText('PT SUGEE')).toBeInTheDocument();
});
```

- [ ] **Step 4: Configure Vitest and implement the minimum root page**

Configure jsdom, `src/test/setup.ts`, and the `@` alias. Render a semantic `<main><h1>PT SUGEE</h1></main>` from `src/app/page.tsx`.

- [ ] **Step 5: Verify the scaffold**

Run:

```bash
pnpm test --run
pnpm typecheck
pnpm build
```

Expected: smoke test passes; typecheck and production build exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs src vitest.config.ts playwright.config.ts .env.example .gitignore
git commit -m "chore: scaffold PT SUGEE Next.js app"
```

### Task 2: Establish locale routing and typed content contracts

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`
- Create: `src/content/types.ts`, `src/content/services.ts`
- Create: `messages/en.json`, `messages/id.json`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Delete: `src/app/page.tsx` after locale routing is active
- Modify: `next.config.ts`, `src/test/smoke.test.tsx`
- Test: `src/i18n/routing.test.ts`, `src/content/messages.test.ts`, `src/content/services.test.ts`

**Interfaces:**
- Produces `locales`, `Locale`, `defaultLocale`, localized `Link`, and `getPathname`.
- Produces `ServiceSlug`, `ServiceContent`, `serviceSlugs`, `services`, and `isServiceSlug(value)`.

- [ ] **Step 1: Write failing locale and content-contract tests**

```ts
expect(locales).toEqual(['en', 'id']);
expect(defaultLocale).toBe('en');
expect(flattenKeys(enMessages)).toEqual(flattenKeys(idMessages));
expect(serviceSlugs).toHaveLength(6);
expect(isServiceSlug('flange-management')).toBe(true);
expect(isServiceSlug('unknown')).toBe(false);
```

- [ ] **Step 2: Define service types and six records**

```ts
export const serviceSlugs = [
  'machinery-equipment-installation',
  'machinery-equipment-overhauling',
  'epocast',
  'laser-alignment-service',
  'in-situ-machining',
  'flange-management'
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
export type Locale = 'en' | 'id';
```

Populate capability keys, technical specification groups, related-service slugs, and gallery categories exactly as approved in `design.md`.

- [ ] **Step 3: Create next-intl routing**

Use `defineRouting` with locales `en` and `id`, default `en`, `localePrefix: 'as-needed'`, and `localeDetection: false`. Configure `src/proxy.ts` to exclude `/api`, `/studio`, Next internals, and static files.

Move the public root implementation under `src/app/[locale]/page.tsx` and remove `src/app/page.tsx`; the proxy rewrite must be the only owner of `/` so English and Bahasa share one route tree. Update the smoke test to render the localized page with an English message provider.

- [ ] **Step 4: Transcribe the approved bilingual copy**

Move every public string from `copywriting.md` into matching nested keys in `messages/en.json` and `messages/id.json`. Keep technical numeric values in `src/content/services.ts`.

- [ ] **Step 5: Verify locale contracts**

Run:

```bash
pnpm test --run src/i18n/routing.test.ts src/content/messages.test.ts src/content/services.test.ts
pnpm typecheck
```

Expected: both message files have identical keys and all six service records validate.

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/content src/proxy.ts src/app messages next.config.ts
git commit -m "feat: add bilingual routing and typed content"
```

### Task 3: Extract and optimize approved visual assets

**Files:**
- Create: `public/images/hero/`, `public/images/services/`, `public/images/projects/`, `public/images/clients/`
- Create: `src/content/assets.ts`
- Test: `src/content/assets.test.ts`

**Interfaces:**
- Produces typed `heroAssets`, `serviceAssets`, `seedProjectAssets`, and `clientLogoAssets` records with dimensions and localized alt keys.

- [ ] **Step 1: Write a failing asset-manifest test**

```ts
for (const asset of Object.values(allAssets)) {
  expect(asset.src).toMatch(/^\/images\//);
  expect(asset.width).toBeGreaterThan(0);
  expect(asset.height).toBeGreaterThan(0);
  expect(asset.altKey).toMatch(/^images\./);
}
```

- [ ] **Step 2: Download source-site images to a temporary directory**

Use the audited `framerusercontent.com` URLs for the offshore hero, workers, machinery, and service imagery. Do not hotlink the production site.

- [ ] **Step 3: Extract PDF project images and client marks**

Use `pdfimages -all` and page rendering as needed. Select source material from project pages 9-21, retaining the clearest available image for each service category.

- [ ] **Step 4: Normalize assets**

Use `sharp` to rotate from EXIF, crop only when composition remains truthful, and export photographs as WebP at quality 82. Export logos as transparent PNG/WebP without adding backgrounds. Record intrinsic dimensions.

- [ ] **Step 5: Build and verify the manifest**

Run:

```bash
pnpm test --run src/content/assets.test.ts
pnpm typecheck
```

Visually inspect every hero image, service image, seed project image, and client mark before committing.

- [ ] **Step 6: Commit**

```bash
git add public/images src/content/assets.ts src/content/assets.test.ts
git commit -m "feat: add approved PT SUGEE visual assets"
```

### Task 4: Build the design system and shared shell

**Files:**
- Modify: `src/app/globals.css`, `src/app/[locale]/layout.tsx`
- Create: `src/components/site-header.tsx`, `src/components/mobile-menu.tsx`, `src/components/locale-switcher.tsx`, `src/components/site-footer.tsx`, `src/components/whatsapp-button.tsx`
- Create: `src/components/ui/button-link.tsx`, `src/components/ui/container.tsx`, `src/components/ui/section-heading.tsx`, `src/lib/whatsapp.ts`
- Test: `src/components/site-shell.test.tsx`, `src/lib/whatsapp.test.ts`

**Interfaces:**
- Produces `buildWhatsAppUrl(locale: Locale): string`.
- Produces a single responsive header/footer shell consumed by every public page.

- [ ] **Step 1: Write failing shell interaction tests**

Assert that the header exposes Home, About, Services, Projects, Contact, English, and Bahasa Indonesia; the mobile menu toggles `aria-expanded`; Escape closes it; and the language link preserves the current pathname.

- [ ] **Step 2: Implement fonts and design tokens**

Load Instrument Sans and Inter once in the localized layout. Implement every token and spacing rule from `design.md`, including focus rings, reduced-motion overrides, container widths, and responsive typography.

- [ ] **Step 3: Implement the responsive header and footer**

Use one semantic DOM tree per component. The header becomes sticky after scroll using CSS where possible. The footer renders approved contact and office details, localized navigation, and no personal social links.

- [ ] **Step 4: Implement WhatsApp URLs**

Return `https://wa.me/6591004649` with a correctly encoded localized prefilled message. Open the link in a new tab with safe `rel` attributes.

- [ ] **Step 5: Verify shared behavior**

Run:

```bash
pnpm test --run src/components/site-shell.test.tsx src/lib/whatsapp.test.ts
pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add src/app src/components src/lib
git commit -m "feat: build responsive bilingual site shell"
```

### Task 5: Implement Sanity gallery schema, Studio, and resilient reads

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`
- Create: `src/sanity/schemaTypes/project-gallery.ts`, `src/sanity/schemaTypes/index.ts`, `src/sanity/structure.ts`
- Create: `src/sanity/lib/client.ts`, `src/sanity/lib/image.ts`, `src/sanity/lib/queries.ts`, `src/sanity/lib/fetch-projects.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`, `src/app/studio/[[...tool]]/layout.tsx`
- Create: `src/app/api/revalidate/route.ts`
- Test: `src/sanity/schemaTypes/project-gallery.test.ts`, `src/sanity/lib/fetch-projects.test.ts`, `src/app/api/revalidate/route.test.ts`

**Interfaces:**
- Produces the CMS document type `ProjectGalleryDocument`, the localized query result `ProjectGallery`, `LocalizedString`, `getFeaturedProjects(locale)`, and `getProjectsByService(service, locale)`.
- Produces `POST /api/revalidate` accepting a signed Sanity webhook body `{_type: 'projectGallery'}`.

- [ ] **Step 1: Write failing schema and fetch tests**

Test required bilingual title/alt values, six-category validation, year bounds, image minimum, ordering, featured filtering, localized projection, empty results, and a simulated Sanity failure.

- [ ] **Step 2: Implement the narrow schema**

Create only `projectGallery`. Apply the exact lengths and ranges in `design.md`. Configure Studio structure to group documents by service category and preview the first image, English title, location, and year.

- [ ] **Step 3: Implement typed GROQ queries and image URLs**

Project only required fields. Resolve the requested locale in GROQ with an English fallback for an unexpectedly missing caption, while schema validation still requires both alt values.

- [ ] **Step 4: Implement resilient gallery reads**

Return `{status: 'ready', projects}`, `{status: 'empty', projects: []}`, or `{status: 'unavailable', projects: []}`. Tag every query with `projectGallery`. Never throw a Sanity outage into a public page.

- [ ] **Step 5: Implement signed revalidation**

Use `parseBody` from `next-sanity/webhook`. Return 401 for invalid signatures, 400 for unsupported bodies, 500 for missing secret, and 200 after `revalidateTag('projectGallery', 'max')`.

- [ ] **Step 6: Verify Sanity boundaries**

Run:

```bash
pnpm test --run src/sanity src/app/api/revalidate/route.test.ts
pnpm typecheck
```

- [ ] **Step 7: Commit**

```bash
git add sanity.config.ts sanity.cli.ts src/sanity src/app/studio src/app/api/revalidate
git commit -m "feat: add Sanity project gallery studio"
```

### Task 6: Build the Home page

**Files:**
- Create: `src/components/hero.tsx`, `src/components/service-grid.tsx`, `src/components/project-gallery.tsx`, `src/components/proof-points.tsx`, `src/components/quality-section.tsx`, `src/components/client-logo-strip.tsx`, `src/components/faq-accordion.tsx`, `src/components/motion-reveal.tsx`, `src/components/location-section.tsx`, `src/components/location-explorer.tsx`, `src/components/location-map.tsx`, `src/content/locations.ts`
- Modify: `src/app/[locale]/page.tsx`
- Test: `src/app/home-page.test.tsx`

**Interfaces:**
- Consumes bilingual messages, service records, local assets, and `getFeaturedProjects(locale)`.
- Produces the complete localized Home route with `#projects` and `#contact` anchors.

- [ ] **Step 1: Write the failing Home-page test**

Render both locales with mocked gallery states. Assert the localized H1, six service links, four proof points, quality wording without a certification claim, client section, six FAQs, project empty/unavailable copy, WhatsApp link, and contact anchor.

- [ ] **Step 2: Implement the first recognizable viewport**

Build the black header and full-bleed offshore hero with localized eyebrow, H1, body, and two CTAs. Match the approved desktop/mobile composition before expanding below the fold.

- [ ] **Step 3: Implement remaining Home sections**

Compose Capabilities, Featured Projects, proof points, Quality, Clients, FAQ, Contact, and the Home-only Location section in the order defined by `wireframes.md`. The Leaflet/OpenStreetMap map shows exact Singapore and approximate Tunas Regency markers; bilingual office cards, address text, and directions links remain usable without JavaScript or map tiles.

- [ ] **Step 4: Add progressive motion**

Use Motion only in `MotionReveal` and carousel controls. Content must render visible before hydration and remain static when reduced motion is enabled.

- [ ] **Step 5: Verify Home**

Run:

```bash
pnpm test --run src/app/home-page.test.tsx
pnpm typecheck
```

Start the development server and inspect `/` and `/id` at 375 and 1440 px.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/[locale]/page.tsx src/app/home-page.test.tsx
git commit -m "feat: build bilingual PT SUGEE home page"
```

### Task 7: Build About, Services, and six service-detail routes

**Files:**
- Create: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/service/page.tsx`, `src/app/[locale]/[serviceSlug]/page.tsx`
- Create: `src/components/about-sections.tsx`, `src/components/service-directory.tsx`, `src/components/service-detail.tsx`, `src/components/technical-specifications.tsx`, `src/components/related-services.tsx`
- Test: `src/app/public-routes.test.tsx`, `src/app/service-detail.test.tsx`

**Interfaces:**
- Consumes `ServiceSlug`, `services`, localized messages, assets, and `getProjectsByService`.
- Produces static parameters for 2 locales x 6 services and localized metadata for all 18 public URLs.

- [ ] **Step 1: Write failing route-coverage tests**

Assert that every approved English URL and `/id` equivalent resolves, every page has exactly one localized H1, all service-directory links have real destinations, and an invalid service slug invokes `notFound()`.

- [ ] **Step 2: Implement About**

Build Who We Serve, company story, Vision, Mission, priorities, industry/capability list, and contact CTA from `copywriting.md`.

- [ ] **Step 3: Implement the Services index**

Build the corrected intro, six linked directory rows/cards, all-category project gallery, and contact CTA. Remove every Framer-template promotional block.

- [ ] **Step 4: Implement the reusable detail route**

Validate `serviceSlug` with `isServiceSlug`, render the approved hero/problem/response/capabilities/specifications/gallery/related-services/contact sequence, and generate locale-aware metadata.

- [ ] **Step 5: Verify public routes**

Run:

```bash
pnpm test --run src/app/public-routes.test.tsx src/app/service-detail.test.tsx
pnpm typecheck
```

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale] src/components src/app/public-routes.test.tsx src/app/service-detail.test.tsx
git commit -m "feat: add bilingual company and service pages"
```

### Task 8: Implement the validated Resend contact flow

**Files:**
- Create: `src/features/contact/schema.ts`, `src/features/contact/types.ts`, `src/features/contact/email.ts`, `src/features/contact/action.ts`, `src/features/contact/contact-form.tsx`
- Create: `src/components/contact-section.tsx`
- Modify: Home, About, Services, and service-detail page compositions to use `ContactSection`
- Test: `src/features/contact/schema.test.ts`, `src/features/contact/email.test.ts`, `src/features/contact/action.test.ts`, `src/features/contact/contact-form.test.tsx`

**Interfaces:**
- Produces `ContactInput`, `ContactActionState`, `contactSchema`, `formatContactEmail(input)`, and `submitContact(previousState, formData)`.

- [ ] **Step 1: Write failing validation tests**

Cover 2-80 character names, optional company/phone, valid email, six services plus general, 20-2,000 character messages, required consent, empty honeypot, valid locale, and numeric start time.

- [ ] **Step 2: Implement the Zod schema and serializable action state**

Normalize whitespace without changing technical content. Return localized field-error keys rather than server-authored display sentences.

- [ ] **Step 3: Write failing email and action tests**

Mock Resend. Assert recipient `sathish@ptsugee.com`, sender `website@ptsugee.com`, visitor reply-to, safe HTML escaping, localized service label, no sensitive logging, success response, delivery failure with retained values, and silent spam handling.

- [ ] **Step 4: Implement Resend delivery**

Reject a nonempty `website` honeypot or a submission under three seconds with a generic success result and no email. On valid input call Resend once. On provider failure return `status: 'error'` without clearing values.

- [ ] **Step 5: Implement the bilingual form**

Use `useActionState`. Associate labels, descriptions, and errors; announce pending/success/failure; preserve values on invalid/error; clear on success; expose WhatsApp and telephone alternatives.

- [ ] **Step 6: Verify contact behavior**

Run:

```bash
pnpm test --run src/features/contact
pnpm typecheck
```

- [ ] **Step 7: Commit**

```bash
git add src/features/contact src/components/contact-section.tsx src/app
git commit -m "feat: add secure bilingual contact enquiries"
```

### Task 9: Add SEO, error states, and structured data

**Files:**
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.svg`
- Create: `src/app/[locale]/not-found.tsx`, `src/app/[locale]/error.tsx`, `src/app/global-error.tsx`
- Create: `src/lib/metadata.ts`, `src/lib/structured-data.ts`
- Test: `src/lib/metadata.test.ts`, `src/app/sitemap.test.ts`, `src/lib/structured-data.test.ts`

**Interfaces:**
- Produces `buildLocalizedMetadata`, `buildOrganizationJsonLd`, `buildServiceJsonLd`, sitemap alternates, and public robots policy.

- [ ] **Step 1: Write failing metadata and sitemap tests**

Assert route-specific localized titles/descriptions, `https://ptsugee.com` canonicals, `en`/`id`/`x-default` alternates, all 18 public URLs, and exclusion of `/studio` and `/api` from indexing.

- [ ] **Step 2: Implement metadata and structured data**

Use only Organization, LocalBusiness, and Service facts from approved copy. Do not include ratings, testimonials, or certification properties.

- [ ] **Step 3: Implement localized error experiences**

Provide 404 Home navigation and an accessible retry button for runtime errors. The global error includes `<html>` and `<body>` and never exposes internal error messages.

- [ ] **Step 4: Verify SEO and errors**

Run:

```bash
pnpm test --run src/lib/metadata.test.ts src/app/sitemap.test.ts src/lib/structured-data.test.ts
pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/app src/lib
git commit -m "feat: add localized SEO and error handling"
```

### Task 10: Seed Sanity project galleries

**Files:**
- Create: `scripts/seed-sanity-projects.mjs`
- Create: `content/seed-projects.json`
- Modify: `.env.example`, `package.json`
- Test: `src/sanity/seed-projects.test.ts`

**Interfaces:**
- Produces an idempotent `pnpm sanity:seed` command that creates or updates deterministic `projectGallery` documents and uploads each approved seed image once.

- [ ] **Step 1: Write the failing seed-data test**

Assert every seed has a deterministic `_id`, one of six categories, bilingual title and alt text, location, integer order, at least one existing local asset, and no duplicate file hashes.

- [ ] **Step 2: Create reviewed seed records**

Map the approved PDF projects to WASCO Yard Batam, ASL Yard Batam, and the documented chocking, laser alignment, in-situ machining, machinery installation, and ship/rig overhaul categories. Do not invent dates or outcomes.

- [ ] **Step 3: Implement idempotent upload and document creation**

Require `SANITY_WRITE_TOKEN` only for the seed command. Hash image bytes, reuse existing matching Sanity assets, and use `createOrReplace` for deterministic documents.

- [ ] **Step 4: Dry-run and verify seed input**

Run:

```bash
pnpm test --run src/sanity/seed-projects.test.ts
pnpm sanity:seed --dry-run
```

Expected: validation passes and dry-run lists exact documents/assets without network writes.

- [ ] **Step 5: Seed the configured Sanity project**

After the Sanity project ID, dataset, and write token are configured, run `pnpm sanity:seed` once and verify documents and media in `/studio`.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-sanity-projects.mjs content/seed-projects.json src/sanity/seed-projects.test.ts .env.example package.json
git commit -m "feat: seed approved project galleries"
```

### Task 11: End-to-end responsive and accessibility verification

**Files:**
- Create: `e2e/public-routes.spec.ts`, `e2e/localization.spec.ts`, `e2e/contact.spec.ts`, `e2e/accessibility.spec.ts`, `e2e/visual.spec.ts`
- Create: `e2e/fixtures.ts`
- Modify: `playwright.config.ts`

**Interfaces:**
- Produces repeatable browser coverage for 18 public routes at 375x812, 768x1024, and 1440x900.

- [ ] **Step 1: Write route and localization scenarios**

Test status 200, one H1, no horizontal overflow, valid internal links, English-to-Bahasa equivalent-route switching, Bahasa-to-English switching, and locale persistence after navigation.

- [ ] **Step 2: Write behavior scenarios**

Test mobile menu focus/Escape, FAQ keyboard operation, project carousel controls, WhatsApp target, invalid contact feedback, retained failure values with mocked Resend, and gallery empty/unavailable states with mocked Sanity.

- [ ] **Step 3: Add axe checks**

Scan representative Home, About, Services, one service page, and the contact form in both locales. Fail on serious or critical violations.

- [ ] **Step 4: Add visual baselines**

Capture Home, About, Services, and Laser Alignment at each target viewport. Compare against approved wireframe structure, not the defective Framer whitespace or duplicated sections.

- [ ] **Step 5: Run the complete suite**

Run:

```bash
pnpm test --run
pnpm typecheck
pnpm build
pnpm test:e2e
```

Expected: all commands exit 0; all 18 routes pass; no serious/critical accessibility violations.

- [ ] **Step 6: Commit**

```bash
git add e2e playwright.config.ts
git commit -m "test: verify bilingual responsive experience"
```

### Task 12: Configure preview deployment and production readiness

**Files:**
- Modify: `.env.example`, `README.md`
- Create: `docs/deployment.md`

**Interfaces:**
- Documents exact Vercel, Resend, Sanity, webhook, DNS, and smoke-test configuration without committing secrets.

- [ ] **Step 1: Document environment setup**

List `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION`, and `SANITY_REVALIDATE_SECRET`. Document `SANITY_WRITE_TOKEN` as seed-only and never required by public runtime.

- [ ] **Step 2: Deploy a Vercel preview**

Configure preview environment values with a nonproduction Resend recipient or mocked delivery. Verify `/`, `/id`, `/service`, `/id/service`, `/studio`, and a signed revalidation request.

- [ ] **Step 3: Run preview smoke checks**

Run Lighthouse on English Home, Bahasa Home, Services, and one service detail. Require at least 90 for accessibility, SEO, and best practices. Confirm no browser console errors.

- [ ] **Step 4: Prepare production services**

Verify `ptsugee.com` in Vercel and Resend, configure `website@ptsugee.com`, create the Sanity webhook filtered to `_type == "projectGallery"`, and copy the same strong revalidation secret into Sanity and Vercel.

- [ ] **Step 5: Perform production acceptance**

Promote the approved preview, confirm DNS and TLS, publish one labeled Sanity test gallery then remove it, verify cache revalidation, and submit one labeled enquiry that reaches `sathish@ptsugee.com`.

- [ ] **Step 6: Commit documentation**

```bash
git add .env.example README.md docs/deployment.md
git commit -m "docs: add PT SUGEE deployment runbook"
```

## Final Verification

Run from a clean checkout:

```bash
pnpm install --frozen-lockfile
pnpm test --run
pnpm typecheck
pnpm build
pnpm test:e2e
git status --short
```

Acceptance requires all commands to exit 0, a clean working tree, 18 functioning public URLs, authenticated `/studio`, successful signed revalidation, localized contact delivery, and no unsupported certification or template copy.
