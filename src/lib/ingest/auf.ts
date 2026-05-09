import * as cheerio from "cheerio";
import { prisma } from "@/lib/db";

const AUF_URL = "https://www.auf.org.uy/mayores/";
const AUF_BASE_URL = "https://www.auf.org.uy";
const SOURCE = "auf" as const;

export async function ingestAuf(): Promise<{ inserted: number; skipped: number }> {
  const res = await fetch(AUF_URL, {
    headers: { "Accept-Charset": "iso-8859-1" },
  });
  const buffer = await res.arrayBuffer();
  const html = new TextDecoder("iso-8859-1").decode(buffer);

  const $ = cheerio.load(html);

  let inserted = 0;
  let skipped = 0;

  for (const el of $("article.tarjeta").toArray()) {
    const anchor = $(el).find("hgroup > h3 > a");
    const href = anchor.attr("href");
    if (!href) continue;

    const url = href.startsWith("http") ? href : `${AUF_BASE_URL}${href}`;
    const title = anchor.text().trim();
    const body = $(el).find("p").first().text().trim();
    const dateText = $(el).find("hgroup > h4").text().trim();

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
        publishedAt: parseDateText(dateText),
      },
    });

    inserted++;
  }

  return { inserted, skipped };
}

// Parses "10 ABR 2026" style dates from AUF
const MONTH_MAP: Record<string, number> = {
  ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
  JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11,
};

function parseDateText(text: string): Date | null {
  const parts = text.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const [day, monthStr, year] = parts;
  const month = MONTH_MAP[monthStr.toUpperCase()];
  if (month === undefined) return null;
  return new Date(Date.UTC(parseInt(year), month, parseInt(day)));
}
