# Parallel Skill Assessment layer after cognitive completion

After a Participant completes the 9-domain Assessment, they may optionally take **field-specific skill packs** (career MCQs). Skill is a **parallel layer**, not a 10th Domain: it does not change Composite Index, IQ Estimate, Norm Sample, or the cognitive Result Snapshot.

**Decision**

- Gate: only `completed` cognitive Attempts may start a Skill Attempt (FK `source_attempt_id`).
- Catalog: 5 categories × 15 FieldIds; packs versioned as Skill Content Version (e.g. `skill_v1`, 7 MCQ items).
- Persistence: `skill_attempts` / `skill_responses` / `skill_result_snapshots` with own lifecycle (`in_progress` | `completed` | `abandoned`).
- Scoring: percent correct → skill score; **Domain Alignment** compares skill score to relevant domain averages from the frozen cognitive Ability Profile.
- Recommendation: `recommendFields` from Ability Profile + Career Cluster Rule Payload (hints only; Participant free to pick any field).
- UI: picker + runner + skill result; entry from `/hasil`, dashboard Keahlian, and `/asesmen/{id}/keahlian`.

**Consequences**

- Cognitive and skill content version independently; re-norm of domains does not rewrite skill snapshots.
- Multiple fields per source Attempt allowed; retake cooldown for cognitive Attempts does not block skill packs on already-completed sources.
- Not licensed psychometrics / job certification; disclaimers remain “pengembangan diri”.
- Account Deletion must cascade skill rows with the Participant’s identified data.
