import { describe, expect, it } from "vitest";
import { indexableChunks } from "./chunks";
import { cosineSimilarity } from "./similarity";

describe("semantic search helpers", () => {
  it("extracts nested V2 block content", () => {
    const chunks = indexableChunks({
      title: "Stickers",
      description: "Colección",
      summary: "",
      blocks: [
        {
          id: "one",
          type: "steps",
          content: { steps: ["Diseñar", "Imprimir"], variables: ["tema"] },
        },
      ],
    });
    expect(chunks[1].text).toContain("Diseñar");
    expect(chunks[1].text).toContain("tema");
  });

  it("computes bounded cosine similarity", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    expect(cosineSimilarity([1], [1, 2])).toBe(0);
  });
});
