import type { Locale } from "@/i18n/routing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  locale: Locale;
  label: string;
  accessibleLabel: string;
};

export function WhatsAppButton({ locale, label, accessibleLabel }: WhatsAppButtonProps) {
  return (
    <a
      aria-label={accessibleLabel}
      className="whatsapp-button"
      href={buildWhatsAppUrl(locale)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span aria-hidden="true" className="whatsapp-button__icon">
        ↗
      </span>
      <span className="whatsapp-button__label">{label}</span>
    </a>
  );
}
