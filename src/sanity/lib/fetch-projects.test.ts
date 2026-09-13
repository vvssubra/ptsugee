import {describe, expect, it, vi} from "vitest";
import type {ServiceSlug} from "@/content/types";
import {
  createProjectGalleryReader,
  type ProjectGallery,
  type SanityReadClient,
} from "./fetch-projects";
import {featuredProjectsQuery, projectsByServiceQuery} from "./queries";
import {buildSanityImageUrl} from "./image";

const project: ProjectGallery = {
  id: "project-1",
  title: "Penyelarasan kompresor",
  serviceCategory: "laser-alignment-service",
  location: "Batam, Indonesia",
  completionYear: 2026,
  displayOrder: 2,
  featured: true,
  images: [
    {
      key: "image-1",
      alt: "Teknisi menyelaraskan kompresor",
      caption: "Final alignment check",
      asset: {
        id: "image-asset-1",
        url: "https://cdn.sanity.io/images/test/production/asset-1200x800.jpg",
        width: 1200,
        height: 800,
        aspectRatio: 1.5,
        lqip: "data:image/jpeg;base64,abc",
      },
    },
  ],
};

function clientReturning(value: ProjectGallery[] | Error) {
  const fetch = vi.fn(async () => {
    if (value instanceof Error) throw value;
    return value;
  });

  return {client: {fetch} as unknown as SanityReadClient, fetch};
}

describe("project gallery queries", () => {
  it("filter featured projects, order them, and localize with English fallback", () => {
    expect(featuredProjectsQuery).toContain("featured == true");
    expect(featuredProjectsQuery).toContain("order(displayOrder asc)");
    expect(featuredProjectsQuery).toContain("coalesce(title[$locale], title.en)");
    expect(featuredProjectsQuery).toContain("coalesce(caption[$locale], caption.en)");
  });

  it("filters service projects by the supplied approved category", () => {
    expect(projectsByServiceQuery).toContain("serviceCategory == $service");
    expect(projectsByServiceQuery).toContain("order(displayOrder asc)");
  });
});

describe("project gallery reads", () => {
  it("returns ready featured projects and tags the published read", async () => {
    const {client, fetch} = clientReturning([project]);
    const reader = createProjectGalleryReader(client);

    await expect(reader.getFeaturedProjects("id")).resolves.toEqual({
      status: "ready",
      projects: [project],
    });
    expect(fetch).toHaveBeenCalledWith(
      featuredProjectsQuery,
      {locale: "id"},
      {next: {tags: ["projectGallery"]}},
    );
  });

  it("returns ready service projects for the exact service filter", async () => {
    const {client, fetch} = clientReturning([project]);
    const reader = createProjectGalleryReader(client);
    const service: ServiceSlug = "laser-alignment-service";

    await expect(reader.getProjectsByService(service, "en")).resolves.toEqual({
      status: "ready",
      projects: [project],
    });
    expect(fetch).toHaveBeenCalledWith(
      projectsByServiceQuery,
      {locale: "en", service},
      {next: {tags: ["projectGallery"]}},
    );
  });

  it("distinguishes an empty gallery from an unavailable CMS", async () => {
    const empty = createProjectGalleryReader(clientReturning([]).client);
    const unavailable = createProjectGalleryReader(clientReturning(new Error("network down")).client);

    await expect(empty.getFeaturedProjects("en")).resolves.toEqual({status: "empty", projects: []});
    await expect(unavailable.getFeaturedProjects("en")).resolves.toEqual({
      status: "unavailable",
      projects: [],
    });
  });
});

describe("Sanity image URLs", () => {
  it("builds a cropped, format-negotiated CDN URL with explicit dimensions", () => {
    const url = buildSanityImageUrl(
      {_type: "reference", _ref: "image-abc123-1200x800-jpg"},
      {width: 800, height: 600, quality: 82},
      {projectId: "testproject", dataset: "production"},
    );

    const parsed = new URL(url);
    expect(`${parsed.origin}${parsed.pathname}`).toBe(
      "https://cdn.sanity.io/images/testproject/production/abc123-1200x800.jpg",
    );
    expect(Object.fromEntries(parsed.searchParams)).toMatchObject({
      w: "800",
      h: "600",
      q: "82",
      auto: "format",
      fit: "crop",
    });
  });
});
