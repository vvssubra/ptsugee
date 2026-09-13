import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { AboutSections } from "@/components/about-sections";
import { ContactBoundary } from "@/components/contact-boundary";
import { serviceSlugs } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

const messages = { en: enMessages, id: idMessages } as const;

export function AboutPage({ locale }: { locale: Locale }) {
  const dictionary = messages[locale];
  return <main>
    <AboutSections
      alt={dictionary.images.aboutHero}
      capabilities={serviceSlugs.map((slug) => ({ slug, title: dictionary.services[slug].title }))}
      capabilityLabel={dictionary.servicesIndex.directoryEyebrow}
      copy={dictionary.about}
      locale={locale}
    />
    <ContactBoundary contact={dictionary.contact} locale={locale} />
  </main>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/about", messages[locale].about.metadata);
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <AboutPage locale={locale} />;
}
