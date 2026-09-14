import { expect, test } from "./fixtures";

test("client ticker continuously animates full-colour logos at every responsive width", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const window = page.locator(".client-logo-window");
  const track = page.locator(".client-logo-track");
  await window.scrollIntoViewIfNeeded();

  const presentation = await track.evaluate((element) => {
    const trackStyle = getComputedStyle(element);
    const imageStyle = getComputedStyle(element.querySelector("img")!);

    return {
      animationName: trackStyle.animationName,
      animationDirection: trackStyle.animationDirection,
      animationIterationCount: trackStyle.animationIterationCount,
      filter: imageStyle.filter,
    };
  });

  expect(presentation.animationName).toBe("client-logo-marquee");
  expect(presentation.animationDirection).toBe("normal");
  expect(presentation.animationIterationCount).toBe("infinite");
  expect(presentation.filter).toBe("none");
});

test("client ticker loop has a seamless one-group translation without normal-motion collisions", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const window = page.locator(".client-logo-window");
  const track = page.locator(".client-logo-track");
  await window.scrollIntoViewIfNeeded();

  const loop = await track.evaluate((element) => {
    const groups = Array.from(element.querySelectorAll<HTMLElement>(":scope > .client-logo-group"));
    const primaryCells = Array.from(groups[0].querySelectorAll<HTMLElement>(".client-logo"));
    const duplicateCells = Array.from(groups[1].querySelectorAll<HTMLElement>(".client-logo"));
    const primary = groups[0].getBoundingClientRect();
    const duplicate = groups[1].getBoundingClientRect();
    const first = primaryCells[0].getBoundingClientRect();
    const second = primaryCells[1].getBoundingClientRect();
    const last = primaryCells.at(-1)!.getBoundingClientRect();
    const duplicateFirst = duplicateCells[0].getBoundingClientRect();
    const animation = element.getAnimations()[0];
    const effect = animation.effect as KeyframeEffect;
    const duration = effect.getTiming().duration;

    if (typeof duration !== "number") throw new Error("Ticker animation must have a numeric duration");
    animation.pause();
    effect.updateTiming({ fill: "both", iterations: 1 });
    animation.currentTime = duration;
    const endTranslation = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
    animation.currentTime = duration * 0.375;

    const cells = [...primaryCells, ...duplicateCells].map((cell) => {
      const cellRect = cell.getBoundingClientRect();
      const imageRect = cell.querySelector("img")!.getBoundingClientRect();
      return {
        cell: { left: cellRect.left, right: cellRect.right, top: cellRect.top, bottom: cellRect.bottom },
        image: { left: imageRect.left, right: imageRect.right, top: imageRect.top, bottom: imageRect.bottom },
      };
    });

    return {
      primaryWidth: primary.width,
      duplicateWidth: duplicate.width,
      internalGap: second.left - first.right,
      seamGap: duplicateFirst.left - last.right,
      endTranslation,
      animationProgress: effect.getComputedTiming().progress,
      cells,
    };
  });

  expect(loop.primaryWidth).toBeCloseTo(loop.duplicateWidth, 1);
  expect(loop.seamGap).toBeGreaterThanOrEqual(0);
  expect(loop.seamGap).toBeCloseTo(loop.internalGap, 1);
  expect(loop.endTranslation).toBeLessThan(0);
  expect(loop.endTranslation).toBeCloseTo(-loop.primaryWidth, 1);
  expect(loop.animationProgress).toBeCloseTo(0.375, 3);

  for (const [index, { cell, image }] of loop.cells.entries()) {
    expect(image.left, `normal-motion logo ${index + 1} extends past its cell's left edge`).toBeGreaterThanOrEqual(cell.left - 0.5);
    expect(image.right, `normal-motion logo ${index + 1} extends past its cell's right edge`).toBeLessThanOrEqual(cell.right + 0.5);
    expect(image.top, `normal-motion logo ${index + 1} extends past its cell's top edge`).toBeGreaterThanOrEqual(cell.top - 0.5);
    expect(image.bottom, `normal-motion logo ${index + 1} extends past its cell's bottom edge`).toBeLessThanOrEqual(cell.bottom + 0.5);
  }

  for (let first = 0; first < loop.cells.length; first += 1) {
    for (let second = first + 1; second < loop.cells.length; second += 1) {
      const a = loop.cells[first].cell;
      const b = loop.cells[second].cell;
      const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      expect(horizontalOverlap > 0.5 && verticalOverlap > 0.5, `normal-motion logo cells ${first + 1} and ${second + 1} overlap`).toBe(false);
    }
  }
});

test("client ticker exposes one semantic eight-logo list and hides its visual duplicate", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const semanticList = page.getByRole("list", { name: /selected companies/i });
  await expect(semanticList).toHaveCount(1);
  await expect(semanticList.getByRole("listitem")).toHaveCount(8);
  await expect(semanticList.locator("img:not([alt=''])")).toHaveCount(8);

  const duplicate = page.locator(".client-logo-group[aria-hidden='true']");
  await expect(duplicate).toHaveCount(1);
  await expect(duplicate.locator("img")).toHaveCount(8);
  await expect(duplicate.locator("img:not([alt=''])")).toHaveCount(0);
});

test("client ticker pauses for hover and keyboard focus", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const window = page.locator(".client-logo-window");
  const track = page.locator(".client-logo-track");
  await window.scrollIntoViewIfNeeded();
  await window.hover();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");

  await page.mouse.move(0, 0);
  await window.focus();
  await expect(window).toBeFocused();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
});

test("reduced-motion ticker is a static scrollable row without overlap or clipping", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  const window = page.locator(".client-logo-window");
  const semanticCells = page.locator(".client-logo-group:not([aria-hidden='true']) .client-logo");
  await expect(semanticCells).toHaveCount(8);
  await window.scrollIntoViewIfNeeded();
  await expect
    .poll(() => semanticCells.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete)))
    .toBe(true);

  const windowBehavior = await window.evaluate((element) => {
    const style = getComputedStyle(element);
    return { overflowX: style.overflowX, scrollable: element.scrollWidth > element.clientWidth };
  });
  expect(windowBehavior.overflowX).toBe("auto");
  expect(windowBehavior.scrollable).toBe(true);

  const geometry = await semanticCells.evaluateAll((elements) =>
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
      expect(horizontalOverlap > 0.5 && verticalOverlap > 0.5, `logo cells ${first + 1} and ${second + 1} overlap`).toBe(false);
    }
  }
});
