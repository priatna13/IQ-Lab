import type { Attempt } from "./types";

/** One completion per 90 days (ADR 0006 / ticket 09). */
export const RETAKE_COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Latest Completed Attempt drives cooldown. Abandoned never counts.
 */
export function getLatestCompletedAttempt(
  completed: Attempt[],
): Attempt | null {
  const withDate = completed.filter(
    (a) => a.status === "completed" && a.completedAt !== null,
  );
  if (withDate.length === 0) return null;
  return withDate.sort(
    (a, b) => b.completedAt!.getTime() - a.completedAt!.getTime(),
  )[0];
}

/**
 * Returns cooldown end instant if still active at `now`, otherwise null.
 */
export function getRetakeCooldownUntil(
  completed: Attempt[],
  now: Date,
  windowMs: number = RETAKE_COOLDOWN_MS,
): Date | null {
  const latest = getLatestCompletedAttempt(completed);
  if (!latest?.completedAt) return null;
  const until = new Date(latest.completedAt.getTime() + windowMs);
  if (now.getTime() < until.getTime()) return until;
  return null;
}

export function isRetakeCooldownActive(
  completed: Attempt[],
  now: Date,
  windowMs: number = RETAKE_COOLDOWN_MS,
): boolean {
  return getRetakeCooldownUntil(completed, now, windowMs) !== null;
}
