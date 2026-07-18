import Image from "next/image";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "hero";

/** Larger mark sizes — no chrome box, logo only */
const SIZES: Record<Size, { box: string; img: number; text: string }> = {
  sm: { box: "h-10 w-10 sm:h-11 sm:w-11", img: 44, text: "text-lg sm:text-xl" },
  md: { box: "h-12 w-12", img: 48, text: "text-xl" },
  lg: { box: "h-14 w-14", img: 56, text: "text-2xl" },
  hero: { box: "h-24 w-24 sm:h-28 sm:w-28", img: 112, text: "text-2xl sm:text-3xl" },
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
      <span className={`relative ${s.box} shrink-0`}>
        <Image
          src="/brand/logo.png"
          alt={withWordmark ? "" : "IQ-Lab"}
          width={s.img}
          height={s.img}
          className="h-full w-full object-contain"
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
