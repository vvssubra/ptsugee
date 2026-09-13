import type { Locale } from "@/i18n/routing";

const WHATSAPP_NUMBER = "6591004649";

const messages: Record<Locale, string> = {
  en: "Hello PT SUGEE, I would like to discuss an engineering requirement.",
  id: "Halo PT SUGEE, saya ingin mendiskusikan kebutuhan engineering.",
};

export function buildWhatsAppUrl(locale: Locale): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messages[locale])}`;
}
