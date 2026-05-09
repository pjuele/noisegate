import { NextRequest, NextResponse } from 'next/server'
import { ingestMercopress } from '@/lib/ingest/mercopress'
import { ingestAuf } from '@/lib/ingest/auf'
import { ingestMontevideo } from '@/lib/ingest/montevideo-portal'
import { processUnprocessedItems } from '@/lib/process'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [mercopress, auf, montevideo] = await Promise.all([
    ingestMercopress(),
    ingestAuf(),
    ingestMontevideo(),
  ])

  const processing = await processUnprocessedItems()

  return NextResponse.json({
    ingest: { mercopress, auf, montevideo },
    processing,
  })
}
