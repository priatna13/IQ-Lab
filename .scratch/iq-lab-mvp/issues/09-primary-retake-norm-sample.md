# 09 — Primary, Retake Policy, Norm Sample

**What to build:** First Completed Attempt is Primary; retake limited to one completion per 90 days; during cooldown Participant can view prior Report but cannot start a new Open Attempt; a Norm Sample (no PII) is recorded for Primary Completed with Age Band (core 18–45 vs separate 46+).

**Blocked by:** 06 — Complete → Result Snapshot (skor + norma sintetik)

**Status:** done

- [x] First Completed Attempt is marked Primary; later Completeds after cooldown are not Primary
- [x] After a Completed Attempt, new Attempt is rejected for 90 days (fake clock in tests)
- [x] During cooldown, prior Report remains readable
- [x] Abandoned Attempts do not start cooldown
- [x] Norm Sample written only for Primary Completed, without account/PII linkage fields
- [x] Norm Sample stores Age Band (+ Content Version as needed); 46+ not mixed into core sample semantics
- [x] Boundary tests cover primary, cooldown, abandon vs complete, and sample eligibility
