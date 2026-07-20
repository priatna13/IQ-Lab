import type { Item } from "../content-types";
import type { AttemptId, ParticipantId } from "../types";

export type FieldCategoryId =
  | "teknologi_produk"
  | "bisnis_keuangan"
  | "pemasaran_kreatif"
  | "orang_layanan"
  | "legal";

export type FieldId =
  | "it_software"
  | "data_analyst"
  | "ui_ux"
  | "project_product"
  | "finance_accounting"
  | "sales_bd"
  | "operations"
  | "digital_marketing"
  | "content_creator"
  | "graphic_design"
  | "hr"
  | "coach"
  | "educator"
  | "customer_service"
  | "legal";

export type SkillContentVersionId = string;
export type SkillAttemptId = string;

export type SkillAttemptStatus = "in_progress" | "completed" | "abandoned";

export type FieldCategoryDef = {
  id: FieldCategoryId;
  label: string;
  shortBlurb: string;
};

export type FieldDef = {
  id: FieldId;
  categoryId: FieldCategoryId;
  label: string;
  shortBlurb: string;
  /** Cognitive domain ids most relevant to this role (from skill MD). */
  relevantDomains: string[];
};

export type SkillPack = {
  fieldId: FieldId;
  label: string;
  instruction: string;
  timeLimitSeconds: number;
  items: Item[];
};

export type SkillContentVersion = {
  id: SkillContentVersionId;
  label: string;
  packs: Record<FieldId, SkillPack>;
};

export type SkillAttempt = {
  id: SkillAttemptId;
  participantId: ParticipantId;
  sourceAttemptId: AttemptId;
  fieldId: FieldId;
  skillContentVersionId: SkillContentVersionId;
  status: SkillAttemptStatus;
  startedAt: Date;
  completedAt: Date | null;
  endsAt: Date;
};

export type SkillResponse = {
  id: string;
  skillAttemptId: SkillAttemptId;
  itemId: string;
  answer: string;
  updatedAt: Date;
};

export type DomainAlignmentKind =
  | "selaras"
  | "potensi_belum_terampil"
  | "pengalaman_mengompensasi"
  | "perlu_penguatan_ganda";

export type DomainAlignment = {
  kind: DomainAlignmentKind;
  relevantDomainAvg: number;
  skillScore: number;
  summary: string;
};

export type SkillResultSnapshot = {
  id: string;
  skillAttemptId: SkillAttemptId;
  participantId: ParticipantId;
  sourceAttemptId: AttemptId;
  fieldId: FieldId;
  fieldLabel: string;
  categoryId: FieldCategoryId;
  categoryLabel: string;
  skillContentVersionId: SkillContentVersionId;
  rawCorrect: number;
  rawTotal: number;
  score: number;
  domainAlignment: DomainAlignment;
  insightProse: string;
  frozenAt: Date;
};

export type PublicSkillRunnerView = {
  skillAttemptId: SkillAttemptId;
  sourceAttemptId: AttemptId;
  fieldId: FieldId;
  fieldLabel: string;
  categoryLabel: string;
  instruction: string;
  timeLimitSeconds: number;
  endsAt: string;
  graceEndsAt: string;
  serverNow: string;
  status: SkillAttemptStatus;
  items: Array<{ id: string; prompt: string; choices: Array<{ id: string; label: string }> }>;
  responses: Record<string, string>;
  answeredCount: number;
  itemCount: number;
};

export type PublicSkillResult = {
  skillAttemptId: SkillAttemptId;
  sourceAttemptId: AttemptId;
  fieldId: FieldId;
  fieldLabel: string;
  categoryId: FieldCategoryId;
  categoryLabel: string;
  score: number;
  rawCorrect: number;
  rawTotal: number;
  domainAlignment: DomainAlignment;
  insightProse: string;
  frozenAt: string;
  disclaimer: string;
};
