import { Link } from "@/i18n/navigation";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/routing";

type ServiceLabels = Record<string, { title: string; summary: string; capabilities?: string[]; benefits?: string[] }>;

export function ServiceDirectory({ detailsLabel, labels, locale }: { detailsLabel: string; labels: ServiceLabels; locale: Locale }) {
  return (
    <div className="service-directory">
      {services.map((service, index) => {
        const label = labels[service.slug];
        const capabilityPreview = (label.capabilities ?? label.benefits ?? []).slice(0, 3);
        return (
          <article className="service-directory__item" key={service.slug}>
            <span className="service-directory__number" aria-hidden="true">0{index + 1}</span>
            <div><h3>{label.title}</h3><p>{label.summary}</p></div>
            <ul>{capabilityPreview.map((capability) => <li key={capability}>{capability}</li>)}</ul>
            <Link data-testid="service-directory-link" href={`/${service.slug}`} locale={locale === "id" ? "id" : undefined}>
              <span>{detailsLabel}: {label.title}</span><span aria-hidden="true">↗</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
