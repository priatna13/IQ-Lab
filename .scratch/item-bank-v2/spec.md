# Spec: Item Bank Content Version v2

Status: ready-for-agent  
Slug: item-bank-v2  
Sources: `PRD.md` v1.1, `CONTEXT.md`, ADR `0010`, MVP `content-seed` (`cv_mvp_v1`)  
Testing seam: **Assessment application boundary** + content catalog unit tests

---

## Problem Statement

MVP Content Version `cv_mvp_v1` only has placeholder Items (`[domainId] Soal latihan MVP #n`). The full product shell works, but Participants cannot get a meaningful Ability Profile. Soft-launch and empirical Norm Samples need **original**, reviewable Bahasa Indonesia Items that are not licensed IST content.

---

## Solution

Publish a new **Content Version** `cv_mvp_v2` with real multiple-choice Items for all nine Domains. Keep `cv_mvp_v1` in the catalog as **unpublished** so historical / in-flight pins remain resolvable. New Attempts pin the currently published version (`cv_mvp_v2`) per ADR 0010.

Items stay **server-only** for `correctKey`; client continues to receive public runner payloads without keys.

---

## Scope

### In scope

1. Content Version id `cv_mvp_v2`, label clear (e.g. “IQ-Lab Konten v2”).
2. Same nine Domain ids as v1 (order fixed; microcopy BI may improve).
3. **8 Items per Domain** (MVP size 8–12; start at 8 for reviewability).
4. Original IQ-Lab MCQ (4 choices `a`–`d`), difficulty 1–5, prompts + choices in **Bahasa Indonesia**.
5. Catalog: only **one** published version (v2); v1 remains `published: false` but loadable by id.
6. Automated tests: catalog publishes v2; createAttempt pins v2; v1 still loadable; no `correctKey` on public runner view; existing boundary tests stay green.
7. Domain timers stay in the same ballpark as v1 (~7–9 min / domain) unless a ticket explicitly changes them.

### Out of scope (this feature)

- Empirical re-norm / new Norm Version (still synthetic v1 scoring).
- Image/SVG figural assets (text/symbol patterns only in v2).
- Separate multi-phase Memory study UI (items embed stimulus in the prompt for working-memory style).
- Human psychometrics calibration or item-response theory.
- Admin CMS / DB-stored item bank (code-seed catalog remains).
- Changing Domain ids or career rule matrix.

---

## Domain coverage (same ids)

| Domain id | Focus v2 |
|-----------|----------|
| `verbal_pemahaman` | Kosakata / wacana singkat |
| `verbal_analogi` | Hubungan kata |
| `numerik_operasi` | Aritmetika cepat |
| `numerik_pola` | Deret / pola angka |
| `figural` | Pola simbol/bentuk (teks) |
| `spasial` | Rotasi / relasi ruang (teks) |
| `memori` | Working memory dalam prompt |
| `logika` | Deduksi / silogisme sederhana |
| `praktis` | Penilaian situasional kerja/sehari-hari |

---

## Content quality bar

- Original wording (inspired-by multi-domain structure, **not** IST item clones).
- Exactly one unambiguously best answer among four choices.
- No clinical / recruitment claims in item stems.
- Avoid culture- or religion-specific traps unless neutral common knowledge.
- Difficulty mix within each Domain (roughly low → mid → higher).

---

## Acceptance criteria

1. `getPublished()` returns `cv_mvp_v2` only.
2. `getById("cv_mvp_v1")` still returns the placeholder bank (for pin compatibility).
3. Each Domain in v2 has exactly 8 Items with `prompt`, 4 `choices`, `correctKey`, `difficulty`.
4. Creating an Attempt without explicit content version pins `cv_mvp_v2`.
5. Public domain runner view never includes `correctKey`.
6. Full existing test suite + new catalog/content tests pass.
7. Ticket index updated when closed.

---

## Implementation notes

- Prefer modular files under `src/domain/assessment/content/` (or `content-seed-v2` modules per domain) for reviewability.
- Do not mutate items of `cv_mvp_v1` in place for “fixing” quality — always new Content Version.
- Export `V2_CONTENT_VERSION_ID` (and optionally alias `CURRENT_CONTENT_VERSION_ID`) for tests and UI labels.
