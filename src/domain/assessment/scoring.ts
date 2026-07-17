/** Synthetic Norm Version v1 — temporary internal norms (ADR 0004). */
export const NORM_VERSION_SYNTHETIC_V1 = "norm_synthetic_v1";

/**
 * Domain Score on 1–100 scale from raw correct/total.
 * Empty domain (total 0) → 50 neutral.
 */
export function domainScoreFromRaw(rawCorrect: number, rawTotal: number): number {
  if (rawTotal <= 0) return 50;
  const p = Math.max(0, Math.min(1, rawCorrect / rawTotal));
  return Math.max(1, Math.min(100, Math.round(p * 100)));
}

/** Composite Index = mean of Domain Scores (rounded). */
export function compositeIndexFromDomainScores(scores: number[]): number {
  if (scores.length === 0) return 50;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.max(1, Math.min(100, Math.round(sum / scores.length)));
}

/**
 * IQ Estimate: map Composite (mean ~50) to mean 100 scale.
 * Temporary synthetic transform — not population-normed.
 */
export function iqEstimateFromComposite(compositeIndex: number): number {
  const iq = 100 + (compositeIndex - 50);
  return Math.max(55, Math.min(145, Math.round(iq)));
}
