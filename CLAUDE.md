# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Pre-implementation.** This repo currently contains only planning documents (`noise-gate-brief-3.md`, `noise-gate-tasks-3.md`). No application code exists yet. The build tasks are tracked in `noise-gate-tasks-3.md`.

---

## What This Is

A two-product system:

1. **Noise Gate** — a generic AI-powered news filtering pipeline. Ingests raw content from sources, uses AI to strip noise and extract factual signal, stores processed results.
2. **Uruguay National Team Tracker** — built on top of Noise Gate. Adds a player/squad DB and persistent team briefing. **Not in scope for POC 1.0.**

The pipeline is designed to be topic-agnostic and reusable. POC 1.0 scopes it to Uruguay men's football news from 3 sources.

---

## Stack

| Layer | Choice |
|---|---|
| Frontend + API | Next.js (TypeScript) |
| Hosting | Vercel (free tier) |
| Database | Neon (Postgres, free tier) |
| ORM | Prisma |
| AI | Gemini (Google AI Studio, free tier) |
| Cron | Vercel cron jobs (once daily at 07:00 UTC) |
| Scraping | `cheerio` |
| RSS parsing | `rss-parser` or `fast-xml-parser` |
| UI | Tailwind CSS + Shadcn/ui |

---

## Architecture

### Data flow

```
Sources → Ingest layer → raw_items (DB) → AI filter → processed_items (DB) → Frontend feed
```

### Ingest sources

| Source | Language | Method |
|---|---|---|
| AUF official site (`auf.org.uy`) | Spanish | Scrape (cheerio) — iso-8859-1 encoding |
| Montevideo Portal (`montevideo.com.uy/acategoria.aspx?94`) | Spanish | Scrape (cheerio) |
| MercoPress (`en.mercopress.com/rss/uruguay`) | English | RSS |

### DB schema

**`raw_items`** — raw ingested content, one row per source item, deduped by URL (`external_id`).
Fields: `id`, `source` ('auf' / 'montevideo_portal' / 'mercopress'), `external_id`, `title`, `body`, `url`, `published_at`, `fetched_at`, `processed` (default false).

**`processed_items`** — AI classification results, one row per raw item.
Fields: `id`, `raw_item_id` (FK), `is_signal`, `summary` (null if noise), `processed_at`.

### Key files (planned)

```
src/lib/ingest/mercopress.ts        RSS ingest
src/lib/ingest/montevideo-portal.ts Scrape ingest
src/lib/ingest/auf.ts               Scrape ingest
src/lib/ai/filter.ts                Gemini AI signal/noise filter
src/lib/process.ts                  Orchestrates: fetch unprocessed → filter → store
src/app/api/cron/ingest/route.ts    Cron endpoint (protected by CRON_SECRET header)
src/app/page.tsx                    Frontend feed
vercel.json                         Cron schedule config
```

### AI filter contract

`filter.ts` takes a `raw_item`, calls Gemini, returns `{ is_signal: boolean, summary: string | null }`.
Signal = factual updates about Uruguay men's first team (results, call-ups, injuries, availability).
Noise = marketing, throwbacks, galleries, promotional, anything off-topic.
Summary is 2-3 lines in English; null if noise.

### Cron route

Protected with `CRON_SECRET` env var (Vercel injects this automatically). Route runs all 3 ingest functions, then runs the AI processor against all unprocessed `raw_items`.

---

## Environment Variables

```
DATABASE_URL          Neon Postgres connection string
GEMINI_API_KEY        Google AI Studio API key
CRON_SECRET           Vercel cron secret (set in Vercel dashboard)
```

---

## Commands

Once the Next.js app is bootstrapped:

```bash
npm run dev        # local dev server
npm run build      # production build
npm run lint       # ESLint
npx prisma migrate dev    # run DB migrations locally
npx prisma studio         # inspect DB
npx prisma generate       # regenerate client after schema changes
```

---

## Key Decisions

- **Neon** over Supabase: no dormancy on free tier, scale-to-zero, pure Postgres.
- **Gemini** over Groq: better multilingual quality for Spanish/English mixed content.
- **Deduplication** is by `external_id` (URL) at ingest time — no cross-source dedup in POC 1.0.
- AUF scraper must handle **iso-8859-1** charset conversion.
- Frontend shows `processed_items` where `is_signal = true`, ordered by `processed_at` desc, joined with `raw_items` for metadata.

---

## Out of Scope for POC 1.0

History/timelines, player/squad DB, cross-source deduplication/synthesis, multiple topics, public access, mobile optimisation, source management UI, alerts.
