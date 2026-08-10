import { describe, expect, it } from "vitest";
import { generatePublicCode } from "./code";

describe("generatePublicCode",()=>{it("creates a stable recognizable format",()=>{expect(generatePublicCode(()=>0)).toBe("EXP-AAAAAA")});it("does not use ambiguous characters",()=>{expect(generatePublicCode(()=>0.999999)).toMatch(/^EXP-[A-HJ-NP-Z2-9]{6}$/)})});
