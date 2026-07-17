import type { ContentVersionId } from "./types";

export type DomainId = string;

export type ItemChoice = {
  id: string;
  label: string;
};

/** Full Item including scoring key — server only. */
export type Item = {
  id: string;
  domainId: DomainId;
  prompt: string;
  choices: ItemChoice[];
  correctKey: string;
  difficulty: number;
};

export type DomainDefinition = {
  id: DomainId;
  label: string;
  instruction: string;
  timeLimitSeconds: number;
  items: Item[];
};

export type ContentVersion = {
  id: ContentVersionId;
  label: string;
  published: boolean;
  /** Fixed Domain order for this version. */
  domainOrder: DomainId[];
  domains: DomainDefinition[];
};

/** Safe for client/UI — never includes correctKey or full item bank. */
export type PublicContentVersion = {
  id: ContentVersionId;
  label: string;
  domainOrder: DomainId[];
  domains: Array<{
    id: DomainId;
    label: string;
    instruction: string;
    timeLimitSeconds: number;
    itemCount: number;
  }>;
};

export function toPublicContentVersion(cv: ContentVersion): PublicContentVersion {
  return {
    id: cv.id,
    label: cv.label,
    domainOrder: [...cv.domainOrder],
    domains: cv.domains.map((d) => ({
      id: d.id,
      label: d.label,
      instruction: d.instruction,
      timeLimitSeconds: d.timeLimitSeconds,
      itemCount: d.items.length,
    })),
  };
}
