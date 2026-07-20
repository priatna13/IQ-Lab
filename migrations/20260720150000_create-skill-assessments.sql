-- Skill / keahlian bidang assessments (post cognitive 9-domain result)

CREATE TABLE IF NOT EXISTS public.skill_attempts (
  id TEXT PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_attempt_id TEXT NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  skill_content_version_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS skill_attempts_participant_id_idx
  ON public.skill_attempts (participant_id);

CREATE INDEX IF NOT EXISTS skill_attempts_source_attempt_id_idx
  ON public.skill_attempts (source_attempt_id);

CREATE UNIQUE INDEX IF NOT EXISTS skill_attempts_one_open_per_participant_idx
  ON public.skill_attempts (participant_id)
  WHERE status = 'in_progress';

CREATE UNIQUE INDEX IF NOT EXISTS skill_attempts_one_completed_per_source_field_idx
  ON public.skill_attempts (source_attempt_id, field_id)
  WHERE status = 'completed';

ALTER TABLE public.skill_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_attempts_select_own"
  ON public.skill_attempts FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "skill_attempts_insert_own"
  ON public.skill_attempts FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "skill_attempts_update_own"
  ON public.skill_attempts FOR UPDATE TO authenticated
  USING (participant_id = (SELECT auth.uid()))
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "skill_attempts_delete_own"
  ON public.skill_attempts FOR DELETE TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_attempts TO authenticated;

CREATE TRIGGER skill_attempts_updated_at
  BEFORE UPDATE ON public.skill_attempts
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.skill_responses (
  id TEXT PRIMARY KEY,
  skill_attempt_id TEXT NOT NULL REFERENCES public.skill_attempts(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (skill_attempt_id, item_id)
);

CREATE INDEX IF NOT EXISTS skill_responses_skill_attempt_id_idx
  ON public.skill_responses (skill_attempt_id);

ALTER TABLE public.skill_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_responses_select_own"
  ON public.skill_responses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.skill_attempts sa
      WHERE sa.id = skill_attempt_id AND sa.participant_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "skill_responses_insert_own"
  ON public.skill_responses FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.skill_attempts sa
      WHERE sa.id = skill_attempt_id AND sa.participant_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "skill_responses_update_own"
  ON public.skill_responses FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.skill_attempts sa
      WHERE sa.id = skill_attempt_id AND sa.participant_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.skill_attempts sa
      WHERE sa.id = skill_attempt_id AND sa.participant_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "skill_responses_delete_own"
  ON public.skill_responses FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.skill_attempts sa
      WHERE sa.id = skill_attempt_id AND sa.participant_id = (SELECT auth.uid())
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_responses TO authenticated;

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.skill_result_snapshots (
  id TEXT PRIMARY KEY,
  skill_attempt_id TEXT NOT NULL UNIQUE REFERENCES public.skill_attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_attempt_id TEXT NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  field_label TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_label TEXT NOT NULL,
  skill_content_version_id TEXT NOT NULL,
  raw_correct INT NOT NULL,
  raw_total INT NOT NULL,
  score INT NOT NULL,
  domain_alignment JSONB NOT NULL,
  insight_prose TEXT NOT NULL,
  frozen_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS skill_result_snapshots_source_attempt_id_idx
  ON public.skill_result_snapshots (source_attempt_id);

CREATE INDEX IF NOT EXISTS skill_result_snapshots_participant_id_idx
  ON public.skill_result_snapshots (participant_id);

ALTER TABLE public.skill_result_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_result_snapshots_select_own"
  ON public.skill_result_snapshots FOR SELECT TO authenticated
  USING (participant_id = (SELECT auth.uid()));

CREATE POLICY "skill_result_snapshots_insert_own"
  ON public.skill_result_snapshots FOR INSERT TO authenticated
  WITH CHECK (participant_id = (SELECT auth.uid()));

CREATE POLICY "skill_result_snapshots_delete_own"
  ON public.skill_result_snapshots FOR DELETE TO authenticated
  USING (participant_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, DELETE ON public.skill_result_snapshots TO authenticated;
