import { InboxView } from "@/features/inbox/inbox-view";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

export default async function InboxPage() {
  const user = await requireUser();
  const items = await db.catalogItem.findMany({
    where: { createdById: user.id, inInbox: true, archivedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, createdAt: true },
  });
  return (
    <InboxView
      items={items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
