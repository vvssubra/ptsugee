import {createImageUrlBuilder, type SanityImageSource} from "@sanity/image-url";
import {sanityDataset, sanityProjectId} from "./client";

interface ImageDimensions {
  width: number;
  height?: number;
  quality?: number;
}

interface SanityImageConfig {
  projectId: string;
  dataset: string;
}

export function buildSanityImageUrl(
  source: SanityImageSource,
  {width, height, quality = 82}: ImageDimensions,
  config: SanityImageConfig = {projectId: sanityProjectId, dataset: sanityDataset},
): string {
  let image = createImageUrlBuilder(config).image(source).width(width).quality(quality).auto("format");
  if (height) image = image.height(height).fit("crop");
  return image.url();
}
