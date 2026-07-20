import type { ContentVersion } from "./content-types";
import { getMvpContentVersion, MVP_CONTENT_VERSION_ID } from "./content-seed";
import {
  getV2ContentVersion,
  V2_CONTENT_VERSION_ID,
} from "./content/v2";
import {
  getV3ContentVersion,
  V3_CONTENT_VERSION_ID,
} from "./content/v3";
import type { ContentVersionId } from "./types";

const VERSIONS: Record<string, ContentVersion> = {
  [MVP_CONTENT_VERSION_ID]: getMvpContentVersion(),
  [V2_CONTENT_VERSION_ID]: getV2ContentVersion(),
  [V3_CONTENT_VERSION_ID]: getV3ContentVersion(),
};

export type ContentCatalog = {
  getPublished(): Promise<ContentVersion | null>;
  getById(id: ContentVersionId): Promise<ContentVersion | null>;
};

export function createSeedContentCatalog(): ContentCatalog {
  return {
    async getPublished() {
      const published = Object.values(VERSIONS).filter((v) => v.published);
      if (published.length === 0) return null;
      // Prefer current v3 if multiple flags were ever true.
      const preferred =
        published.find((v) => v.id === V3_CONTENT_VERSION_ID) ??
        published.find((v) => v.id === V2_CONTENT_VERSION_ID) ??
        published[0];
      return structuredClone(preferred);
    },
    async getById(id) {
      const found = VERSIONS[id];
      return found ? structuredClone(found) : null;
    },
  };
}
