import type { Clock } from "@/domain/assessment";

export const systemClock: Clock = {
  now() {
    return new Date();
  },
};
