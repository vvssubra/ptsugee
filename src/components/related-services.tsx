import { Link } from "@/i18n/navigation";
import type { ServiceContent, ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";

type ServiceLabels = Record<ServiceSlug, { title: string; summary: string }>;

export function RelatedServices({ detailsLabel, labels, locale, service }: { detailsLabel: string; labels: ServiceLabels; locale: Locale; service: ServiceContent }) {
  return (
    <div className="related-services">
      {service.relatedServices.map((slug) => <Link href={`/${slug}`} locale={locale === "id" ? "id" : undefined} key={slug}><h3>{labels[slug].title}</h3><p>{labels[slug].summary}</p><span>{detailsLabel} ↗</span></Link>)}
    </div>
  );
}
