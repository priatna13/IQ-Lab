/**
 * Client-side helpers for Domain Runner autosave.
 *
 * Pilot bug (2026-07-20): full server refresh after every save wiped optimistic
 * answers for other items still in-flight — pilots re-answered ~2× and felt lag
 * (save RTT + refresh RTT).
 */

export type ResponseMap = Record<string, string>;

/** Apply one optimistic answer and recompute progress fields. */
export function applyOptimisticAnswer(
  totalItems: number,
  responses: ResponseMap,
  itemId: string,
  answer: string,
): { responses: ResponseMap; answeredCount: number; canEarlyFinish: boolean } {
  const next = { ...responses, [itemId]: answer };
  const answeredCount = Object.keys(next).length;
  return {
    responses: next,
    answeredCount,
    canEarlyFinish: answeredCount === totalItems,
  };
}

/**
 * After an error (or forced refresh), merge server responses with answers that
 * are still the "latest intended" for in-flight items so we never drop a
 * newer local choice that the server has not confirmed yet.
 */
export function mergeServerResponsesWithPending(
  serverResponses: ResponseMap,
  latestIntended: ResponseMap,
  inFlightItemIds: ReadonlySet<string>,
): ResponseMap {
  const merged: ResponseMap = { ...serverResponses };
  for (const itemId of inFlightItemIds) {
    const intended = latestIntended[itemId];
    if (intended !== undefined) {
      merged[itemId] = intended;
    }
  }
  return merged;
}

/**
 * Whether a completed save for (itemId, answer) is still authoritative.
 * Stale if the user already picked a different answer for that item.
 */
export function isSaveStillCurrent(
  latestIntended: ResponseMap,
  itemId: string,
  answer: string,
): boolean {
  return latestIntended[itemId] === answer;
}
