# Next.js app with InsForge as backend platform

MVP needs auth, Postgres+RLS, optional file storage for PDFs, and server-side LLM calls in one team-sized stack. We use Next.js for the product UI/API layer and InsForge for database, auth (email + Google), storage, and AI gateway (OpenRouter), instead of a separate SPA+custom API or generic Supabase/Neon split.

**Consequences:** Domain data and RLS live in InsForge migrations; secrets and scoring stay server-side; frontend env uses `NEXT_PUBLIC_INSFORGE_*` for anon access only.
