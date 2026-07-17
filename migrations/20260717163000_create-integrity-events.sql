-- Light integrity signals (blur/tab). Never auto-invalidate Attempt in MVP.

CREATE TABLE IF NOT EXISTS public.integrity_events (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_session_id TEXT REFERENCES public.domain_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('blur', 'visibility_hidden', 'focus_return')),
  recorded_at TIMESTAMPTZ NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS integrity_events_attempt_id_idx
  ON public.integrity_events (attempt_id);

CREATE INDEX IF NOT EXISTS integrity_events_participant_id_idx
  ON public.integrity_events (participant_id);

ALTER TABLE public.integrity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integrity_events_select_own"
  ON public.integrity_events FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "integrity_events_insert_own"
  ON public.integrity_events FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "integrity_events_delete_own"
  ON public.integrity_events FOR DELETE TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, DELETE ON public.integrity_events TO authenticated;
