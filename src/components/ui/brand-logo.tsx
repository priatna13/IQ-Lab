import Image from "next/image";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "hero";

const SIZES: Record<Size, { box: string; img: number; text: string }> = {
  sm: { box: "h-8 w-8", img: 32, text: "text-base sm:text-lg" },
  md: { box: "h-9 w-9", img: 36, text: "text-lg" },
  lg: { box: "h-11 w-11", img: 44, text: "text-xl" },
  hero: { box: "h-14 w-14 sm:h-16 sm:w-16", img: 64, text: "text-2xl sm:text-3xl" },
};

type Props = {
  size?: Size;
  /** Show wordmark “IQ-Lab” next to mark */
  withWordmark?: boolean;
  /** Wrap in link to beranda */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = "sm",
  withWordmark = true,
  href = "/",
  className = "",
  priority = false,
}: Props) {
  const s = SIZES[size];
  const mark = (
    <span
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-lab-navy ${className}`}
    >
      <span
        className={`relative ${s.box} shrink-0 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-slate-200/80`}
      >
        <Image
          src="/brand/logo.jpg"
          alt={withWordmark ? "" : "IQ-Lab"}
          width={s.img}
          height={s.img}
          className="h-full w-full object-contain p-0.5"
          priority={priority}
        />
      </span>
      {withWordmark ? (
        <span className={s.text}>
          IQ<span className="text-lab-teal">-</span>Lab
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex" aria-label="IQ-Lab beranda">
        {mark}
      </Link>
    );
  }

  return mark;
}
