import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { serviceSlugs } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getProjectsByService, type ProjectGalleryResult } from "@/sanity/lib/fetch-projects";
import { ServicesPage } from "./services-view";

const messages = { en: enMessages, id: idMessages } as const;

async function getAllProjects(locale: Locale): Promise<ProjectGalleryResult> {
  const results = await Promise.all(serviceSlugs.map((slug) => getProjectsByService(slug, locale)));
  const projects = results.flatMap((result) => result.status === "ready" ? result.projects : []);
  if (projects.length) return { status: "ready", projects: projects.sort((a, b) => a.displayOrder - b.displayOrder) };
  return results.some((result) => result.status === "unavailable")
    ? { status: "unavailable", projects: [] }
    : { status: "empty", projects: [] };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/service", messages[locale].servicesIndex.metadata);
}

export default async function ServiceIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ServicesPage locale={locale} gallery={await getAllProjects(locale)} />;
}
