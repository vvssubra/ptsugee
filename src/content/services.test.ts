import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import {
  formatSpecificationGroups,
  isServiceSlug,
  serviceSlugs,
  services,
} from "@/content/services";

describe("service content", () => {
  it("defines the six approved service categories", () => {
    expect(serviceSlugs).toHaveLength(6);
    expect(isServiceSlug("flange-management")).toBe(true);
    expect(isServiceSlug("unknown")).toBe(false);
    expect(services).toHaveLength(6);
  });

  it("renders the centralized in-situ ranges with approved locale wording", () => {
    const inSituMachining = services.find(({ slug }) => slug === "in-situ-machining");

    expect(inSituMachining).toBeDefined();
    expect(formatSpecificationGroups(inSituMachining!, "en", enMessages.services["in-situ-machining"].scope)).toEqual([
      "Line boring from 4 to 40 inches using BB-series equipment",
      "Flange facing from 1 to 120 inches using FF-series equipment",
      "Milling up to 6,000 mm in length",
    ]);
    expect(formatSpecificationGroups(inSituMachining!, "id", idMessages.services["in-situ-machining"].scope)).toEqual([
      "Line boring dari 4 hingga 40 inci menggunakan peralatan seri BB",
      "Flange facing dari 1 hingga 120 inci menggunakan peralatan seri FF",
      "Milling hingga panjang 6.000 mm",
    ]);
  });
});
