"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/modules/auth/session";

export async function saveAiModelsAction(formData:FormData){await requireUser();const generationModel=String(formData.get("generationModel")??"").replace(/^models\//,"");const embeddingModel=String(formData.get("embeddingModel")??"").replace(/^models\//,"");if(!generationModel||!embeddingModel)throw new Error("Selecciona ambos modelos.");await db.$transaction([db.appSetting.upsert({where:{key:"generation_model"},update:{value:generationModel},create:{key:"generation_model",value:generationModel}}),db.appSetting.upsert({where:{key:"embedding_model"},update:{value:embeddingModel},create:{key:"embedding_model",value:embeddingModel}})]);revalidatePath("/settings")}
