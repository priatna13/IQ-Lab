/** Soft mesh + orbs — decorative only (DESIGN.md §8). Smaller/softer on mobile. */

type Props = {
  /** Lighter decoration for forms/results/runner */
  calm?: boolean;
};

export function MeshOrbs({ calm = false }: Props) {
  if (calm) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="lab-orb -right-8 top-0 h-24 w-24 bg-lab-teal/15 sm:h-40 sm:w-40 sm:bg-lab-teal/20" />
        <div className="lab-orb -left-6 bottom-2 h-20 w-20 bg-lab-violet/10 sm:h-32 sm:w-32" />
        <div className="lab-orb right-1/4 top-1/3 hidden h-24 w-24 bg-lab-sky/15 sm:block" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Soft mesh — toned down on base, fuller from md */}
      <div className="absolute -left-1/4 -top-1/4 h-[45%] w-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.14),transparent_65%)] opacity-80 sm:h-[55%] sm:opacity-90 sm:bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.22),transparent_65%)]" />
      <div className="absolute -right-1/4 top-0 h-[40%] w-[55%] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_65%)] sm:h-[50%] sm:w-[60%] sm:bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_65%)]" />
      <div className="absolute bottom-0 left-1/4 hidden h-[40%] w-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_70%)] sm:block" />
      <div className="absolute right-1/3 top-1/2 hidden h-[30%] w-[35%] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.08),transparent_70%)] md:block" />

      {/* Floating orbs — smaller on phone, never cover CTA */}
      <div className="lab-orb -left-12 -top-6 h-36 w-36 animate-float bg-lab-teal/20 sm:-left-16 sm:-top-8 sm:h-72 sm:w-72 sm:bg-lab-teal/30" />
      <div
        className="lab-orb -right-8 top-12 h-28 w-28 animate-float bg-lab-violet/15 sm:-right-10 sm:top-16 sm:h-60 sm:w-60 sm:bg-lab-violet/25"
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
