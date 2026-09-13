import {describe, expect, it} from "vitest";
import {
  projectGallery,
  validateProjectGalleryDocument,
  type ProjectGalleryDocument,
} from "./project-gallery";

const validDocument: ProjectGalleryDocument = {
  _type: "projectGallery",
  title: {en: "Compressor alignment", id: "Penyelarasan kompresor"},
  serviceCategory: "laser-alignment-service",
  location: "Batam, Indonesia",
  completionYear: 2026,
  displayOrder: 10,
  featured: true,
  images: [
    {
      _key: "image-1",
      _type: "image",
      asset: {_type: "reference", _ref: "image-example-1200x800-jpg"},
      alt: {en: "Technician aligning a compressor", id: "Teknisi menyelaraskan kompresor"},
      caption: {en: "Final alignment check", id: "Pemeriksaan penyelarasan akhir"},
    },
  ],
};

describe("projectGallery schema", () => {
  it("accepts a complete bilingual project within every boundary", () => {
    expect(validateProjectGalleryDocument(validDocument, 2026)).toEqual([]);
  });

  it("rejects missing bilingual titles and image alt text", () => {
    const errors = validateProjectGalleryDocument(
      {
        ...validDocument,
        title: {en: "", id: ""},
        images: [{...validDocument.images[0], alt: {en: "", id: ""}}],
      },
      2026,
    );

    expect(errors).toEqual(
      expect.arrayContaining([
        "English title is required.",
        "Indonesian title is required.",
        "English image alt text is required.",
        "Indonesian image alt text is required.",
      ]),
    );
  });

  it("enforces exact text lengths, year, ordering, and image boundaries", () => {
    const errors = validateProjectGalleryDocument(
      {
        ...validDocument,
        title: {en: "a".repeat(121), id: "b".repeat(121)},
        location: "x".repeat(121),
        completionYear: 1999,
        displayOrder: 10_000,
        images: [],
      },
      2026,
    );

    expect(errors).toEqual(
      expect.arrayContaining([
        "English title must be 120 characters or fewer.",
        "Indonesian title must be 120 characters or fewer.",
        "Location must be 120 characters or fewer.",
        "Completion year must be between 2000 and 2026.",
        "Display order must be an integer between 0 and 9999.",
        "At least one project image is required.",
      ]),
    );
  });

  it("accepts only the six approved service categories", () => {
    const errors = validateProjectGalleryDocument(
      {...validDocument, serviceCategory: "general-engineering" as never},
      2026,
    );

    expect(errors).toContain("Select one of the six approved service categories.");
  });

  it("previews the first image with English title, location, and year", () => {
    const preview = projectGallery.preview?.prepare?.({
      title: validDocument.title.en,
      category: validDocument.serviceCategory,
      location: validDocument.location,
      year: validDocument.completionYear,
      media: validDocument.images[0],
    });

    expect(preview).toMatchObject({
      title: "Compressor alignment",
      subtitle: "Laser Alignment Service · Batam, Indonesia · 2026",
      media: validDocument.images[0],
    });
  });
});
