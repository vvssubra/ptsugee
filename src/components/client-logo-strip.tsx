import Image from "next/image";
import { clientLogoAssets } from "@/content/assets";
import { Container } from "@/components/ui/container";

export function ClientLogoStrip({ altLabels, heading, body, marqueeLabel }: { altLabels: Record<string, string>; heading: string; body: string; marqueeLabel: string }) {
  const logos = Object.entries(clientLogoAssets);

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
              {logos.map(([name, asset]) => (
                <li className="client-logo" key={name}>
                  <Image src={asset.src} width={asset.width} height={asset.height} alt={altLabels[asset.altKey.replace("images.", "")] ?? ""} sizes="220px" />
                </li>
              ))}
            </ul>
            <ul className="client-logo-group" aria-hidden="true">
              {logos.map(([name, asset]) => (
                <li className="client-logo" key={name}>
                  <Image src={asset.src} width={asset.width} height={asset.height} alt="" sizes="220px" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
