import enMessages from "../../../messages/en.json";
import idMessages from "../../../messages/id.json";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { ClientLogoStrip } from "@/components/client-logo-strip";
import { FaqAccordion } from "@/components/faq-accordion";
import { Hero } from "@/components/hero";
import { LocationSection } from "@/components/location-section";
import { MotionReveal } from "@/components/motion-reveal";
import { ProjectGallery } from "@/components/project-gallery";
import { ProofPoints } from "@/components/proof-points";
import { QualitySection } from "@/components/quality-section";
import { ServiceGrid } from "@/components/service-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { routing, type Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { withUploadedProject } from "@/content/uploaded-projects";
import { getFeaturedProjects, type ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const messages = { en: enMessages, id: idMessages } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/", messages[locale].home.metadata);
}

export function HomePage({ locale, gallery }: { locale: Locale; gallery: ProjectGalleryResult }) {
  const dictionary = messages[locale];
  const home = dictionary.home;
  const featuredGallery = withUploadedProject(gallery, locale);

  return (
    <main>
      <Hero alt={dictionary.images.homeHero} body={home.hero.body} eyebrow={home.hero.eyebrow} heading={home.hero.heading} primaryCta={home.hero.primaryCta} secondaryCta={home.hero.secondaryCta} serviceHref="/service" />
      <MotionReveal>
        <section className="section capabilities-section" aria-labelledby="capabilities-heading">
          <Container><div className="capabilities-layout"><div>
            <SectionHeading headingId="capabilities-heading" eyebrow={home.capabilities.eyebrow} heading={home.capabilities.heading} body={home.capabilities.body} />
            <ButtonLink className="capabilities-cta" href="/service">{home.capabilities.cta}</ButtonLink>
          </div><ServiceGrid locale={locale} services={dictionary.services} /></div></Container>
        </section>
      </MotionReveal>
      <MotionReveal>
        <section className="section project-section" id="projects" aria-labelledby="projects-heading">
          <Container><SectionHeading headingId="projects-heading" eyebrow={home.featuredProjects.eyebrow} heading={home.featuredProjects.heading} body={home.featuredProjects.body} />
            <ProjectGallery
              gallery={featuredGallery}
              emptyMessage={home.featuredProjects.empty}
              unavailableMessage={dictionary.system.galleryUnavailable}
              previousLabel={home.featuredProjects.previous}
              nextLabel={home.featuredProjects.next}
              pauseLabel={home.featuredProjects.pause}
              playLabel={home.featuredProjects.play}
              slideshowLabel={home.featuredProjects.slideshowLabel}
              filtersLabel={home.featuredProjects.filtersLabel}
              allServicesLabel={home.featuredProjects.allServices}
              serviceLabels={{
                "machinery-equipment-installation": dictionary.services["machinery-equipment-installation"].title,
                "machinery-equipment-overhauling": dictionary.services["machinery-equipment-overhauling"].title,
                epocast: dictionary.services.epocast.title,
                "laser-alignment-service": dictionary.services["laser-alignment-service"].title,
                "in-situ-machining": dictionary.services["in-situ-machining"].title,
                "flange-management": dictionary.services["flange-management"].title,
              }}
            />
          </Container>
        </section>
      </MotionReveal>
      <MotionReveal><ProofPoints eyebrow={home.why.eyebrow} heading={home.why.heading} points={[home.why.experience, home.why.regional, home.why.capability, home.why.priority]} /></MotionReveal>
      <MotionReveal><QualitySection alt={dictionary.images.qualityTeam} body={home.quality.body} eyebrow={home.quality.eyebrow} heading={home.quality.heading} points={home.quality.points} /></MotionReveal>
      <MotionReveal><ClientLogoStrip altLabels={dictionary.images} body={home.clients.body} heading={home.clients.heading} marqueeLabel={home.clients.marqueeLabel} /></MotionReveal>
      <MotionReveal>
        <section className="section faq-section" aria-labelledby="faq-heading"><Container className="faq-layout">
          <div><p className="eyebrow">{home.faqIntro.eyebrow}</p><h2 id="faq-heading">{home.faqIntro.heading}</h2><p className="faq-intro__body">{home.faqIntro.body}</p><a className="text-link" href="#contact">{dictionary.navigation.contact}</a></div>
          <FaqAccordion items={home.faq} />
        </Container></section>
      </MotionReveal>
      <section className="section contact-boundary" id="contact" aria-labelledby="contact-heading"><Container className="contact-boundary__inner">
        <div><p className="eyebrow">{dictionary.contact.eyebrow}</p><h2 id="contact-heading">{dictionary.contact.heading}</h2><p>{dictionary.contact.body}</p></div>
        <ButtonLink aria-label={dictionary.contact.whatsappCtaLabel} href={buildWhatsAppUrl(locale)} target="_blank">{dictionary.contact.whatsappCta}</ButtonLink>
      </Container></section>
      <LocationSection copy={dictionary.locations} />
    </main>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <HomePage locale={locale} gallery={await getFeaturedProjects(locale)} />;
}
