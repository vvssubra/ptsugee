import { englishRoutes, expect, locales, localizedPath, serviceSlugs, test } from "./fixtures";

for (const locale of locales) {
  for (const route of englishRoutes) {
    const path = localizedPath(locale, route);
    test(`${path} exposes localized canonical and alternate metadata`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-1440", "Metadata is viewport independent");
      await page.goto(path);
      await expect(page).toHaveTitle(/PT SUGEE/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      const canonical = `https://ptsugee.com${path === "/" ? "" : path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLd.some((value) => JSON.parse(value)["@type"].includes("Organization"))).toBe(true);
      if (serviceSlugs.some((slug) => route === `/${slug}`)) {
        expect(jsonLd.some((value) => JSON.parse(value)["@type"] === "Service")).toBe(true);
      }
    });
  }
}

test("robots and sitemap publish the complete bilingual route inventory", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Machine endpoints are viewport independent");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /studio");
  expect(robotsText).toContain("Disallow: /api");
  expect(robotsText).toContain("Disallow: /e2e-harness");
  expect(robotsText).toContain("Sitemap: https://ptsugee.com/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  for (const locale of locales) {
    for (const route of englishRoutes) {
      const path = localizedPath(locale, route);
      expect(sitemapText).toContain(`<loc>https://ptsugee.com${path === "/" ? "" : path}</loc>`);
    }
  }
});

for (const [path, language, heading] of [
  ["/does-not-exist", "en", "Page not found"],
  ["/id/does-not-exist", "id", "Halaman tidak ditemukan"],
] as const) {
  test(`${path} returns a localized 404 document`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "Error response is viewport independent");
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  });
}
