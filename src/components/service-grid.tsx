import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { SiteImage } from "@/content/site-images";
import { services } from "@/content/services";
import type { ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";

type ServiceMessages = Record<string, { title: string; summary: string }>;
export function ServiceGrid({ images, locale, services: labels }: { images: Record<ServiceSlug, SiteImage>; locale: Locale; services: ServiceMessages }) {
  return <div className="service-grid">{services.map((service, index) => {
    const label = labels[service.slug];
    const image = images[service.slug];
    return <Link className="service-card" data-testid="service-link" href={`/${service.slug}`} locale={locale === "id" ? "id" : undefined} key={service.slug}>
      <Image src={image.src} width={image.width} height={image.height} alt="" className="service-card__image" sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw" />
      <div className="service-card__shade" /><div className="service-card__content"><span className="service-card__number" aria-hidden="true">0{index + 1}</span><h3>{label.title}</h3><p>{label.summary}</p><span className="service-card__arrow" aria-hidden="true">↗</span></div>
    </Link>;
  })}</div>;
}
