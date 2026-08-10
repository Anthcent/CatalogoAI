import { describe, expect, it } from "vitest";
import { createBlockContent } from "./types";

describe("createBlockContent", () => {
  it("creates independent specialized prompt and checklist structures", () => {
    expect(createBlockContent("prompt")).toMatchObject({ model: "Gemini", variables: "" });
    expect(createBlockContent("checklist")).toEqual({ items: [{ text: "", checked: false }] });
  });
});
