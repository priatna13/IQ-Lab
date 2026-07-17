# 08 — PDF Report dari snapshot

**What to build:** Participant can download a PDF Report whose content matches the Result Snapshot (profile, indices, IQ Estimate labeling, Insight, action plan, disclaimers)—file may be regenerated but must stay content-equivalent to the snapshot.

**Blocked by:** 07 — Insight hybrid (Rule Payload + LLM/fallback)

**Status:** done

- [x] Completed Attempt offers PDF download from dashboard/Report
- [x] PDF includes Ability Profile summary, Composite Index, IQ Estimate + temporary norm disclaimer, Insight/action plan, footer legal disclaimers in BI
- [x] PDF content is derived from Result Snapshot only (not live recompute of scores)
- [x] Regenerating the file does not change underlying snapshot fields
- [x] PDF is readable when printed/saved as A4-oriented layout
