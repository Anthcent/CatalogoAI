import { LayoutTemplate } from "lucide-react";
import { db } from "@/lib/db";
import { createTemplateAction } from "@/features/templates/actions";

export default async function NewTemplatePage() {
  const [businesses, types] = await Promise.all([
    db.business.findMany({ where: { active: true } }),
    db.itemType.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="page new-item-page">
      <header className="page-title">
        <div>
          <small>ESTRUCTURA REUTILIZABLE</small>
          <h1>Nueva plantilla</h1>
          <p>
            Una sección por línea; cada una se convierte en un bloque editable.
          </p>
        </div>
      </header>
      <form action={createTemplateAction} className="new-item-form">
        <section>
          <span>
            <LayoutTemplate />
          </span>
          <div>
            <h2>Diseña el punto de partida</h2>
            <p>
              La estructura debe ayudar, no obligar a completar campos
              innecesarios.
            </p>
          </div>
        </section>
        <label>
          Nombre
          <input name="name" required maxLength={120} />
        </label>
        <label>
          Descripción
          <input name="description" maxLength={500} />
        </label>
        <label>
          Empresa
          <select name="businessId">
            <option value="">Compartida</option>
            {businesses.map((business) => (
              <option value={business.id} key={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select name="typeId">
            <option value="">Documento</option>
            {types.map((type) => (
              <option value={type.id} key={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Secciones
          <textarea
            name="sections"
            required
            rows={9}
            defaultValue={
              "Resumen\nObjetivo\nContenido principal\nRecursos\nResultado final"
            }
          />
        </label>
        <footer>
          <a href="/plantillas">Cancelar</a>
          <button className="primary-button">Crear plantilla</button>
        </footer>
      </form>
    </div>
  );
}
