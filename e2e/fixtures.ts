import { expect, test as base, type Page } from "playwright/test";

export const serviceSlugs = [
  "machinery-equipment-installation",
  "machinery-equipment-overhauling",
  "epocast",
  "laser-alignment-service",
  "in-situ-machining",
  "flange-management",
] as const;

export const englishRoutes = [
  "/",
  "/about",
  "/service",
  ...serviceSlugs.map((slug) => `/${slug}` as const),
] as const;

export const locales = ["en", "id"] as const;
export type TestLocale = (typeof locales)[number];

export function localizedPath(locale: TestLocale, path: (typeof englishRoutes)[number]) {
  if (locale === "en") return path;
  return path === "/" ? "/id" : `/id${path}`;
}

export function equivalentPath(path: string, locale: TestLocale) {
  const englishPath = path === "/id" ? "/" : path.replace(/^\/id(?=\/)/, "");
  return localizedPath(locale, englishPath as (typeof englishRoutes)[number]);
}

export async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => ({
        body: document.body.scrollWidth - document.body.clientWidth,
        document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      })),
    )
    .toEqual({ body: 0, document: 0 });
}

export async function internalPageLinks(page: Page) {
  return page.locator('a[href^="/"], a[href^="#"]').evaluateAll((anchors) =>
    [...new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href))],
  );
}

export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await provide(errors);
  },
});

export { expect };
