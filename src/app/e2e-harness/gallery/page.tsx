import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProjectGallery } from "@/components/project-gallery";
import type { ServiceSlug } from "@/content/types";
import type { ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const serviceLabels: Record<ServiceSlug, string> = {
  "machinery-equipment-installation": "Machinery Equipment Installation",
  "machinery-equipment-overhauling": "Machinery Equipment Overhauling",
  epocast: "EPOCAST 36",
  "laser-alignment-service": "Laser Alignment Services",
  "in-situ-machining": "In-Situ Machining",
  "flange-management": "Flange Management",
};

const readyGallery: ProjectGalleryResult = {
  status: "ready",
  projects: [
    {
      id: "e2e-installation",
      title: "Installation fixture",
      serviceCategory: "machinery-equipment-installation",
      location: "Batam",
      displayOrder: 1,
      featured: true,
      images: [
        {
          key: "installation-1",
          alt: "Installation test fixture",
          caption: "First fixture image",
          asset: {
            id: "installation-asset",
            url: "/images/projects/machinery-equipment-installation-profile.webp",
            width: 2250,
            height: 560,
            aspectRatio: 2250 / 560,
          },
        },
        {
          key: "installation-2",
          alt: "Second installation test fixture",
          asset: {
            id: "installation-asset-2",
            url: "/images/projects/laser-alignment-profile.webp",
            width: 2250,
            height: 560,
            aspectRatio: 2250 / 560,
          },
        },
      ],
    },
    {
      id: "e2e-laser",
      title: "Laser fixture",
      serviceCategory: "laser-alignment-service",
      location: "Singapore",
      displayOrder: 2,
      featured: true,
      images: [
        {
          key: "laser-1",
          alt: "Laser alignment test fixture",
          asset: {
            id: "laser-asset",
            url: "/images/projects/laser-alignment-profile.webp",
            width: 2250,
            height: 560,
            aspectRatio: 2250 / 560,
          },
        },
      ],
    },
  ],
};

export default async function GalleryHarness({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  await connection();
  if (process.env.PLAYWRIGHT_TEST_MODE !== "1") notFound();
  const { state } = await searchParams;
  const gallery: ProjectGalleryResult = state === "ready"
    ? readyGallery
    : state === "empty"
      ? { status: "empty", projects: [] }
      : { status: "unavailable", projects: [] };

  return (
    <main className="section project-section" data-testid="gallery-harness">
      <h1>Project gallery browser fixture</h1>
      <ProjectGallery
        gallery={gallery}
        emptyMessage="No published project images are available."
        unavailableMessage="Project images are temporarily unavailable."
        previousLabel="Previous projects"
        nextLabel="Next projects"
        filtersLabel="Filter project gallery"
        allServicesLabel="All services"
        serviceLabels={serviceLabels}
      />
    </main>
  );
}
