import type { Metadata } from "next";
import { serviceSlugs } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export const siteOrigin = "https://ptsugee.com" as const;

export const publicRoutePaths = ["/", "/about", "/service", ...serviceSlugs.map((slug) => `/${slug}` as const)] as const;
export type PublicRoutePath = (typeof publicRoutePaths)[number];

type MetadataCopy = { title: string; description: string };

const socialImageByPath: Record<PublicRoutePath, string> = {
  "/": "/images/hero/home-offshore-rig.webp",
  "/about": "/images/hero/about-offshore-team.webp",
  "/service": "/images/hero/home-offshore-rig.webp",
  "/machinery-equipment-installation": "/images/services/machinery-equipment-installation.webp",
  "/machinery-equipment-overhauling": "/images/services/machinery-equipment-overhauling.webp",
  "/epocast": "/images/services/epocast.webp",
  "/laser-alignment-service": "/images/services/laser-alignment-service.webp",
  "/in-situ-machining": "/images/services/in-situ-machining.webp",
  "/flange-management": "/images/services/flange-management.webp",
};

export function localizedUrl(locale: Locale, path: PublicRoutePath): string {
  const suffix = path === "/" ? "" : path;
  return `${siteOrigin}${locale === "id" ? "/id" : ""}${suffix}`;
}

export function localizedAlternates(path: PublicRoutePath) {
  const english = localizedUrl("en", path);
  return {
    en: english,
    id: localizedUrl("id", path),
    "x-default": english,
  } as const;
}

export function buildLocalizedMetadata(
  locale: Locale,
  path: PublicRoutePath,
  copy: MetadataCopy,
): Metadata {
  const url = localizedUrl(locale, path);
  const image = new URL(socialImageByPath[path], siteOrigin).toString();

  return {
    metadataBase: new URL(siteOrigin),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: localizedAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: "PT SUGEE",
      title: copy.title,
      description: copy.description,
      locale: locale === "en" ? "en_US" : "id_ID",
      alternateLocale: locale === "en" ? ["id_ID"] : ["en_US"],
      url,
      images: [{ url: image, alt: copy.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}
