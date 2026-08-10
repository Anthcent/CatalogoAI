type ExportItem = {
  publicCode: string;
  title: string;
  description: string;
  blocks: { type: string; content: unknown }[];
};

function text(value: unknown): string {
  if (typeof value === "string")
    return value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, "");
  if (Array.isArray(value))
    return value
      .map(text)
      .filter(Boolean)
      .map((item) => `- ${item}`)
      .join("\n");
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([key]) => !["span", "done"].includes(key))
      .map(([key, item]) => `${key}:\n${text(item)}`)
      .join("\n");
  return "";
}

export function toMarkdown(item: ExportItem) {
  const sections = item.blocks.map((block) => {
    const content = block.content as Record<string, unknown>;
    const title =
      typeof content.title === "string" ? content.title : block.type;
    return `## ${title}\n\n${text(content.text ?? content.html ?? content)}`;
  });
  return `# ${item.title}\n\n**Código:** ${item.publicCode}\n\n${item.description}\n\n${sections.join("\n\n")}\n`;
}
