import type { AbilityProfile } from "@/domain/assessment";
import {
  buildRadarGeometry,
  ringPolygonPath,
} from "@/domain/assessment/radar-geometry";
import { getDomainVisual } from "@/domain/assessment/domain-visual";

type Props = {
  profile: AbilityProfile;
  /** Decorative size in viewBox units */
  size?: number;
  className?: string;
};

/**
 * Ability Profile radar — visual companion to bars (DESIGN.md R3).
 * Not the sole data source: keep list/bars for a11y.
 */
export function AbilityRadar({ profile, size = 300, className = "" }: Props) {
  const entries = profile.map((e) => {
    const v = getDomainVisual(e.domainId);
    return {
      domainId: e.domainId,
      label: e.label,
      shortLabel: v.shortLabel,
      score: e.score,
    };
  });

  const g = buildRadarGeometry(entries, { size, padding: 42, ringCount: 4 });
  const summary = entries
    .map((e) => `${e.shortLabel} ${e.score}`)
    .join(", ");

  return (
    <div className={`mx-auto w-full max-w-[320px] ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="lab-radar h-auto w-full"
        role="img"
        aria-label={`Diagram radar profil kemampuan: ${summary}`}
      >
        {/* Grid rings */}
        {g.rings.map((r) => (
          <path
            key={r}
            d={ringPolygonPath(g.cx, g.cy, r, entries.length)}
            fill="none"
            stroke="rgb(226 232 240)"
            strokeWidth="1"
          />
        ))}
        {/* Axes */}
        {g.axes.map((ax, i) => (
          <line
            key={i}
            x1={ax.x1}
            y1={ax.y1}
            x2={ax.x2}
            y2={ax.y2}
            stroke="rgb(226 232 240)"
            strokeWidth="1"
          />
        ))}
        {/* Data polygon */}
        {g.polygonPath ? (
          <path
            d={g.polygonPath}
            fill="rgba(13, 148, 136, 0.18)"
            stroke="#0f766e"
            strokeWidth="2"
            strokeLinejoin="round"
            className="lab-radar-poly"
          />
        ) : null}
        {/* Vertices */}
        {g.points.map((p) => (
          <circle
            key={p.domainId}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#0d9488"
            stroke="#fff"
            strokeWidth="1.5"
          />
        ))}
        {/* Short labels outside */}
        {g.points.map((p) => {
          const labelR = g.maxR + 18;
          const lx =
            g.cx + labelR * Math.cos(p.angle);
          const ly =
            g.cy + labelR * Math.sin(p.angle);
          return (
            <text
              key={`l-${p.domainId}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-600"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {p.shortLabel}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
