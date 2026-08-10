# Prompt listo para entregar a la IA implementadora

Quiero que implementes **Expert Hub** como una aplicación web productiva.

Debes usar como fuentes de verdad:

1. `docs/planning_sistema_catalogo_inteligente.md`
2. `AI_IMPLEMENTATION_SPEC.md`
3. El mockup ejecutable `index.html` + `styles.css` + `app.js`
4. `assets/graphics-manifest.json` y toda la carpeta `assets/graphics/`

## Stack obligatorio

- Next.js
- TypeScript
- React
- Prisma ORM
- PostgreSQL
- Google Gemini

Arquitectura: **monolito modular**.

## Instrucción de fidelidad

El mockup no es una sugerencia estética genérica. Es el contrato visual y funcional.

Reproduce con alta fidelidad:

- sidebar;
- topbar;
- Inicio;
- búsqueda global;
- búsqueda semántica;
- catálogo;
- filtros;
- previews;
- fichas;
- lienzo;
- panel izquierdo del lienzo;
- panel derecho de propiedades;
- bloques;
- prompts;
- checklist/procesos;
- imágenes;
- galería;
- relaciones;
- diagramas manuales;
- autosave;
- versiones;
- exportación;
- builder de plantillas;
- Captura rápida;
- Bandeja;
- Biblioteca visual;
- Configuración de Gemini;
- modales;
- wizards;
- toasts;
- estados vacíos;
- responsive.

## Lienzo

El lienzo es una de las partes más importantes del sistema.

No lo sustituyas por formularios.

Debe ser modular y basado en bloques.

Debe usar un grid de 12 columnas.

Los bloques deben poder ocupar:

- 4/12 = 1/3;
- 6/12 = 1/2;
- 8/12 = 2/3;
- 12/12 = ancho completo.

Debe permitir:

- drag & drop;
- reordenamiento;
- redimensionamiento;
- dos bloques lado a lado;
- tres bloques lado a lado;
- composiciones mixtas;
- presets de layout;
- persistencia del layout por elemento.

En móvil debe colapsar a una columna.

## Búsqueda

La búsqueda por intención es una función central.

No implementes únicamente coincidencia textual.

Utiliza una estrategia híbrida con PostgreSQL y embeddings cuando corresponda.

Los resultados deben explicar por qué coinciden con la intención del usuario.

## Gemini

Gemini debe ayudar en:

- descripciones;
- resúmenes;
- categorización;
- etiquetas;
- Captura rápida;
- búsqueda semántica;
- relaciones sugeridas.

La configuración para el usuario debe seguir siendo sencilla.

## Assets

La aplicación debe arrancar con la biblioteca de SVG incluida en `assets/graphics/`.

No reemplaces esos gráficos por placeholders genéricos.

Deben poder usarse en:

- portadas;
- previews;
- tarjetas;
- galerías;
- lienzos.

Posteriormente el usuario también debe poder subir imágenes propias.

## Regla principal

No simplifiques funcionalidades importantes para convertir el producto en un CRUD tradicional.

Cuando una interacción del mockup sea simulada, conviértela en funcionalidad real.

Antes de dar por terminada una pantalla, compárala con el mockup y verifica que siga representando el mismo producto.
