import { quickCaptureAction } from "@/modules/catalog/actions";

export function QuickCapture() {
  return <form action={quickCaptureAction} className="card form-stack">
    <div><span className="eyebrow">Capture first</span><h2 style={{marginBottom:5}}>Save it before it disappears</h2></div>
    <input className="field" name="title" placeholder="Optional title" />
    <textarea className="field" name="content" required placeholder="Paste an idea, note or URL..." rows={4}/>
    <button className="btn primary">Send to inbox</button>
  </form>;
}
