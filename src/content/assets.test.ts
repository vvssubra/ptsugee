import {
  allAssets,
  clientLogoAssets,
  heroAssets,
  seedProjectAssets,
  serviceAssets,
} from "@/content/assets";
import { serviceSlugs } from "@/content/types";
import { services } from "@/content/services";
import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";

function messageAt(messages: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((value, segment) => (
    value && typeof value === "object" ? (value as Record<string, unknown>)[segment] : undefined
  ), messages);
}

describe("approved visual asset manifest", () => {
  it("exposes local dimensions and localized alt-message contracts for every asset", () => {
    for (const asset of Object.values(allAssets)) {
      expect(asset.src).toMatch(/^\/images\//);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.altKey).toMatch(/^images\./);
      expect(messageAt(enMessages, asset.altKey)).toEqual(expect.any(String));
      expect(messageAt(idMessages, asset.altKey)).toEqual(expect.any(String));
    }
  });

  it("covers the home hero, every service, seed gallery category, and client marks", () => {
    expect(heroAssets.home.src).toMatch(/^\/images\/hero\//);
    expect(Object.keys(serviceAssets).sort()).toEqual([...serviceSlugs].sort());
    expect(Object.keys(seedProjectAssets).sort()).toEqual([...serviceSlugs].sort());
    expect(Object.keys(clientLogoAssets)).toHaveLength(8);
  });

  it("supplies each service record with its optimized local hero image", () => {
    for (const service of services) {
      expect(service.heroImage.src).toBe(serviceAssets[service.slug].src);
      expect(service.heroImage.width).toBe(serviceAssets[service.slug].width);
      expect(service.heroImage.height).toBe(serviceAssets[service.slug].height);
    }
  });
});
