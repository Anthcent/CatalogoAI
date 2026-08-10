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
