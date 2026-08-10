import { describe, expect, it } from "vitest";
import { toMarkdown } from "./markdown";

describe("toMarkdown",()=>{it("preserves identity and block structure",()=>{const output=toMarkdown({publicCode:"EXP-ABC234",title:"Print workflow",description:"Reusable steps",blocks:[{type:"heading",content:{text:"Materials"}},{type:"code",content:{text:"npm run build"}}]});expect(output).toContain("# Print workflow");expect(output).toContain("**Code:** EXP-ABC234");expect(output).toContain("## Materials");expect(output).toContain("```\nnpm run build\n```")})});
