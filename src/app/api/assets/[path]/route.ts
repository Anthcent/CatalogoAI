import { readFile } from "node:fs/promises";
import path from "node:path";
import { currentUser } from "@/modules/auth/session";

export async function GET(_:Request,{params}:{params:Promise<{path:string}>}){if(!await currentUser())return Response.json({error:"Unauthorized"},{status:401});const fileName=path.basename(decodeURIComponent((await params).path));try{const data=await readFile(path.join(process.cwd(),"uploads",fileName));return new Response(new Uint8Array(data))}catch{return Response.json({error:"Not found"},{status:404})}}
