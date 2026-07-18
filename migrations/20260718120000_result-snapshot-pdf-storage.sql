-- Persist PDF report location (content still equals Result Snapshot)

ALTER TABLE public.result_snapshots
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_key TEXT;

-- Allow owner to attach PDF metadata only (scores remain app-immutable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'result_snapshots'
      AND policyname = 'result_snapshots_update_own'
  ) THEN
    CREATE POLICY "result_snapshots_update_own"
      ON public.result_snapshots FOR UPDATE TO authenticated
      USING (participant_id = (SELECT auth.uid()))
      WITH CHECK (participant_id = (SELECT auth.uid()));
  END IF;
END $$;

GRANT UPDATE ON public.result_snapshots TO authenticated;
