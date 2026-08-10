export type BlockSpan = 4 | 6 | 8 | 12;

export const blockTypes = [
  "text",
  "heading",
  "checklist",
  "table",
  "prompt",
  "steps",
  "image",
  "gallery",
  "file",
  "link",
  "diagram",
  "relations",
  "ai",
  "callout",
] as const;

export type CanvasBlockType = (typeof blockTypes)[number];
export type CanvasBlock = {
  id: string;
  type: CanvasBlockType;
  title: string;
  span: BlockSpan;
  content: Record<string, unknown>;
};
export type LayoutPreset = "one" | "two" | "three" | "free";

export const smartPattern: BlockSpan[] = [12, 6, 6, 8, 4, 6, 6, 4, 4, 4, 8, 4];

export function applyPreset(blocks: CanvasBlock[], preset: LayoutPreset) {
  if (preset === "free")
    return blocks.map((block, index) => ({
      ...block,
      span: smartPattern[index % smartPattern.length],
    }));
  const span: BlockSpan = preset === "one" ? 12 : preset === "two" ? 6 : 4;
  return blocks.map((block) => ({ ...block, span }));
}

export function moveBlock(
  blocks: CanvasBlock[],
  blockId: string,
  direction: -1 | 1,
) {
  const index = blocks.findIndex((block) => block.id === blockId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= blocks.length) return blocks;
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reorderBlock(
  blocks: CanvasBlock[],
  sourceId: string,
  targetId: string,
) {
  const source = blocks.findIndex((block) => block.id === sourceId);
  const target = blocks.findIndex((block) => block.id === targetId);
  if (source < 0 || target < 0 || source === target) return blocks;
  const next = [...blocks];
  const [block] = next.splice(source, 1);
  next.splice(target, 0, block);
  return next;
}

const blockDefaults: Record<
  Exclude<CanvasBlockType, "ai" | "callout">,
  Omit<CanvasBlock, "id" | "type">
> = {
  text: { title: "Texto", span: 12, content: { text: "Escribe aquí..." } },
  heading: { title: "Título", span: 12, content: { text: "Nuevo título", level: 2 } },
  checklist: {
    title: "Checklist",
    span: 6,
    content: { items: [{ id: "item-1", text: "Nueva tarea", done: false }] },
  },
  table: {
    title: "Tabla",
    span: 12,
    content: { rows: [["Columna 1", "Columna 2"], ["", ""]] },
  },
  prompt: {
    title: "Prompt",
    span: 8,
    content: { model: "Gemini", tool: "Expert Hub", usage: "General", variables: [], text: "Escribe tu prompt..." },
  },
  steps: {
    title: "Pasos",
    span: 8,
    content: { steps: [{ id: "step-1", title: "Nuevo paso", detail: "", done: false }] },
  },
  image: { title: "Imagen", span: 8, content: { image: "", alt: "" } },
  gallery: { title: "Galería", span: 12, content: { images: [] } },
  file: { title: "Archivo", span: 6, content: { name: "Recursos asociados" } },
  link: { title: "Enlace", span: 6, content: { label: "Nuevo enlace", url: "https://" } },
  diagram: { title: "Diagrama", span: 12, content: { nodes: ["Inicio", "Resultado"] } },
  relations: { title: "Relacionado", span: 12, content: { items: [] } },
};

export function createBlock(
  type: keyof typeof blockDefaults,
  id: string,
): CanvasBlock {
  const template = blockDefaults[type];
  return {
    id,
    type,
    title: template.title,
    span: template.span,
    content: structuredClone(template.content),
  };
}

export function duplicateBlock(block: CanvasBlock, id: string): CanvasBlock {
  return {
    ...block,
    id,
    title: `${block.title.slice(0, 112)} (copia)`,
    content: structuredClone(block.content),
  };
}

export const defaultBlocks: CanvasBlock[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    type: "text",
    title: "Resumen",
    span: 12,
    content: { text: "Una colección reutilizable de stickers escolares inspirados en el espacio, creada con inteligencia artificial y preparada para producción e impresión." },
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    type: "ai",
    title: "Resumen generado por Gemini",
    span: 12,
    content: { text: "El elemento reúne concepto, prompt, referencias, procedimiento y archivos finales para repetir el producto sin comenzar desde cero." },
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    type: "callout",
    title: "Objetivo",
    span: 12,
    content: { text: "Crear una colección visual consistente, fácil de imprimir y adaptable a nuevas temáticas escolares." },
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    type: "prompt",
    title: "Prompt de generación",
    span: 8,
    content: { model: "Gemini 2.5 Flash", tool: "Google AI Studio", usage: "Generación de imágenes", variables: ["tema", "personaje", "estilo", "cantidad"], text: "Crea una colección de stickers escolares inspirados en {tema}, con personajes {personaje}, estilo {estilo}, fondo blanco y borde de corte definido. Genera {cantidad} variaciones consistentes." },
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    type: "steps",
    title: "Proceso",
    span: 4,
    content: { steps: ["Definir concepto y temática", "Preparar variables del prompt", "Generar propuestas", "Seleccionar diseños", "Ajustar tamaño y contorno", "Preparar archivo de impresión", "Validar resultado final"].map((title, index) => ({ id: `step-${index + 1}`, title, detail: "", done: false })) },
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    type: "gallery",
    title: "Referencias visuales",
    span: 8,
    content: { images: ["stickers-space.svg", "stickers-school.svg", "stickers-planet.svg"] },
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    type: "diagram",
    title: "Flujo de producción",
    span: 4,
    content: { nodes: ["Concepto", "Generación IA", "Selección", "Impresión"] },
  },
  {
    id: "00000000-0000-4000-8000-000000000008",
    type: "relations",
    title: "Relaciones",
    span: 12,
    content: { items: ["EXP-P3L8QK · Megaprompt de ilustración infantil", "EXP-W5F9CN · Flujo de preparación para impresión"] },
  },
];
