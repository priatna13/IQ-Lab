import type { Clock } from "../ports";

export function createFixedClock(iso: string): Clock {
  const fixed = new Date(iso);
  return {
    now() {
      return new Date(fixed.getTime());
    },
  };
}
