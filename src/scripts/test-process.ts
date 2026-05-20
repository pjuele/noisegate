import { prisma } from '../lib/db'
import { processUnprocessedItems } from '../lib/process'

async function main() {
  const unprocessed = await prisma.rawItem.count({ where: { processed: false } })
  console.log(`Unprocessed items: ${unprocessed}`)

  if (unprocessed === 0) {
    console.log('Nothing to process.')
    await prisma.$disconnect()
    return
  }

  console.log('Running processor...\n')
  const result = await processUnprocessedItems()

  console.log(`Processed: ${result.processed}`)
  console.log(`Signal:    ${result.signal}`)
  console.log(`Noise:     ${result.noise}`)
  console.log(`Errors:    ${result.errors}`)

  const signals = await prisma.processedItem.findMany({
    where: { isSignal: true },
    include: { rawItem: { select: { title: true, source: true } } },
    orderBy: { processedAt: 'desc' },
    take: 10,
  })

  if (signals.length > 0) {
    console.log('\nSignal items:')
    for (const s of signals) {
      console.log(`  [${s.rawItem.source}] ${s.rawItem.title}`)
      console.log(`    EN: ${s.summaryEn}`)
      console.log(`    ES: ${s.summaryEs}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
