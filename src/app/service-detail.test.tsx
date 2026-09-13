import { render, screen } from "@testing-library/react";
import ServicePage, {
  ServiceDetailPage,
  generateMetadata,
  generateStaticParams,
} from "@/app/[locale]/[serviceSlug]/page";
import { serviceSlugs } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const emptyGallery: ProjectGalleryResult = { status: "empty", projects: [] };

describe("service detail routes", () => {
  it("pre-renders the six service slugs for both locales", () => {
    expect(generateStaticParams()).toEqual(
      ["en", "id"].flatMap((locale) => serviceSlugs.map((serviceSlug) => ({ locale, serviceSlug }))),
    );
  });

  it.each([
    ["en", "machinery-equipment-installation", "Precision Installation for Reliable First Start-Up"],
    ["id", "laser-alignment-service", "Alignment Berbasis Pengukuran untuk Rotating Equipment"],
  ] as const)("renders one localized H1 and the complete detail sequence for %s/%s", (locale, slug, heading) => {
    render(<ServiceDetailPage locale={locale} serviceSlug={slug} gallery={emptyGallery} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByTestId("service-detail-sequence").children).toHaveLength(7);
    expect(screen.getByTestId("service-gallery")).toHaveTextContent(
      locale === "en"
        ? "No published projects are available in this category yet."
        : "Belum ada proyek yang dipublikasikan dalam kategori ini.",
    );
  });

  it("formats factual machining ranges for the active locale", () => {
    render(<ServiceDetailPage locale="id" serviceSlug="in-situ-machining" gallery={emptyGallery} />);

    expect(screen.getByText("Line boring dari 4 hingga 40 inci menggunakan peralatan seri BB")).toBeInTheDocument();
    expect(screen.getByText("Milling hingga panjang 6.000 mm")).toBeInTheDocument();
  });

  it("keeps the technical scope populated when a service has no separate equipment list", () => {
    render(<ServiceDetailPage locale="en" serviceSlug="flange-management" gallery={emptyGallery} />);

    expect(screen.getByText("Controlled bolting, torqueing, surface checks, joint identification, and documented flange integrity support.")).toBeInTheDocument();
  });

  it("builds localized service metadata", async () => {
    await expect(generateMetadata({ params: Promise.resolve({ locale: "id", serviceSlug: "epocast" }) })).resolves.toMatchObject({
      title: "Chocking dan Grouting EPOCAST 36 | PT SUGEE",
      description: expect.stringContaining("fondasi mesin"),
      alternates: {
        canonical: "https://ptsugee.com/id/epocast",
        languages: { en: "https://ptsugee.com/epocast", id: "https://ptsugee.com/id/epocast", "x-default": "https://ptsugee.com/epocast" },
      },
    });
  });

  it("rejects invalid service slugs through the not-found boundary", async () => {
    await expect(ServicePage({ params: Promise.resolve({ locale: "en", serviceSlug: "unknown-service" }) })).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
  });
});
