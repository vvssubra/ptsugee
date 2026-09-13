import { render, screen } from "@testing-library/react";
import { AboutPage } from "@/app/[locale]/about/page";
import ServiceIndex, { ServicesPage } from "@/app/[locale]/service/page";
import { serviceSlugs } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const emptyGallery: ProjectGalleryResult = { status: "empty", projects: [] };

vi.mock("@/sanity/lib/fetch-projects", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/sanity/lib/fetch-projects")>();
  return {
    ...original,
    getFeaturedProjects: vi.fn().mockResolvedValue({ status: "empty", projects: [] }),
    getProjectsByService: vi.fn().mockImplementation(async (slug: string) => slug === "laser-alignment-service" ? {
      status: "ready",
      projects: [{
        id: "alignment-project",
        title: "Alignment project from complete directory",
        serviceCategory: "laser-alignment-service",
        location: "Batam",
        displayOrder: 1,
        featured: false,
        images: [{ key: "image", alt: "Alignment measurement", asset: { id: "asset", url: "https://cdn.sanity.io/images/demo/production/alignment.jpg", width: 1200, height: 800, aspectRatio: 1.5 } }],
      }],
    } : { status: "empty", projects: [] }),
  };
});

describe("public company and service-directory routes", () => {
  it.each([
    ["en", "A Legacy of Quality and Innovation", "/about"],
    ["id", "Pengalaman yang Dibangun melalui Mutu dan Inovasi", "/id/about"],
  ] as const)("renders the %s About route with one localized H1", (locale, heading, path) => {
    render(<AboutPage locale={locale} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(path).toMatch(locale === "en" ? /^\/about$/ : /^\/id\/about$/);
    expect(screen.getAllByTestId("about-capability-link").map((link) => link.getAttribute("href"))).toEqual(
      serviceSlugs.map((slug) => `${locale === "en" ? "" : "/id"}/${slug}`),
    );
  });

  it.each([
    ["en", "Engineering Excellence Without Compromise", ""],
    ["id", "Keunggulan Engineering Tanpa Kompromi", "/id"],
  ] as const)("renders the %s Services route with six valid destinations", (locale, heading, prefix) => {
    render(<ServicesPage locale={locale} gallery={emptyGallery} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    const links = screen.getAllByTestId("service-directory-link");
    expect(links).toHaveLength(6);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      serviceSlugs.map((slug) => `${prefix}/${slug}`),
    );
  });

  it("loads non-featured projects across all categories for the Services directory", async () => {
    render(await ServiceIndex({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.getByRole("heading", { level: 3, name: "Alignment project from complete directory" })).toBeInTheDocument();
  });
});
