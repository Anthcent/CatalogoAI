import {describe,expect,it} from "vitest";
import {catalogItems,filterCatalogItems} from "./data";

describe("filterCatalogItems",()=>{it("encuentra por código, etiqueta y descripción",()=>{expect(filterCatalogItems(catalogItems,"EXP-C9N2TX")).toHaveLength(1);expect(filterCatalogItems(catalogItems,"impresión").map(item=>item.id)).toContain("stickers-space");expect(filterCatalogItems(catalogItems,"autenticación")[0].id).toBe("next-auth")});it("devuelve todo sin consulta",()=>{expect(filterCatalogItems(catalogItems," ")).toBe(catalogItems)})});
