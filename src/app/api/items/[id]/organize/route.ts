import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/session";
import { organizeContent } from "@/modules/ai/service";

export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){if(!await currentUser())return Response.json({error:"Unauthorized"},{status:401});const {id}=await params;const item=await db.catalogItem.findUnique({where:{id},include:{blocks:true}});if(!item)return Response.json({error:"Not found"},{status:404});try{const text=[item.title,item.description,...item.blocks.map(b=>JSON.stringify(b.content))].join("\n");return Response.json(await organizeContent(text))}catch(error){return Response.json({error:error instanceof Error?error.message:"AI failed"},{status:503})}}
