/**
 * P2 E2E: createAttempt → finish 9 domains → completeAttempt (OpenRouter) → DB snapshot.
 * Then caller verifies /hasil via HTTP separately.
 *
 * Run with env from .env.local:
 *   npx vitest run src/domain/assessment/p2-e2e-hasil.smoke.test.ts
 */
import { createClient, type InsForgeClient } from "@insforge/sdk";
import { describe, expect, it } from "vitest";
import { completeAttempt } from "./complete-attempt";
import { createAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { V2_CONTENT_VERSION_ID } from "./content/v2";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
import { createHybridInsightNarrator } from "./insight-narrator";
import type { AssessmentPorts } from "./ports";
import type { Attempt } from "./types";
import type { DomainSession, Response } from "./session-types";
import type { ResultSnapshot } from "./result-types";
import type { NormSample } from "./norm-sample";
import type { IntegrityEvent } from "./integrity-types";
import { narrateInsightWithOpenRouter } from "@/lib/assessment/openrouter-insight-llm";
import { isOpenRouterConfigured } from "@/lib/assessment/openrouter-config";
import { writeFileSync } from "node:fs";
import path from "node:path";

/** Opt-in: OPENROUTER + InsForge env + RUN_P2_LIVE=1 (avoids accidental live API in npm test). */
const run =
  process.env.RUN_P2_LIVE === "1" &&
  isOpenRouterConfigured() &&
  Boolean(process.env.NEXT_PUBLIC_INSFORGE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY);

function mapAttempt(row: Record<string, unknown>): Attempt {
  return {
    id: String(row.id),
    participantId: String(row.participant_id),
    track: row.track as Attempt["track"],
    contentVersionId: String(row.content_version_id),
    status: row.status as Attempt["status"],
    startedAt: new Date(String(row.started_at)),
    completedAt: row.completed_at ? new Date(String(row.completed_at)) : null,
    abandonedAt: row.abandoned_at ? new Date(String(row.abandoned_at)) : null,
    isPrimary: Boolean(row.is_primary),
  };
}

function mapSession(row: Record<string, unknown>): DomainSession {
  return {
    id: String(row.id),
    attemptId: String(row.attempt_id),
    participantId: String(row.participant_id),
    domainId: String(row.domain_id),
    sequenceIndex: Number(row.sequence_index ?? 0),
    status: row.status as DomainSession["status"],
    startedAt: new Date(String(row.started_at)),
    endsAt: new Date(String(row.ends_at)),
    closedAt: row.closed_at ? new Date(String(row.closed_at)) : null,
    closeReason: (row.close_reason as DomainSession["closeReason"]) ?? null,
    rawCorrect:
      row.raw_correct === null || row.raw_correct === undefined
        ? null
        : Number(row.raw_correct),
    rawTotal:
      row.raw_total === null || row.raw_total === undefined
        ? null
        : Number(row.raw_total),
  };
}

function mapResponse(row: Record<string, unknown>): Response {
  return {
    id: String(row.id),
    domainSessionId: String(row.domain_session_id),
    attemptId: String(row.attempt_id),
    participantId: String(row.participant_id),
    itemId: String(row.item_id),
    answer: String(row.answer),
    updatedAt: new Date(String(row.updated_at)),
  };
}

function mapSnapshot(row: Record<string, unknown>): ResultSnapshot {
  return {
    id: String(row.id),
    attemptId: String(row.attempt_id),
    participantId: String(row.participant_id),
    track: row.track as ResultSnapshot["track"],
    contentVersionId: String(row.content_version_id),
    normVersion: String(row.norm_version),
    frozenAt: new Date(String(row.frozen_at)),
    abilityProfile: row.ability_profile as ResultSnapshot["abilityProfile"],
    compositeIndex: Number(row.composite_index),
    iqEstimate: Number(row.iq_estimate),
    rulePayload: (row.rule_payload as ResultSnapshot["rulePayload"]) ?? null,
    insightProse: (row.insight_prose as string | null) ?? null,
    actionPlanProse: (row.action_plan_prose as string | null) ?? null,
    pdfUrl: (row.pdf_url as string | null) ?? null,
    pdfKey: (row.pdf_key as string | null) ?? null,
  };
}

function buildPorts(client: InsForgeClient): AssessmentPorts {
  const db = client.database;
  return {
    clock: { now: () => new Date() },
    content: createSeedContentCatalog(),
    insightNarrator: createHybridInsightNarrator({
      narrate: narrateInsightWithOpenRouter,
    }),
    attempts: {
      async findOpenByParticipant(participantId) {
        const { data, error } = await db
          .from("attempts")
          .select("*")
          .eq("participant_id", participantId)
          .eq("status", "in_progress")
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapAttempt(rows[0]) : null;
      },
      async findById(id) {
        const { data, error } = await db
          .from("attempts")
          .select("*")
          .eq("id", id)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapAttempt(rows[0]) : null;
      },
      async save(attempt) {
        const row = {
          id: attempt.id,
          participant_id: attempt.participantId,
          track: attempt.track,
          content_version_id: attempt.contentVersionId,
          status: attempt.status,
          started_at: attempt.startedAt.toISOString(),
          completed_at: attempt.completedAt?.toISOString() ?? null,
          abandoned_at: attempt.abandonedAt?.toISOString() ?? null,
          is_primary: attempt.isPrimary,
        };
        const { error } = await db.from("attempts").upsert([row]);
        if (error) throw new Error(error.message);
      },
      async listCompletedByParticipant(participantId) {
        const { data, error } = await db
          .from("attempts")
          .select("*")
          .eq("participant_id", participantId)
          .eq("status", "completed");
        if (error) throw new Error(error.message);
        return ((data ?? []) as Record<string, unknown>[]).map(mapAttempt);
      },
      async listAllByParticipant(participantId) {
        const { data, error } = await db
          .from("attempts")
          .select("*")
          .eq("participant_id", participantId);
        if (error) throw new Error(error.message);
        return ((data ?? []) as Record<string, unknown>[]).map(mapAttempt);
      },
      async deleteAllByParticipant(participantId) {
        const all = await this.listAllByParticipant(participantId);
        if (all.length === 0) return [];
        const { error } = await db
          .from("attempts")
          .delete()
          .eq("participant_id", participantId);
        if (error) throw new Error(error.message);
        return all.map((a) => a.id);
      },
    },
    domainSessions: {
      async findById(id) {
        const { data, error } = await db
          .from("domain_sessions")
          .select("*")
          .eq("id", id)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapSession(rows[0]) : null;
      },
      async findByAttemptAndDomain(attemptId, domainId) {
        const { data, error } = await db
          .from("domain_sessions")
          .select("*")
          .eq("attempt_id", attemptId)
          .eq("domain_id", domainId)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapSession(rows[0]) : null;
      },
      async listByAttempt(attemptId) {
        const { data, error } = await db
          .from("domain_sessions")
          .select("*")
          .eq("attempt_id", attemptId);
        if (error) throw new Error(error.message);
        return ((data ?? []) as Record<string, unknown>[]).map(mapSession);
      },
      async save(session) {
        const row = {
          id: session.id,
          attempt_id: session.attemptId,
          participant_id: session.participantId,
          domain_id: session.domainId,
          sequence_index: session.sequenceIndex,
          status: session.status,
          started_at: session.startedAt.toISOString(),
          ends_at: session.endsAt.toISOString(),
          closed_at: session.closedAt?.toISOString() ?? null,
          close_reason: session.closeReason,
          raw_correct: session.rawCorrect,
          raw_total: session.rawTotal,
        };
        const { error } = await db.from("domain_sessions").upsert([row]);
        if (error) throw new Error(error.message);
      },
      async deleteByAttemptIds() {
        /* cascade */
      },
    },
    responses: {
      async listBySession(sessionId) {
        const { data, error } = await db
          .from("responses")
          .select("*")
          .eq("domain_session_id", sessionId);
        if (error) throw new Error(error.message);
        return ((data ?? []) as Record<string, unknown>[]).map(mapResponse);
      },
      async findBySessionAndItem(sessionId, itemId) {
        const { data, error } = await db
          .from("responses")
          .select("*")
          .eq("domain_session_id", sessionId)
          .eq("item_id", itemId)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapResponse(rows[0]) : null;
      },
      async upsert(response) {
        const row = {
          id: response.id,
          domain_session_id: response.domainSessionId,
          attempt_id: response.attemptId,
          participant_id: response.participantId,
          item_id: response.itemId,
          answer: response.answer,
          updated_at: response.updatedAt.toISOString(),
        };
        const { error } = await db.from("responses").upsert([row]);
        if (error) throw new Error(error.message);
      },
      async deleteByAttemptIds() {
        /* cascade */
      },
    },
    resultSnapshots: {
      async findByAttemptId(attemptId) {
        const { data, error } = await db
          .from("result_snapshots")
          .select("*")
          .eq("attempt_id", attemptId)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapSnapshot(rows[0]) : null;
      },
      async findById(id) {
        const { data, error } = await db
          .from("result_snapshots")
          .select("*")
          .eq("id", id)
          .limit(1);
        if (error) throw new Error(error.message);
        const rows = (data ?? []) as Record<string, unknown>[];
        return rows[0] ? mapSnapshot(rows[0]) : null;
      },
      async save(snapshot) {
        const row = {
          id: snapshot.id,
          attempt_id: snapshot.attemptId,
          participant_id: snapshot.participantId,
          track: snapshot.track,
          content_version_id: snapshot.contentVersionId,
          norm_version: snapshot.normVersion,
          frozen_at: snapshot.frozenAt.toISOString(),
          ability_profile: snapshot.abilityProfile,
          composite_index: snapshot.compositeIndex,
          iq_estimate: snapshot.iqEstimate,
          rule_payload: snapshot.rulePayload,
          insight_prose: snapshot.insightProse,
          action_plan_prose: snapshot.actionPlanProse,
          pdf_url: snapshot.pdfUrl ?? null,
          pdf_key: snapshot.pdfKey ?? null,
        };
        const { error } = await db.from("result_snapshots").upsert([row]);
        if (error) throw new Error(error.message);
      },
      async deleteByAttemptIds() {
        /* cascade */
      },
    },
    normSamples: {
      async save(sample: NormSample) {
        const row = {
          id: sample.id,
          age_band: sample.ageBand,
          age_bucket: sample.ageBucket,
          content_version_id: sample.contentVersionId,
          norm_version: sample.normVersion,
          track: sample.track,
          ability_profile: sample.abilityProfile,
          composite_index: sample.compositeIndex,
          iq_estimate: sample.iqEstimate,
          primary_completed_at: sample.primaryCompletedAt.toISOString(),
        };
        const { error } = await db.from("norm_samples").insert([row]);
        // Norm sample insert may fail RLS (insert-only policy) — soft-fail smoke
        if (error) {
          console.warn("norm_sample save skipped:", error.message);
        }
      },
    },
    integrityEvents: {
      async save(_event: IntegrityEvent) {
        /* unused */
      },
      async listByAttempt() {
        return [];
      },
      async deleteAllByParticipant() {
        /* unused */
      },
    },
  };
}

describe.skipIf(!run)("P2 E2E complete + snapshot", () => {
  it(
    "completeAttempt with real InsForge + OpenRouter freezes LLM insight",
    { timeout: 180_000 },
    async () => {
      const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!.replace(/\/$/, "");
      const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;
      const email = `p2e2e+${Date.now()}@iq-lab.test`;
      const password = "SmokeTest1!";

      const client = createClient({ baseUrl, anonKey });
      const { data: signed, error: signErr } = await client.auth.signUp({
        email,
        password,
        name: "P2 E2E",
      });
      expect(signErr).toBeNull();
      const accessToken =
        signed && "accessToken" in signed
          ? String((signed as { accessToken?: string }).accessToken ?? "")
          : "";
      if (!accessToken) {
        const { data: session, error: se } =
          await client.auth.signInWithPassword({ email, password });
        expect(se).toBeNull();
        expect(session?.accessToken).toBeTruthy();
      }

      const { data: userData } = await client.auth.getCurrentUser();
      const userId = userData?.user?.id;
      expect(userId).toBeTruthy();

      const { error: profileErr } = await client.auth.setProfile({
        age_band: "18_45",
        name: "P2 E2E",
      });
      expect(profileErr).toBeNull();

      const ports = buildPorts(client);
      const attempt = await createAttempt(ports, {
        participant: { id: userId!, ageBand: "18_45" },
        track: "explore",
      });

      const cv = await ports.content.getById(V2_CONTENT_VERSION_ID);
      expect(cv).toBeTruthy();

      for (const domainId of cv!.domainOrder) {
        const session = await startDomainSession(ports, {
          attemptId: attempt.id,
          participantId: userId!,
          domainId,
        });
        const domain = cv!.domains.find((d) => d.id === domainId)!;
        for (let i = 0; i < domain.items.length; i++) {
          const item = domain.items[i];
          const answer =
            i < 5
              ? item.correctKey
              : item.correctKey === "a"
                ? "b"
                : "a";
          await upsertResponse(ports, {
            sessionId: session.id,
            participantId: userId!,
            itemId: item.id,
            answer,
          });
        }
        await earlyFinishDomainSession(ports, {
          sessionId: session.id,
          participantId: userId!,
        });
      }

      const { snapshot } = await completeAttempt(ports, {
        attemptId: attempt.id,
        participantId: userId!,
        ageBand: "18_45",
      });

      expect(snapshot.insightProse?.trim().length).toBeGreaterThan(20);
      expect(snapshot.actionPlanProse?.trim().length).toBeGreaterThan(20);
      expect(snapshot.rulePayload?.clusters?.length).toBeGreaterThan(0);

      const out = {
        email,
        password,
        userId,
        attemptId: attempt.id,
        snapshotId: snapshot.id,
        compositeIndex: snapshot.compositeIndex,
        iqEstimate: snapshot.iqEstimate,
        insightPreview: snapshot.insightProse!.slice(0, 200),
        actionPreview: snapshot.actionPlanProse!.slice(0, 200),
        clusterCount: snapshot.rulePayload?.clusters.length ?? 0,
        model: process.env.OPENROUTER_CHAT_MODEL ?? "openai/gpt-4o-mini",
      };
      console.log(JSON.stringify({ p2e2e: true, ...out }));
      writeFileSync(
        path.resolve(".scratch/post-mvp-followups/p2-e2e-result.json"),
        JSON.stringify(out, null, 2),
        "utf8",
      );
    },
  );
});
