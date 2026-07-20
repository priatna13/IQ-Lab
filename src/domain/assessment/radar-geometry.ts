/**
 * Pure polar geometry for Ability Profile radar (DESIGN.md R3).
 * 0° = top, clockwise; score 0–100 mapped to radius.
 */

export type RadarPoint = {
  domainId: string;
  label: string;
  shortLabel: string;
  score: number;
  x: number;
  y: number;
  angle: number;
};

export type RadarGeometry = {
  cx: number;
  cy: number;
  maxR: number;
  rings: number[];
  points: RadarPoint[];
  polygonPath: string;
  axes: Array<{ x1: number; y1: number; x2: number; y2: number }>;
};

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

/** Angle in radians: start at top (−π/2), equal steps clockwise. */
export function axisAngle(index: number, count: number): number {
  if (count <= 0) return 0;
  return -Math.PI / 2 + (index * 2 * Math.PI) / count;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function buildRadarGeometry(
  entries: Array<{
    domainId: string;
    label: string;
    shortLabel: string;
    score: number;
  }>,
  options?: { size?: number; padding?: number; ringCount?: number },
): RadarGeometry {
  const size = options?.size ?? 280;
  const padding = options?.padding ?? 36;
  const ringCount = options?.ringCount ?? 4;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - padding;
  const n = entries.length;

  const rings = Array.from({ length: ringCount }, (_, i) =>
    ((i + 1) / ringCount) * maxR,
  );

  const points: RadarPoint[] = entries.map((e, i) => {
    const angle = axisAngle(i, n);
    const r = (clampScore(e.score) / 100) * maxR;
    const { x, y } = polarToCartesian(cx, cy, r, angle);
    return {
      domainId: e.domainId,
      label: e.label,
      shortLabel: e.shortLabel,
      score: clampScore(e.score),
      x,
      y,
      angle,
    };
  });

  const polygonPath =
    points.length === 0
      ? ""
      : points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(" ") + " Z";

  const axes = entries.map((_, i) => {
    const angle = axisAngle(i, n);
    const end = polarToCartesian(cx, cy, maxR, angle);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  return { cx, cy, maxR, rings, points, polygonPath, axes };
}

/** Ring polygon path at a given radius (for grid). */
export function ringPolygonPath(
  cx: number,
  cy: number,
  radius: number,
  axisCount: number,
): string {
  if (axisCount <= 0) return "";
  const pts = Array.from({ length: axisCount }, (_, i) => {
    const a = axisAngle(i, axisCount);
    return polarToCartesian(cx, cy, radius, a);
  });
  return (
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ") + " Z"
  );
}
