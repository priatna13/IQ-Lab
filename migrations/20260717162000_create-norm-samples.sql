-- Anonymized Norm Samples (Primary Completed only). No participant_id / attempt_id.

CREATE TABLE IF NOT EXISTS public.norm_samples (
  id TEXT PRIMARY KEY,
  age_band TEXT NOT NULL CHECK (age_band IN ('18_45', '46_plus')),
  age_bucket TEXT NOT NULL CHECK (age_bucket IN ('core_18_45', 'senior_46_plus')),
  content_version_id TEXT NOT NULL,
  norm_version TEXT NOT NULL,
  track TEXT NOT NULL,
  ability_profile JSONB NOT NULL,
  composite_index INT NOT NULL,
  iq_estimate INT NOT NULL,
  primary_completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS norm_samples_age_bucket_idx
  ON public.norm_samples (age_bucket);

CREATE INDEX IF NOT EXISTS norm_samples_content_version_idx
  ON public.norm_samples (content_version_id);

ALTER TABLE public.norm_samples ENABLE ROW LEVEL SECURITY;

-- Authenticated users may append samples (app only writes on Primary complete).
-- No SELECT for authenticated — research export via admin/CLI only.
CREATE POLICY "norm_samples_insert_authenticated"
  ON public.norm_samples
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

REVOKE ALL ON public.norm_samples FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.norm_samples FROM authenticated;
GRANT INSERT ON public.norm_samples TO authenticated;
