import { prisma } from '../lib/db'
import { filterItem } from '../lib/ai/filter'

async function main() {
  const items = await prisma.rawItem.findMany({
    orderBy: { fetchedAt: 'desc' },
    take: 5,
  })

  if (items.length === 0) {
    console.log('No raw_items found in DB.')
    await prisma.$disconnect()
    return
  }

  console.log(`Testing filter against ${items.length} items...\n`)

  for (const item of items) {
    console.log(`[${item.source}] ${item.title}`)
    try {
      const result = await filterItem(item)
      console.log(`  is_signal: ${result.is_signal}`)
      if (result.summary_en) console.log(`  summary_en: ${result.summary_en}`)
      if (result.summary_es) console.log(`  summary_es: ${result.summary_es}`)
    } catch (err) {
      console.error(`  ERROR: ${err}`)
    }
    console.log()
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
