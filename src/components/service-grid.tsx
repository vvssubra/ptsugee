import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/routing";

type ServiceMessages = Record<string, { title: string; summary: string }>;
export function ServiceGrid({ locale, services: labels }: { locale: Locale; services: ServiceMessages }) {
  const prefix = locale === "en" ? "" : "/id";
  return <div className="service-grid">{services.map((service, index) => {
    const label = labels[service.slug];
    return <Link className="service-card" data-testid="service-link" href={`${prefix}/${service.slug}`} key={service.slug}>
      <Image src={service.heroImage} alt="" className="service-card__image" sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw" />
      <div className="service-card__shade" /><div className="service-card__content"><span className="service-card__number" aria-hidden="true">0{index + 1}</span><h3>{label.title}</h3><p>{label.summary}</p><span className="service-card__arrow" aria-hidden="true">↗</span></div>
    </Link>;
  })}</div>;
}
