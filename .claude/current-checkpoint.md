# Checkpoint — Noise Gate

## Session Summary

Major session: applied pjstyle design system, rebuilt UI to nono.sh aesthetic, added bilingual (EN/ES) support throughout, restructured navigation with three section stubs (world, uruguay, la celeste). All 113 raw items are now processed. Deployed to Vercel on branch `pjstyled`, merged to main.

---

## Completed This Session

- [x] Applied `/stylethis` — nono-theme.css, nono components, ThemeProvider, TooltipProvider
- [x] Fixed font: swapped Inter → Geist (sans) + GeistMono — nono.sh uses GeistMono for everything including display headings
- [x] Fixed `/stylethis` skill step 3f to explicitly check for `Geist` by name and replace other sans fonts
- [x] Redesigned feed: nono.sh aesthetic — masonry columns, bordered cards, GeistMono, terracotta accent for source labels
- [x] Logo: changed `BRAND_COLOR` from hardcoded teal `#84d8ea` to `currentColor` — inherits text colour from context
- [x] Page title: "Signal" → "celeste" (lowercase, display size, GeistMono)
- [x] i18n: bilingual EN/ES support throughout
  - AI prompt updated to return `title_en`, `title_es`, `summary_en`, `summary_es` in one call
  - Only translates if `is_signal: true` — saves tokens on noise
  - `processed_items` schema updated: dropped `summary`, added `title_en`, `title_es`, `summary_en`, `summary_es`
  - `db push --accept-data-loss` used (not `migrate dev` — non-interactive env)
  - `LangProvider` context wraps the whole app in `layout.tsx`
  - `LangToggle` (EN/ES buttons) in navbar
  - `Subtitle` component switches language
  - `FeedClient` reads from context
- [x] Navigation: `SiteNav` component with WORLD · URUGUAY · LA CELESTE
  - "la celeste" → `/` (temporary, TODO comment in SiteNav.tsx)
  - world (`/world`) and uruguay (`/uruguay`) are stubs
- [x] RSS feed: unchanged URL `/api/rss`, uses `titleEn` + `summaryEn` — Feedly subscription still works
- [x] All 113 raw items processed (13 signal, 100 noise)
- [x] Mobile layout broken — noted, fix next session

---

## Current DB State

- 113 raw items, all processed
- 13 signal items with bilingual titles and summaries
- Schema: `processed_items` has `title_en`, `title_es`, `summary_en`, `summary_es`

---

## Known Issues / TODOs

- **Mobile layout broken** — feed too wide on mobile, fix next session
- **`/world` stub** — needs implementation (see vision below)
- **`/uruguay` stub** — needs implementation (see vision below)
- **`/celeste`** — currently pointing to `/`, needs its own route when implemented
- **RSS feeds** — currently one feed in EN only; should expand (see vision below)

---

## Vision for Next Phases

### Three-Section Architecture

**`/world`** — General world news, noise filtered by AI
- New ingest sources (international RSS feeds, not football-specific)
- Source filter: non-Uruguay-specific sources
- Language toggle works normally (EN/ES)

**`/uruguay`** — Uruguay news, noise filtered by AI
- New ingest sources (Uruguayan general news — not football)
- Source filter: Uruguayan general news sources
- Language toggle works normally (EN/ES)

**`/celeste`** — Uruguay men's national team (current feed)
- Move existing feed from `/` to `/celeste`
- Sources: AUF, Montevideo Portal, MercoPress (current)
- "la celeste" always stays as the name (Spanish, never translated)
- Language toggle affects content (summaries/titles), not the section name

### Data Layer Changes Needed
- New `source` values for world and uruguay sections
- Possibly a `section` field on `raw_items` to route items to the right page
- Or filter by source domain at query time

### RSS Feed Evolution
- Currently: one feed at `/api/rss` in EN
- Should become per-section feeds: `/api/rss/world`, `/api/rss/uruguay`, `/api/rss/celeste`
- Per-language variants: `/api/rss/celeste/en` and `/api/rss/celeste/es` (or `?lang=es` param)
- Keep `/api/rss` as alias for backwards compat (Feedly subscribers)

---

## Key Technical Decisions

- **Prisma 7 non-interactive migrations**: use `prisma db push --accept-data-loss`, NOT `migrate dev`
- **`PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION`**: real Prisma env var for AI agent consent — but still needs `--accept-data-loss` flag for non-interactive env
- **Geist font**: nono.sh uses GeistMono for everything — display headings, body, UI. Import `Geist` (sans) AND `Geist_Mono` from `next/font/google`
- **`currentColor` on Logo SVGs**: makes logo inherit text colour from context — works with both dark/light themes
- **Gemini 500 errors**: transient rate limiting, not content failures. Items marked `processed = false` — cron retries. Run orchestrator multiple times to drain backlog.
- **Gemini model**: `gemini-3.1-flash-lite` — `gemini-2.0-flash` has zero free tier quota on this account
- **Prisma client location**: `src/generated/prisma` — must run `prisma generate` after schema changes AND restart dev server (Turbopack caches old client)

---

## File Structure (key files)

```
src/app/layout.tsx              — ThemeProvider, LangProvider, SiteNav, fonts
src/app/page.tsx                — Home (la celeste feed, currently at /)
src/app/world/page.tsx          — Stub
src/app/uruguay/page.tsx        — Stub
src/app/nono-theme.css          — Design tokens (source of truth for colours)
src/app/globals.css             — Imports nono-theme.css, removes ShadCN defaults
src/components/SiteNav.tsx      — Navbar with nav links + lang/theme toggles
src/components/FeedClient.tsx   — Client component for masonry feed
src/components/LangProvider.tsx — EN/ES context
src/components/LangToggle.tsx   — EN/ES toggle buttons
src/components/Subtitle.tsx     — Language-aware subtitle
src/components/Logo.tsx         — SVG logo, uses currentColor
src/components/nono/            — Nono design system components
src/lib/ai/filter.ts            — Gemini filter, returns bilingual fields
src/lib/process.ts              — Orchestrator
src/scripts/reset-processed.ts  — Utility: clears processed_items, resets raw flags
```

---

## npm Scripts

```
npm run dev
npm run test:ingest
npm run test:scrapers
npm run test:filter
npm run test:process      ← also used to manually reprocess items
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind v4 + Shadcn/ui + nono-theme.css, GeistMono, dark/light |
| DB | Neon (Postgres) |
| ORM | Prisma 7 + `@prisma/adapter-neon` |
| AI | Gemini `gemini-3.1-flash-lite` |
| Cron | Vercel cron (daily 07:00 UTC) |
| Hosting | Vercel |
