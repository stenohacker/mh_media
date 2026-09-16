(function () {
  "use strict";

  if (!window.LearnIndex) {
    document.body.innerHTML = "<p>Learn Index renderer could not be loaded.</p>";
    return;
  }

  // One builder manages every Learn section. Public folder names can remain stable
  // even when the section's displayed name changes.
  const SECTION_CONFIG = Object.freeze({
    "chatgpt-tips": Object.freeze({
      label: "ChatGPT Tips",
      catalogUrl: "./chatgpt-tips/index-items.json",
      title: "ChatGPT Tips",
      intro: "Practical ChatGPT lessons, prompt habits, and workflow ideas for stronger results.",
      accent: "#24A094"
    }),
    "reporter-tools": Object.freeze({
      label: "Reporter Tools",
      catalogUrl: "./sidekicks/index-items.json",
      title: "Reporter Tools",
      intro: "Choose a tool to open its demo, tutorial, or direct setup link. ChatGPT and AI Drive tools are grouped separately.",
      accent: "#FB71DE"
    }),
    "steno-tips": Object.freeze({
      label: "Steno Tips & Briefs",
      catalogUrl: "./steno-tips/index-items.json",
      title: "Steno Tips & Briefs",
      intro: "Steno knowledge, briefs, reporting habits, and practical lessons for working reporters.",
      accent: "#F1F332"
    }),
    "tech-tips": Object.freeze({
      label: "Tech Tips",
      catalogUrl: "./tech-tips/index-items.json",
      title: "Tech Tips",
      intro: "Useful software, hardware, and workflow lessons outside the individual Sidekicks.",
      accent: "#91A8ED"
    })
  });
  const DEFAULT_COMING_SOON_IMAGE = "/images/learn/coming-soon.gif";

  const $ = (selector, root = document) => root.querySelector(selector);
  const text = (value) => String(value == null ? "" : value);
  const esc = (value) => text(value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const sectionSelect = $("#builderSection");
  const status = $("#builderStatus");
  const catalogMeta = $("#catalogMeta");
  const itemList = $("#builderItemList");
  const editor = $("#builderEditor");
  const preview = $("#builderPreview");
  const previewModalButton = $("#previewModal");
  const previewNote = $("#builderPreviewNote");
  const tutorialFileInput = $("#tutorialFileInput");
  const catalogFileInput = $("#catalogFileInput");

  let catalog = null;
  let activeIndex = -1;
  let fileHandle = null;
  let modalApi = null;
  let dirty = false;

  function defaultCatalog(section) {
    const config = SECTION_CONFIG[section] || {
      title: section || "Learn",
      intro: "",
      accent: "#24A094"
    };
    return {
      version: 2,
      section,
      eyebrow: "Learn",
      title: config.title,
      intro: config.intro,
      accent: config.accent,
      comingSoonImage: DEFAULT_COMING_SOON_IMAGE,
      quickLinks: [],
      items: []
    };
  }

  function setStatus(message, tone = "") {
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function markDirty(message = "Unsaved catalog changes.") {
    dirty = true;
    setStatus(message);
  }

  function currentItem() {
    return catalog?.items?.[activeIndex] || null;
  }

  function normalizeForEdit(value) {
    const normalized = window.LearnIndex.normalizeCatalog(value);
    normalized.items.forEach((item, index) => {
      item.order = Number(item.order) || (index + 1) * 10;
      item.bullets = Array.isArray(item.bullets) ? item.bullets : [];
    });
    return normalized;
  }

  function nextOrder() {
    const values = (catalog?.items || []).map((item) => Number(item.order) || 0);
    return (values.length ? Math.max(...values) : 0) + 10;
  }

  function uniqueId(seed) {
    const base = window.LearnIndex.slugify(seed) || `item-${Date.now()}`;
    const existing = new Set((catalog?.items || []).map((item) => item.id));
    if (!existing.has(base)) return base;
    let suffix = 2;
    while (existing.has(`${base}-${suffix}`)) suffix += 1;
    return `${base}-${suffix}`;
  }

  function blankItem() {
    return {
      id: uniqueId("new-item"),
      legacyKey: "",
      order: nextOrder(),
      group: "",
      title: "New Item",
      bullets: [""],
      description: "",
      media: {
        type: "image",
        url: "",
        alt: "",
        fit: "contain",
        matte: "#ffffff",
        x: 0,
        y: 0,
        scale: 1
      },
      modalVideoUrl: "",
      modalVideoFallbackUrl: "",
      demoUrl: "",
      tutorialUrl: "",
      goToTool: false,
      toolUrl: "",
      quickLinkLabel: "Open Tool",
      quickLinkUrl: "",
      access: "n/a",
      comingSoon: false,
      accent: catalog?.accent || "#24A094"
    };
  }

  function renderCatalogMeta() {
    catalogMeta.innerHTML = `
      <label class="builder-field">
        <span>Section title</span>
        <input data-catalog-field="title" value="${esc(catalog.title)}">
      </label>
      <label class="builder-field">
        <span>Introduction</span>
        <textarea data-catalog-field="intro" rows="3">${esc(catalog.intro)}</textarea>
      </label>
      <label class="builder-field">
        <span>Section accent</span>
        <input data-catalog-field="accent" type="color" value="${esc(catalog.accent || "#24A094")}">
      </label>
      <label class="builder-field">
        <span>Coming Soon image URL</span>
        <input data-catalog-field="comingSoonImage" type="url" value="${esc(catalog.comingSoonImage)}" placeholder="Leave blank for the temporary placeholder">
      </label>`;
  }

  function renderItemList() {
    if (!catalog.items.length) {
      itemList.innerHTML = '<p class="builder-empty">No items yet. Add a blank item or import a finished Tutorial Builder HTML file.</p>';
      return;
    }
    itemList.innerHTML = catalog.items.map((item, index) => `
      <div class="builder-item-row" data-active="${index === activeIndex}">
        <button class="builder-item-row__select" type="button" data-select-item="${index}">${esc(item.title)}</button>
        <span class="builder-item-row__order">${index + 1}</span>
      </div>`).join("");
  }

  function mediaOption(value, label, selected) {
    return `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`;
  }

  function renderEditor() {
    const item = currentItem();
    if (!item) {
      editor.innerHTML = '<p class="builder-empty">Select an item, add a blank item, or import a tutorial.</p>';
      return;
    }
    const isReporterTools = catalog.section === "reporter-tools";

    const bulletRows = item.bullets.map((bullet, index) => `
      <div class="builder-bullet-row">
        <input data-bullet-index="${index}" value="${esc(bullet)}" aria-label="Bullet ${index + 1}">
        <button type="button" data-remove-bullet="${index}" aria-label="Remove bullet ${index + 1}">×</button>
      </div>`).join("");

    editor.innerHTML = `
      <section class="builder-editor-section">
        <h3>Card and Modal Text</h3>
        <div class="builder-field-grid">
          <label class="builder-field">
            <span>Title</span>
            <input data-item-field="title" value="${esc(item.title)}">
          </label>
          <label class="builder-field">
            <span>Display order</span>
            <input data-item-field="order" type="number" value="${Number(item.order) || 10}">
          </label>
          <label class="builder-field builder-field--full">
            <span>Group heading (optional)</span>
            <input data-item-field="group" value="${esc(item.group)}" placeholder="ChatGPT Tools or AI Drive Tools">
          </label>
          <label class="builder-field builder-field--full">
            <span>${isReporterTools ? "Existing tool key (legacy primary tutorials only)" : "Existing Reporter Tools card key (optional)"}</span>
            <input data-item-field="legacyKey" value="${esc(item.legacyKey)}" placeholder="${isReporterTools ? "Leave blank for new tutorials" : "Only needed for an existing Reporter Tools modal"}">
          </label>
          <div class="builder-field builder-field--full">
            <span>${isReporterTools ? "Tutorial card/modal bullet points" : "Card bullet points"}</span>
            <div class="builder-bullets">${bulletRows || '<p class="builder-empty">No bullets yet.</p>'}</div>
            <button class="builder-button" type="button" data-action="add-bullet">Add Bullet</button>
          </div>
          <label class="builder-field builder-field--full">
            <span>Modal description</span>
            <textarea data-item-field="description">${esc(item.description)}</textarea>
          </label>
        </div>
      </section>

      <section class="builder-editor-section">
        <h3>Image, GIF, or Video</h3>
        <div class="builder-field-grid">
          <label class="builder-field">
            <span>Media type</span>
            <select data-media-field="type">
              ${mediaOption("image", "Image", item.media.type)}
              ${mediaOption("gif", "GIF", item.media.type)}
              ${mediaOption("video", "Video", item.media.type)}
            </select>
          </label>
          <label class="builder-field">
            <span>Media background</span>
            <input data-media-field="matte" type="color" value="${esc(item.media.matte || "#ffffff")}">
          </label>
          <label class="builder-field builder-field--full">
            <span>Media file or URL</span>
            <input data-media-field="url" value="${esc(item.media.url)}" placeholder="https://…/image.png or video.mp4">
          </label>
          <label class="builder-field builder-field--full">
            <span>Image/video description</span>
            <input data-media-field="alt" value="${esc(item.media.alt)}" placeholder="Used for accessibility">
          </label>
        </div>
        <div class="builder-media-controls" aria-label="Media size and position">
          <button type="button" data-media-control="match" data-active="${item.media.fit === "match"}">Match</button>
          <button type="button" data-media-control="contain" data-active="${item.media.fit === "contain"}">Contain</button>
          <button type="button" data-media-control="cover" data-active="${item.media.fit === "cover"}">Cover</button>
          <button type="button" data-media-control="up">Up</button>
          <button type="button" data-media-control="down">Down</button>
          <button type="button" data-media-control="left">Left</button>
          <button type="button" data-media-control="right">Right</button>
          <button type="button" data-media-control="zoom-in">Zoom In</button>
          <button type="button" data-media-control="zoom-out">Zoom Out</button>
          <button type="button" data-media-control="reset">Reset</button>
          <p class="builder-media-readout">Position ${item.media.x}%, ${item.media.y}% · Zoom ${Math.round(item.media.scale * 100)}%</p>
        </div>
      </section>

      <section class="builder-editor-section">
        <h3>Destinations and Labels</h3>
        ${isReporterTools ? `
          <p class="builder-context-note">
            This builder edits the Reporter Tools <strong>tutorial index only</strong>.
            The finished six-tool page is protected by its separate <code>site-lib/reporter-tools.json</code> catalog.
          </p>
        ` : ""}
        <div class="builder-field-grid">
          <label class="builder-field builder-field--full">
            <span>Demo HTML / public URL (optional)</span>
            <input data-item-field="demoUrl" value="${esc(item.demoUrl)}" placeholder="${isReporterTools ? "Leave blank for a normal tutorial" : "/learn/demos/tool-name.html"}">
          </label>
          <label class="builder-field builder-field--full">
            <span>Tutorial HTML / public URL</span>
            <input data-item-field="tutorialUrl" value="${esc(item.tutorialUrl)}" placeholder="/learn/section/tutorial-name/">
          </label>
          <label class="builder-field">
            <span>Quick-link button label</span>
            <input data-item-field="quickLinkLabel" value="${esc(item.quickLinkLabel)}" placeholder="Open Tool">
          </label>
          <label class="builder-field">
            <span>Quick-link destination</span>
            <input data-item-field="quickLinkUrl" value="${esc(item.quickLinkUrl)}" placeholder="Tool or setup URL">
          </label>
          <label class="builder-field">
            <span>Access</span>
            <select data-item-field="access">
              ${mediaOption("n/a", "N/A — hide label", item.access)}
              ${mediaOption("paid", "Paid", item.access)}
              ${mediaOption("free", "Free", item.access)}
            </select>
          </label>
          <label class="builder-field">
            <span>Card/modal accent</span>
            <input data-item-field="accent" type="color" value="${esc(item.accent || catalog.accent)}">
          </label>
          <label class="builder-toggle">
            <input data-item-field="comingSoon" type="checkbox" ${item.comingSoon ? "checked" : ""}>
            <span>Coming Soon</span>
          </label>
        </div>
      </section>

      <div class="builder-action-row">
        <button class="builder-button" type="button" data-action="move-up" ${activeIndex === 0 ? "disabled" : ""}>Move Up</button>
        <button class="builder-button" type="button" data-action="move-down" ${activeIndex >= catalog.items.length - 1 ? "disabled" : ""}>Move Down</button>
        <button class="builder-button" type="button" data-action="duplicate">Duplicate</button>
        <button class="builder-button builder-button--danger" type="button" data-action="delete">Delete</button>
      </div>`;
  }

  function ensureModal() {
    if (!modalApi) modalApi = window.LearnIndex.createModal(document.body, catalog);
    modalApi.updateCatalog(catalog);
  }

  function itemForModalPreview(item) {
    if (catalog.section !== "reporter-tools") return item;
    // The demo is the modal itself on Reporter Tools. Its actions are Tutorial
    // and the direct Tool/Customizer/Setup link, so do not show a circular
    // "See Demo" destination inside this builder preview.
    return { ...item, demoUrl: "" };
  }

  function openModalPreview(item, trigger) {
    ensureModal();
    modalApi.open(itemForModalPreview(item), trigger);
  }

  function renderPreview() {
    preview.replaceChildren();
    const item = currentItem();
    const isReporterTools = catalog.section === "reporter-tools";
    previewModalButton.disabled = !item;
    previewModalButton.textContent = isReporterTools ? "Preview Tutorial Modal" : "Preview Modal";
    previewNote.textContent = isReporterTools
      ? "This previews the tutorial card/modal from the tutorial index. It does not edit the finished six-tool page."
      : "The preview uses the same card and modal renderer as the published Learn section.";
    if (!item) {
      const message = document.createElement("p");
      message.className = "builder-empty";
      message.textContent = "Select an item to preview it.";
      preview.append(message);
      return;
    }
    ensureModal();
    const card = window.LearnIndex.createCard(item, activeIndex, catalog, (selected, trigger) => {
      openModalPreview(selected, trigger);
    });
    preview.append(card);
  }

  function renderAll() {
    renderCatalogMeta();
    renderItemList();
    renderEditor();
    renderPreview();
  }

  async function loadSection(section) {
    const config = SECTION_CONFIG[section];
    if (!config) return;
    fileHandle = null;
    setStatus(`Loading ${config.label}…`);
    try {
      const response = await fetch(config.catalogUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Catalog ${response.status}`);
      catalog = normalizeForEdit(await response.json());
      activeIndex = catalog.items.length ? 0 : -1;
      dirty = false;
      renderAll();
      setStatus(`${config.label} loaded. Connect its JSON file before saving changes.`, "success");
    } catch (error) {
      catalog = normalizeForEdit(defaultCatalog(section));
      activeIndex = -1;
      dirty = false;
      renderAll();
      setStatus(`Could not fetch this catalog. Connect its index-items.json file to continue.`, "error");
    }
  }

  function applyCatalogField(target) {
    const key = target.dataset.catalogField;
    if (!key) return;
    catalog[key] = target.value;
    if (key === "accent") document.documentElement.style.setProperty("--section-accent", target.value);
    markDirty();
    renderPreview();
  }

  function applyItemField(target) {
    const item = currentItem();
    const key = target.dataset.itemField;
    if (!item || !key) return;
    if (target.type === "checkbox") item[key] = target.checked;
    else if (target.type === "number") item[key] = Number(target.value) || 0;
    else item[key] = target.value;
    if (key === "quickLinkUrl") {
      item.goToTool = Boolean(item.quickLinkUrl);
      item.toolUrl = item.quickLinkUrl;
    }
    markDirty();
    renderItemList();
    renderPreview();
  }

  function applyMediaField(target) {
    const item = currentItem();
    const key = target.dataset.mediaField;
    if (!item || !key) return;
    item.media[key] = target.value;
    markDirty();
    renderPreview();
  }

  function applyBulletField(target) {
    const item = currentItem();
    const index = Number(target.dataset.bulletIndex);
    if (!item || !Number.isInteger(index) || !item.bullets[index] && item.bullets[index] !== "") return;
    item.bullets[index] = target.value;
    markDirty();
    renderPreview();
  }

  function normalizeOrders() {
    catalog.items.forEach((item, index) => {
      item.order = (index + 1) * 10;
    });
  }

  function moveItem(direction) {
    const destination = activeIndex + direction;
    if (destination < 0 || destination >= catalog.items.length) return;
    [catalog.items[activeIndex], catalog.items[destination]] = [catalog.items[destination], catalog.items[activeIndex]];
    activeIndex = destination;
    normalizeOrders();
    markDirty();
    renderAll();
  }

  function handleEditorAction(action) {
    const item = currentItem();
    if (!item && action !== "add-bullet") return;
    if (action === "add-bullet") {
      item.bullets.push("");
      markDirty();
      renderEditor();
      return;
    }
    if (action === "move-up") return moveItem(-1);
    if (action === "move-down") return moveItem(1);
    if (action === "duplicate") {
      const copy = clone(item);
      copy.id = uniqueId(`${item.id}-copy`);
      copy.title = `${item.title} Copy`;
      catalog.items.splice(activeIndex + 1, 0, copy);
      activeIndex += 1;
      normalizeOrders();
      markDirty();
      renderAll();
      return;
    }
    if (action === "delete") {
      if (!window.confirm(`Delete “${item.title}” from this catalog?`)) return;
      catalog.items.splice(activeIndex, 1);
      activeIndex = Math.min(activeIndex, catalog.items.length - 1);
      normalizeOrders();
      markDirty();
      renderAll();
    }
  }

  function adjustMedia(control) {
    const item = currentItem();
    if (!item) return;
    const media = item.media;
    const nudge = 1;
    const zoom = 0.05;
    if (["match", "contain", "cover"].includes(control)) {
      media.fit = control;
      if (control === "match") Object.assign(media, { x: 0, y: 0, scale: 1 });
    }
    if (control === "up") media.y = window.LearnIndex.clamp(media.y - nudge, -40, 40);
    if (control === "down") media.y = window.LearnIndex.clamp(media.y + nudge, -40, 40);
    if (control === "left") media.x = window.LearnIndex.clamp(media.x - nudge, -40, 40);
    if (control === "right") media.x = window.LearnIndex.clamp(media.x + nudge, -40, 40);
    if (control === "zoom-in") media.scale = window.LearnIndex.clamp(media.scale + zoom, 0.5, 3);
    if (control === "zoom-out") media.scale = window.LearnIndex.clamp(media.scale - zoom, 0.5, 3);
    if (control === "reset") Object.assign(media, { fit: "contain", x: 0, y: 0, scale: 1 });
    media.scale = Math.round(media.scale * 100) / 100;
    markDirty();
    renderEditor();
    renderPreview();
  }

  function addBlankItem() {
    catalog.items.push(blankItem());
    activeIndex = catalog.items.length - 1;
    markDirty("New blank item added.");
    renderAll();
  }

  function computedTutorialUrl(meta, section, slug) {
    const direct = text(meta?.publicUrl).trim();
    if (direct) return direct;
    const rawSectionSlug = window.LearnIndex.slugify(section);
    const sectionSlug = rawSectionSlug === "reporter-tools" ? "sidekicks" : rawSectionSlug;
    const tutorialSlug = window.LearnIndex.slugify(slug);
    if (!sectionSlug || !tutorialSlug) return "";
    return `https://magichashtags.com/learn/${sectionSlug}/${tutorialSlug}/`;
  }

  async function importTutorialFile(file) {
    const contents = await file.text();
    const documentNode = new DOMParser().parseFromString(contents, "text/html");
    const stateNode = documentNode.querySelector("#project-state");
    if (!stateNode) throw new Error("This HTML file does not contain Tutorial Builder metadata.");
    const project = JSON.parse(stateNode.textContent);
    const meta = project.meta || {};
    const tutorial = project.tutorial || {};
    const cover = Array.isArray(tutorial.slides) ? tutorial.slides[0] || {} : {};
    const selectedSection = sectionSelect.value;
    const importedSection = window.LearnIndex.slugify(meta.section) === "sidekicks"
      ? "reporter-tools"
      : window.LearnIndex.slugify(meta.section);
    const title = text(meta.cardTitle || tutorial.title || cover.title || file.name.replace(/\.html?$/i, "")).trim();
    const summary = text(meta.summary || cover.description).trim();
    const modalDescription = text(meta.modalDescription || summary || cover.description).trim();
    const slug = text(meta.tutorialSlug || title).trim();
    const importedMedia = window.LearnIndex.normalizeMedia(cover.media || {});
    importedMedia.alt = text(meta.socialImageAlt || importedMedia.alt || `${title} tutorial preview`).trim();

    const pageUrl = computedTutorialUrl(meta, importedSection || selectedSection, slug);
    const baseId = window.LearnIndex.slugify(slug || title) || `item-${Date.now()}`;
    const comparablePageUrl = text(pageUrl).replace(/\/+$/, "");
    const existingIndex = catalog.items.findIndex((existingItem) => {
      const existingUrls = [existingItem.tutorialUrl, existingItem.demoUrl]
        .map((url) => text(url).replace(/\/+$/, ""))
        .filter(Boolean);
      return existingItem.id === baseId || (comparablePageUrl && existingUrls.includes(comparablePageUrl));
    });
    const existingItem = existingIndex >= 0 ? catalog.items[existingIndex] : null;
    const pageType = text(meta.pageType).trim().toLowerCase() === "demo" ? "demo" : "tutorial";
    const primaryLabel = text(meta.primaryActionLabel).trim();
    const primaryUrl = text(meta.primaryActionUrl).trim();
    const item = {
      id: existingItem?.id || uniqueId(baseId),
      order: existingItem?.order || nextOrder(),
      group: text(meta.group).trim() || existingItem?.group || "",
      title: title || "Imported Tutorial",
      bullets: summary ? [summary] : [],
      description: modalDescription,
      media: importedMedia,
      demoUrl: pageType === "demo" ? pageUrl : "",
      tutorialUrl: pageType === "tutorial" ? pageUrl : (/tutorial/i.test(primaryLabel) ? primaryUrl : ""),
      goToTool: pageType === "tutorial" && Boolean(primaryUrl),
      toolUrl: pageType === "tutorial" ? primaryUrl : "",
      quickLinkLabel: pageType === "tutorial" ? (primaryLabel || "Open Tool") : "",
      quickLinkUrl: pageType === "tutorial" ? primaryUrl : "",
      access: "n/a",
      comingSoon: false,
      accent: existingItem?.accent || catalog.accent
    };
    if (existingItem) {
      catalog.items[existingIndex] = {
        ...existingItem,
        ...item,
        legacyKey: existingItem.legacyKey || "",
        demoUrl: item.demoUrl || existingItem.demoUrl || "",
        toolUrl: item.toolUrl || existingItem.toolUrl || "",
        quickLinkLabel: item.quickLinkLabel || existingItem.quickLinkLabel || "",
        quickLinkUrl: item.quickLinkUrl || existingItem.quickLinkUrl || "",
        access: existingItem.access || item.access
      };
      activeIndex = existingIndex;
    } else {
      catalog.items.push(item);
      activeIndex = catalog.items.length - 1;
    }
    markDirty();
    renderAll();
    const mismatch = importedSection && importedSection !== selectedSection;
    setStatus(
      mismatch
        ? `Imported “${item.title}.” Its metadata says “${importedSection}”; you are editing “${selectedSection}.” Review before saving.`
        : `${existingItem ? "Updated" : "Imported"} “${item.title}.” Review the index-specific fields, then save the catalog.`,
      mismatch ? "error" : "success"
    );
  }

  function loadCatalogObject(value, handle = null) {
    catalog = normalizeForEdit(value);
    fileHandle = handle;
    if (SECTION_CONFIG[catalog.section]) sectionSelect.value = catalog.section;
    activeIndex = catalog.items.length ? 0 : -1;
    dirty = false;
    renderAll();
    setStatus(`${catalog.title} catalog connected.`, "success");
  }

  async function connectCatalog() {
    if (!window.showOpenFilePicker) {
      catalogFileInput.value = "";
      catalogFileInput.click();
      return;
    }
    const handles = await window.showOpenFilePicker({
      multiple: false,
      types: [{
        description: "Learn index catalog",
        accept: { "application/json": [".json"] }
      }]
    });
    const handle = handles[0];
    const file = await handle.getFile();
    loadCatalogObject(JSON.parse(await file.text()), handle);
  }

  function catalogJson() {
    normalizeOrders();
    const clean = normalizeForEdit(catalog);
    return `${JSON.stringify(clean, null, 2)}\n`;
  }

  function downloadCatalog(value = catalogJson()) {
    const url = URL.createObjectURL(new Blob([value], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "index-items.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Catalog JSON downloaded. Replace the section’s index-items.json with this file.", "success");
  }

  async function saveCatalog() {
    const value = catalogJson();
    if (!fileHandle && window.showSaveFilePicker) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: "index-items.json",
        types: [{
          description: "Learn index catalog",
          accept: { "application/json": [".json"] }
        }]
      });
    }
    if (!fileHandle) {
      downloadCatalog(value);
      return;
    }
    const writable = await fileHandle.createWritable();
    await writable.write(value);
    await writable.close();
    dirty = false;
    setStatus("Catalog saved. Commit and push this JSON file with the tutorial page.", "success");
  }

  function populateSections() {
    sectionSelect.innerHTML = Object.entries(SECTION_CONFIG)
      .map(([value, config]) => `<option value="${esc(value)}">${esc(config.label)}</option>`)
      .join("");
  }

  itemList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-item]");
    if (!button) return;
    activeIndex = Number(button.dataset.selectItem);
    renderItemList();
    renderEditor();
    renderPreview();
  });

  catalogMeta.addEventListener("input", (event) => applyCatalogField(event.target));
  catalogMeta.addEventListener("change", (event) => applyCatalogField(event.target));

  editor.addEventListener("input", (event) => {
    if (event.target.matches("[data-item-field]")) applyItemField(event.target);
    if (event.target.matches("[data-media-field]")) applyMediaField(event.target);
    if (event.target.matches("[data-bullet-index]")) applyBulletField(event.target);
  });
  editor.addEventListener("change", (event) => {
    if (event.target.matches("[data-item-field]")) applyItemField(event.target);
    if (event.target.matches("[data-media-field]")) applyMediaField(event.target);
  });
  editor.addEventListener("click", (event) => {
    const removeBullet = event.target.closest("[data-remove-bullet]");
    if (removeBullet) {
      const item = currentItem();
      item.bullets.splice(Number(removeBullet.dataset.removeBullet), 1);
      markDirty();
      renderEditor();
      renderPreview();
      return;
    }
    const mediaControl = event.target.closest("[data-media-control]");
    if (mediaControl) {
      adjustMedia(mediaControl.dataset.mediaControl);
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) handleEditorAction(action.dataset.action);
  });

  $("#loadSection").addEventListener("click", () => {
    if (dirty && !window.confirm("Load another catalog and discard unsaved changes?")) return;
    loadSection(sectionSelect.value);
  });
  $("#connectCatalog").addEventListener("click", () => connectCatalog().catch((error) => setStatus(error.message, "error")));
  $("#addBlank").addEventListener("click", addBlankItem);
  $("#importTutorial").addEventListener("click", () => {
    tutorialFileInput.value = "";
    tutorialFileInput.click();
  });
  $("#saveCatalog").addEventListener("click", () => saveCatalog().catch((error) => setStatus(error.message, "error")));
  $("#downloadCatalog").addEventListener("click", () => downloadCatalog());
  previewModalButton.addEventListener("click", () => {
    const item = currentItem();
    if (!item) return;
    openModalPreview(item, previewModalButton);
  });

  tutorialFileInput.addEventListener("change", () => {
    const file = tutorialFileInput.files?.[0];
    if (file) importTutorialFile(file).catch((error) => setStatus(error.message, "error"));
  });
  catalogFileInput.addEventListener("change", async () => {
    const file = catalogFileInput.files?.[0];
    if (!file) return;
    try {
      loadCatalogObject(JSON.parse(await file.text()));
      setStatus("Catalog loaded. This browser will download JSON when you save.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  populateSections();
  loadSection(sectionSelect.value);
}());
