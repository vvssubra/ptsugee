import type { StaticImageData } from "next/image";
import { serviceAssets, type LocalImageAsset } from "@/content/assets";
import {
  serviceSlugs,
  type Locale,
  type ServiceContent,
  type ServiceSlug,
  type TechnicalValue,
} from "./types";

export { serviceSlugs };

const heroImage = ({ src, width, height }: LocalImageAsset): StaticImageData => ({ src, width, height });

export const services: ServiceContent[] = [
  {
    slug: "machinery-equipment-installation",
    heroImage: heroImage(serviceAssets["machinery-equipment-installation"]),
    galleryCategory: "machinery-equipment-installation",
    capabilityKeys: ["foundationAssessment", "directInstallation", "precisionLeveling", "foundationDrilling", "mechanicalIntegration", "finalAlignment"],
    specificationGroups: [],
    relatedServices: ["laser-alignment-service", "epocast", "flange-management"],
  },
  {
    slug: "machinery-equipment-overhauling",
    heroImage: heroImage(serviceAssets["machinery-equipment-overhauling"]),
    galleryCategory: "machinery-equipment-overhauling",
    capabilityKeys: ["inspectionDiagnostics", "controlledDismantling", "repairPlanning", "machiningSupport", "reassemblyAlignment", "performanceTesting"],
    specificationGroups: [],
    relatedServices: ["in-situ-machining", "laser-alignment-service", "flange-management"],
  },
  {
    slug: "epocast",
    heroImage: heroImage(serviceAssets.epocast),
    galleryCategory: "epocast",
    capabilityKeys: ["foundationIrregularities", "uniformLoadTransfer", "vibrationReduction", "corrosionResistance", "reducedMachining", "efficientInstallation"],
    specificationGroups: [],
    relatedServices: ["machinery-equipment-installation", "laser-alignment-service", "in-situ-machining"],
  },
  {
    slug: "laser-alignment-service",
    heroImage: heroImage(serviceAssets["laser-alignment-service"]),
    galleryCategory: "laser-alignment-service",
    capabilityKeys: ["rotalignPro", "boralign", "levalign", "preAlignment", "correctionSupport", "measurementRecords"],
    specificationGroups: [],
    relatedServices: ["machinery-equipment-installation", "machinery-equipment-overhauling", "in-situ-machining"],
  },
  {
    slug: "in-situ-machining",
    heroImage: heroImage(serviceAssets["in-situ-machining"]),
    galleryCategory: "in-situ-machining",
    capabilityKeys: ["reducedLogistics", "criticalSurfaceAccess", "surfaceRestoration", "alignmentBoltingCoordination"],
    specificationGroups: [
      { labelKey: "lineBoring", items: [{ labelKey: "workingRange", value: { kind: "range", min: 4, max: 40, unit: "inch" } }] },
      { labelKey: "flangeFacing", items: [{ labelKey: "workingRange", value: { kind: "range", min: 1, max: 120, unit: "inch" } }] },
      { labelKey: "milling", items: [{ labelKey: "workingLength", value: { kind: "maximum", value: 6000, unit: "millimeter" } }] },
    ],
    relatedServices: ["machinery-equipment-overhauling", "laser-alignment-service", "flange-management"],
  },
  {
    slug: "flange-management",
    heroImage: heroImage(serviceAssets["flange-management"]),
    galleryCategory: "flange-management",
    capabilityKeys: ["surfaceInspection", "onSiteFacing", "gasketPreparation", "boltSequence", "hydraulicTorqueing", "jointRecords"],
    specificationGroups: [],
    relatedServices: ["in-situ-machining", "machinery-equipment-installation", "machinery-equipment-overhauling"],
  },
];

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

type ScopeTemplates = Record<string, string>;

const localizedUnits: Record<Locale, Record<TechnicalValue["unit"], string>> = {
  en: { inch: "inches", millimeter: "mm" },
  id: { inch: "inci", millimeter: "mm" },
};

function formatTechnicalValue(locale: Locale, value: TechnicalValue): Record<string, string> {
  const number = new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US");
  const unit = localizedUnits[locale][value.unit];

  if (value.kind === "range") {
    return { min: number.format(value.min), max: number.format(value.max), unit };
  }

  return { value: number.format(value.value), unit };
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? `{${key}}`);
}

export function formatSpecificationGroups(
  service: ServiceContent,
  locale: Locale,
  templates: ScopeTemplates,
): string[] {
  return service.specificationGroups.flatMap(({ labelKey, items }) => {
    const template = templates[labelKey];

    if (!template) {
      throw new Error(`Missing localized template for ${labelKey}`);
    }

    return items.map(({ value }) => interpolate(template, formatTechnicalValue(locale, value)));
  });
}
