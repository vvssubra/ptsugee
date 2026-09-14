import Image from "next/image";
import type { ServiceContent, ServiceSlug } from "@/content/types";
import { formatSpecificationGroups } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";
import { ProjectGallery } from "@/components/project-gallery";
import { RelatedServices } from "@/components/related-services";
import { TechnicalSpecifications } from "@/components/technical-specifications";
import { ContactBoundary } from "@/components/contact-boundary";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export type ServicePageCopy = {
  title: string;
  summary: string;
  hero: string;
  heroBody: string;
  problem: { heading: string; body: string };
  response: string;
  capabilities?: string[];
  benefits?: string[];
  equipment?: string[];
  applications?: string[];
  scope?: Record<string, string>;
  note?: string;
  cta: string;
};

type DetailLabels = {
  eyebrow: string;
  problemEyebrow: string;
  responseEyebrow: string;
  capabilitiesEyebrow: string;
  capabilitiesHeading: string;
  specificationsEyebrow: string;
  specificationsHeading: string;
  equipmentHeading: string;
  applicationsHeading: string;
  scopeHeading: string;
  noteHeading: string;
  projectsEyebrow: string;
  projectsHeading: string;
  relatedEyebrow: string;
  relatedHeading: string;
  detailsLabel: string;
};

type GalleryLabels = {
  empty: string;
  unavailable: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
  slideshow: string;
  filters: string;
  all: string;
};

function technicalGroups(service: ServiceContent, copy: ServicePageCopy, labels: DetailLabels, locale: Locale) {
  const groups: Array<{ heading: string; items: string[] }> = [];
  if (copy.equipment) groups.push({ heading: labels.equipmentHeading, items: copy.equipment });
  if (copy.applications) groups.push({ heading: labels.applicationsHeading, items: copy.applications });
  if (copy.scope) groups.push({ heading: labels.scopeHeading, items: formatSpecificationGroups(service, locale, copy.scope) });
  if (copy.note) groups.push({ heading: labels.noteHeading, items: [copy.note] });
  if (!groups.length) groups.push({ heading: copy.title, items: [copy.summary] });
  return groups;
}

export function ServiceDetail({
  alt,
  contact,
  copy,
  detailLabels,
  gallery,
  galleryLabels,
  locale,
  service,
  serviceLabels,
}: {
  alt: string;
  contact: { eyebrow: string; heading: string; body: string; whatsappCta: string; whatsappCtaLabel: string };
  copy: ServicePageCopy;
  detailLabels: DetailLabels;
  gallery: ProjectGalleryResult;
  galleryLabels: GalleryLabels;
  locale: Locale;
  service: ServiceContent;
  serviceLabels: Record<ServiceSlug, { title: string; summary: string }>;
}) {
  const capabilities = copy.capabilities ?? copy.benefits ?? [];
  const specifications = technicalGroups(service, copy, detailLabels, locale);
  const galleryServiceLabels = Object.fromEntries(
    Object.entries(serviceLabels).map(([slug, labels]) => [slug, labels.title]),
  ) as Record<ServiceSlug, string>;

  return (
    <div data-testid="service-detail-sequence">
      <section className="service-hero" aria-labelledby="service-heading">
        <div className="service-hero__media">
          <Image className="service-hero__image" src={service.heroImage} alt={alt} fill priority sizes="100vw" />
        </div>
        <div className="service-hero__overlay" />
        <Container className="service-hero__content">
          <p className="eyebrow service-hero__eyebrow">{detailLabels.eyebrow}</p>
          <h1 id="service-heading">{copy.hero}</h1>
          <p className="service-hero__body">{copy.heroBody}</p>
          <ButtonLink href="#contact">{copy.cta}</ButtonLink>
        </Container>
      </section>

      <section className="section service-response" aria-label={`${copy.problem.heading} / ${copy.response}`}>
        <Container className="service-response__grid">
          <article><p className="eyebrow">{detailLabels.problemEyebrow}</p><h2>{copy.problem.heading}</h2>{copy.problem.body ? <p>{copy.problem.body}</p> : null}</article>
          <article><p className="eyebrow">{detailLabels.responseEyebrow}</p><h2>{copy.response}</h2></article>
        </Container>
      </section>

      <section className="section service-capabilities" aria-labelledby="service-capabilities-heading">
        <Container><p className="eyebrow">{detailLabels.capabilitiesEyebrow}</p><h2 id="service-capabilities-heading">{detailLabels.capabilitiesHeading}</h2>
          <ol>{capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span><p>{capability}</p></li>)}</ol>
        </Container>
      </section>

      <section className="section technical-section" aria-labelledby="technical-heading">
        <Container><p className="eyebrow">{detailLabels.specificationsEyebrow}</p><h2 id="technical-heading">{detailLabels.specificationsHeading}</h2>
          <TechnicalSpecifications groups={specifications} />
        </Container>
      </section>

      <section className="section project-section service-projects" data-testid="service-gallery" aria-labelledby="service-projects-heading">
        <Container><p className="eyebrow">{detailLabels.projectsEyebrow}</p><h2 id="service-projects-heading">{detailLabels.projectsHeading}</h2>
          <ProjectGallery gallery={gallery} emptyMessage={galleryLabels.empty} unavailableMessage={galleryLabels.unavailable} previousLabel={galleryLabels.previous} nextLabel={galleryLabels.next} pauseLabel={galleryLabels.pause} playLabel={galleryLabels.play} slideshowLabel={galleryLabels.slideshow} filtersLabel={galleryLabels.filters} allServicesLabel={galleryLabels.all} serviceLabels={galleryServiceLabels} />
        </Container>
      </section>

      <section className="section related-section" aria-labelledby="related-heading">
        <Container><p className="eyebrow">{detailLabels.relatedEyebrow}</p><h2 id="related-heading">{detailLabels.relatedHeading}</h2>
          <RelatedServices detailsLabel={detailLabels.detailsLabel} labels={serviceLabels} locale={locale} service={service} />
        </Container>
      </section>
      <ContactBoundary contact={contact} locale={locale} />
    </div>
  );
}
