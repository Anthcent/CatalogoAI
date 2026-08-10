import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const templates = [
  ["Class plan", "Objectives, material, activities and evaluation", ["Objectives", "Duration and content", "Materials", "Activities", "Evaluation", "Notes"]],
  ["Physical product", "Concept, materials and repeatable production", ["Description", "Concept", "Materials", "AI prompt", "Production steps", "Final result"]],
  ["Sticker", "Design and printing workflow", ["Theme", "AI prompt", "Generated images", "Size and materials", "Print checklist", "Final file"]],
  ["GitHub repository", "Technical reference ready to reuse", ["Purpose", "Installation", "Usage", "Important snippets", "Known issues"]],
  ["Research", "Question, sources and practical findings", ["Question", "Summary", "Sources", "Findings", "Conclusions", "Next steps"]],
  ["Process / workflow", "A repeatable operational procedure", ["Objective", "Preconditions", "Materials", "Steps", "Known problems", "Improvements"]],
  ["Free document", "An open writing space", [""]],
] as const;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@catalogo.local";
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) throw new Error("SEED_ADMIN_PASSWORD must contain at least 12 characters.");
  await db.user.upsert({ where: { email }, update: {}, create: { email, name: "Administrator", passwordHash: await hash(password, 12) } });
  for (const [name, slug, color] of [["Expert Academy","expert-academy","#2563eb"],["Expert Design","expert-design","#d9563f"],["Expert Code","expert-code","#1e694b"],["General / Shared","general","#64748b"]]) await db.business.upsert({where:{slug},update:{name,color},create:{name,slug,color}});
  for (const name of ["Planning","Product","Process","Web resource","Repository","Prompt","Document","Research","Service","Idea","Reference","Collection","Workflow"]) await db.itemType.upsert({where:{name},update:{},create:{name}});
  for (const name of ["Graphic design","Printing","Artificial intelligence","Education","Web development","Marketing"]) await db.category.upsert({where:{name},update:{},create:{name}});
  const statuses=[["Idea","#8b5cf6"],["Draft","#64748b"],["In progress","#d97706"],["Tested","#2563eb"],["Ready","#16a34a"],["Active","#1e694b"],["Paused","#78716c"],["Archived","#374151"]];
  for (const [order,[name,color]] of statuses.entries()) await db.status.upsert({where:{name},update:{order,color},create:{name,color,order}});
  for (const [name,description,headings] of templates) await db.template.upsert({where:{name},update:{description},create:{name,description,structure:headings.map((text,index)=>({type:index===0?"heading":"paragraph",content:{text}}))}});
  console.log(`Seeded administrator account: ${email}`);
}

main().finally(()=>db.$disconnect());
