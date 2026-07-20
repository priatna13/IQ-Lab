-- Admin directory: email + display name from auth.users (SECURITY DEFINER).
-- InsForge roles: anon, authenticated, project_admin (no service_role).

CREATE OR REPLACE FUNCTION public.admin_user_directory()
RETURNS TABLE (
  id uuid,
  email text,
  display_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
    u.id,
    u.email::text,
    COALESCE(
      NULLIF(TRIM(u.profile ->> 'name'), ''),
      NULLIF(TRIM(u.metadata ->> 'name'), ''),
      split_part(u.email, '@', 1)
    )::text AS display_name
  FROM auth.users u;
$$;

COMMENT ON FUNCTION public.admin_user_directory() IS
  'Returns id, email, display_name for all auth users. Call from admin portal (project_admin / app allowlist).';

REVOKE ALL ON FUNCTION public.admin_user_directory() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_user_directory() FROM anon;
REVOKE ALL ON FUNCTION public.admin_user_directory() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_directory() TO project_admin;
