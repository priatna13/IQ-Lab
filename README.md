# IQ-Lab

Asesmen multi-domain untuk pengembangan diri & arah karir (inspired-by kerangka multi-faktor; **bukan** IST resmi).

## Stack

- **Next.js 15** (App Router)
- **InsForge** — Auth, Postgres, Storage, AI gateway
- Domain seam: **Assessment application boundary** (`src/domain/assessment`)

## Setup

1. Node 20+ recommended.
2. Copy env:

   ```bash
   cp .env.example .env.local
   ```

3. Link InsForge (project already linked if `.insforge/project.json` exists):

   ```bash
   npx @insforge/cli login
   npx @insforge/cli link --project-id <project-id>
   npx @insforge/cli secrets get ANON_KEY
   ```

   Set `NEXT_PUBLIC_INSFORGE_URL` (oss_host) and `NEXT_PUBLIC_INSFORGE_ANON_KEY` in `.env.local`.  
   Server-only: `INSFORGE_API_KEY` (never `NEXT_PUBLIC_*`).

4. Install & run:

   ```bash
   npm install
   npm test
   npm run dev
   ```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm test` | Vitest (Assessment boundary) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |

## Soft-launch ops

Config yang **bukan** ticket MVP (OAuth Google, OpenRouter, SMTP, hosting):  
→ **[`docs/SOFT-LAUNCH-OPS.md`](./docs/SOFT-LAUNCH-OPS.md)**  
→ Readiness: `GET /api/ops/readiness`  
→ A11y / analytics / PDF storage: **[`docs/A11Y-AND-ANALYTICS.md`](./docs/A11Y-AND-ANALYTICS.md)**  
→ Backlog: [`.scratch/post-mvp-followups/BACKLOG.md`](./.scratch/post-mvp-followups/BACKLOG.md)

## Docs

- `PRD.md` — product scope
- `CONTEXT.md` — domain language
- `docs/adr/` — decisions
- `docs/SOFT-LAUNCH-OPS.md` — Track A ops checklist
- `.scratch/iq-lab-mvp/` — MVP spec & tickets (done)
- `.scratch/item-bank-v2/` — Item Bank Content Version v2
- Active Item Bank for new Attempts: **`cv_mvp_v2`** (v1 placeholder remains loadable for old pins)

## Security

- Do not commit `.env.local` or `.insforge/`
- Rotate any API keys that were pasted into chat
