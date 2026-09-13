import { expect, test } from "playwright/test";

const serviceSlugs = [
  "machinery-equipment-installation",
  "machinery-equipment-overhauling",
  "epocast",
  "laser-alignment-service",
  "in-situ-machining",
  "flange-management",
] as const;

const routes = ["/", "/about", "/service", ...serviceSlugs.map((slug) => `/${slug}`)];

for (const locale of ["en", "id"] as const) {
  for (const route of routes) {
    const path = locale === "en" ? route : route === "/" ? "/id" : `/id${route}`;

    test(`${path} resolves directly with the correct document language`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      expect(response?.request().redirectedFrom()).toBeNull();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }
}
