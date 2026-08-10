import Image from "next/image";
import Link from "next/link";
import { Clock3, Filter, Search, Sparkles } from "lucide-react";
import { businessTone, type CatalogItem } from "@/features/catalog/data";

export function SearchView({
  initialQuery,
  initialMode,
  results,
}: {
  initialQuery: string;
  initialMode: string;
  results: CatalogItem[];
}) {
  return (
    <div className="page search-page">
      <header className="page-title">
        <div>
          <small>ENCUENTRA POR SIGNIFICADO</small>
          <h1>Busca lo que necesitas hacer</h1>
          <p>
            Describe tu intención aunque no recuerdes nombres o palabras
            exactas.
          </p>
        </div>
        <button className="soft-button">
          <Clock3 />
          Historial
        </button>
      </header>
      <form className="semantic-box" action="/buscar">
        <textarea
          name="q"
          defaultValue={initialQuery}
          placeholder="Ejemplo: quiero crear stickers para cuadernos usando IA y prepararlos para imprimir"
        />
        <div className="search-controls">
          <div className="mode-switch">
            {[
              ["intent", "Intención"],
              ["text", "Texto"],
              ["code", "Código"],
            ].map(([value, label]) => (
              <label
                className={initialMode === value ? "active" : ""}
                key={value}
              >
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  defaultChecked={initialMode === value}
                />
                {label}
              </label>
            ))}
          </div>
          <button type="button" className="filter-button">
            <Filter />
            Filtros
          </button>
          <button className="search-button">
            <Search />
            Buscar
          </button>
        </div>
      </form>
      <div className="search-layout">
        <section>
          <div className="results-heading">
            <b>{results.length} resultados</b>
            <span>Ordenados por relevancia</span>
          </div>
          <div className="results">
            {results.map((item, index) => (
              <article
                className={`result ${index === 0 ? "best" : ""}`}
                key={item.id}
              >
                <div className={`result-thumb ${businessTone(item.business)}`}>
                  <Image
                    src={`/api/mockup-assets/${item.image}`}
                    alt=""
                    fill
                    sizes="120px"
                  />
                </div>
                <div className="result-body">
                  <div className="result-meta">
                    <div>
                      <code>{item.code}</code>
                      <span
                        className={`company ${businessTone(item.business)}`}
                      >
                        {item.business}
                      </span>
                    </div>
                    <b>{item.relevance}%</b>
                  </div>
                  <Link href={`/elementos/${item.id}`}>
                    <h2>{item.title}</h2>
                  </Link>
                  <p>{item.description}</p>
                  <div className="why">
                    <Sparkles />
                    <span>
                      <b>Por qué aparece</b>
                      {item.reason}
                    </span>
                  </div>
                  <footer>
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </footer>
                </div>
              </article>
            ))}
          </div>
          {initialQuery && results.length === 0 && (
            <div className="empty-state">
              <Search />
              <h2>No encontramos coincidencias</h2>
              <p>Prueba con una intención más amplia o busca por código.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
