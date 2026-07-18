# IQ-Lab — Design System & Visual Spec

**Status:** Grill locked · **R1 implemented in code** (await separate deploy approve)  
**Last updated:** 2026-07-18  
**Product:** IQ-Lab — asesmen multi-domain (self-dev / karir), UI Bahasa Indonesia  
**Stack UI:** Next.js App Router + Tailwind CSS  
**Sources:** grill session (ui-ux-pro-max + grill-me), PRD v1.1, a11y baseline in app  

> **Governance**  
> - Patokan visual & UX untuk agent dan manusia.  
> - **Jangan deploy** tanpa approve eksplisit pemilik produk.  
> - **Jangan implement visual** menyimpang dari dokumen ini tanpa update grill / revisi dokumen.  
> - Domain logic (Assessment boundary) tidak diubah oleh restyle UI.

---

## 1. Product UI goals

| Goal | Implication |
|------|-------------|
| Fun | Warna hidup, card soft, micro-interaction ringan |
| Friendly | Copy hangat, CTA jelas, form tidak menakutkan |
| Futuristic | Mesh/gradient, soft neon accent, glow tipis |
| User-friendly | Kontras cukup, mobile-first, runner nanti tetap tenang |
| Trustworthy | Bukan kids-app; skor & disclaimer tetap legible & jujur |

**Bukan:** dark OLED full, font kartun (Fredoka), glass di mana-mana, confetti, emoji sebagai ikon struktural.

---

## 2. Locked decisions (grill)

| # | Topic | Decision | Code name |
|---|--------|----------|-----------|
| 1 | Color mode | **Light-first futuristic** | `theme.light-first` |
| 2 | Typography | **Plus Jakarta Sans** (heading + body) | `type.jakarta` |
| 3 | Accents | **Soft neon** — teal primary + violet/sky secondary | `accent.soft-neon` |
| 4 | Motion | **Calm delight** (150–250ms); runner almost static | `motion.calm` |
| 5 | Scope round 1 | Shell + landing + auth + dashboard + **hasil** | `scope.r1` |
| 6 | Surfaces | **Soft solid cards**, large radius, soft shadow + thin glow | `surface.soft-solid` |
| 7 | Ability profile viz | **Enhanced horizontal bars** (no radar in R1) | `chart.bars` |
| 8 | Decoration | **Soft mesh + orbs** (landing/dashboard heavier) | `deco.mesh-orbs` |
| 9 | Mobile | **Mobile-first plan** (§6) | `layout.mobile-first` |
| 10 | Deploy | **Never without explicit owner approve** | `gov.no-auto-deploy` |

### Out of scope — round 1

- Domain runner deep restyle (round 2; keep focus-first)
- Legal/FAQ full visual overhaul (functional links OK; light token inheritance only)
- Figural images / multi-phase memory UI (content track B4)
- Dark mode toggle
- Radar/spider chart
- Particle systems / heavy 3D

### Round 2 (planned, not approved to build yet)

- Domain runner: calm chrome, large touch targets, minimal motion
- Optional radar chart if product asks
- FAQ/legal skin to match tokens lightly

---

## 3. Color tokens

Use semantic names in Tailwind (`lab.*`) and CSS variables where useful.

### 3.1 Core (light-first)

| Role | Hex | Usage |
|------|-----|--------|
| Navy / ink | `#0f2744` | Primary text, headings |
| Navy soft | `#1a3a5c` | Secondary headings |
| Teal primary | `#0d9488` | CTA, links, progress fill |
| Teal deep | `#0f766e` | CTA gradient end, focus ring |
| Mint | `#ccfbf1` | Soft surfaces, selected chips |
| Violet | `#8b5cf6` | Secondary futuristic accent |
| Sky | `#38bdf8` | Tertiary accent / mesh |
| Coral (sparingly) | `#fb7185` | Optional highlight, not primary CTA |
| Sun | `#fbbf24` | Warning/badge soft |
| Cream / mist bg | `#f0f9ff` / `#f8fafc` | Page background base |
| White card | `#ffffff` @ ~90–100% | Cards |
| Border | `slate-200` / white 80% | Card borders |
| Destructive | `#dc2626` | Errors, destructive actions |
| Amber surface | existing disclaimer blocks | Legal honesty callouts |

### 3.2 Gradients & glow

- **Hero mesh:** radial teal + coral + sky at low opacity on light base (fixed background OK).
- **CTA:** `from-lab-teal to-lab-teal-deep`.
- **Focus/glow:** ring ~4px `rgba(13, 148, 136, 0.15)`.
- **Bar fills (results):** teal → slightly deeper teal; optional per-domain hue shift within accessible contrast.

### 3.3 Contrast rules

- Body text on white/mist: **≥ 4.5:1**.
- Do not use violet or sky alone for small body text on light bg.
- Error/success never color-only (icon or text).

---

## 4. Typography

| Role | Family | Weight | Notes |
|------|--------|--------|-------|
| Display / H1–H2 | **Plus Jakarta Sans** | 600–700 | Slightly rounded, modern trust |
| Body / UI | **Plus Jakarta Sans** | 400–500 | Same family for coherence |
| Mono (timer, scores) | `ui-monospace` / `font-mono` | 500–600 | Tabular nums for scores |

### Scale (mobile → desktop)

| Element | Mobile | md+ |
|---------|--------|-----|
| Hero H1 | `text-3xl`–`text-4xl` leading-tight | `text-5xl` |
| Section H2 | `text-xl`–`text-2xl` | `text-2xl`–`text-3xl` |
| Body | `text-base` (16px min) | `text-base`–`text-lg` |
| Caption / meta | `text-xs`–`text-sm` | `text-sm` |
| Line length | ~35–60 ch mobile | ~60–75 ch |

Load via `next/font/google` (`Plus_Jakarta_Sans`) — avoid blocking FOIT; `display: swap`.

---

## 5. Layout, shape, elevation

### Shape

- Cards / panels: **`rounded-2xl`** (or `1.25rem`).
- Buttons / inputs: **`rounded-xl`**.
- Chips / badges: **`rounded-full`**.

### Elevation

| Token | Use |
|-------|-----|
| `shadow-soft` | Default card |
| `shadow-lift` | Hover card / primary emphasis |
| `shadow-glow` | Focus / selected CTA companion |

### Surfaces (soft solid — not full glass)

```
.card = white/90–100 + border white/80 or slate-200 + shadow-soft
.card-hover = slight -translate-y + shadow-lift + teal border/20
```

Glass optional **only** on 1–2 hero chips, not forms.

### Spacing rhythm

- Base 4/8: `gap-2/3/4`, section `py-8` mobile → `py-12`/`py-14` desktop.
- Page max width: content **`max-w-4xl`**, forms **`max-w-md`–`max-w-lg`**.

---

## 6. Mobile-first plan (anti-berantakan)

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| base | &lt;640px | Single column; `px-4`; full-width CTAs |
| sm | ≥640px | Comfortable gaps; some 2-col where safe |
| md | ≥768px | Header expanded; hero richer; dashboard multi-card |
| lg | ≥1024px | Full mesh/orbs expression; `max-w-4xl` |

### Rules

1. **No horizontal scroll** at 375px.
2. **Touch targets ≥ 44×44px** (min-h-11 on buttons/inputs).
3. **Orbs:** `pointer-events-none`; lower opacity/size on mobile; never cover primary CTA.
4. **Grids:** 1 col default → 2/3 col only from `md` (or `sm` for score pair).
5. **Nav:** wrap or compact; avoid 6 cramped inline links on phone.
6. **Results bars:** label wraps; bar `w-full`; scores `tabular-nums`.
7. **Safe area:** padding for fixed footers if any (runner R2).
8. **`prefers-reduced-motion`:** kill float/shimmer; keep essential opacity fades optional off.

### Per surface (round 1)

| Surface | Mobile behavior |
|---------|-----------------|
| Header | Logo + compact actions; stack/wrap |
| Footer | Vertical stack; link wrap |
| Landing | Hero stack; feature cards 1→3 col |
| Auth | Single column form; Google then email |
| Dashboard | Card list 1 col; full-width action buttons |
| Results | Score pair 1→2 col; full-width bars & CTAs |

### QA checklist (visual sign-off)

- [ ] 375×812 — landing, auth, dashboard, results  
- [ ] 390×844 — same  
- [ ] 768 portrait  
- [ ] No horizontal overflow  
- [ ] Primary CTA reachable without zoom  
- [ ] Reduced motion OK  
- [ ] Zoom ~200% still usable  

---

## 7. Motion

| Context | Allowed | Forbidden |
|---------|---------|-----------|
| Landing / dashboard | Fade-up sections, hover lift 150–250ms, orb float very slow | Parallax heavy, infinite pulse on CTAs |
| Auth / results | Light hover; bar fill ease-out once | Stagger noise, confetti |
| Runner (R2) | Almost none; timer tick only | Decorative motion near items |
| Global | `prefers-reduced-motion: reduce` → minimal | Ignoring reduced motion |

Easing: enter ease-out; exit slightly faster; prefer `transform`/`opacity` only.

---

## 8. Iconography & illustration

- **SVG only** (stroke consistent ~1.5–2px). No emoji as structural icons.
- One set/style across app (custom minimal set or Lucide-compatible stroke).
- Decorative orbs = CSS/SVG blobs, not photos.

---

## 9. Component inventory (round 1)

When implementing, prefer shared primitives under `src/components/ui/` (names illustrative):

| Primitive | Responsibility |
|-----------|----------------|
| `PageShell` | Header + `main#main-content` + footer; width variants |
| Button styles | `lab-btn-primary` / `secondary` / `ghost` (min touch) |
| Card | `lab-card` / `lab-card-hover` |
| Input | `lab-input` + label pattern from a11y baseline |
| Badge | Soft neon chips |
| Icons | `src/components/ui/icons.tsx` |

**Existing to restyle (not rewrite logic):**

- `site-header.tsx`, `site-footer.tsx`
- `app/page.tsx` (landing)
- `masuk` / `daftar` + `auth-form`, `google-button`
- `dashboard/page.tsx`
- `result-report.tsx` + hasil page
- `globals.css`, `tailwind.config.ts`, root `layout.tsx` (font)

**Keep behavior:** skip link, `lang="id"`, focus-visible, form alerts, disclaimers legal.

---

## 10. Page-level notes

### Landing

- Hero: badge → H1 → supporting → dual CTA.
- Honesty card (amber) remains prominent.
- Feature bento/cards 3 themes: 9 domain, dual track, free MVP.
- Mesh + 2–3 orbs behind content.

### Auth

- Calm surface; less orb noise than landing.
- Clear hierarchy Google vs email.
- Links to `/syarat` + `/privasi` retained.

### Dashboard

- Friendly empty / in-progress / completed states.
- Primary action one per card.
- Privacy block secondary.

### Results

- Norm badge + disclaimer first (trust).
- Big composite + IQ cards.
- Enhanced bars for 9 domains (animated fill once if motion allowed).
- Insight / action plan cards; PDF CTA clear.

---

## 11. Copy tone (UI)

- BI, warm, second person “Anda”.
- Fun **without** slang berlebihan or meme.
- Never overclaim IQ resmi / IST / rekrutmen (PRD).
- CTA examples: “Mulai gratis”, “Lanjut asesmen”, “Lihat profil saya”.

---

## 12. Accessibility (inherits C1)

Must preserve/extend:

- Skip link → `#main-content`
- Visible `:focus-visible`
- Labeled inputs, `role="alert"` on errors
- Touch targets ≥44px
- Contrast AA body text
- Reduced motion

Full Lighthouse pass remains operator checklist (`docs/A11Y-AND-ANALYTICS.md`).

---

## 13. Implementation gates

| Gate | Rule |
|------|------|
| Design context | This file is source of truth for visual R1 |
| Start build | Only after owner says **`GO BUILD`** (or equivalent) |
| Deploy | Only after separate explicit approve |
| Drift | If product changes mind, **update this file first**, then code |
| Domain code | No scoring/auth rule changes for pure visual work |

### Suggested commit message (when built)

```
feat(ui): light-first futuristic visual system (design R1)

Apply DESIGN.md tokens to shell, landing, auth, dashboard, and results with mobile-first layout.
```

---

## 14. Related docs

| Doc | Role |
|-----|------|
| `PRD.md` | Product scope / FR |
| `CONTEXT.md` | Domain language |
| `docs/MVP-COMPLETION-REPORT.md` | What shipped functionally |
| `.scratch/post-mvp-followups/BACKLOG.md` | Non-visual follow-ups |
| `docs/A11Y-AND-ANALYTICS.md` | A11y + analytics + PDF storage |
| `docs/SOFT-LAUNCH-OPS.md` | Ops A1–A5 |

---

## 15. Decision log

| Date | Decision |
|------|----------|
| 2026-07-18 | Grill locked rows §2; mobile plan §6; this file created as durable design context |
| 2026-07-18 | Owner `GO BUILD` — visual R1 implemented (shell, landing, auth, dashboard, results) |
| — | Deploy pending separate explicit approve |

---

*End of DESIGN.md — update this document before diverging visually.*
