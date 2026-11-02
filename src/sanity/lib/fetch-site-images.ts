import {localSiteImages, serviceImageField, type SiteImage, type SiteImages} from "@/content/site-images";
import {serviceSlugs, type ServiceSlug} from "@/content/types";
import type {Locale} from "@/i18n/routing";
import {isSanityConfigured, sanityClient} from "./client";
import type {SanityReadClient} from "./fetch-projects";
import {siteImagesQuery} from "./queries";

type StudioImage = Partial<SiteImage> | null | undefined;

export interface SiteImagesDocument {
  homeHero?: StudioImage;
  aboutHero?: StudioImage;
  qualityTeam?: StudioImage;
  services?: Record<string, StudioImage> | null;
  clientLogos?: StudioImage[] | null;
}

function pick(studio: StudioImage, fallback: SiteImage): SiteImage {
  if (!studio?.src || !studio.width || !studio.height) return fallback;
  return {src: studio.src, width: studio.width, height: studio.height, alt: studio.alt?.trim() || fallback.alt};
}

/** Studio images win; every empty or half-uploaded slot keeps the built-in photo. */
export function mergeSiteImages(document: SiteImagesDocument | null, fallback: SiteImages): SiteImages {
  if (!document) return fallback;
  const logos = (document.clientLogos ?? []).filter((logo): logo is SiteImage => Boolean(logo?.src && logo.width && logo.height));

  return {
    homeHero: pick(document.homeHero, fallback.homeHero),
    aboutHero: pick(document.aboutHero, fallback.aboutHero),
    qualityTeam: pick(document.qualityTeam, fallback.qualityTeam),
    services: Object.fromEntries(
      serviceSlugs.map((slug) => [slug, pick(document.services?.[serviceImageField(slug)], fallback.services[slug])]),
    ) as Record<ServiceSlug, SiteImage>,
    clientLogos: logos.length ? logos : fallback.clientLogos,
  };
}

export function createSiteImagesReader(client: SanityReadClient) {
  return async (locale: Locale): Promise<SiteImages> => {
    const fallback = localSiteImages(locale);
    try {
      const document = await client.fetch<SiteImagesDocument | null>(siteImagesQuery, {locale}, {next: {tags: ["siteImages"]}});
      return mergeSiteImages(document, fallback);
    } catch {
      return fallback;
    }
  };
}

const readSiteImages = createSiteImagesReader(sanityClient);

export function getSiteImages(locale: Locale): Promise<SiteImages> {
  if (!isSanityConfigured) return Promise.resolve(localSiteImages(locale));
  return readSiteImages(locale);
}
