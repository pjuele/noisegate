import * as cheerio from "cheerio";
import { prisma } from "@/lib/db";

const MONTEVIDEO_URL = "https://www.montevideo.com.uy/categoria/Deportes-94";
const SOURCE = "montevideo_portal" as const;

export async function ingestMontevideo(): Promise<{ inserted: number; skipped: number }> {
  const res = await fetch(MONTEVIDEO_URL);
  const html = await res.text();

  const $ = cheerio.load(html);

  let inserted = 0;
  let skipped = 0;

  for (const el of $("article.noticia").toArray()) {
    const url = $(el).find("a.foto").attr("href");
    if (!url) continue;

    const title = $(el).find(".content h2.title").text().trim();
    if (!title) continue;

    const body = $(el).find(".content p.text").text().trim();

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
        title,
        body,
        url,
        publishedAt: null,
      },
    });

    inserted++;
  }

  return { inserted, skipped };
}
