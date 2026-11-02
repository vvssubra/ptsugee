import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { ServiceDetail, type ServicePageCopy } from "@/components/service-detail";
import { services } from "@/content/services";
import { localSiteImages, type SiteImages } from "@/content/site-images";
import type { ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { buildServiceJsonLd, serializeJsonLd } from "@/lib/structured-data";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const messages = { en: enMessages, id: idMessages } as const;

export function ServiceDetailPage({ locale, serviceSlug, gallery, images = localSiteImages(locale) }: { locale: Locale; serviceSlug: ServiceSlug; gallery: ProjectGalleryResult; images?: SiteImages }) {
  const dictionary = messages[locale];
  const service = services.find((item) => item.slug === serviceSlug);
  if (!service) notFound();

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildServiceJsonLd(locale, serviceSlug)) }} />
    <ServiceDetail
    image={images.services[serviceSlug]}
    contact={dictionary.contact}
    copy={dictionary.services[serviceSlug] as ServicePageCopy}
    detailLabels={dictionary.serviceDetail}
    gallery={gallery}
    galleryLabels={{ empty: dictionary.system.noRelatedProjects, unavailable: dictionary.system.galleryUnavailable, previous: dictionary.home.featuredProjects.previous, next: dictionary.home.featuredProjects.next, pause: dictionary.home.featuredProjects.pause, play: dictionary.home.featuredProjects.play, slideshow: dictionary.home.featuredProjects.slideshowLabel, filters: dictionary.home.featuredProjects.filtersLabel, all: dictionary.home.featuredProjects.allServices }}
    locale={locale}
    service={service}
    serviceLabels={dictionary.services}
  /></main>;
}
