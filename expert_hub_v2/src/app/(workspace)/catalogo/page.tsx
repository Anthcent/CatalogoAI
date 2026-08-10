import { CatalogView } from "@/features/catalog/catalog-view";
import { getCatalogItems } from "@/features/catalog/queries";
import { requireUser } from "@/features/auth/session";

export default async function CatalogPage() {
  const user = await requireUser();
  return <CatalogView sourceItems={await getCatalogItems(user.id)} />;
}
