import {
  englishRoutes,
  expect,
  expectNoHorizontalOverflow,
  internalPageLinks,
  locales,
  localizedPath,
  test,
} from "./fixtures";

for (const locale of locales) {
  for (const route of englishRoutes) {
    const path = localizedPath(locale, route);

    test(`${path} is a complete, linked, overflow-free ${locale} document`, async ({ page, consoleErrors }) => {
      const response = await page.goto(path, { waitUntil: "load" });

      expect(response?.status()).toBe(200);
      expect(response?.request().redirectedFrom()).toBeNull();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expectNoHorizontalOverflow(page);

      const links = await internalPageLinks(page);
      expect(links.length).toBeGreaterThan(0);
      const validPaths = new Set<string>(
        locales.flatMap((linkLocale) => englishRoutes.map((linkRoute) => localizedPath(linkLocale, linkRoute))),
      );
      for (const href of links) {
        const target = new URL(href);
        expect(validPaths.has(target.pathname), `invalid internal link on ${path}: ${href}`).toBe(true);
      }

      expect(consoleErrors, `console errors on ${path}`).toEqual([]);
    });
  }
}

test("mocked Sanity gallery supports filtering and keyboard carousel controls", async ({ page }) => {
  await page.goto("/e2e-harness/gallery?state=ready");
  const track = page.locator(".project-gallery__track");
  await expect(page.locator(".project-card")).toHaveCount(3);

  const filter = page.getByRole("button", { name: "Laser Alignment Services" });
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".project-card")).toHaveCount(1);

  await page.getByRole("button", { name: "All services" }).click();
  await track.evaluate((element) => { element.scrollLeft = 0; });
  const before = await track.evaluate((element) => element.scrollLeft);
  const next = page.getByRole("button", { name: "Next projects" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(before);
});

for (const [state, message] of [
  ["empty", "No published project images are available."],
  ["unavailable", "Project images are temporarily unavailable."],
] as const) {
  test(`mocked Sanity ${state} state preserves a useful gallery boundary`, async ({ page }) => {
    await page.goto(`/e2e-harness/gallery?state=${state}`);
    await expect(page.getByTestId("gallery-harness")).toBeVisible();
    await expect(page.locator(".project-gallery__state")).toHaveText(message);
  });
}
