import Image from "next/image";
import Link from "next/link";
import { heroAssets } from "@/content/assets";
import { Container } from "@/components/ui/container";
import type { ServiceSlug } from "@/content/types";
import type { Locale } from "@/i18n/routing";

type AboutCopy = {
  intro: { eyebrow: string; heading: string; body: string; industries: string[] };
  story: { eyebrow: string; heading: string; facts: Array<{ title: string; body: string }> };
  vision: { heading: string; body: string };
  mission: { heading: string; body: string };
  prioritiesHeading: string;
  priorities: string[];
  capabilitiesEyebrow: string;
  capabilitiesHeading: string;
};

export function AboutSections({
  alt,
  capabilities,
  capabilityLabel,
  copy,
  locale,
}: {
  alt: string;
  capabilities: Array<{ slug: ServiceSlug; title: string }>;
  capabilityLabel: string;
  copy: AboutCopy;
  locale: Locale;
}) {
  const prefix = locale === "en" ? "" : "/id";
  return (
    <>
      <section className="section about-intro" aria-labelledby="about-heading">
        <Container className="about-intro__layout">
          <div className="about-intro__industries">
            <p className="eyebrow">{copy.intro.eyebrow}</p>
            <ul className="chip-list" aria-label={copy.intro.eyebrow}>
              {copy.intro.industries.map((industry) => <li key={industry}>{industry}</li>)}
            </ul>
          </div>
          <div className="about-intro__copy">
            <h1 id="about-heading">{copy.intro.heading}</h1>
            <p>{copy.intro.body}</p>
            <div className="about-intro__media">
              <Image src={heroAssets.about} alt={alt} sizes="(min-width: 1024px) 54vw, 100vw" priority />
            </div>
          </div>
        </Container>
      </section>

      <section className="section about-story" aria-labelledby="story-heading">
        <Container>
          <p className="eyebrow">{copy.story.eyebrow}</p>
          <h2 id="story-heading">{copy.story.heading}</h2>
          <div className="about-facts">
            {copy.story.facts.map((fact) => <article key={fact.title}><h3>{fact.title}</h3><p>{fact.body}</p></article>)}
          </div>
        </Container>
      </section>

      <section className="section vision-mission" aria-label={`${copy.vision.heading} / ${copy.mission.heading}`}>
        <Container className="vision-mission__grid">
          <article><h2>{copy.vision.heading}</h2><p>{copy.vision.body}</p></article>
          <article><h2>{copy.mission.heading}</h2><p>{copy.mission.body}</p></article>
        </Container>
      </section>

      <section className="section about-priorities" aria-labelledby="priorities-heading">
        <Container>
          <h2 id="priorities-heading">{copy.prioritiesHeading}</h2>
          <ol className="priority-grid">
            {copy.priorities.map((priority, index) => <li key={priority}><span>0{index + 1}</span><p>{priority}</p></li>)}
          </ol>
        </Container>
      </section>

      <section className="section about-capabilities" aria-labelledby="about-capabilities-heading">
        <Container>
          <p className="eyebrow">{copy.capabilitiesEyebrow}</p>
          <h2 id="about-capabilities-heading">{copy.capabilitiesHeading}</h2>
          <div className="about-capabilities__grid">
            <div><h3>{copy.intro.eyebrow}</h3><ul className="editorial-list">
              {copy.intro.industries.map((industry) => <li key={industry}>{industry}</li>)}
            </ul></div>
            <div><h3>{capabilityLabel}</h3><ul className="editorial-list editorial-list--links">
              {capabilities.map(({ slug, title }) => <li key={slug}><Link data-testid="about-capability-link" href={`${prefix}/${slug}`}>{title}<span aria-hidden="true">↗</span></Link></li>)}
            </ul></div>
          </div>
        </Container>
      </section>
    </>
  );
}
