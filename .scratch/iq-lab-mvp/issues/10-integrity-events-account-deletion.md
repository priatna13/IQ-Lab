# 10 — Integrity Events + Account Deletion

**What to build:** Light integrity: record blur/tab Integrity Events with a UX warning and no auto-fail; Account Deletion removes identifiable Assessment data while leaving detached Norm Samples for norm science.

**Blocked by:** 06 — Complete → Result Snapshot (skor + norma sintetik); 09 — Primary, Retake Policy, Norm Sample

**Status:** ready-for-agent

- [ ] Blur/tab (or equivalent) records an Integrity Event and shows a warning; Attempt is not auto-invalidated
- [ ] Integrity Events do not by themselves exclude Norm Sample in MVP
- [ ] Account Deletion removes Account identity and identifiable Attempts, Responses, Result Snapshots, report artifacts
- [ ] Pre-existing Norm Samples remain without Account/PII link after deletion
- [ ] Deleted Participant cannot access old Reports via session
- [ ] Boundary/integration tests cover delete cascade vs retained Norm Sample
