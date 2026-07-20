import type { FieldId, SkillContentVersion, SkillPack } from "../../types";
import { SKILL_PACKS } from "./packs";

export const SKILL_V1_CONTENT_VERSION_ID = "skill_v1";
export const CURRENT_SKILL_CONTENT_VERSION_ID = SKILL_V1_CONTENT_VERSION_ID;

export function getSkillV1ContentVersion(): SkillContentVersion {
  return {
    id: SKILL_V1_CONTENT_VERSION_ID,
    label: "IQ-Lab Keahlian Bidang v1",
    packs: { ...SKILL_PACKS },
  };
}

export function getSkillPack(
  fieldId: FieldId,
  versionId: string = CURRENT_SKILL_CONTENT_VERSION_ID,
): SkillPack | null {
  if (versionId !== SKILL_V1_CONTENT_VERSION_ID) return null;
  return SKILL_PACKS[fieldId] ?? null;
}
