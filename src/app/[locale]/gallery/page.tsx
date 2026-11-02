import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import enMessages from "../../../../messages/en.json";
import idMessages from "../../../../messages/id.json";
import { FieldGallery } from "@/components/field-gallery";
import { ContactBoundary } from "@/components/contact-boundary";
import { Container } from "@/components/ui/container";
import { localFieldImages, type FieldImage } from "@/content/field-images";
import { serviceSlugs } from "@/content/types";
import { withUploadedProject } from "@/content/uploaded-projects";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getProjectsByService } from "@/sanity/lib/fetch-projects";
import { getSiteImages } from "@/sanity/lib/fetch-site-images";

const dictionaries = { en: enMessages, id: idMessages } as const;
const copy = {
  en: { eyebrow: "FIELD EXPERIENCE", heading: "Our work. In the field.", body: "A closer look at the people, equipment and precision behind our marine and industrial engineering work.", all: "All photos", photos: "photos", filters: "Filter photos by service", view: "View photo", close: "Close photo", previous: "Previous photo", next: "Next photo", team: "In the field", metadata: { title: "Field Gallery | PT SUGEE", description: "Explore PT SUGEE field photos of machinery installation, marine repairs, laser alignment, in-situ machining and flange management." } },
  id: { eyebrow: "PENGALAMAN LAPANGAN", heading: "Pekerjaan kami di lapangan.", body: "Lihat lebih dekat tim, peralatan, dan ketelitian di balik pekerjaan teknik maritim dan industri kami.", all: "Semua foto", photos: "foto", filters: "Filter foto berdasarkan layanan", view: "Lihat foto", close: "Tutup foto", previous: "Foto sebelumnya", next: "Foto berikutnya", team: "Di lapangan", metadata: { title: "Galeri Lapangan | PT SUGEE", description: "Jelajahi foto lapangan PT SUGEE: instalasi mesin, perbaikan maritim, laser alignment, in-situ machining, dan flange management." } },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return buildLocalizedMetadata(locale, "/gallery", copy[locale].metadata);
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <GalleryContent locale={locale} />;
}

async function GalleryContent({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];
  const text = copy[locale];
  const categories = Object.fromEntries([...serviceSlugs.map((slug) => [slug, dictionary.services[slug].title]), ["team", text.team]]);
  const [results, siteImages] = await Promise.all([Promise.all(serviceSlugs.map((slug) => getProjectsByService(slug, locale))), getSiteImages(locale)]);
  const studioProjects = results.flatMap((result) => result.projects).sort((a, b) => a.displayOrder - b.displayOrder);
  const images: FieldImage[] = [];
  if (studioProjects.length) {
    // Studio is the source of truth: its projects, plus the service covers and team photos from Site Images.
    const seen = new Set<string>();
    for (const project of studioProjects) for (const image of project.images) {
      if (!image.asset?.url || seen.has(image.asset.url)) continue;
      seen.add(image.asset.url);
      images.push({ id: `${project.id}-${image.key}`, src: image.asset.url, alt: image.alt || project.title, title: image.caption || project.title, category: project.serviceCategory, location: project.location });
    }
    for (const slug of serviceSlugs) images.push({ id: `service-${slug}`, src: siteImages.services[slug].src, alt: siteImages.services[slug].alt, title: dictionary.services[slug].title, category: slug });
    for (const [id, image] of Object.entries({ homeHero: siteImages.homeHero, aboutHero: siteImages.aboutHero, qualityTeam: siteImages.qualityTeam })) images.push({ id, src: image.src, alt: image.alt, title: image.alt, category: "team" });
  } else images.push(...localGallery(locale, dictionary));
  return <main className="gallery-page"><section className="gallery-page__intro"><Container><p className="eyebrow">{text.eyebrow}</p><h1>{text.heading}</h1><p className="gallery-page__description">{text.body}</p><div className="gallery-page__intro-footer"><span>PT SUGEE</span><span>{images.length} {text.photos} · Indonesia & Singapore</span></div></Container></section><section className="gallery-page__collection" aria-label={text.heading}><Container><FieldGallery images={images} categories={categories} copy={text} /></Container></section><ContactBoundary contact={dictionary.contact} locale={locale} /></main>;
}

/** Built-in photos, shown until Sanity is connected and seeded. */
function localGallery(locale: Locale, dictionary: (typeof dictionaries)[Locale]): FieldImage[] {
  const projects = withUploadedProject({ status: "empty", projects: [] }, locale).projects;
  const uploaded = new Map(projects.flatMap((project) => project.images.map((image) => [image.asset.url, { image, project }] as const)));
  return localFieldImages.map(({ image, file, category }): FieldImage => {
    const match = [...uploaded.entries()].find(([path]) => path.split("/").pop()?.replace(/\.[^.]+$/, "") === file)?.[1];
    const title = match?.image.caption ?? (category === "team" ? file === "quality-machine-team" ? dictionary.images.qualityTeam : file === "about-offshore-team" ? dictionary.images.aboutHero : dictionary.images.homeHero : dictionary.services[category].title);
    return { id: file, src: image, alt: match?.image.alt ?? title, title, category, location: match?.project.location };
  });
}
