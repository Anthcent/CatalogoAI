(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const state = {
    currentView: "home",
    selectedCatalog: new Set(),
    exportFormat: "Markdown",
    saveTimer: null
  };

  const sidebar = $("#sidebar");
  const crumb = $("#crumb");
  const canvasShell = $("#canvasShell");
  const blockPicker = $("#blockPicker");
  const toasts = $("#toasts");

  function toast(title, detail = "") {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
      <span>✓</span>
      <div><b>${title}</b>${detail ? `<small>${detail}</small>` : ""}</div>
      <button aria-label="Cerrar">×</button>
    `;
    el.querySelector("button").addEventListener("click", () => el.remove());
    toasts.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(7px)";
      setTimeout(() => el.remove(), 180);
    }, 3200);
  }

  function closeAllOverlays() {
    $$(".overlay.open").forEach(el => el.classList.remove("open"));
    blockPicker?.classList.remove("open");
  }

  function openModal(id) {
    closeAllOverlays();
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("open");
    const focusable = $("input, textarea, select, button", modal);
    setTimeout(() => focusable?.focus(), 40);
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  function showView(name, opts = {}) {
    const target = document.getElementById(`view-${name}`);
    if (!target) return;

    $$(".view").forEach(v => v.classList.remove("active"));
    target.classList.add("active");
    state.currentView = name;

    $$(".nav-link[data-view]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === name);
    });

    const title = target.dataset.title || name;
    if (crumb) {
      crumb.innerHTML = `<span>Expert Hub</span><b>/</b><strong>${title}</strong>`;
    }

    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      $(".canvas-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    }

    sidebar?.classList.remove("open");
  }

  function openItem(code) {
    closeAllOverlays();
    showView("canvas", { scroll: false });

    const titleMap = {
      "EXP-D7K4MX": "Stickers escolares — colección espacial",
      "EXP-A4M8QW": "Clase 08 — Introducción a Python",
      "EXP-C9N2TX": "Starter de autenticación Next.js",
      "EXP-P3L7SV": "Megaprompt — ilustración infantil para productos",
      "EXP-W5R2KP": "Flujo — preparación de archivos para impresión"
    };

    if (code && code !== "EXP-D7K4MX") {
      const title = titleMap[code] || "Elemento del catálogo";
      $("#canvasTitle").value = title;
      toast("Vista de detalle abierta", `${code} · El mockup reutiliza el mismo patrón de lienzo.`);
    } else {
      $("#canvasTitle").value = titleMap["EXP-D7K4MX"];
    }
  }

  // Navigation
  $$("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      showView(view);
      if (btn.dataset.settings) {
        setSettings(btn.dataset.settings);
      }
    });
  });

  $("#mobileMenu")?.addEventListener("click", () => sidebar.classList.toggle("open"));

  document.addEventListener("click", e => {
    if (
      window.innerWidth <= 850 &&
      sidebar?.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      e.target !== $("#mobileMenu")
    ) {
      sidebar.classList.remove("open");
    }
  });

  // Modal triggers
  $$("[data-modal]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (btn.dataset.close) closeModal(btn.dataset.close);
      openModal(btn.dataset.modal);
    });
  });

  $$(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".overlay")?.classList.remove("open"));
  });

  $$(".overlay").forEach(overlay => {
    overlay.addEventListener("mousedown", e => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });

  // Command palette
  $("#globalSearch")?.addEventListener("click", () => openModal("commandModal"));

  // Items / cards
  $$("[data-item]").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.closest("button") && !e.target.closest(".open-link")) return;
      openItem(el.dataset.item);
    });
  });

  // Home search -> semantic search
  function runHomeSearch() {
    const input = $("#homeQuery");
    const q = input?.value.trim();
    if (!q) {
      input?.focus();
      toast("Escribe qué quieres hacer", "La búsqueda funciona por intención, no exige palabras exactas.");
      return;
    }
    $("#semanticQuery").value = q;
    showView("search");
    toast("Búsqueda semántica", "Resultados ordenados por intención y relevancia.");
  }

  $("#homeSearchBtn")?.addEventListener("click", runHomeSearch);
  $("#homeQuery")?.addEventListener("keydown", e => {
    if (e.key === "Enter") runHomeSearch();
  });

  $$("[data-query]").forEach(btn => {
    btn.addEventListener("click", () => {
      $("#homeQuery").value = btn.dataset.query;
      runHomeSearch();
    });
  });

  // Semantic search demo
  $("#semanticBtn")?.addEventListener("click", () => {
    const q = $("#semanticQuery")?.value.trim();
    if (!q) return;
    $$(".result").forEach((r, i) => {
      r.animate(
        [
          { opacity: 0.45, transform: "translateY(4px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 260 + i * 80, easing: "ease-out" }
      );
    });
    toast("Resultados actualizados", "Gemini interpretó objetivo, formato, herramientas y etapa final.");
  });

  $$(".mode").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".mode").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      toast(`Modo: ${btn.textContent.trim()}`, "El mockup cambia el criterio visual de búsqueda.");
    });
  });

  $$(".query-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      $("#semanticQuery").value = btn.textContent.trim();
      $("#semanticBtn")?.click();
    });
  });

  // New element
  $$("[data-start]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.start;
      closeModal("newModal");

      if (type === "blank") {
        showView("canvas", { scroll: false });
        $("#canvasTitle").value = "Elemento sin título";
        toast("Lienzo en blanco creado", "El ID visible se generaría automáticamente al guardar.");
      }

      if (type === "template") {
        showView("templates");
        toast("Elige una plantilla", "Puedes usar una existente o crear una personalizada.");
      }

      if (type === "capture") {
        openModal("captureModal");
      }

      if (type === "duplicate") {
        showView("catalog");
        toast("Selecciona un elemento", "En producción, “Duplicar” conservará la referencia al original.");
      }
    });
  });

  // Quick capture
  $("#saveCapture")?.addEventListener("click", () => {
    const text = $("#captureText")?.value.trim();
    if (!text) {
      $("#captureText")?.focus();
      toast("Agrega algo para guardar", "Puede ser texto, un enlace, un prompt o una nota.");
      return;
    }
    closeModal("captureModal");
    $("#captureText").value = "";
    showView("inbox");
    toast("Guardado en la bandeja", "Gemini preparó sugerencias para organizarlo.");
  });

  // Catalog search/filter
  const catalogCards = $$(".catalog-card");
  $("#catalogQuery")?.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    catalogCards.forEach(card => {
      const haystack = [
        card.dataset.title,
        card.dataset.businessCard,
        card.textContent
      ].join(" ").toLowerCase();
      card.style.display = haystack.includes(q) ? "" : "none";
    });
  });

  $$("[data-catalog-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("[data-catalog-view]").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      $("#catalogGrid").classList.toggle("list", btn.dataset.catalogView === "list");
    });
  });

  function refreshSelectionBar() {
    const checked = $$(".catalog-card .check input:checked");
    state.selectedCatalog = new Set(checked.map(cb => cb.closest(".catalog-card")?.dataset.title || "Elemento"));
    $("#selectionCount").textContent = checked.length;
    $("#selectionBar")?.classList.toggle("hidden", checked.length === 0);
  }

  $$(".catalog-card .check input").forEach(cb => {
    cb.addEventListener("change", e => {
      e.stopPropagation();
      refreshSelectionBar();
    });
  });

  $("#clearSelection")?.addEventListener("click", () => {
    $$(".catalog-card .check input").forEach(cb => (cb.checked = false));
    refreshSelectionBar();
  });

  $("#clearFilters")?.addEventListener("click", () => {
    catalogCards.forEach(card => (card.style.display = ""));
    $("#catalogQuery").value = "";
    toast("Filtros limpiados");
  });

  $$("[data-business]").forEach(btn => {
    btn.addEventListener("click", () => {
      const business = btn.dataset.business;
      showView("catalog");
      catalogCards.forEach(card => {
        card.style.display = card.dataset.businessCard === business ? "" : "none";
      });
      toast(`Filtrando: ${business}`, "La empresa funciona como una dimensión principal del catálogo.");
    });
  });

  // Canvas autosave
  function simulateSave() {
    const save = $("#saveState");
    if (!save) return;
    clearTimeout(state.saveTimer);
    save.textContent = "Guardando…";
    const dot = save.previousElementSibling;
    if (dot) dot.style.background = "#e59a27";

    state.saveTimer = setTimeout(() => {
      save.textContent = "Guardado";
      if (dot) dot.style.background = "#23a88a";
    }, 700);
  }

  $("#canvasTitle")?.addEventListener("input", simulateSave);
  $$(".editable").forEach(el => el.addEventListener("input", simulateSave));

  $$("[data-block]").forEach(block => {
    block.addEventListener("click", e => {
      if (e.target.closest("button,input,label,a")) return;
      $$("[data-block]").forEach(b => b.classList.remove("selected"));
      block.classList.add("selected");
    });
  });

  // Checklist progress
  function updateProgress() {
    const steps = $$(".step");
    const done = steps.filter(step => $("input", step)?.checked).length;
    $(".progress-label").textContent = `${done} de ${steps.length}`;
  }

  $$(".step input").forEach(cb => {
    cb.addEventListener("change", () => {
      cb.closest(".step")?.classList.toggle("done", cb.checked);
      updateProgress();
      simulateSave();
    });
  });

  $(".copy-prompt")?.addEventListener("click", async () => {
    const text = $(".prompt-text")?.innerText || "";
    try {
      await navigator.clipboard.writeText(text);
      toast("Prompt copiado", "Listo para pegarlo en Gemini u otra herramienta.");
    } catch {
      toast("Prompt preparado", "El navegador bloqueó el portapapeles en este archivo local.");
    }
  });

  // Canvas panes
  $("#closeOutline")?.addEventListener("click", () => {
    canvasShell.classList.add("hide-outline");
    $("#openOutline").classList.remove("hidden");
  });

  $("#openOutline")?.addEventListener("click", () => {
    canvasShell.classList.remove("hide-outline");
    $("#openOutline").classList.add("hidden");
  });

  $("#closeProperties")?.addEventListener("click", () => {
    canvasShell.classList.add("hide-props");
    $("#openProperties").classList.remove("hidden");
  });

  $("#openProperties")?.addEventListener("click", () => {
    canvasShell.classList.remove("hide-props");
    $("#openProperties").classList.add("hidden");
  });

  // Block picker
  function showBlockPicker(anchor) {
    if (!blockPicker) return;
    blockPicker.classList.add("open");
    const rect = anchor?.getBoundingClientRect?.() || { left: window.innerWidth / 2 - 170, bottom: window.innerHeight / 2 };
    const maxLeft = Math.max(10, window.innerWidth - 350);
    const left = Math.min(Math.max(10, rect.left - 155), maxLeft);
    const top = Math.min(rect.bottom + 7, window.innerHeight - 365);
    blockPicker.style.left = `${left}px`;
    blockPicker.style.top = `${Math.max(12, top)}px`;
    $("#pickerQuery").value = "";
    $$("[data-add-block]").forEach(b => (b.style.display = ""));
    setTimeout(() => $("#pickerQuery")?.focus(), 30);
  }

  $("#addBlock")?.addEventListener("click", e => showBlockPicker(e.currentTarget));
  $("#addBlockText")?.addEventListener("click", e => showBlockPicker(e.currentTarget));

  $("#pickerQuery")?.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    $$("[data-add-block]").forEach(btn => {
      btn.style.display = btn.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });

  function makeBlock(type) {
    const section = document.createElement("section");
    section.className = "block";
    section.dataset.block = "";
    section.innerHTML = `
      <span class="handle">⋮⋮</span>
      <div class="block-head">
        <span class="block-icon purple">${type === "Checklist" ? "✓" : type === "Prompt" ? "✦" : type === "Diagrama" ? "⌘" : "＋"}</span>
        <div><small>${type.toUpperCase()}</small><h3>${type} nuevo</h3></div>
        <button>•••</button>
      </div>
      <p class="editable" contenteditable="true" style="font-size:8.5px;line-height:1.6;color:#737d89;margin:0">
        Haz clic aquí para editar el contenido de este bloque.
      </p>
    `;
    section.addEventListener("click", e => {
      if (e.target.closest("button,input,label")) return;
      $$("[data-block]").forEach(b => b.classList.remove("selected"));
      section.classList.add("selected");
    });
    $(".editable", section)?.addEventListener("input", simulateSave);
    return section;
  }

  $$("[data-add-block]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.addBlock;
      const insertLine = $(".insert-line");
      insertLine?.parentNode.insertBefore(makeBlock(type), insertLine);
      blockPicker.classList.remove("open");
      toast(`${type} agregado`, "El lienzo crece por bloques y mantiene el contenido flexible.");
      simulateSave();
    });
  });

  document.addEventListener("mousedown", e => {
    if (
      blockPicker?.classList.contains("open") &&
      !blockPicker.contains(e.target) &&
      !e.target.closest("#addBlock,#addBlockText")
    ) {
      blockPicker.classList.remove("open");
    }
  });

  // Template tabs / builder
  function setTab(name) {
    $$("[data-tab]").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
    $$(".tab-pane").forEach(pane => pane.classList.remove("active"));
    $(`#tab-${name}`)?.classList.add("active");
  }

  $$("[data-tab]").forEach(btn => btn.addEventListener("click", () => setTab(btn.dataset.tab)));
  $("#createTemplate")?.addEventListener("click", () => setTab("builder"));
  $("#openBuilder")?.addEventListener("click", () => setTab("builder"));

  $$(".use-template").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.template || "Plantilla";
      showView("canvas", { scroll: false });
      $("#canvasTitle").value = `${name} — nuevo`;
      toast(`Plantilla: ${name}`, "El lienzo se abriría con sus bloques preconfigurados.");
    });
  });

  $$("[data-builder]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.builder;
      const paper = $("#builderPaper");
      $(".builder-empty", paper)?.remove();
      const row = document.createElement("div");
      row.className = "builder-added";
      row.innerHTML = `<span>${type === "Texto" ? "Aa" : type === "Prompt" ? "✦" : type === "Diagrama" ? "⌘" : "＋"}</span><b>${type}</b><button aria-label="Quitar">×</button>`;
      $("button", row).addEventListener("click", () => row.remove());
      paper.appendChild(row);
      toast(`${type} agregado a la plantilla`);
    });
  });

  // Settings
  function setSettings(name) {
    $$("[data-settings]").forEach(btn => {
      if (btn.closest(".settings-nav")) btn.classList.toggle("active", btn.dataset.settings === name);
    });
    $$(".setting").forEach(s => s.classList.remove("active"));
    $(`#setting-${name}`)?.classList.add("active");
  }

  $$("[data-settings]").forEach(btn => {
    if (btn.closest(".settings-nav")) {
      btn.addEventListener("click", () => setSettings(btn.dataset.settings));
    }
  });

  $("#toggleSecret")?.addEventListener("click", e => {
    const input = $("#apiKey");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    if (!showing) input.value = "AIzaSy••••••••••••••demo";
    else input.value = "••••••••••••••••••••";
    e.currentTarget.textContent = showing ? "Mostrar" : "Ocultar";
  });

  // Export
  $$(".export-option").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".export-option").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.exportFormat = btn.dataset.format;
      $("#formatSelected").textContent = `Formato: ${state.exportFormat}`;
    });
  });

  $("#doExport")?.addEventListener("click", () => {
    closeModal("exportModal");
    toast(`Exportación ${state.exportFormat}`, "En el producto real se generaría y descargaría el archivo.");
  });

  // Relations
  $$(".relation-result").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".relation-result").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  $("#saveRelation")?.addEventListener("click", () => {
    closeModal("relationModal");
    toast("Relación creada", "La conexión aparecería en ambos elementos y en las sugerencias.");
  });

  // Compose
  $("#composeBtn")?.addEventListener("click", () => {
    closeModal("composeModal");
    showView("canvas", { scroll: false });
    $("#canvasTitle").value = "Composición — nuevo elemento";
    toast("Nuevo lienzo compuesto", "Las referencias de procedencia se conservarían automáticamente.");
  });

  // Version restore demo
  $$(".versions button").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal("versionModal");
      toast("Versión restaurada", "Se crearía una nueva versión sin borrar el historial anterior.");
    });
  });

  // Misc interactions
  $("#notify")?.addEventListener("click", () => toast("Sin novedades pendientes", "Las alertas importantes aparecerían aquí."));

  $$(".dots").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      toast("Acciones rápidas", "Duplicar · Copiar código · Relacionar · Archivar");
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    const meta = e.metaKey || e.ctrlKey;
    const tag = document.activeElement?.tagName?.toLowerCase();
    const editing = ["input", "textarea", "select"].includes(tag) || document.activeElement?.isContentEditable;

    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openModal("commandModal");
    }

    if (meta && e.key.toLowerCase() === "n") {
      e.preventDefault();
      openModal("newModal");
    }

    if (meta && e.key.toLowerCase() === "s" && state.currentView === "canvas") {
      e.preventDefault();
      simulateSave();
      toast("Cambios guardados");
    }

    if (e.key === "Escape") {
      closeAllOverlays();
      sidebar?.classList.remove("open");
    }

    if (e.key === "/" && state.currentView === "canvas" && !editing) {
      e.preventDefault();
      showBlockPicker($("#addBlock"));
    }
  });

  // Simple demo buttons that intentionally do not navigate
  $$(".btn-soft, .btn-primary").forEach(btn => {
    if (
      btn.matches("[data-view],[data-modal],.use-template,#saveCapture,#doExport,#saveRelation,#composeBtn,#createTemplate,#openBuilder")
    ) return;

    if (btn.textContent.includes("Guardar cambios")) {
      btn.addEventListener("click", () => toast("Configuración guardada"));
    }
  });

  // Initial state
  updateProgress();
  showView("home", { scroll: false });
})();

/* =========================================================
   V2 — FREE LAYOUT + VISUAL ASSET LIBRARY
   ========================================================= */
(() => {
  "use strict";

  const visualAssets = [{"id": "stickers-space", "file": "assets/graphics/stickers-space.svg", "category": "Stickers", "label": "Espacio kawaii"}, {"id": "stickers-school", "file": "assets/graphics/stickers-school.svg", "category": "Stickers", "label": "Escolar divertido"}, {"id": "stickers-cats", "file": "assets/graphics/stickers-cats.svg", "category": "Stickers", "label": "Gatos ilustrados"}, {"id": "stickers-tech", "file": "assets/graphics/stickers-tech.svg", "category": "Stickers", "label": "Tech icons"}, {"id": "stickers-food", "file": "assets/graphics/stickers-food.svg", "category": "Stickers", "label": "Comida cute"}, {"id": "stickers-planet", "file": "assets/graphics/stickers-planet.svg", "category": "Stickers", "label": "Planetas"}, {"id": "stickers-shapes", "file": "assets/graphics/stickers-shapes.svg", "category": "Stickers", "label": "Formas abstractas"}, {"id": "stickers-animals", "file": "assets/graphics/stickers-animals.svg", "category": "Stickers", "label": "Animalitos"}, {"id": "academy-python", "file": "assets/graphics/academy-python.svg", "category": "Academy", "label": "Clase de Python"}, {"id": "academy-web", "file": "assets/graphics/academy-web.svg", "category": "Academy", "label": "Clase de Web"}, {"id": "academy-git", "file": "assets/graphics/academy-git.svg", "category": "Academy", "label": "Curso de Git"}, {"id": "academy-ai", "file": "assets/graphics/academy-ai.svg", "category": "Academy", "label": "Clase de IA"}, {"id": "academy-plan", "file": "assets/graphics/academy-plan.svg", "category": "Academy", "label": "Planificación"}, {"id": "academy-workshop", "file": "assets/graphics/academy-workshop.svg", "category": "Academy", "label": "Taller práctico"}, {"id": "code-nextjs", "file": "assets/graphics/code-nextjs.svg", "category": "Code", "label": "Next.js starter"}, {"id": "code-api", "file": "assets/graphics/code-api.svg", "category": "Code", "label": "API service"}, {"id": "code-prisma", "file": "assets/graphics/code-prisma.svg", "category": "Code", "label": "Prisma schema"}, {"id": "code-dashboard", "file": "assets/graphics/code-dashboard.svg", "category": "Code", "label": "Dashboard UI"}, {"id": "code-auth", "file": "assets/graphics/code-auth.svg", "category": "Code", "label": "Auth flow"}, {"id": "code-github", "file": "assets/graphics/code-github.svg", "category": "Code", "label": "Repositorio GitHub"}, {"id": "design-shirt-black", "file": "assets/graphics/design-shirt-black.svg", "category": "Design", "label": "Franela oscura"}, {"id": "design-shirt-cream", "file": "assets/graphics/design-shirt-cream.svg", "category": "Design", "label": "Franela crema"}, {"id": "design-shirt-purple", "file": "assets/graphics/design-shirt-purple.svg", "category": "Design", "label": "Franela violeta"}, {"id": "design-packaging", "file": "assets/graphics/design-packaging.svg", "category": "Design", "label": "Packaging"}, {"id": "design-labels", "file": "assets/graphics/design-labels.svg", "category": "Design", "label": "Etiquetas"}, {"id": "design-poster", "file": "assets/graphics/design-poster.svg", "category": "Design", "label": "Poster"}, {"id": "workflow-print", "file": "assets/graphics/workflow-print.svg", "category": "Workflows", "label": "Flujo de impresión"}, {"id": "workflow-class", "file": "assets/graphics/workflow-class.svg", "category": "Workflows", "label": "Flujo de clase"}, {"id": "workflow-sales", "file": "assets/graphics/workflow-sales.svg", "category": "Workflows", "label": "Flujo comercial"}, {"id": "workflow-product", "file": "assets/graphics/workflow-product.svg", "category": "Workflows", "label": "Flujo de producto"}, {"id": "workflow-content", "file": "assets/graphics/workflow-content.svg", "category": "Workflows", "label": "Flujo de contenido"}, {"id": "resource-web-grid", "file": "assets/graphics/resource-web-grid.svg", "category": "Resources", "label": "Directorio web"}, {"id": "resource-drive", "file": "assets/graphics/resource-drive.svg", "category": "Resources", "label": "Google Drive"}, {"id": "resource-pdf", "file": "assets/graphics/resource-pdf.svg", "category": "Resources", "label": "Documento PDF"}, {"id": "resource-links", "file": "assets/graphics/resource-links.svg", "category": "Resources", "label": "Colección de enlaces"}, {"id": "resource-research", "file": "assets/graphics/resource-research.svg", "category": "Resources", "label": "Investigación"}, {"id": "cover-purple", "file": "assets/graphics/cover-purple.svg", "category": "Covers", "label": "Portada violeta"}, {"id": "cover-pink", "file": "assets/graphics/cover-pink.svg", "category": "Covers", "label": "Portada rosa"}, {"id": "cover-blue", "file": "assets/graphics/cover-blue.svg", "category": "Covers", "label": "Portada azul"}, {"id": "cover-green", "file": "assets/graphics/cover-green.svg", "category": "Covers", "label": "Portada verde"}];
  const $ = (s, scope=document) => scope.querySelector(s);
  const $$ = (s, scope=document) => [...scope.querySelectorAll(s)];
  const doc = $(".document");
  const allowedSpans = [4,6,8,12];
  let draggedBlock = null;
  let selectedAsset = null;

  function miniToast(title, detail="") {
    const host = $("#toasts");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span>✓</span><div><b>${title}</b>${detail ? `<small>${detail}</small>` : ""}</div><button>×</button>`;
    $("button",el)?.addEventListener("click",()=>el.remove());
    host.appendChild(el);
    setTimeout(()=>el.remove(),3000);
  }

  function closeOverlay(id) {
    document.getElementById(id)?.classList.remove("open");
  }

  function setBlockSpan(block, span, notify=false) {
    if (!block) return;
    span = allowedSpans.includes(Number(span)) ? Number(span) : 12;
    block.dataset.span = String(span);
    $$(".layout-tools [data-span-button]", block).forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.spanButton) === span);
    });
    if (notify) {
      const label = span === 4 ? "⅓" : span === 6 ? "½" : span === 8 ? "⅔" : "ancho completo";
      miniToast(`Bloque ajustado a ${label}`, "El layout se guardaría con este elemento.");
    }
  }

  function enhanceBlock(block) {
    if (!block || block.dataset.layoutReady === "1") return;
    block.dataset.layoutReady = "1";
    block.dataset.span = block.dataset.span || "12";
    block.draggable = true;

    const tools = document.createElement("div");
    tools.className = "layout-tools";
    tools.innerHTML = `
      <span>ANCHO</span>
      <button type="button" data-span-button="4" title="Un tercio">⅓</button>
      <button type="button" data-span-button="6" title="Mitad">½</button>
      <button type="button" data-span-button="8" title="Dos tercios">⅔</button>
      <button type="button" data-span-button="12" title="Completo">1/1</button>
      <button type="button" class="drag-block" title="Arrastrar">⋮⋮</button>
    `;
    block.appendChild(tools);

    const grip = document.createElement("div");
    grip.className = "resize-grip";
    grip.title = "Arrastra para redimensionar";
    block.appendChild(grip);

    $$("[data-span-button]", tools).forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        setBlockSpan(block, Number(btn.dataset.spanButton), true);
      });
    });
    setBlockSpan(block, Number(block.dataset.span), false);

    block.addEventListener("dragstart", e => {
      if (e.target.closest("input,textarea,button,a,[contenteditable=true]")) {
        e.preventDefault();
        return;
      }
      draggedBlock = block;
      block.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", "block"); } catch {}
    });

    block.addEventListener("dragend", () => {
      block.classList.remove("dragging");
      $$(".drop-before,.drop-after", doc).forEach(x => x.classList.remove("drop-before","drop-after"));
      draggedBlock = null;
      miniToast("Layout actualizado", "El orden de los bloques cambió.");
    });

    grip.addEventListener("pointerdown", e => {
      e.preventDefault();
      e.stopPropagation();
      block.classList.add("resizing");
      grip.setPointerCapture?.(e.pointerId);

      const move = ev => {
        const rect = block.getBoundingClientRect();
        const docRect = doc.getBoundingClientRect();
        const oneCol = docRect.width / 12;
        const desired = Math.max(4, Math.min(12, Math.round((ev.clientX - rect.left) / oneCol)));
        const nearest = allowedSpans.reduce((a,b) => Math.abs(b-desired) < Math.abs(a-desired) ? b : a);
        setBlockSpan(block, nearest, false);
      };

      const up = ev => {
        block.classList.remove("resizing");
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        const span = Number(block.dataset.span);
        const label = span === 4 ? "⅓" : span === 6 ? "½" : span === 8 ? "⅔" : "ancho completo";
        miniToast(`Bloque redimensionado: ${label}`);
      };

      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
  }

  if (doc) {
    $$("[data-block]", doc).forEach(enhanceBlock);

    doc.addEventListener("dragover", e => {
      if (!draggedBlock) return;
      e.preventDefault();
      const target = e.target.closest("[data-block]");
      if (!target || target === draggedBlock) return;

      $$(".drop-before,.drop-after", doc).forEach(x => x.classList.remove("drop-before","drop-after"));
      const rect = target.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height/2;
      target.classList.add(after ? "drop-after" : "drop-before");
      e.dataTransfer.dropEffect = "move";
    });

    doc.addEventListener("drop", e => {
      if (!draggedBlock) return;
      e.preventDefault();
      const target = e.target.closest("[data-block]");
      if (!target || target === draggedBlock) return;
      const rect = target.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height/2;
      if (after) target.after(draggedBlock);
      else target.before(draggedBlock);
      target.classList.remove("drop-before","drop-after");
    });

    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => m.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches?.("[data-block]")) enhanceBlock(node);
        if (node.nodeType === 1) $$("[data-block]",node).forEach(enhanceBlock);
      }));
    });
    observer.observe(doc, {childList:true,subtree:true});
  }

  // Presets
  const smartPattern = [12,6,6,8,4,6,6,4,4,4,8,4];
  $$("[data-layout-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.layoutPreset;
      $$("[data-layout-preset]").forEach(x => x.classList.toggle("active", x === btn));
      const blocks = $$("[data-block]",doc);
      blocks.forEach((block,index) => {
        let span = 12;
        if (preset === "two") span = 6;
        if (preset === "three") span = 4;
        if (preset === "smart") span = smartPattern[index % smartPattern.length];
        setBlockSpan(block, span, false);
      });
      miniToast(
        preset === "stack" ? "Una columna aplicada" :
        preset === "two" ? "Dos columnas aplicadas" :
        preset === "three" ? "Tres columnas aplicadas" :
        "Composición libre aplicada"
      );
    });
  });

  // Asset library
  function makeAssetCard(asset, picker=false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = picker ? "asset-picker-item" : "asset-card";
    btn.dataset.assetId = asset.id;
    btn.dataset.assetCategory = asset.category;
    btn.dataset.assetSearch = `${asset.label} ${asset.category} ${asset.id}`.toLowerCase();

    if (picker) {
      btn.innerHTML = `<img src="${asset.file}" alt="${asset.label}"><span>${asset.label}</span><i>✓</i>`;
      btn.addEventListener("click", () => {
        selectedAsset = asset;
        $$(".asset-picker-item").forEach(x => x.classList.toggle("selected", x === btn));
        $("#assetSelectedLabel").textContent = `${asset.label} · ${asset.category}`;
      });
    } else {
      btn.innerHTML = `<img src="${asset.file}" alt="${asset.label}"><em>${asset.category}</em><div><b>${asset.label}</b><small>${asset.id}.svg</small></div><div class="asset-actions"><span>＋</span></div>`;
      btn.addEventListener("click", () => {
        selectedAsset = asset;
        const modal = $("#assetModal");
        modal?.classList.add("open");
        renderPicker($("#assetPickerSearch")?.value || "");
        requestAnimationFrame(() => {
          const match = $(`.asset-picker-item[data-asset-id="${asset.id}"]`);
          if (match) {
            match.classList.add("selected");
            match.scrollIntoView({block:"nearest"});
          }
        });
        $("#assetSelectedLabel").textContent = `${asset.label} · ${asset.category}`;
      });
    }
    return btn;
  }

  function renderLibrary(query="", category="Todos") {
    const grid = $("#assetGrid");
    if (!grid) return;
    const q = query.trim().toLowerCase();
    const list = visualAssets.filter(a =>
      (category === "Todos" || a.category === category) &&
      (!q || `${a.label} ${a.category} ${a.id}`.toLowerCase().includes(q))
    );
    grid.innerHTML = "";
    list.forEach(a => grid.appendChild(makeAssetCard(a,false)));
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1;min-height:250px"><span>⌕</span><h3>No hay gráficos con ese filtro</h3><p>Prueba otra palabra o categoría.</p></div>`;
    }
  }

  function renderPicker(query="") {
    const grid = $("#assetPickerGrid");
    if (!grid) return;
    const q = query.trim().toLowerCase();
    const list = visualAssets.filter(a => !q || `${a.label} ${a.category} ${a.id}`.toLowerCase().includes(q));
    grid.innerHTML = "";
    list.forEach(a => {
      const item = makeAssetCard(a,true);
      if (selectedAsset?.id === a.id) item.classList.add("selected");
      grid.appendChild(item);
    });
  }

  let activeCategory = "Todos";
  renderLibrary();
  renderPicker();

  $("#assetSearch")?.addEventListener("input", e => renderLibrary(e.target.value, activeCategory));
  $("#assetPickerSearch")?.addEventListener("input", e => renderPicker(e.target.value));

  $$("[data-asset-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.assetCategory;
      $$("[data-asset-category]").forEach(x => x.classList.toggle("active", x === btn));
      renderLibrary($("#assetSearch")?.value || "", activeCategory);
    });
  });

  // Re-render picker each time modal opens so filters/selection stay coherent.
  $$('[data-modal="assetModal"]').forEach(btn => {
    btn.addEventListener("click", () => renderPicker($("#assetPickerSearch")?.value || ""));
  });

  $("#useAssetBtn")?.addEventListener("click", () => {
    if (!selectedAsset) {
      miniToast("Selecciona un gráfico primero");
      return;
    }

    const gallery = $(".gallery");
    const upload = $(".gallery-upload", gallery);
    if (gallery && upload) {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<img class="asset-art" src="${selectedAsset.file}" alt="${selectedAsset.label}"><span>${selectedAsset.label}</span>`;
      gallery.insertBefore(item, upload);
    }
    closeOverlay("assetModal");
    miniToast("Gráfico agregado al lienzo", `${selectedAsset.label} · recurso SVG incluido`);
  });

  // Make "layout" self-explanatory on first canvas visit.
  const layoutButton = $('[data-modal="layoutModal"]');
  if (layoutButton) layoutButton.title = "Organizar bloques en 1, 2 o 3 columnas";
})();
