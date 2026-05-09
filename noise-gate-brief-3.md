# Noise Gate — Project Brief

## What it is
A personal signal-filtering tool that ingests raw content from defined sources, uses AI to strip noise and extract only factual signal, and presents a clean persistent briefing.

The core pipeline (ingest + AI filter) is designed as a reusable module — think of it as a service that can be plugged into different applications. The first application built on top of it is the Uruguay football tracker.

---

## Problem Statement
Two distinct problems:
1. **Signal/noise** — official and news feeds are polluted with marketing, fluff, and irrelevant content
2. **Memory** — no persistent record of "current state"; relevant facts get lost over time

---

## Two-Product Architecture

### Product 1: Noise Gate (the pipeline)
Generic news filtering engine. Ingests raw content, filters noise, returns clean structured items. Topic-agnostic by design.

### Product 2: Uruguay National Team Tracker (built on top)
Consumes the Noise Gate pipeline. Adds a structured player/squad DB and a persistent team briefing. A separate product that uses the pipeline as a dependency.

**Build order:**
1. Build Noise Gate pipeline first (POC 1.0)
2. Build Uruguay Tracker on top (POC 2.0)
3. Generalise to multi-topic / user-selectable scopes if/when it makes sense

---

## POC 1.0 — Noise Gate: Uruguay Football Feed

### What it does
- Fetches from 3 sources daily
- AI filters noise, keeps only factual Uruguay men's first team signal
- Stores processed items
- Displays a clean feed

### What it tracks
- Match dates and results
- Squad call-ups and changes
- Player injury/availability status
- Confirmed official news

### What it ignores
- Marketing and community posts ("¡Vamos Uruguay!")
- Photo galleries, throwbacks, promotional content
- Anything not factually relevant to the men's first team

### AI layer (POC 1.0 scope only)
Single job: **is this signal or noise? If signal, summarise in 2-3 lines.**
No structured extraction, no player DB, no deduplication yet.

### Sources
| Source | Language | Method | URL / Notes |
|---|---|---|---|
| AUF official site | Spanish | Scrape | auf.org.uy — no RSS found, scrapable |
| Montevideo Portal / Futbol.uy | Spanish | Scrape | montevideo.com.uy/acategoria.aspx?94 — active, no paywall |
| MercoPress | English | RSS | en.mercopress.com/rss/uruguay — confirmed active |

---

## Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend + API | Next.js (TypeScript) | Familiar stack |
| Hosting | Vercel (free) | Familiar |
| Database | Neon or Supabase (free tier) | Current state only in POC 1.0 |
| AI | Gemini or Groq (free tier) | To be decided at build time |
| Cron | Vercel cron jobs | Once daily for POC |

---

## Out of Scope for POC 1.0
- History / timelines
- Player / squad DB
- Deduplication across sources
- Multiple topics
- Public access
- Bias / credibility scoring
- Mobile optimisation
- Source management UI
- Alerts / notifications

---

## POC 1.1+ / Later
- **Deduplication + synthesis** — detect same story across sources, merge into one item with citations (a key differentiating feature if this ever goes public)
- **Structured extraction** — player status, match dates as structured data fields
- **Additional Uruguayan sources** — Portal 180, El Observador/Referí (both active, scraping needed)

---

## POC 2.0 — Uruguay Tracker (separate product)
Built on top of the Noise Gate pipeline. Adds:
- Player / squad DB with status tracking (injured, available, called up)
- Persistent team briefing — current state card, updated daily
- History / timelines

---

## Someday Maybe
- **Multi-topic support** — generalise ingest layer to any subject (global news, politics, tech, etc.)
- **User-selectable scopes** — topics the user can configure
- **Bias and credibility scoring** — flag sensationalism, political lean
- **Bellingcat integration** — fact-check / verification reference layer
- **Public portal** — read-only site (brings legal/IP considerations)
- **Source management UI** — add/remove sources without touching code
- **Alerts** — notify on high-signal events

---

## Known Good Sources (broader scope, future)
| Source | Type | Notes |
|---|---|---|
| Legible News | Daily news feed | Wikipedia-sourced, already low-noise, likely RSS |
| Bellingcat | Investigative journalism | Fact-check/verification layer, not a daily feed |
| MercoPress | Regional news agency | English, RSS confirmed, South America focus |

---

## Learning Value
Beyond the product itself, this POC covers:
- Web scraping in Next.js
- RSS feed parsing
- Scheduled server-side jobs on Vercel (cron)
- AI API integration (Gemini or Groq)
- Structured AI output / prompt engineering for filtering
- Persistent state management with a simple DB schema
- Multilingual content handling (Spanish + English sources)

---

*Last updated: May 2026*
