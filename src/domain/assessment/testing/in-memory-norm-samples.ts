import type { NormSampleRepository } from "../ports";
import type { NormSample } from "../norm-sample";

export function createInMemoryNormSampleRepository(): NormSampleRepository & {
  list(): NormSample[];
} {
  const samples: NormSample[] = [];
  return {
    async save(sample) {
      samples.push(structuredClone(sample));
    },
    list() {
      return samples.map((s) => structuredClone(s));
    },
  };
}
