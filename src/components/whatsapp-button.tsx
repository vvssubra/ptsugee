import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  locale: Locale;
  label: string;
};

export function WhatsAppButton({ locale, label }: WhatsAppButtonProps) {
  return (
    <a
      className="whatsapp-button"
      href={buildWhatsAppUrl(locale)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span aria-hidden="true">↗</span>
      <span>{label}</span>
    </a>
  );
}
