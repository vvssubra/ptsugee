# Adding photos to the PT SUGEE website

Sign in at **https://ptsugee.com/studio** with the account you were invited with.

The Studio has two sections, and they do different jobs:

- **Site Images** — the fixed photos built into the design (home banner, About photo, the six service cover photos, client logos).
- **Project Galleries** — your project photo sets, filed under the service they belong to.

---

## Adding a project photo set

1. Open **Project Galleries**, then click the service the job belongs to, e.g. *Laser Alignment Service*.
2. Click **Create new**.
3. Fill in the fields. **Everything marked required must be filled in both English and Bahasa Indonesia** — the Publish button stays greyed out until they are:
   - **Project title** — English and Indonesian, up to 120 characters each.
   - **Service category** — pick the same service you opened. (It is not filled in for you.)
   - **Location** — e.g. *Batam, Indonesia*.
   - **Completion year** — optional, 2000 up to this year.
   - **Display order** — a number. Lower numbers show first; leave at 0 if you don't mind the order.
   - **Feature on home page** — see below.
   - **Project images** — upload one or more photos. **Each photo needs its own alt text in English and Indonesian** (a short description of what is in the photo, up to 180 characters). A caption is optional.
4. Press **Publish**. The website updates within about a minute.

### The "Feature on home page" switch

Leave it **off** and the project appears on the Gallery page and on its service page.
Turn it **on** and it also appears in the gallery on the home page.

If you publish a project and don't see it on the home page, this switch is almost always why.

### The first project you publish

Until there is at least one project in the Studio, the Gallery page shows the built-in set of photos we supplied. **As soon as you publish your first project, that built-in set is replaced by your Studio photos.** Plan to add a decent batch in one sitting rather than publishing a single project and leaving it.

The home page works the same way, but it counts only featured projects: it keeps its built-in photos until you publish a project with **Feature on home page** turned on.

---

## Changing one of the fixed photos

Open **Site Images**. Each slot — *Home hero*, *About page photo*, *Quality section and services banner*, the six *Service cover photos* — can take a new photo. Upload it, add alt text if you want (optional here — leave it empty and the original description is kept), and press **Publish**.

Leave a slot **empty** to keep the photo we supplied. Clearing a slot later restores it.

**Client logos** work differently: the moment you add one logo of your own, your list replaces the whole built-in set, so add all of them. Each needs a client name. Drag to reorder; empty the list to bring the built-in logos back.

---

## Removing a photo or project

- **A whole project** — open it and choose **Delete**.
- **One photo inside a project** — open the project, remove that photo from *Project images*, then **Publish**. (A project must keep at least one photo.)
- **A Site Images photo** — open **Site Images**, clear that slot, then **Publish**. The photo we supplied comes back.

The website updates within about a minute.

---

## Photo tips

- JPG or WebP, at least 1600 px wide, under 2 MB.
- Don't crop small — the website resizes photos for phones and laptops automatically.
- Landscape (wide) photos sit best in the galleries.

## If a photo doesn't appear

1. Check the document has no red warning marks — an unfilled Indonesian title or alt text is the usual cause.
2. Check you pressed **Publish**, not just left it as a draft.
3. For the home page, check **Feature on home page** is on.
4. Wait a minute and refresh the page.

---

Agency notes: site is on Netlify (`ptsugee`), CMS is Sanity project `4wqvzcqy` (dataset `production`). A Sanity webhook calls `/api/revalidate` on publish; its secret is `SANITY_REVALIDATE_SECRET` on Netlify. The webhook only acts on the `projectGallery` and `siteImages` document types — anything else is rejected with a 400. Invite the client to the Sanity project as **Editor**.

Where published content lands: `/gallery` (all Studio projects, plus the Site Images covers and hero/about/quality photos under *In the field*), each `/[service]` page (that service's projects), `/service` (all projects), and the home page (`featured` only). The built-in photo sets are fallbacks, each dropped as soon as Studio serves the content it covers: `src/content/field-images.ts` for `/gallery`, `src/content/uploaded-projects.ts` for the home gallery (kept until a project is featured), and `src/content/site-images.ts` per empty Site Images slot.
