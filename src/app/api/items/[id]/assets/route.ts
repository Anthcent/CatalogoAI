import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/session";
import { LocalStorageProvider } from "@/modules/storage/local";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){if(!await currentUser())return Response.json({error:"Unauthorized"},{status:401});const {id}=await params;const item=await db.catalogItem.findUnique({where:{id},select:{id:true}});if(!item)return Response.json({error:"Not found"},{status:404});const file=(await request.formData()).get("file");if(!(file instanceof File))return Response.json({error:"A file is required"},{status:400});try{const provider=new LocalStorageProvider();const stored=await provider.upload(file);const asset=await db.asset.create({data:{itemId:id,storageType:"local",...stored}});return Response.json({...asset,url:provider.getUrl(stored.path)},{status:201})}catch(error){return Response.json({error:error instanceof Error?error.message:"Upload failed"},{status:400})}}
