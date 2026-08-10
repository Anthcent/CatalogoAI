import { TemplatesView } from "@/features/templates/templates-view";
import { db } from "@/lib/db";

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    include: { type: true, business: true },
    orderBy: [{ uses: "desc" }, { name: "asc" }],
  });
  return (
    <TemplatesView
      templates={templates.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        type: template.type?.name ?? "Documento",
        blocks: Array.isArray(template.structure)
          ? template.structure.length
          : 0,
        tone:
          template.business?.name === "Expert Academy"
            ? "academy"
            : template.business?.name === "Expert Code"
              ? "code"
              : "design",
        featured: template.uses > 0,
        sections: Array.isArray(template.structure)
          ? template.structure.map((block) =>
              typeof block === "object" &&
              block &&
              "content" in block &&
              typeof block.content === "object" &&
              block.content &&
              "text" in block.content
                ? String(block.content.text)
                : "Contenido",
            )
          : [],
      }))}
    />
  );
}
