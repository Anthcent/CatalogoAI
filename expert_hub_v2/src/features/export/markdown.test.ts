import { describe, expect, it } from "vitest";
import { toMarkdown } from "./markdown";

describe("V2 markdown export", () => {
  it("exports structured blocks without layout metadata", () => {
    const output = toMarkdown({
      publicCode: "EXP-1",
      title: "Proceso",
      description: "Demo",
      blocks: [
        {
          type: "steps",
          content: { title: "Pasos", span: 6, steps: ["Diseñar", "Imprimir"] },
        },
      ],
    });
    expect(output).toContain("## Pasos");
    expect(output).toContain("- Diseñar");
    expect(output).not.toContain("span:");
  });
});
