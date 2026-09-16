import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("search discovery files", () => {
  it("lists all 20 localized public URLs with language alternates", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(20);
    expect(new Set(entries.map(({ url }) => url)).size).toBe(20);
    expect(entries.map(({ url }) => url)).not.toContain(expect.stringContaining("/studio"));
    expect(entries.map(({ url }) => url)).not.toContain(expect.stringContaining("/api"));
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/ptsugee\.com(?:\/|$)/);
      expect(entry.alternates?.languages).toEqual(expect.objectContaining({
        en: expect.stringMatching(/^https:\/\/ptsugee\.com/),
        id: expect.stringMatching(/^https:\/\/ptsugee\.com\/id(?:\/|$)/),
        "x-default": expect.stringMatching(/^https:\/\/ptsugee\.com/),
      }));
    }
  });

  it("allows public pages and excludes administrative and test-only routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api", "/api/", "/e2e-harness", "/e2e-harness/"],
      },
      sitemap: "https://ptsugee.com/sitemap.xml",
      host: "https://ptsugee.com",
    });
  });
});
