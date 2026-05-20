import { prisma } from '@/lib/db'
import { Eyebrow } from '@/components/nono'
import { FeedClient } from '@/components/FeedClient'
import { Subtitle } from '@/components/Subtitle'

export const revalidate = 0

async function getSignalItems() {
  const items = await prisma.processedItem.findMany({
    where: { isSignal: true },
    orderBy: { processedAt: 'desc' },
    include: {
      rawItem: {
        select: { url: true, source: true, publishedAt: true, fetchedAt: true },
      },
    },
  })

  return items.map((item) => ({
    id: item.id,
    titleEn: item.titleEn,
    titleEs: item.titleEs,
    summaryEn: item.summaryEn,
    summaryEs: item.summaryEs,
    source: item.rawItem.source,
    url: item.rawItem.url,
    publishedAt: item.rawItem.publishedAt,
    fetchedAt: item.rawItem.fetchedAt,
  }))
}

export default async function Home() {
  const items = await getSignalItems()

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-20 text-center">
        <h1 className="font-mono font-normal tracking-tighter leading-none text-[3rem] sm:text-[5rem] md:text-[8rem] lg:text-[10rem] mb-8">
          celeste
        </h1>
        <Subtitle />
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No signal items yet.</p>
      ) : (
        <FeedClient items={items} />
      )}

      <Eyebrow className="mt-8">Noise Gate · powered by Gemini</Eyebrow>
    </main>
  )
}
