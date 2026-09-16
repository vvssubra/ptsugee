import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../messages/en.json";
import idMessages from "../../../messages/id.json";
import { routing } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getFeaturedProjects } from "@/sanity/lib/fetch-projects";

const messages = { en: enMessages, id: idMessages } as const;

import { HomePage } from "./home-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/", messages[locale].home.metadata);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <HomePage locale={locale} gallery={await getFeaturedProjects(locale)} />;
}
