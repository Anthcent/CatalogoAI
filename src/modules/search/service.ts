import { db } from "@/lib/db";

export async function searchItems(query: string, userId: string) {
  const q = query.trim();
  if (!q) return [];
  const tokens = q.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const items = await db.catalogItem.findMany({
    where: { archivedAt: null, OR: [
      { publicCode: { equals: q.toUpperCase() } }, { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }, { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
      ...tokens.flatMap((token) => [{ title: { contains: token, mode: "insensitive" as const } }, { description: { contains: token, mode: "insensitive" as const } }]),
    ] },
    include: { businesses: { include: { business: true } }, type: true, category: true, status: true, tags: { include: { tag: true } } },
    take: 40,
  });
  const ranked = items.map((item) => {
    const haystack = `${item.title} ${item.description} ${item.tags.map((x) => x.tag.name).join(" ")}`.toLowerCase();
    let score = item.publicCode === q.toUpperCase() ? 100 : 0;
    if (item.title.toLowerCase().includes(q.toLowerCase())) score += 30;
    score += tokens.filter((token) => haystack.includes(token)).length * 8;
    if (item.favorite) score += 3;
    return { ...item, score, reason: score >= 30 ? "Title or exact code match" : "Related content and tags" };
  }).sort((a, b) => b.score - a.score);
  await db.searchHistory.create({ data: { userId, query: q, results: ranked.length } });
  return ranked;
}
