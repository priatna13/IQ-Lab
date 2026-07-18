# 03 — Tests, pin cv_mvp_v2, docs polish

**What to build:** Point automated tests and exports at published v2; add catalog coverage; update completion/tracker notes. Keep suite green.

**Blocked by:** 02 — Item Bank real content

**Status:** done

- [x] Boundary tests use published content / `V2_CONTENT_VERSION_ID` where they assert pin id
- [x] New tests: publish only v2; v1 loadable; item counts 8×9; no correctKey on public runner
- [x] `npm test` green (47 tests)
- [x] ISSUES.md statuses → done when closed
- [x] Brief note in README that active bank is v2
