# Checkpoint — Noise Gate POC 1.0

## Session Summary

POC 1.0 is complete and deployed to Vercel. Cron is confirmed working — ran successfully on May 15, ingested from all 3 sources, processed via Gemini, signal items showing on feed. CRON_SECRET was missing from Vercel env vars (now fixed). Two tasks remain: RSS feed endpoint and Task 8 styling. Starting RSS next.

---

## Completed

- [x] Next.js app scaffolded with TypeScript, Tailwind, App Router, `src/` dir, `@/*` import alias
- [x] Shadcn/ui initialized — Radix + Nova preset, Tailwind v4
- [x] Neon DB, Prisma 7, migrations, Prisma client at `src/generated/prisma`
- [x] `src/lib/db.ts` singleton with `PrismaNeon` adapter
- [x] All 3 ingest modules (MercoPress RSS, AUF scraper, Montevideo Portal scraper)
- [x] `src/lib/ai/filter.ts` — Gemini `gemini-3.1-flash-lite` signal/noise filter
- [x] `src/lib/process.ts` — orchestrator
- [x] `src/app/api/cron/ingest/route.ts` — cron route, `Authorization: Bearer <CRON_SECRET>`
- [x] `vercel.json` — cron schedule `0 7 * * *`
- [x] `src/app/page.tsx` — frontend feed, dark mode, Inter font, ℹ️ capture date tooltip
- [x] `build` script: `prisma generate && next build`
- [x] README rewritten, boilerplate SVGs removed
- [x] Deployed to Vercel — cron confirmed working
- [x] Logo components: `NoiseGateSymbol`, `NoiseGateWordmark`, `NoiseGateSlogan`, `NoiseGateLogo` in `src/components/Logo.tsx`
- [x] `public/favicon.svg` using the symbol mark
- [x] `CRON_SECRET` added to Vercel environment variables

## Uncommitted Changes

- `src/components/Logo.tsx` — new file
- `public/favicon.svg` — new file
- `src/app/page.tsx` — uses `NoiseGateLogo`, capture date tooltip
- `src/app/layout.tsx` — favicon metadata
- `src/app/favicon.ico` — deleted
- `.claude/current-checkpoint.md` — updated

---

## Next Up

1. **RSS feed** — `/api/rss` route returning RSS/Atom XML of signal items. ~20 min.
2. **Task 8 — Styling** — distinct source badge colours, mobile check, optional cards. ~1 hour.

---

## Key Technical Decisions

- **Prisma 7** — requires driver adapter; using `PrismaNeon` from `@prisma/adapter-neon`
- **`db.ts`** imports from `@/generated/prisma/client`
- **`.env.local`** — `tsx` loads it via `--env-file .env.local` flag
- **Gemini model: `gemini-3.1-flash-lite`** — `gemini-2.0-flash` has zero free tier quota on this account (limit: 0). `gemini-3.1-flash-lite` has 15 RPM / 250K TPM / 500 RPD free tier.
- **Cron secret**: Vercel sends as `Authorization: Bearer <secret>` — route checks `request.headers.get('authorization')`
- **Montevideo Portal export name**: `ingestMontevideo` (not `ingestMontevideoPortal`)
- **Font**: Inter via `next/font/google`, variable `--font-inter`, wired directly in `globals.css` body rule
- **Dark mode**: forced via `dark` class on `<html>` in layout.tsx
- **Vercel build**: `prisma generate && next build` — Prisma client is gitignored, must be generated at build time
- **DEP0169 warning**: `url.parse()` deprecation from transitive dep (`rss-parser`). Harmless, can't fix without upstream change.

## Scraper Details

- **AUF** (`https://www.auf.org.uy/mayores/`) — `article.tarjeta`, title from `hgroup > h3 > a`, date from `hgroup > h4`, body from first `p`. URL relative, prepend `https://www.auf.org.uy`. iso-8859-1 via `TextDecoder`.
- **Montevideo Portal** (`https://www.montevideo.com.uy/categoria/Deportes-94`) — `article.noticia`, title from `.content h2.title`, body from `.content p.text`, URL from `a.foto` href. No date — `publishedAt` null.
- **MercoPress** — RSS feed, standard `rss-parser` fields. Uses Node `http` module directly so doesn't appear in Vercel external API log (but works fine).

---

## npm Scripts

```
npm run dev           # local dev server
npm run test:ingest   # test MercoPress ingest
npm run test:scrapers # test AUF + Montevideo Portal scrapers
npm run test:filter   # test Gemini filter against 5 DB items
npm run test:process  # run full orchestrator against all unprocessed items
```

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind v4 + Shadcn/ui, Inter font, dark mode |
| DB | Neon (Postgres, free tier) |
| ORM | Prisma 7 + `@prisma/adapter-neon` |
| AI | Gemini `gemini-3.1-flash-lite` via `@google/genai` |
| Cron | Vercel cron (daily 07:00 UTC) |
| Node | v22.22.2 |

---

## Neon Connection

- Project: `noisegate` (ID: `still-butterfly-14962380`)
- Host: `ep-royal-sun-akfkaz66-pooler.c-3.us-west-2.aws.neon.tech`
- DB: `neondb`, user: `neondb_owner`
- Connection string in `.env.local` as `DATABASE_URL`

---

## User Preferences

- Hold position when confident — user argues to get convinced, not to shut down discussion
- No sycophantic agreement when wrong
- Terse responses, no trailing summaries
- Ask before cascading changes across multiple files
- One decision at a time when unblocking errors
- No speculation presented as fact
