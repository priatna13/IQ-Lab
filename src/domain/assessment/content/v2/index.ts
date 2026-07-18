import type { ContentVersion, DomainDefinition } from "../../content-types";
import { DOMAIN_SPECS } from "../domain-specs";
import { itemsFigural } from "./figural";
import { itemsLogika } from "./logika";
import { itemsMemori } from "./memori";
import { itemsNumerikOperasi } from "./numerik-operasi";
import { itemsNumerikPola } from "./numerik-pola";
import { itemsPraktis } from "./praktis";
import { itemsSpasial } from "./spasial";
import { itemsVerbalAnalogi } from "./verbal-analogi";
import { itemsVerbalPemahaman } from "./verbal-pemahaman";

/** Published Content Version with original BI Item Bank. */
export const V2_CONTENT_VERSION_ID = "cv_mvp_v2";

/** Alias for the Content Version new Attempts should pin. */
export const CURRENT_CONTENT_VERSION_ID = V2_CONTENT_VERSION_ID;

const ITEM_BUILDERS: Record<string, () => DomainDefinition["items"]> = {
  verbal_pemahaman: itemsVerbalPemahaman,
  verbal_analogi: itemsVerbalAnalogi,
  numerik_operasi: itemsNumerikOperasi,
  numerik_pola: itemsNumerikPola,
  figural: itemsFigural,
  spasial: itemsSpasial,
  memori: itemsMemori,
  logika: itemsLogika,
  praktis: itemsPraktis,
};

function buildDomains(): DomainDefinition[] {
  return DOMAIN_SPECS.map((spec) => {
    const builder = ITEM_BUILDERS[spec.id];
    if (!builder) {
      throw new Error(`Missing item builder for domain ${spec.id}`);
    }
    const items = builder();
    if (items.length !== 8) {
      throw new Error(
        `Domain ${spec.id} must have 8 items, got ${items.length}`,
      );
    }
    return {
      id: spec.id,
      label: spec.label,
      shortBlurb: spec.shortBlurb,
      instruction: spec.instruction,
      timeLimitSeconds: spec.timeLimitSeconds,
      items,
    };
  });
}

export function getV2ContentVersion(): ContentVersion {
  const domains = buildDomains();
  return {
    id: V2_CONTENT_VERSION_ID,
    label: "IQ-Lab Konten v2",
    published: true,
    domainOrder: domains.map((d) => d.id),
    domains,
  };
}
