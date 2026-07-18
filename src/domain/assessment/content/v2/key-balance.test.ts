import { describe, expect, it } from "vitest";
import { getV2ContentVersion } from "./index";

describe("Item Bank v2 — key review invariants", () => {
  const v2 = getV2ContentVersion();

  it("each domain has exactly 8 items and valid keys", () => {
    for (const domain of v2.domains) {
      expect(domain.items).toHaveLength(8);
      for (const item of domain.items) {
        expect(["a", "b", "c", "d"]).toContain(item.correctKey);
        expect(item.choices.map((c) => c.id)).toEqual(["a", "b", "c", "d"]);
        expect(item.choices.every((c) => c.label.trim().length > 0)).toBe(true);
        expect(item.prompt).not.toMatch(/Soal latihan MVP/);
      }
    }
  });

  it("balances correctKey positions per domain (2 each a/b/c/d)", () => {
    for (const domain of v2.domains) {
      const counts = { a: 0, b: 0, c: 0, d: 0 };
      for (const item of domain.items) {
        counts[item.correctKey as keyof typeof counts] += 1;
      }
      expect(counts, domain.id).toEqual({ a: 2, b: 2, c: 2, d: 2 });
    }
  });

  it("never places all correct answers on the same choice id across a domain", () => {
    for (const domain of v2.domains) {
      const keys = new Set(domain.items.map((i) => i.correctKey));
      expect(keys.size, domain.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("numeric domains have unique correct labels among choices", () => {
    for (const domain of v2.domains.filter((d) =>
      d.id.startsWith("numerik"),
    )) {
      for (const item of domain.items) {
        const labels = item.choices.map((c) => c.label);
        expect(new Set(labels).size).toBe(4);
      }
    }
  });
});
