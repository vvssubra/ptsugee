import type { StaticImageData } from "next/image";
import type { ServiceSlug } from "@/content/types";
export type FieldImage = { id: string; src: string | StaticImageData; alt: string; title: string; category: ServiceSlug | "team"; location?: string };
import photo0 from "../../public/images/projects/asl-yard-batam-installation.jpg";
import photo1 from "../../public/images/projects/epocast-profile.webp";
import photo2 from "../../public/images/projects/flange-management-module-installation.webp";
import photo3 from "../../public/images/projects/heavy-equipment-installation-01.jpeg";
import photo4 from "../../public/images/projects/heavy-equipment-installation-02.jpeg";
import photo5 from "../../public/images/projects/heavy-equipment-installation-03.jpeg";
import photo6 from "../../public/images/projects/heavy-equipment-installation-04.jpeg";
import photo7 from "../../public/images/projects/heavy-equipment-installation-05.jpeg";
import photo8 from "../../public/images/projects/heavy-equipment-installation-06.jpeg";
import photo9 from "../../public/images/projects/heavy-equipment-installation-07.jpeg";
import photo10 from "../../public/images/projects/heavy-equipment-installation-08.jpeg";
import photo11 from "../../public/images/projects/heavy-equipment-installation-09.jpeg";
import photo12 from "../../public/images/projects/in-situ-machining-profile.webp";
import photo13 from "../../public/images/projects/laser-alignment-profile.webp";
import photo14 from "../../public/images/projects/machinery-equipment-installation-profile.webp";
import photo15 from "../../public/images/projects/machinery-equipment-overhauling-profile.webp";
import photo16 from "../../public/images/projects/wasco-yard-batam-machining.jpg";
import photo17 from "../../public/images/services/epocast.webp";
import photo18 from "../../public/images/services/flange-management.webp";
import photo19 from "../../public/images/services/in-situ-machining.webp";
import photo20 from "../../public/images/services/laser-alignment-service.webp";
import photo21 from "../../public/images/services/machinery-equipment-installation.webp";
import photo22 from "../../public/images/services/machinery-equipment-overhauling.webp";
import photo23 from "../../public/images/hero/about-offshore-team.webp";
import photo24 from "../../public/images/hero/home-offshore-rig.webp";
import photo25 from "../../public/images/hero/quality-machine-team.webp";
export const localFieldImages: Array<{ image: StaticImageData; file: string; category: ServiceSlug | "team" }> = [
  { image: photo0, file: "asl-yard-batam-installation", category: "machinery-equipment-installation" },
  { image: photo1, file: "epocast-profile", category: "epocast" },
  { image: photo2, file: "flange-management-module-installation", category: "flange-management" },
  { image: photo3, file: "heavy-equipment-installation-01", category: "machinery-equipment-installation" },
  { image: photo4, file: "heavy-equipment-installation-02", category: "machinery-equipment-installation" },
  { image: photo5, file: "heavy-equipment-installation-03", category: "machinery-equipment-installation" },
  { image: photo6, file: "heavy-equipment-installation-04", category: "machinery-equipment-installation" },
  { image: photo7, file: "heavy-equipment-installation-05", category: "machinery-equipment-installation" },
  { image: photo8, file: "heavy-equipment-installation-06", category: "machinery-equipment-installation" },
  { image: photo9, file: "heavy-equipment-installation-07", category: "machinery-equipment-installation" },
  { image: photo10, file: "heavy-equipment-installation-08", category: "machinery-equipment-installation" },
  { image: photo11, file: "heavy-equipment-installation-09", category: "machinery-equipment-installation" },
  { image: photo12, file: "in-situ-machining-profile", category: "in-situ-machining" },
  { image: photo13, file: "laser-alignment-profile", category: "laser-alignment-service" },
  { image: photo14, file: "machinery-equipment-installation-profile", category: "machinery-equipment-installation" },
  { image: photo15, file: "machinery-equipment-overhauling-profile", category: "machinery-equipment-overhauling" },
  { image: photo16, file: "wasco-yard-batam-machining", category: "in-situ-machining" },
  { image: photo17, file: "epocast", category: "epocast" },
  { image: photo18, file: "flange-management", category: "flange-management" },
  { image: photo19, file: "in-situ-machining", category: "in-situ-machining" },
  { image: photo20, file: "laser-alignment-service", category: "laser-alignment-service" },
  { image: photo21, file: "machinery-equipment-installation", category: "machinery-equipment-installation" },
  { image: photo22, file: "machinery-equipment-overhauling", category: "machinery-equipment-overhauling" },
  { image: photo23, file: "about-offshore-team", category: "team" },
  { image: photo24, file: "home-offshore-rig", category: "team" },
  { image: photo25, file: "quality-machine-team", category: "team" },
];
