import { describe, expect, it } from "vitest";
import { getV3ContentVersion } from "./index";

describe("Item Bank v3 — key review invariants", () => {
  const v3 = getV3ContentVersion();

  it("each domain has exactly 8 items and valid keys", () => {
    for (const domain of v3.domains) {
      expect(domain.items).toHaveLength(8);
      for (const item of domain.items) {
        expect(["a", "b", "c", "d"]).toContain(item.correctKey);
        expect(item.choices.map((c) => c.id)).toEqual(["a", "b", "c", "d"]);
        expect(item.choices.every((c) => c.label.trim().length > 0)).toBe(true);
      }
    }
  });

  it("balances correctKey positions per domain (2 each a/b/c/d)", () => {
    for (const domain of v3.domains) {
      const counts = { a: 0, b: 0, c: 0, d: 0 };
      for (const item of domain.items) {
        counts[item.correctKey as keyof typeof counts] += 1;
      }
      expect(counts, domain.id).toEqual({ a: 2, b: 2, c: 2, d: 2 });
    }
  });

  it("uses content version id cv_mvp_v3", () => {
    expect(v3.id).toBe("cv_mvp_v3");
    expect(v3.published).toBe(true);
    expect(v3.domainOrder).toHaveLength(9);
  });
});
