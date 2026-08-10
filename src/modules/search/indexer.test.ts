import { describe, expect, it } from "vitest";
import { indexableChunks } from "./chunks";
import { cosineSimilarity } from "./similarity";

describe("indexableChunks", () => {
  it("splits metadata and useful blocks without indexing opaque JSON", () => {
    const chunks = indexableChunks({ title: "Sticker process", description: "Print reusable designs", summary: "", blocks: [
      { id: "one", type: "prompt", content: { text: "Generate an illustration", variables: ["style"] } },
      { id: "two", type: "image", content: { width: 400 } },
    ] });
    expect(chunks).toEqual([
      { sourceType: "metadata", sourceId: null, text: "Sticker process\nPrint reusable designs" },
      { sourceType: "prompt", sourceId: "one", text: "Generate an illustration" },
    ]);
  });
});

describe("cosineSimilarity", () => {
  it("scores equal vectors above unrelated vectors", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });
});
