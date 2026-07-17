# IQ-Lab MVP — ticket index

Parent spec: [spec.md](./spec.md)  
Status vocabulary: `ready-for-agent` | done (when closed by implementer)

## Graph

```
01 ─┬─► 02 ─┬─► 03 ► 04 ► 05 ► 06 ─┬─► 07 ► 08
    │       │                      ├─► 09 ─┐
    │       └─► 11                 │       ├─► 10
    │                              └───────┘
```

## Frontier (no open blockers)

| # | File | Status |
|---|------|--------|
| 07 | [07-hybrid-career-insight.md](./issues/07-hybrid-career-insight.md) | ready-for-agent |
| 09 | [09-primary-retake-norm-sample.md](./issues/09-primary-retake-norm-sample.md) | ready-for-agent |
| 11 | [11-faq-methodology.md](./issues/11-faq-methodology.md) | ready-for-agent |

## All tickets

| # | Title | Blocked by | Status |
|---|--------|------------|--------|
| 01 | Foundation: app + InsForge + Assessment boundary harness | — | **done** |
| 02 | Landing, disclaimers, Auth & Age Band | 01 | **done** |
| 03 | Content Version seed + Create Open Attempt | 02 | **done** |
| 04 | Domain Session runner (timer, Response, Early Finish) | 03 | **done** |
| 05 | Nine Domains: order, pause/resume, abandon | 04 | **done** |
| 06 | Complete → Result Snapshot (skor + norma sintetik) | 05 | **done** |
| 07 | Insight hybrid (Rule Payload + LLM/fallback) | 06 | ready-for-agent |
| 08 | PDF Report dari snapshot | 07 | ready-for-agent |
| 09 | Primary, Retake Policy, Norm Sample | 06 | ready-for-agent |
| 10 | Integrity Events + Account Deletion | 06, 09 | ready-for-agent |
| 11 | FAQ metodologi inspired-by | 02 | ready-for-agent |

Work the frontier with `/implement` (or equivalent), one ticket per clean context.  
**Build gate:** owner must still explicitly approve coding before implementation starts (PRD v1.1).
