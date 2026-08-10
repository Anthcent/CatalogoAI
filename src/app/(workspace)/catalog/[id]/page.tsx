import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CanvasEditor } from "@/components/canvas-editor";
import { ItemTabs } from "@/components/item-tabs";

export default async function ItemPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const item=await db.catalogItem.findUnique({where:{id},include:{blocks:{orderBy:{position:"asc"}}}}); if(!item)notFound();
  await db.catalogItem.update({where:{id},data:{lastOpenedAt:new Date(),openCount:{increment:1}}});
  return <><ItemTabs id={id} active="canvas"/><CanvasEditor item={item}/></>;
}
