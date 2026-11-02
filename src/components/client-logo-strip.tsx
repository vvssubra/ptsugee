import Image from "next/image";
import type { SiteImage } from "@/content/site-images";
import { Container } from "@/components/ui/container";

export function ClientLogoStrip({ logos, heading, body, marqueeLabel }: { logos: SiteImage[]; heading: string; body: string; marqueeLabel: string }) {

  return (
    <section className="section clients-section" aria-labelledby="clients-heading">
      <Container>
        <div className="clients-heading">
          <h2 id="clients-heading">{heading}</h2>
          <p>{body}</p>
        </div>
        <div className="client-logo-window" role="region" aria-label={marqueeLabel} tabIndex={0}>
          <div className="client-logo-track">
            <ul className="client-logo-group" aria-label={heading}>
              {logos.map((logo) => (
                <li className="client-logo" key={logo.src}>
                  <Image src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} sizes="220px" loading="eager" />
                </li>
              ))}
            </ul>
            <ul className="client-logo-group" aria-hidden="true">
              {logos.map((logo) => (
                <li className="client-logo" key={logo.src}>
                  <Image src={logo.src} width={logo.width} height={logo.height} alt="" sizes="220px" loading="eager" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
