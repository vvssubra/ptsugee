import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type AnchorHTMLAttributes } from "react";
import { vi } from "vitest";
import { SiteHeader } from "@/components/site-header";

const pathname = vi.hoisted(() => ({ value: "/about" }));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, locale, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; locale?: string }) => {
    const localizedHref = locale === "id"
      ? href === "/" ? "/id" : href.startsWith("/#") ? `/id${href.slice(1)}` : `/id${href}`
      : href;
    return createElement("a", { ...props, href: localizedHref });
  },
  usePathname: () => pathname.value,
}));

const labels = {
  home: "Home",
  about: "About",
  services: "Services",
  projects: "Projects",
  contact: "Contact",
  language: "English / Bahasa Indonesia",
  whatsapp: "Contact Us on WhatsApp",
  whatsappShort: "Contact Us",
  menu: "Menu",
  closeMenu: "Close menu",
  primaryNavigation: "Primary",
  serviceItems: [
    { href: "/machinery-equipment-installation", label: "Machinery installation" },
    { href: "/machinery-equipment-overhauling", label: "Machinery overhaul" },
    { href: "/epocast", label: "EPOCAST 36" },
    { href: "/laser-alignment-service", label: "Laser alignment" },
    { href: "/in-situ-machining", label: "In-situ machining" },
    { href: "/flange-management", label: "Flange management" },
  ],
};

describe("SiteHeader", () => {
  it("exposes the primary navigation and both languages", () => {
    render(<SiteHeader locale="en" labels={labels} />);

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/service");
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute("href", "/gallery");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Bahasa Indonesia" })).toBeInTheDocument();
  });

  it("opens from the menu button and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader locale="en" labels={labels} />);

    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("keeps the locale control available while the mobile menu is closed", () => {
    render(<SiteHeader locale="en" labels={labels} />);

    const button = screen.getByRole("button", { name: "Menu" });
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    const localeControl = screen.getByRole("group", {
      name: "English / Bahasa Indonesia",
    });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", navigation.id);
    expect(navigation).not.toContainElement(localeControl);
    expect(screen.getByRole("link", { name: "Bahasa Indonesia" })).toHaveAttribute(
      "href",
      "/id/about",
    );
  });

  it("preserves the current pathname in both locale links", () => {
    pathname.value = "/laser-alignment-service";
    render(<SiteHeader locale="en" labels={labels} />);

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/laser-alignment-service",
    );
    expect(screen.getByRole("link", { name: "Bahasa Indonesia" })).toHaveAttribute(
      "href",
      "/id/laser-alignment-service",
    );
  });
});
