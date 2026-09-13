import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("matches the approved English URL encoding", () => {
    expect(buildWhatsAppUrl("en")).toBe(
      "https://wa.me/6591004649?text=Hello%20PT%20SUGEE%2C%20I%20would%20like%20to%20discuss%20an%20engineering%20requirement.",
    );
  });

  it.each([
    ["en", "Hello PT SUGEE, I would like to discuss an engineering requirement."],
    ["id", "Halo PT SUGEE, saya ingin mendiskusikan kebutuhan engineering."],
  ] as const)("builds the approved %s contact URL", (locale, message) => {
    const url = new URL(buildWhatsAppUrl(locale));

    expect(`${url.origin}${url.pathname}`).toBe("https://wa.me/6591004649");
    expect(url.searchParams.get("text")).toBe(message);
  });
});
