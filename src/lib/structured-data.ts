import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import type { ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { localizedUrl, siteOrigin } from "@/lib/metadata";

const messages = { en: enMessages, id: idMessages } as const;

export function buildOrganizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteOrigin}/#organization`,
    name: "PT SUGEE",
    url: siteOrigin,
    description: messages[locale].home.metadata.description,
    foundingDate: "2000",
    email: "sathish@ptsugee.com",
    telephone: "+65 9100 4649",
    parentOrganization: { "@type": "Organization", name: "New Millenium Group" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "K-15, Tunas Regency, Tanjung Uncang",
      addressLocality: "Batam",
      addressCountry: "ID",
    },
    areaServed: [
      { "@type": "Country", name: locale === "en" ? "Indonesia" : "Indonesia" },
      { "@type": "Country", name: locale === "en" ? "Singapore" : "Singapura" },
    ],
    inLanguage: locale === "en" ? "en" : "id",
  } as const;
}

export function buildServiceJsonLd(locale: Locale, slug: ServiceSlug) {
  const copy = messages[locale].services[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${localizedUrl(locale, `/${slug}`)}#service`,
    name: copy.title,
    description: copy.metadata.description,
    url: localizedUrl(locale, `/${slug}`),
    provider: {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "PT SUGEE",
      url: siteOrigin,
    },
    areaServed: [
      { "@type": "Country", name: "Indonesia" },
      { "@type": "Country", name: locale === "en" ? "Singapore" : "Singapura" },
    ],
    inLanguage: locale === "en" ? "en" : "id",
  } as const;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
