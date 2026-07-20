import type { AttemptId, ParticipantId } from "../types";
import type {
  SkillAttempt,
  SkillAttemptId,
  SkillResponse,
  SkillResultSnapshot,
} from "./types";

export type SkillAttemptRepository = {
  findById(id: SkillAttemptId): Promise<SkillAttempt | null>;
  findOpenByParticipant(participantId: ParticipantId): Promise<SkillAttempt | null>;
  findCompletedBySourceAndField(
    sourceAttemptId: AttemptId,
    fieldId: string,
  ): Promise<SkillAttempt | null>;
  listBySourceAttempt(sourceAttemptId: AttemptId): Promise<SkillAttempt[]>;
  listByParticipant(participantId: ParticipantId): Promise<SkillAttempt[]>;
  save(attempt: SkillAttempt): Promise<void>;
};

export type SkillResponseRepository = {
  listBySkillAttempt(skillAttemptId: SkillAttemptId): Promise<SkillResponse[]>;
  upsert(response: SkillResponse): Promise<void>;
};

export type SkillResultSnapshotRepository = {
  findBySkillAttemptId(
    skillAttemptId: SkillAttemptId,
  ): Promise<SkillResultSnapshot | null>;
  listBySourceAttempt(sourceAttemptId: AttemptId): Promise<SkillResultSnapshot[]>;
  save(snapshot: SkillResultSnapshot): Promise<void>;
};

export type SkillPorts = {
  skillAttempts: SkillAttemptRepository;
  skillResponses: SkillResponseRepository;
  skillSnapshots: SkillResultSnapshotRepository;
};
