import { expect, test } from "./fixtures";

const pages = [
  ["home", "/"],
  ["about", "/about"],
  ["services", "/service"],
  ["laser-alignment", "/laser-alignment-service"],
] as const;

for (const [name, path] of pages) {
  test(`${name} matches the approved responsive structure`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 30));
      }
      window.scrollTo(0, 0);
    });
    await expect.poll(() => page.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete))).toBe(true);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator(".whatsapp-button")],
    });
  });
}
