import { prisma } from '@/lib/db'

const SOURCE_LABELS: Record<string, string> = {
  mercopress: 'MercoPress',
  auf: 'AUF',
  montevideo_portal: 'Montevideo Portal',
}

export const revalidate = 0

async function getSignalItems() {
  return prisma.processedItem.findMany({
    where: { isSignal: true },
    orderBy: { processedAt: 'desc' },
    include: {
      rawItem: {
        select: { title: true, url: true, source: true, publishedAt: true },
      },
    },
  })
}

export default async function Home() {
  const items = await getSignalItems()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight">Uruguay NT</h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-filtered news feed — signal only
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No signal items yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.id} className="border-b border-border pb-6 last:border-0">
                <a
                  href={item.rawItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:underline"
                >
                  {item.rawItem.title}
                </a>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded-sm font-medium">
                    {SOURCE_LABELS[item.rawItem.source] ?? item.rawItem.source}
                  </span>
                  {item.rawItem.publishedAt && (
                    <span>
                      {new Date(item.rawItem.publishedAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
