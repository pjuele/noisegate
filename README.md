# Noise Gate

AI-powered news filtering pipeline scoped to Uruguay men's national football team.

Ingests articles from 3 sources, classifies each as signal or noise using Gemini, and serves a clean feed of factual updates.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Database | Neon (Postgres) |
| ORM | Prisma 7 |
| AI | Gemini `gemini-3.1-flash-lite` |
| Hosting | Vercel |
| Cron | Vercel cron — daily at 07:00 UTC |

## Sources

- **AUF** (`auf.org.uy`) — official Uruguay FA site, scraped with cheerio
- **Montevideo Portal** (`montevideo.com.uy`) — Uruguayan sports news, scraped with cheerio
- **MercoPress** (`mercopress.com`) — English-language RSS feed

## Environment Variables

```
DATABASE_URL      Neon Postgres connection string
GEMINI_API_KEY    Google AI Studio API key
CRON_SECRET       Vercel cron secret
```

## Development

```bash
npm run dev              # local dev server
npm run test:ingest      # test MercoPress ingest
npm run test:scrapers    # test AUF + Montevideo Portal scrapers
npm run test:filter      # test Gemini filter against DB items
npm run test:process     # run orchestrator against all unprocessed items
npx prisma studio        # inspect DB
npx prisma migrate dev   # run migrations locally
```

## Architecture

```
Sources → Ingest → raw_items → Gemini filter → processed_items → Frontend feed
```

The cron route (`/api/cron/ingest`) runs all 3 ingest functions then processes any unprocessed `raw_items` through the AI filter. Signal items appear on the frontend feed.
