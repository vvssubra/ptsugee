import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { AboutSections } from "@/components/about-sections";
import { ContactBoundary } from "@/components/contact-boundary";
import { serviceSlugs } from "@/content/types";
import type { Locale } from "@/i18n/routing";

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
