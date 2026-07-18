import type { Item, ItemChoice } from "../content-types";

const CHOICE_IDS = ["a", "b", "c", "d"] as const;

export type ItemDraft = {
  /** Short stem id suffix, e.g. "01" */
  n: string;
  prompt: string;
  /** Four choice labels in order a–d */
  choices: [string, string, string, string];
  correctKey: (typeof CHOICE_IDS)[number];
  difficulty: number;
};

export function buildDomainItems(domainId: string, drafts: ItemDraft[]): Item[] {
  return drafts.map((draft) => {
    const choices: ItemChoice[] = draft.choices.map((label, i) => ({
      id: CHOICE_IDS[i],
      label,
    }));
    return {
      id: `${domainId}_i${draft.n}`,
      domainId,
      prompt: draft.prompt,
      choices,
      correctKey: draft.correctKey,
      difficulty: draft.difficulty,
    };
  });
}
