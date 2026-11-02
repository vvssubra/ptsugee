import {defineArrayMember, defineField, defineType} from "sanity";
import {serviceImageField} from "@/content/site-images";
import {serviceSlugs, type ServiceSlug} from "@/content/types";

export const siteImagesId = "siteImages";

const serviceTitles: Record<ServiceSlug, string> = {
  "machinery-equipment-installation": "Machinery & Equipment Installation",
  "machinery-equipment-overhauling": "Machinery & Equipment Overhauling",
  epocast: "Epocast",
  "laser-alignment-service": "Laser Alignment Service",
  "in-situ-machining": "In-Situ Machining",
  "flange-management": "Flange Management",
};

const optionalAlt = defineField({
  name: "alt",
  title: "Alt text",
  description: "Describe the new photo. Leave empty to keep the default description.",
  type: "object",
  fields: [
    defineField({name: "en", title: "English", type: "string", validation: (rule) => rule.max(160)}),
    defineField({name: "id", title: "Indonesian", type: "string", validation: (rule) => rule.max(160)}),
  ],
});

export const siteImage = defineType({
  name: "siteImage",
  title: "Site image",
  type: "image",
  fields: [optionalAlt],
});

const slot = (name: string, title: string, description?: string) =>
  defineField({name, title, description: description ?? "Leave empty to use the built-in photo.", type: "siteImage"});

export const siteImages = defineType({
  name: siteImagesId,
  title: "Site Images",
  type: "document",
  fields: [
    slot("homeHero", "Home hero"),
    slot("aboutHero", "About page photo"),
    slot("qualityTeam", "Quality section and services banner"),
    defineField({
      name: "services",
      title: "Service cover photos",
      type: "object",
      fields: serviceSlugs.map((slug) => slot(serviceImageField(slug), serviceTitles[slug])),
    }),
    defineField({
      name: "clientLogos",
      title: "Client logos",
      description: "Drag to reorder. Leave empty to use the built-in logos.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "clientLogo",
          fields: [
            defineField({name: "name", title: "Client name", type: "string", validation: (rule) => rule.required().max(80)}),
            defineField({name: "logo", title: "Logo", type: "image", validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: "name", media: "logo"}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: "Site Images"})},
});
