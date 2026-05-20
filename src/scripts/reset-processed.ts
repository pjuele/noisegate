import { prisma } from '@/lib/db'

async function main() {
  await prisma.processedItem.deleteMany()
  const result = await prisma.rawItem.updateMany({ data: { processed: false } })
  console.log(`Reset ${result.count} raw items for reprocessing`)
  await prisma.$disconnect()
}

main()
