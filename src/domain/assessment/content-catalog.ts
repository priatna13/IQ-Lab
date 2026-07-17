import type { ContentVersion } from "./content-types";
import { getMvpContentVersion, MVP_CONTENT_VERSION_ID } from "./content-seed";
import type { ContentVersionId } from "./types";

const VERSIONS: Record<string, ContentVersion> = {
  [MVP_CONTENT_VERSION_ID]: getMvpContentVersion(),
};

export type ContentCatalog = {
  getPublished(): Promise<ContentVersion | null>;
  getById(id: ContentVersionId): Promise<ContentVersion | null>;
};

export function createSeedContentCatalog(): ContentCatalog {
  return {
    async getPublished() {
      const published = Object.values(VERSIONS).find((v) => v.published);
      return published ? structuredClone(published) : null;
    },
    async getById(id) {
      const found = VERSIONS[id];
      return found ? structuredClone(found) : null;
    },
  };
}
