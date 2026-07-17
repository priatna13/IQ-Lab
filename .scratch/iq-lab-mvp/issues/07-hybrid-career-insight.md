# 07 — Insight hybrid (Rule Payload + LLM/fallback)

**What to build:** On Attempt completion, produce a Rule Payload (Career Clusters, strengths, growth areas, skill priorities) from the Ability Profile and Track, narrate Insight and action plan via constrained LLM or template fallback, and store both on the Result Snapshot so the web Report shows track-appropriate career guidance.

**Blocked by:** 06 — Complete → Result Snapshot (skor + norma sintetik)

**Status:** ready-for-agent

- [ ] Rule engine emits versioned Rule Payload; no clusters outside the matrix
- [ ] Track `explore` vs `career` changes action-plan framing/templates
- [ ] LLM path only narrates within Rule Payload; failure uses template fallback still yielding usable Insight
- [ ] Insight prose is frozen on Result Snapshot (no user-facing regenerate)
- [ ] Report UI shows clusters, narrative, and action plan in Bahasa Indonesia
- [ ] Boundary tests stub LLM: fallback path and payload-bound Insight persistence
