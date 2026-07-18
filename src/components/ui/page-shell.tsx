import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshOrbs } from "@/components/ui/mesh-orbs";

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
  /** Hide chrome (rare) */
  header?: boolean;
  footer?: boolean;
  className?: string;
  mainClassName?: string;
};

/**
 * Shared page chrome — header + main#main-content + footer (DESIGN.md §9).
 */
export function PageShell({
  children,
  width = "xl",
  orbs = "full",
  header = true,
  footer = true,
  className = "",
  mainClassName = "",
}: Props) {
  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      {header ? <SiteHeader /> : null}
      <main
        id="main-content"
        className={`relative mx-auto w-full flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-12 ${WIDTH[width]} ${mainClassName}`}
      >
        {orbs === "full" ? <MeshOrbs /> : null}
        {orbs === "calm" ? <MeshOrbs calm /> : null}
        <div className="relative">{children}</div>
      </main>
      {footer ? <SiteFooter /> : null}
    </div>
  );
}
