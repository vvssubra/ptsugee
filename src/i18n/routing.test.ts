import { defaultLocale, locales } from "@/i18n/routing";

describe("locale routing", () => {
  it("exposes English and Bahasa Indonesia with English as the default", () => {
    expect(locales).toEqual(["en", "id"]);
    expect(defaultLocale).toBe("en");
  });
});
