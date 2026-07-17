# 05 — Nine Domains: order, pause/resume, abandon

**What to build:** Progress through all nine Domains in Content Version order, pause between Domain Sessions, resume the same Open Attempt later, and explicitly abandon an Attempt without starting retake cooldown—demoable full hybrid session path (completion scoring may still wait on ticket 06).

**Blocked by:** 04 — Domain Session runner (timer, Response, Early Finish)

**Status:** ready-for-agent

- [ ] Domains advance only in the fixed Content Version sequence
- [ ] After a Domain closes, Participant may leave and later resume the same Open Attempt at the next Domain
- [ ] No reopening of a closed Domain Session in MVP
- [ ] Explicit abandon sets Attempt `abandoned`, clears Open Attempt slot, does not start 90-day retake cooldown
- [ ] Unused time from one Domain does not carry to another
- [ ] Boundary tests cover resume identity, abandon without cooldown flag, and sequence enforcement
