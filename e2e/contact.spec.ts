import { expect, test } from "./fixtures";

const expectedMessages = {
  en: "Hello PT SUGEE, I would like to discuss an engineering requirement.",
  id: "Halo PT SUGEE, saya ingin mendiskusikan kebutuhan engineering.",
} as const;

for (const [locale, path] of [["en", "/"], ["id", "/id"]] as const) {
  test(`${locale} contact boundary and persistent WhatsApp action are correct`, async ({ page }) => {
    await page.goto(path);
    const boundary = page.locator("#contact");
    await expect(boundary).toBeVisible();
    await expect(boundary.getByRole("heading", { level: 2 })).toHaveCount(1);
    await expect(page.locator('a[href="tel:+6591004649"]')).toHaveText("+65 9100 4649");
    await expect(page.locator('a[href="mailto:sathish@ptsugee.com"]')).toHaveText("sathish@ptsugee.com");

    const links = page.locator('a[href^="https://wa.me/6591004649"]');
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      const href = await link.getAttribute("href");
      const url = new URL(href!);
      expect(url.origin + url.pathname).toBe("https://wa.me/6591004649");
      expect(url.searchParams.get("text")).toBe(expectedMessages[locale]);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
}

test("contact navigation reaches the existing contact boundary", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile-375" || testInfo.project.name === "tablet-768") {
    await page.getByRole("button", { name: /^menu$/i }).click();
  }
  await page.locator("#site-navigation").getByRole("link", { name: /^contact$/i }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

// Deferred to Task 8 by explicit reprioritization: invalid-field feedback,
// retained values after delivery failure, and mocked Resend success/failure.
