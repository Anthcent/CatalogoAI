export type BlockDraft = {
  id?: string;
  type: string;
  content: Record<string, unknown>;
};

export const blockTypes = [
  ["paragraph", "Text"], ["heading", "Heading"], ["checklist", "Checklist"],
  ["prompt", "AI Prompt"], ["steps", "Procedure"], ["callout", "Callout"],
  ["code", "Code"], ["link", "Link"], ["image", "Image"], ["table", "Table"],
] as const;
