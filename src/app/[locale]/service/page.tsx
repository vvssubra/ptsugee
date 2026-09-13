import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { ContactBoundary } from "@/components/contact-boundary";
import { ProjectGallery } from "@/components/project-gallery";
import { ServiceDirectory } from "@/components/service-directory";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { routing, type Locale } from "@/i18n/routing";
import { serviceSlugs } from "@/content/types";
import { getProjectsByService, type ProjectGalleryResult } from "@/sanity/lib/fetch-projects";
import { buildLocalizedMetadata } from "@/lib/metadata";

const messages = { en: enMessages, id: idMessages } as const;

async function getAllProjects(locale: Locale): Promise<ProjectGalleryResult> {
  const results = await Promise.all(serviceSlugs.map((slug) => getProjectsByService(slug, locale)));
  const projects = results.flatMap((result) => result.status === "ready" ? result.projects : []);
  if (projects.length) return { status: "ready", projects: projects.sort((a, b) => a.displayOrder - b.displayOrder) };
  return results.some((result) => result.status === "unavailable")
    ? { status: "unavailable", projects: [] }
    : { status: "empty", projects: [] };
}

export function ServicesPage({ locale, gallery }: { locale: Locale; gallery: ProjectGalleryResult }) {
  const dictionary = messages[locale];
  const intro = dictionary.servicesIndex;
  const serviceLabels = Object.fromEntries(
    Object.entries(dictionary.services).map(([slug, service]) => [slug, service.title]),
  ) as Record<keyof typeof dictionary.services, string>;
  return <main>
    <section className="section services-intro" aria-labelledby="services-heading"><Container>
      <h1 id="services-heading">{intro.heading}</h1><p>{intro.body}</p><ButtonLink href="#contact">{intro.cta}</ButtonLink>
    </Container></section>
    <section className="section service-directory-section" aria-labelledby="directory-heading"><Container>
      <p className="eyebrow">{intro.directoryEyebrow}</p><h2 id="directory-heading">{intro.directoryHeading}</h2>
      <ServiceDirectory detailsLabel={intro.detailsLabel} labels={dictionary.services} locale={locale} />
    </Container></section>
    <section className="section project-section" id="projects" aria-labelledby="services-projects-heading"><Container>
      <p className="eyebrow">{intro.projectsEyebrow}</p><h2 id="services-projects-heading">{intro.projectsHeading}</h2><p className="section-heading__body">{intro.projectsBody}</p>
      <ProjectGallery gallery={gallery} emptyMessage={dictionary.system.noRelatedProjects} unavailableMessage={dictionary.system.galleryUnavailable} previousLabel={dictionary.home.featuredProjects.previous} nextLabel={dictionary.home.featuredProjects.next} filtersLabel={dictionary.home.featuredProjects.filtersLabel} allServicesLabel={dictionary.home.featuredProjects.allServices} serviceLabels={serviceLabels} />
    </Container></section>
    <ContactBoundary contact={dictionary.contact} locale={locale} />
  </main>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/service", messages[locale].servicesIndex.metadata);
}

export default async function ServiceIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ServicesPage locale={locale} gallery={await getAllProjects(locale)} />;
}
