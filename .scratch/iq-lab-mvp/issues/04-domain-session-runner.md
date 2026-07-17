# 04 — Domain Session runner (timer, Response, Early Finish)

**What to build:** End-to-end completion of one Domain Session: server-authoritative timer and Grace Window, free navigation among Items, Response upsert while open, Early Finish only when all Items have Responses, timer close scoring unanswered Items empty/incorrect, freeze Responses on close, with thin runner UI driven by the Assessment boundary.

**Blocked by:** 03 — Content Version seed + Create Open Attempt

**Status:** ready-for-agent

- [ ] Starting a Domain Session sets server `ends_at`; client timer is display-only
- [ ] Participant can navigate Items within the open Domain and upsert Responses (last write wins)
- [ ] Early Finish is disabled until every Item has a server Response; when enabled, closes and freezes Responses
- [ ] On timer + Grace Window, Domain closes; missing Responses score empty/incorrect; no domain retry
- [ ] Post-close Response mutation is rejected at the boundary
- [ ] Correct keys never appear in client-facing payloads
- [ ] Boundary tests with fake clock cover early finish, timer partial close, and freeze
