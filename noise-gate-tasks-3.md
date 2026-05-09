# Noise Gate — POC 1.0 Build Tasks

> Reference: `noise-gate-brief.md`
> Stack: Next.js (TypeScript), Vercel, Neon or Supabase, Gemini or Groq (free tier)
> Goal: Daily-cron filtered Uruguay football feed from 3 sources

---

## TASK 1 — Project Setup

- [ ] Create new Next.js app with TypeScript (`npx create-next-app@latest noise-gate --typescript`)
- [ ] Set up Tailwind CSS
- [ ] Create GitHub repo and push initial commit
- [ ] Connect to Vercel (free tier), confirm deployment works
- [ ] Set up DB — Neon (neon.com, free tier, create project, get connection string)
- [ ] Install and configure Prisma ORM
- [ ] Add `.env.local` with DB connection string, confirm `.env` is in `.gitignore`

**Done when:** app deploys to Vercel with no errors, DB connection confirmed locally.

---

## TASK 2 — DB Schema

Create and run migrations for two tables:

### `raw_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| source | varchar | 'auf' / 'montevideo_portal' / 'mercopress' |
| external_id | varchar | URL or unique identifier from source |
| title | varchar | |
| body | text | raw content / summary |
| url | varchar | link to original |
| published_at | timestamp | from source if available |
| fetched_at | timestamp | when we ingested it |
| processed | boolean | default false |

### `processed_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| raw_item_id | uuid | FK → raw_items.id |
| is_signal | boolean | AI decision |
| summary | text | AI-generated 2-3 line summary (null if noise) |
| processed_at | timestamp | |

**Done when:** migrations run cleanly, tables exist in DB.

---

## TASK 3 — Ingest: MercoPress RSS

- [ ] Create `/src/lib/ingest/mercopress.ts`
- [ ] Fetch RSS feed: `https://en.mercopress.com/rss/uruguay`
- [ ] Parse XML (use `fast-xml-parser` or `rss-parser` npm package)
- [ ] For each item: check if `external_id` already exists in `raw_items` (dedup by URL)
- [ ] Insert new items into `raw_items` with `source = 'mercopress'`
- [ ] Add basic error handling and logging

**Done when:** running the function manually inserts MercoPress items into DB without duplicates.

---

## TASK 4 — Ingest: Scraping

### 4a — Montevideo Portal / Futbol.uy
- [ ] Create `/src/lib/ingest/montevideo-portal.ts`
- [ ] Inspect `https://www.montevideo.com.uy/acategoria.aspx?94` — identify HTML structure of article list
- [ ] Use `cheerio` to scrape title, URL, date, and summary/intro text
- [ ] Dedup by URL, insert into `raw_items` with `source = 'montevideo_portal'`

### 4b — AUF Official Site
- [ ] Create `/src/lib/ingest/auf.ts`
- [ ] Inspect `https://www.auf.org.uy/` news section — identify HTML structure
- [ ] Use `cheerio` to scrape title, URL, date, and body/summary
- [ ] Dedup by URL, insert into `raw_items` with `source = 'auf'`

**Note:** AUF site uses iso-8859-1 encoding — handle charset conversion.

**Done when:** both scrapers run manually and insert items into DB without duplicates.

---

## TASK 5 — AI Filtering Layer

- [ ] Choose AI provider: **Gemini** — sign up at Google AI Studio (aistudio.google.com), create API key
- [ ] Add API key to `.env.local`
- [ ] Create `/src/lib/ai/filter.ts`
- [ ] Write prompt (see below)
- [ ] Function takes a `raw_item`, calls AI, returns `{ is_signal: boolean, summary: string | null }`
- [ ] Create `/src/lib/process.ts` — fetches all unprocessed `raw_items`, runs each through filter, inserts into `processed_items`, marks `raw_item.processed = true`
- [ ] Test with real data from DB

### Suggested prompt
```
You are a signal filter for Uruguay men's national football team news.

Given the following news item, determine:
1. Is it signal or noise?
   - SIGNAL: factual updates about the Uruguay men's first team — match dates, results, 
     squad call-ups, player injuries, player availability, official team news
   - NOISE: marketing, community posts, throwbacks, photo galleries, promotional content, 
     anything not directly relevant to the men's first team

2. If SIGNAL, write a 2-3 line factual summary in English. No fluff.
   If NOISE, return null.

Title: {title}
Content: {body}
Source URL: {url}

Respond in JSON only:
{ "is_signal": true/false, "summary": "..." or null }
```

**Done when:** running process.ts against real raw items produces correct signal/noise decisions and summaries.

---

## TASK 6 — Cron Job

- [ ] Create `/src/app/api/cron/ingest/route.ts` — Next.js API route that runs all 3 ingest functions then runs the AI processor
- [ ] Protect the route with a secret header (Vercel passes `CRON_SECRET` env var)
- [ ] Add `vercel.json` with cron config:
```json
{
  "crons": [
    {
      "path": "/api/cron/ingest",
      "schedule": "0 7 * * *"
    }
  ]
}
```
- [ ] Add `CRON_SECRET` to Vercel environment variables
- [ ] Deploy and verify cron appears in Vercel dashboard
- [ ] Trigger manually once to confirm end-to-end flow works

**Done when:** cron runs successfully on Vercel, items appear in DB.

---

## TASK 7 — Frontend (Functional)

- [ ] Create `/src/app/page.tsx` — main feed page
- [ ] Query `processed_items` where `is_signal = true`, ordered by `processed_at` desc
- [ ] Join with `raw_items` to get title, url, source, published_at
- [ ] Display as a simple list: title, source badge, date, summary, link to original
- [ ] Add basic empty state ("No signal yet — check back after the next cron run")

**Done when:** feed page displays processed signal items correctly.

---

## TASK 8 — Styling

> UI stack: Tailwind CSS + Shadcn/ui components

- [ ] Design pass on the feed — clean, minimal, readable
- [ ] Use Shadcn components where appropriate (cards, badges, etc.)
- [ ] Source badges (AUF / Montevideo Portal / MercoPress) with distinct colours
- [ ] Responsive layout (mobile-readable at minimum)
- [ ] Pick a decent font pairing
- [ ] Dark mode optional but nice

**Done when:** you'd be happy showing it to someone.

---

## Notes & Decisions Log

- **DB choice:** Neon — no dormancy on free tier, scale-to-zero, pure Postgres
- **ORM choice:** Prisma
- **AI provider choice:** Gemini (Google AI Studio, free tier) — better multilingual quality for Spanish/English content
- AUF site uses iso-8859-1 encoding — handle in scraper
- MercoPress RSS confirmed active at `en.mercopress.com/rss/uruguay`
- Montevideo Portal football section: `montevideo.com.uy/acategoria.aspx?94`
- Cron runs once daily at 07:00 UTC for POC

---

*Last updated: May 2026*
