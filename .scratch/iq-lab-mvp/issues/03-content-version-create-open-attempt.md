# 03 — Content Version seed + Create Open Attempt

**What to build:** A published Content Version with nine Domains and a small Item set per Domain, and the flow for a Participant to choose Track, create an Attempt that pins Track + Content Version, see the Open Attempt on the dashboard, and be refused a second concurrent Open Attempt.

**Blocked by:** 02 — Landing, disclaimers, Auth & Age Band

**Status:** done

- [x] A Content Version can be seeded/published with fixed Domain order and ~8–12 Items per Domain (MVP size; keys never sent to client)
- [x] Participant selects Track `explore` or `career` with confirmation before Domain work
- [x] Create Attempt via Assessment boundary pins Track and Content Version; status `in_progress`
- [x] Dashboard shows the single Open Attempt with a clear continue action
- [x] Creating a second Open Attempt while one exists is rejected
- [x] Automated tests cover pin immutability and single-open invariant at the boundary
