import { nextConfig } from "../../next.config";

it("allows optimized Sanity CDN project images from the image asset path only", () => {
  expect(nextConfig.images?.remotePatterns).toContainEqual({
    protocol: "https",
    hostname: "cdn.sanity.io",
    port: "",
    pathname: "/images/**",
  });
});
