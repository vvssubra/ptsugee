import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/routing";

export type { Locale };

export const serviceSlugs = [
  "machinery-equipment-installation",
  "machinery-equipment-overhauling",
  "epocast",
  "laser-alignment-service",
  "in-situ-machining",
  "flange-management",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type TechnicalUnit = "inch" | "millimeter";

export type TechnicalValue =
  | { kind: "range"; min: number; max: number; unit: TechnicalUnit }
  | { kind: "maximum"; value: number; unit: TechnicalUnit };

export interface ServiceContent {
  slug: ServiceSlug;
  heroImage: StaticImageData;
  galleryCategory: ServiceSlug;
  capabilityKeys: string[];
  specificationGroups: Array<{
    labelKey: string;
    items: Array<{ labelKey: string; value: TechnicalValue }>;
  }>;
  relatedServices: ServiceSlug[];
}
