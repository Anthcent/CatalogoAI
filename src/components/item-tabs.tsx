import Link from "next/link";

export function ItemTabs({ id, active }: { id: string; active: "canvas" | "relations" | "history" }) {
  const tabs = [["canvas", `/catalog/${id}`, "Canvas"], ["relations", `/catalog/${id}/relations`, "Relations"], ["history", `/catalog/${id}/history`, "History"]] as const;
  return <nav className="item-tabs">{tabs.map(([key, href, label]) => <Link className={active === key ? "active" : ""} href={href} key={key}>{label}</Link>)}</nav>;
}
