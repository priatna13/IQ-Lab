/** Soft mesh + orbs — decorative only (DESIGN.md §8 / deco.mesh-orbs). */

type Props = {
  /** Lighter decoration for forms/results/runner */
  calm?: boolean;
};

export function MeshOrbs({ calm = false }: Props) {
  if (calm) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="lab-orb -right-10 top-0 h-36 w-36 bg-lab-teal/20 sm:h-44 sm:w-44" />
        <div className="lab-orb -left-8 bottom-4 h-32 w-32 bg-lab-violet/12" />
        <div className="lab-orb right-1/4 top-1/3 hidden h-24 w-24 bg-lab-sky/15 sm:block" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft mesh gradients (heavier on md+) */}
      <div className="absolute -left-1/4 -top-1/4 h-[55%] w-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.22),transparent_65%)] opacity-90" />
      <div className="absolute -right-1/4 top-0 h-[50%] w-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_65%)]" />
      <div className="absolute bottom-0 left-1/4 h-[40%] w-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_70%)]" />
      <div className="absolute right-1/3 top-1/2 hidden h-[30%] w-[35%] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.08),transparent_70%)] md:block" />

      {/* Floating orbs */}
      <div className="lab-orb -left-16 -top-8 h-52 w-52 animate-float bg-lab-teal/30 sm:h-72 sm:w-72" />
      <div
        className="lab-orb -right-10 top-16 h-44 w-44 animate-float bg-lab-violet/25 sm:h-60 sm:w-60"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="lab-orb bottom-4 left-1/3 hidden h-40 w-40 animate-float bg-lab-sky/25 sm:block"
        style={{ animationDelay: "2.4s" }}
      />
      <div
        className="lab-orb right-1/4 top-1/2 hidden h-28 w-28 animate-float bg-lab-coral/15 lg:block"
        style={{ animationDelay: "0.6s" }}
      />
    </div>
  );
}
