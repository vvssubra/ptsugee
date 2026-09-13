import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home, { HomePage } from "@/app/[locale]/page";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

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
    expect(screen.getByText("New project photographs will be added soon. Contact us to discuss relevant experience for your application.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discuss Your Project" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Chat with Sathish Kumar" })).toHaveAttribute("href", expect.stringContaining("wa.me/6591004649"));

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
    expect(screen.getByText("Gambar proyek untuk sementara belum tersedia. Hubungi kami untuk membahas pengalaman yang relevan.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Diskusikan Proyek Anda" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Hubungi Sathish Kumar" })).toHaveAttribute("href", expect.stringContaining("wa.me/6591004649"));
  });

  it("renders published Sanity project media with its project details", () => {
    render(<HomePage locale="en" gallery={readyGallery} />);

    expect(screen.getByRole("heading", { level: 3, name: "Propeller shaft alignment" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Laser alignment equipment measuring a propeller shaft" })).toBeInTheDocument();
    expect(screen.getByText("Batam, Indonesia · 2025")).toBeInTheDocument();
  });
});
