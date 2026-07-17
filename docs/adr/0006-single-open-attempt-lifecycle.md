# Single Open Attempt; only Completed triggers retake cooldown

Participants need pause/resume across days without losing work, and Retake Policy must not punish mid-assessment abandonment. We allow at most one Open Attempt (`in_progress`) per Participant; resume continues that Attempt. Explicit abandon → `abandoned` (no full Report, no 90-day cooldown). Only `completed` (all nine Domains scored + Insight) starts retake cooldown; the first Completed Attempt is Primary. Historical Completed Attempts remain viewable during cooldown.

**Considered options:** abandon also cools down; multiple parallel Open Attempts; partial Report as completed.

**Consequences:** Start-assessment must reject if Open Attempt exists or retake cooldown is active; UI needs clear Continue vs Cancel assessment; norm pipeline uses Completed (Primary) only.
