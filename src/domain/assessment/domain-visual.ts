/**
 * Visual accents per Domain (DESIGN.md R3 — expressive calm).
 * Presentation only; does not affect scoring.
 */

export type DomainVisual = {
  domainId: string;
  /** Short label for radar axes (overflow-safe) */
  shortLabel: string;
  /** Tailwind-friendly stripe / ring classes */
  accentBar: string;
  accentSoft: string;
  accentText: string;
  /** Hex for SVG radar (aligned with lab tokens) */
  strokeHex: string;
};

const DEFAULT: DomainVisual = {
  domainId: "unknown",
  shortLabel: "Domain",
  accentBar: "from-lab-teal to-lab-teal-deep",
  accentSoft: "bg-lab-mint/50",
  accentText: "text-lab-teal-deep",
  strokeHex: "#0d9488",
};

const MAP: Record<string, Omit<DomainVisual, "domainId">> = {
  verbal_pemahaman: {
    shortLabel: "Verbal",
    accentBar: "from-lab-teal to-[#0f766e]",
    accentSoft: "bg-lab-teal/10",
    accentText: "text-lab-teal-deep",
    strokeHex: "#0d9488",
  },
  verbal_analogi: {
    shortLabel: "Analogi",
    accentBar: "from-lab-sky to-lab-teal",
    accentSoft: "bg-lab-sky/15",
    accentText: "text-sky-800",
    strokeHex: "#0284c7",
  },
  numerik_operasi: {
    shortLabel: "Operasi",
    accentBar: "from-lab-violet to-lab-teal",
    accentSoft: "bg-lab-violet/10",
    accentText: "text-violet-800",
    strokeHex: "#7c3aed",
  },
  numerik_pola: {
    shortLabel: "Pola",
    accentBar: "from-lab-violet/90 to-lab-sky",
    accentSoft: "bg-lab-violet/10",
    accentText: "text-violet-700",
    strokeHex: "#8b5cf6",
  },
  figural: {
    shortLabel: "Figural",
    accentBar: "from-lab-coral/90 to-lab-violet",
    accentSoft: "bg-rose-50",
    accentText: "text-rose-800",
    strokeHex: "#e11d48",
  },
  spasial: {
    shortLabel: "Spasial",
    accentBar: "from-lab-sky to-lab-navy-soft",
    accentSoft: "bg-lab-mist",
    accentText: "text-lab-navy-soft",
    strokeHex: "#38bdf8",
  },
  memori: {
    shortLabel: "Memori",
    accentBar: "from-amber-400 to-lab-teal",
    accentSoft: "bg-amber-50",
    accentText: "text-amber-900",
    strokeHex: "#d97706",
  },
  logika: {
    shortLabel: "Logika",
    accentBar: "from-lab-navy-soft to-lab-teal",
    accentSoft: "bg-slate-100",
    accentText: "text-lab-navy",
    strokeHex: "#1a3a5c",
  },
  praktis: {
    shortLabel: "Praktis",
    accentBar: "from-emerald-500 to-lab-teal-deep",
    accentSoft: "bg-emerald-50",
    accentText: "text-emerald-900",
    strokeHex: "#059669",
  },
};

export function getDomainVisual(domainId: string): DomainVisual {
  const row = MAP[domainId];
  if (!row) return { ...DEFAULT, domainId };
  return { domainId, ...row };
}
