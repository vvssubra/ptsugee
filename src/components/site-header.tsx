import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { MobileMenu, type NavigationLabels } from "@/components/mobile-menu";

type SiteHeaderProps = {
  locale: Locale;
  labels: NavigationLabels;
};

export function SiteHeader({ locale, labels }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="wordmark" href={locale === "en" ? "/" : "/id"}>
          <span>PT</span> SUGEE
        </Link>
        <MobileMenu labels={labels} locale={locale} />
      </Container>
    </header>
  );
}
