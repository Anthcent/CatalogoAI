import { db } from "@/lib/db";

export async function getSetting(key:string,fallback:string){const setting=await db.appSetting.findUnique({where:{key}});return setting?.value||fallback}
