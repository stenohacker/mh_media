(function () {
  "use strict";

  const DEFAULT_ACCENT = "#24a094";
  const ACCESS_COLORS = Object.freeze({
    paid: "#FB71DE",
    free: "#19BEAE"
  });

  const text = (value) => String(value == null ? "" : value);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function initializeSharedTopicHeader() {
    const header = document.querySelector(".learn-site-header");
    const inner = header?.querySelector(".learn-site-header__inner");
    const nav = header?.querySelector(".learn-site-nav");
    const home = header?.querySelector(".learn-site-logo");
    if (!header || !inner || !nav || !home) return;

    nav.classList.add("site-desktop-nav");

    let contact = inner.querySelector(".learn-site-contact");
    if (!contact) {
      const contactUrl = new URL(home.href, location.href);
      contactUrl.hash = "contact";
      contact = document.createElement("a");
      contact.className = "site-header-contact learn-site-contact";
      contact.href = contactUrl.href;
      contact.textContent = "Contact";
      inner.append(contact);
    }

    let toggle = inner.querySelector("[data-mobile-nav-toggle]");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "learn-site-menu-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("data-mobile-nav-toggle", "");
      toggle.innerHTML = "<span></span><span></span><span></span>";
      inner.append(toggle);
    }

    let panel = inner.querySelector("[data-mobile-nav-panel]");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "learn-site-mobile-panel";
      panel.setAttribute("data-mobile-nav-panel", "");
      panel.hidden = true;
      nav.querySelectorAll(":scope > a").forEach((source) => {
        const link = source.cloneNode(true);
        link.removeAttribute("class");
        panel.append(link);
      });
      const mobileContact = contact.cloneNode(true);
      mobileContact.removeAttribute("class");
      mobileContact.setAttribute("data-open-contact", "");
      panel.append(mobileContact);
      inner.append(panel);
    }

    const close = () => {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const opening = panel.hidden;
      panel.hidden = !opening;
      toggle.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    panel.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("click", (event) => {
      if (panel.hidden || event.target.closest(".learn-site-header__inner")) return;
      close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function slugify(value) {
    return text(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function safeUrl(value) {
    const raw = text(value).trim();
    if (!raw || /^(?:javascript|data):/i.test(raw)) return "";
    return raw;
  }

  function normalizeMedia(value) {
    const media = value && typeof value === "object" ? value : {};
    const type = ["image", "gif", "video"].includes(media.type) ? media.type : "image";
    const fit = ["match", "contain", "cover"].includes(media.fit) ? media.fit : "contain";
    return {
      type,
      url: text(media.url).trim(),
      alt: text(media.alt).trim(),
      fit,
      matte: text(media.matte).trim() || "#ffffff",
      x: clamp(media.x, -40, 40),
      y: clamp(media.y, -40, 40),
      scale: clamp(media.scale || 1, 0.5, 3)
    };
  }

  function normalizeItem(value, index) {
    const item = value && typeof value === "object" ? value : {};
    const title = text(item.title).trim() || "Untitled";
    const access = ["paid", "free"].includes(text(item.access).toLowerCase())
      ? text(item.access).toLowerCase()
      : "n/a";
    const bullets = Array.isArray(item.bullets)
      ? item.bullets.map((bullet) => text(bullet).trim()).filter(Boolean)
      : [];
    return {
      id: text(item.id).trim() || slugify(title) || `item-${index + 1}`,
      legacyKey: text(item.legacyKey).trim(),
      order: Number(item.order) || (index + 1) * 10,
      group: text(item.group).trim(),
      title,
      bullets,
      description: text(item.description).trim(),
      media: normalizeMedia(item.media),
      modalVideoUrl: safeUrl(item.modalVideoUrl),
      modalVideoFallbackUrl: safeUrl(item.modalVideoFallbackUrl),
      demoUrl: safeUrl(item.demoUrl),
      tutorialUrl: safeUrl(item.tutorialUrl),
      goToTool: Boolean(item.goToTool),
      toolUrl: safeUrl(item.toolUrl),
      quickLinkLabel: text(item.quickLinkLabel).trim() || "Open Tool",
      quickLinkUrl: safeUrl(item.quickLinkUrl || item.toolUrl),
      access,
      comingSoon: Boolean(item.comingSoon),
      accent: text(item.accent).trim()
    };
  }

  function normalizeCatalog(value) {
    const catalog = value && typeof value === "object" ? value : {};
    const quickLinks = (Array.isArray(catalog.quickLinks) ? catalog.quickLinks : [])
      .map((item, index) => ({
        id: text(item?.id).trim() || `quick-link-${index + 1}`,
        order: Number(item?.order) || (index + 1) * 10,
        title: text(item?.title).trim(),
        description: text(item?.description).trim(),
        label: text(item?.label).trim() || "Open",
        url: safeUrl(item?.url),
        color: text(item?.color).trim() || DEFAULT_ACCENT
      }))
      .filter((item) => item.title && item.url)
      .sort((a, b) => a.order - b.order);
    return {
      version: Number(catalog.version) || 1,
      section: text(catalog.section).trim(),
      eyebrow: text(catalog.eyebrow).trim() || "Learn",
      title: text(catalog.title).trim() || "Learn",
      intro: text(catalog.intro).trim(),
      accent: text(catalog.accent).trim() || DEFAULT_ACCENT,
      comingSoonImage: safeUrl(catalog.comingSoonImage),
      quickLinks,
      items: (Array.isArray(catalog.items) ? catalog.items : [])
        .map(normalizeItem)
        .sort((a, b) => a.order - b.order)
    };
  }

  function createBadge(label, color, className) {
    const badge = document.createElement("span");
    badge.className = className || "learn-access-badge";
    badge.textContent = label;
    if (color) badge.style.setProperty("--badge-color", color);
    return badge;
  }

  function accessBadge(item) {
    if (!ACCESS_COLORS[item.access]) return null;
    const label = item.access === "paid" ? "Paid" : "Free";
    return createBadge(label, ACCESS_COLORS[item.access]);
  }

  function createCard(itemValue, index, catalogValue, onOpen) {
    const item = normalizeItem(itemValue, index);
    const catalog = normalizeCatalog(catalogValue);
    const card = document.createElement("article");
    card.className = "learn-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `Preview ${item.title}`);
    card.dataset.learnItem = item.id;
    card.style.setProperty("--item-accent", item.accent || catalog.accent);

    const top = document.createElement("div");
    top.className = "learn-card__top";
    const number = document.createElement("span");
    number.className = "learn-card__number";
    number.textContent = String(index + 1).padStart(2, "0");
    top.append(number);
    if (item.comingSoon) {
      top.append(createBadge("Coming Soon", "", "learn-coming-badge"));
    } else {
      const badge = accessBadge(item);
      if (badge) top.append(badge);
    }

    const heading = document.createElement("h2");
    heading.textContent = item.title;

    const bullets = document.createElement("ul");
    bullets.className = "learn-card__bullets";
    const bulletValues = item.bullets.length ? item.bullets : ["Open this item to see details."];
    bulletValues.slice(0, 4).forEach((value) => {
      const bullet = document.createElement("li");
      bullet.textContent = value;
      bullets.append(bullet);
    });

    const cta = document.createElement("span");
    cta.className = "learn-card__button";
    cta.textContent = item.comingSoon ? "Preview Coming Soon" : "See More";

    card.append(top, heading, bullets, cta);
    const open = () => {
      if (typeof onOpen === "function") onOpen(item, card);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open();
    });
    return card;
  }

  function createModal(host, catalogValue) {
    let catalog = normalizeCatalog(catalogValue);
    const modal = document.createElement("section");
    modal.className = "learn-modal";
    modal.dataset.open = "false";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="learn-modal__overlay" data-learn-modal-overlay></div>
      <div class="learn-modal__panel" data-learn-modal-panel role="dialog" aria-modal="true" aria-labelledby="learn-modal-title">
        <button class="learn-modal__close" type="button" data-learn-modal-close aria-label="Close">×</button>
        <div class="learn-modal__media" data-learn-modal-media></div>
        <div class="learn-modal__body">
          <div class="learn-modal__meta" data-learn-modal-meta></div>
          <h2 class="learn-modal__title" id="learn-modal-title" data-learn-modal-title></h2>
          <p class="learn-modal__description" data-learn-modal-description></p>
          <div class="learn-modal__actions" data-learn-modal-actions>
            <a data-learn-modal-demo>See Demo</a>
            <a data-learn-modal-tutorial>Tutorial</a>
            <a data-learn-modal-quick>Open Tool</a>
          </div>
        </div>
      </div>`;
    host.append(modal);

    const panel = modal.querySelector("[data-learn-modal-panel]");
    const closeButton = modal.querySelector("[data-learn-modal-close]");
    const mediaHost = modal.querySelector("[data-learn-modal-media]");
    const metaHost = modal.querySelector("[data-learn-modal-meta]");
    const title = modal.querySelector("[data-learn-modal-title]");
    const description = modal.querySelector("[data-learn-modal-description]");
    const actions = modal.querySelector("[data-learn-modal-actions]");
    const demo = modal.querySelector("[data-learn-modal-demo]");
    const tutorial = modal.querySelector("[data-learn-modal-tutorial]");
    const quick = modal.querySelector("[data-learn-modal-quick]");
    let lastTrigger = null;

    function renderMedia(item) {
      mediaHost.replaceChildren();
      mediaHost.style.setProperty("--media-fit", item.media.fit === "cover" ? "cover" : "contain");
      mediaHost.style.setProperty("--media-x", `${item.media.x}%`);
      mediaHost.style.setProperty("--media-y", `${item.media.y}%`);
      mediaHost.style.setProperty("--media-scale", item.media.scale);
      mediaHost.style.setProperty("--media-matte", item.media.matte);

      if (item.comingSoon) {
        if (catalog.comingSoonImage) {
          const image = document.createElement("img");
          image.src = catalog.comingSoonImage;
          image.alt = "Coming soon";
          mediaHost.append(image);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "learn-coming-placeholder";
          const label = document.createElement("strong");
          label.textContent = "Coming Soon";
          placeholder.append(label);
          mediaHost.append(placeholder);
        }
        return;
      }

      if (!item.media.url) {
        const placeholder = document.createElement("div");
        placeholder.className = "learn-coming-placeholder";
        const label = document.createElement("strong");
        label.textContent = "Media Preview";
        placeholder.append(label);
        mediaHost.append(placeholder);
        return;
      }

      if (item.media.type === "video") {
        const video = document.createElement("video");
        video.src = item.media.url;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        video.setAttribute("aria-label", item.media.alt || `${item.title} video`);
        mediaHost.append(video);
        return;
      }

      const image = document.createElement("img");
      image.src = item.media.url;
      image.alt = item.media.alt || item.title;
      image.loading = "eager";
      image.decoding = "async";
      mediaHost.append(image);
    }

    function open(itemValue, trigger) {
      const item = normalizeItem(itemValue, 0);
      lastTrigger = trigger || document.activeElement;
      modal.style.setProperty("--item-accent", item.accent || catalog.accent);
      renderMedia(item);
      metaHost.replaceChildren();
      if (item.comingSoon) {
        metaHost.append(createBadge("Coming Soon", "", "learn-coming-badge"));
      } else {
        const badge = accessBadge(item);
        if (badge) metaHost.append(badge);
      }
      title.textContent = item.title;
      description.textContent = item.description || item.bullets.join(" ") || "More details will be added here.";

      const showDemo = !item.comingSoon && Boolean(item.demoUrl);
      const showTutorial = !item.comingSoon && Boolean(item.tutorialUrl);
      const showQuick = !item.comingSoon && Boolean(item.quickLinkUrl);
      demo.hidden = !showDemo;
      tutorial.hidden = !showTutorial;
      quick.hidden = !showQuick;
      if (showDemo) demo.href = item.demoUrl;
      if (showTutorial) tutorial.href = item.tutorialUrl;
      if (showQuick) {
        quick.href = item.quickLinkUrl;
        quick.textContent = item.quickLinkLabel;
        if (/^https?:/i.test(item.quickLinkUrl)) {
          quick.target = "_blank";
          quick.rel = "noopener noreferrer";
        } else {
          quick.removeAttribute("target");
          quick.removeAttribute("rel");
        }
      }
      actions.hidden = !showDemo && !showTutorial && !showQuick;

      modal.dataset.open = "true";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => closeButton.focus());
    }

    function close() {
      if (modal.dataset.open !== "true") return;
      modal.dataset.open = "false";
      modal.setAttribute("aria-hidden", "true");
      mediaHost.querySelectorAll("video").forEach((video) => video.pause());
      document.body.style.overflow = "";
      const target = lastTrigger;
      lastTrigger = null;
      if (target && typeof target.focus === "function") target.focus();
    }

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-learn-modal-close]") || event.target.matches("[data-learn-modal-overlay]")) {
        close();
      }
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...panel.querySelectorAll('button:not([hidden]), a[href]:not([hidden]), video[controls]')]
        .filter((element) => !element.hidden);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    function updateCatalog(nextCatalog) {
      catalog = normalizeCatalog(nextCatalog);
    }

    return { element: modal, open, close, updateCatalog };
  }

  function renderCatalog(catalogValue, grid, modalApi) {
    const catalog = normalizeCatalog(catalogValue);
    grid.replaceChildren();
    let previousGroup = "";
    catalog.items.forEach((item, index) => {
      if (item.group && item.group !== previousGroup) {
        const groupHeading = document.createElement("h2");
        groupHeading.className = "learn-group-heading";
        groupHeading.textContent = item.group;
        grid.append(groupHeading);
        previousGroup = item.group;
      }
      grid.append(createCard(item, index, catalog, (selected, trigger) => modalApi.open(selected, trigger)));
    });
    return catalog;
  }

  async function initializeIndex(root) {
    const grid = root.querySelector("[data-index-grid]");
    const empty = root.querySelector("[data-index-empty]");
    const error = root.querySelector("[data-index-error]");
    const catalogUrl = root.dataset.catalog;
    if (!grid || !catalogUrl) return;

    try {
      const response = await fetch(catalogUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Catalog ${response.status}`);
      const catalog = normalizeCatalog(await response.json());
      document.documentElement.style.setProperty("--section-accent", catalog.accent);
      const title = root.querySelector("[data-index-title]");
      const eyebrow = root.querySelector("[data-index-eyebrow]");
      const intro = root.querySelector("[data-index-intro]");
      if (title) title.textContent = catalog.title;
      if (eyebrow) eyebrow.textContent = catalog.eyebrow;
      if (intro) intro.textContent = catalog.intro;
      document.title = `${catalog.title} | Magic Hashtags`;

      const modalApi = createModal(document.body, catalog);
      renderCatalog(catalog, grid, modalApi);
      if (empty) empty.hidden = catalog.items.length > 0;
      if (error) error.hidden = true;
    } catch (catalogError) {
      console.error(catalogError);
      if (empty) empty.hidden = true;
      if (error) {
        error.hidden = false;
        error.textContent = "This Learn section could not be loaded. Please try again after the next site update.";
      }
    }
  }

  window.LearnIndex = Object.freeze({
    ACCESS_COLORS,
    clamp,
    slugify,
    normalizeMedia,
    normalizeItem,
    normalizeCatalog,
    createCard,
    createModal,
    renderCatalog
  });

  initializeSharedTopicHeader();

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-learn-index]").forEach(initializeIndex);
  });
}());
