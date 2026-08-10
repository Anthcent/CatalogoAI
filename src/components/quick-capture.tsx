import { quickCaptureAction } from "@/modules/catalog/actions";

export function QuickCapture() {
  return <form action={quickCaptureAction} className="card form-stack">
    <div><span className="eyebrow">Captura primero</span><h2 style={{marginBottom:5}}>Guárdalo antes de que desaparezca</h2></div>
    <input className="field" name="title" placeholder="Título opcional" />
    <textarea className="field" name="content" required placeholder="Pega una idea, nota o URL..." rows={4}/>
    <button className="btn primary">Enviar a la bandeja</button>
  </form>;
}
