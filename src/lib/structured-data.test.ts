import { buildOrganizationJsonLd, buildServiceJsonLd } from "@/lib/structured-data";

describe("structured data", () => {
  it("publishes only approved organization and local business facts", () => {
    const data = buildOrganizationJsonLd("en");
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      name: "PT SUGEE",
      url: "https://ptsugee.com",
      email: "sathish@ptsugee.com",
      telephone: "+65 9100 4649",
      foundingDate: "2000",
      address: {
        "@type": "PostalAddress",
        streetAddress: "K-15, Tunas Regency, Tanjung Uncang",
        addressLocality: "Batam",
        addressCountry: "ID",
      },
    });
    const serialized = JSON.stringify(data);
    expect(serialized).not.toContain("164 Tuas South Ave 2");
    expect(serialized).not.toMatch(/aggregateRating|review|certification/i);
  });

  it("publishes localized Service data tied to PT SUGEE", () => {
    const data = buildServiceJsonLd("id", "laser-alignment-service");
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Layanan Laser Alignment",
      url: "https://ptsugee.com/id/laser-alignment-service",
      provider: { "@type": "Organization", name: "PT SUGEE", url: "https://ptsugee.com" },
    });
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|review|certification/i);
  });
});
