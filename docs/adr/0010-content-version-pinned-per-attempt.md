# Content Version is pinned when an Attempt is created

An Attempt may span days. Publishing a better Item Bank mid-flight must not change the instrument under an in-progress Participant. Each Attempt stores a Content Version (Item Bank snapshot/version id) at creation; every Domain Session in that Attempt draws Items only from that version. New Attempts pick up the latest published bank.

**Consequences:** Scoring and item analytics are version-aware; deactivating bad items does not rewrite open Attempts; migrations need immutable item rows or snapshot tables, not in-place destructive edits to live keys used by old versions.
