-- Assessment Attempts (one open Attempt per Participant enforced in app + partial unique index)

CREATE TABLE IF NOT EXISTS public.attempts (
  id TEXT PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('explore', 'career')),
  content_version_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS attempts_participant_id_idx
  ON public.attempts (participant_id);

CREATE INDEX IF NOT EXISTS attempts_participant_status_idx
  ON public.attempts (participant_id, status);

-- At most one open Attempt per participant
CREATE UNIQUE INDEX IF NOT EXISTS attempts_one_open_per_participant_idx
  ON public.attempts (participant_id)
  WHERE status = 'in_progress';

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attempts_select_own"
  ON public.attempts
  FOR SELECT
  TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "attempts_insert_own"
  ON public.attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "attempts_update_own"
  ON public.attempts
  FOR UPDATE
  TO authenticated
  USING (participant_id = (SELECT auth.uid()))
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "attempts_delete_own"
  ON public.attempts
  FOR DELETE
  TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;

CREATE TRIGGER attempts_updated_at
  BEFORE UPDATE ON public.attempts
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
