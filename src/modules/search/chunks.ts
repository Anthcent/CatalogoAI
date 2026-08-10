type IndexBlock = { id: string; type: string; content: unknown };
type IndexChunk = { sourceType: string; sourceId: string | null; text: string };

export function indexableChunks(item: { title: string; description: string; summary: string; blocks: IndexBlock[] }): IndexChunk[] {
  const chunks: IndexChunk[] = [{ sourceType: "metadata", sourceId: null, text: [item.title, item.description, item.summary].filter(Boolean).join("\n") }];
  for (const block of item.blocks) {
    const content = block.content as { text?: unknown; name?: unknown; url?: unknown };
    const html = typeof (content as {html?:unknown}).html === "string" ? (content as {html:string}).html.replace(/<[^>]+>/g," ").replace(/\s+/g," ") : "";
    const text = [content.name, content.text, html, content.url].filter(value => typeof value === "string").join("\n").trim();
    if (text) chunks.push({ sourceType: block.type, sourceId: block.id, text: text.slice(0, 8000) });
  }
  return chunks.filter(chunk => chunk.text.trim());
}
