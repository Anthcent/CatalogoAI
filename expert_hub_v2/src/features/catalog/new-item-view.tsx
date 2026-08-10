import { ArrowRight, FilePlus2, LayoutTemplate, Sparkles } from "lucide-react";
import { createItemAction } from "./actions";

type Option = { id: string; name: string; description?: string };

export function NewItemView({
  businesses,
  templates,
  selectedTemplate = "",
}: {
  businesses: Option[];
  templates: Option[];
  selectedTemplate?: string;
}) {
  return (
    <div className="page new-item-page">
      <header className="page-title">
        <div>
          <small>NUEVO CONOCIMIENTO</small>
          <h1>Crear elemento</h1>
          <p>
            Define el punto de partida. Podrás cambiar toda la estructura en el
            lienzo.
          </p>
        </div>
      </header>
      <form action={createItemAction} className="new-item-form">
        <section>
          <span>
            <FilePlus2 />
          </span>
          <div>
            <small>PASO 1</small>
            <h2>¿Qué vas a documentar?</h2>
            <p>Usa un nombre concreto que puedas reconocer más adelante.</p>
          </div>
        </section>
        <label>
          Título
          <input
            name="title"
            required
            maxLength={240}
            autoFocus
            placeholder="Ej. Colección de stickers para ciencias"
          />
        </label>
        <label>
          Empresa
          <select name="businessId" defaultValue="">
            <option value="">General / Compartido</option>
            {businesses.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>
            <LayoutTemplate />
            Elige una estructura
          </legend>
          <div className="template-options">
            <label>
              <input
                type="radio"
                name="templateId"
                value=""
                defaultChecked={!selectedTemplate}
              />
              <span>
                <Sparkles />
                <b>Documento libre</b>
                <small>Empieza con un lienzo vacío</small>
              </span>
            </label>
            {templates.map((template) => (
              <label key={template.id}>
                <input
                  type="radio"
                  name="templateId"
                  value={template.id}
                  defaultChecked={selectedTemplate === template.id}
                />
                <span>
                  <LayoutTemplate />
                  <b>{template.name}</b>
                  <small>{template.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <footer>
          <a href="/catalogo">Cancelar</a>
          <button className="primary-button">
            Crear y abrir lienzo
            <ArrowRight />
          </button>
        </footer>
      </form>
    </div>
  );
}
