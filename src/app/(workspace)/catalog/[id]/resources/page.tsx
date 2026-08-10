import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { AssetUploader } from "@/components/asset-uploader";
import { addExternalLinkAction, deleteAssetAction, deleteExternalLinkAction } from "@/modules/catalog/actions";

function formatSize(size: number) { return size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`; }

export default async function ResourcesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.catalogItem.findUnique({ where: { id }, include: { assets: { orderBy: { createdAt: "desc" } }, links: true } });
  if (!item) notFound();
  return <><ItemTabs id={id} active="resources"/><main className="page" style={{maxWidth:950}}><span className="eyebrow">{item.publicCode}</span><h1>Archivos y enlaces</h1><AssetUploader itemId={id}/><div className="section-title"><h2>Archivos</h2><span className="subtle">{item.assets.length} adjuntos</span></div>{item.assets.length?<div className="resource-list">{item.assets.map(asset=><article className="card resource-row" key={asset.id}><FileText/><div><Link href={`/api/assets/${encodeURIComponent(asset.path)}`} target="_blank"><b>{asset.fileName}</b></Link><small className="subtle">{asset.mimeType} · {formatSize(asset.size)}</small></div><form action={deleteAssetAction}><input type="hidden" name="itemId" value={id}/><input type="hidden" name="id" value={asset.id}/><button className="icon-btn" aria-label="Eliminar archivo"><Trash2 size={17}/></button></form></article>)}</div>:<p className="subtle">Todavía no hay archivos adjuntos.</p>}<div className="section-title"><h2>Enlaces externos</h2></div><form action={addExternalLinkAction} className="card relation-form"><input type="hidden" name="itemId" value={id}/><input className="field" name="title" placeholder="Nombre del recurso"/><input className="field" name="url" type="url" required placeholder="https://..."/><button className="btn primary">Agregar enlace</button></form><div className="resource-list">{item.links.map(link=><article className="card resource-row" key={link.id}><ExternalLink/><div><Link href={link.url} target="_blank" rel="noreferrer"><b>{link.title}</b></Link><small className="subtle">{link.url}</small></div><form action={deleteExternalLinkAction}><input type="hidden" name="itemId" value={id}/><input type="hidden" name="id" value={link.id}/><button className="icon-btn" aria-label="Eliminar enlace"><Trash2 size={17}/></button></form></article>)}</div></main></>;
}
