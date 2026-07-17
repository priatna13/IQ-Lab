import { describe, expect, it } from "vitest";
import { evaluateAgeBand, parseAgeBand } from "./age-band";

describe("evaluateAgeBand", () => {
  it("blocks under_18", () => {
    expect(evaluateAgeBand("under_18")).toEqual({
      status: "blocked",
      reason: "under_18",
    });
  });

  it("allows 18_45 without 46+ disclaimer", () => {
    expect(evaluateAgeBand("18_45")).toEqual({
      status: "allowed",
      ageBand: "18_45",
      disclaimer46Plus: false,
    });
  });

  it("allows 46_plus with disclaimer flag", () => {
    expect(evaluateAgeBand("46_plus")).toEqual({
      status: "allowed_with_disclaimer",
      ageBand: "46_plus",
      disclaimer46Plus: true,
    });
  });
});

describe("parseAgeBand", () => {
  it("parses known values and rejects unknown", () => {
    expect(parseAgeBand("18_45")).toBe("18_45");
    expect(parseAgeBand("nope")).toBeNull();
  });
});
