import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/session";
import { toMarkdown } from "@/modules/export/markdown";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){if(!await currentUser())return Response.json({error:"Unauthorized"},{status:401});const {id}=await params;const item=await db.catalogItem.findUnique({where:{id},include:{blocks:{orderBy:{position:"asc"}}}});if(!item)return Response.json({error:"Not found"},{status:404});return new Response(toMarkdown(item),{headers:{"content-type":"text/markdown; charset=utf-8","content-disposition":`attachment; filename="${item.publicCode}.md"`}})}
