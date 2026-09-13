import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";

function assertSameMessageStructure(
  expected: unknown,
  actual: unknown,
  path = "messages",
): void {
  const expectedIsArray = Array.isArray(expected);
  const actualIsArray = Array.isArray(actual);

  if (expectedIsArray || actualIsArray) {
    if (!expectedIsArray || !actualIsArray) {
      throw new Error(`${path} has different container types`);
    }

    if (expected.length !== actual.length) {
      throw new Error(`${path} has different array lengths`);
    }

    expected.forEach((item, index) => {
      assertSameMessageStructure(item, actual[index], `${path}[${index}]`);
    });

    return;
  }

  const expectedIsObject = typeof expected === "object" && expected !== null;
  const actualIsObject = typeof actual === "object" && actual !== null;

  if (expectedIsObject || actualIsObject) {
    if (!expectedIsObject || !actualIsObject) {
      throw new Error(`${path} has different container types`);
    }

    const expectedEntries = Object.entries(expected);
    const actualRecord = actual as Record<string, unknown>;
    const actualEntries = Object.entries(actualRecord);

    if (expectedEntries.length !== actualEntries.length) {
      throw new Error(`${path} has different object keys`);
    }

    expectedEntries.forEach(([key, value]) => {
      if (!(key in actualRecord)) {
        throw new Error(`${path}.${key} is missing`);
      }

      assertSameMessageStructure(value, actualRecord[key], `${path}.${key}`);
    });

    return;
  }

  if (typeof expected !== typeof actual) {
    throw new Error(`${path} has different value types`);
  }
}

describe("bilingual messages", () => {
  it("keeps the English and Bahasa message structures aligned", () => {
    expect(() => assertSameMessageStructure(enMessages, idMessages)).not.toThrow();
  });

  it("detects array and container mismatches at their nested paths", () => {
    expect(() => assertSameMessageStructure(
      { sections: [{ heading: "One" }] },
      { sections: [{ heading: "Satu" }, { heading: "Dua" }] },
    )).toThrow("messages.sections has different array lengths");

    expect(() => assertSameMessageStructure(
      { sections: ["One"] },
      { sections: { heading: "Satu" } },
    )).toThrow("messages.sections has different container types");
  });
});
