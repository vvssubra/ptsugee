import type {StructureResolver} from "sanity/structure";
import {serviceSlugs, type ServiceSlug} from "@/content/types";

const serviceTitles: Record<ServiceSlug, string> = {
  "machinery-equipment-installation": "Machinery & Equipment Installation",
  "machinery-equipment-overhauling": "Machinery & Equipment Overhauling",
  epocast: "Epocast",
  "laser-alignment-service": "Laser Alignment Service",
  "in-situ-machining": "In-Situ Machining",
  "flange-management": "Flange Management",
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("PT SUGEE Content")
    .items([
      S.listItem()
        .title("Project Galleries")
        .child(
          S.list()
            .title("Project Galleries by Service")
            .items(
              serviceSlugs.map((service) =>
                S.listItem()
                  .title(serviceTitles[service])
                  .child(
                    S.documentTypeList("projectGallery")
                      .title(serviceTitles[service])
                      .filter('_type == "projectGallery" && serviceCategory == $service')
                      .params({service}),
                  ),
              ),
            ),
        ),
    ]);
