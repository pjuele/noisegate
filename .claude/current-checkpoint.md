# Checkpoint — Noise Gate POC 1.0

## Session Summary

Completed Tasks 5, 6, and 7: Gemini AI filter, cron route + orchestrator, and frontend feed. The full pipeline is working end-to-end locally. Ready to deploy to Vercel.

---

## Completed

- [x] Next.js app scaffolded with TypeScript, Tailwind, App Router, `src/` dir, `@/*` import alias
- [x] Shadcn/ui initialized — Radix + Nova preset (Lucide / Geist), Tailwind v4
- [x] Node upgraded to v22.22.2 via nvm; `.nvmrc` created with `22`
- [x] Neon project created (`noisegate`, project ID: `still-butterfly-14962380`)
- [x] `.env.local` created with `DATABASE_URL` pointing to Neon pooler endpoint
- [x] Prisma 7 installed and configured (`prisma.config.ts` reads from `.env.local`)
- [x] DB schema defined: `raw_items` and `processed_items` models
- [x] Migration `20260506220759_init` applied to Neon — both tables live
- [x] Prisma client generated at `src/generated/prisma`
- [x] `CLAUDE.md` created at project root
- [x] `@prisma/adapter-neon` installed; `src/lib/db.ts` singleton uses `PrismaNeon` adapter
- [x] `src/lib/ingest/mercopress.ts` — RSS ingest, deduped by URL
- [x] `src/lib/ingest/auf.ts` — cheerio scraper for `auf.org.uy/mayores/`
- [x] `src/lib/ingest/montevideo-portal.ts` — cheerio scraper for Montevideo Portal sports (exports `ingestMontevideo`, NOT `ingestMontevideoPortal`)
- [x] `tsx` installed as dev dependency
- [x] Test scripts: `src/scripts/test-mercopress.ts`, `src/scripts/test-scrapers.ts`
- [x] `@google/genai` installed
- [x] `src/lib/ai/filter.ts` — Gemini AI signal/noise filter, uses `gemini-3.1-flash-lite`
- [x] `src/scripts/test-filter.ts` + `npm run test:filter`
- [x] `src/lib/process.ts` — orchestrator: fetches unprocessed raw_items, filters each, writes to processed_items, marks raw_item processed
- [x] `src/app/api/cron/ingest/route.ts` — cron route, protected by `Authorization: Bearer <CRON_SECRET>` header
- [x] `vercel.json` — cron schedule `0 7 * * *`
- [x] `src/scripts/test-process.ts` + `npm run test:process`
- [x] `src/app/page.tsx` — frontend feed, React Server Component, queries processed_items where is_signal=true
- [x] Inter font, dark mode forced via `dark` class on `<html>`
- [x] 34 raw_items processed: 8 signal, 26 noise, 0 errors

---

## Next Up

**Deploy to Vercel**
1. Push repo to GitHub (new repo)
2. Connect to Vercel (import project)
3. Add env vars in Vercel dashboard: `DATABASE_URL`, `GEMINI_API_KEY`, `CRON_SECRET`
4. Verify cron job appears in Vercel project settings
5. Manually trigger the cron route once to verify end-to-end in production

---

## Key Technical Decisions

- **Prisma 7** — requires driver adapter; using `PrismaNeon` from `@prisma/adapter-neon`
- **`db.ts`** imports from `@/generated/prisma/client` (not `@/generated/prisma` — no index.ts in Prisma 7 output)
- **`.env.local`** — `tsx` loads it via `--env-file .env.local` flag
- **`tsx`** resolves `@/` path aliases from `tsconfig.json` natively
- **Gemini model: `gemini-3.1-flash-lite`** — `gemini-2.0-flash` has zero free tier quota on this account (limit: 0, not exhausted). `gemini-3.1-flash-lite` has 15 RPM / 250K TPM / 500 RPD free tier.
- **Cron secret**: Vercel sends it as `Authorization: Bearer <secret>` — route checks `request.headers.get('authorization')`
- **Montevideo Portal export name**: `ingestMontevideo` (not `ingestMontevideoPortal`)
- **Font**: Inter via `next/font/google`, variable `--font-inter`, wired directly in `globals.css` body rule (CSS variable chain through Shadcn theme was broken)
- **Dark mode**: forced via `dark` class on `<html>` in layout.tsx

## Scraper Details

- **AUF** (`https://www.auf.org.uy/mayores/`) — `article.tarjeta`, title from `hgroup > h3 > a`, date from `hgroup > h4` (format: "10 ABR 2026"), body from first `p`. URL is relative, prepend `https://www.auf.org.uy`. Page is iso-8859-1, decoded via `TextDecoder`.
- **Montevideo Portal** (`https://www.montevideo.com.uy/categoria/Deportes-94`) — `article.noticia`, title from `.content h2.title`, body from `.content p.text` (often absent), URL from `a.foto` href (absolute). No date in listing — `publishedAt` stored as null.
- **MercoPress** — RSS feed, standard `rss-parser` fields.

## Known Issue: Montevideo Portal Infinite Scroll

The current scraper only captures the initially-loaded articles (~18). The page uses infinite scroll. A pagination endpoint exists but is not yet implemented. Deferred post-POC.

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

## Stack Confirmed

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

## Process Preferences

- Always check official docs for library-specific patterns
- Use `--env-file .env.local` with `tsx` to load env vars
- Ask before making cascading changes across multiple files
- One decision at a time when unblocking errors
