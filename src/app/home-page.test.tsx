import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/[locale]/page";
import { HomePage } from "@/app/[locale]/home-view";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

vi.mock("@/components/location-map", () => ({
  LocationMap: ({ copy }: { copy: { mapLabel: string } }) => <div role="region" aria-label={copy.mapLabel} />,
}));

const emptyGallery: ProjectGalleryResult = { status: "empty", projects: [] };
const unavailableGallery: ProjectGalleryResult = { status: "unavailable", projects: [] };
const readyGallery: ProjectGalleryResult = {
  status: "ready",
  projects: [
    {
      id: "propeller-alignment",
      title: "Propeller shaft alignment",
      serviceCategory: "laser-alignment-service",
      location: "Batam, Indonesia",
      completionYear: 2025,
      displayOrder: 1,
      featured: true,
      images: [
        {
          key: "alignment-image",
          alt: "Laser alignment equipment measuring a propeller shaft",
          caption: "Final alignment measurement",
          asset: {
            id: "image-1",
            url: "https://cdn.sanity.io/images/demo/production/alignment.jpg",
            width: 1200,
            height: 800,
            aspectRatio: 1.5,
          },
        },
      ],
    },
    {
      id: "line-boring",
      title: "On-site line boring",
      serviceCategory: "in-situ-machining",
      location: "Singapore",
      displayOrder: 2,
      featured: true,
      images: [
        {
          key: "machining-image",
          alt: "Portable line boring equipment in operation",
          asset: {
            id: "image-2",
            url: "https://cdn.sanity.io/images/demo/production/machining.jpg",
            width: 1000,
            height: 1000,
            aspectRatio: 1,
          },
        },
      ],
    },
  ],
};

describe("HomePage", () => {
  it("rejects non-locale path segments before reading a message dictionary", async () => {
    await expect(Home({ params: Promise.resolve({ locale: "favicon.ico" }) })).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
  });

  it("renders the complete English home page and the approved empty project state", async () => {
    const user = userEvent.setup();
    render(<HomePage locale="en" gallery={emptyGallery} />);

    expect(screen.getByRole("heading", { level: 1, name: "Leading Engineering & Marine Solutions Across Indonesia and Singapore" })).toBeInTheDocument();
    expect(screen.getAllByTestId("service-link")).toHaveLength(6);
    expect(screen.getAllByTestId("proof-point")).toHaveLength(4);
    expect(screen.getByText("Quality Practices Built on Control and Continuous Improvement")).toBeInTheDocument();
    expect(screen.queryByText(/ISO certified/i)).not.toBeInTheDocument();
    expect(screen.getByText("Selected Companies We Have Supported")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^(What|Where|How|Can)/ })).toHaveLength(6);
    expect(screen.queryByText("New project photographs will be added soon. Contact us to discuss relevant experience for your application.")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /^PT SUGEE project:/ })).toHaveLength(9);
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Contact Us on WhatsApp" })).toHaveAttribute("href", expect.stringContaining("wa.me/6591004649"));
    expect(screen.getByRole("heading", { level: 2, name: "Our Locations" })).toBeInTheDocument();
    expect(screen.getByText("Approximate location")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Office map" })).toBeInTheDocument();

    const contact = document.querySelector("#contact");
    const locations = document.querySelector("#locations");
    expect(contact).not.toBeNull();
    expect(locations).not.toBeNull();
    expect(contact!.compareDocumentPosition(locations!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const faq = screen.getByRole("button", { name: "Where does PT SUGEE operate?" });
    expect(faq).toHaveAttribute("aria-expanded", "false");
    await user.click(faq);
    expect(faq).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Our work is coordinated across Indonesia and Singapore for local and overseas projects.")).toBeVisible();
  });

  it("renders the complete Indonesian home page and unavailable project state", () => {
    render(<HomePage locale="id" gallery={unavailableGallery} />);

    expect(screen.getByRole("heading", { level: 1, name: "Solusi Engineering dan Maritim Terdepan di Indonesia dan Singapura" })).toBeInTheDocument();
    expect(screen.getAllByTestId("service-link")).toHaveLength(6);
    expect(screen.getAllByTestId("proof-point")).toHaveLength(4);
    expect(screen.queryByText("Gambar proyek untuk sementara belum tersedia. Hubungi kami untuk membahas pengalaman yang relevan.")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /^Proyek PT SUGEE:/ })).toHaveLength(9);
    expect(screen.getByRole("link", { name: "Hubungi Kami" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Hubungi Kami via WhatsApp" })).toHaveAttribute("href", expect.stringContaining("wa.me/6591004649"));
    expect(screen.getByRole("heading", { level: 2, name: "Lokasi Kami" })).toBeInTheDocument();
    expect(screen.getByText("Lokasi perkiraan")).toBeInTheDocument();
  });

  it("renders published Sanity project media with its project details", () => {
    render(<HomePage locale="en" gallery={readyGallery} />);

    expect(screen.getByRole("heading", { level: 3, name: "Propeller shaft alignment" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Laser alignment equipment measuring a propeller shaft" })).toBeInTheDocument();
    expect(screen.getAllByText("Batam, Indonesia · 2025")).toHaveLength(10);
    expect(screen.getByRole("img", { name: "Laser alignment equipment measuring a propeller shaft" })).not.toHaveAttribute("src", expect.stringContaining("https://cdn.sanity.io"));
  });

  it("filters ready projects by the localized service category", async () => {
    const user = userEvent.setup();
    render(<HomePage locale="id" gallery={readyGallery} />);

    const filters = screen.getByRole("group", { name: "Filter proyek berdasarkan layanan" });
    expect(within(filters).getByRole("button", { name: "Semua layanan" })).toHaveAttribute("aria-pressed", "true");

    await user.click(within(filters).getByRole("button", { name: "Layanan Laser Alignment" }));
    expect(screen.getByRole("heading", { level: 3, name: "Propeller shaft alignment" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "On-site line boring" })).not.toBeInTheDocument();
  });

  it("uses instant gallery navigation when reduced motion is requested", async () => {
    const user = userEvent.setup();
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) });
    render(<HomePage locale="en" gallery={readyGallery} />);
    const track = document.querySelector<HTMLElement>(".project-gallery__track");
    const scrollBy = vi.fn();
    Object.defineProperty(track, "clientWidth", { configurable: true, value: 1000 });
    Object.defineProperty(track, "scrollBy", { configurable: true, value: scrollBy });

    await user.click(screen.getByRole("button", { name: "Next projects" }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 720, behavior: "auto" });
    Object.defineProperty(window, "matchMedia", { configurable: true, value: originalMatchMedia });
  });

  it("renders client logos once in a semantic list", () => {
    render(<HomePage locale="en" gallery={emptyGallery} />);
    const logos = screen.getByRole("list", { name: "Selected Companies We Have Supported" });
    expect(within(logos).getAllByRole("img")).toHaveLength(8);
  });
});
