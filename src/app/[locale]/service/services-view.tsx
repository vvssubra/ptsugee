import Image from "next/image";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { ContactBoundary } from "@/components/contact-boundary";
import { ProjectGallery } from "@/components/project-gallery";
import { ServiceDirectory } from "@/components/service-directory";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { heroAssets } from "@/content/assets";
import type { Locale } from "@/i18n/routing";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const messages = { en: enMessages, id: idMessages } as const;

export function ServicesPage({ locale, gallery }: { locale: Locale; gallery: ProjectGalleryResult }) {
  const dictionary = messages[locale];
  const intro = dictionary.servicesIndex;
  const serviceLabels = Object.fromEntries(
    Object.entries(dictionary.services).map(([slug, service]) => [slug, service.title]),
  ) as Record<keyof typeof dictionary.services, string>;
  return <main>
    <section className="section services-intro" aria-labelledby="services-heading">
      <Image className="services-intro__image" src={heroAssets.quality} alt={dictionary.images.qualityTeam} fill priority sizes="100vw" />
      <div className="services-intro__overlay" />
      <Container className="services-intro__content">
      <h1 id="services-heading">{intro.heading}</h1><p>{intro.body}</p><ButtonLink href="#contact">{intro.cta}</ButtonLink>
      </Container>
    </section>
    <section className="section service-directory-section" aria-labelledby="directory-heading"><Container>
      <p className="eyebrow">{intro.directoryEyebrow}</p><h2 id="directory-heading">{intro.directoryHeading}</h2>
      <ServiceDirectory detailsLabel={intro.detailsLabel} labels={dictionary.services} locale={locale} />
    </Container></section>
    <section className="section project-section" id="projects" aria-labelledby="services-projects-heading"><Container>
      <p className="eyebrow">{intro.projectsEyebrow}</p><h2 id="services-projects-heading">{intro.projectsHeading}</h2><p className="section-heading__body">{intro.projectsBody}</p>
      <ProjectGallery gallery={gallery} emptyMessage={dictionary.system.noRelatedProjects} unavailableMessage={dictionary.system.galleryUnavailable} previousLabel={dictionary.home.featuredProjects.previous} nextLabel={dictionary.home.featuredProjects.next} pauseLabel={dictionary.home.featuredProjects.pause} playLabel={dictionary.home.featuredProjects.play} slideshowLabel={dictionary.home.featuredProjects.slideshowLabel} filtersLabel={dictionary.home.featuredProjects.filtersLabel} allServicesLabel={dictionary.home.featuredProjects.allServices} serviceLabels={serviceLabels} />
    </Container></section>
    <ContactBoundary contact={dictionary.contact} locale={locale} />
  </main>;
}
