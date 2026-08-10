# Expert Hub — Mockup navegable + contrato de implementación

Este paquete contiene la referencia visual y funcional completa para construir Expert Hub.

## Abrir el mockup

Abre `index.html` directamente en un navegador moderno.

No requiere:

- npm
- servidor
- dependencias externas
- conexión a internet

## Archivos principales

- `index.html` — pantallas y estructura.
- `styles.css` — sistema visual y responsive.
- `app.js` — interacciones simuladas.
- `AI_IMPLEMENTATION_SPEC.md` — instrucciones detalladas para la IA que implementará el producto.
- `ASSET_LIBRARY.md` — inventario de recursos gráficos.
- `assets/graphics-manifest.json` — metadata de los recursos visuales.
- `docs/planning_sistema_catalogo_inteligente.md` — planning funcional/técnico original.

## Biblioteca gráfica

El mockup incluye **40 recursos SVG locales**.

Están en:

`assets/graphics/`

No son imágenes remotas. Forman parte del paquete y deben utilizarse como biblioteca inicial del producto.

## Lienzo V2

El lienzo ahora soporta un concepto de grid de 12 columnas.

Cada bloque puede usar:

- `⅓`
- `½`
- `⅔`
- `1/1`

También se pueden:

- arrastrar;
- reordenar;
- redimensionar desde el borde derecho;
- aplicar presets de 1, 2 o 3 columnas;
- crear composiciones libres.

En móvil, el contenido vuelve automáticamente a una columna.

## Atajos

- `Ctrl/Cmd + K` — búsqueda global.
- `Ctrl/Cmd + N` — nuevo elemento.
- `Ctrl/Cmd + S` — guardar en el lienzo.
- `/` — insertar bloque.
- `Esc` — cerrar modal.

## Stack productivo acordado

- Next.js
- TypeScript
- React
- Prisma
- PostgreSQL
- Google Gemini

Arquitectura:

**monolito modular**

## Para entregárselo a otra IA

Entrégale el ZIP completo y usa una instrucción similar a:

> Implementa Expert Hub siguiendo `docs/planning_sistema_catalogo_inteligente.md` y `AI_IMPLEMENTATION_SPEC.md`. El archivo `index.html` es el contrato visual y funcional del frontend: reproduce sus pantallas, navegación, modales, interacciones y comportamiento con alta fidelidad. Convierte las simulaciones del mockup en funciones reales usando Next.js + TypeScript, Prisma + PostgreSQL y Google Gemini. Usa la biblioteca SVG incluida en `assets/graphics/`. No simplifiques el lienzo, la búsqueda semántica, las relaciones, el versionado, la captura rápida, las plantillas ni la biblioteca visual.

## Importante

Este mockup no es código productivo final.

Es una especificación ejecutable del producto que debe ser convertida al stack real.
