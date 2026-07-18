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
| — | **MVP ticket set complete** | — |

## All tickets

| # | Title | Blocked by | Status |
|---|--------|------------|--------|
| 01 | Foundation: app + InsForge + Assessment boundary harness | — | **done** |
| 02 | Landing, disclaimers, Auth & Age Band | 01 | **done** |
| 03 | Content Version seed + Create Open Attempt | 02 | **done** |
| 04 | Domain Session runner (timer, Response, Early Finish) | 03 | **done** |
| 05 | Nine Domains: order, pause/resume, abandon | 04 | **done** |
| 06 | Complete → Result Snapshot (skor + norma sintetik) | 05 | **done** |
| 07 | Insight hybrid (Rule Payload + LLM/fallback) | 06 | **done** |
| 08 | PDF Report dari snapshot | 07 | **done** |
| 09 | Primary, Retake Policy, Norm Sample | 06 | **done** |
| 10 | Integrity Events + Account Deletion | 06, 09 | **done** |
| 11 | FAQ metodologi inspired-by | 02 | **done** |

**Completion report:** [`docs/MVP-COMPLETION-REPORT.md`](../../docs/MVP-COMPLETION-REPORT.md)

