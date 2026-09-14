import { expect, test } from "./fixtures";

for (const route of ["/", "/id"]) {
  test(`hero reveals before releasing the next section on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const hero = page.locator(".home-hero-sticky");
    const media = page.locator(".home-hero__media");
    const scene = page.locator(".home-hero-scene");
    const next = page.locator(".capabilities-section");
    const initial = (await hero.boundingBox())!;
    const travel = await scene.evaluate((element) => element.getBoundingClientRect().bottom + window.scrollY - window.innerHeight);
    const scale = () => media.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
    const scrollTo = async (top: number) => {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    };

    await expect.poll(scale).toBeCloseTo(1.5, 2);
    await scrollTo(travel * 0.5);
    await expect.poll(scale).toBeLessThan(1.4);
    expect(await scale()).toBeGreaterThan(1.05);
    expect((await hero.boundingBox())!.y).toBeCloseTo(initial.y, 0);
    expect((await next.boundingBox())!.y).toBeGreaterThanOrEqual(page.viewportSize()!.height);

    await scrollTo(travel * 0.95);
    await expect.poll(scale).toBeCloseTo(1, 2);
    expect((await hero.boundingBox())!.y).toBeCloseTo(initial.y, 0);
    expect((await next.boundingBox())!.y).toBeGreaterThanOrEqual(page.viewportSize()!.height);

    await scrollTo(travel + 250);
    await expect.poll(async () => (await next.boundingBox())!.y).toBeLessThan(page.viewportSize()!.height);
    expect((await hero.boundingBox())!.y).toBeLessThan(initial.y);

    await scrollTo(0);
    await expect.poll(scale).toBeCloseTo(1.5, 2);
  });
}

test("reduced motion skips the pinned reveal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const hero = page.locator(".home-hero-sticky");
  await expect.poll(() => hero.evaluate((element) => getComputedStyle(element).position)).toBe("relative");
  expect(await page.locator(".home-hero-scene").evaluate((element) => element.clientHeight)).toBe(await hero.evaluate((element) => element.clientHeight));
  const isUntransformed = () => page.locator(".home-hero__media").evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).isIdentity);
  await expect.poll(isUntransformed).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  await expect.poll(isUntransformed).toBe(true);
});
