import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const representativeRoutes = ["/", "/about", "/service", "/laser-alignment-service", "/id", "/id/about", "/id/service", "/id/laser-alignment-service"] as const;

for (const path of representativeRoutes) {
  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const violations = results.violations
      .filter(({ impact }) => impact === "serious" || impact === "critical")
      .map(({ id, help, nodes }) => `${id}: ${help} (${nodes.length})`);
    expect(violations).toEqual([]);
  });
}

test("reduced-motion preference disables smooth scrolling and marquee animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const behavior = await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior);
  const animation = await page.locator(".client-logo-grid").evaluate((element) => getComputedStyle(element).animationName);
  const transform = await page.locator(".client-logo-grid").evaluate((element) => getComputedStyle(element).transform);
  expect(behavior).toBe("auto");
  expect(animation).toBe("none");
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
});

test("gallery failure is localized and does not remove its section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator(".project-gallery__state")).toContainText(/project images are temporarily unavailable/i);

  await page.goto("/id/laser-alignment-service");
  await expect(page.getByTestId("service-gallery")).toBeVisible();
  await expect(page.locator(".project-gallery__state")).toContainText(/Gambar proyek untuk sementara belum tersedia/i);
});
