import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import { restoreVersionAction } from "@/features/versions/actions";

export default async function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const item = await db.catalogItem.findFirst({
    where: { id, createdById: user.id },
    include: { versions: { orderBy: { version: "desc" } } },
  });
  if (!item) notFound();
  return (
    <div className="page workspace-page">
      <header className="page-title">
        <div>
          <Link href={`/elementos/${id}`}>
            <ArrowLeft /> Volver al lienzo
          </Link>
          <h1>Historial de versiones</h1>
          <p>
            {item.publicCode} · {item.title}
          </p>
        </div>
      </header>
      <section className="inbox-list">
        {item.versions.map((version) => (
          <article key={version.id}>
            <div className="inbox-icon">
              <History />
            </div>
            <div>
              <h2>Versión {version.version}</h2>
              <p>
                {version.summary} ·{" "}
                {new Intl.DateTimeFormat("es", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(version.createdAt)}
              </p>
            </div>
            <form action={restoreVersionAction}>
              <input type="hidden" name="itemId" value={id} />
              <input type="hidden" name="versionId" value={version.id} />
              <button>Restaurar</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
