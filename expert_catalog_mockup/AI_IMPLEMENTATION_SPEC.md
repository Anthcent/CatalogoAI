# Expert Hub — Especificación para implementación con IA

## 1. Propósito de este paquete

Este paquete no es únicamente una inspiración visual. Es la **referencia funcional y visual del frontend** que debe seguir la implementación productiva de Expert Hub.

La aplicación final debe conservar:

- la jerarquía visual;
- la navegación;
- los módulos;
- los flujos;
- la distribución general;
- el comportamiento de modales, paneles y wizards;
- el concepto de catálogo;
- la búsqueda por intención;
- la biblioteca visual;
- el lienzo modular;
- el builder de plantillas;
- las relaciones;
- el versionado;
- la captura rápida;
- la configuración de Gemini;
- la exportación;
- y la sensación de uso simple, rápida y poco técnica.

No se debe reducir el proyecto a un CRUD tradicional con formularios.

---

## 2. Jerarquía de fuentes de verdad

Al implementar el sistema, usar este orden:

1. `docs/planning_sistema_catalogo_inteligente.md`
   - Define alcance, producto, arquitectura y funcionalidades.

2. El mockup ejecutable:
   - `index.html`
   - `styles.css`
   - `app.js`
   - Define apariencia, navegación, composición y comportamiento esperado.

3. Este documento:
   - `AI_IMPLEMENTATION_SPEC.md`
   - Explica cómo interpretar el mockup durante la implementación.

4. `assets/graphics-manifest.json`
   - Define la biblioteca visual inicial que debe existir en el producto.

Si una pantalla aparece funcionalmente en el mockup, debe considerarse parte del producto salvo que el planning indique expresamente lo contrario.

---

## 3. Stack productivo acordado

Implementar como **monolito modular**.

### Aplicación

- Next.js
- TypeScript
- React
- App Router recomendado

### Backend

Usar el propio proyecto Next.js como backend principal mediante:

- Server Actions cuando sea apropiado;
- Route Handlers para APIs;
- servicios internos por módulos;
- validación de inputs;
- separación clara entre UI, dominio, servicios y persistencia.

No crear un segundo backend independiente salvo que exista una razón técnica fuerte.

### Persistencia

- PostgreSQL
- Prisma ORM

### IA

- Google Gemini

Gemini debe utilizarse para:

- creación/mejora de descripciones;
- clasificación sugerida;
- etiquetas sugeridas;
- búsqueda semántica;
- extracción de intención;
- relaciones sugeridas;
- resúmenes;
- asistencia durante Captura rápida.

La interfaz no debe exponer parámetros técnicos innecesarios al usuario.

---

## 4. Principio UX principal

La aplicación tiene muchas capacidades, pero **no debe sentirse compleja**.

Aplicar estas reglas:

- mostrar solo lo necesario en cada momento;
- usar modales para decisiones puntuales;
- usar wizards cortos cuando exista una secuencia;
- usar paneles laterales para propiedades secundarias;
- evitar páginas compuestas únicamente por formularios;
- utilizar chips, botones, selectores, toggles, previews y acciones contextuales;
- minimizar la cantidad de clics para llegar a funciones frecuentes;
- conservar búsqueda global accesible;
- conservar creación rápida accesible;
- conservar Captura rápida accesible;
- mostrar previews siempre que aporten contexto.

---

## 5. Estructura principal

La navegación lateral debe mantener como mínimo:

- Inicio
- Buscar
- Catálogo
- Plantillas
- Biblioteca visual
- Bandeja
- Empresas
  - Expert Academy
  - Expert Design
  - Expert Code
- Configuración

El usuario tiene un único rol administrativo.

---

## 6. Identidad de los elementos

Cada elemento del catálogo debe tener:

- UUID interno;
- código visible legible;
- nombre;
- descripción;
- empresa;
- tipo;
- categoría;
- estado;
- etiquetas;
- contenido del lienzo;
- relaciones;
- archivos;
- preview;
- timestamps;
- historial de versiones.

Ejemplo de código visible:

`EXP-D7K4MX`

El código visible debe mostrarse en tarjetas, detalle y búsqueda.

---

## 7. El lienzo es el núcleo del producto

El lienzo no debe implementarse como un textarea grande ni como un formulario rígido.

Debe ser un editor basado en bloques.

Bloques iniciales:

- texto enriquecido;
- encabezados;
- listas;
- checklist;
- prompt;
- pasos/procedimiento;
- callout;
- tabla;
- imagen;
- galería;
- archivo;
- enlace;
- Google Drive;
- diagrama manual;
- relaciones;
- contenido relacionado.

Debe existir inserción mediante botón y, preferiblemente, mediante `/`.

---

## 8. Layout libre del lienzo

Esta característica es obligatoria.

El lienzo debe usar una cuadrícula de **12 columnas**.

Cada bloque puede ocupar:

- 4 columnas = 1/3;
- 6 columnas = 1/2;
- 8 columnas = 2/3;
- 12 columnas = ancho completo.

Esto permite composiciones como:

- una sola columna;
- dos bloques lado a lado;
- tres bloques lado a lado;
- 2/3 + 1/3;
- combinaciones mixtas.

### Interacción

Cada bloque debe poder:

- reordenarse mediante drag & drop;
- cambiar de ancho con controles rápidos;
- redimensionarse visualmente;
- conservar su ancho y posición al guardar.

### Presets

Mantener:

- Una columna
- Dos columnas
- Tres columnas
- Composición libre

En móvil, los bloques deben colapsar automáticamente a una columna para conservar legibilidad.

La UX de layout no debe sentirse como una herramienta CAD o dashboard técnico.

---

## 9. Propiedades y outline del lienzo

Mantener dos paneles secundarios:

### Izquierda

Outline/contenido:

- secciones;
- navegación dentro del documento;
- agregar sección.

### Derecha

Propiedades:

- empresa;
- estado;
- tipo;
- categoría;
- etiquetas;
- descripción;
- preview;
- información de versión.

Ambos paneles deben poder cerrarse para ampliar el área de trabajo.

---

## 10. Búsqueda

La búsqueda es uno de los pilares del producto.

Debe existir:

### Búsqueda global

Accesible desde cualquier pantalla.

Atajo sugerido:

`Ctrl/Cmd + K`

### Búsqueda semántica

Debe aceptar lenguaje natural.

Ejemplo:

> Quiero crear stickers para cuadernos usando IA y luego prepararlos para imprimir.

El sistema no debe limitarse a `ILIKE`.

Implementar búsqueda híbrida cuando sea conveniente:

- coincidencia textual;
- full-text search;
- embeddings;
- similitud semántica;
- filtros estructurados.

Los resultados deben:

- ordenarse por relevancia;
- mostrar porcentaje o nivel de relevancia;
- explicar por qué coinciden;
- mostrar código;
- empresa;
- tipo;
- etiquetas;
- preview;
- elementos complementarios cuando sea útil.

---

## 11. Catálogo

El catálogo debe soportar:

- grid;
- lista;
- búsqueda;
- filtros;
- filtros por empresa;
- filtros por tipo;
- filtros por estado;
- categorías;
- etiquetas;
- orden;
- selección múltiple;
- acciones rápidas.

Acciones rápidas importantes:

- abrir;
- editar;
- duplicar;
- copiar código;
- relacionar;
- exportar;
- archivar.

---

## 12. Relaciones

Los elementos pueden conectarse entre sí.

Tipos iniciales:

- utiliza;
- relacionado con;
- depende de;
- deriva de;
- complementa;
- generado a partir de.

Las relaciones deben servir para:

- navegación;
- sugerencias;
- composición;
- trazabilidad;
- búsqueda.

---

## 13. Composición

Debe ser posible seleccionar varios elementos del catálogo y crear un elemento nuevo usando contenido proveniente de ellos.

La nueva ficha debe conservar referencias de procedencia.

Nunca perder la trazabilidad entre el elemento compuesto y sus fuentes.

---

## 14. Plantillas

Debe existir:

- galería de plantillas;
- builder de plantillas;
- plantillas personales.

Plantillas iniciales sugeridas:

- planificación de clase;
- producto físico;
- sticker;
- franela;
- repositorio GitHub;
- investigación;
- proceso/workflow;
- recurso web;
- documento libre.

Una plantilla define estructura inicial, pero el usuario debe poder modificar el lienzo después.

---

## 15. Captura rápida

La Captura rápida existe para evitar perder ideas por tener que clasificarlas inmediatamente.

Debe aceptar:

- texto;
- enlace;
- archivo;
- imagen;
- prompt;
- nota breve.

Se guarda en Bandeja.

Gemini puede sugerir:

- empresa;
- tipo;
- categoría;
- etiquetas;
- descripción.

El usuario acepta o corrige después.

---

## 16. Biblioteca visual

La carpeta:

`assets/graphics/`

incluye la biblioteca visual inicial.

El archivo:

`assets/graphics-manifest.json`

incluye metadata.

La implementación productiva debe:

- cargar estos recursos como biblioteca inicial;
- permitir filtrarlos;
- buscarlos;
- seleccionarlos;
- utilizarlos como preview;
- utilizarlos como portada;
- insertarlos en galerías;
- permitir posteriormente subir imágenes propias.

No depender de recursos gráficos remotos para reproducir el diseño inicial.

Los SVG incluidos son parte del paquete y pueden convertirse a assets públicos del proyecto Next.js.

---

## 17. Archivos

Dos modalidades:

### Archivo subido

Guardar físicamente usando el sistema de storage elegido.

### Enlace externo

Ejemplos:

- Google Drive;
- URL;
- repositorio GitHub;
- documentos externos.

La ficha debe mostrar preview cuando sea posible.

---

## 18. Versionado

Mantener historial de versiones.

No crear una versión formal por cada autosave.

Recomendación:

- autosave frecuente;
- agrupar cambios;
- crear versiones significativas;
- permitir restaurar;
- restaurar creando una nueva versión y no destruyendo el historial.

---

## 19. Exportación

Mantener estas opciones:

- Markdown `.md`
- PDF `.pdf`
- imagen `.png`
- Word `.docx`
- Excel `.xlsx`

La UI debe elegir formato mediante modal.

La exportación debe adaptarse al contenido.

Ejemplo:

- `.xlsx` es más útil para tablas/metadatos;
- `.docx` y `.pdf` para contenido documental;
- `.png` para una captura visual;
- `.md` para portabilidad y uso con IA.

---

## 20. Configuración de Gemini

Mantener una pantalla amigable.

Campos visibles mínimos:

- proveedor;
- modelo principal;
- API key;
- prueba de conexión;
- toggles por funcionalidad.

Evitar exponer al usuario:

- temperature;
- top-k;
- top-p;
- detalles de embeddings;
- configuraciones de infraestructura;

salvo que en el futuro se agregue un apartado “Avanzado”.

---

## 21. Responsive

El diseño debe funcionar en:

- desktop;
- tablet;
- móvil.

En móvil:

- sidebar pasa a drawer;
- lienzo se convierte en una columna;
- acciones secundarias se compactan;
- modales ocupan mayor ancho;
- previews siguen siendo visibles.

No intentar conservar tres columnas del lienzo en pantallas pequeñas.

---

## 22. Accesibilidad y ergonomía

Implementar:

- contraste suficiente;
- focus visible;
- navegación por teclado;
- labels;
- botones con hit-area adecuada;
- estados de loading;
- estados vacíos;
- estados de error;
- feedback posterior a acciones.

---

## 23. Reglas de fidelidad para la IA implementadora

### Debe

- reproducir primero el mockup con alta fidelidad;
- convertir las interacciones simuladas en funcionalidad real;
- conservar la sensación visual general;
- conservar el sistema de bloques;
- conservar la búsqueda como función principal;
- conservar la facilidad de uso;
- reutilizar los assets incluidos;
- mantener el stack acordado;
- modularizar internamente.

### No debe

- convertir todo en formularios;
- sustituir el lienzo por campos fijos;
- eliminar modales porque “son decorativos”;
- eliminar previews;
- eliminar búsqueda semántica;
- eliminar relaciones;
- eliminar versionado;
- eliminar Captura rápida;
- eliminar la biblioteca visual;
- separar frontend y backend en dos repositorios sin necesidad;
- cambiar PostgreSQL;
- reemplazar Gemini sin instrucción explícita;
- simplificar funcionalidades solo para terminar más rápido.

---

## 24. Estructura técnica sugerida

Ejemplo orientativo:

```text
src/
  app/
    (auth)/
    (workspace)/
      page.tsx
      search/
      catalog/
      templates/
      visual-library/
      inbox/
      settings/
      item/[id]/
    api/
  modules/
    auth/
    catalog/
    canvas/
    search/
    ai/
    templates/
    assets/
    relations/
    versions/
    exports/
    files/
  components/
    ui/
    shell/
    canvas/
    catalog/
    search/
  lib/
    db/
    gemini/
    storage/
    validation/
prisma/
  schema.prisma
public/
  graphics/
```

El naming puede variar. La separación conceptual por módulos debe mantenerse.

---

## 25. Criterio final

Al abrir la aplicación productiva y compararla con `index.html`, debe resultar evidente que ambos representan **el mismo producto**.

El mockup es el contrato de experiencia.

El planning es el contrato de alcance.

La implementación debe unir ambos.
