/** Soft mesh orbs — decorative only (DESIGN.md §8). */

type Props = {
  /** Lighter decoration for forms/results */
  calm?: boolean;
};

export function MeshOrbs({ calm = false }: Props) {
  if (calm) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="lab-orb -right-8 top-0 h-32 w-32 bg-lab-teal/15 sm:h-40 sm:w-40" />
        <div className="lab-orb -left-6 bottom-0 h-28 w-28 bg-lab-violet/10" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="lab-orb -left-16 -top-10 h-48 w-48 animate-float bg-lab-teal/25 sm:h-64 sm:w-64" />
      <div
        className="lab-orb -right-12 top-20 h-40 w-40 bg-lab-violet/20 sm:h-56 sm:w-56"
        style={{ animationDelay: "1s" }}
      />
      <div className="lab-orb bottom-8 left-1/3 hidden h-36 w-36 bg-lab-sky/20 sm:block" />
    </div>
  );
}
