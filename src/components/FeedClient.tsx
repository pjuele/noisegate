'use client'

import { useLang } from './LangProvider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Item = {
  id: string
  titleEn: string | null
  titleEs: string | null
  summaryEn: string | null
  summaryEs: string | null
  source: string
  url: string
  publishedAt: Date | null
  fetchedAt: Date
}

const SOURCE_LABELS: Record<string, string> = {
  mercopress: 'MercoPress',
  auf: 'AUF',
  montevideo_portal: 'Montevideo Portal',
}

export function FeedClient({ items }: { items: Item[] }) {
  const { lang } = useLang()

  return (
    <>

      <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
        {items.map((item) => {
          const title = lang === 'en' ? item.titleEn : item.titleEs
          const summary = lang === 'en' ? item.summaryEn : item.summaryEs
          return (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 border border-border py-6 px-5 hover:bg-(--nono-surface) transition-colors group"
            >
              <div className="flex items-start justify-between gap-8 mb-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-semibold text-base text-foreground group-hover:text-primary transition-colors leading-snug"
                >
                  {title ?? item.titleEn ?? item.titleEs}
                </a>
                <Tooltip>
                  <TooltipTrigger className="text-muted-foreground/40 hover:text-muted-foreground cursor-default font-mono text-xs shrink-0 mt-0.5 bg-transparent border-0 p-0 transition-colors">
                    captured
                  </TooltipTrigger>
                  <TooltipContent>
                    {new Date(item.fetchedAt).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {summary}
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                <span className="text-primary uppercase tracking-wider">
                  {SOURCE_LABELS[item.source] ?? item.source}
                </span>
                {item.publishedAt && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
