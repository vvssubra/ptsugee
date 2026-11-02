import {defineQuery} from "next-sanity";

const projectProjection = `{
  "id": _id,
  "title": coalesce(title[$locale], title.en),
  serviceCategory,
  location,
  completionYear,
  displayOrder,
  featured,
  images[]{
    "key": _key,
    "alt": coalesce(alt[$locale], alt.en),
    "caption": coalesce(caption[$locale], caption.en),
    "asset": asset->{
      "id": _id,
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height,
      "aspectRatio": metadata.dimensions.aspectRatio,
      "lqip": metadata.lqip
    }
  }
}`;

export const featuredProjectsQuery = defineQuery(
  `*[_type == "projectGallery" && featured == true] | order(displayOrder asc) ${projectProjection}`,
);

export const projectsByServiceQuery = defineQuery(
  `*[_type == "projectGallery" && serviceCategory == $service] | order(displayOrder asc) ${projectProjection}`,
);

const siteImageProjection = `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "alt": coalesce(alt[$locale], alt.en)
}`;

const serviceImageFields = ["machineryEquipmentInstallation", "machineryEquipmentOverhauling", "epocast", "laserAlignmentService", "inSituMachining", "flangeManagement"]
  .map((field) => `${field} ${siteImageProjection}`)
  .join(", ");

export const siteImagesQuery = defineQuery(
  `*[_id == "siteImages"][0]{
    homeHero ${siteImageProjection},
    aboutHero ${siteImageProjection},
    qualityTeam ${siteImageProjection},
    services{ ${serviceImageFields} },
    clientLogos[]{
      "src": logo.asset->url,
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height,
      "alt": name + " logo"
    }
  }`,
);
