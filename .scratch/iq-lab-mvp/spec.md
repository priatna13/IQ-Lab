# Spec: IQ-Lab MVP — Multi-domain Assessment Platform

Status: ready-for-agent  
Slug: iq-lab-mvp  
Sources: `PRD.md` v1.1, `CONTEXT.md`, `docs/adr/0001`–`0015`  
Testing seam (approved): **Assessment application boundary** (single public product seam)

---

## Problem Statement

People who want to understand their cognitive strengths for self-development or mid-career decisions usually face a bad trade-off: free online “IQ quizzes” that return a single opaque number with little career meaning, or formal multi-domain instruments that are expensive, offline, and locked behind institutional licensing.

They need a trustworthy, honest digital assessment that shows a multi-domain strength/weakness profile, explains what it might mean for learning or career direction, and does not pretend to be a licensed recruitment or clinical instrument.

---

## Solution

IQ-Lab is a Bahasa Indonesia web product where a Participant creates an Account, chooses a Track (`explore` or `career`), and completes a nine-Domain Assessment inspired by multi-factor structure (original Items; not licensed IST). They may pause between Domains; within each Domain Session timing is server-authoritative. When all nine Domains are done, the product freezes a Result Snapshot (Ability Profile, Composite Index, IQ Estimate under a temporary internal Norm Version, Rule Payload–based career Insight and action plan) and presents it as a Report on the web and as a PDF—clearly labeled as self-development estimates, not official IQ or hiring certification.

---

## User Stories

1. As a prospective Participant, I want to read a clear landing explanation that this is not official IST and not for recruitment, so that I am not misled about what the product is.
2. As a prospective Participant, I want to create an Account with email and password, so that my progress and results can be saved securely.
3. As a prospective Participant, I want to create an Account with Google OAuth, so that I can start without managing another password.
4. As a Participant, I want to sign in and sign out, so that I control access to my Assessment data.
5. As a Participant, I want to be blocked from starting an Assessment without an Account, so that long multi-Domain work is never trapped in a disposable guest session.
6. As a Participant under 18, I want to be refused at onboarding, so that the product does not collect or score minors in MVP.
7. As a Participant aged 18–45, I want to proceed with standard career-oriented framing, so that norms and copy match the core audience.
8. As a Participant aged 46+, I want to continue with an explicit disclaimer, so that I understand norms and career advice may be less well calibrated for me.
9. As a Participant exploring my path, I want to choose Track `explore` (“Jelajahi potensi”), so that Insight and action plans speak to learning and direction-finding.
10. As a mid-career professional, I want to choose Track `career` (“Rancang langkah karir”), so that Insight emphasizes skill gaps and practical next steps.
11. As a Participant, I want the product to confirm my Track before Domain work starts, so that I do not accidentally lock the wrong framing.
12. As a Participant, I want Track to stay fixed for my Attempt, so that my Report has a single coherent framing.
13. As a Participant who picked the wrong Track, I want to abandon the Open Attempt and start again with another Track when policy allows, so that I am not stuck without burning retake cooldown.
14. As a Participant, I want the Assessment to cover nine Domains of ability, so that I see a structure of strengths and weaknesses—not one number alone.
15. As a Participant, I want Domain labels and instructions in Bahasa Indonesia, so that I can understand what I am doing.
16. As a Participant, I want Items to be original IQ-Lab content, so that the product is legally and ethically distinct from licensed tests.
17. As a Participant, I want my Attempt to pin a Content Version (Item Bank and fixed Domain order) at creation, so that mid-flight content edits do not change the instrument under me.
18. As a Participant, I want Domains to appear in a fixed order for my Content Version, so that the experience is predictable and comparable.
19. As a Participant, I want only one Open Attempt at a time, so that I never juggle two half-finished Assessments.
20. As a Participant, I want to pause between Domain Sessions and resume later, so that a 60–90+ minute Assessment fits real life.
21. As a Participant, I want a server-authoritative timer inside each Domain Session, so that timing rules are fair and not gameable from the browser alone.
22. As a Participant, I want a short Grace Window after time ends only for in-flight answers, so that a flaky network does not erase my last Response unfairly.
23. As a Participant, I want unanswered Items after time expiry to count as empty/incorrect, so that scoring rules are clear.
24. As a Participant, I want to navigate freely among Items inside an open Domain Session, so that I can fix mis-taps and reconsider before the Domain closes.
25. As a Participant, I want each Response autosaved to the server, so that a refresh does not wipe work inside the Domain.
26. As a Participant, I want to change a Response until the Domain Session closes, so that the last answer is what is scored.
27. As a Participant, I want Responses to freeze after Domain close, so that results are stable and not quietly editable later.
28. As a Participant who finished every Item early, I want Early Finish for that Domain, so that I am not forced to idle until the timer ends.
29. As a Participant, I want Early Finish disabled while any Item lacks a Response, so that I cannot accidentally close a half-empty Domain.
30. As a Participant, I want unused Domain time not to carry over to other Domains, so that timing stays comparable across people.
31. As a Participant, I want clear progress (which Domain, how many remain), so that I can plan breaks honestly.
32. As a Participant, I want honest duration expectations (not “five minutes”), so that I can allocate time.
33. As a Participant who must stop entirely, I want to abandon the Attempt explicitly, so that I can clear the Open Attempt without being treated as completed.
34. As a Participant who abandoned, I want abandon not to start the 90-day retake cooldown, so that technical or life interruptions are not punished like a finished Assessment.
35. As a Participant, I want correct answers and scoring never exposed to the client, so that the instrument is harder to cheat and results stay trustworthy.
36. As a Participant, I want a warning when I blur or switch tabs, so that I am reminded to work honestly without being auto-failed.
37. As a Participant, I want Integrity Events recorded for quality observation only, so that MVP stays self-dev-friendly rather than proctored.
38. As a Participant who finished all nine Domains, I want Domain Scores computed on the server, so that the Ability Profile is consistent.
39. As a Participant, I want an Ability Profile across nine Domains, so that I can see relative strengths and weaknesses.
40. As a Participant, I want a Composite Index, so that I have one careful summary number that is not labeled as official IQ.
41. As a Participant, I want an IQ Estimate on an internal norm scale, so that I get a familiar single-number reference with explicit “estimate / temporary norm” labeling.
42. As a Participant, I want Norm Version recorded on my result, so that future re-norming does not silently rewrite what I saw.
43. As a Participant, I want career-oriented structured output (Career Clusters, strengths, growth areas, skill priorities) derived from rules, so that recommendations are explainable.
44. As a Participant on Track `explore`, I want Insight prose and action plans tailored to exploration, so that advice feels relevant to learning and direction.
45. As a Participant on Track `career`, I want Insight prose and action plans tailored to career moves, so that advice feels relevant to skill gaps and roles.
46. As a Participant, I want LLM text only inside the Rule Payload bounds, so that the model cannot invent unsupported clusters or clinical claims.
47. As a Participant, I want a template fallback if the LLM fails, so that I still receive a usable Report.
48. As a Participant, I want a Result Snapshot frozen at completion, so that last week’s numbers and narrative match today’s dashboard.
49. As a Participant, I want a web Report that renders my Result Snapshot with disclaimers, so that I can review results interactively.
50. As a Participant, I want to download a PDF Report of the same snapshot, so that I can keep or share privately with a mentor.
51. As a Participant, I want PDF regeneration to stay content-equivalent to the snapshot, so that files cannot drift from the official result.
52. As a Participant, I want no “refresh Insight” that rewrites history when models improve, so that my result remains a stable record.
53. As a Participant viewing results, I want labels that say IQ Estimate is not official IQ and not for hiring, so that I use the product responsibly.
54. As a Participant who completed once, I want that first Completed Attempt to be Primary, so that my main Report and norm contribution are well defined.
55. As a Participant, I want retakes limited to one completion per 90 days, so that practice effects do not flood the product and norms.
56. As a Participant in cooldown, I want to still view my previous Report, so that I am not locked out of my own results.
57. As a Participant in cooldown, I want to be blocked from starting a new Open Attempt, so that policy is enforced consistently.
58. As a Participant who completes again after cooldown, I want the new Attempt not to replace Primary or Norm Sample eligibility, so that first completion remains the scientific and product baseline.
59. As the product operator, I want Norm Samples created only from Primary Completed Attempts without PII, so that re-norming is ethical and clean.
60. As the product operator, I want Age Band stored on Norm Samples, so that core 18–45 norms are not mixed with 46+ in v1 empirical work.
61. As a Participant, I want my individual Attempts and Reports private to me, so that others cannot read my results.
62. As a Participant, I want Account Deletion to remove identifiable Assessment data, so that I can leave the product.
63. As the product operator, I want detached Norm Samples to remain after Account Deletion, so that norm science is not erased person-by-person.
64. As a Participant, I want FAQ content explaining inspired-by methodology versus licensed IST, so that curious users understand the positioning.
65. As a Participant, I want the UI fully in Bahasa Indonesia, so that the product matches the intended market.
66. As a Participant on mobile, I want the runner usable on a phone, so that I can complete Domains away from a desktop.
67. As a Participant, I want accessibility basics (labels, contrast, focus, readable timer), so that the Assessment is usable more broadly.
68. As a Participant, I want free access to full results in MVP (no paywall), so that I can evaluate the product without payment friction.
69. As a Participant, I want dashboard entry points to continue an Open Attempt or open a completed Report, so that I always know what to do next.
70. As a developer/agent implementing the system, I want a single Assessment application boundary as the test seam, so that domain rules are enforced and verified in one place.
71. As a developer/agent, I want server-side enforcement of all scoring and close rules, so that clients cannot forge Domain Scores or IQ Estimates.
72. As a developer/agent, I want Content Version and career ruleset versions stamped on snapshots, so that audits can explain any historical Report.
73. As a developer/agent, I want Score Correction only as a non-Participant escape hatch for proven bugs, so that normal flows never silently rescore history.
74. As a Participant who loses connectivity mid-Domain, I want successful upserts preserved and close rules driven by the server clock, so that partial progress remains consistent with policy.
75. As a Participant, I want Domain Sessions already closed to stay closed (no re-open in MVP), so that freeze rules remain simple and trustworthy.

---

## Implementation Decisions

### Product and legal positioning

- Build an **inspired-by** multi-domain Assessment with original Items and IQ-Lab Domain labels; never claim licensed IST/IST 2000R, clinical diagnosis, or recruitment certification (ADR 0001).
- UI copy and Report disclaimers are mandatory on landing, pre-Attempt, results, PDF, and FAQ.

### Stack and platform

- **Next.js** application layer with **InsForge** for Postgres, RLS, Auth (email/password + Google), optional Storage for PDF artifacts, and server-side AI via OpenRouter gateway (ADR 0002).
- Secrets, correct keys, and scoring run only on the server.

### Domain modules (logical)

Prefer few modules; the **Assessment application boundary** is the sole public product seam for behavior:

1. **Assessment application boundary** — create/resume/abandon Attempt; start/close Domain Session; upsert Response; complete Attempt; enforce Retake Policy; read Report; coordinate Account Deletion side effects for Assessment data.
2. **Content catalog** (internal) — published Content Versions, Domain order, Items for a version (no correct keys to clients).
3. **Scoring & norms** (internal pure) — raw → Domain Score → Ability Profile → Composite Index → IQ Estimate given Norm Version.
4. **Career rules** (internal pure) — Ability Profile (+ Track, Age Band, goals) → Rule Payload.
5. **Insight narrator** (internal adapter) — LLM constrained by Rule Payload, with template fallback.
6. **Identity/auth adapter** — Account session; Age Band on profile; deletion hook.
7. **Persistence adapter** — Attempts, Domain Sessions, Responses, Integrity Events, Result Snapshots, Norm Samples, report artifacts.
8. **Report renderer** — web view + PDF from Result Snapshot only.
9. **Clock** — injectable server clock for timer, Grace Window, and retake windows (required for tests).

UI and HTTP handlers are thin adapters over the Assessment application boundary—not parallel business-rule homes.

### Attempt and session rules (must enforce in boundary)

- Attempt statuses: `in_progress` | `completed` | `abandoned`.
- At most one Open Attempt (`in_progress`) per Participant.
- Track and Content Version pinned and immutable at Attempt creation (ADR 0008, 0010, 0014).
- Domain order fixed per Content Version; Participant cannot reorder.
- Between Domains: pause/resume allowed; within Domain: server timer + Grace Window (ADR 0003, 0007).
- Responses mutable with free Domain Navigation until Domain Session close; then frozen (ADR 0009).
- Early Finish only if every Item has a server Response; otherwise close only via timer+grace partial scoring (ADR 0013).
- Missing Responses after close score empty/incorrect; no domain retry; no whole-Attempt auto-abandon on timer.
- Completed requires all nine Domain Sessions closed + Result Snapshot written.
- Only Completed starts 90-day Retake Policy cooldown; Abandoned does not (ADR 0006).
- Primary Attempt = first Completed by `completed_at`; later Completeds after cooldown are neither Primary nor Norm Sample contributors (ADR 0011).

### Scoring and Insight

- Lead with Ability Profile + Composite Index; IQ Estimate labeled as internal/temporary norm (ADR 0004).
- Day-one synthetic Norm Version with UI badge “Estimasi · norma sementara”.
- Rule Payload is source of truth; LLM only narrates; fallback templates on failure (ADR 0005).
- On complete: freeze Result Snapshot (scores, Norm Version, Rule Payload + ruleset version, Insight prose, Track, Content Version). Reports only render snapshot. No user-facing rescore/refresh Insight. Score Correction is out-of-band for bugs only (ADR 0012).

### Norm Sample and privacy

- Norm Sample from Primary Completed only; store aggregates + Age Band + Content Version; no PII (ADR 0011).
- Core empirical bucket 18–45; 46+ separate / excluded from core v1 mix.
- Integrity Events do not auto-exclude from Norm Sample in MVP.
- RLS: Participant reads only own Attempts/snapshots.
- Account Deletion removes identifiable Assessment data; detached Norm Samples remain (ADR 0015).

### Auth and onboarding

- Account required before Attempt.
- Capture Age Band; block &lt;18; disclaimer 46+.
- Tracks: `explore` | `career` with distinct Insight/action-plan templates.

### Content MVP

- Nine Domains; small bank ~8–12 Items/Domain; AI draft + human review gate (process), not a runtime seam.
- Content Version publication is an operator/admin concern; Participants only consume the pinned published version.

### Integrity (light)

- Log blur/tab Integrity Events; UX warning; no auto invalidation; no webcam/fullscreen proctoring.

### Monetization

- Full free pre-revenue: all Report layers available without paywall.

### Branding

- Calm lab visual system with warmer accents on Insight blocks; existing logo asset as brand anchor.

### State machine shape (decision-rich; not a prototype dump)

Attempt:

- `in_progress` → `completed` | `abandoned`
- `completed` and `abandoned` are terminal for that Attempt id

Domain Session close reasons:

- `early_finish` (all Items answered)
- `timer` (after ends_at + Grace Window)

Retake gate predicate (conceptual):

- reject new Attempt if open Attempt exists OR exists Completed with completed_at within 90 days

---

## Testing Decisions

### What makes a good test here

- Test **external behavior of the Assessment application boundary** only: given Account/profile fixtures, Content Version fixtures, clock, and collaborator stubs, assert allowed/rejected operations, resulting statuses, frozen Responses, snapshot contents (including disclaimers-relevant fields), Primary/Norm Sample eligibility, and retake gates.
- Do **not** assert internal private function structure, ORM calls, or UI component trees as the primary suite.
- Prefer one seam; avoid a second parallel suite that re-implements rules in the HTTP layer.
- Use deterministic clock and fixed Content Version fixtures so timer/grace/retake tests are stable.
- Stub LLM: assert fallback path and that narrator cannot widen Rule Payload (e.g. reject/ignore extra clusters if adapter misbehaves—boundary should only persist payload-consistent Insight).
- Never require real InsForge/network for core domain tests; persistence is faked behind ports.

### Module under test

- **Primary:** Assessment application boundary (all user stories that encode domain rules).
- **Optional thin pure tests** (only if they reduce failure diagnosis cost): scoring transform and rule-engine mapping—still treated as internals, not a second product contract.
- **Not primary for MVP agent:** visual PDF pixel layout, OAuth provider UI, full browser E2E (optional smoke later).

### Prior art

- Greenfield repo: **no existing test suite**. Establish the Assessment boundary test harness as the canonical pattern for later features.

### Example scenario classes (non-exhaustive)

- Create Attempt pins Track + Content Version; second open rejected.
- Resume returns same Open Attempt.
- Upsert Response then close; last value scored; post-close upsert rejected.
- Early Finish rejected with missing Responses; accepted when complete.
- Timer + grace accepts late in-flight only per policy; then freezes.
- Abandon clears open slot without cooldown; complete starts cooldown.
- Complete writes immutable Result Snapshot; subsequent Insight “improvements” do not change read model.
- Primary and Norm Sample only on first Completed; Age Band 46+ tagged separately.
- Account Deletion removes identifiable rows; Norm Sample remains without account link.
- Correct keys never appear on any client-facing DTO from the boundary.

---

## Out of Scope

- Licensed IST items, norms, branding, or recruitment/CPNS equivalence claims  
- Clinical diagnosis or “official IQ” certification  
- B2B HRD batch dashboards, coach multi-client portals  
- Paywalls, subscriptions, share cards for social flexing  
- Large Item banks, CAT/IRT-full delivery, randomized Domain order per Attempt  
- Strict proctoring (fullscreen lock, auto-disqualify on blur)  
- English Item Bank / bilingual assessment  
- Mid-Attempt Track change or post-complete Track reframe  
- User-facing rescore / live Insight refresh when models change  
- Empirical re-norm UI and population percentile marketing claims  
- Multiple concurrent Open Attempts  
- Re-opening closed Domain Sessions in MVP  
- Exact production timer seconds and Grace Window width (configure as constants; pick values at implementation without re-opening domain debate)  
- Final microcopy for all nine Domain names (may use PRD draft labels)  
- Choosing OpenRouter model id and PDF library brand  
- Hosting vendor choice (InsForge Deployments vs Vercel) beyond “Next.js + InsForge backend”

---

## Further Notes

- **Do not start coding until Product Owner explicitly approves implementation** (stated on PRD v1.1). This spec being `ready-for-agent` means the *ticket* is agent-ready; release the build gate only when the owner says so.
- Domain glossary: `CONTEXT.md`. Architectural/domain decisions: `docs/adr/0001`–`0015`. Product scope narrative: `PRD.md` v1.1.
- Approved testing seam: single **Assessment application boundary**; UI and infrastructure adapt to it.
- MVP success is soft-launch capability meeting PRD acceptance criteria (auth, nine Domains hybrid session, server scores, hybrid Insight, snapshot Report web+PDF, RLS, retake, disclaimers)—not psychometric publication quality.
- Suggested follow-on after this spec: `/to-tickets` (or equivalent) to slice implementation issues under `.scratch/iq-lab-mvp/issues/`.

---

## Comments

- Spec synthesized from design grill + grill-with-docs + PRD v1.1; testing seams approved by Product Owner (“OK seams”).
- Published to local markdown tracker with Status `ready-for-agent`.
