import "server-only";
import { db } from "@/lib/db";
import type { CatalogItem } from "@/features/catalog/data";
import { getBooleanSetting } from "@/features/settings/service";
import { semanticMatches } from "./indexer";

function business(value?: string): CatalogItem["business"] {
  return value === "Expert Academy" || value === "Expert Code"
    ? value
    : "Expert Design";
}

function image(item: {
  type?: { name: string } | null;
  businesses: { business: { name: string } }[];
}) {
  if (item.type?.name === "Prompt") return "cover-purple.svg";
  const name = business(item.businesses[0]?.business.name);
  return name === "Expert Academy"
    ? "academy-python.svg"
    : name === "Expert Code"
      ? "code-auth.svg"
      : "stickers-space.svg";
}

export async function searchItems(
  query: string,
  userId: string,
  mode = "intent",
): Promise<CatalogItem[]> {
  const q = query.trim();
  if (!q) return [];
  const tokens = q
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const useSemantic =
    mode === "intent" &&
    (await getBooleanSetting("semantic_search_enabled", true));
  const semantic = useSemantic
    ? await semanticMatches(q).catch((error) => {
        console.error("Semantic search failed", error);
        return [];
      })
    : [];
  const semanticIds = semantic.map((match) => match.itemId);
  const items = await db.catalogItem.findMany({
    where: {
      archivedAt: null,
      createdById: userId,
      OR:
        mode === "code"
          ? [{ publicCode: { equals: q.toUpperCase() } }]
          : [
              { publicCode: { equals: q.toUpperCase() } },
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              {
                tags: {
                  some: { tag: { name: { contains: q, mode: "insensitive" } } },
                },
              },
              ...tokens.flatMap((token) => [
                { title: { contains: token, mode: "insensitive" as const } },
                {
                  description: {
                    contains: token,
                    mode: "insensitive" as const,
                  },
                },
              ]),
              ...(semanticIds.length ? [{ id: { in: semanticIds } }] : []),
            ],
    },
    include: {
      businesses: { include: { business: true } },
      type: true,
      status: true,
      tags: { include: { tag: true } },
    },
    take: 40,
  });
  const ranked = items
    .map((item) => {
      const haystack =
        `${item.title} ${item.description} ${item.tags.map(({ tag }) => tag.name).join(" ")}`.toLowerCase();
      const semanticMatch = semantic.find((match) => match.itemId === item.id);
      let score =
        item.publicCode === q.toUpperCase()
          ? 100
          : (semanticMatch?.similarity ?? 0) * 55;
      if (item.title.toLowerCase().includes(q.toLowerCase())) score += 30;
      score += tokens.filter((token) => haystack.includes(token)).length * 8;
      return {
        id: item.id,
        code: item.publicCode,
        title: item.title,
        business: business(item.businesses[0]?.business.name),
        type: item.type?.name ?? "Documento",
        status: item.status?.name ?? "Borrador",
        description: item.description,
        tags: item.tags.map(({ tag }) => tag.name),
        image: image(item),
        updated: "Resultado",
        relevance: Math.min(100, Math.round(score)),
        reason:
          item.publicCode === q.toUpperCase()
            ? "Código público exacto"
            : semanticMatch
              ? "Contenido relacionado semánticamente"
              : "Coincidencia textual y de etiquetas",
      } satisfies CatalogItem;
    })
    .sort((left, right) => (right.relevance ?? 0) - (left.relevance ?? 0));
  await db.searchHistory.create({
    data: { userId, query: q, results: ranked.length },
  });
  return ranked;
}
