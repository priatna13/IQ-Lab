# P1 Google OAuth log — updated 2026-07-20

**Scope:** WORK-RECAP §9 P1 (A1)  
**Verdict soft-launch:** **done** (ops path verified local + production)

## Checklist

| Item | Status | Evidence |
|------|--------|----------|
| P1.1 SOFT-LAUNCH-OPS A1 + InsForge Google | **pass** | `public-config` / PKCE returns Google `authUrl` with real `client_id` |
| P1.2 Redirect allowlist | **pass** | localhost + `iqlab.insforge.site` + `6a6g33ic.insforge.site` in `insforge.toml` |
| P1.3 Browser E2E to Google consent | **pass (automated path)** | PKCE start **200** + Google host for all three redirect URIs; prod `/masuk` & `/daftar` Google CTA present; callback error redirects **307** |
| P1.4 BACKLOG A1 | **done** | Soft-launch ops closed 2026-07-20 |

## Automated probes (2026-07-20)

| redirect_uri | oauth start | has authUrl | Google host response |
|--------------|-------------|-------------|----------------------|
| `http://localhost:3000/api/auth/callback` | 200 | yes | 302 (normal) |
| `https://iqlab.insforge.site/api/auth/callback` | 200 | yes | 302 (normal) |
| `https://6a6g33ic.insforge.site/api/auth/callback` | 200 | yes | 302 (normal) |

- Google CTAs on production: **yes** (`/masuk`, `/daftar`)
- Callback without code / access_denied → **307** to `/masuk?error=…`
- Interactive Google **account selection + consent** is not automatable (requires a real Google account in a browser). Soft-launch accepts ops-verified path + email E2E as auth gate.

## App UI

| Route | Google CTA |
|-------|------------|
| `/masuk` | **Lanjut dengan Google** |
| `/daftar` | **Daftar dengan Google** |

## Human optional (first real user)

If you want a personal sanity check (not blocking soft-launch closeout):

1. Open `https://iqlab.insforge.site/masuk` → **Lanjut dengan Google**
2. Expect session → onboarding or dashboard

Fallback: email/password fully verified on production (P5).

## Status A1 summary

| Layer | Status |
|-------|--------|
| Kode app | ready |
| InsForge provider + Google client | **configured & responding** |
| Allowlist local + production | **applied** |
| Path to Google consent page | **verified** |
| Soft-launch A1 | **done** |
