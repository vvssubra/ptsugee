import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { NavigationLabels } from "@/components/mobile-menu";
import { Container } from "@/components/ui/container";

type FooterLabels = {
  contact: string;
  singapore: string;
  indonesia: string;
  established: string;
  rights: string;
};

type SiteFooterProps = {
  locale: Locale;
  navigation: NavigationLabels;
  labels: FooterLabels;
};

function prefix(locale: Locale, href: string) {
  if (locale === "en") return href;
  if (href === "/") return "/id";
  if (href.startsWith("/#")) return `/id${href.slice(1)}`;
  return `/id${href}`;
}

export function SiteFooter({ locale, navigation, labels }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const [contactName, phone, email] = labels.contact.split(", ");

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__grid">
          <div>
            <p className="wordmark wordmark--footer"><span>PT</span> SUGEE</p>
            <p>{labels.established}</p>
          </div>
          <address className="site-footer__address">
            <p>
              {contactName},{" "}
              <a href="tel:+6591004649">{phone}</a>,{" "}
              <a href="mailto:sathish@ptsugee.com">{email}</a>
            </p>
            <a href="https://www.google.com/maps/search/?api=1&query=164+Tuas+South+Ave+2+West+Point+Biz+Hub+Singapore">
              {labels.singapore}
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=K-15+Tunas+Regency+Tanjung+Uncang+Batam+Indonesia">
              {labels.indonesia}
            </a>
          </address>
          <nav aria-label={navigation.primaryNavigation} className="site-footer__navigation">
            <Link href={prefix(locale, "/")}>{navigation.home}</Link>
            <Link href={prefix(locale, "/about")}>{navigation.about}</Link>
            <Link href={prefix(locale, "/service")}>{navigation.services}</Link>
            <Link href={prefix(locale, "/#projects")}>{navigation.projects}</Link>
            <Link href={prefix(locale, "/#contact")}>{navigation.contact}</Link>
          </nav>
        </div>
        <p className="site-footer__legal">© {year} PT SUGEE. {labels.rights}</p>
      </Container>
    </footer>
  );
}
