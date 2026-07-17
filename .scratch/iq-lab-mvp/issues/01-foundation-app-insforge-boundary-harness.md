# 01 — Foundation: app + InsForge + Assessment boundary harness

**What to build:** A runnable Next.js app wired to InsForge, plus the Assessment application boundary (ports for clock and persistence) and an automated test harness that can exercise domain invariants without a full UI. After this ticket, developers can run the app and green tests for the empty boundary contract.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Next.js app boots locally and can read InsForge public config (anon) without exposing admin secrets to the client
- [x] Assessment application boundary module exists with injectable clock and repository ports
- [x] At least one automated test hits the boundary (e.g. reject create Attempt without authenticated Participant) and passes in CI/local runner
- [x] Project documents or env example list required InsForge variables (no secrets committed)
- [x] Domain vocabulary from CONTEXT.md is used in boundary naming (Attempt, Participant, etc.)
