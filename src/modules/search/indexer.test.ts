import { describe, expect, it } from "vitest";
import { indexableChunks } from "./chunks";

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
