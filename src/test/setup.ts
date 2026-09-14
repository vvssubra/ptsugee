import "@testing-library/jest-dom/vitest";
import { createElement, type AnchorHTMLAttributes } from "react";

function localizedHref(href: string, locale?: string) {
  if (locale !== "id") return href;
  if (href === "/") return "/id";
  return href.startsWith("/#") ? `/id${href.slice(1)}` : `/id${href}`;
}

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, locale, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; locale?: string }) =>
    createElement("a", { ...props, href: localizedHref(href, locale) }),
  usePathname: () => "/",
}));

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}

vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
