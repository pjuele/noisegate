import { prisma } from '@/lib/db'
import { NoiseGateLogo } from '@/components/Logo'

const SOURCE_LABELS: Record<string, string> = {
  mercopress: 'MercoPress',
  auf: 'AUF',
  montevideo_portal: 'Montevideo Portal',
}

const SOURCE_BADGE_CLASSES: Record<string, string> = {
  auf: 'bg-sky-900 text-sky-300',
  mercopress: 'bg-indigo-900/70 text-indigo-400',
  montevideo_portal: 'bg-teal-900 text-teal-300',
}

export const revalidate = 0

async function getSignalItems() {
  return prisma.processedItem.findMany({
    where: { isSignal: true },
    orderBy: { processedAt: 'desc' },
    include: {
      rawItem: {
        select: { title: true, url: true, source: true, publishedAt: true, fetchedAt: true },
      },
    },
  })
}

export default async function Home() {
  const items = await getSignalItems()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-10">
          <NoiseGateLogo />
        </header>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No signal items yet.</p>
        ) : (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6">

            {items.map((item) => {
              const badgeClass = SOURCE_BADGE_CLASSES[item.rawItem.source] ?? 'bg-muted text-muted-foreground'
              return (
                <div key={item.id} className="break-inside-avoid mb-6 rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="relative group shrink-0 mt-0.5 cursor-default">
                      <span>ℹ️</span>
                      <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-max max-w-xs bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-md border border-border whitespace-nowrap z-10">
                        Captured on {new Date(item.rawItem.fetchedAt).toLocaleDateString('en-CA', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </span>
                    </span>
                    <a
                      href={item.rawItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:underline"
                    >
                      {item.rawItem.title}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`px-2 py-0.5 rounded-sm font-medium ${badgeClass}`}>
                      {SOURCE_LABELS[item.rawItem.source] ?? item.rawItem.source}
                    </span>
                    {item.rawItem.publishedAt && (
                      <span className="text-muted-foreground">
                        {new Date(item.rawItem.publishedAt).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
