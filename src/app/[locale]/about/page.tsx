import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { AboutSections } from "@/components/about-sections";
import { ContactBoundary } from "@/components/contact-boundary";
import { routing, type Locale } from "@/i18n/routing";

const messages = { en: enMessages, id: idMessages } as const;
const siteUrl = "https://ptsugee.com";

export function AboutPage({ locale }: { locale: Locale }) {
  const dictionary = messages[locale];
  return <main>
    <AboutSections alt={dictionary.images.aboutHero} copy={dictionary.about} />
    <ContactBoundary contact={dictionary.contact} locale={locale} />
  </main>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const metadata = messages[locale].about.metadata;
  return { title: metadata.title, description: metadata.description, alternates: { canonical: `${siteUrl}${locale === "en" ? "" : "/id"}/about`, languages: { en: `${siteUrl}/about`, id: `${siteUrl}/id/about`, "x-default": `${siteUrl}/about` } } };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <AboutPage locale={locale} />;
}
