export type BlockDraft = {
  id?: string;
  type: string;
  content: Record<string, unknown>;
};

export const blockTypes = [
  ["paragraph", "Texto"], ["heading", "Título"], ["checklist", "Lista de tareas"],
  ["prompt", "Prompt de IA"], ["steps", "Procedimiento"], ["callout", "Destacado"],
  ["code", "Código"], ["link", "Enlace"], ["image", "Imagen"], ["table", "Tabla"],
] as const;

export function createBlockContent(type: string): Record<string, unknown> {
  if (type === "prompt") return { name: "", text: "", model: "Gemini", variables: "", instructions: "", example: "", notes: "" };
  if (type === "checklist") return { items: [{ text: "", checked: false }] };
  if (type === "steps") return { items: [{ title: "", description: "", done: false }] };
  if (type === "table") return { rows: [["", ""], ["", ""]] };
  if (type === "link") return { title: "", url: "", notes: "" };
  if (type === "image") return { url: "", caption: "" };
  if (type === "code") return { language: "typescript", text: "" };
  return { text: "" };
}
