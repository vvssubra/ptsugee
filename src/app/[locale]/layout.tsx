import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Instrument_Sans, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { routing } from "@/i18n/routing";

const instrumentSans = Instrument_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"],
});

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, navigation, footer] = await Promise.all([
    getMessages(),
    getTranslations("navigation"),
    getTranslations("footer"),
  ]);

  const navigationLabels = {
    home: navigation("home"),
    about: navigation("about"),
    services: navigation("services"),
    projects: navigation("projects"),
    contact: navigation("contact"),
    language: navigation("language"),
    whatsapp: navigation("whatsapp"),
    menu: navigation("menu"),
    closeMenu: navigation("closeMenu"),
    primaryNavigation: navigation("primaryNavigation"),
  };

  const footerLabels = {
    contact: footer("contact"),
    singapore: footer("singapore"),
    indonesia: footer("indonesia"),
    established: footer("established"),
    rights: footer("rights"),
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={`${instrumentSans.variable} ${inter.variable} site-shell`} lang={locale}>
        <SiteHeader labels={navigationLabels} locale={locale} />
        {children}
        <SiteFooter labels={footerLabels} locale={locale} navigation={navigationLabels} />
        <WhatsAppButton label={navigationLabels.whatsapp} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
