# PT SUGEE Website Wireframes

Status: Review draft 1
Reference: `https://ptsugeebeta.framer.website`
Target: Next.js website at `https://ptsugee.com`

These wireframes preserve the current site's black header, industrial photography, green calls to action, generous white space, and large editorial typography while removing duplicated Framer variants and unfinished template sections.

## Shared desktop shell - 1440 px

```text
+--------------------------------------------------------------------------------+
| BLACK HEADER                                                                    |
| PT SUGEE        Home  About  Services  Projects  Contact       EN | ID          |
+--------------------------------------------------------------------------------+
| PAGE CONTENT                                                                    |
|                                                                                |
|                                                                                |
+--------------------------------------------------------------------------------+
| FLOATING WHATSAPP BUTTON                                            [ WhatsApp ]|
+--------------------------------------------------------------------------------+
| LIGHT FOOTER                                                                    |
| PT SUGEE       Contact            Singapore office        Indonesia office     |
|                phone / email      address                 address               |
| Home  About  Services  Projects  Contact                  English | Bahasa      |
+--------------------------------------------------------------------------------+
```

- Header is sticky after the first scroll threshold.
- Desktop content width: 1,200 px maximum with 32 px outer padding.
- English uses unprefixed URLs. Bahasa Indonesia uses `/id`.
- The language control links to the equivalent localized page.
- WhatsApp remains visible without covering footer controls.

## Shared mobile shell - 375 px

```text
+---------------------------------------+
| PT SUGEE                    EN|ID  [=] |
+---------------------------------------+
|                                       |
| PAGE CONTENT                          |
|                                       |
+---------------------------------------+
|                         [ WhatsApp ]  |
+---------------------------------------+
| PT SUGEE                              |
| Contact                               |
| Singapore                             |
| Indonesia                             |
| Navigation links                     |
+---------------------------------------+
```

- The menu opens as a full-width black panel below the header.
- Menu items are at least 44 px tall and close after navigation.
- The language control remains visible when the menu is closed.

## Home page

### Desktop

```text
+--------------------------------------------------------------------------------+
| HEADER                                                                          |
+--------------------------------------------------------------------------------+
| HERO - full-bleed offshore image with dark overlay                              |
|                                                                                |
| Leading Engineering & Marine Solutions                                         |
| Across Indonesia and Singapore                                                 |
| Short value statement                                                          |
| [ Discuss Your Project ] [ View Services ]                                      |
|                                                                                |
+--------------------------------------------------------------------------------+
| CAPABILITIES INTRO                       | SERVICE GRID                           |
| Our Capabilities                         | [ Installation ] [ Overhauling ]       |
| Engineering support built around uptime  | [ EPOCAST 36 ]   [ Laser Alignment ]  |
| [ Explore All Services ]                 | [ In-Situ ]      [ Flange Management ]|
+--------------------------------------------------------------------------------+
| FEATURED PROJECTS - Sanity managed                                              |
| Project heading + category filters                                             |
| [ wide image ] [ portrait image ] [ wide image ] [ controls ]                  |
+--------------------------------------------------------------------------------+
| WHY PT SUGEE                                                                    |
| Established 2000 | Regional response | Broad technical capability | Quality-led|
+--------------------------------------------------------------------------------+
| QUALITY SECTION                                                                 |
| [engineer image]     ISO-based quality processes without current-cert claim     |
|                      checklist: control / improvement / compliance / feedback   |
+--------------------------------------------------------------------------------+
| CLIENTS                                                                         |
| Selected companies served - horizontal logo strip                               |
+--------------------------------------------------------------------------------+
| FAQ                                                                             |
| Left: heading and contact prompt       Right: accordion                         |
+--------------------------------------------------------------------------------+
| CONTACT                                                                          |
| Left: enquiry copy + WhatsApp            Right: bilingual enquiry form          |
+--------------------------------------------------------------------------------+
| FOOTER                                                                          |
+--------------------------------------------------------------------------------+
```

### Mobile

```text
+---------------------------------------+
| HEADER                                |
+---------------------------------------+
| HERO IMAGE - 78vh                     |
| Leading Engineering & Marine          |
| Solutions Across Indonesia and        |
| Singapore                             |
| [ Discuss Your Project ]              |
| [ View Services ]                     |
+---------------------------------------+
| CAPABILITIES INTRO                    |
| Six stacked service cards             |
+---------------------------------------+
| FEATURED PROJECTS                     |
| Horizontal snap carousel              |
+---------------------------------------+
| FOUR PROOF POINTS - stacked           |
+---------------------------------------+
| QUALITY - image, copy, checklist      |
+---------------------------------------+
| CLIENT LOGOS - two-row marquee        |
+---------------------------------------+
| FAQ ACCORDION                         |
+---------------------------------------+
| CONTACT COPY                          |
| WHATSAPP CTA                          |
| FORM - one column                     |
+---------------------------------------+
| FOOTER                                |
+---------------------------------------+
```

## About page

### Desktop

```text
+--------------------------------------------------------------------------------+
| HEADER                                                                          |
+--------------------------------------------------------------------------------+
| SPLIT INTRO                                                                     |
| Who We Serve                         | A Legacy of Quality and Innovation        |
| industries list                     | company introduction + project collage    |
+--------------------------------------------------------------------------------+
| COMPANY STORY                                                                   |
| Large heading | Established 2000 | New Millenium Group | regional operations   |
+--------------------------------------------------------------------------------+
| VISION / MISSION                                                                |
| [ Vision card ]                         [ Mission card ]                         |
+--------------------------------------------------------------------------------+
| OUR PRIORITIES                                                                  |
| Maximize efficiency | Minimize downtime and cost | Exceed expectations          |
+--------------------------------------------------------------------------------+
| INDUSTRIES AND CAPABILITIES - editorial list                                    |
+--------------------------------------------------------------------------------+
| CTA + CONTACT + FOOTER                                                          |
+--------------------------------------------------------------------------------+
```

### Mobile

All split sections stack in reading order. Industry chips wrap to multiple rows. Mission follows Vision. Proof points become three full-width cards.

## Services index

### Desktop

```text
+--------------------------------------------------------------------------------+
| HEADER                                                                          |
+--------------------------------------------------------------------------------+
| INTRO                                                                           |
| Engineering Excellence Without Compromise                                      |
| Corrected supporting copy + [ Partner With Our Experts ]                        |
+--------------------------------------------------------------------------------+
| SERVICE DIRECTORY                                                               |
| Installation          short outcome-based summary                       [ -> ]   |
| Overhauling           short outcome-based summary                       [ -> ]   |
| EPOCAST 36            short outcome-based summary                       [ -> ]   |
| Laser Alignment       short outcome-based summary                       [ -> ]   |
| In-Situ Machining     short outcome-based summary                       [ -> ]   |
| Flange Management     short outcome-based summary                       [ -> ]   |
+--------------------------------------------------------------------------------+
| SELECTED PROJECTS - Sanity-managed images across all categories                 |
+--------------------------------------------------------------------------------+
| CONTACT + FOOTER                                                                |
+--------------------------------------------------------------------------------+
```

### Mobile

Each service row becomes a bordered card with title, summary, three capability points, and a clear details link. No empty card links remain.

## Reusable service-detail template

Used by:

1. Machinery Equipment Installation
2. Machinery Equipment Overhauling
3. EPOCAST 36 Chocking and Grouting
4. Laser Alignment Services
5. On-Site In-Situ Machining
6. Flange Management

### Desktop

```text
+--------------------------------------------------------------------------------+
| HEADER                                                                          |
+--------------------------------------------------------------------------------+
| SERVICE HERO                                                                    |
| Eyebrow / title / outcome copy / CTA       | primary technical image            |
+--------------------------------------------------------------------------------+
| OPERATIONAL PROBLEM                 | PT SUGEE RESPONSE                          |
+--------------------------------------------------------------------------------+
| CAPABILITIES                                                                     |
| [ capability 1 ] [ capability 2 ] [ capability 3 ]                              |
+--------------------------------------------------------------------------------+
| TECHNICAL SCOPE / SPECIFICATIONS                                                 |
| Clean grouped list; only facts supported by the company profile                  |
+--------------------------------------------------------------------------------+
| RELATED PROJECTS - filtered from Sanity by service category                      |
| [ image + bilingual caption ] [ image ] [ image ]                               |
+--------------------------------------------------------------------------------+
| RELATED SERVICES                                                                |
+--------------------------------------------------------------------------------+
| CONTACT CTA + FOOTER                                                            |
+--------------------------------------------------------------------------------+
```

### Mobile

Hero copy precedes the image. Capability cards stack. Technical specifications use definition lists rather than wide tables. Project media uses a swipeable snap row.

## Contact form

```text
+---------------------------------------------+
| Name *                                      |
| [                                         ] |
| Company                                     |
| [                                         ] |
| Email *              Phone                  |
| [                  ] [                    ] |
| Service *                                   |
| [ Select a service                       v] |
| Message *                                   |
| [                                           |
|                                             |
|                                           ] |
| [ ] I agree to be contacted about this enquiry. |
| [ Send Enquiry ]                            |
|                                             |
| Success: Thank you. We will contact you.    |
| Failure: Message not sent. WhatsApp/call.   |
+---------------------------------------------+
```

- Bahasa labels and feedback replace English in `/id`.
- Field errors appear directly below the field and are announced.
- Submitted values remain present after validation or delivery failure.

## Sanity Studio - `/studio`

```text
+--------------------------------------------------------------------------------+
| SANITY STUDIO                                                                   |
| Project Galleries                                                               |
|                                                                                |
| [ New project gallery ]                                                         |
| - Project title: English / Bahasa Indonesia                                     |
| - Service category                                                              |
| - Location / year                                                               |
| - Featured / display order                                                      |
| - Images: upload, bilingual alt, bilingual caption, reorder                     |
| - Publish                                                                       |
+--------------------------------------------------------------------------------+
```

- Studio uses Sanity authentication and is not part of public navigation.
- Editors cannot change core marketing copy, navigation, company facts, or design.

## Responsive acceptance

- No horizontal overflow at 320-1,920 px.
- Content remains readable at 200% browser zoom.
- Touch targets are at least 44 x 44 px.
- Projects and logos remain usable without animation.
- Reduced-motion mode disables reveals, marquees, and nonessential movement.
