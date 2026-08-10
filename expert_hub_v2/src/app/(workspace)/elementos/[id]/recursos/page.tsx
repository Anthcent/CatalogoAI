import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import { ResourceUploader } from "@/features/assets/resource-uploader";

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const item = await db.catalogItem.findFirst({
    where: { id, createdById: user.id },
    include: { assets: { orderBy: { createdAt: "desc" } } },
  });
  if (!item) notFound();
  return (
    <div className="page workspace-page">
      <header className="page-title">
        <div>
          <Link href={`/elementos/${id}`}>
            <ArrowLeft /> Volver al lienzo
          </Link>
          <h1>Recursos</h1>
          <p>{item.publicCode} · archivos asociados</p>
        </div>
      </header>
      <ResourceUploader itemId={id} />
      <section className="inbox-list">
        {item.assets.map((asset) => (
          <article key={asset.id}>
            <div className="inbox-icon">
              <FileText />
            </div>
            <div>
              <h2>
                <a
                  href={`/api/assets/${encodeURIComponent(asset.path)}`}
                  target="_blank"
                >
                  {asset.fileName}
                </a>
              </h2>
              <p>
                {asset.mimeType} · {(asset.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
