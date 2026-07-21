import { describe, expect, it } from "vitest";
import { createSeedContentCatalog } from "../content-catalog";
import { createAttempt } from "../create-attempt";
import { completeAttempt } from "../complete-attempt";
import { startDomainSession, upsertResponse, earlyFinishDomainSession } from "../domain-session";
import { createFixedClock } from "../testing/fixed-clock";
import { createInMemoryAttemptRepository } from "../testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "../testing/in-memory-sessions";
import { createInMemoryResultSnapshotRepository } from "../testing/in-memory-snapshots";
import { createInMemoryNormSampleRepository } from "../testing/in-memory-norm-samples";
import { createInMemoryIntegrityEventRepository } from "../testing/in-memory-integrity";
import type { AssessmentPorts } from "../ports";
import { createSkillAttempt } from "./create-skill-attempt";
import { completeSkillAttempt } from "./complete-skill-attempt";
import { abandonSkillAttempt } from "./abandon-skill-attempt";
import { upsertSkillResponse } from "./skill-session";
import {
  createInMemorySkillAttemptRepository,
  createInMemorySkillResponseRepository,
  createInMemorySkillSnapshotRepository,
} from "./testing/in-memory-skill";
import type { SkillPorts } from "./ports";
import { recommendFields } from "./field-recommendation";
import { getSkillPack } from "./content/skill_v1";

function buildPorts(): AssessmentPorts & SkillPorts {
  return {
    clock: createFixedClock("2026-07-20T10:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
    integrityEvents: createInMemoryIntegrityEventRepository(),
    skillAttempts: createInMemorySkillAttemptRepository(),
    skillResponses: createInMemorySkillResponseRepository(),
    skillSnapshots: createInMemorySkillSnapshotRepository(),
  };
}

async function completeCognitive(ports: AssessmentPorts & SkillPorts) {
  const attempt = await createAttempt(ports, {
    participant: { id: "p_skill", ageBand: "18_45" },
    track: "career",
  });
  const cv = await ports.content.getById(attempt.contentVersionId);
  if (!cv) throw new Error("no content");

  for (const domainId of cv.domainOrder) {
    const domain = cv.domains.find((d) => d.id === domainId)!;
    const session = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_skill",
      domainId,
    });
    for (const item of domain.items) {
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_skill",
        itemId: item.id,
        answer: item.correctKey,
      });
    }
    await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId: "p_skill",
    });
  }

  const { snapshot } = await completeAttempt(ports, {
    attemptId: attempt.id,
    participantId: "p_skill",
    ageBand: "18_45",
  });
  return { attempt, snapshot };
}

describe("Skill assessment flow", () => {
  it("recommends fields from profile and completes a skill pack", async () => {
    const ports = buildPorts();
    const { attempt, snapshot } = await completeCognitive(ports);

    const recs = recommendFields(snapshot.abilityProfile, snapshot.rulePayload, 3);
    expect(recs.length).toBe(3);

    const fieldId = "it_software";
    const skill = await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId,
    });
    expect(skill.status).toBe("in_progress");

    const pack = getSkillPack(fieldId)!;
    for (const item of pack.items) {
      await upsertSkillResponse(ports, {
        skillAttemptId: skill.id,
        participantId: "p_skill",
        itemId: item.id,
        answer: item.correctKey,
      });
    }

    const result = await completeSkillAttempt(ports, {
      skillAttemptId: skill.id,
      participantId: "p_skill",
    });
    expect(result.score).toBe(100);
    expect(result.rawCorrect).toBe(7);
    expect(result.fieldId).toBe("it_software");
    expect(result.domainAlignment.kind).toBeTruthy();
  });

  it("rejects skill attempt before cognitive complete", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p2", ageBand: "18_45" },
      track: "explore",
    });
    await expect(
      createSkillAttempt(ports, {
        participantId: "p2",
        sourceAttemptId: attempt.id,
        fieldId: "ui_ux",
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });
  });

  it("blocks second open skill until first is completed or abandoned", async () => {
    const ports = buildPorts();
    const { attempt } = await completeCognitive(ports);

    await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId: "it_software",
    });

    await expect(
      createSkillAttempt(ports, {
        participantId: "p_skill",
        sourceAttemptId: attempt.id,
        fieldId: "ui_ux",
      }),
    ).rejects.toMatchObject({ code: "OPEN_ATTEMPT_EXISTS" });
  });

  it("allows new field after abandon, and scores partial answers on complete", async () => {
    const ports = buildPorts();
    const { attempt } = await completeCognitive(ports);

    const open = await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId: "it_software",
    });

    await abandonSkillAttempt(ports, {
      skillAttemptId: open.id,
      participantId: "p_skill",
    });

    const next = await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId: "ui_ux",
    });
    expect(next.fieldId).toBe("ui_ux");

    // Answer only first item → partial score (blank = wrong)
    const pack = getSkillPack("ui_ux")!;
    await upsertSkillResponse(ports, {
      skillAttemptId: next.id,
      participantId: "p_skill",
      itemId: pack.items[0]!.id,
      answer: pack.items[0]!.correctKey,
    });

    const result = await completeSkillAttempt(ports, {
      skillAttemptId: next.id,
      participantId: "p_skill",
    });
    expect(result.rawCorrect).toBe(1);
    expect(result.rawTotal).toBe(7);
    expect(result.score).toBe(Math.round((1 / 7) * 100));
  });

  it("resumes same open skill field without creating a second row", async () => {
    const ports = buildPorts();
    const { attempt } = await completeCognitive(ports);

    const first = await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId: "data_analyst",
    });
    const second = await createSkillAttempt(ports, {
      participantId: "p_skill",
      sourceAttemptId: attempt.id,
      fieldId: "data_analyst",
    });
    expect(second.id).toBe(first.id);
  });
});
