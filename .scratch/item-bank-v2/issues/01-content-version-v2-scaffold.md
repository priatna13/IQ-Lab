# 01 — Content Version v2 scaffold + catalog dual-version

**What to build:** Introduce Content Version `cv_mvp_v2` in the seed catalog. Keep `cv_mvp_v1` loadable by id with `published: false`. Only v2 is published so new Attempts pin v2 (ADR 0010).

**Blocked by:** —

**Status:** done

- [x] Constant `V2_CONTENT_VERSION_ID = "cv_mvp_v2"` (and clear label)
- [x] Catalog registers both v1 and v2; `getPublished()` → v2 only
- [x] `getById("cv_mvp_v1")` still returns placeholder bank
- [x] Domain ids + fixed order unchanged from v1
- [x] Module layout ready for real item data (ticket 02)
