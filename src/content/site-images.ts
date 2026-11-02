import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import { clientLogoAssets, heroAssets, serviceAssets, type LocalImageAsset } from "@/content/assets";
import { serviceSlugs, type ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface SiteImages {
  homeHero: SiteImage;
  aboutHero: SiteImage;
  qualityTeam: SiteImage;
  services: Record<ServiceSlug, SiteImage>;
  clientLogos: SiteImage[];
}

const messages = { en: enMessages, id: idMessages } as const;

// Sanity field names cannot contain hyphens.
export const serviceImageField = (slug: ServiceSlug) => slug.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());

/** The built-in photos shipped in /public; any Studio image left empty falls back to these. */
export function localSiteImages(locale: Locale): SiteImages {
  const alts: Record<string, string> = messages[locale].images;
  const toImage = ({ src, width, height, altKey }: LocalImageAsset): SiteImage => ({ src, width, height, alt: alts[altKey.replace("images.", "")] ?? "" });

  return {
    homeHero: toImage(heroAssets.home),
    aboutHero: toImage(heroAssets.about),
    qualityTeam: toImage(heroAssets.quality),
    services: Object.fromEntries(serviceSlugs.map((slug) => [slug, toImage(serviceAssets[slug])])) as Record<ServiceSlug, SiteImage>,
    clientLogos: Object.values(clientLogoAssets).map(toImage),
  };
}
