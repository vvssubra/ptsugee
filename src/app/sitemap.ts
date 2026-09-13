import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedAlternates, localizedUrl, publicRoutePaths } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutePaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : path === "/about" || path === "/service" ? 0.8 : 0.7,
      alternates: { languages: localizedAlternates(path) },
    })),
  );
}
