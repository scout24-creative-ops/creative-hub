/* Grounded, in-browser retrieval for the Hub AI layer.
   The public contract deliberately separates retrieval from rendering so an
   authenticated Scout24 AI gateway can replace the local adapter later. */
(function () {
  const HUB = window.HUB || { AGENTS: [], CATEGORIES: [] };
  const PAGES = window.FRONTIFY_PAGES || [];
  const LAYOUTS = window.FRONTIFY_LAYOUTS || {};
  const HIDDEN_AGENTS = new Set(["design-direction", "figma-token-architect", "figma-iab-html", "ad-format-adapter", "brand-channel"]);
  const HIDDEN_PAGE = /(nicht löschen|admin|untitled)/i;
  const MEDIA_ROOT = "assets/media-library/";
  const STOP = new Set(["a", "an", "and", "are", "as", "at", "be", "can", "do", "for", "from", "get", "give", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "please", "show", "the", "this", "to", "use", "what", "where", "which", "with"]);
  const ALIASES = {
    color: ["colour", "colours", "palette", "hex", "rgb", "cmyk", "pantone"],
    colour: ["color", "colors", "palette", "hex", "rgb", "cmyk", "pantone"],
    font: ["typeface", "typography", "make", "better"],
    typography: ["font", "typeface", "text"],
    deck: ["presentation", "powerpoint", "ppt", "slides", "slidedeck"],
    presentation: ["deck", "powerpoint", "ppt", "slides", "slidedeck"],
    glyph: ["icon", "symbol"],
    icon: ["glyph", "symbol"],
    image: ["photo", "photography", "picture", "visual", "imagery"],
    photo: ["image", "photography", "picture", "visual", "imagery"],
    copy: ["writing", "text", "tone", "voice", "headline"],
    tov: ["tone", "voice", "copy", "writing"],
    lp: ["landing", "page"],
    email: ["mail", "newsletter", "crm"],
    logo: ["brandmark", "wordmark", "mark"],
    homeowner: ["owner", "owners", "homeowners"],
    seeker: ["seekers", "consumer", "renters", "buyers"],
    agent: ["tool", "assistant", "studio", "workflow"],
  };
  const INTENT_WORDS = {
    asset: ["asset", "download", "image", "photo", "photography", "icon", "glyph", "logo", "template", "highlighter", "svg", "png", "jpg", "visual"],
    tool: ["agent", "tool", "studio", "workflow", "build", "create", "generate", "make", "presentation", "deck", "landing", "email", "mockup", "campaign", "ad"],
    rule: ["rule", "guideline", "brand", "allowed", "should", "contrast", "colour", "color", "font", "typography", "logo", "tone", "voice", "principle", "pantone"],
  };

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function stripHtml(value) {
    const node = document.createElement("div");
    node.innerHTML = String(value || "");
    return clean(node.textContent || "");
  }

  function normalise(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9#]+/g, " ").trim();
  }

  function tokens(value) {
    const base = normalise(value).split(/\s+/).filter((token) => token && !STOP.has(token));
    const expanded = new Set(base);
    base.forEach((token) => (ALIASES[token] || []).forEach((alias) => expanded.add(alias)));
    return [...expanded];
  }

  function splitPassages(value) {
    const protectedAbbreviations = String(value || "")
      .replace(/\be\.g\./gi, "e__dot__g__dot__")
      .replace(/\bi\.e\./gi, "i__dot__e__dot__");
    return protectedAbbreviations
      .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((item) => clean(item.replace(/e__dot__g__dot__/gi, "e.g.").replace(/i__dot__e__dot__/gi, "i.e.")))
      .filter((item) => item.length > 18 && !/^https?:/i.test(item));
  }

  function collectLayout(value, output, palettes, key = "") {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => collectLayout(item, output, palettes, key));
      return;
    }
    if (typeof value === "object") {
      if (value.name && value.hex && (value.rgb || value.pantone)) {
        palettes.push({ name: clean(value.name), hex: clean(value.hex), rgb: clean(value.rgb), cmyk: clean(value.cmyk), pantone: clean(value.pantone) });
      }
      Object.entries(value).forEach(([childKey, child]) => collectLayout(child, output, palettes, childKey));
      return;
    }
    if (typeof value !== "string" || /^(src|url|file|path|class|kind)$/i.test(key) || /^https?:\/\//i.test(value)) return;
    if (/^(rich|heading|title|caption|paletteTitle|label|body|text|name|hex|rgb|cmyk|pantone|alt)$/i.test(key)) {
      const text = key === "rich" || /<[^>]+>/.test(value) ? stripHtml(value) : clean(value);
      if (text.length > 2) output.push(text);
    }
  }

  function pageRoute(page) {
    const section = ["guidelines", "strategy", "look"].includes(page.portal) ? "brand" : page.portal === "media" ? "assets" : "resources";
    return { section, page: { key: `${page.portal}::${page.title}`, label: page.title, source: "frontify" } };
  }

  function pageKind(page) {
    if (["guidelines", "strategy", "look"].includes(page.portal)) return "rule";
    if (page.portal === "media") return "template";
    return "resource";
  }

  function buildPageRecords() {
    return PAGES.filter((page) => !HIDDEN_PAGE.test(page.title)).map((page) => {
      const imported = (page.blocks || []).flatMap((block) => splitPassages(block.content));
      const layoutText = [];
      const palette = [];
      collectLayout(LAYOUTS[page.title], layoutText, palette);
      const passages = [...new Set([...imported, ...layoutText.flatMap(splitPassages)])].slice(0, 180);
      const summary = passages.find((passage) => normalise(passage) !== normalise(page.title)) || `${page.title} guidance from the local Hub.`;
      return {
        id: `page:${page.portal}:${normalise(page.title).replace(/\s+/g, "-")}`,
        kind: pageKind(page),
        title: page.title,
        eyebrow: page.portal === "guidelines" ? "Guideline" : page.portal === "strategy" ? "Brand strategy" : page.portal === "media" ? "Template & document" : "Hub resource",
        description: summary,
        text: clean([page.title, ...passages].join(" ")),
        passages,
        palette,
        updated: page.modifiedAt || null,
        route: pageRoute(page),
        source: "Approved Hub content",
      };
    });
  }

  function buildAgentRecords() {
    return (HUB.AGENTS || []).filter((agent) => agent.status !== "idea" && !HIDDEN_AGENTS.has(agent.id)).map((agent) => {
      const detail = typeof HUB.getAgentDetail === "function" ? HUB.getAgentDetail(agent) : null;
      const extra = detail ? [detail.bestFor, ...(detail.helps || []), ...(detail.use || []), ...(detail.avoid || [])] : [];
      return {
        id: `agent:${agent.id}`,
        kind: "agent",
        title: agent.name,
        eyebrow: agent.status === "live" ? "Live agent" : "Agent in testing",
        description: agent.what,
        text: clean([agent.name, agent.what, agent.owner, ...(agent.tags || []), ...(agent.target || []), ...(agent.audience || []), ...extra].join(" ")),
        passages: [agent.what, ...extra].map(clean).filter(Boolean),
        agent,
        source: "Creative Studio agent register",
      };
    });
  }

  const SPECIAL = [
    { id: "hub:brand-overview", kind: "rule", title: "Brand Overview", eyebrow: "Brand", description: "The ImmoScout24 brand at a glance: purpose, audiences, look and feel, and the system behind it.", text: "brand overview purpose audiences look feel strategy principles", passages: ["A starting point for understanding the ImmoScout24 brand and the system behind it."], route: { section: "brand", page: { key: "hub::56", label: "Brand Overview", source: "hub" } }, source: "Approved Hub content" },
    { id: "hub:strategy-overview", kind: "rule", title: "Brand Strategy Overview", eyebrow: "Brand strategy", description: "Claim, message framework and brand family guidance.", text: "brand strategy claim message framework family einfach zuhause", passages: ["The overview connects the campaign claim, message framework and family-brand strategy."], route: { section: "brand", page: { key: "hub::68", label: "Brand Strategy Overview", source: "hub" } }, source: "Approved Hub content" },
    { id: "hub:guidelines-overview", kind: "rule", title: "Guidelines Overview", eyebrow: "Guidelines", description: "The complete entry point for logo, colour, typography, imagery, digital and voice guidance.", text: "guidelines logo colour typography icons illustrations photography video sound digital tone voice", passages: ["Use the Guidelines Overview to reach every approved ImmoScout24 design and communication rule."], route: { section: "brand", page: { key: "hub::66", label: "Guidelines Overview", source: "hub" } }, source: "Approved Hub content" },
    { id: "hub:media-overview", kind: "asset", title: "Media Library", eyebrow: "Assets", description: "Local previews of approved images, ImmoPics, highlighters, icons, logos and templates.", text: "media library images immopics highlighter icons logos templates assets download", passages: ["The Media Library contains approved local previews and repository-owned icon originals."], route: { section: "assets", page: { key: "hub::69", label: "Media Library", source: "hub" } }, source: "Local Media Library" },
  ];

  const CORE = [...SPECIAL, ...buildPageRecords(), ...buildAgentRecords()];
  let assetRecordsPromise = null;
  let thumbsPromise = null;

  function mediaLabel(value) {
    return ({ images: "Images", immopics: "ImmoPics", highlighter: "Highlighter", logos: "Logos" })[value] || clean(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function assetDisplayTitle(asset) {
    const original = clean(asset.title || asset.name || asset.n || "Untitled asset");
    const variant = original.match(/_([0-9]+)\.[^.]+$/)?.[1];
    if (/^HOMEOWNERcsfriends/i.test(original)) {
      const age = original.match(/_A_(\d+)-year-old/i)?.[1];
      const subject = /and_[0-9]+-year-o/i.test(original) ? "homeowner with child" : "homeowner";
      return `Homeowner lifestyle , ${age ? `${age}-year-old ` : ""}${subject}${variant ? ` · Variant ${variant}` : ""}`;
    }
    let label = original
      .replace(/\.[a-z0-9]{2,5}$/i, "")
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, "")
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+[0-9]+$/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (/^\d+$/.test(label)) label = `${mediaLabel(asset.lib)} asset ${label}`;
    return label.length > 76 ? `${label.slice(0, 76).replace(/\s+\S*$/, "")}…` : label;
  }

  function loadAssets() {
    if (!assetRecordsPromise) {
      assetRecordsPromise = Promise.all([
        fetch(`${MEDIA_ROOT}media-manifest.json`).then((response) => {
          if (!response.ok) throw new Error(`Media index returned ${response.status}`);
          return response.json();
        }),
        fetch(`${MEDIA_ROOT}icon-catalog.json`).then((response) => {
          if (!response.ok) throw new Error(`Icon index returned ${response.status}`);
          return response.json();
        }),
      ]).then(([manifest, catalog]) => {
        const media = [...(manifest.files || []), ...(manifest.videos || [])].filter((asset) => asset.lib !== "icons").map((asset) => ({
          id: `asset:${asset.id}`,
          assetId: asset.id,
          kind: "asset",
          title: assetDisplayTitle(asset),
          eyebrow: mediaLabel(asset.lib),
          description: clean([mediaLabel(asset.lib), asset.collection || asset.col, String(asset.ext || "").toUpperCase(), asset.w && asset.h ? `${asset.w} × ${asset.h}` : ""].filter(Boolean).join(" · ")),
          text: clean([asset.title, asset.name, asset.n, asset.lib, asset.collection, asset.col, asset.ext, asset.w, asset.h].join(" ")),
          passages: [],
          asset: { ...asset, originalName: asset.title || asset.name || asset.n || null, extension: asset.ext || "", width: asset.w || null, height: asset.h || null },
          route: { section: "assets", page: { key: `media-library::${asset.lib}`, label: mediaLabel(asset.lib), source: "frontify-media-library" } },
          source: "Local Media Library",
        }));
        const icons = (catalog.designs || []).map((design) => {
          const variant = design.variants?.find((item) => Number(item.size) === Number(design.defaultSize || 24)) || design.variants?.[0];
          return {
            id: `icon:${design.id}`,
            kind: "icon",
            title: design.name,
            eyebrow: "Icon original",
            description: `${design.style === "glyph" ? "Glyph" : "Standard"} · ${(design.sizes || []).map((size) => `${size}px`).join(" + ") || "Special size"}${design.colourable ? " · Charcoal or white" : " · Original colour"}`,
            text: clean([design.name, design.style, design.keywords, ...(design.sizes || []).map((size) => `${size}px`), design.colourable ? "charcoal white" : "original colour"].join(" ")),
            passages: [],
            icon: design,
            previewUrl: variant ? `${MEDIA_ROOT}${variant.path}` : null,
            route: { section: "assets", page: { key: "media-library::icons", label: "Icons", source: "frontify-media-library" } },
            source: "Repository-owned SVG original",
          };
        });
        return [...media, ...icons];
      });
    }
    return assetRecordsPromise;
  }

  function loadThumbs() {
    if (!thumbsPromise) {
      thumbsPromise = fetch(`${MEDIA_ROOT}media-thumbs.json`).then((response) => {
        if (!response.ok) throw new Error(`Media previews returned ${response.status}`);
        return response.json();
      });
    }
    return thumbsPromise;
  }

  async function getPreview(record) {
    if (!record) return null;
    if (record.previewUrl) return record.previewUrl;
    if (record.kind !== "asset" || !record.assetId) return null;
    const thumbs = await loadThumbs();
    const thumb = thumbs[record.assetId];
    if (!thumb) return null;
    if (typeof thumb === "string") return thumb;
    if (thumb.url || thumb.path) return thumb.url || `${MEDIA_ROOT}${thumb.path}`;
    return thumb.d ? `data:${thumb.m || "image/webp"};base64,${thumb.d}` : null;
  }

  function detectIntent(query, scope) {
    if (scope === "assets") return "asset";
    if (scope === "agents") return "tool";
    if (scope === "guidelines") return "rule";
    const raw = normalise(query);
    const scores = Object.fromEntries(Object.entries(INTENT_WORDS).map(([intent, words]) => [intent, words.reduce((sum, word) => sum + (raw.includes(word) ? 1 : 0), 0)]));
    if (scores.asset >= scores.tool && scores.asset >= scores.rule && scores.asset > 0) return "asset";
    if (scores.tool >= scores.rule && scores.tool > 0) return "tool";
    return "rule";
  }

  function scopeAllows(record, scope) {
    if (!scope || scope === "all") return true;
    if (scope === "guidelines") return ["rule", "resource"].includes(record.kind);
    if (scope === "assets") return ["asset", "icon", "template"].includes(record.kind);
    if (scope === "agents") return record.kind === "agent";
    if (scope === "news") return record.kind === "news";
    return true;
  }

  function requestedAssetFacet(rawQuery, intent) {
    if (intent !== "asset") return null;
    if (/\b(icon|glyph|symbol)\b/.test(rawQuery)) return "icon";
    if (/\b(logo|wordmark|brandmark)\b/.test(rawQuery)) return "logo";
    if (/\b(template|templates)\b/.test(rawQuery)) return "template";
    if (/\b(image|images|photo|photos|photography|picture|pictures|imagery)\b/.test(rawQuery)) return "image";
    return null;
  }

  function assetFacetAllows(record, facet, rawQuery) {
    if (!facet) return true;
    if (facet === "icon") {
      if (record.kind !== "icon") return false;
      if (/\b48(px)?\b/.test(rawQuery) && !(record.icon?.sizes || []).includes(48)) return false;
      if (/\b24(px)?\b/.test(rawQuery) && !(record.icon?.sizes || []).includes(24)) return false;
      if (/\b(white|charcoal)\b/.test(rawQuery) && !record.icon?.colourable) return false;
      return true;
    }
    if (facet === "logo") return record.kind === "asset" && record.asset?.lib === "logos";
    if (facet === "template") return record.kind === "template" || (record.kind === "asset" && record.asset?.lib === "templates");
    if (facet === "image") return record.kind === "asset" && ["images", "immopics"].includes(record.asset?.lib);
    return true;
  }

  function scoreRecord(record, queryTokens, rawQuery, intent) {
    const title = normalise(record.title);
    const text = normalise(record.text || record.description);
    const directTokens = rawQuery.split(/\s+/).filter((token) => token && !STOP.has(token));
    let score = 0;
    if (title === rawQuery) score += 24;
    if (rawQuery.length > 2 && title.includes(rawQuery)) score += 14;
    directTokens.forEach((token) => {
      if (title.split(" ").includes(token)) score += 3;
    });
    queryTokens.forEach((token) => {
      if (title.split(" ").includes(token)) score += 6;
      else if (title.includes(token)) score += 4;
      if (text.includes(token)) score += 1.35;
    });
    if (intent === "asset" && ["asset", "icon", "template"].includes(record.kind)) score += 5;
    if (intent === "tool" && record.kind === "agent") score += 7;
    if (intent === "rule" && record.kind === "rule") score += 5;
    if (record.agent?.status === "live") score += 1;
    return score;
  }

  function passageScore(passage, queryTokens) {
    const text = normalise(passage);
    return queryTokens.reduce((score, token) => score + (text.includes(token) ? 1 : 0), 0) + Math.min(1, 160 / Math.max(160, passage.length));
  }

  function bestPassage(record, queryTokens) {
    const passages = (record.passages || []).filter((passage) => passage.length > 20 && passage.length < 780);
    if (!passages.length) return record.description;
    return [...passages].sort((a, b) => passageScore(b, queryTokens) - passageScore(a, queryTokens))[0] || record.description;
  }

  function compactPassage(value, max = 360) {
    const text = clean(value);
    if (text.length <= max) return text;
    return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
  }

  function responseFor(intent, query, results) {
    if (!results.length) return {
      answer: "I couldn’t find a confident approved match in the Hub. Try naming the asset type, guideline, channel or output you need.",
      followUps: ["Search all trusted sources", "Show the Guidelines overview"],
    };
    const first = results[0];
    if (intent === "asset") return {
      answer: `I found ${results.length} strong ${results.length === 1 ? "match" : "matches"}. ${first.kind === "icon" ? `${first.title} is available as a repository-owned SVG original.` : `${first.title} is the closest local Media Library result.`} Preview and delivery options are ready in the answer canvas.`,
      followUps: first.kind === "icon" ? ["Show 48px versions", "Use white", "Find a similar icon"] : ["Only landscape assets", "Show another collection", "Find a matching icon"],
    };
    if (intent === "tool") return {
      answer: `${first.title} is the strongest starting point for this request. ${first.description}`,
      followUps: ["What should I provide?", "Show the tutorial", "Compare with another agent"],
    };
    return {
      answer: `The most relevant approved guidance is ${first.title}. ${compactPassage(first.evidence || first.description, 300)}`,
      followUps: ["Show a practical example", "Copy the guidance", "Show related assets"],
    };
  }

  async function query(input, options = {}) {
    const scope = options.scope || "all";
    const prior = clean(options.previous || "");
    const current = clean(input);
    const contextual = /^(and|only|what about|what should|how should|show|use|compare|similar|another|in white|in charcoal|48|24)\b/i.test(current) && prior ? `${prior} ${current}` : current;
    const intent = detectIntent(contextual, scope);
    const queryTokens = tokens(contextual);
    const rawQuery = normalise(contextual);
    const assetFacet = requestedAssetFacet(rawQuery, intent);
    let corpus = CORE;
    if (intent === "asset" || scope === "assets" || INTENT_WORDS.asset.some((word) => rawQuery.includes(word))) {
      try { corpus = [...CORE, ...(await loadAssets())]; } catch (error) { corpus = CORE; }
    }
    const ranked = corpus
      .filter((record) => scopeAllows(record, scope) && assetFacetAllows(record, assetFacet, rawQuery))
      .map((record) => ({ record, score: scoreRecord(record, queryTokens, rawQuery, intent) }))
      .filter((item) => item.score > 1.5)
      .sort((a, b) => b.score - a.score);
    const seen = new Set();
    const selected = [];
    for (const item of ranked) {
      if (seen.has(item.record.id)) continue;
      seen.add(item.record.id);
      selected.push({ ...item.record, score: item.score, evidence: compactPassage(bestPassage(item.record, queryTokens)) });
      if (selected.length >= (intent === "asset" ? 5 : 4)) break;
    }
    const response = responseFor(intent, contextual, selected);
    return {
      id: `answer-${Date.now()}`,
      query: current,
      contextualQuery: contextual,
      intent,
      answer: response.answer,
      results: selected,
      followUps: response.followUps,
      trust: { scope, sourceCount: new Set(selected.map((item) => item.source)).size, resultCount: selected.length, mode: "Local grounded retrieval" },
    };
  }

  function getStats() {
    return {
      agents: CORE.filter((item) => item.kind === "agent").length,
      pages: CORE.filter((item) => ["rule", "resource", "template"].includes(item.kind)).length,
      assets: 2431,
      iconDesigns: 458,
    };
  }

  window.HUB_SEARCH = { query, getPreview, getStats, loadAssets };
})();
