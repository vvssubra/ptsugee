import Image from "next/image";
import { clientLogoAssets } from "@/content/assets";
import { Container } from "@/components/ui/container";
export function ClientLogoStrip({ altLabels, heading, body }: { altLabels: Record<string, string>; heading: string; body: string }) {
  return <section className="section clients-section" aria-labelledby="clients-heading"><Container><div className="clients-heading"><h2 id="clients-heading">{heading}</h2><p>{body}</p></div><div className="client-logo-grid">{Object.entries(clientLogoAssets).map(([name, asset]) => <div className="client-logo" key={name}><Image src={asset.src} width={asset.width} height={asset.height} alt={altLabels[asset.altKey.replace("images.", "")] ?? ""} sizes="160px" /></div>)}</div></Container></section>;
}
