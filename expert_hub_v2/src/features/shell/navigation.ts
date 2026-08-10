import { Archive,BookOpen,Boxes,Home,Inbox,LayoutTemplate,Search,Settings } from "lucide-react";

export const navigation=[
  {href:"/",label:"Inicio",icon:Home},
  {href:"/buscar",label:"Buscar",icon:Search},
  {href:"/catalogo",label:"Catálogo",icon:BookOpen,count:128},
  {href:"/plantillas",label:"Plantillas",icon:LayoutTemplate},
  {href:"/biblioteca",label:"Biblioteca visual",icon:Boxes,count:40},
  {href:"/bandeja",label:"Bandeja",icon:Inbox,alert:true},
  {href:"/configuracion",label:"Configuración",icon:Settings},
] as const;
export const businesses=[{label:"Expert Academy",color:"academy",count:42},{label:"Expert Design",color:"design",count:51},{label:"Expert Code",color:"code",count:35}] as const;
export const ArchiveIcon=Archive;
