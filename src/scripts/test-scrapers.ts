import { ingestAuf } from "../lib/ingest/auf";
import { ingestMontevideo } from "../lib/ingest/montevideo-portal";
import { prisma } from "../lib/db";

async function main() {
  console.log("Running AUF ingest...");
  const auf = await ingestAuf();
  console.log(`AUF — Inserted: ${auf.inserted}, Skipped: ${auf.skipped}`);

  console.log("\nRunning Montevideo Portal ingest...");
  const mv = await ingestMontevideo();
  console.log(`Montevideo Portal — Inserted: ${mv.inserted}, Skipped: ${mv.skipped}`);

  console.log("\nLatest 5 rows across all sources:");
  const sample = await prisma.rawItem.findMany({
    orderBy: { fetchedAt: "desc" },
    take: 5,
    select: { source: true, title: true, publishedAt: true },
  });
  for (const row of sample) {
    console.log(`  [${row.source}] ${row.title}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
