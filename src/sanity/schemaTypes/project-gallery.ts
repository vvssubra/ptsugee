import {defineArrayMember, defineField, defineType} from "sanity";
import {serviceSlugs, type ServiceSlug} from "@/content/types";

export interface LocalizedString {
  en: string;
  id: string;
}

export interface ProjectGalleryDocument {
  _type: "projectGallery";
  title: LocalizedString;
  serviceCategory: ServiceSlug;
  location: string;
  completionYear?: number;
  displayOrder: number;
  featured: boolean;
  images: Array<{
    _key: string;
    _type: "image";
    asset: {_type: "reference"; _ref: string};
    alt: LocalizedString;
    caption?: LocalizedString;
  }>;
}

const serviceTitles: Record<ServiceSlug, string> = {
  "machinery-equipment-installation": "Machinery & Equipment Installation",
  "machinery-equipment-overhauling": "Machinery & Equipment Overhauling",
  epocast: "Epocast",
  "laser-alignment-service": "Laser Alignment Service",
  "in-situ-machining": "In-Situ Machining",
  "flange-management": "Flange Management",
};

function isBlank(value: string | undefined): boolean {
  return !value?.trim();
}

export function validateProjectGalleryDocument(
  document: Partial<ProjectGalleryDocument> | undefined,
  currentYear = new Date().getFullYear(),
): string[] {
  if (!document) return ["Project gallery content is required."];

  const errors: string[] = [];
  const title = document.title;

  if (isBlank(title?.en)) errors.push("English title is required.");
  else if (title!.en.length > 120) errors.push("English title must be 120 characters or fewer.");
  if (isBlank(title?.id)) errors.push("Indonesian title is required.");
  else if (title!.id.length > 120) errors.push("Indonesian title must be 120 characters or fewer.");

  if (!document.serviceCategory || !serviceSlugs.includes(document.serviceCategory)) {
    errors.push("Select one of the six approved service categories.");
  }

  if (isBlank(document.location)) errors.push("Location is required.");
  else if (document.location!.length > 120) errors.push("Location must be 120 characters or fewer.");

  if (
    document.completionYear !== undefined &&
    (!Number.isInteger(document.completionYear) || document.completionYear < 2000 || document.completionYear > currentYear)
  ) {
    errors.push(`Completion year must be between 2000 and ${currentYear}.`);
  }

  if (
    !Number.isInteger(document.displayOrder) ||
    document.displayOrder === undefined ||
    document.displayOrder < 0 ||
    document.displayOrder > 9999
  ) {
    errors.push("Display order must be an integer between 0 and 9999.");
  }

  if (!document.images?.length) {
    errors.push("At least one project image is required.");
  }

  for (const image of document.images ?? []) {
    if (!image.asset?._ref) errors.push("Every project image requires an uploaded asset.");
    if (isBlank(image.alt?.en)) errors.push("English image alt text is required.");
    else if (image.alt.en.length > 180) errors.push("English image alt text must be 180 characters or fewer.");
    if (isBlank(image.alt?.id)) errors.push("Indonesian image alt text is required.");
    else if (image.alt.id.length > 180) errors.push("Indonesian image alt text must be 180 characters or fewer.");
    if (image.caption?.en && image.caption.en.length > 240) errors.push("English caption must be 240 characters or fewer.");
    if (image.caption?.id && image.caption.id.length > 240) errors.push("Indonesian caption must be 240 characters or fewer.");
  }

  return errors;
}

const localizedTitle = defineType({
  name: "localizedProjectTitle",
  title: "Localized project title",
  type: "object",
  fields: [
    defineField({name: "en", title: "English", type: "string", validation: (rule) => rule.required().max(120)}),
    defineField({name: "id", title: "Bahasa Indonesia", type: "string", validation: (rule) => rule.required().max(120)}),
  ],
});

const localizedAlt = defineType({
  name: "localizedImageAlt",
  title: "Localized alternative text",
  type: "object",
  fields: [
    defineField({name: "en", title: "English", type: "string", validation: (rule) => rule.required().max(180)}),
    defineField({name: "id", title: "Bahasa Indonesia", type: "string", validation: (rule) => rule.required().max(180)}),
  ],
});

const localizedCaption = defineType({
  name: "localizedImageCaption",
  title: "Localized caption",
  type: "object",
  fields: [
    defineField({name: "en", title: "English", type: "string", validation: (rule) => rule.max(240)}),
    defineField({name: "id", title: "Bahasa Indonesia", type: "string", validation: (rule) => rule.max(240)}),
  ],
});

export const projectGallery = defineType({
  name: "projectGallery",
  title: "Project Gallery",
  type: "document",
  validation: (rule) =>
    rule.custom((value) => {
      const errors = validateProjectGalleryDocument(value as Partial<ProjectGalleryDocument> | undefined);
      return errors[0] ?? true;
    }),
  fields: [
    defineField({name: "title", title: "Project title", type: "localizedProjectTitle", validation: (rule) => rule.required()}),
    defineField({
      name: "serviceCategory",
      title: "Service category",
      type: "string",
      options: {list: serviceSlugs.map((value) => ({title: serviceTitles[value], value}))},
      validation: (rule) => rule.required(),
    }),
    defineField({name: "location", title: "Location", type: "string", validation: (rule) => rule.required().max(120)}),
    defineField({
      name: "completionYear",
      title: "Completion year",
      type: "number",
      validation: (rule) => rule.integer().min(2000).max(new Date().getFullYear()),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0).max(9999),
    }),
    defineField({name: "featured", title: "Feature on home page", type: "boolean", initialValue: false}),
    defineField({
      name: "images",
      title: "Project images",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "image",
          options: {hotspot: true},
          fields: [
            defineField({name: "alt", title: "Alternative text", type: "localizedImageAlt", validation: (rule) => rule.required()}),
            defineField({name: "caption", title: "Caption", type: "localizedImageCaption"}),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {title: "Display order", name: "displayOrderAsc", by: [{field: "displayOrder", direction: "asc"}]},
  ],
  preview: {
    select: {
      title: "title.en",
      category: "serviceCategory",
      location: "location",
      year: "completionYear",
      media: "images.0",
    },
    prepare({title, category, location, year, media}) {
      const details = [serviceTitles[category as ServiceSlug] ?? category, location, year].filter(Boolean).join(" · ");
      return {title, subtitle: details, media};
    },
  },
});

export const projectGallerySchemaTypes = [localizedTitle, localizedAlt, localizedCaption, projectGallery];
