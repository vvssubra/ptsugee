import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/routing";

export type { Locale };

export type ServiceSlug =
  | "machinery-equipment-installation"
  | "machinery-equipment-overhauling"
  | "epocast"
  | "laser-alignment-service"
  | "in-situ-machining"
  | "flange-management";

export interface ServiceContent {
  slug: ServiceSlug;
  heroImage: StaticImageData;
  galleryCategory: ServiceSlug;
  capabilityKeys: string[];
  specificationGroups: Array<{
    labelKey: string;
    items: Array<{ labelKey: string; value: string }>;
  }>;
  relatedServices: ServiceSlug[];
}
