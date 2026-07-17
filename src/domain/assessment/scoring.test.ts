import { describe, expect, it } from "vitest";
import {
  compositeIndexFromDomainScores,
  domainScoreFromRaw,
  iqEstimateFromComposite,
} from "./scoring";

describe("synthetic scoring", () => {
  it("maps raw proportion to 1–100 Domain Score", () => {
    expect(domainScoreFromRaw(0, 8)).toBe(1);
    expect(domainScoreFromRaw(4, 8)).toBe(50);
    expect(domainScoreFromRaw(8, 8)).toBe(100);
  });

  it("computes composite as mean", () => {
    expect(compositeIndexFromDomainScores([40, 60, 50])).toBe(50);
  });

  it("maps composite to IQ Estimate around 100", () => {
    expect(iqEstimateFromComposite(50)).toBe(100);
    expect(iqEstimateFromComposite(65)).toBe(115);
  });
});
