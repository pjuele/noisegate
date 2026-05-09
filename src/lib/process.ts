import { prisma } from '@/lib/db'
import { filterItem } from '@/lib/ai/filter'

export type ProcessResult = {
  processed: number
  signal: number
  noise: number
  errors: number
}

export async function processUnprocessedItems(): Promise<ProcessResult> {
  const items = await prisma.rawItem.findMany({
    where: { processed: false },
  })

  let signal = 0
  let noise = 0
  let errors = 0

  for (const item of items) {
    try {
      const result = await filterItem(item)

      await prisma.processedItem.create({
        data: {
          rawItemId: item.id,
          isSignal: result.is_signal,
          summary: result.summary,
        },
      })

      await prisma.rawItem.update({
        where: { id: item.id },
        data: { processed: true },
      })

      if (result.is_signal) signal++
      else noise++
    } catch {
      errors++
    }
  }

  return { processed: items.length, signal, noise, errors }
}
