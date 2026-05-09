import { GoogleGenAI } from '@google/genai'
import type { RawItem } from '@/generated/prisma/client'

export type FilterResult = {
  is_signal: boolean
  summary: string | null
}

const SIGNAL_CRITERIA =
  'factual updates about the Uruguay men\'s senior national football team: match results, squad call-ups, player injuries or availability, official statements, manager decisions, or confirmed transfers affecting the national team'

const NOISE_CRITERIA =
  'marketing content, throwback/archive stories, photo galleries, promotional material, youth teams, women\'s football, club football unrelated to the national team, opinion pieces, or anything not specifically about the Uruguay men\'s senior national team'

const SYSTEM_PROMPT = `You are a sports news classifier for a Uruguay national football team tracker.

Classify each article as either SIGNAL or NOISE:
- SIGNAL: ${SIGNAL_CRITERIA}
- NOISE: ${NOISE_CRITERIA}

Respond with valid JSON only, no markdown, no explanation. Format:
{"is_signal": true, "summary": "2-3 line English summary of the factual update"}
or
{"is_signal": false, "summary": null}`

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
