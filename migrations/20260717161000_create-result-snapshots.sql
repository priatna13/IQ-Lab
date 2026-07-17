-- Immutable Result Snapshots for completed Attempts

CREATE TABLE IF NOT EXISTS public.result_snapshots (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL UNIQUE REFERENCES public.attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL,
  content_version_id TEXT NOT NULL,
  norm_version TEXT NOT NULL,
  frozen_at TIMESTAMPTZ NOT NULL,
  ability_profile JSONB NOT NULL,
  composite_index INT NOT NULL,
  iq_estimate INT NOT NULL,
  rule_payload JSONB,
  insight_prose TEXT,
  action_plan_prose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS result_snapshots_participant_id_idx
  ON public.result_snapshots (participant_id);

ALTER TABLE public.result_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "result_snapshots_select_own"
  ON public.result_snapshots FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "result_snapshots_insert_own"
  ON public.result_snapshots FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

-- No update/delete for participants — immutability (admin/score correction later)

GRANT SELECT, INSERT ON public.result_snapshots TO authenticated;
