"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/locale-switcher";

export type NavigationLabels = {
  home: string;
  about: string;
  services: string;
  projects: string;
  contact: string;
  language: string;
  whatsapp: string;
  menu: string;
  closeMenu: string;
  primaryNavigation: string;
};

type MobileMenuProps = {
  locale: Locale;
  labels: NavigationLabels;
};

export function MobileMenu({ locale, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const navItems = [
    [labels.home, "/"],
    [labels.about, "/about"],
    [labels.services, "/service"],
    [labels.projects, "/#projects"],
    [labels.contact, "/#contact"],
  ] as const;

  return (
    <div className="mobile-menu">
      <div className="mobile-menu__controls">
        <LocaleSwitcher label={labels.language} locale={locale} />
        <button
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={open ? labels.closeMenu : labels.menu}
          className="mobile-menu__toggle"
          onClick={() => setOpen((current) => !current)}
          ref={buttonRef}
          type="button"
        >
          <span aria-hidden="true" className="mobile-menu__icon" />
        </button>
      </div>
      <nav
        aria-label={labels.primaryNavigation}
        className="site-navigation"
        data-open={open || undefined}
        id="site-navigation"
        ref={navigationRef}
      >
        <ul className="site-navigation__links">
          {navItems.map(([label, href]) => (
            <li key={label}>
              <Link href={href} locale={locale === "id" ? "id" : undefined} onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
