import { SearchView } from "@/features/search/search-view";
import { searchItems } from "@/features/search/service";
import { requireUser } from "@/features/auth/session";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mode?: string }>;
}) {
  const user = await requireUser();
  const { q = "", mode = "intent" } = await searchParams;
  return (
    <SearchView
      initialQuery={q}
      initialMode={mode}
      results={await searchItems(q, user.id, mode)}
    />
  );
}
