import { isServiceSlug, serviceSlugs, services } from "@/content/services";

describe("service content", () => {
  it("defines the six approved service categories", () => {
    expect(serviceSlugs).toHaveLength(6);
    expect(isServiceSlug("flange-management")).toBe(true);
    expect(isServiceSlug("unknown")).toBe(false);
    expect(services).toHaveLength(6);
  });
});
