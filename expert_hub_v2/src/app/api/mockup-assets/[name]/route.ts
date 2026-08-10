import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(_:Request,{params}:{params:Promise<{name:string}>}){const name=path.basename((await params).name);if(!/^[a-z0-9-]+\.svg$/.test(name))return new Response("Recurso inválido",{status:400});try{const file=await readFile(path.join(process.cwd(),"..","expert_catalog_mockup","assets","graphics",name));return new Response(new Uint8Array(file),{headers:{"content-type":"image/svg+xml","cache-control":"public, max-age=31536000, immutable"}})}catch{return new Response("No encontrado",{status:404})}}
