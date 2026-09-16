import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { NavigationLabels } from "@/components/mobile-menu";
import { Container } from "@/components/ui/container";

type FooterLabels = {
  contact: string;
  singapore: string;
  indonesia: string;
  established: string;
  rights: string;
  contactHeading: string;
  officesHeading: string;
  navigateHeading: string;
  backToTop: string;
};

type SiteFooterProps = {
  locale: Locale;
  navigation: NavigationLabels;
  labels: FooterLabels;
};

const SINGAPORE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=164+Tuas+South+Ave+2+West+Point+Biz+Hub+Singapore";
const BATAM_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=K-15+Tunas+Regency+Tanjung+Uncang+Batam+Indonesia";

export function SiteFooter({ locale, navigation, labels }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const [contactName, phone, email] = labels.contact.split(", ");
  const localeProp = locale === "id" ? "id" : undefined;

  const navigationLinks = [
    { href: "/", label: navigation.home },
    { href: "/about", label: navigation.about },
    { href: "/service", label: navigation.services },
    { href: "/gallery", label: locale === "id" ? "Galeri" : "Gallery" },
    { href: "/#contact", label: navigation.contact },
  ] as const;

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__masthead">
          <div>
            <p className="wordmark wordmark--footer">
              <span>PT</span> SUGEE
            </p>
            <p className="site-footer__established">{labels.established}</p>
          </div>
          <Link
            className="button-link button-link--primary"
            href="/#contact"
            locale={localeProp}
          >
            {navigation.contact}
          </Link>
        </div>

        <div className="site-footer__grid">
          <section className="site-footer__column">
            <h2 className="site-footer__heading">{labels.contactHeading}</h2>
            <address className="site-footer__address">
              <p className="site-footer__name">{contactName}</p>
              <a className="site-footer__link" href="tel:+6591004649">
                {phone}
              </a>
              <a className="site-footer__link" href="mailto:sathish@ptsugee.com">
                {email}
              </a>
            </address>
          </section>

          <section className="site-footer__column">
            <h2 className="site-footer__heading">{labels.officesHeading}</h2>
            <address className="site-footer__address">
              <a className="site-footer__office" href={SINGAPORE_MAP_URL}>
                {labels.singapore}
                <span aria-hidden="true">↗</span>
              </a>
              <a className="site-footer__office" href={BATAM_MAP_URL}>
                {labels.indonesia}
                <span aria-hidden="true">↗</span>
              </a>
            </address>
          </section>

          <nav aria-label={navigation.primaryNavigation} className="site-footer__column">
            <h2 className="site-footer__heading">{labels.navigateHeading}</h2>
            <div className="site-footer__navigation">
              {navigationLinks.map((link) => (
                <Link
                  className="site-footer__link"
                  href={link.href}
                  key={link.href}
                  locale={localeProp}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <svg
          aria-hidden="true"
          className="site-footer__monogram"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 1000 190"
        >
          {/* Two passes of the same glyphs: a static outline, then a dashed
              copy whose offset animates so a light appears to sketch the edge. */}
          <text
            className="site-footer__monogram-base"
            lengthAdjust="spacingAndGlyphs"
            textLength="960"
            x="500"
            y="145"
          >
            PT SUGEE
          </text>
          <text
            className="site-footer__monogram-trail"
            lengthAdjust="spacingAndGlyphs"
            textLength="960"
            x="500"
            y="145"
          >
            PT SUGEE
          </text>
        </svg>

        <div className="site-footer__legal">
          <p>
            © {year} PT SUGEE. {labels.rights}
          </p>
          <a className="site-footer__top" href="#top">
            {labels.backToTop}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
