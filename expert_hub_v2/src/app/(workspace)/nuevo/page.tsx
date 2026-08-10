import { NewItemView } from "@/features/catalog/new-item-view";
import { db } from "@/lib/db";

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const [businesses, templates] = await Promise.all([
    db.business.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.template.findMany({ orderBy: [{ uses: "desc" }, { name: "asc" }] }),
  ]);
  return (
    <NewItemView
      businesses={businesses}
      templates={templates}
      selectedTemplate={(await searchParams).template}
    />
  );
}
