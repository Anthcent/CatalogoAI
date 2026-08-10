import { describe, expect, it } from "vitest";
import {
  applyPreset,
  createBlock,
  defaultBlocks,
  duplicateBlock,
  moveBlock,
  reorderBlock,
  smartPattern,
} from "./types";

describe("canvas block helpers", () => {
  it("applies one, two, three and smart compositions", () => {
    expect(applyPreset(defaultBlocks, "one").every((block) => block.span === 12)).toBe(true);
    expect(applyPreset(defaultBlocks, "two").every((block) => block.span === 6)).toBe(true);
    expect(applyPreset(defaultBlocks, "three").every((block) => block.span === 4)).toBe(true);
    expect(applyPreset(defaultBlocks, "free").map((block) => block.span)).toEqual(smartPattern.slice(0, defaultBlocks.length));
  });

  it("creates every picker block with specialized persisted content", () => {
    const types = ["text", "heading", "checklist", "table", "prompt", "steps", "image", "gallery", "file", "link", "diagram", "relations"] as const;
    for (const type of types) {
      const block = createBlock(type, `id-${type}`);
      expect(block).toMatchObject({ id: `id-${type}`, type });
      expect(Object.keys(block.content).length).toBeGreaterThan(0);
    }
  });

  it("duplicates with a new identity and independent content", () => {
    const original = createBlock("gallery", "original");
    const copy = duplicateBlock(original, "copy");
    expect(copy.id).toBe("copy");
    expect(copy.title).toContain("copia");
    expect(copy.content).not.toBe(original.content);
    expect(duplicateBlock({ ...original, title: "x".repeat(120) }, "bounded").title).toHaveLength(120);
  });

  it("moves and reorders blocks without changing their identities", () => {
    const blocks = defaultBlocks.slice(0, 3);
    expect(moveBlock(blocks, blocks[1].id, -1).map((block) => block.id)).toEqual([blocks[1].id, blocks[0].id, blocks[2].id]);
    expect(reorderBlock(blocks, blocks[0].id, blocks[2].id).map((block) => block.id)).toEqual([blocks[1].id, blocks[2].id, blocks[0].id]);
    expect(moveBlock(blocks, blocks[0].id, -1)).toBe(blocks);
  });
});
