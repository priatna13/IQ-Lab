import { describe, expect, it } from "vitest";
import { FIELD_DEFS } from "../../field-catalog";
import { getSkillV1ContentVersion } from "./index";
import { SKILL_PACKS } from "./packs";

describe("Skill packs v1", () => {
  it("has a pack for every field with 7 items", () => {
    for (const def of FIELD_DEFS) {
      const pack = SKILL_PACKS[def.id];
      expect(pack, def.id).toBeDefined();
      expect(pack.items).toHaveLength(7);
      for (const item of pack.items) {
        expect(["a", "b", "c", "d"]).toContain(item.correctKey);
        expect(item.choices).toHaveLength(4);
      }
    }
  });

  it("content version lists all packs", () => {
    const cv = getSkillV1ContentVersion();
    expect(cv.id).toBe("skill_v1");
    expect(Object.keys(cv.packs)).toHaveLength(FIELD_DEFS.length);
  });
});
