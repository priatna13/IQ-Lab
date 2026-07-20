/**
 * Soft decorative particles — landing only (DESIGN.md R3).
 * CSS transform drift; zero when prefers-reduced-motion.
 */

type Props = {
  /** Max particles (mobile gets fewer via CSS density) */
  count?: number;
  className?: string;
};

const SPECS = [
  { left: "8%", top: "18%", delay: "0s", dur: "18s", size: 4 },
  { left: "22%", top: "42%", delay: "1.2s", dur: "22s", size: 3 },
  { left: "35%", top: "12%", delay: "2.4s", dur: "16s", size: 5 },
  { left: "48%", top: "55%", delay: "0.6s", dur: "20s", size: 3 },
  { left: "62%", top: "22%", delay: "3s", dur: "19s", size: 4 },
  { left: "74%", top: "48%", delay: "1.8s", dur: "21s", size: 3 },
  { left: "88%", top: "15%", delay: "2.1s", dur: "17s", size: 4 },
  { left: "15%", top: "68%", delay: "0.3s", dur: "23s", size: 3 },
  { left: "55%", top: "72%", delay: "4s", dur: "18s", size: 5 },
  { left: "80%", top: "70%", delay: "1.5s", dur: "20s", size: 3 },
  { left: "40%", top: "35%", delay: "2.8s", dur: "24s", size: 2 },
  { left: "70%", top: "38%", delay: "0.9s", dur: "15s", size: 4 },
  { left: "28%", top: "78%", delay: "3.5s", dur: "19s", size: 3 },
  { left: "92%", top: "40%", delay: "1.1s", dur: "22s", size: 2 },
  { left: "5%", top: "50%", delay: "2s", dur: "21s", size: 3 },
  { left: "50%", top: "8%", delay: "0.4s", dur: "16s", size: 4 },
];

export function SoftParticles({ count = 16, className = "" }: Props) {
  const items = SPECS.slice(0, Math.min(count, SPECS.length));

  return (
    <div
      className={`lab-particles pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {items.map((p, i) => (
        <span
          key={i}
          className="lab-particle absolute rounded-full bg-lab-teal/30 sm:bg-lab-teal/40"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            // Hide half on very small screens via nth (CSS)
            opacity: i >= 12 ? undefined : undefined,
          }}
          data-idx={i}
        />
      ))}
    </div>
  );
}
