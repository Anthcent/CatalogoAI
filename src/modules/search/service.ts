import { db } from "@/lib/db";
import { semanticMatches } from "./indexer";

export async function searchItems(query: string, userId: string) {
  const q = query.trim();
  if (!q) return [];
  const tokens = q.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const semantic = await semanticMatches(q).catch(error => { console.error("Semantic search failed", error); return []; });
  const semanticIds = semantic.map(match => match.itemId);
  const items = await db.catalogItem.findMany({
    where: { archivedAt: null, OR: [
      { publicCode: { equals: q.toUpperCase() } }, { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }, { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
      ...tokens.flatMap((token) => [{ title: { contains: token, mode: "insensitive" as const } }, { description: { contains: token, mode: "insensitive" as const } }]),
      ...(semanticIds.length ? [{ id: { in: semanticIds } }] : []),
    ] },
    include: { businesses: { include: { business: true } }, type: true, category: true, status: true, tags: { include: { tag: true } } },
    take: 40,
  });
  const ranked = items.map((item) => {
    const haystack = `${item.title} ${item.description} ${item.tags.map((x) => x.tag.name).join(" ")}`.toLowerCase();
    const semanticMatch = semantic.find(match => match.itemId === item.id);
    let score = item.publicCode === q.toUpperCase() ? 100 : (semanticMatch?.similarity ?? 0) * 55;
    if (item.title.toLowerCase().includes(q.toLowerCase())) score += 30;
    score += tokens.filter((token) => haystack.includes(token)).length * 8;
    if (item.favorite) score += 3;
    return { ...item, score, reason: item.publicCode === q.toUpperCase() ? "Código público exacto" : semanticMatch && semanticMatch.similarity > 0.6 ? "Contenido relacionado semánticamente" : score >= 30 ? "Coincidencia en el título" : "Contenido y etiquetas relacionadas" };
  }).sort((a, b) => b.score - a.score);
  await db.searchHistory.create({ data: { userId, query: q, results: ranked.length } });
  return ranked;
}
