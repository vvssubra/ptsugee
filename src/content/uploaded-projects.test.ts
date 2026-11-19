import { fieldPhotos } from "@/content/field-photos";
import { withUploadedProject } from "@/content/uploaded-projects";
import type { ProjectGallery } from "@/sanity/lib/fetch-projects";

const studioProject = (id: string): ProjectGallery => ({ id, title: id, serviceCategory: "epocast", location: "Batam", displayOrder: 5, featured: true, images: [] });

describe("built-in field photos", () => {
  it("fills the slideshow with every field photo when Sanity has no projects", () => {
    const gallery = withUploadedProject({ status: "empty", projects: [] }, "en");
    const urls = gallery.projects.flatMap((project) => project.images.map((image) => image.asset.url));
    expect(urls).toHaveLength(9 + fieldPhotos.length);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("adds field photos on top of Studio projects until they are seeded there", () => {
    const gallery = withUploadedProject({ status: "ready", projects: [studioProject("project-gallery-x")] }, "id");
    expect(gallery.projects.map((project) => project.id)).toContain("project-gallery-x");
    expect(gallery.projects.filter((project) => project.id.startsWith("field-photos-")).flatMap((project) => project.images)).toHaveLength(fieldPhotos.length);
  });

  it("does not duplicate a field-photo project that Studio already serves", () => {
    const seeded = studioProject("project-gallery-field-photos-in-situ-machining");
    const gallery = withUploadedProject({ status: "ready", projects: [seeded] }, "en");
    expect(gallery.projects.some((project) => project.id === "field-photos-in-situ-machining")).toBe(false);
  });
});
