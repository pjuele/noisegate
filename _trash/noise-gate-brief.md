# Noise Gate — Project Brief

## What it is
A personal signal-filtering tool that ingests raw content from defined sources, uses AI to strip noise and extract only factual signal, and presents a clean persistent briefing. Built first as a POC, with architecture designed to generalise.

---

## Problem Statement
Two distinct problems:
1. **Signal/noise** — official and news feeds are polluted with marketing, fluff, and irrelevant content
2. **Memory** — no persistent record of "current state"; relevant facts get lost over time

---

## MVP: Uruguay National Team Tracker
The first real use case. Follows the AUF (Asociación Uruguaya de Fútbol) and related sources, filters out noise, and maintains a structured team briefing that stays current.

### What it tracks
- Match dates and results
- Squad call-ups and changes
- Player injury/availability status
- Confirmed official news

### What it ignores
- Marketing and community posts ("¡Vamos Uruguay!")
- Photo galleries, throwbacks, promotional content
- Anything not factually informative

---

## Core Flow
1. Daily cron fetches from defined sources
2. AI layer filters noise, extracts structured facts
3. Output stored in DB (current state — no history in MVP)
4. Clean frontend displays feed + persistent team briefing

---

## Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend + API | Next.js (TypeScript) | Familiar stack |
| Hosting | Vercel (free) | Familiar |
| Database | Neon or Supabase (free tier) | Current state only in MVP |
| AI | Gemini or Groq (free tier) | To be decided at build time |
| Cron | Vercel cron jobs | Once daily for MVP |

---

## Sources (MVP)
| Source | Type | Status |
|---|---|---|
| auf.org.uy | Web scrape | No RSS found; scrapable, old site |
| X / @AUFOficial | Social feed | Via third-party API (e.g. TwitterAPI.io) — cents/month at this volume |
| Legible News | RSS (likely) | Clean, low-noise general news — confirm RSS |

---

## Known Constraints
- X official API is out (min $100/month)
- Third-party X scrapers are ToS grey area — acceptable for personal POC
- AI API cost is negligible at once-daily personal scale
- No budget beyond time and existing subscriptions

---

## Out of Scope for MVP
- History / timelines
- Multiple topics
- Public access
- Bias / credibility scoring
- Mobile optimisation
- Source management UI
- Alerts / notifications

---

## Later / Someday Maybe
- **History and timelines** — when did X get injured, how did form evolve
- **Multi-topic support** — generalise ingest layer to any subject
- **Bias and credibility scoring** — flag sensationalism, political lean
- **Bellingcat integration** — fact-check/verification reference layer
- **Public portal** — read-only site (brings legal/IP considerations)
- **Source management UI** — add/remove sources without touching code
- **Alerts** — notify on high-signal events
- **Broader news scope** — global news, politics, tech, etc.

---

## Known Good Sources (broader scope, future)
| Source | Type | Notes |
|---|---|---|
| Legible News | Daily news feed | Wikipedia-sourced, already low-noise |
| Bellingcat | Investigative journalism | Fact-check/verification layer, not a daily feed |

---

## Learning Value
Beyond the product itself, this POC covers:
- AI API integration (Gemini or Groq)
- Scheduled server-side jobs on Vercel
- Web scraping in Next.js
- Structured AI output / prompt engineering for filtering
- Persistent state management with a simple DB schema

---

*Last updated: May 2026*
