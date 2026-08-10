# Planning — Sistema de Catálogo Inteligente y Lienzo de Conocimiento

## 1. Resumen del proyecto

El sistema será una **aplicación web privada** para centralizar, documentar, reutilizar y encontrar procesos, ideas, recursos, productos, servicios, planificaciones, prompts, archivos y conocimiento operativo de tres negocios:

- **Expert Academy** — clases presenciales y online, planificaciones, recursos educativos, materiales y procesos académicos.
- **Expert Design** — productos físicos y creativos como franelas, stickers, calcomanías, diseños, referencias, prompts y procesos de producción.
- **Expert Code** — sistemas, proyectos, asesorías, repositorios, documentación técnica, recursos y procesos de desarrollo.

El propósito principal es evitar que un procedimiento, recurso o idea tenga que reconstruirse desde cero meses después de haber sido utilizado.

El sistema funcionará como una mezcla de:

- catálogo inteligente;
- base de conocimiento;
- editor/lienzo modular;
- repositorio multimedia;
- biblioteca de procesos;
- buscador semántico;
- gestor de plantillas;
- sistema de relaciones entre elementos.

El enfoque será **monolítico modular**, evitando una arquitectura innecesariamente compleja.

---

# 2. Objetivos principales

## 2.1 Objetivo general

Crear un espacio único donde cualquier conocimiento útil de los negocios pueda **registrarse rápidamente, enriquecerse, organizarse, relacionarse, encontrarse y reutilizarse**.

## 2.2 Objetivos específicos

1. Registrar conocimiento sin depender de una estructura rígida.
2. Tener un lienzo suficientemente flexible para múltiples tipos de contenido.
3. Encontrar información por intención, no solamente por coincidencia literal de palabras.
4. Permitir que Gemini ayude a describir, resumir, clasificar y recuperar información.
5. Relacionar elementos del catálogo entre sí.
6. Mantener historial de versiones.
7. Evitar interfaces saturadas o excesivamente técnicas.
8. Permitir trabajar con archivos locales y enlaces externos.
9. Crear plantillas reutilizables mediante un builder.
10. Exportar el contenido a múltiples formatos.
11. Poder identificar visualmente cada elemento mediante un código propio.
12. Reducir al mínimo la cantidad de clics necesarios para realizar acciones frecuentes.

---

# 3. Principios de producto

El sistema debe diseñarse alrededor de los siguientes principios.

## 3.1 Fácil antes que técnico

Aunque internamente el sistema tenga capacidades avanzadas, la interfaz no deberá sentirse técnica.

El usuario no debe tener que conocer conceptos como embeddings, vectores, schemas o relaciones de base de datos para utilizarlo.

## 3.2 El lienzo es el núcleo

La parte más importante del sistema será el **Lienzo**.

Toda ficha del catálogo deberá poder convertirse en un espacio práctico de trabajo en lugar de un formulario largo.

## 3.3 La búsqueda es el segundo pilar

El buscador deberá estar disponible desde lugares estratégicos de la aplicación y será una de las acciones más rápidas de acceder.

## 3.4 Completo sin ser abrumador

Las funciones avanzadas deberán aparecer progresivamente mediante:

- modales;
- popovers;
- paneles laterales;
- menús contextuales;
- wizards;
- acordeones;
- acciones rápidas;
- comandos;
- drag & drop.

No se mostrarán todas las opciones al mismo tiempo.

## 3.5 Capturar primero, organizar después

Debe existir una forma extremadamente rápida de guardar algo aunque todavía no esté completamente clasificado.

## 3.6 Reutilización

Todo contenido almacenado debe poder convertirse posteriormente en materia prima para otro elemento.

---

# 4. Stack tecnológico acordado

## 4.1 Arquitectura

**Monolito modular**.

Una sola aplicación desplegable, pero internamente dividida por dominios funcionales.

## 4.2 Aplicación

- **Next.js**
- **TypeScript**
- React incluido dentro de Next.js

## 4.3 Backend

El backend vivirá dentro de la misma aplicación Next.js mediante módulos de servidor, servicios internos y endpoints cuando sean necesarios.

No se separará inicialmente un backend independiente.

## 4.4 Base de datos

- **PostgreSQL**
- **Prisma ORM**

## 4.5 Búsqueda semántica

PostgreSQL almacenará también los vectores necesarios para búsqueda semántica mediante una extensión compatible con vectores, manteniendo la búsqueda dentro del mismo ecosistema de datos.

## 4.6 Inteligencia artificial

- **Google Gemini**

La integración con Gemini deberá estar desacoplada del resto de la aplicación mediante un servicio interno de IA.

Esto permitirá modificar posteriormente modelo, parámetros o proveedor sin rehacer el sistema completo.

---

# 5. Estructura general de navegación

La navegación principal será corta.

## Menú principal

1. **Inicio**
2. **Buscar**
3. **Catálogo**
4. **Nuevo**
5. **Plantillas**
6. **Bandeja**
7. **Configuración**

El botón **Nuevo** debe ser especialmente visible.

El buscador global debe poder abrirse desde cualquier pantalla.

---

# 6. Dashboard / Inicio

La página inicial debe servir como punto de entrada rápido y no como un dashboard saturado.

## Elementos recomendados

### Barra de búsqueda principal

Texto sugerido:

> ¿Qué quieres hacer hoy?

Ejemplos:

- Quiero hacer stickers para cuadernos.
- ¿Cómo preparaba las franelas estampadas?
- Muéstrame recursos que utilicé para una clase de programación.
- Busca prompts relacionados con ilustraciones infantiles.

### Acciones rápidas

- Nuevo elemento
- Captura rápida
- Abrir plantilla
- Ver recientes

### Elementos recientes

Mostrar los últimos elementos utilizados o modificados.

### Continuar trabajando

Elementos en estado:

- borrador;
- en proceso;
- pendiente.

### Sugerencias

Opcionalmente, relaciones o elementos útiles sugeridos por el sistema.

---

# 7. Catálogo

El catálogo será la vista estructurada de todos los elementos almacenados.

## 7.1 Formas de visualización

Debe ofrecer al menos:

- tarjetas;
- lista compacta.

Posteriormente podría incorporarse tabla si realmente aporta valor.

## 7.2 Información visible por tarjeta

- código del elemento;
- título;
- empresa;
- categoría;
- tipo;
- estado;
- etiquetas principales;
- miniatura o preview;
- descripción breve generada o escrita manualmente;
- fecha de última modificación.

## 7.3 Acciones rápidas

Cada elemento tendrá un menú con:

- abrir;
- vista previa;
- duplicar;
- copiar código;
- copiar enlace interno;
- relacionar;
- exportar;
- archivar;
- eliminar.

## 7.4 Filtros

Filtros combinables por:

- empresa;
- categoría;
- tipo;
- estado;
- etiqueta;
- fecha;
- favoritos;
- contiene archivos;
- contiene prompts;
- contiene enlaces;
- archivado/no archivado.

Debe existir un botón claro para **Limpiar filtros**.

---

# 8. Código / ID visible de cada elemento

Cada elemento tendrá dos identificadores.

## 8.1 ID interno

UUID generado por el sistema para uso técnico.

Ejemplo:

`550e8400-e29b-41d4-a716-446655440000`

Este identificador no necesita mostrarse habitualmente.

## 8.2 Código visible

Código corto, único y fácil de reconocer.

Ejemplos:

- `EXP-7K3M9Q`
- `EXP-A82L4P`
- `EXP-N6R2VX`

El código visible deberá:

- generarse automáticamente;
- ser único;
- mostrarse claramente en la ficha;
- poder copiarse con un clic;
- poder utilizarse en el buscador;
- servir para identificar elementos cuando se combinan o relacionan.

El nombre del elemento podrá cambiar; el código permanecerá estable.

---

# 9. Empresas

Cada elemento podrá asociarse a una o varias empresas.

Empresas iniciales:

- Expert Academy
- Expert Design
- Expert Code

También podrá existir:

- General / Compartido

para contenido reutilizable en varias áreas.

---

# 10. Categorías, etiquetas y tipos

No deben confundirse.

## Empresa

Indica dónde se utiliza el elemento.

## Tipo

Indica qué clase de elemento es.

Ejemplos:

- planificación;
- producto;
- proceso;
- recurso web;
- repositorio;
- prompt;
- documento;
- investigación;
- servicio;
- idea;
- referencia;
- colección;
- flujo de trabajo.

## Categoría

Agrupación organizativa definida por el usuario.

Ejemplos:

- Diseño gráfico
- Impresión
- Inteligencia artificial
- Educación
- Desarrollo web
- Marketing

## Etiquetas

Palabras flexibles y múltiples.

Ejemplos:

`stickers`, `cuadernos`, `anime`, `impresión`, `Gemini`, `GitHub`.

---

# 11. Estados

Los estados ayudarán a organizar y filtrar.

Estados iniciales sugeridos:

- Idea
- Borrador
- En proceso
- Probado
- Listo
- Activo
- Pausado
- Archivado

Los estados podrán personalizarse en Configuración.

---

# 12. Lienzo — núcleo del sistema

El lienzo deberá sentirse más parecido a un editor de trabajo moderno que a un formulario administrativo.

## 12.1 Encabezado del lienzo

Debe permanecer sencillo.

Campos principales:

- título;
- código visible;
- empresa;
- tipo;
- categoría;
- estado;
- etiquetas.

Los campos secundarios podrán aparecer en un panel de propiedades.

## 12.2 Guardado

- guardado automático;
- indicador visual de estado;
- guardado manual opcional;
- recuperación ante cierre accidental cuando sea posible.

Estados visuales:

- Guardando…
- Guardado
- Error al guardar

## 12.3 Editor por bloques

El contenido se construirá mediante bloques independientes.

### Bloques de contenido

- texto enriquecido;
- título;
- subtítulo;
- párrafo;
- lista con viñetas;
- lista numerada;
- checklist;
- cita;
- separador;
- llamada / callout;
- tabla;
- código;
- bloque de prompt;
- imagen;
- galería;
- video;
- audio;
- archivo;
- enlace;
- tarjeta web;
- bloque de pasos;
- bloque de materiales;
- bloque de resultado;
- bloque de notas;
- bloque relacionado;
- diagrama manual.

## 12.4 Comportamiento de bloques

Cada bloque podrá:

- moverse mediante drag & drop;
- duplicarse;
- eliminarse;
- colapsarse cuando aplique;
- convertirse a otro tipo cuando sea compatible;
- copiarse;
- pegarse;
- insertarse entre otros bloques.

## 12.5 Barra `/`

Dentro del lienzo, escribir `/` abrirá un selector rápido de bloques.

Ejemplo:

`/imagen`

`/prompt`

`/checklist`

`/diagrama`

## 12.6 Botón agregar

También debe existir un botón `+` visual para usuarios que prefieran no utilizar comandos.

## 12.7 Panel contextual

Cuando se seleccione un bloque, aparecerán solamente las opciones relacionadas con ese bloque.

Esto evita saturar la interfaz.

---

# 13. Texto enriquecido

El editor deberá permitir crear documentos similares a una planificación hecha en Word.

Funciones:

- negrita;
- cursiva;
- subrayado;
- tachado;
- encabezados;
- alineación cuando sea útil;
- listas;
- checklist;
- enlaces;
- citas;
- bloques destacados;
- tablas;
- código inline;
- bloques de código.

Debe conservar una apariencia limpia y consistente.

---

# 14. Bloque especializado de Prompt

Los prompts no deben almacenarse simplemente como texto plano.

El bloque de prompt podrá incluir:

- nombre;
- prompt principal;
- variables opcionales;
- herramienta o modelo utilizado;
- instrucciones adicionales;
- ejemplo de resultado;
- botón copiar;
- notas.

Ejemplo:

**Prompt:** Generación de stickers infantiles

**Modelo utilizado:** Gemini

**Variables:** personaje, estilo, cantidad, fondo

**Resultado de muestra:** imagen adjunta

---

# 15. Bloque de pasos / procedimiento

Especialmente útil para procesos repetibles.

Ejemplo:

1. Generar concepto en Gemini.
2. Crear megaprompt.
3. Generar imágenes.
4. Seleccionar diseños.
5. Ajustar tamaño.
6. Preparar archivo para impresión.
7. Imprimir.

Cada paso podrá tener:

- checklist;
- descripción;
- enlace;
- archivo;
- nota.

---

# 16. Diagramas

Los diagramas serán creados manualmente por el usuario dentro del lienzo.

No se plantea inicialmente que la IA genere automáticamente el diagrama.

## Herramientas básicas

- nodo;
- texto;
- flecha;
- conexión;
- decisión;
- proceso;
- agrupación;
- mover;
- zoom;
- eliminar;
- duplicar.

Debe permitir crear diagramas de flujo sencillos directamente dentro del elemento.

---

# 17. Multimedia y archivos

Cada lienzo podrá contener:

- imágenes;
- videos;
- audios;
- PDFs;
- documentos;
- hojas de cálculo;
- archivos comprimidos;
- otros archivos permitidos.

## 17.1 Dos formas de almacenar recursos

### Opción A — Carga directa

El archivo se carga y queda almacenado dentro de la infraestructura de la aplicación.

El sistema utilizará una capa de almacenamiento desacoplada para poder utilizar inicialmente almacenamiento local/montado y migrar posteriormente a almacenamiento de objetos si hiciera falta.

### Opción B — Enlace externo

El usuario podrá pegar una URL.

Ejemplos:

- Google Drive;
- YouTube;
- GitHub;
- sitio web;
- recurso externo.

## 17.2 Preview

Siempre que sea posible se mostrará una vista previa en lugar de un enlace plano.

---

# 18. Vista previa de elementos

Debe existir una forma de consultar un elemento sin entrar completamente al editor.

## Modal o panel lateral de preview

Puede mostrar:

- título;
- código;
- descripción;
- miniatura;
- empresa;
- tipo;
- categoría;
- etiquetas;
- bloques principales;
- archivos;
- relaciones;
- fecha de modificación.

Acciones:

- Abrir
- Copiar código
- Relacionar
- Exportar

---

# 19. Plantillas

Las plantillas servirán para acelerar contenido repetitivo.

No deben limitar al usuario a tipos fijos.

## Plantillas iniciales sugeridas

### Planificación de clase

- objetivo;
- duración;
- contenido;
- materiales;
- actividades;
- pasos;
- recursos;
- evaluación;
- notas.

### Producto físico

- descripción;
- concepto;
- materiales;
- prompts;
- referencias;
- proceso;
- imágenes;
- archivos finales;
- proveedores/enlaces;
- resultado.

### Sticker

- nombre;
- temática;
- personaje/inspiración;
- prompts;
- imágenes generadas;
- tamaño;
- materiales;
- proceso de preparación;
- archivo final;
- notas de impresión.

### Franela

- diseño;
- imágenes de referencia;
- prompts;
- mockups;
- archivos;
- tallas/variantes;
- proceso;
- enlaces;
- observaciones.

### Recurso web

- URL;
- descripción;
- para qué sirve;
- empresa;
- casos de uso;
- notas;
- etiquetas.

### Repositorio GitHub

- URL;
- proyecto;
- descripción;
- tecnología;
- propósito;
- instalación;
- uso;
- fragmentos importantes;
- notas.

### Investigación

- pregunta;
- resumen;
- fuentes;
- hallazgos;
- conclusiones;
- recursos;
- próximos pasos.

### Proceso / workflow

- objetivo;
- precondiciones;
- materiales;
- pasos;
- herramientas;
- prompts;
- resultados;
- problemas conocidos;
- mejoras.

### Documento libre

Lienzo prácticamente vacío con bloque de texto enriquecido.

---

# 20. Builder de plantillas

El usuario podrá crear sus propias plantillas.

## Flujo

1. Crear plantilla.
2. Indicar nombre.
3. Opcionalmente elegir empresa o tipo recomendado.
4. Agregar bloques.
5. Reordenarlos.
6. Marcar bloques requeridos/opcionales si se desea.
7. Guardar.

Cuando se cree un elemento desde una plantilla, se copiará su estructura pero no quedará ligado permanentemente a ella.

---

# 21. Captura rápida

Debe existir una forma de guardar algo en segundos.

## Modal de captura

Campos mínimos:

- título opcional;
- texto, URL o archivo;
- empresa opcional;
- guardar.

Después de guardar:

- pasa a la Bandeja;
- la IA puede generar una descripción;
- puede sugerir categoría, etiquetas y tipo;
- el usuario organiza cuando tenga tiempo.

Esto evita perder una idea por tener que completar formularios.

---

# 22. Bandeja “Por organizar”

Contendrá elementos capturados rápidamente o incompletos.

Cada tarjeta podrá mostrar sugerencias de IA:

- título;
- descripción;
- tipo;
- empresa probable;
- categoría;
- etiquetas.

El usuario podrá aceptar o modificar las sugerencias.

---

# 23. Integración con Gemini

Gemini tendrá funciones concretas y controladas.

## 23.1 Generar descripción

Antes o después de guardar un elemento, Gemini podrá analizar su contenido textual y producir una descripción breve.

La descripción servirá posteriormente para búsqueda y comprensión rápida.

## 23.2 Resumir

Generar un resumen práctico del contenido completo.

## 23.3 Sugerir organización

Puede sugerir:

- categoría;
- etiquetas;
- empresa;
- tipo;
- título;
- palabras clave.

## 23.4 Preparación para búsqueda semántica

El contenido procesado generará representación vectorial para poder recuperarlo por intención.

## 23.5 Elementos relacionados

Gemini y/o la similitud semántica podrán sugerir elementos relacionados.

## 23.6 Configuración de IA

Dentro de Configuración:

- API key;
- modelo de generación;
- modelo de embeddings;
- temperatura u opciones equivalentes cuando aplique;
- activación/desactivación de funciones;
- prompt de sistema interno opcional;
- límites de uso opcionales.

Las credenciales nunca deberán enviarse al navegador de forma insegura.

---

# 24. Buscador inteligente

El buscador será una de las funciones más importantes del sistema.

No debe limitarse a buscar títulos.

## 24.1 Tipos de búsqueda

### Búsqueda exacta

- código;
- título;
- palabra;
- etiqueta.

### Búsqueda textual

Busca coincidencias dentro de:

- título;
- descripción;
- contenido;
- etiquetas;
- nombres de archivos;
- URLs;
- metadatos.

### Búsqueda semántica

Busca por significado e intención.

Ejemplo:

> Quiero hacer stickers para cuadernos.

Puede devolver un elemento llamado:

> Proceso de creación de calcomanías escolares estilo anime

aunque las palabras no coincidan literalmente.

## 24.2 Búsqueda híbrida

La mejor estrategia será combinar:

- coincidencia exacta;
- búsqueda de texto;
- similitud semántica;
- filtros;
- peso por relevancia.

## 24.3 Ranking

El sistema podrá ponderar:

- similitud semántica;
- coincidencia del título;
- coincidencia de etiquetas;
- coincidencia de categoría;
- empresa seleccionada;
- frecuencia de uso;
- actualización reciente;
- favoritos.

La similitud semántica debe ser el factor dominante cuando la consulta sea una intención natural.

---

# 25. Experiencia del buscador

## Campo global

Visible o accesible permanentemente.

Atajo sugerido:

`Ctrl/Cmd + K`

## Al escribir

Mostrar:

- elementos sugeridos;
- búsquedas recientes;
- códigos coincidentes;
- categorías;
- comandos rápidos.

## Página de resultados

Cada resultado mostrará:

- miniatura;
- título;
- código;
- empresa;
- descripción;
- razón breve de coincidencia;
- tipo;
- etiquetas;
- relevancia visual.

Ejemplo de explicación:

> Coincide porque contiene un proceso de generación de stickers con IA, preparación para impresión y archivos de muestra.

---

# 26. Relaciones entre elementos

Un elemento podrá relacionarse manualmente con otros.

Tipos iniciales de relación:

- relacionado con;
- utiliza;
- depende de;
- deriva de;
- reemplaza;
- complementa;
- generado a partir de;
- pertenece a.

Ejemplo:

`EXP-A82L4P — Sticker escolar`

utiliza:

`EXP-38M6QZ — Prompt estilo anime`

`EXP-K9N2TX — Flujo preparación para impresión`

---

# 27. Composición / mezcla de elementos

Debe existir una acción para crear un nuevo elemento utilizando otros como base.

## Flujo

1. Seleccionar varios elementos.
2. Elegir **Crear a partir de selección**.
3. Crear un nuevo lienzo.
4. Incorporar bloques elegidos.
5. Mantener referencias a los elementos originales.

La procedencia debe conservarse.

Esto permitirá mezclar conocimientos sin perder trazabilidad.

---

# 28. Vista de relaciones

Además de mostrar relaciones en cada ficha, puede existir una vista visual opcional tipo mapa.

Debe mantenerse secundaria para no complicar el flujo principal.

Podrá mostrar:

- elemento central;
- relacionados;
- dependencia;
- origen;
- derivados.

---

# 29. Historial de versiones

Cada elemento deberá mantener versiones.

## Eventos que pueden generar versión

- guardado importante;
- cambio manual solicitado por el usuario;
- restauración;
- cambios estructurales relevantes.

Para evitar crear miles de versiones por autosave, el sistema debe agrupar cambios automáticos de forma inteligente.

## Vista del historial

Mostrar:

- fecha;
- hora;
- resumen del cambio;
- versión;
- acción restaurar.

## Restauración

Restaurar una versión no debe destruir la versión actual; debe crear una nueva revisión.

---

# 30. Favoritos, recientes y uso frecuente

Un elemento podrá marcarse como favorito.

También se registrará:

- última apertura;
- cantidad de aperturas;
- última modificación.

Esto permitirá accesos rápidos y mejor ranking contextual sin alterar el contenido.

---

# 31. Exportación

La exportación estará disponible desde cada elemento y, cuando tenga sentido, desde colecciones.

Formatos requeridos:

- `.md` — Markdown
- `.pdf`
- imagen (`.png` o equivalente)
- `.xlsx` — Excel
- `.docx` — Word

## 31.1 Markdown

Ideal para preservar estructura textual y referencias.

## 31.2 PDF

Representación visual para compartir o archivar.

## 31.3 Imagen

Captura renderizada del contenido seleccionado o del elemento.

## 31.4 Word

Transformar bloques compatibles a contenido Word.

## 31.5 Excel

Para elementos con tablas o datos estructurados.

Cuando el lienzo contenga elementos imposibles de representar completamente en Excel, el exportador deberá crear una estructura comprensible en lugar de intentar replicar visualmente todo el lienzo.

---

# 32. Importación

Aunque no es el foco principal, conviene dejar preparada la arquitectura para incorporar importadores posteriormente.

Posibles formatos:

- Markdown;
- texto;
- documentos;
- URLs.

No es necesario convertir esto en un módulo grande durante la primera implementación.

---

# 33. Configuración

## General

- nombre del sistema;
- preferencia visual;
- formatos;
- comportamiento del editor.

## Empresas

- crear;
- editar;
- activar/desactivar.

## Categorías

- crear;
- renombrar;
- fusionar;
- archivar.

## Estados

- personalizar.

## IA

- configuración de Gemini;
- funciones automáticas;
- modelo;
- credenciales.

## Archivos

- límites;
- tipos permitidos;
- almacenamiento.

## Exportación

- valores predeterminados.

---

# 34. Autenticación

El sistema tendrá login.

Actualmente existe **un solo rol**.

## Funciones

- iniciar sesión;
- cerrar sesión;
- mantener sesión segura;
- cambiar contraseña;
- recuperación de acceso si se habilita correo.

Aunque exista un solo rol, las tablas deben diseñarse de manera que posteriormente sea posible soportar varios usuarios sin rehacer todo el sistema.

---

# 35. Seguridad

## Requisitos mínimos

- contraseñas hasheadas;
- cookies de sesión seguras;
- protección de rutas;
- validación server-side;
- validación de archivos;
- control de tamaño de uploads;
- nombres de archivos sanitizados;
- secretos únicamente en servidor;
- API key de Gemini nunca visible en frontend;
- protección CSRF cuando aplique;
- protección básica contra abuso de endpoints;
- backups de PostgreSQL;
- estrategia de respaldo de archivos.

---

# 36. Modelo de datos conceptual

La implementación final puede ajustar nombres, pero conceptualmente existirán las siguientes entidades.

## User

- id
- email
- passwordHash
- name
- createdAt
- updatedAt

## Business

- id
- name
- slug
- active

## CatalogItem

- id UUID
- publicCode
- title
- slug opcional
- description
- summary
- typeId
- categoryId
- statusId
- createdBy
- createdAt
- updatedAt
- archivedAt
- favorite

## ItemBusiness

Relación muchos-a-muchos entre elemento y empresa.

## Block

- id
- itemId
- type
- position
- content JSON
- createdAt
- updatedAt

## Category

- id
- name
- description

## Tag

- id
- name

## ItemTag

Relación elemento-etiqueta.

## ItemType

- id
- name
- icon

## Status

- id
- name
- order

## Asset

- id
- itemId
- blockId opcional
- storageType
- fileName
- mimeType
- size
- path/url
- thumbnail
- metadata

## ExternalLink

- id
- itemId
- blockId opcional
- url
- title
- previewMetadata

## Template

- id
- name
- description
- businessId opcional
- typeId opcional
- structure JSON

## ItemRelation

- id
- sourceItemId
- targetItemId
- relationType

## ItemVersion

- id
- itemId
- version
- snapshot
- createdAt

## Embedding

- id
- itemId
- sourceType
- sourceId opcional
- textChunk
- vector
- metadata

## SearchHistory

- id
- userId
- query
- createdAt

## Activity

- id
- userId
- itemId
- action
- createdAt

---

# 37. Estructura modular del código

Ejemplo conceptual:

```text
src/
  app/
  modules/
    auth/
    catalog/
    canvas/
    blocks/
    search/
    ai/
    templates/
    assets/
    relations/
    versions/
    export/
    settings/
  components/
    ui/
    shared/
  lib/
    db/
    storage/
    ai/
    validation/
  prisma/
```

Cada módulo debe contener su lógica y evitar que toda la aplicación termine mezclada dentro de componentes globales.

---

# 38. Capa de almacenamiento

El código no debe depender directamente de una carpeta específica.

Crear una interfaz interna similar a:

```text
StorageProvider
  upload()
  delete()
  getUrl()
  getMetadata()
```

Implementación inicial:

```text
LocalStorageProvider
```

En el futuro podría añadirse:

```text
S3StorageProvider
```

sin modificar los módulos del lienzo.

---

# 39. Arquitectura de búsqueda semántica

## Al crear o actualizar un elemento

1. Guardar el contenido.
2. Extraer texto indexable.
3. Crear descripción/resumen cuando corresponda.
4. Dividir contenido largo en fragmentos.
5. Generar embeddings.
6. Guardar vectores en PostgreSQL.
7. Actualizar índice textual.

## Al buscar

1. Recibir consulta.
2. Detectar si parece código exacto.
3. Ejecutar búsqueda por coincidencia.
4. Generar embedding de consulta.
5. Ejecutar similitud vectorial.
6. Aplicar filtros.
7. Fusionar resultados.
8. Calcular score.
9. Devolver resultados ordenados.

Opcionalmente Gemini podrá generar una explicación breve de por qué un resultado es relevante.

---

# 40. Estrategia de indexación

No es conveniente enviar todo el lienzo como una única cadena enorme.

Los embeddings deberán generarse por fragmentos lógicos, por ejemplo:

- título + descripción;
- resumen;
- bloque de texto;
- bloque de prompt;
- pasos;
- notas;
- metadatos de archivos;
- títulos de enlaces.

Así una búsqueda puede recuperar exactamente la parte útil del elemento.

---

# 41. UX del proceso “Nuevo”

No abrir un formulario gigante.

## Paso 1

Al presionar **Nuevo**, abrir un modal simple:

### ¿Cómo quieres comenzar?

- Lienzo en blanco
- Desde plantilla
- Captura rápida
- Duplicar existente

## Paso 2

Si elige plantilla, mostrar tarjetas visuales.

## Paso 3

Abrir inmediatamente el lienzo.

Los metadatos secundarios podrán completarse después.

Objetivo: llegar al espacio de trabajo en muy pocos clics.

---

# 42. UX del lienzo

## Layout recomendado

### Superior

- volver;
- título;
- código;
- estado de guardado;
- búsqueda;
- acciones.

### Izquierda

Panel opcional/colapsable con:

- navegación del documento;
- bloques;
- índice.

### Centro

Lienzo.

### Derecha

Panel de propiedades contextual y colapsable.

No debe haber tres paneles abiertos obligatoriamente.

El lienzo central siempre debe conservar la mayor parte del espacio.

---

# 43. UX visual

## Diseño

- moderno;
- limpio;
- contraste alto;
- jerarquía visual clara;
- suficiente espacio en blanco;
- tipografía legible;
- componentes consistentes.

## Colores

Usar colores para significado, no como decoración excesiva.

Ejemplos:

- empresa;
- estado;
- alertas;
- acciones primarias.

## Feedback

Toda acción importante debe dar respuesta visual.

Ejemplos:

- guardado;
- copiado;
- carga completada;
- error;
- relación creada;
- exportación creada.

---

# 44. Modales, wizards y paneles

Usarlos para evitar navegar innecesariamente a nuevas páginas.

Casos apropiados:

- crear elemento;
- relacionar;
- exportar;
- cambiar propiedades;
- gestionar etiquetas;
- insertar archivo;
- configuración rápida;
- crear plantilla.

No utilizar un modal para tareas largas que necesiten espacio permanente.

---

# 45. Atajos y productividad

Atajos sugeridos:

- `Ctrl/Cmd + K` → buscar
- `Ctrl/Cmd + N` → nuevo elemento
- `Ctrl/Cmd + S` → guardar manualmente
- `/` → insertar bloque
- `Esc` → cerrar modal/panel

Las funciones también deberán ser accesibles con botones; los atajos no serán obligatorios.

---

# 46. Sistema de notificaciones

Utilizar notificaciones discretas tipo toast para:

- guardado correcto;
- archivo cargado;
- enlace copiado;
- relación creada;
- exportación lista;
- error recuperable.

Alertas más grandes solamente cuando requieran decisión.

---

# 47. Estados vacíos

Evitar pantallas vacías sin orientación.

Ejemplo de Catálogo vacío:

> Aún no has guardado nada.
> Crea tu primer elemento o registra algo rápidamente.

Botones:

- Crear elemento
- Captura rápida

---

# 48. Manejo de errores

Los errores deberán escribirse en lenguaje comprensible.

Evitar:

> Prisma error P2002.

Mostrar:

> Ya existe un elemento con ese código. Se generará uno nuevo automáticamente.

Los detalles técnicos quedarán en logs.

---

# 49. Rendimiento

El sistema debe sentirse rápido incluso cuando el catálogo crezca.

## Consideraciones

- paginación o carga incremental;
- thumbnails en lugar de imágenes originales en listados;
- lazy loading;
- compresión de imágenes cuando corresponda;
- consultas indexadas;
- cache de previews cuando resulte útil;
- generación de embeddings en procesos desacoplados de la interacción principal cuando sea posible;
- debounce del autosave;
- debounce del buscador;
- virtualización de listas largas si llegara a ser necesaria.

---

# 50. Responsive

La prioridad será escritorio, ya que el lienzo requiere espacio.

Sin embargo, la aplicación deberá poder utilizarse correctamente desde tablet y móvil para:

- buscar;
- consultar;
- realizar captura rápida;
- abrir fichas;
- editar contenido básico.

Las funciones complejas de diagramación podrán priorizar escritorio.

---

# 51. Backups

## Base de datos

Backups periódicos de PostgreSQL.

## Archivos

Respaldar también el almacenamiento local/montado.

Un backup de base de datos sin los archivos no es suficiente.

## Restauración

Debe existir documentación clara para restaurar ambos componentes.

---

# 52. Logs

Registrar eventos técnicos importantes:

- errores de servidor;
- errores de IA;
- errores de exportación;
- errores de carga;
- fallos de indexación.

No almacenar secretos ni contenido sensible innecesario en logs.

---

# 53. Funciones explícitamente fuera del alcance inicial

Para evitar que el proyecto crezca sin control, no se consideran prioritarios inicialmente:

- múltiples roles complejos;
- colaboración simultánea tipo Google Docs;
- chat interno entre usuarios;
- CRM;
- facturación;
- inventario;
- automatizaciones empresariales complejas;
- generación automática de diagramas por IA;
- aplicación móvil nativa;
- microservicios.

Esto no elimina la posibilidad de agregarlos posteriormente.

---

# 54. Fases de desarrollo

Aunque el objetivo es construir el sistema completo, el desarrollo debe ejecutarse por fases para mantener estabilidad.

## Fase 0 — Fundación

- proyecto Next.js + TypeScript;
- PostgreSQL;
- Prisma;
- autenticación;
- estructura modular;
- layout;
- sistema visual base;
- navegación;
- configuración inicial.

### Resultado

Aplicación funcional con login y arquitectura preparada.

---

## Fase 1 — Catálogo base

- CatalogItem;
- empresas;
- tipos;
- categorías;
- etiquetas;
- estados;
- códigos públicos;
- tarjetas;
- filtros;
- preview;
- favoritos;
- archivado.

### Resultado

Ya se pueden registrar y organizar elementos.

---

## Fase 2 — Lienzo

- editor por bloques;
- texto enriquecido;
- imágenes;
- archivos;
- URLs;
- prompts;
- listas;
- checklist;
- tablas;
- pasos;
- drag & drop;
- autosave;
- panel contextual.

### Resultado

El sistema ya funciona como repositorio práctico de conocimiento.

---

## Fase 3 — Multimedia y diagramas

- almacenamiento local/montado;
- previews;
- galería;
- video;
- audio;
- documentos;
- enlaces externos;
- diagrama manual.

---

## Fase 4 — Plantillas

- plantillas iniciales;
- selector de plantilla;
- builder de plantillas;
- duplicar;
- documento libre.

---

## Fase 5 — IA

- configuración Gemini;
- generar descripción;
- resumir;
- sugerir categorías;
- sugerir etiquetas;
- sugerir tipo;
- análisis para bandeja.

---

## Fase 6 — Búsqueda inteligente

- búsqueda exacta;
- full-text;
- embeddings;
- búsqueda vectorial;
- ranking híbrido;
- filtros de búsqueda;
- explicación de coincidencia;
- historial de consultas.

Esta fase debe recibir especial atención en pruebas de calidad.

---

## Fase 7 — Relaciones y composición

- relaciones;
- sugerencias;
- elementos relacionados;
- mapa opcional;
- crear a partir de selección;
- trazabilidad.

---

## Fase 8 — Historial

- snapshots;
- historial visual;
- restaurar;
- agrupación de autosaves.

---

## Fase 9 — Captura rápida

- modal rápido;
- bandeja;
- procesamiento IA;
- organización posterior.

---

## Fase 10 — Exportación

- Markdown;
- PDF;
- PNG/imagen;
- Word;
- Excel.

---

## Fase 11 — Pulido

- responsive;
- rendimiento;
- accesibilidad;
- animaciones discretas;
- errores;
- estados vacíos;
- backups;
- seguridad;
- pruebas finales.

---

# 55. Prioridad funcional

## Prioridad crítica

1. Lienzo
2. Búsqueda semántica
3. Catálogo
4. Guardado confiable
5. Organización

## Prioridad alta

6. Plantillas
7. Gemini
8. Archivos y previews
9. Relaciones
10. Historial

## Prioridad media

11. Composición
12. Captura rápida
13. Exportación
14. Mapa de relaciones

---

# 56. Criterios de aceptación del lienzo

El lienzo se considera satisfactorio cuando:

- crear contenido no requiere comprender una estructura técnica;
- agregar un bloque toma uno o dos pasos;
- se puede reordenar contenido visualmente;
- texto largo se siente tan cómodo como trabajar en un editor de documentos;
- imágenes y archivos pueden agregarse sin abandonar el lienzo;
- prompts tienen representación propia;
- un proceso puede documentarse claramente;
- el guardado automático es confiable;
- existe preview;
- el lienzo no se ve saturado;
- las acciones secundarias aparecen solamente cuando se necesitan.

---

# 57. Criterios de aceptación del buscador

El buscador se considera satisfactorio cuando:

- buscar un código devuelve inmediatamente el elemento;
- buscar por nombre funciona;
- buscar por etiquetas funciona;
- puede filtrar por empresa;
- puede filtrar por tipo/categoría/estado;
- una consulta natural devuelve elementos conceptualmente relacionados;
- la búsqueda sigue funcionando aunque el usuario no recuerde el nombre exacto;
- los primeros resultados son normalmente los más útiles;
- la respuesta aparece rápidamente;
- cada resultado explica suficiente contexto para decidir si abrirlo.

---

# 58. Ejemplo completo de uso

## Escenario

Se crea un producto de stickers para cuadernos.

### Crear

`Nuevo → Producto físico → Sticker`

### Datos

Título:

> Stickers escolares inspirados en personaje X

Código automático:

> EXP-7K3M9Q

Empresa:

> Expert Design

### Lienzo

Bloque 1 — descripción

Bloque 2 — prompt de Gemini

Bloque 3 — imágenes generadas

Bloque 4 — enlaces de herramientas

Bloque 5 — checklist de preparación

Bloque 6 — flujo de impresión

Bloque 7 — archivo final

Bloque 8 — fotografía del resultado

### IA

Genera descripción:

> Proceso reutilizable para crear stickers escolares mediante generación de imágenes con IA, preparación de archivos e impresión.

Sugiere:

- stickers;
- cuadernos;
- impresión;
- IA;
- diseño.

### Meses después

Consulta:

> Quiero hacer stickers para cuadernos.

El buscador devuelve `EXP-7K3M9Q` aunque el usuario no recuerde el nombre exacto.

El usuario abre el preview, reconoce el resultado anterior y reutiliza el procedimiento.

Objetivo cumplido: **no comenzar desde cero**.

---

# 59. Ejemplo académico

Elemento:

> Planificación — Introducción a JavaScript

Empresa:

> Expert Academy

Lienzo:

- objetivos;
- duración;
- contenido;
- explicación;
- ejercicios;
- enlaces;
- videos;
- checklist;
- evaluación;
- archivos.

Meses después:

> Necesito una clase introductoria para enseñar programación web.

La búsqueda semántica puede sugerir esa planificación aunque la consulta no diga “JavaScript”.

---

# 60. Ejemplo de Expert Code

Elemento:

> Base para dashboard administrativo con autenticación

Empresa:

> Expert Code

Contenido:

- repositorio GitHub;
- stack;
- instrucciones;
- archivos;
- arquitectura;
- errores conocidos;
- snippets;
- checklist de instalación;
- referencias.

Consulta posterior:

> Necesito empezar un sistema administrativo que ya tenga login.

El buscador puede sugerir este elemento.

---

# 61. Métricas internas útiles

Sin convertir el sistema en una plataforma analítica, pueden registrarse métricas simples:

- número de elementos;
- elementos por empresa;
- elementos más abiertos;
- búsquedas sin resultado;
- búsquedas frecuentes;
- plantillas más utilizadas.

Especialmente importante:

## Búsquedas sin resultado

Permiten descubrir qué conocimiento falta documentar.

---

# 62. Pruebas necesarias

## Unitarias

- generación de código;
- scoring de búsqueda;
- validaciones;
- permisos;
- transformaciones de exportación.

## Integración

- Prisma/PostgreSQL;
- uploads;
- Gemini;
- embeddings;
- historial;
- relaciones.

## E2E

Flujos clave:

1. Login.
2. Crear elemento.
3. Editar lienzo.
4. Adjuntar archivo.
5. Generar descripción IA.
6. Guardar.
7. Buscar semánticamente.
8. Abrir resultado.
9. Restaurar versión.
10. Exportar.

---

# 63. Definición de “terminado”

El sistema estará listo cuando sea posible completar, sin intervención técnica, el siguiente ciclo:

```text
IDEA / RECURSO / PROCESO
        ↓
CREAR O CAPTURAR
        ↓
DOCUMENTAR EN LIENZO
        ↓
ADJUNTAR RECURSOS
        ↓
DESCRIBIR / CLASIFICAR CON IA
        ↓
GUARDAR
        ↓
INDEXAR
        ↓
ENCONTRAR MESES DESPUÉS
        ↓
REUTILIZAR / RELACIONAR / MEZCLAR
        ↓
EXPORTAR SI ES NECESARIO
```

---

# 64. Decisiones finales del proyecto

| Área | Decisión |
|---|---|
| Tipo de app | Web |
| Usuarios iniciales | Un usuario / un rol |
| Arquitectura | Monolito modular |
| Lenguaje | TypeScript |
| Framework | Next.js |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| IA | Gemini |
| Núcleo funcional | Lienzo modular |
| Segundo pilar | Búsqueda semántica |
| Archivos | Upload directo + URL externa |
| Identificación | UUID interno + código visible |
| Organización | Empresa + tipo + categoría + etiquetas + estado |
| Versionado | Sí |
| Relaciones | Sí |
| Plantillas | Sí + builder personalizado |
| Diagramas | Manuales dentro del lienzo |
| Captura rápida | Sí |
| Exportación | MD, PDF, imagen, XLSX y DOCX |
| UX | Simple, visual, progresiva y con pocos clics |

---

# 65. Resultado esperado

El producto final no deberá sentirse como una base de datos tradicional.

Debe sentirse como un **espacio de trabajo personal inteligente**, donde el usuario pueda:

> capturar → construir → guardar → encontrar → reutilizar.

El valor principal del sistema no estará simplemente en almacenar información, sino en transformar experiencias, procesos y recursos dispersos en un **catálogo reutilizable de conocimiento operativo** para Expert Academy, Expert Design y Expert Code.
