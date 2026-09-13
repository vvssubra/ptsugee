import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe("bilingual messages", () => {
  it("keeps the English and Bahasa message structures aligned", () => {
    expect(flattenKeys(enMessages).sort()).toEqual(flattenKeys(idMessages).sort());
  });
});
