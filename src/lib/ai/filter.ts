import { GoogleGenAI } from '@google/genai'
import type { RawItem } from '@/generated/prisma/client'

export type FilterResult = {
  is_signal: boolean
  title_en: string | null
  title_es: string | null
  summary_en: string | null
  summary_es: string | null
}

const SIGNAL_CRITERIA =
  'factual updates about the Uruguay men\'s senior national football team: match results, squad call-ups, player injuries or availability, official statements, manager decisions, or confirmed transfers affecting the national team'

const NOISE_CRITERIA =
  'marketing content, throwback/archive stories, photo galleries, promotional material, youth teams, women\'s football, club football unrelated to the national team, opinion pieces, or anything not specifically about the Uruguay men\'s senior national team'

const SYSTEM_PROMPT = `You are a sports news classifier for a Uruguay national football team tracker.

Step 1 — Classify the article as SIGNAL or NOISE:
- SIGNAL: ${SIGNAL_CRITERIA}
- NOISE: ${NOISE_CRITERIA}

Step 2 — Only if SIGNAL: translate the title and write a 2-3 line factual summary in both English and Spanish.

Respond with valid JSON only, no markdown, no explanation.

If SIGNAL:
{"is_signal": true, "title_en": "English title", "title_es": "Spanish title", "summary_en": "2-3 line English summary", "summary_es": "2-3 line Spanish summary"}

If NOISE:
{"is_signal": false, "title_en": null, "title_es": null, "summary_en": null, "summary_es": null}`

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function filterItem(item: RawItem): Promise<FilterResult> {
  const content = [
    `Title: ${item.title}`,
    item.body ? `Body: ${item.body}` : null,
    `Source: ${item.source}`,
    `URL: ${item.url}`,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: content,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0,
    },
  })

  const text = response.text?.trim() ?? ''
  const parsed = JSON.parse(text) as FilterResult
  return parsed
}
