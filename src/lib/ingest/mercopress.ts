import Parser from "rss-parser";
import { prisma } from "@/lib/db";

const MERCOPRESS_RSS_URL =
  "https://en.mercopress.com/rss/uruguay";

const SOURCE = "mercopress" as const;

const parser = new Parser({ timeout: 10_000 });

export async function ingestMercopress(): Promise<{
  inserted: number;
  skipped: number;
}> {
  const feed = await parser.parseURL(MERCOPRESS_RSS_URL);

  let inserted = 0;
  let skipped = 0;

  for (const item of feed.items) {
    const url = item.link ?? item.guid;
    if (!url) {
      skipped++;
      continue;
    }

    const existing = await prisma.rawItem.findUnique({
      where: { externalId: url },
      select: { id: true },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.rawItem.create({
      data: {
        source: SOURCE,
        externalId: url,
        title: item.title ?? "",
        body: item.contentSnippet ?? item.content ?? item.summary ?? "",
        url,
        publishedAt: item.isoDate ? new Date(item.isoDate) : null,
      },
    });

    inserted++;
  }

  return { inserted, skipped };
}
