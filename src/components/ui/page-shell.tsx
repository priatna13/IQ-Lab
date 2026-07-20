import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshOrbs } from "@/components/ui/mesh-orbs";
import { SoftParticles } from "@/components/ui/soft-particles";

type Width = "sm" | "md" | "lg" | "xl";

const WIDTH: Record<Width, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

type Props = {
  children: ReactNode;
  /** Content max width (DESIGN.md §5) */
  width?: Width;
  /** Heavier orbs on marketing; calm on forms/results/runner */
  orbs?: "full" | "calm" | "none";
  /** Soft CSS particles (landing only; DESIGN.md R3) */
  particles?: boolean;
  /** Hide chrome (rare) */
  header?: boolean;
  footer?: boolean;
  className?: string;
  mainClassName?: string;
};

/**
 * Shared page chrome — header + main#main-content + footer (DESIGN.md §9).
 * Mobile-first: px-4, single column, overflow clip, safe-area aware.
 */
export function PageShell({
  children,
  width = "xl",
  orbs = "full",
  particles = false,
  header = true,
  footer = true,
  className = "",
  mainClassName = "",
}: Props) {
  return (
    <div
      className={`flex min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-x-clip ${className}`}
    >
      {header ? <SiteHeader /> : null}
      <main
        id="main-content"
        className={`relative mx-auto w-full min-w-0 flex-1 overflow-x-clip px-4 py-7 sm:px-6 sm:py-12 ${WIDTH[width]} ${mainClassName}`}
      >
        {orbs === "full" ? <MeshOrbs /> : null}
        {orbs === "calm" ? <MeshOrbs calm /> : null}
        {particles ? <SoftParticles /> : null}
        <div className="relative min-w-0">{children}</div>
      </main>
      {footer ? <SiteFooter /> : null}
    </div>
  );
}
