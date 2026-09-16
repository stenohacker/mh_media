(function () {
  "use strict";

  const script = document.currentScript;
  const learnHomeUrl = new URL("../learn/learn-index.html", script.src).href;
  const reporterToolsUrl = new URL("../learn/sidekicks/index.html", script.src).href;
  const reporterToolsOverviewUrl = new URL("../reporter-tools.html", script.src).href;
  const chatGptTipsUrl = new URL("../learn/chatgpt-tips/index.html", script.src).href;
  const customizerUrl = new URL("../customizer.html", script.src).href;
  const proofreaderSetupUrl = new URL("../proofreader-setup.html", script.src).href;
  const reporterToolsCatalogUrl = new URL("./reporter-tools.json", script.src).href;
  const fallbackToolLinks = Object.freeze([
    {
      label: "All Reporter Tools",
      url: reporterToolsOverviewUrl,
      color: "#F1F332"
    },
    {
      label: "Exhibit Descriptions Sidekick",
      url: customizerUrl,
      color: "#24A094"
    },
    {
      label: "Proofreader Sidekick",
      url: "https://magichashtags.com/proofreader-setup",
      color: "#91A8ED"
    },
    {
      label: "Appearance Pages Sidekick",
      url: "https://chatgpt.com/g/g-6a71555e46388191a7b9c93dce61c4a9-appearance-pages-sidekick-magichashtags",
      color: "#24A094"
    },
    {
      label: "Transcript Sidekick",
      url: "https://chatgpt.com/g/g-6a34be4bf9e881918a4d0c23eeac0303-transcript-sidekick-magichashtags",
      color: "#91A8ED"
    },
    {
      label: "Dictionary Builder Sidekick",
      url: "https://chatgpt.com/g/g-6a3771baaddc81919b97d216d059cc27-dictionary-builder-sidekick-magichashtags",
      color: "#F1F332"
    },
    {
      label: "Practice Dictation Sidekick",
      url: "https://chatgpt.com/g/g-6a5af7a499a08191934293cc1cdf476b-practice-dictation-sidekick-magichashtags",
      color: "#FB71DE"
    }
  ]);

  const styles = document.createElement("style");
  styles.textContent = `
    .learn-context-nav {
      width: min(100% - 2rem, var(--site-shell-max, 120rem));
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: .65rem;
      margin: 0 auto 1.1rem;
      border: 3px solid #000;
      padding: .65rem .8rem;
      background: #fff;
      box-shadow: 5px 5px 0 #000;
      font-family: "Hanken Grotesk", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .learn-context-nav a {
      color: #000;
      text-decoration: none;
    }
    .learn-context-nav a:hover,
    .learn-context-nav a:focus-visible {
      background: #f1f332;
      outline: 3px solid #000;
      outline-offset: 2px;
    }
    .learn-context-nav span { opacity: .55; }
    .reporter-tools-dropdown {
      position: relative;
    }
    .reporter-tools-dropdown__menu {
      display: none;
      position: absolute;
      top: calc(100% + 16px);
      left: 50%;
      width: min(42rem, calc(100vw - 2rem));
      max-width: calc(100vw - 2rem);
      transform: translateX(-50%);
      z-index: 70;
    }
    .reporter-tools-dropdown__menu::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 100%;
      left: 0;
      height: 16px;
    }
    .reporter-tools-dropdown:hover > .reporter-tools-dropdown__menu,
    .reporter-tools-dropdown:focus-within > .reporter-tools-dropdown__menu {
      display: block;
      animation: reporterToolsDropdownReveal 180ms cubic-bezier(.16, 1, .3, 1) both;
    }
    .reporter-tools-dropdown__surface {
      position: relative;
      border: 4px solid #000;
      padding: .75rem;
      background: #fff;
    }
    .reporter-tools-dropdown__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .7rem;
    }
    header .site-desktop-nav .reporter-tools-dropdown__grid > a,
    header .learn-site-nav .reporter-tools-dropdown__grid > a,
    header .setup-nav .reporter-tools-dropdown__grid > a {
      display: flex !important;
      min-height: 3.5rem;
      align-items: center;
      justify-content: space-between;
      border: 3px solid #000 !important;
      padding: .7rem .8rem !important;
      background: #fff;
      box-shadow: none !important;
      color: #000;
      font-size: .9rem !important;
      font-weight: 700;
      line-height: 1.25 !important;
      letter-spacing: .04em !important;
      text-decoration: none;
      text-transform: uppercase;
      white-space: normal !important;
    }
    header .site-desktop-nav .reporter-tools-dropdown__grid > a:hover,
    header .site-desktop-nav .reporter-tools-dropdown__grid > a:focus-visible,
    header .learn-site-nav .reporter-tools-dropdown__grid > a:hover,
    header .learn-site-nav .reporter-tools-dropdown__grid > a:focus-visible,
    header .setup-nav .reporter-tools-dropdown__grid > a:hover,
    header .setup-nav .reporter-tools-dropdown__grid > a:focus-visible {
      background: #f1f332 !important;
      box-shadow: none !important;
      outline: 0;
      transform: none;
    }
    header .learn-site-nav > .reporter-tools-dropdown > button,
    header .setup-nav > .reporter-tools-dropdown > button {
      border: 3px solid transparent;
      padding: .65rem .8rem;
      background: transparent;
      color: #fff;
      cursor: pointer;
      font: inherit;
      font-size: .78rem;
      font-weight: 700;
      letter-spacing: .05em;
      line-height: 1.2;
      text-transform: uppercase;
    }
    header .learn-site-nav > .reporter-tools-dropdown > button:hover,
    header .learn-site-nav > .reporter-tools-dropdown > button:focus-visible,
    header .setup-nav > .reporter-tools-dropdown > button:hover,
    header .setup-nav > .reporter-tools-dropdown > button:focus-visible {
      border-color: #f1f332;
      background: #f1f332;
      color: #000;
      outline: 0;
    }
    .site-mobile-tool-links a,
    .shared-mobile-tool-links a {
      box-shadow: none !important;
    }
    .shared-mobile-tool-links {
      border: 0;
      background: transparent;
    }
    .shared-mobile-tool-links summary {
      display: block;
      border: 3px solid #000;
      padding: .72rem .8rem;
      background: #fff;
      color: #000;
      cursor: pointer;
      font: inherit;
      font-size: .78rem;
      font-weight: 700;
      letter-spacing: .045em;
      line-height: 1.1;
      text-transform: uppercase;
    }
    .shared-mobile-tool-links summary:hover,
    .shared-mobile-tool-links summary:focus-visible {
      background: #f1f332;
      outline: 0;
    }
    .shared-mobile-tool-links__items {
      display: grid;
      gap: .4rem;
      padding: .4rem 0 .15rem .55rem;
    }
    .shared-mobile-tool-links__items a {
      display: block;
      border: 2px solid #000;
      padding: .65rem .75rem;
      background: #fff;
      color: #000;
      font-size: .72rem;
      font-weight: 700;
      line-height: 1.2;
      text-decoration: none;
      text-transform: uppercase;
    }
    .shared-mobile-tool-links__items a:hover,
    .shared-mobile-tool-links__items a:focus-visible {
      background: #f1f332;
      outline: 0;
    }
    .site-store-teaser {
      animation: siteStoreTeaser 1s cubic-bezier(.16, 1, .3, 1) both;
    }
    @keyframes siteStoreTeaser {
      0%, 100% { transform: translateY(0); }
      30% { transform: translateY(-.35rem) rotate(-2deg); }
      60% { transform: translateY(.12rem) rotate(1deg); }
    }
    @keyframes reporterToolsDropdownReveal {
      from {
        opacity: 0;
        transform: translate(-50%, -.7rem);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .learn-related-callout {
      width: min(100% - 2rem, var(--site-shell-max, 120rem));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin: 0 auto 1.25rem;
      border: 4px solid #000;
      padding: 1rem;
      background: #f1f332;
      color: #000;
      box-shadow: 7px 7px 0 #000;
      font-family: "Hanken Grotesk", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    }
    .learn-related-callout p { margin: 0; font-weight: 700; line-height: 1.4; }
    .learn-related-callout a {
      flex: 0 0 auto;
      border: 3px solid #000;
      padding: .65rem .8rem;
      background: #fff;
      color: #000;
      box-shadow: 4px 4px 0 #000;
      font-size: .75rem;
      font-weight: 800;
      letter-spacing: .04em;
      text-decoration: none;
      text-transform: uppercase;
    }
    @media (max-width: 680px) {
      .learn-related-callout { align-items: stretch; flex-direction: column; }
      .learn-related-callout a { text-align: center; }
    }
  `;
  document.head.append(styles);

  function isLearnHref(anchor) {
    try {
      return new URL(anchor.href, location.href).pathname.toLowerCase().includes("/learn/");
    } catch (_) {
      return false;
    }
  }

  function makeLearnLink(className = "") {
    const link = document.createElement("a");
    link.href = learnHomeUrl;
    link.textContent = "learn";
    link.className = className;
    return link;
  }

  function replaceDesktopDropdowns() {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
      const trigger = dropdown.querySelector(":scope > button");
      if (!trigger || trigger.textContent.trim().toLowerCase() !== "learn") return;
      dropdown.replaceWith(makeLearnLink(trigger.className));
    });

    document.querySelectorAll("[data-learn-nav]").forEach((target) => {
      const link = makeLearnLink();
      link.textContent = "Learn Home";
      target.replaceChildren(link);
    });

    document.querySelectorAll(".learn-site-nav").forEach((nav) => {
      const link = [...nav.querySelectorAll("a")].find((anchor) => anchor.textContent.trim().toLowerCase() === "learn");
      if (link) link.href = learnHomeUrl;
    });
  }

  async function loadToolLinks() {
    try {
      const response = await fetch(reporterToolsCatalogUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Tool Links catalog ${response.status}`);
      const catalog = await response.json();
      const links = [{ label: "All Reporter Tools", url: reporterToolsOverviewUrl }];
      [...(catalog.quickLinks || [])]
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        .forEach((item) => {
          if (item.title && item.url) links.push({ label: item.title, url: item.url });
        });
      [...(catalog.items || [])]
        .filter((item) => !item.comingSoon)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        .forEach((item) => {
          const url = item.quickLinkUrl || item.toolUrl || item.demoUrl;
          if (item.title && url) links.push({ label: item.title, url });
        });
      return links;
    } catch (error) {
      console.error(error);
      return [...fallbackToolLinks];
    }
  }

  function installToolLinksDropdown(toolLinks) {
    document.querySelectorAll(".site-desktop-nav, .learn-site-nav, .setup-nav").forEach((nav) => {
      nav.querySelectorAll(":scope > .tool-links-dropdown").forEach((duplicate) => duplicate.remove());
      const trigger = [...nav.querySelectorAll(":scope > a")].find(
        (anchor) => ["reporter tools", "tool links"].includes(anchor.textContent.trim().toLowerCase())
      );
      if (!trigger || trigger.closest(".reporter-tools-dropdown")) return;

      const dropdown = document.createElement("div");
      dropdown.className = "relative nav-dropdown reporter-tools-dropdown";
      dropdown.dataset.open = "false";

      const triggerButton = document.createElement("button");
      triggerButton.type = "button";
      triggerButton.className = trigger.className;
      triggerButton.id = `toolLinksTrigger-${Math.random().toString(36).slice(2, 8)}`;
      triggerButton.textContent = "Tool Links";
      triggerButton.setAttribute("aria-haspopup", "menu");
      triggerButton.setAttribute("aria-expanded", "false");
      triggerButton.setAttribute("aria-label", "Tool Links");

      const menu = document.createElement("div");
      menu.className = "nav-dropdown-menu reporter-tools-dropdown__menu";
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-labelledby", triggerButton.id);

      const surface = document.createElement("div");
      surface.className = "reporter-tools-dropdown__surface";
      const grid = document.createElement("div");
      grid.className = "reporter-tools-dropdown__grid";

      toolLinks.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.label;
        link.setAttribute("role", "menuitem");
        if (/^https?:/i.test(item.url) && !item.url.startsWith(location.origin)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        grid.append(link);
      });

      surface.append(grid);
      menu.append(surface);
      dropdown.append(triggerButton, menu);
      trigger.replaceWith(dropdown);

      const setOpen = (open) => {
        dropdown.dataset.open = open ? "true" : "false";
        triggerButton.setAttribute("aria-expanded", open ? "true" : "false");
      };
      triggerButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(dropdown.dataset.open !== "true");
      });
      menu.addEventListener("click", (event) => event.stopPropagation());
      document.addEventListener("click", () => setOpen(false));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(false);
      });
    });
  }

  function installMobileToolLinks(toolLinks) {
    document.querySelectorAll("[data-mobile-nav-panel], [data-site-mobile-panel]").forEach((panel) => {
      panel.querySelectorAll("a").forEach((anchor) => {
        if (["reporter tools", "tool links"].includes(anchor.textContent.trim().toLowerCase())) anchor.remove();
      });

      const existingToggle = panel.querySelector("[data-mobile-tool-links-toggle]");
      const existingItems = panel.querySelector("[data-mobile-tool-links]");
      if (existingToggle && existingItems) {
        existingToggle.textContent = "Tool Links";
        existingItems.replaceChildren();
        toolLinks.forEach((item) => {
          const link = document.createElement("a");
          link.href = item.url;
          link.textContent = item.label;
          existingItems.append(link);
        });
        return;
      }

      panel.querySelector(".shared-mobile-tool-links")?.remove();
      const details = document.createElement("details");
      details.className = "shared-mobile-tool-links";
      const summary = document.createElement("summary");
      summary.textContent = "Tool Links";
      const items = document.createElement("div");
      items.className = "shared-mobile-tool-links__items";
      toolLinks.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.label;
        items.append(link);
      });
      details.append(summary, items);
      const contact = panel.querySelector("[data-open-contact]");
      panel.insertBefore(details, contact || null);
    });
  }

  function installReporterToolsLinks() {
    document.querySelectorAll(".site-desktop-nav, .learn-site-nav, .setup-nav").forEach((nav) => {
      const dropdown = nav.querySelector(":scope > .reporter-tools-dropdown");
      const trigger = dropdown || [...nav.querySelectorAll(":scope > a")].find(
        (anchor) => ["reporter tools", "tool links"].includes(anchor.textContent.trim().toLowerCase())
      );
      if (!trigger) return;

      const link = document.createElement("a");
      const source = dropdown?.querySelector(":scope > button") || trigger;
      link.className = source.className || "";
      link.href = reporterToolsOverviewUrl;
      link.textContent = "Reporter Tools";
      trigger.replaceWith(link);
    });

    document.querySelectorAll("[data-mobile-nav-panel], [data-site-mobile-panel]").forEach((panel) => {
      const details = panel.querySelector(".shared-mobile-tool-links, .site-mobile-tool-links");
      const existing = details || [...panel.querySelectorAll(":scope > a")].find(
        (anchor) => ["reporter tools", "tool links"].includes(anchor.textContent.trim().toLowerCase())
      );
      if (!existing) return;
      const link = document.createElement("a");
      link.href = reporterToolsOverviewUrl;
      link.textContent = "Reporter Tools";
      existing.replaceWith(link);
    });
  }

  function installStoreComingSoon() {
    document.querySelectorAll("header nav a").forEach((link) => {
      let path = "";
      try { path = new URL(link.href, location.href).pathname.toLowerCase(); } catch (_) { return; }
      if (!path.endsWith("/purchase.html") || link.dataset.storeTeaserReady === "true") return;
      link.dataset.storeTeaserReady = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const original = link.dataset.storeOriginalText || link.textContent.trim() || "Store";
        link.dataset.storeOriginalText = original;
        window.clearTimeout(Number(link.dataset.storeTeaserTimer) || 0);
        link.textContent = "Coming Soon";
        link.classList.remove("site-store-teaser");
        void link.offsetWidth;
        link.classList.add("site-store-teaser");
        const timer = window.setTimeout(() => {
          link.textContent = original;
          link.classList.remove("site-store-teaser");
          delete link.dataset.storeTeaserTimer;
        }, 1000);
        link.dataset.storeTeaserTimer = String(timer);
      });
    });
  }

  function replaceMobileLearnLinks() {
    document.querySelectorAll("[data-mobile-nav-panel], [data-site-mobile-panel]").forEach((panel) => {
      panel.querySelectorAll("a").forEach((anchor) => {
        if (isLearnHref(anchor)) anchor.remove();
      });
      const link = makeLearnLink();
      panel.prepend(link);
    });
  }

  function sectionForPath(pathname) {
    const path = pathname.toLowerCase();
    if (/\/learn\/(?:appearance|dictionary|exhibits|practice|proofreader|spotcheck)\//.test(path)) {
      return { label: "Reporter Tools", url: reporterToolsUrl };
    }
    if (path.includes("/learn/chatgpt/")) {
      return { label: "ChatGPT Tips", url: chatGptTipsUrl };
    }
    return null;
  }

  function relatedForPath(pathname) {
    const path = pathname.toLowerCase();
    if (path.includes("/learn/exhibits/")) {
      return {
        text: "Exhibit Descriptions uses the Customizer to collect and export your preferences.",
        label: "Open Customizer",
        url: customizerUrl
      };
    }
    if (path.includes("/learn/proofreader/")) {
      return {
        text: "Set up your proofreading preferences before opening the Proofreader Sidekick.",
        label: "Set Up Proofreader",
        url: proofreaderSetupUrl
      };
    }
    return null;
  }

  function installLearningTrail() {
    const path = location.pathname.toLowerCase();
    const isLearnPage = path.includes("/learn/");
    const isLearnHome = /\/learn\/(?:index|learn-index)\.html$/.test(path) || /\/learn\/$/.test(path);
    if (!isLearnPage || isLearnHome || document.body.matches("[data-learn-index]")) return;
    const main = document.querySelector("main");
    if (!main || main.querySelector(":scope > .learn-context-nav")) return;

    const section = sectionForPath(path);
    const trail = document.createElement("nav");
    trail.className = "learn-context-nav";
    trail.setAttribute("aria-label", "Learning navigation");

    const home = document.createElement("a");
    home.href = learnHomeUrl;
    home.textContent = "← Learn Home";
    trail.append(home);
    if (section) {
      const divider = document.createElement("span");
      divider.textContent = "/";
      const sectionLink = document.createElement("a");
      sectionLink.href = section.url;
      sectionLink.textContent = section.label;
      trail.append(divider, sectionLink);
    }
    main.prepend(trail);

    const related = relatedForPath(path);
    if (!related) return;
    const callout = document.createElement("aside");
    callout.className = "learn-related-callout";
    const copy = document.createElement("p");
    copy.textContent = related.text;
    const link = document.createElement("a");
    link.href = related.url;
    link.textContent = related.label;
    callout.append(copy, link);
    trail.after(callout);
  }

  function updateSectionBackLinks() {
    document.querySelectorAll(".learn-index-back").forEach((link) => {
      link.href = learnHomeUrl;
      link.textContent = "← Learn Home";
    });
  }

  replaceDesktopDropdowns();
  replaceMobileLearnLinks();
  updateSectionBackLinks();
  installLearningTrail();
  installReporterToolsLinks();
  installStoreComingSoon();
}());
