# 06 — Complete → Result Snapshot (skor + norma sintetik)

**What to build:** When all nine Domain Sessions are closed, complete the Attempt: compute Domain Scores, Ability Profile, Composite Index, and IQ Estimate under synthetic Norm Version, freeze a Result Snapshot, and show a web Report (no PDF yet) with temporary-norm / estimate disclaimers.

**Blocked by:** 05 — Nine Domains: order, pause/resume, abandon

**Status:** ready-for-agent

- [ ] Attempt becomes `completed` only after nine Domain Sessions closed and snapshot written
- [ ] Result Snapshot includes scores, Norm Version, Track, Content Version, timestamps
- [ ] Web Report renders Ability Profile, Composite Index, IQ Estimate with “Estimasi · norma sementara” (or equivalent BI) labeling
- [ ] Snapshot is immutable on subsequent reads (no silent rescore)
- [ ] Scoring runs only on server / boundary
- [ ] Boundary tests: complete happy path; reject complete if a Domain remains open
