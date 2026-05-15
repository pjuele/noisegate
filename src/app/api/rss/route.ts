import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 0

const FEED_TITLE = 'Noise Gate — Uruguay Football Signal'
const FEED_DESCRIPTION = 'Filtered factual updates on the Uruguay men\'s national football team.'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const items = await prisma.processedItem.findMany({
    where: { isSignal: true },
    orderBy: { processedAt: 'desc' },
    take: 50,
    include: {
      rawItem: {
        select: { title: true, url: true, source: true, publishedAt: true, fetchedAt: true },
      },
    },
  })

  const lastBuildDate = items[0]?.processedAt ?? new Date()

  const itemsXml = items
    .map((item) => {
      const pubDate = (item.rawItem.publishedAt ?? item.rawItem.fetchedAt).toUTCString()
      const title = escapeXml(item.rawItem.title)
      const url = escapeXml(item.rawItem.url)
      const summary = escapeXml(item.summary ?? '')
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${summary}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${origin}</link>
    <description>${FEED_DESCRIPTION}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${origin}/api/rss" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
