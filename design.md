# PT SUGEE Bilingual Website Design Specification

Status: Review draft 1
Date: 2026-09-13

## 1. Objective

Create a production-ready bilingual Next.js reconstruction of the PT SUGEE Framer website. The result must remain visually recognizable while correcting content, responsive behavior, accessibility, navigation, and unfinished template material.

Success means:

- Visitors can understand PT SUGEE's capabilities and contact the company quickly.
- English and Bahasa Indonesia contain equivalent complete information.
- All six services have working detail pages.
- PT SUGEE staff can add, caption, order, publish, and remove project/gallery images without changing code.
- The site makes no unsupported current-certification claim.

## 2. Sources and content authority

1. The company profile PDF at `/Users/subramaniampalaniapan/Downloads/DOC-20260902-WA0052.pdf` controls company history, contact details, service scope, equipment ranges, project imagery, and customer logos.
2. The Framer site at `https://ptsugeebeta.framer.website` controls the visual direction and supplies compatible marketing language and industrial imagery.
3. `copywriting.md` controls final public wording.
4. When sources conflict, the PDF wins unless this specification explicitly narrows an unsupported claim.
5. ISO content uses quality-led wording. Historical certificates or expiration dates are not displayed in v1.

## 3. Information architecture

### English routes

- `/`
- `/about`
- `/service`
- `/machinery-equipment-installation`
- `/machinery-equipment-overhauling`
- `/epocast`
- `/laser-alignment-service`
- `/in-situ-machining`
- `/flange-management`

### Bahasa Indonesia routes

The same routes are available below `/id`, for example `/id/about` and `/id/in-situ-machining`.

### Utility routes

- `/studio/[[...tool]]`: embedded Sanity Studio
- `/api/revalidate`: signed Sanity webhook
- `not-found`: localized public 404

English is the default locale and has no prefix. Bahasa Indonesia uses `/id`. `/en/...` permanently redirects to the equivalent unprefixed English URL. Unsupported locale prefixes and unknown service slugs return 404.

## 4. Visual system

### Design thesis

Industrial confidence with editorial restraint: large direct headlines, real field photography, a predominantly black/white canvas, and green used only for action, status, and small navigational accents.

The Home contact call-to-action is the intentional exception: an inset rounded panel with a warm gold-to-PT-SUGEE-green gradient, a low-contrast molecular lattice at the corners, centered white copy, and a white pill action.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#181818` | Primary text and black surfaces |
| `--color-black` | `#000000` | Header and deep overlays |
| `--color-white` | `#FFFFFF` | Main surface |
| `--color-muted` | `#F5F5F3` | Alternate sections and footer |
| `--color-line` | `#DADAD6` | Rules and card borders |
| `--color-green` | `#249101` | Primary CTA and focus accent |
| `--color-green-hover` | `#1C7301` | CTA hover |
| `--color-error` | `#B42318` | Form errors |
| `--color-success` | `#166534` | Form confirmation |
| `--radius-sm` | `8px` | Inputs and small buttons |
| `--radius-md` | `16px` | Cards and media |
| `--radius-pill` | `999px` | Pills and compact CTAs |
| `--content-max` | `1200px` | Desktop content boundary |

Typography:

- Display: Instrument Sans through `next/font/google`, weights 400 and 600.
- Body and UI: Inter through `next/font/google`, weights 400, 500, 600, and 700.
- H1: `clamp(2.5rem, 6vw, 5.5rem)`, line-height 0.98-1.04.
- H2: `clamp(2rem, 4vw, 4rem)`, line-height 1.02-1.1.
- Body: 16-18 px, line-height 1.55-1.7.
- Text columns do not exceed 70 characters.

### Spacing

- Desktop section padding: 112-144 px vertically.
- Tablet section padding: 80-96 px vertically.
- Mobile section padding: 64-80 px vertically.
- Page gutters: 24 px mobile, 32 px tablet, 48 px desktop.
- Dense technical lists may use 48 px vertical separation but never reduce touch spacing.

### Imagery

- Reuse suitable hero and industrial images from the source website as local files.
- Extract approved project photographs and customer logos from the supplied PDF.
- Do not fabricate technical imagery or use unrelated stock photography.
- Convert photographic assets to WebP or AVIF while retaining an archival source copy outside the served asset directory.
- Use `next/image`; hero media receives priority, all other media lazy-loads.
- Every informative image has localized alt text. Decorative images use empty alt text.

## 5. Responsive behavior

Breakpoints are content-driven and validated at 375, 768, and 1440 px.

- Below 768 px: one-column sections, collapsible navigation, full-width buttons where helpful, snap-scrolling project galleries.
- 768-1,023 px: two-column cards where copy length permits; header navigation may remain collapsed.
- 1,024 px and above: full navigation and the desktop compositions documented in `wireframes.md`.
- No independent desktop/mobile DOM copies. CSS layout changes a single semantic content tree.
- Home includes a Leaflet/OpenStreetMap office map immediately before the footer. Inner pages retain linked address text without an embedded map.
- The Singapore marker uses the verified building coordinate. The Batam marker uses the Tunas Regency area coordinate and is visibly identified as approximate until an exact unit pin is available.

## 6. Component architecture

Server Components are the default. Client boundaries are limited to behavior that needs browser state.

### Shared server components

- `SiteHeader`, `SiteFooter`, `SectionHeading`, `Hero`, `ServiceCard`, `ServiceDirectory`, `ServiceDetail`, `QualitySection`, `ClientLogoStrip`, `ProjectGallery`, `ContactSection`, `LocationSection`, and metadata helpers.
- All content is received as typed props; components do not contain hard-coded translated strings.

### Client components

- `MobileMenu`: open/close state, focus management, Escape handling.
- `LocaleSwitcher`: switches to the equivalent route and persists explicit preference.
- `FaqAccordion`: single or multiple expanded items with native button semantics.
- `ProjectCarousel`: optional controls and scroll position; content remains usable without JavaScript.
- `ContactForm`: `useActionState`, pending state, field errors, and delivery result.
- `MotionReveal`: progressive enhancement only; no content is hidden when JavaScript fails.
- `LocationExplorer` and `LocationMap`: office-card selection, browser-only Leaflet loading, marker focus, and accessible popups. Addresses and directions links remain available before hydration and when map tiles fail.

## 7. Localization

Use `next-intl` with:

```ts
export const locales = ['en', 'id'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
```

- `localePrefix: 'as-needed'`.
- Locale detection is disabled for predictable canonical URLs. Only an explicit toggle changes language.
- The toggle maps the current internal pathname to the other locale; it never resets to home.
- Marketing messages live in `messages/en.json` and `messages/id.json` with identical nested keys.
- Build-time tests compare message key sets and fail on missing or extra translations.
- Technical data such as numeric machining ranges is stored once and combined with localized labels.
- Page metadata, Open Graph text, form validation messages, empty states, and 404 content are localized.
- Each page publishes canonical and `hreflang` alternates for `en`, `id`, and `x-default`.

## 8. Service content model

```ts
export type ServiceSlug =
  | 'machinery-equipment-installation'
  | 'machinery-equipment-overhauling'
  | 'epocast'
  | 'laser-alignment-service'
  | 'in-situ-machining'
  | 'flange-management'

export interface ServiceContent {
  slug: ServiceSlug
  heroImage: StaticImageData
  galleryCategory: ServiceSlug
  capabilityKeys: string[]
  specificationGroups: Array<{
    labelKey: string
    items: Array<{ labelKey: string; value: string }>
  }>
  relatedServices: ServiceSlug[]
}
```

Localized titles, summaries, problem/response sections, capability labels, CTAs, and metadata live in the locale dictionaries. Numeric specifications and route relationships live in the typed service collection.

## 9. Sanity gallery backend

Sanity manages project/gallery media only.

### Schema

```ts
interface LocalizedString {
  en: string
  id: string
}

interface ProjectGalleryDocument {
  _type: 'projectGallery'
  title: LocalizedString
  serviceCategory: ServiceSlug
  location: string
  completionYear?: number
  displayOrder: number
  featured: boolean
  images: Array<{
    asset: SanityImageReference
    alt: LocalizedString
    caption?: LocalizedString
  }>
}
```

Validation:

- Both titles are required and limited to 120 characters.
- Service category must match one of the six service slugs.
- Location is required and limited to 120 characters.
- Year, if supplied, is 2000 through the current year.
- Display order is an integer from 0 through 9,999.
- At least one image is required.
- English and Indonesian alt text are required and limited to 180 characters.
- Captions are optional and limited to 240 characters per language.

### Studio

- Embedded at `/studio` and protected by Sanity authentication and project membership.
- Structure builder shows `Project Galleries`, grouped by service category.
- Preview cards show the first image, English title, category, location, and year.
- Core marketing content is not exposed as a Sanity schema.

### Read path

- Public pages query only published `projectGallery` documents.
- The home page requests `featured == true`, ordered by `displayOrder`.
- A service page requests its exact `serviceCategory`, ordered by `displayOrder`.
- GROQ projections return only rendered fields and image metadata.
- If a gallery query succeeds with no results, show the localized empty state.
- If Sanity is unavailable, render the section heading and a localized availability message without breaking the route.

### Revalidation

- Sanity sends create/update/delete events for `_type == "projectGallery"` to `/api/revalidate`.
- The handler validates the webhook signature with `SANITY_REVALIDATE_SECRET` before parsing the payload.
- Valid requests invalidate the `projectGallery` cache tag.
- Invalid signatures return 401; missing or malformed document type returns 400; configuration errors return 500.

## 10. Contact and WhatsApp

WhatsApp URL:

```text
https://wa.me/6591004649?text=Hello%20PT%20SUGEE%2C%20I%20would%20like%20to%20discuss%20an%20engineering%20requirement.
```

The Bahasa page uses a localized prefilled message.

### Form input

```ts
interface ContactInput {
  name: string                 // 2-80, required
  company: string              // 0-120
  email: string                // valid email, required
  phone: string                // 0-30
  service: ServiceSlug | 'general'
  message: string              // 20-2000, required
  consent: true
  website: string              // honeypot; must be empty
  startedAt: number            // reject implausibly fast submissions
  locale: Locale
}
```

### Server Action result

```ts
type ContactActionState =
  | { status: 'idle'; values: Partial<ContactInput> }
  | { status: 'invalid'; values: Partial<ContactInput>; fieldErrors: Record<string, string[]> }
  | { status: 'success'; values: {} }
  | { status: 'error'; values: Partial<ContactInput>; message: string }
```

- Zod validation occurs on the server. Client constraints improve feedback but are not trusted.
- Honeypot or unrealistically fast submissions return a generic success state without sending email.
- Resend sends from `website@ptsugee.com` to `sathish@ptsugee.com`, with `replyTo` set to the visitor's validated email.
- Email subject: `[PT SUGEE Website] <service label> - <company or name>`.
- The message includes every submitted business field, locale, submission time, and page origin.
- Raw form bodies and personal information are not logged.
- Delivery failure preserves user input and exposes direct WhatsApp and telephone options.

Environment variables:

```text
RESEND_API_KEY
CONTACT_TO_EMAIL=sathish@ptsugee.com
CONTACT_FROM_EMAIL=website@ptsugee.com
NEXT_PUBLIC_SITE_URL=https://ptsugee.com
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2026-09-01
SANITY_REVALIDATE_SECRET
```

## 11. Motion and interaction

- Page-entry and scroll reveals use opacity plus a maximum 20 px translation.
- Durations: 180 ms for controls, 400-600 ms for content reveals.
- Cards use border/color changes and no scale larger than 1.02.
- Project carousels support touch, trackpad, keyboard buttons, and nonanimated native scrolling.
- `prefers-reduced-motion: reduce` removes translations, marquees, autoplay, and smooth scrolling.
- Focus indicators use a visible two-color outline that works on black and white surfaces.

## 12. SEO and metadata

- Canonical production origin: `https://ptsugee.com`.
- Route-specific localized title and description from `copywriting.md`.
- Localized sitemap entries include alternate-language URLs.
- `robots.ts` allows public pages and disallows `/studio` and `/api`.
- Structured data: `Organization`, `LocalBusiness`, and `Service`; do not include aggregate ratings or certification claims.
- Social metadata uses existing approved photography; no generated social image is required.
- A PT SUGEE text-mark favicon uses black, white, and green.

## 13. Accessibility

- WCAG 2.2 AA target.
- One H1 per page and ordered section headings.
- Landmarks: header, navigation, main, complementary contact region, and footer.
- Every control has a programmatic name; icons never carry meaning alone.
- Menus and accordions expose expanded state and support keyboard operation.
- Form errors use `aria-describedby`; submission status uses an appropriate live region.
- Color is never the only indicator of action or error.
- Contrast minimum: 4.5:1 for normal text and 3:1 for large text and UI boundaries.

## 14. Testing and acceptance

### Automated

- Unit tests validate service slugs, route maps, locale key parity, localized path switching, contact schemas, spam handling, and email formatting.
- Integration tests mock Resend and Sanity for success, empty, unavailable, malformed, and unauthorized webhook scenarios.
- Playwright exercises all 18 localized public URLs at 375, 768, and 1440 px.
- Accessibility tests cover header, menu, locale switcher, accordion, carousel controls, contact form, and Studio exclusion from public navigation.

### Visual

- Home, About, Services, and one representative service page match `wireframes.md` at all three target widths.
- No duplicated responsive content, horizontal overflow, overlapping floating CTA, clipped headings, or unexpected layout shift.
- Browser zoom at 200% remains navigable.

### Release gates

- `next build`, type checking, unit tests, and Playwright checks pass.
- No console errors on public routes.
- No missing translation keys or untranslated template copy.
- Lighthouse scores at least 90 for accessibility, SEO, and best practices on representative production pages.
- Sanity publish/update/delete is reflected after signed revalidation.
- A labeled production form submission reaches `sathish@ptsugee.com` only after Resend domain verification.

## 15. Explicit exclusions

- No public accounts or customer login.
- No custom administrator database or custom CMS authentication.
- No editing of navigation, core copy, contact details, services, or visual tokens through Sanity.
- No project detail routes in v1; galleries appear on Home, Services, and related service pages.
- No unverified certification, testimonial, rating, or project-performance claims.
- No embedded map outside Home, analytics, chat bot, payments, or newsletter subscription.
