import Link from "next/link";
import { ArrowLeft, Link2, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import {
  createRelationAction,
  deleteRelationAction,
} from "@/features/relations/actions";

export default async function RelationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const [item, candidates] = await Promise.all([
    db.catalogItem.findFirst({
      where: { id, createdById: user.id },
      include: {
        outgoing: { include: { target: true } },
        incoming: { include: { source: true } },
      },
    }),
    db.catalogItem.findMany({
      where: { createdById: user.id, id: { not: id }, archivedAt: null },
      orderBy: { title: "asc" },
      select: { id: true, title: true, publicCode: true },
    }),
  ]);
  if (!item) notFound();
  return (
    <div className="page workspace-page">
      <header className="page-title">
        <div>
          <Link href={`/elementos/${id}`}>
            <ArrowLeft /> Volver al lienzo
          </Link>
          <h1>Relaciones</h1>
          <p>
            {item.publicCode} · {item.title}
          </p>
        </div>
      </header>
      <form className="quick-capture" action={createRelationAction}>
        <Link2 />
        <input type="hidden" name="sourceItemId" value={id} />
        <select name="targetItemId" required>
          <option value="">Selecciona un elemento</option>
          {candidates.map((candidate) => (
            <option value={candidate.id} key={candidate.id}>
              {candidate.publicCode} · {candidate.title}
            </option>
          ))}
        </select>
        <input name="relationType" defaultValue="relacionado con" />
        <button>Relacionar</button>
      </form>
      <section className="inbox-list">
        {item.outgoing.map((relation) => (
          <article key={relation.id}>
            <div className="inbox-icon">
              <Link2 />
            </div>
            <div>
              <h2>
                {relation.target.publicCode} · {relation.target.title}
              </h2>
              <p>{relation.relationType}</p>
            </div>
            <form action={deleteRelationAction}>
              <input type="hidden" name="id" value={relation.id} />
              <button>
                <Trash2 />
              </button>
            </form>
          </article>
        ))}
        {item.incoming.map((relation) => (
          <article key={relation.id}>
            <div className="inbox-icon">
              <Link2 />
            </div>
            <div>
              <h2>
                {relation.source.publicCode} · {relation.source.title}
              </h2>
              <p>{relation.relationType} · entrante</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
