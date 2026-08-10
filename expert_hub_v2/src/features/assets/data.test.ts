import {describe,expect,it} from "vitest";
import {filterAssets,visualAssets} from "./data";
describe("biblioteca visual",()=>{it("contiene los 40 recursos del contrato",()=>expect(visualAssets).toHaveLength(40));it("filtra categoría y texto",()=>{expect(filterAssets("","Stickers")).toHaveLength(8);expect(filterAssets("github","Todos")[0].file).toBe("code-github.svg")})});
