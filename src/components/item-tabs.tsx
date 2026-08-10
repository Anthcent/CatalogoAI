import Link from "next/link";

export function ItemTabs({ id, active }: { id: string; active: "canvas" | "properties" | "resources" | "relations" | "history" }) {
  const tabs = [["canvas", `/catalog/${id}`, "Lienzo"], ["properties", `/catalog/${id}/properties`, "Propiedades"], ["resources", `/catalog/${id}/resources`, "Recursos"], ["relations", `/catalog/${id}/relations`, "Relaciones"], ["history", `/catalog/${id}/history`, "Historial"]] as const;
  return <nav className="item-tabs">{tabs.map(([key, href, label]) => <Link className={active === key ? "active" : ""} href={href} key={key}>{label}</Link>)}</nav>;
}
