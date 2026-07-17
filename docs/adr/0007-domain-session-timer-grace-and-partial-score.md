# Domain Session ends on server timer; short Grace Window; missing Responses score empty

Within a Domain, time limits must mean the same for everyone, but mobile networks drop the last submit. When the server clock hits `ends_at`, a short Grace Window accepts only in-flight Responses already chosen—not new work. After grace, the Domain Session closes: present Responses are scored; items with no server Response count as empty/incorrect. The Attempt continues; we do not force domain retry or abandon the whole Attempt.

**Consequences:** Client must autosave each Response immediately; UI copy should explain that unanswered items after time count as wrong; scoring jobs key off server receipt time, not client clock.
