import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import { serviceSlugs } from "@/content/types";
import { buildLocalizedMetadata, publicRoutePaths } from "@/lib/metadata";

describe("localized metadata", () => {
  it("defines the ten public route paths", () => {
    expect(publicRoutePaths).toEqual(["/", "/about", "/service", "/gallery", ...serviceSlugs.map((slug) => `/${slug}`)]);
  });

  it("builds unique localized metadata for all 20 public URLs", () => {
    const dictionaries = { en: enMessages, id: idMessages } as const;
    const results = (["en", "id"] as const).flatMap((locale) => publicRoutePaths.map((path) => {
      const dictionary = dictionaries[locale];
      const copy = path === "/"
        ? dictionary.home.metadata
        : path === "/about"
          ? dictionary.about.metadata
          : path === "/gallery"
            ? { title: "Field Gallery | PT SUGEE", description: "Field photography" }
          : path === "/service"
            ? dictionary.servicesIndex.metadata
            : dictionary.services[path.slice(1) as keyof typeof dictionary.services].metadata;
      return buildLocalizedMetadata(locale, path, copy);
    }));

    expect(results).toHaveLength(20);
    expect(new Set(results.map(({ alternates }) => alternates?.canonical?.toString())).size).toBe(20);
    expect(results.every(({ title, description }) => Boolean(title && description))).toBe(true);
  });

  it.each([
    ["en", "/", enMessages.home.metadata],
    ["id", "/", idMessages.home.metadata],
    ["en", "/about", enMessages.about.metadata],
    ["id", "/service", idMessages.servicesIndex.metadata],
    ["en", "/laser-alignment-service", enMessages.services["laser-alignment-service"].metadata],
    ["id", "/in-situ-machining", idMessages.services["in-situ-machining"].metadata],
  ] as const)("builds route-specific %s metadata for %s", (locale, path, copy) => {
    const metadata = buildLocalizedMetadata(locale, path, copy);
    const englishUrl = `https://ptsugee.com${path === "/" ? "" : path}`;
    const indonesianUrl = `https://ptsugee.com/id${path === "/" ? "" : path}`;

    expect(metadata.title).toBe(copy.title);
    expect(metadata.description).toBe(copy.description);
    expect(metadata.alternates).toEqual({
      canonical: locale === "en" ? englishUrl : indonesianUrl,
      languages: { en: englishUrl, id: indonesianUrl, "x-default": englishUrl },
    });
    expect(metadata.openGraph).toMatchObject({
      title: copy.title,
      description: copy.description,
      locale: locale === "en" ? "en_US" : "id_ID",
      url: locale === "en" ? englishUrl : indonesianUrl,
    });
  });
});
