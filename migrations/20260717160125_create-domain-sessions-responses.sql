-- Domain Sessions + Responses for Assessment runner

CREATE TABLE IF NOT EXISTS public.domain_sessions (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_id TEXT NOT NULL,
  sequence_index INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'closed')),
  started_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  close_reason TEXT CHECK (close_reason IS NULL OR close_reason IN ('early_finish', 'timer')),
  raw_correct INT,
  raw_total INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, domain_id)
);

CREATE INDEX IF NOT EXISTS domain_sessions_attempt_id_idx
  ON public.domain_sessions (attempt_id);

CREATE INDEX IF NOT EXISTS domain_sessions_participant_id_idx
  ON public.domain_sessions (participant_id);

ALTER TABLE public.domain_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "domain_sessions_select_own"
  ON public.domain_sessions FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "domain_sessions_insert_own"
  ON public.domain_sessions FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "domain_sessions_update_own"
  ON public.domain_sessions FOR UPDATE TO authenticated
  USING (participant_id = (SELECT auth.uid()))
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "domain_sessions_delete_own"
  ON public.domain_sessions FOR DELETE TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_sessions TO authenticated;

CREATE TRIGGER domain_sessions_updated_at
  BEFORE UPDATE ON public.domain_sessions
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TABLE IF NOT EXISTS public.responses (
  id TEXT PRIMARY KEY,
  domain_session_id TEXT NOT NULL REFERENCES public.domain_sessions(id) ON DELETE CASCADE,
  attempt_id TEXT NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (domain_session_id, item_id)
);

CREATE INDEX IF NOT EXISTS responses_session_id_idx
  ON public.responses (domain_session_id);

ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "responses_select_own"
  ON public.responses FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "responses_insert_own"
  ON public.responses FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "responses_update_own"
  ON public.responses FOR UPDATE TO authenticated
  USING (participant_id = (SELECT auth.uid()))
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "responses_delete_own"
  ON public.responses FOR DELETE TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.responses TO authenticated;
