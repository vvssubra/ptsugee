import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type ContactCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  whatsappCta: string;
  whatsappCtaLabel: string;
};

export function ContactBoundary({ contact, locale }: { contact: ContactCopy; locale: Locale }) {
  return (
    <section className="section contact-boundary" id="contact" aria-labelledby="contact-heading">
      <Container className="contact-boundary__inner">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-heading">{contact.heading}</h2>
          <p>{contact.body}</p>
        </div>
        <ButtonLink aria-label={contact.whatsappCtaLabel} href={buildWhatsAppUrl(locale)} target="_blank">
          {contact.whatsappCta}
        </ButtonLink>
      </Container>
    </section>
  );
}
