import type { StaticImageData } from "next/image";
import type { ServiceContent, ServiceSlug } from "./types";

export const serviceSlugs = [
  "machinery-equipment-installation",
  "machinery-equipment-overhauling",
  "epocast",
  "laser-alignment-service",
  "in-situ-machining",
  "flange-management",
] as const;

const heroImage = (src: string): StaticImageData => ({ src, width: 1200, height: 800 });

export const services: ServiceContent[] = [
  {
    slug: "machinery-equipment-installation",
    heroImage: heroImage("/images/services/machinery-equipment-installation.jpg"),
    galleryCategory: "machinery-equipment-installation",
    capabilityKeys: ["foundationAssessment", "directInstallation", "precisionLeveling", "foundationDrilling", "mechanicalIntegration", "finalAlignment"],
    specificationGroups: [],
    relatedServices: ["laser-alignment-service", "epocast", "flange-management"],
  },
  {
    slug: "machinery-equipment-overhauling",
    heroImage: heroImage("/images/services/machinery-equipment-overhauling.jpg"),
    galleryCategory: "machinery-equipment-overhauling",
    capabilityKeys: ["inspectionDiagnostics", "controlledDismantling", "repairPlanning", "machiningSupport", "reassemblyAlignment", "performanceTesting"],
    specificationGroups: [],
    relatedServices: ["in-situ-machining", "laser-alignment-service", "flange-management"],
  },
  {
    slug: "epocast",
    heroImage: heroImage("/images/services/epocast.jpg"),
    galleryCategory: "epocast",
    capabilityKeys: ["foundationIrregularities", "uniformLoadTransfer", "vibrationReduction", "corrosionResistance", "reducedMachining", "efficientInstallation"],
    specificationGroups: [],
    relatedServices: ["machinery-equipment-installation", "laser-alignment-service", "in-situ-machining"],
  },
  {
    slug: "laser-alignment-service",
    heroImage: heroImage("/images/services/laser-alignment-service.jpg"),
    galleryCategory: "laser-alignment-service",
    capabilityKeys: ["rotalignPro", "boralign", "levalign", "preAlignment", "correctionSupport", "measurementRecords"],
    specificationGroups: [],
    relatedServices: ["machinery-equipment-installation", "machinery-equipment-overhauling", "in-situ-machining"],
  },
  {
    slug: "in-situ-machining",
    heroImage: heroImage("/images/services/in-situ-machining.jpg"),
    galleryCategory: "in-situ-machining",
    capabilityKeys: ["reducedLogistics", "criticalSurfaceAccess", "surfaceRestoration", "alignmentBoltingCoordination"],
    specificationGroups: [
      { labelKey: "lineBoring", items: [{ labelKey: "workingRange", value: "4–40 in" }] },
      { labelKey: "flangeFacing", items: [{ labelKey: "workingRange", value: "1–120 in" }] },
      { labelKey: "milling", items: [{ labelKey: "workingLength", value: "6,000 mm" }] },
    ],
    relatedServices: ["machinery-equipment-overhauling", "laser-alignment-service", "flange-management"],
  },
  {
    slug: "flange-management",
    heroImage: heroImage("/images/services/flange-management.jpg"),
    galleryCategory: "flange-management",
    capabilityKeys: ["surfaceInspection", "onSiteFacing", "gasketPreparation", "boltSequence", "hydraulicTorqueing", "jointRecords"],
    specificationGroups: [],
    relatedServices: ["in-situ-machining", "machinery-equipment-installation", "machinery-equipment-overhauling"],
  },
];

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}
