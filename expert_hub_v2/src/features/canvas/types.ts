export type BlockSpan = 4 | 6 | 8 | 12;
export type CanvasBlock = {
  id: string;
  type:
    | "text"
    | "ai"
    | "callout"
    | "prompt"
    | "steps"
    | "gallery"
    | "diagram"
    | "relations";
  title: string;
  span: BlockSpan;
  content: Record<string, unknown>;
};
export type LayoutPreset = "one" | "two" | "three" | "free";
export function applyPreset(blocks: CanvasBlock[], preset: LayoutPreset) {
  if (preset === "free") return blocks;
  const span: BlockSpan = preset === "one" ? 12 : preset === "two" ? 6 : 4;
  return blocks.map((block) => ({ ...block, span }));
}
export const defaultBlocks: CanvasBlock[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    type: "text",
    title: "Resumen",
    span: 12,
    content: {
      html: "Una colección reutilizable de stickers escolares inspirados en el espacio, creada con inteligencia artificial y preparada para producción e impresión.",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    type: "ai",
    title: "Resumen generado por Gemini",
    span: 12,
    content: {
      text: "El elemento reúne concepto, prompt, referencias, procedimiento y archivos finales para repetir el producto sin comenzar desde cero.",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    type: "callout",
    title: "Objetivo",
    span: 12,
    content: {
      text: "Crear una colección visual consistente, fácil de imprimir y adaptable a nuevas temáticas escolares.",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    type: "prompt",
    title: "Prompt de generación",
    span: 8,
    content: {
      model: "Gemini 2.5 Flash",
      tool: "Google AI Studio",
      usage: "Generación de imágenes",
      variables: ["tema", "personaje", "estilo", "cantidad"],
      text: "Crea una colección de stickers escolares inspirados en {tema}, con personajes {personaje}, estilo {estilo}, fondo blanco y borde de corte definido. Genera {cantidad} variaciones consistentes.",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    type: "steps",
    title: "Proceso",
    span: 4,
    content: {
      steps: [
        "Definir concepto y temática",
        "Preparar variables del prompt",
        "Generar propuestas",
        "Seleccionar diseños",
        "Ajustar tamaño y contorno",
        "Preparar archivo de impresión",
        "Validar resultado final",
      ],
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    type: "gallery",
    title: "Referencias visuales",
    span: 8,
    content: {
      images: [
        "stickers-space.svg",
        "stickers-school.svg",
        "stickers-planet.svg",
      ],
    },
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
    content: {
      items: [
        "EXP-P3L8QK · Megaprompt de ilustración infantil",
        "EXP-W5F9CN · Flujo de preparación para impresión",
      ],
    },
  },
];
