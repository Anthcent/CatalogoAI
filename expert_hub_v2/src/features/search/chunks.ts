type IndexBlock = { id: string; type: string; content: unknown };
type IndexChunk = { sourceType: string; sourceId: string | null; text: string };

function strings(value: unknown): string[] {
  if (typeof value === "string")
    return [value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}

export function indexableChunks(item: {
  title: string;
  description: string;
  summary: string;
  blocks: IndexBlock[];
}): IndexChunk[] {
  const chunks: IndexChunk[] = [
    {
      sourceType: "metadata",
      sourceId: null,
      text: [item.title, item.description, item.summary]
        .filter(Boolean)
        .join("\n"),
    },
  ];
  for (const block of item.blocks) {
    const text = strings(block.content).join("\n").trim().slice(0, 8000);
    if (text) chunks.push({ sourceType: block.type, sourceId: block.id, text });
  }
  return chunks.filter((chunk) => chunk.text.trim());
}
