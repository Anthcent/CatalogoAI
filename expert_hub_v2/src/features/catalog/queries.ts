import "server-only";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import {
  defaultBlocks,
  type CanvasBlock,
  type BlockSpan,
} from "@/features/canvas/types";
import type { CatalogItem } from "./data";

const businessNames = [
  "Expert Academy",
  "Expert Design",
  "Expert Code",
] as const;

function businessName(value?: string): CatalogItem["business"] {
  return businessNames.find((name) => name === value) ?? "Expert Design";
}

function imageFor(item: {
  type?: { name: string } | null;
  businesses: { business: { name: string } }[];
}) {
  const business = businessName(item.businesses[0]?.business.name);
  if (item.type?.name === "Prompt") return "cover-purple.svg";
  if (business === "Expert Academy") return "academy-python.svg";
  if (business === "Expert Code") return "code-auth.svg";
  return "stickers-space.svg";
}

function relativeDate(date: Date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 60) return minutes <= 1 ? "Ahora" : `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

function toCatalogItem(
  item: Awaited<ReturnType<typeof queryItems>>[number],
): CatalogItem {
  return {
    id: item.id,
    code: item.publicCode,
    title: item.title,
    business: businessName(item.businesses[0]?.business.name),
    type: item.type?.name ?? "Documento",
    status: item.status?.name ?? "Borrador",
    description: item.description,
    tags: item.tags.map(({ tag }) => tag.name),
    image: imageFor(item),
    updated: relativeDate(item.updatedAt),
  };
}

const include = {
  businesses: { include: { business: true } },
  type: true,
  status: true,
  tags: { include: { tag: true } },
} as const;

function queryItems(userId: string) {
  return db.catalogItem.findMany({
    where: { archivedAt: null, createdById: userId },
    include,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCatalogItems(userId: string) {
  return (await queryItems(userId)).map(toCatalogItem);
}

function toCanvasBlock(
  block: { id: string; type: string; content: unknown },
  index: number,
): CanvasBlock {
  const raw =
    block.content &&
    typeof block.content === "object" &&
    !Array.isArray(block.content)
      ? (block.content as Record<string, unknown>)
      : {};
  const span = ([4, 6, 8, 12] as BlockSpan[]).includes(raw.span as BlockSpan)
    ? (raw.span as BlockSpan)
    : 12;
  const supported = [
    "text",
    "ai",
    "callout",
    "prompt",
    "steps",
    "gallery",
    "diagram",
    "relations",
  ] as const;
  const type = supported.find((value) => value === block.type) ?? "text";
  const titles: Record<CanvasBlock["type"], string> = {
    text: index === 0 ? "Resumen" : "Contenido",
    ai: "Resumen generado por Gemini",
    callout: "Nota destacada",
    prompt: "Prompt",
    steps: "Proceso",
    gallery: "Galería",
    diagram: "Diagrama",
    relations: "Relaciones",
  };
  const content =
    type === "text"
      ? { ...raw, html: String(raw.html ?? raw.text ?? "") }
      : raw;
  return {
    id: block.id,
    type,
    title: String(raw.title ?? titles[type]),
    span,
    content,
  };
}

export async function getCanvasItem(idOrCode: string, userId: string) {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      idOrCode,
    );
  const item = await db.catalogItem.findFirst({
    where: isUuid
      ? { id: idOrCode, createdById: userId }
      : { publicCode: idOrCode, createdById: userId },
    include: { ...include, blocks: { orderBy: { position: "asc" } } },
  });
  if (!item) return null;
  return {
    item: toCatalogItem(item),
    blocks: item.blocks.length
      ? item.blocks.map(toCanvasBlock)
      : defaultBlocks.map((block) => ({ ...block, id: randomUUID() })),
  };
}
