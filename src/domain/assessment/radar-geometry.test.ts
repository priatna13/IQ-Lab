import { describe, expect, it } from "vitest";
import {
  axisAngle,
  buildRadarGeometry,
  polarToCartesian,
  ringPolygonPath,
} from "./radar-geometry";

describe("radar-geometry", () => {
  it("places first axis at top (negative Y)", () => {
    const a = axisAngle(0, 4);
    const p = polarToCartesian(100, 100, 50, a);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(50, 5);
  });

  it("builds 9-point polygon with clamped scores", () => {
    const entries = Array.from({ length: 9 }, (_, i) => ({
      domainId: `d${i}`,
      label: `Domain ${i}`,
      shortLabel: `D${i}`,
      score: i === 0 ? 150 : i === 1 ? -10 : i * 10,
    }));
    const g = buildRadarGeometry(entries, { size: 200, padding: 20 });
    expect(g.points).toHaveLength(9);
    expect(g.points[0].score).toBe(100);
    expect(g.points[1].score).toBe(0);
    expect(g.polygonPath.startsWith("M")).toBe(true);
    expect(g.polygonPath.endsWith("Z")).toBe(true);
    expect(g.rings).toHaveLength(4);
    expect(g.axes).toHaveLength(9);
  });

  it("ring polygon closes", () => {
    const path = ringPolygonPath(50, 50, 40, 6);
    expect(path.endsWith("Z")).toBe(true);
  });
});
