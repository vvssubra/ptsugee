import { englishRoutes, equivalentPath, expect, localizedPath, test } from "./fixtures";

for (const route of englishRoutes) {
  test(`language controls preserve the equivalent ${route} route`, async ({ page }) => {
    const english = localizedPath("en", route);
    const indonesian = localizedPath("id", route);

    await page.goto(english);
    const language = page.getByRole("group", { name: /language|bahasa/i }).first();
    await language.getByRole("link", { name: "Bahasa Indonesia" }).click();
    await expect(page).toHaveURL(new RegExp(`${indonesian.replaceAll("/", "\\/")}/?$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    expect(await page.context().cookies()).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "NEXT_LOCALE", value: "id" })]),
    );

    const englishLink = page.getByRole("group", { name: /language|bahasa/i }).first().getByRole("link", { name: "English" });
    await englishLink.click();
    await expect(page).toHaveURL(new RegExp(`${english === "/" ? "\\/" : english.replaceAll("/", "\\/")}/?$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
}

test("an explicit locale choice persists through internal navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("group", { name: /language|bahasa/i }).first().getByRole("link", { name: "Bahasa Indonesia" }).click();
  if (await page.getByRole("button", { name: /^menu$/i }).isVisible()) {
    await page.getByRole("button", { name: /^menu$/i }).click();
  }
  await page.locator("#site-navigation").getByRole("link", { name: /^Tentang Kami$/ }).click();
  await expect(page).toHaveURL(/\/id\/about\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("mobile menu moves focus into navigation and Escape restores it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375", "Mobile navigation interaction");
  await page.goto("/");
  const menuButton = page.locator('button[aria-controls="site-navigation"]');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#site-navigation").getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toBeFocused();
});

for (const [path, question] of [
  ["/", "Where does PT SUGEE operate?"],
  ["/id", "Di mana PT SUGEE beroperasi?"],
] as const) {
  test(`FAQ is keyboard operable on ${path}`, async ({ page }) => {
    await page.goto(path);
    const trigger = page.getByRole("button", { name: question });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panelId = await trigger.getAttribute("aria-controls");
    await expect(page.locator(`#${panelId}`)).toBeVisible();
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
}

test("localized path helper covers both directions", () => {
  expect(equivalentPath("/id/laser-alignment-service", "en")).toBe("/laser-alignment-service");
  expect(equivalentPath("/laser-alignment-service", "id")).toBe("/id/laser-alignment-service");
});
