import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
export function ProofPoints({ eyebrow, heading, points }: { eyebrow: string; heading: string; points: readonly string[] }) {
  return <section className="section proof-section" aria-labelledby="proof-heading"><Container><SectionHeading headingId="proof-heading" eyebrow={eyebrow} heading={heading} /><ol className="proof-grid">{points.map((point, index) => <li data-testid="proof-point" key={point}><span aria-hidden="true">0{index + 1}</span><p>{point}</p></li>)}</ol></Container></section>;
}
