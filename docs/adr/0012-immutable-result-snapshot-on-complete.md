# Result Snapshot is immutable at completion; Score Correction is escape-hatch only

Trust requires that last week’s PDF matches today’s dashboard. When an Attempt becomes Completed, scores, Norm Version, Rule Payload (and version), Insight prose, Track, and Content Version are frozen as a Result Snapshot. Reports (web/PDF) render that snapshot; PDF files may be regenerated only as equivalent renders. Improving LLM models or career templates does not rewrite historical Insight. Only an explicit Score Correction process (bug fix, audited—not a Participant feature) may alter a snapshot.

**Consequences:** Persist full snapshot payload at complete time; version rules and norms on the snapshot; no “refresh insight” button in MVP.
