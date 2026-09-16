(function () {
  "use strict";

  const script = document.currentScript;
  const catalogUrl = new URL("./reporter-tools.json", script.src);
  const legacyCatalogUrl = new URL("../learn/sidekicks/index-items.json", script.src);
  function normalizeBadges(tool) {
    const explicitBadges = Array.isArray(tool.badges)
      ? tool.badges
          .filter((badge) => badge && typeof badge === "object" && badge.label)
          .map((badge) => Object.freeze({
            label: String(badge.label),
            color: String(badge.color || "#FF90E7")
          }))
      : [];
    if (explicitBadges.length) return Object.freeze(explicitBadges);

    const accessLabel = tool.access === "paid" ? "Paid" : "Free";
    if (tool.platform === "ai-drive") {
      return Object.freeze([
        Object.freeze({ label: "AI Drive", color: "#24A094" }),
        Object.freeze({ label: "Subscription", color: "#91A8ED" }),
        Object.freeze({ label: accessLabel, color: "#FF90E7" })
      ]);
    }
    return Object.freeze([
      Object.freeze({ label: accessLabel, color: tool.accent || "#24A094" }),
      Object.freeze({ label: "ChatGPT", color: "#FF90E7" })
    ]);
  }

  function normalizeCatalog(value) {
    const catalog = value && typeof value === "object" ? value : {};
    const tools = (Array.isArray(catalog.items) ? catalog.items : [])
      .filter((tool) => !tool.comingSoon && (
        catalog.catalogType === "reporter-tools" || Boolean(tool.legacyKey)
      ))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const quickLinks = (Array.isArray(catalog.quickLinks) ? catalog.quickLinks : [])
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return { ...catalog, tools, quickLinks };
  }

  async function fetchCatalog(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Reporter Tools catalog ${response.status}`);
    return response.json();
  }

  window.REPORTER_TOOLS_CATALOG_ERROR = null;
  window.REPORTER_TOOLS_CATALOG_READY = fetchCatalog(catalogUrl)
    .catch((primaryError) => {
      console.warn("Stable Reporter Tools catalog unavailable; trying the protected legacy tool records.", primaryError);
      return fetchCatalog(legacyCatalogUrl);
    })
    .then(normalizeCatalog)
    .then((catalog) => {
      window.REPORTER_TOOLS_CATALOG = catalog;
      window.REPORTER_TOOLS_SHOWCASE = catalog.tools.map((tool) => Object.freeze({
        key: tool.legacyKey || tool.id,
        id: tool.id,
        title: tool.title,
        description: tool.description || (tool.bullets || []).join(" "),
        bullets: Array.isArray(tool.bullets) ? tool.bullets.filter(Boolean) : [],
        emphasizeFirstBullet: Boolean(tool.emphasizeFirstBullet),
        imageUrl: tool.media?.url || "",
        imageFilename: String(tool.media?.url || "").split("/").pop() || "reporter-tools-placeholder.png",
        imageAlt: tool.media?.alt || `${tool.title} preview`,
        imageFit: tool.media?.fit === "cover" ? "cover" : "contain",
        imageMatte: tool.media?.matte || "#ffffff",
        imageX: Number(tool.media?.x) || 0,
        imageY: Number(tool.media?.y) || 0,
        imageScale: Math.max(0.25, Number(tool.media?.scale) || 1),
        modalImageUrl: tool.modalImageUrl || "",
        modalGifUrl: tool.modalGifUrl || "",
        modalDemoUrl: tool.modalDemoUrl || "",
        demoAvailable: tool.demoAvailable === true,
        modalVideoUrl: tool.modalVideoUrl || "",
        modalVideoFallbackUrl: tool.modalVideoFallbackUrl || "",
        color: tool.accent || "#24a094",
        demoUrl: tool.demoUrl,
        tutorialUrl: tool.tutorialUrl,
        quickLinkLabel: tool.quickLinkLabel,
        quickLinkUrl: tool.quickLinkUrl,
        quickLinkDisabled: Boolean(tool.quickLinkDisabled),
        openToolUrl: tool.toolUrl || tool.quickLinkUrl,
        tutorialDisabled: Boolean(tool.tutorialDisabled),
        platformKey: tool.platform === "ai-drive" ? "ai-drive" : "chatgpt",
        platform: tool.platform === "ai-drive" ? "AI Drive" : "ChatGPT",
        badges: normalizeBadges(tool),
        access: tool.access,
        group: tool.group
      }));
      return catalog;
    })
    .catch((error) => {
      console.error(error);
      window.REPORTER_TOOLS_CATALOG_ERROR = error;
      window.REPORTER_TOOLS_CATALOG = { tools: [], quickLinks: [] };
      window.REPORTER_TOOLS_SHOWCASE = [];
      return window.REPORTER_TOOLS_CATALOG;
    });
}());
