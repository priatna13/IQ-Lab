import Image from "next/image";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "hero";

/**
 * Mark sizes — transparent PNG, no chrome.
 * Mobile header keeps ≥44px touch; wordmark can hide on xs.
 */
const SIZES: Record<Size, { box: string; img: number; text: string }> = {
  sm: { box: "h-11 w-11", img: 44, text: "text-base sm:text-lg" },
  md: { box: "h-12 w-12 sm:h-14 sm:w-14", img: 56, text: "text-xl sm:text-2xl" },
  lg: { box: "h-14 w-14 sm:h-16 sm:w-16", img: 64, text: "text-2xl" },
  hero: {
    box: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
    img: 112,
    text: "text-2xl sm:text-3xl",
  },
};

const WORDMARK = "IQ-Lab";

/**
 * Wave of motion across letters: 1.5s ease-in-out, lift ~13px + accent at crest,
 * negative delay step ~0.09s so the peak ripples left→right forever.
 */
function WaveWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`lab-wordmark ${className}`} aria-label="IQ-Lab">
      {Array.from(WORDMARK).map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="lab-wordmark-char"
          style={{ animationDelay: `${i * -0.09}s` }}
          aria-hidden="true"
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}

type Props = {
  size?: Size;
  /** Show wordmark “IQ-Lab” next to mark */
  withWordmark?: boolean;
  /**
   * On very narrow screens hide wordmark so nav stays single-row.
   * Default true for header/footer; false for auth hero where space is fine.
   */
  compactWordmark?: boolean;
  /** Wrap in link to beranda */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = "sm",
  withWordmark = true,
  compactWordmark = false,
  href = "/",
  className = "",
  priority = false,
}: Props) {
  const s = SIZES[size];
  const mark = (
    <span
      className={`inline-flex max-w-full items-center gap-2 font-bold tracking-tight text-lab-navy sm:gap-2.5 ${className}`}
    >
      <span className={`relative ${s.box} shrink-0`}>
        <Image
          src="/brand/logo.png"
          alt={withWordmark ? "" : "IQ-Lab"}
          width={s.img}
          height={s.img}
          className="h-full w-full object-contain"
          priority={priority}
          sizes="(max-width: 640px) 56px, 112px"
        />
      </span>
      {withWordmark ? (
        <WaveWordmark
          className={`${s.text} ${compactWordmark ? "hidden min-[380px]:inline-flex" : ""}`}
        />
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex min-h-11 min-w-11 shrink-0 items-center"
        aria-label="IQ-Lab beranda"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
