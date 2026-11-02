import {describe, expect, it, vi} from "vitest";
import {localSiteImages, serviceImageField} from "@/content/site-images";
import {serviceSlugs} from "@/content/types";
import {createSiteImagesReader, mergeSiteImages} from "./fetch-site-images";
import {siteImagesQuery} from "./queries";

const fallback = localSiteImages("en");
const studio = {src: "https://cdn.sanity.io/images/test/production/new-1200x800.jpg", width: 1200, height: 800};

describe("site images", () => {
  it("keeps every built-in photo when Studio has no document", () => {
    expect(mergeSiteImages(null, fallback)).toEqual(fallback);
  });

  it("swaps only the slots an admin filled, keeping default alt text when none was given", () => {
    const merged = mergeSiteImages(
      {homeHero: {...studio, alt: "New rig photo"}, services: {inSituMachining: {...studio, alt: null as never}}, aboutHero: {src: studio.src}},
      fallback,
    );

    expect(merged.homeHero).toEqual({...studio, alt: "New rig photo"});
    expect(merged.services["in-situ-machining"]).toEqual({...studio, alt: fallback.services["in-situ-machining"].alt});
    expect(merged.aboutHero).toEqual(fallback.aboutHero);
    expect(merged.services.epocast).toEqual(fallback.services.epocast);
    expect(merged.clientLogos).toEqual(fallback.clientLogos);
  });

  it("replaces the whole logo list with Studio logos, skipping unfinished uploads", () => {
    const merged = mergeSiteImages({clientLogos: [{...studio, alt: "Acme logo"}, {alt: "Pending logo"}]}, fallback);
    expect(merged.clientLogos).toEqual([{...studio, alt: "Acme logo"}]);
  });

  it("falls back to built-in photos when Sanity is unreachable", async () => {
    const read = createSiteImagesReader({fetch: vi.fn().mockRejectedValue(new Error("offline"))});
    await expect(read("id")).resolves.toEqual(localSiteImages("id"));
  });

  it("queries every service field the schema defines", () => {
    for (const slug of serviceSlugs) expect(siteImagesQuery).toContain(`${serviceImageField(slug)} {`);
  });
});
