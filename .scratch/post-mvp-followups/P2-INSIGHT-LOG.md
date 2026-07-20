# P2 OpenRouter / insight log — 2026-07-19

**Scope:** WORK-RECAP §9 P2  
**Deploy:** not performed

## Checklist

| Item | Status | Evidence |
|------|--------|----------|
| P2.1 `OPENROUTER_API_KEY` + model lokal | **pass** | Key set in `.env.local`; `OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini` |
| P2.2 readiness OpenRouter | **pass** | `GET /api/ops/readiness` → `openRouterConfigured: true`, model `openai/gpt-4o-mini`, `insightMode: llm_or_template_fallback` |
| P2.3 Complete attempt + insight di hasil | **pass** | Domain `completeAttempt` + hybrid LLM → snapshot; `/hasil` **200**; PDF **200** |

## Automated probes

### Direct OpenRouter

```
POST https://openrouter.ai/api/v1/chat/completions
model: openai/gpt-4o-mini
→ 200 JSON { insightProse, actionPlanProse }
```

### Domain live (in-memory + real LLM)

File: `src/domain/assessment/p2-insight-smoke.test.ts`  
Gate: `RUN_P2_LIVE=1` + key.

```
compositeIndex=63 iqEstimate=113
distinctFromTemplate=true
insightLen≈540 actionLen≈445
```

### E2E InsForge + completeAttempt + app UI

File: `src/domain/assessment/p2-e2e-hasil.smoke.test.ts`  
Gate: `RUN_P2_LIVE=1` + InsForge env + key.

| Step | Result |
|------|--------|
| Signup + age_band | OK |
| createAttempt `cv_mvp_v2` track explore | OK |
| 9 domain sessions early finish (mixed answers) | OK |
| completeAttempt + OpenRouter hybrid narrator | OK |
| rulePayload.clusters | 3 |
| `/asesmen/{id}/hasil` | **200** — Insight, Action plan, profil, klaster, indeks 63, IQ 113 |
| `/api/asesmen/{id}/pdf` | **200** `application/pdf` |
| Dashboard “Lihat profil” | OK |

Artifact (no password): `p2-e2e-result.json`

Insight preview (LLM):

> Hasil asesmen menunjukkan bahwa Anda memiliki pemahaman verbal, analogi verbal, dan kemampuan operasi numerik yang cukup baik…

## Production residual

| Item | Note |
|------|------|
| Host secrets | Set `OPENROUTER_API_KEY` (+ optional `OPENROUTER_CHAT_MODEL`) on production host at A4/P5 |
| Template fallback | Remains if key missing or LLM fails — Report still usable |
| Norm sample in smoke adapter | Fixed `age_band` column in E2E helper; prod path uses real InsForge repo |

## Re-run live smoke

```powershell
# load .env.local into session, then:
$env:RUN_P2_LIVE=1
npx vitest run src/domain/assessment/p2-insight-smoke.test.ts
npx vitest run src/domain/assessment/p2-e2e-hasil.smoke.test.ts
```

Regular `npm test` does **not** hit OpenRouter (no `RUN_P2_LIVE`).

## Status A2

| Layer | Status |
|-------|--------|
| Local key + model ADR 0016 | **done** |
| Readiness flag | **done** |
| Complete attempt → LLM prose on `/hasil` | **done** |
| Production host secret | open until deploy (P5) |
