import { expect, test } from "./fixtures";

test("client logos stay inside distinct cells at every responsive width", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  const cells = page.locator(".client-logo");
  await expect(cells).toHaveCount(8);
  await cells.first().scrollIntoViewIfNeeded();
  await expect
    .poll(() => cells.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete)))
    .toBe(true);

  const geometry = await cells.evaluateAll((elements) =>
    elements.map((element) => {
      const cell = element.getBoundingClientRect();
      const image = element.querySelector("img")!.getBoundingClientRect();

      return {
        cell: { left: cell.left, right: cell.right, top: cell.top, bottom: cell.bottom },
        image: { left: image.left, right: image.right, top: image.top, bottom: image.bottom },
      };
    }),
  );

  for (const [index, { cell, image }] of geometry.entries()) {
    expect(image.left, `logo ${index + 1} extends past its cell's left edge`).toBeGreaterThanOrEqual(cell.left - 0.5);
    expect(image.right, `logo ${index + 1} extends past its cell's right edge`).toBeLessThanOrEqual(cell.right + 0.5);
    expect(image.top, `logo ${index + 1} extends past its cell's top edge`).toBeGreaterThanOrEqual(cell.top - 0.5);
    expect(image.bottom, `logo ${index + 1} extends past its cell's bottom edge`).toBeLessThanOrEqual(cell.bottom + 0.5);
  }

  for (let first = 0; first < geometry.length; first += 1) {
    for (let second = first + 1; second < geometry.length; second += 1) {
      const a = geometry[first].cell;
      const b = geometry[second].cell;
      const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);

      expect(
        horizontalOverlap > 0.5 && verticalOverlap > 0.5,
        `logo cells ${first + 1} and ${second + 1} overlap`,
      ).toBe(false);
    }
  }
});
