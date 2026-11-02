import Image from "next/image";
import type { SiteImage } from "@/content/site-images";
import { Container } from "@/components/ui/container";
type Props = { image: SiteImage; eyebrow: string; heading: string; body: string; points: readonly string[] };
export function QualitySection({ image, eyebrow, heading, body, points }: Props) {
  return <section className="section quality-section" aria-labelledby="quality-heading"><Container className="quality-layout"><div className="quality-copy"><p className="eyebrow">{eyebrow}</p><h2 id="quality-heading">{heading}</h2><p>{body}</p><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul></div><div className="quality-media"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" /></div></Container></section>;
}
