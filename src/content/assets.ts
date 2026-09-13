import type { ServiceSlug } from "@/content/types";

export type ImageAltKey = `images.${string}`;

export interface LocalImageAsset {
  src: `/images/${string}`;
  width: number;
  height: number;
  altKey: ImageAltKey;
  provenance: string;
}

export interface SeedProjectAsset extends LocalImageAsset {
  serviceCategory: ServiceSlug;
}

export const heroAssets = {
  home: {
    src: "/images/hero/home-offshore-rig.webp",
    width: 1600,
    height: 896,
    altKey: "images.homeHero",
    provenance: "Framer source-site asset E8ZMWU1oDzbgJ1VNlqke4ts056Q.png",
  },
  about: {
    src: "/images/hero/about-offshore-team.webp",
    width: 1600,
    height: 896,
    altKey: "images.aboutHero",
    provenance: "Framer source-site asset vY6zAuqwm7xudZxaj9syOBPkGSw.jpg",
  },
  quality: {
    src: "/images/hero/quality-machine-team.webp",
    width: 1600,
    height: 903,
    altKey: "images.qualityTeam",
    provenance: "Framer source-site asset 64Om5n8ijXtBD3KUeOqd8znx9nM.jpeg",
  },
} as const satisfies Record<string, LocalImageAsset>;

export const serviceAssets = {
  "machinery-equipment-installation": {
    src: "/images/services/machinery-equipment-installation.webp", width: 1600, height: 1200, altKey: "images.serviceMachineryInstallation", provenance: "Framer source-site asset 9w8Dw3eyC0UtgED6JHTK24WIPB8.jpeg",
  },
  "machinery-equipment-overhauling": {
    src: "/images/services/machinery-equipment-overhauling.webp", width: 1600, height: 1200, altKey: "images.serviceMachineryOverhauling", provenance: "Framer source-site asset h1hFPECEk0pS12l2RIlYEA3r7Q.jpeg",
  },
  epocast: {
    src: "/images/services/epocast.webp", width: 1200, height: 1599, altKey: "images.serviceEpocast", provenance: "Framer source-site asset Y5LtGOWeRDgRmehpY9XhecxIA.jpeg",
  },
  "laser-alignment-service": {
    src: "/images/services/laser-alignment-service.webp", width: 1152, height: 648, altKey: "images.serviceLaserAlignment", provenance: "Framer source-site asset vq1TA6jLmAdNHtoz6YQAyKjFaWU.jpeg",
  },
  "in-situ-machining": {
    src: "/images/services/in-situ-machining.webp", width: 1152, height: 648, altKey: "images.serviceInSituMachining", provenance: "Framer source-site asset JlOAja1AtOdjoRSwWZP2Io3FrT4.jpeg",
  },
  "flange-management": {
    src: "/images/services/flange-management.webp", width: 1600, height: 1200, altKey: "images.serviceFlangeManagement", provenance: "Framer source-site asset fStD1rpgrWyKqebEgGvPHcQ2A.jpeg",
  },
} as const satisfies Record<ServiceSlug, LocalImageAsset>;

export const seedProjectAssets = {
  "machinery-equipment-installation": {
    src: "/images/projects/machinery-equipment-installation-profile.webp", width: 1460, height: 760, altKey: "images.projectMachineryInstallation", serviceCategory: "machinery-equipment-installation", provenance: "PT SUGEE company profile PDF, page 13 (heavy machinery installations)",
  },
  "machinery-equipment-overhauling": {
    src: "/images/projects/machinery-equipment-overhauling-profile.webp", width: 2250, height: 560, altKey: "images.projectMachineryOverhauling", serviceCategory: "machinery-equipment-overhauling", provenance: "PT SUGEE company profile PDF, page 14 (ship/rig repair, service and overhauling)",
  },
  epocast: {
    src: "/images/projects/epocast-profile.webp", width: 1370, height: 1000, altKey: "images.projectEpocast", serviceCategory: "epocast", provenance: "PT SUGEE company profile PDF, page 10 (chock fast projects)",
  },
  "laser-alignment-service": {
    src: "/images/projects/laser-alignment-profile.webp", width: 1180, height: 1000, altKey: "images.projectLaserAlignment", serviceCategory: "laser-alignment-service", provenance: "PT SUGEE company profile PDF, page 11 (laser alignment projects)",
  },
  "in-situ-machining": {
    src: "/images/projects/in-situ-machining-profile.webp", width: 1120, height: 880, altKey: "images.projectInSituMachining", serviceCategory: "in-situ-machining", provenance: "PT SUGEE company profile PDF, page 12 (in-situ machining projects)",
  },
  "flange-management": {
    src: "/images/projects/flange-management-module-installation.webp", width: 721, height: 522, altKey: "images.projectFlangeManagement", serviceCategory: "flange-management", provenance: "PT SUGEE company profile PDF, page 17 (module installation and torqueing)",
  },
} as const satisfies Record<ServiceSlug, SeedProjectAsset>;

export const clientLogoAssets = {
  asl: { src: "/images/clients/asl.png", width: 185, height: 66, altKey: "images.clientAsl", provenance: "PT SUGEE company profile PDF, page 9" },
  siemens: { src: "/images/clients/siemens.png", width: 781, height: 126, altKey: "images.clientSiemens", provenance: "PT SUGEE company profile PDF, page 9" },
  stEngineering: { src: "/images/clients/st-engineering.png", width: 465, height: 137, altKey: "images.clientStEngineering", provenance: "PT SUGEE company profile PDF, page 9" },
  keppelFels: { src: "/images/clients/keppel-fels.png", width: 707, height: 146, altKey: "images.clientKeppelFels", provenance: "PT SUGEE company profile PDF, page 9" },
  seadrill: { src: "/images/clients/seadrill.png", width: 1194, height: 436, altKey: "images.clientSeadrill", provenance: "PT SUGEE company profile PDF, page 9" },
  paxOcean: { src: "/images/clients/pax-ocean.png", width: 891, height: 154, altKey: "images.clientPaxOcean", provenance: "PT SUGEE company profile PDF, page 9" },
  shell: { src: "/images/clients/shell.png", width: 371, height: 343, altKey: "images.clientShell", provenance: "PT SUGEE company profile PDF, page 9" },
  sembcorpMarine: { src: "/images/clients/sembcorp-marine.png", width: 400, height: 145, altKey: "images.clientSembcorpMarine", provenance: "PT SUGEE company profile PDF, page 9" },
} as const satisfies Record<string, LocalImageAsset>;

export const allAssets = {
  homeHero: heroAssets.home, aboutHero: heroAssets.about, qualityTeam: heroAssets.quality,
  machineryInstallationService: serviceAssets["machinery-equipment-installation"], machineryOverhaulingService: serviceAssets["machinery-equipment-overhauling"], epocastService: serviceAssets.epocast, laserAlignmentService: serviceAssets["laser-alignment-service"], inSituMachiningService: serviceAssets["in-situ-machining"], flangeManagementService: serviceAssets["flange-management"],
  machineryInstallationProject: seedProjectAssets["machinery-equipment-installation"], machineryOverhaulingProject: seedProjectAssets["machinery-equipment-overhauling"], epocastProject: seedProjectAssets.epocast, laserAlignmentProject: seedProjectAssets["laser-alignment-service"], inSituMachiningProject: seedProjectAssets["in-situ-machining"], flangeManagementProject: seedProjectAssets["flange-management"],
  ...clientLogoAssets,
} as const satisfies Record<string, LocalImageAsset>;
