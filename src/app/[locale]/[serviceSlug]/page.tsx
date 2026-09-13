import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { ServiceDetail, type ServicePageCopy } from "@/components/service-detail";
import { isServiceSlug, services } from "@/content/services";
import { serviceSlugs, type ServiceSlug } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { getProjectsByService, type ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const messages = { en: enMessages, id: idMessages } as const;
const siteUrl = "https://ptsugee.com";

const serviceAltKeys: Record<ServiceSlug, keyof typeof enMessages.images> = {
  "machinery-equipment-installation": "serviceMachineryInstallation",
  "machinery-equipment-overhauling": "serviceMachineryOverhauling",
  epocast: "serviceEpocast",
  "laser-alignment-service": "serviceLaserAlignment",
  "in-situ-machining": "serviceInSituMachining",
  "flange-management": "serviceFlangeManagement",
};

export function ServiceDetailPage({ locale, serviceSlug, gallery }: { locale: Locale; serviceSlug: ServiceSlug; gallery: ProjectGalleryResult }) {
  const dictionary = messages[locale];
  const service = services.find((item) => item.slug === serviceSlug);
  if (!service) notFound();

  return <main><ServiceDetail
    alt={dictionary.images[serviceAltKeys[serviceSlug]]}
    contact={dictionary.contact}
    copy={dictionary.services[serviceSlug] as ServicePageCopy}
    detailLabels={dictionary.serviceDetail}
    gallery={gallery}
    galleryLabels={{ empty: dictionary.system.noRelatedProjects, unavailable: dictionary.system.galleryUnavailable, previous: dictionary.home.featuredProjects.previous, next: dictionary.home.featuredProjects.next, filters: dictionary.home.featuredProjects.filtersLabel, all: dictionary.home.featuredProjects.allServices }}
    locale={locale}
    service={service}
    serviceLabels={dictionary.services}
  /></main>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs.map((serviceSlug) => ({ locale, serviceSlug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; serviceSlug: string }> }): Promise<Metadata> {
  const { locale, serviceSlug } = await params;
  if (!hasLocale(routing.locales, locale) || !isServiceSlug(serviceSlug)) notFound();
  const metadata = messages[locale].services[serviceSlug].metadata;
  const prefix = locale === "en" ? "" : "/id";
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `${siteUrl}${prefix}/${serviceSlug}`,
      languages: { en: `${siteUrl}/${serviceSlug}`, id: `${siteUrl}/id/${serviceSlug}`, "x-default": `${siteUrl}/${serviceSlug}` },
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; serviceSlug: string }> }) {
  const { locale, serviceSlug } = await params;
  if (!hasLocale(routing.locales, locale) || !isServiceSlug(serviceSlug)) notFound();
  return <ServiceDetailPage locale={locale} serviceSlug={serviceSlug} gallery={await getProjectsByService(serviceSlug, locale)} />;
}
