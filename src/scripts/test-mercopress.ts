import { ingestMercopress } from "../lib/ingest/mercopress";
import { prisma } from "../lib/db";

async function main() {
  console.log("Running MercoPress ingest...");
  const result = await ingestMercopress();
  console.log(`Inserted: ${result.inserted}, Skipped: ${result.skipped}`);

  const sample = await prisma.rawItem.findMany({
    where: { source: "mercopress" },
    orderBy: { fetchedAt: "desc" },
    take: 3,
    select: { title: true, url: true, publishedAt: true },
  });

  console.log("\nLatest 3 rows in raw_items:");
  for (const row of sample) {
    console.log(`  [${row.publishedAt?.toISOString() ?? "no date"}] ${row.title}`);
    console.log(`    ${row.url}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
