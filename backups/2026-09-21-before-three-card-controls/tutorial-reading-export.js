/* PNG/PDF-only page layout. It runs in an isolated player snapshot, not the editor. */
(() => {
  "use strict";
  const PAGE_WIDTH = 1584;
  const PAGE_HEIGHT = 1224;
  const OUTPUT_WIDTH = 3300; // Landscape US Letter at 300 dpi.
  const MAX_PAGES = 100;
  const CSS_TEXT = `
    html, body[data-reading-export="true"] { margin:0!important; padding:0!important; width:1584px!important; background:white!important; overflow:visible!important; }
    body[data-reading-export="true"] #app { display:block!important; width:1584px!important; max-width:none!important; margin:0!important; padding:0!important; }
    .reading-page { box-sizing:border-box; width:1584px; height:1224px; padding:58px 64px 40px; display:grid; grid-template-rows:auto minmax(0,1fr) 34px; gap:28px; background:#fff; color:#18151b; font-family:var(--sans); overflow:hidden; }
    .reading-header { display:grid; gap:10px; border-bottom:4px solid #18151b; padding:0 0 20px; }
    .reading-eyebrow { display:flex; justify-content:space-between; gap:32px; font-size:19px; line-height:1.35; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
    .reading-eyebrow span:first-child { color:#9b146f; }
    .reading-heading { margin:0; font-size:38px; line-height:1.2; font-weight:750; overflow-wrap:anywhere; }
    .reading-main { min-height:0; display:grid; grid-template-columns:minmax(0, 1.58fr) minmax(0,1fr); gap:36px; align-items:stretch; }
    .reading-main.is-image-only { grid-template-columns:minmax(0,1fr); }
    .reading-picture { margin:0; min-width:0; min-height:0; display:grid; grid-template-rows:minmax(0,1fr) 28px; gap:12px; }
    .reading-picture-window { position:relative; min-height:0; overflow:hidden; background:#fff; }
    .reading-picture-caption { font-size:18px; line-height:1.3; color:#625b66; }
    .reading-scene { position:absolute; left:0; top:0; transform-origin:0 0; }
    .reading-scene .stage-wrap { display:block!important; padding:0!important; width:1500px!important; background:none!important; }
    .reading-scene .stage:not(.magnifier-scene) { position:relative!important; width:1500px!important; min-height:0!important; max-height:none!important; aspect-ratio:auto!important; transform:none!important; box-shadow:none!important; }
    .reading-scene .stage-object { animation:none!important; }
    .reading-page *, .reading-page *::before, .reading-page *::after { animation:none!important; transition:none!important; scrollbar-width:none!important; }
    .reading-page ::-webkit-scrollbar { display:none!important; }
    .reading-page [data-builder-only], .reading-page .body-format-bar, .reading-page .card-top-drag-handle, .reading-page .scroll-slide-caret, .reading-page .main-video-controls { display:none!important; }
    .reading-cards { min-width:0; min-height:0; display:flex; flex-direction:column; align-items:stretch; gap:20px; }
    .reading-card { flex:0 0 auto; border:2px solid #29212d; border-radius:12px; background:#fff; overflow:hidden; }
    .reading-card-header { display:flex; align-items:flex-start; gap:14px; padding:16px 20px; background:var(--reading-color); color:var(--reading-ink); }
    .reading-card-number { flex:0 0 34px; height:34px; border:2px solid currentColor; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; line-height:1; font-weight:750; }
    .reading-card-heading { min-width:0; margin:0; font-size:28px; line-height:1.3; font-weight:750; overflow-wrap:anywhere; }
    .reading-card-heading small { display:block; margin-top:4px; font-size:18px; font-weight:500; }
    .reading-card-body { padding:18px 22px 22px; font-size:26px; line-height:var(--text-line-height,1.55); letter-spacing:var(--text-letter-spacing,0px); overflow-wrap:anywhere; }
    .reading-card-body:empty { display:none; }
    .reading-card-body > .mixed-body-line { margin:0; }
    .reading-card-body > .mixed-body-line + .mixed-body-line { margin-top:10px; }
    .reading-card-body > .is-numbered { padding-left:38px; }
    .reading-card-body > .is-numbered::before { min-width:30px; }
    .reading-card-body > .is-pipe { padding-left:20px; }
    .reading-line-continuation::before { display:none!important; }
    .reading-footer { border-top:1px solid #d8d2dc; padding-top:12px; display:flex; justify-content:space-between; gap:32px; font-size:17px; line-height:1.2; color:#625b66; }
    @page { size: letter landscape; margin:0; }
    @media print {
      html, body[data-reading-export="true"], body[data-reading-export="true"] #app { width:1056px!important; height:auto!important; overflow:visible!important; }
      body[data-reading-export="true"] > :not(#app) { display:none!important; }
      .reading-page { zoom:0.6666666667; break-inside:avoid; break-after:page; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
      .reading-page:last-child { break-after:auto; }
    }
  `;

  function contentRange(node, start, end) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    const range = document.createRange();
    range.selectNodeContents(node);
    const boundary = (offset, isEnd) => {
      for (const text of texts) {
        if (offset <= text.length) { range[isEnd ? "setEnd" : "setStart"](text, offset); return; }
        offset -= text.length;
      }
    };
    boundary(start, false);
    boundary(end, true);
    let fragment = range.cloneContents();
    // cloneContents omits the common ancestor itself. Keep its style wrappers
    // when a page break falls entirely inside one colored/bold/underlined span.
    let ancestor = range.commonAncestorContainer;
    if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
    while (ancestor && ancestor !== node) {
      const wrapper = ancestor.cloneNode(false);
      wrapper.append(fragment);
      fragment = document.createDocumentFragment();
      fragment.append(wrapper);
      ancestor = ancestor.parentNode;
    }
    return fragment;
  }

  // Split only an overlong paragraph, preserving its styled spans and every
  // character. Ordinary cards and ordinary paragraphs stay together.
  function splitLineToFit(line, fits) {
    const original = line.cloneNode(true);
    const text = original.textContent;
    if (!text.length) return null;
    const setPrefix = end => line.replaceChildren(contentRange(original, 0, end));
    let low = 0, high = text.length;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      setPrefix(middle);
      if (fits()) low = middle; else high = middle - 1;
    }
    if (!low) { line.replaceChildren(...original.childNodes); return null; }
    let cut = low;
    // Prefer a word boundary; never split a UTF-16 surrogate pair.
    const wordEnd = text.slice(0, low).search(/\s+\S*$/);
    if (wordEnd > 0) cut = wordEnd + text.slice(wordEnd, low).match(/^\s*/)[0].length;
    if (cut > 0 && /[\uD800-\uDBFF]/.test(text[cut - 1])) cut--;
    if (!cut) { line.replaceChildren(...original.childNodes); return null; }
    setPrefix(cut);
    const rest = original.cloneNode(false);
    rest.classList.add("reading-line-continuation");
    rest.append(contentRange(original, cut, text.length));
    return rest;
  }

  async function prepare(options) {
    const { root, slides, title, escape, renderScene, sceneBounds, sceneHeight, renderTitle,
      renderBody, colors, prepareAssets, updateGeometry } = options;
    const style = document.createElement("style");
    style.textContent = CSS_TEXT;
    document.head.append(style);
    root.replaceChildren();
    const pages = [];

    for (let slideIndex = 0; slideIndex < slides.length; slideIndex++) {
      const slide = slides[slideIndex];
      const sectionPages = [];
      const hasNotes = Boolean(slide.description?.trim());
      const hasCards = slide.hotspots.length > 0 || hasNotes;
      const newPage = () => {
        if (pages.length >= MAX_PAGES) throw new Error("This reading guide exceeds 100 pages. Export a smaller tutorial.");
        const page = document.createElement("section");
        page.className = "reading-page";
        page.dataset.slideIndex = slideIndex;
        page.innerHTML = `<header class="reading-header"><div class="reading-eyebrow"><span>Magic Hashtags / Tutorial</span><span>Slide ${slideIndex + 1} of ${slides.length}</span></div><h1 class="reading-heading">${escape(slide.title || title || "Tutorial")}</h1></header>
          <main class="reading-main${hasCards ? "" : " is-image-only"}"><figure class="reading-picture"><div class="reading-picture-window"></div><figcaption class="reading-picture-caption"></figcaption></figure>${hasCards ? '<div class="reading-cards"></div>' : ""}</main>
          <footer class="reading-footer"><span>${escape(title || "Tutorial")}</span><span data-reading-page-number></span></footer>`;
        root.append(page);
        if (page.querySelector(".reading-main").clientHeight < 300) throw new Error(`Slide ${slideIndex + 1}'s title is too long for a reading-guide page.`);
        pages.push(page);
        sectionPages.push(page);
        return page;
      };
      let page = newPage();
      let column = page.querySelector(".reading-cards");
      const fits = () => column.scrollHeight <= column.clientHeight + 1;
      const nextColumn = () => { page = newPage(); column = page.querySelector(".reading-cards"); };
      const entries = [
        ...(hasNotes ? [{ title: "About this slide", body: slide.description, item: slide, field: "description", index: -1 }] : []),
        ...slide.hotspots.map((item, index) => ({ title: item.title, body: item.body, item, field: "body", index }))
      ];
      for (const entry of entries) {
        const { item, index, field } = entry;
        const color = index >= 0 ? colors(index) : { color: "#eee8f4", ink: "#18151b" };
        const makeCard = continued => {
          const card = document.createElement("article");
          card.className = "reading-card";
          card.dataset.readingHotspot = index >= 0 ? item.id : "slide-description";
          card.style.cssText = `--reading-color:${color.color};--reading-ink:${color.ink};text-align:${item.textAlign === "center" ? "center" : "left"};--text-letter-spacing:${Number(item.textLetterSpacing) || 0}px;--text-line-height:${Number(item.textLineHeight) || 1.55}`;
          card.innerHTML = `<header class="reading-card-header">${index >= 0 ? `<span class="reading-card-number">${index + 1}</span>` : ""}<h2 class="reading-card-heading">${index >= 0 ? renderTitle(item, "title") || `Hotspot ${index + 1}` : escape(entry.title)}${continued ? '<small>Continued</small>' : ""}</h2></header><div class="reading-card-body"></div>`;
          return card;
        };
        let card = makeCard(false);
        let body = card.querySelector(".reading-card-body");
        body.innerHTML = entry.body?.trim() ? renderBody(item, field, entry.body) : "";
        column.append(card);
        if (fits()) continue;
        // First try an intact card on the next page, before splitting it.
        if (column.children.length > 1) { card.remove(); nextColumn(); column.append(card); }
        if (fits()) continue;
        const lines = [...body.children];
        body.replaceChildren();
        if (!fits()) throw new Error(`Hotspot ${index + 1}'s title is too long for a reading-guide page.`);
        const continueCard = () => {
          nextColumn(); card = makeCard(true); body = card.querySelector(".reading-card-body"); column.append(card);
        };
        while (lines.length) {
          const line = lines.shift();
          body.append(line);
          if (fits()) continue;
          if (body.children.length > 1) { line.remove(); lines.unshift(line); continueCard(); continue; }
          const rest = splitLineToFit(line, fits);
          if (!rest) throw new Error(`A line in hotspot ${index + 1} cannot fit on the page. Reduce its line spacing.`);
          lines.unshift(rest);
          continueCard();
        }
      }

      // Render the authored composition once at design size. Only its enclosing
      // print frame scales/slices it; marker coordinates are never rewritten.
      const scene = document.createElement("div");
      scene.className = "reading-scene";
      scene.innerHTML = renderScene(slideIndex);
      const firstWindow = sectionPages[0].querySelector(".reading-picture-window");
      firstWindow.append(scene);
      const stage = scene.querySelector("[data-stage]");
      stage.style.height = `${sceneHeight(slide)}px`;
      await prepareAssets(scene);
      let bounds = sceneBounds(slide);
      if (slide.kind === "scroll") {
        const viewport = scene.querySelector("[data-scroll-slide]");
        const content = viewport?.querySelector(".scroll-slide-content");
        if (viewport && content) {
          const height = Math.max(content.scrollHeight, viewport.scrollHeight, viewport.clientHeight);
          viewport.style.height = `${height}px`;
          viewport.style.bottom = "auto";
          viewport.style.overflow = "visible";
          bounds = { ...bounds, bottom: Math.max(bounds.bottom, viewport.offsetTop + height) };
        }
      }
      const width = bounds.right - bounds.left;
      const height = bounds.bottom - bounds.top;
      const scale = firstWindow.clientWidth / width;
      const sliceHeight = firstWindow.clientHeight;
      const slices = Math.max(1, Math.ceil(height * scale / sliceHeight));
      while (sectionPages.length < slices) newPage();
      sectionPages.forEach((sectionPage, partIndex) => {
        const picture = sectionPage.querySelector(".reading-picture-window");
        const copy = partIndex === 0 ? scene : scene.cloneNode(true);
        const part = Math.min(partIndex, slices - 1);
        copy.style.transform = `translate(${-bounds.left * scale}px,${-bounds.top * scale - part * sliceHeight}px) scale(${scale})`;
        picture.append(copy);
        sectionPage.querySelector(".reading-picture-caption").textContent = slices > 1
          ? `Image section ${part + 1} of ${slices} / markers remain in their placed positions`
          : slide.hotspots.length ? "Match the numbered markers to the cards." : "";
      });
    }
    pages.forEach((page, index) => { page.querySelector("[data-reading-page-number]").textContent = `${index + 1} / ${pages.length}`; });
    await updateGeometry();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { pages, width: PAGE_WIDTH, height: PAGE_HEIGHT, outputWidth: OUTPUT_WIDTH };
  }

  window.MHReadingExport = Object.freeze({ prepare, PAGE_WIDTH, PAGE_HEIGHT, OUTPUT_WIDTH });
})();
