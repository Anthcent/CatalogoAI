import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const templates = [
  ["Planificación de clase", "Objetivos, materiales, actividades y evaluación", ["Objetivos", "Duración y contenido", "Materiales", "Actividades", "Evaluación", "Notas"]],
  ["Producto físico", "Concepto, materiales y producción repetible", ["Descripción", "Concepto", "Materiales", "Prompt de IA", "Pasos de producción", "Resultado final"]],
  ["Sticker", "Flujo de diseño e impresión", ["Temática", "Prompt de IA", "Imágenes generadas", "Tamaño y materiales", "Lista de impresión", "Archivo final"]],
  ["Repositorio GitHub", "Referencia técnica lista para reutilizar", ["Propósito", "Instalación", "Uso", "Fragmentos importantes", "Problemas conocidos"]],
  ["Investigación", "Pregunta, fuentes y hallazgos prácticos", ["Pregunta", "Resumen", "Fuentes", "Hallazgos", "Conclusiones", "Próximos pasos"]],
  ["Proceso / flujo de trabajo", "Procedimiento operativo repetible", ["Objetivo", "Precondiciones", "Materiales", "Pasos", "Problemas conocidos", "Mejoras"]],
  ["Documento libre", "Espacio abierto de escritura", [""]],
] as const;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if ((email && !password) || (!email && password) || (password && password.length < 12)) throw new Error("Las credenciales de seed deben estar completas y la contraseña debe tener al menos 12 caracteres.");
  if (email && password) await db.user.upsert({ where: { email }, update: {}, create: { email, name: "Administrador", passwordHash: await hash(password, 12) } });
  for (const [name, slug, color] of [["Expert Academy","expert-academy","#2563eb"],["Expert Design","expert-design","#d9563f"],["Expert Code","expert-code","#1e694b"],["General / Compartido","general","#64748b"]]) await db.business.upsert({where:{slug},update:{name,color},create:{name,slug,color}});
  for (const name of ["Planificación","Producto","Proceso","Recurso web","Repositorio","Prompt","Documento","Investigación","Servicio","Idea","Referencia","Colección","Flujo de trabajo"]) await db.itemType.upsert({where:{name},update:{},create:{name}});
  for (const name of ["Diseño gráfico","Impresión","Inteligencia artificial","Educación","Desarrollo web","Marketing"]) await db.category.upsert({where:{name},update:{},create:{name}});
  const statuses=[["Idea","#8b5cf6"],["Borrador","#64748b"],["En proceso","#d97706"],["Probado","#2563eb"],["Listo","#16a34a"],["Activo","#1e694b"],["Pausado","#78716c"],["Archivado","#374151"]];
  for (const [order,[name,color]] of statuses.entries()) await db.status.upsert({where:{name},update:{order,color},create:{name,color,order}});
  for (const [name,description,headings] of templates) await db.template.upsert({where:{name},update:{description},create:{name,description,structure:headings.map((text,index)=>({type:index===0?"heading":"paragraph",content:{text}}))}});
  console.log("Datos iniciales verificados.");
}

main().finally(()=>db.$disconnect());
