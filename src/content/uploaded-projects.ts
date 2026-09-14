import type { Locale } from "@/i18n/routing";
import type { ProjectGallery, ProjectGalleryResult } from "@/sanity/lib/fetch-projects";

const images = [
  { file: "01", width: 532, height: 1152, en: "Gearbox lifting and positioning", id: "Pengangkatan dan penempatan gearbox" },
  { file: "02", width: 532, height: 1152, en: "Marine propulsion installation", id: "Instalasi sistem propulsi maritim" },
  { file: "03", width: 1280, height: 1280, en: "Lifting a fabricated equipment module", id: "Pengangkatan modul peralatan fabrikasi" },
  { file: "04", width: 1600, height: 1200, en: "Machinery assembly and alignment", id: "Perakitan dan penyelarasan mesin" },
  { file: "05", width: 1200, height: 1599, en: "Large rotating equipment assembly", id: "Perakitan peralatan berputar berukuran besar" },
  { file: "06", width: 780, height: 1040, en: "Heavy component lifting operation", id: "Operasi pengangkatan komponen berat" },
  { file: "07", width: 1200, height: 1599, en: "Winch assembly installation", id: "Instalasi rakitan winch" },
  { file: "08", width: 1600, height: 1200, en: "On-site flange machining", id: "Machining flange di lokasi" },
  { file: "09", width: 1920, height: 1440, en: "Dimensional inspection after machining", id: "Inspeksi dimensi setelah machining" },
] as const;

function uploadedProject(locale: Locale): ProjectGallery {
  const isIndonesian = locale === "id";

  return {
    id: "heavy-equipment-installation-2025",
    title: isIndonesian ? "Proyek Instalasi Peralatan Berat" : "Heavy Equipment Installation Project",
    serviceCategory: "machinery-equipment-installation",
    location: "Batam, Indonesia",
    completionYear: 2025,
    displayOrder: 0,
    featured: true,
    images: images.map((image) => {
      const caption = isIndonesian ? image.id : image.en;
      return {
        key: `heavy-equipment-${image.file}`,
        alt: `${isIndonesian ? "Proyek PT SUGEE" : "PT SUGEE project"}: ${caption}`,
        caption,
        asset: {
          id: `uploaded-heavy-equipment-${image.file}`,
          url: `/images/projects/heavy-equipment-installation-${image.file}.jpeg`,
          width: image.width,
          height: image.height,
          aspectRatio: image.width / image.height,
        },
      };
    }),
  };
}

export function withUploadedProject(gallery: ProjectGalleryResult, locale: Locale): ProjectGalleryResult {
  const project = uploadedProject(locale);
  const projects = gallery.status === "ready"
    ? gallery.projects.filter((item) => item.id !== project.id)
    : [];

  return { status: "ready", projects: [project, ...projects] };
}
