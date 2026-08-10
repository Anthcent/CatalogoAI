import { describe, expect, it } from "vitest";
import { applyPreset, defaultBlocks } from "./types";
describe("presets del lienzo", () => {
  it("aplica una, dos y tres columnas", () => {
    expect(
      applyPreset(defaultBlocks, "one").every((block) => block.span === 12),
    ).toBe(true);
    expect(
      applyPreset(defaultBlocks, "two").every((block) => block.span === 6),
    ).toBe(true);
    expect(
      applyPreset(defaultBlocks, "three").every((block) => block.span === 4),
    ).toBe(true);
  });
  it("mantiene la composición libre", () =>
    expect(applyPreset(defaultBlocks, "free")).toBe(defaultBlocks));
});
