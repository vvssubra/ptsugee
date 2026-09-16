import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { isServiceSlug } from "@/content/services";
import { serviceSlugs } from "@/content/types";
import { routing } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getProjectsByService } from "@/sanity/lib/fetch-projects";
import { ServiceDetailPage } from "./service-detail-view";

const messages = { en: enMessages, id: idMessages } as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs.map((serviceSlug) => ({ locale, serviceSlug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; serviceSlug: string }> }): Promise<Metadata> {
  const { locale, serviceSlug } = await params;
  if (!hasLocale(routing.locales, locale) || !isServiceSlug(serviceSlug)) notFound();
  return buildLocalizedMetadata(locale, `/${serviceSlug}`, messages[locale].services[serviceSlug].metadata);
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; serviceSlug: string }> }) {
  const { locale, serviceSlug } = await params;
  if (!hasLocale(routing.locales, locale) || !isServiceSlug(serviceSlug)) notFound();
  return <ServiceDetailPage locale={locale} serviceSlug={serviceSlug} gallery={await getProjectsByService(serviceSlug, locale)} />;
}
