"use client";

import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type LocaleSwitcherProps = {
  locale: Locale;
  label: string;
};

function rememberLocale(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`;
}

function localeHref(pathname: string, locale: Locale) {
  if (locale === "en") return pathname;
  return pathname === "/" ? "/id" : `/id${pathname}`;
}

export function LocaleSwitcher({ locale, label }: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <div aria-label={label} className="locale-switcher" role="group">
      <a
        aria-current={locale === "en" ? "page" : undefined}
        href={localeHref(pathname, "en")}
        hrefLang="en"
        lang="en"
        onClick={() => rememberLocale("en")}
      >
        English
      </a>
      <span aria-hidden="true">/</span>
      <a
        aria-current={locale === "id" ? "page" : undefined}
        href={localeHref(pathname, "id")}
        hrefLang="id"
        lang="id"
        onClick={() => rememberLocale("id")}
      >
        Bahasa Indonesia
      </a>
    </div>
  );
}
