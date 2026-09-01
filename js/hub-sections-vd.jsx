/* ============================================================================
   Creative Hub , Editorial Workbench.
   A manual chapter slider leads into curated agents, outcome-led shortcuts,
   trustworthy updates, an AI search layer and a compact utility footer.
   Views: DHeader · DHome · DTutorialModal · DFooter
   ============================================================================ */
const { Icon: DI } = window;
const DHUB = window.HUB;
const DFrontifyPage = window.HubFrontifyPage;
const DFrontify = window.HUB_FRONTIFY;

/* Agents "on the platform" = everything actually built (drop idea-stage),
   minus a few hidden from this concept. */
const D_AGENTS = DHUB.AGENTS.filter((a) => a.status !== "idea");
const D_TINT = {};
const D_CATLABEL = {};
DHUB.CATEGORIES.forEach((c) => {D_TINT[c.id] = c.tint;D_CATLABEL[c.id] = c.label;});

function dInitials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const D_RECENT_AGENTS_KEY = "creative-hub:recent-agents";
function dRememberAgent(agentId) {
  if (!agentId) return;
  try {
    const current = JSON.parse(window.localStorage.getItem(D_RECENT_AGENTS_KEY) || "[]");
    const next = [agentId, ...current.filter((id) => id !== agentId)].slice(0, 4);
    window.localStorage.setItem(D_RECENT_AGENTS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("creative-hub:recent-agents", { detail: next }));
  } catch (_) {
    /* Local history is an enhancement; agent links must still work without it. */
  }
}

/* Published stories live in one registry shared by Knowledge and the homepage.
   The newest ISO publication date is always promoted into the carousel. */
const D_PUBLISHED_NEWS_STORIES = [
  {
    id: "gpt-5-6-weekly-update",
    kind: "news",
    articleId: "gpt-5-6-for-immoscout24",
    type: "Weekly announcement",
    icon: "chat",
    title: "GPT‑5.6 for everyday ImmoScout24 work.",
    body: "A practical guide to choosing Luna, Terra or Sol for campaigns, presentations, research and design , without using more capability than the task needs.",
    action: "Read the article",
    accent: "var(--brand-yellow)",
    published: "04.08.26",
    publishedISO: "2026-08-04",
    readTime: "4 min read",
    issueNumber: "5.6",
    coverLabel: "Field guide",
    coverTitle: "Which model for which job?",
    coverSummary: "A field guide for ImmoScout24 teams.",
    coverTags: ["Luna", "Terra", "Sol"],
    footerLabel: "AI update",
    knowledgeId: "gpt-5-6",
    knowledgeTopic: "ai",
    knowledgeLabel: "AI field guide",
    knowledgeSummary: "A practical guide to choosing the right level of capability for the task in front of you.",
    knowledgeMeta: "4 min read · 04 Aug 2026",
  },
  {
    id: "campaign-creation-weekly-update",
    kind: "news",
    articleId: "campaign-creation-at-scout24",
    type: "Latest story",
    icon: "chat",
    title: "From weeks to minutes: AI is transforming campaign creation.",
    body: "How Performance Marketing uses three connected agents to move from campaign idea to production ready assets, and improve live Taboola conversions.",
    action: "Read the story",
    accent: "var(--brand-yellow)",
    published: "05.08.26",
    publishedISO: "2026-08-05",
    readTime: "4 min read",
    issueNumber: "15",
    coverLabel: "Impact story",
    coverTitle: "Three agents. One faster workflow.",
    coverSummary: "From brief to campaign-ready assets.",
    coverTags: ["Imagery", "Resize", "Native ads"],
    visualFlow: ["Campaign brief", "3 connected agents", "Live campaign"],
    visualStats: [
      { value: "2 to 8 wks", label: "Previous turnaround" },
      { value: "15 to 30 min", label: "First concepts" },
      { value: "3 to 4 hrs", label: "Complete asset set" },
    ],
    visualResult: "AI-generated assets delivered more conversions in live Taboola campaigns.",
    footerLabel: "Internal AI",
    knowledgeId: "campaign-creation-at-scout24",
    knowledgeTopic: "internal",
    knowledgeLabel: "Internal impact story",
    knowledgeTitle: "From weeks to minutes: AI campaign creation at Scout24.",
    knowledgeSummary: "How Campaign Creative Studio is helping Performance Marketing turn a campaign brief into initial creative routes in minutes, and validate them in live work.",
    knowledgeMeta: "Internal AI · 4 min read · 05 Aug 2026",
  },
];

const D_LATEST_HOMEPAGE_NEWS = D_PUBLISHED_NEWS_STORIES.reduce((latest, story) => (
  !latest || story.publishedISO > latest.publishedISO ? story : latest
), null);

/* Homepage slider content lives here so announcements and spotlights can be
   refreshed without changing the carousel component itself. */
const HOMEPAGE_SLIDES = [
  {
    id: "hub-command-centre",
    kind: "hub-intro",
    type: "Marketing operating system",
    icon: "premium-2",
    title: "What will you make today?",
    body: "Jump into a trusted AI studio or start with one of the workflows ImmoScout24 teams use most.",
    action: "Explore AI Studio",
    accent: "var(--is24-teal)",
  },
  D_LATEST_HOMEPAGE_NEWS,
  {
    id: "slidedeck-studio-spotlight",
    kind: "agent",
    type: "Featured agent",
    icon: "chat",
    title: "Turn a rough idea into a clear deck.",
    body: "SlideDeck Studio helps you shape a story, organise the content and create an on-brand presentation ready to refine.",
    action: "Open SlideDeck Studio",
    href: "https://slidedeck-studio.scout24.com/",
    accent: "var(--is24-teal)",
    agentId: "slide-deck-studio",
    visual: "deck",
  },
  {
    id: "mockup-studio-spotlight",
    kind: "agent",
    type: "Agent spotlight",
    icon: "picture",
    title: "Make your UI work look unmistakably real.",
    body: "Mockup Studio transforms approved screens into polished product, device and out-of-home visuals while keeping the design intact.",
    action: "Open Mockup Studio",
    href: "#agents",
    accent: "var(--brand-purple)",
    agentId: "ui-mockup-builder",
    visual: "mockup",
  },
];

const D_HERO_ACTIONS = [
  { label: "Build a presentation", meta: "SlideDeck Studio", icon: "dashboard", agentId: "slide-deck-studio" },
  { label: "Create on-brand imagery", meta: "Brand Imagery Builder", icon: "picture", agentId: "is24-imagery" },
  { label: "Find a rule or approved asset", meta: "Ask the Hub", icon: "search", prompt: "Help me find the right brand rule or approved asset." },
];

function DHeroRoute({ action, onOpenStudio, onOpenAssistant }) {
  const agent = action.agentId ? D_AGENTS.find((candidate) => candidate.id === action.agentId) : null;
  const content = <React.Fragment>
    <span><strong>{action.label}</strong><small>{action.meta}</small></span>
    <DI name="arrow-right" size={17} />
  </React.Fragment>;
  if (agent?.link) return <a className="home2-route" href={agent.link} target="_blank" rel="noreferrer" onClick={() => dRememberAgent(agent.id)}>{content}</a>;
  return <button className="home2-route" type="button" onClick={() => action.prompt ? onOpenAssistant?.(action.prompt) : onOpenStudio?.()}>{content}</button>;
}

function DHeroCommandSlide({ item, onOpenStudio, onOpenAssistant, askHubEnabled }) {
  const routes = D_HERO_ACTIONS.filter((action) => askHubEnabled || !action.prompt);
  return <React.Fragment>
    <div className="home2-slide__copy home2-slide__copy--intro">
      <span className="home2-eyebrow">Your creative starting point</span>
      <h2><span>What will you</span><strong>make today?</strong></h2>
      <p>{item.body}</p>
      {askHubEnabled && <button className="home2-command" type="button" onClick={() => onOpenAssistant?.("Help me find the right agent, brand rule or approved asset.")}>
        <span><small>Ask the Hub</small><strong>Find an agent, rule or approved asset</strong></span>
        <kbd>⌘ K</kbd>
      </button>}
      <div className="home2-actions">
        <button className="home2-button home2-button--dark" type="button" onClick={onOpenStudio}>{item.action}<DI name="arrow-right" size={18} /></button>
        <a className="home2-link" href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer">Ask Creative Studio</a>
      </div>
    </div>
    <aside className="home2-start" aria-label="Ways to start">
      <header><span>Start with the outcome</span><b>0{routes.length} routes</b></header>
      <div>{routes.map((action) => <DHeroRoute key={action.label} action={action} onOpenStudio={onOpenStudio} onOpenAssistant={onOpenAssistant} />)}</div>
      <footer>Built for everyday ImmoScout24 marketing work</footer>
    </aside>
  </React.Fragment>;
}

function DNewsVisual({ item }) {
  const flow = item.visualFlow || item.coverTags;
  const stats = item.visualStats || [
    { value: item.issueNumber, label: "Current issue" },
    { value: item.readTime, label: "Reading time" },
    { value: item.coverTags.length, label: "Key takeaways" },
  ];
  return <div className="home2-news-signal" aria-hidden="true">
    <header className="home2-news-signal__header">
      <span>Creative intelligence feed</span>
      <span>{item.published} · {item.readTime}</span>
    </header>
    <div className="home2-news-signal__body">
      <div className="home2-news-signal__story">
        <div className="home2-news-signal__flow">
          {flow.map((step, index) => <React.Fragment key={step}>
            <span className="home2-news-signal__node"><i>0{index + 1}</i><b>{step}</b></span>
            {index < flow.length - 1 && <span className="home2-news-signal__line" />}
          </React.Fragment>)}
        </div>
        <article>
          <span>{item.coverLabel} · Issue {item.issueNumber}</span>
          <strong>{item.coverTitle}</strong>
          <small>{item.coverSummary}</small>
        </article>
      </div>
      <div className="home2-news-signal__metrics">
        <span className="home2-news-signal__metrics-label">Campaign velocity</span>
        {stats.map((stat, index) => <div key={stat.label} className={`home2-news-signal__metric home2-news-signal__metric--${index + 1}`}>
          <span>{stat.label}</span><strong>{stat.value}</strong><i><b /></i>
        </div>)}
      </div>
    </div>
    <footer className="home2-news-signal__footer"><span>{item.visualResult || item.footerLabel}</span><b>Latest signal</b></footer>
    <span className="home2-news-signal__scanner" />
  </div>;
}

function DDeckVisual({ agent }) {
  return <div className="home2-deck-engine" aria-hidden="true">
    <header className="home2-deck-engine__header">
      <span>{agent?.name || "SlideDeck Studio"}</span>
      <span>Story compiler online</span>
    </header>
    <div className="home2-deck-engine__body">
      <aside className="home2-deck-engine__pipeline">
        <small>Narrative pipeline</small>
        {["Brief", "Structure", "Visual system", "Deck"].map((step, index) => <span key={step} className={`home2-deck-engine__step home2-deck-engine__step--${index + 1}`}><i>0{index + 1}</i><b>{step}</b></span>)}
      </aside>
      <div className="home2-deck-engine__workbench">
        <span className="home2-deck-engine__grid" />
        <span className="home2-deck-engine__beam" />
        <div className="home2-deck-engine__stack">
          <div className="home2-deck-sheet home2-deck-sheet--back"><span /><span /><span /></div>
          <div className="home2-deck-sheet home2-deck-sheet--middle"><i /><i /><i /><i /></div>
          <div className="home2-deck-sheet home2-deck-sheet--front">
            <header><span>ImmoScout24</span><b>04 / 12</b></header>
            <strong><span>From rough idea</span><span>to clear story.</span></strong>
            <div><i /><i /><i /></div>
            <footer><span>Campaign presentation</span><b>Ready to refine</b></footer>
          </div>
        </div>
      </div>
    </div>
    <footer className="home2-deck-engine__footer"><span>Storyline</span><span>On-brand design</span><span>Editable PowerPoint</span></footer>
  </div>;
}

function DMockupVisual({ agent }) {
  const outputs = [
    { label: "Floating UI", src: "assets/homepage/mockup-studio/floating-ui.avif" },
    { label: "Device", src: "assets/homepage/mockup-studio/device-detail.avif" },
    { label: "Out of home", src: "assets/homepage/mockup-studio/ooh-lightbox.avif" },
  ];
  return <div className="home2-context-lab" aria-hidden="true">
    <header className="home2-context-lab__header">
      <span>{agent?.name || "Mockup Studio"}</span>
      <span>Spatial render lab</span>
    </header>
    <div className="home2-context-lab__body">
      <div className="home2-context-lab__source"><span>Source UI</span><b>Layout + brand locked</b><i>100%</i></div>
      <div className="home2-context-lab__scene">
        <span className="home2-context-lab__grid" />
        {outputs.map((output, index) => <figure key={output.label} className={`home2-context-lab__output home2-context-lab__output--${index + 1}`}>
          <img src={output.src} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
          <figcaption><span>0{index + 1}</span>{output.label}</figcaption>
        </figure>)}
        <span className="home2-context-lab__focus"><i /><i /><i /><i /></span>
        <span className="home2-context-lab__live">Live render</span>
      </div>
    </div>
    <footer className="home2-context-lab__footer">{outputs.map((output, index) => <span key={output.label} className={`home2-context-lab__mode home2-context-lab__mode--${index + 1}`}>{output.label}</span>)}</footer>
  </div>;
}

function DAgentVisual({ item, agent }) {
  if (item.visual === "deck") return <DDeckVisual agent={agent} />;
  return <DMockupVisual agent={agent} />;
}

function DSlideAction({ item, agent, onOpenNews, onOpenStudio }) {
  const label = <React.Fragment>{item.action}<DI name="arrow-right" size={18} /></React.Fragment>;
  if (item.articleId) return <button className="home2-button home2-button--dark" type="button" onClick={() => onOpenNews?.(item.articleId)}>{label}</button>;
  if (agent?.link) return <a className="home2-button home2-button--dark" href={agent.link} target="_blank" rel="noreferrer" onClick={() => dRememberAgent(agent.id)}>{label}</a>;
  return <button className="home2-button home2-button--dark" type="button" onClick={onOpenStudio}>{label}</button>;
}

function DHomepageSlide({ item, index, count, onOpenNews, onOpenStudio, onOpenAssistant, askHubEnabled }) {
  const agent = item.agentId ? D_AGENTS.find((candidate) => candidate.id === item.agentId) : null;
  const isCommand = item.kind === "hub-intro";
  return <div
    className={`home2-slide home2-slide--${isCommand ? "intro" : item.kind} home2-slide--${item.visual || item.kind}`}
    role="group"
    aria-roledescription="slide"
    aria-label={`${index + 1} of ${count}: ${item.type}`}
    style={{ "--home2-accent": item.accent }}
  >
    {isCommand ? <DHeroCommandSlide item={item} onOpenStudio={onOpenStudio} onOpenAssistant={onOpenAssistant} askHubEnabled={askHubEnabled} /> : <React.Fragment>
      <div className="home2-slide__copy">
        <span className="home2-eyebrow">{item.type}</span>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <div className="home2-actions"><DSlideAction item={item} agent={agent} onOpenNews={onOpenNews} onOpenStudio={onOpenStudio} /></div>
      </div>
      <div className="home2-slide__stage">
        {item.kind === "news" ? <DNewsVisual item={item} /> : <DAgentVisual item={item} agent={agent} />}
      </div>
    </React.Fragment>}
  </div>;
}

function DHomepageSlider({ items, onOpenNews, onOpenStudio, onOpenAssistant, askHubEnabled }) {
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [documentVisible, setDocumentVisible] = React.useState(() => document.visibilityState === "visible");
  const [reduceMotion, setReduceMotion] = React.useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false);
  const pointerStart = React.useRef(null);
  const count = items.length;
  const show = (index) => setActive((index + count) % count);

  React.useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  React.useEffect(() => {
    const update = () => setDocumentVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const autoRunning = !hovered && !focusWithin && !reduceMotion && documentVisible;
  React.useEffect(() => {
    if (!autoRunning || count < 2) return undefined;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % count), 8000);
    return () => window.clearTimeout(timer);
  }, [active, autoRunning, count]);

  if (!count) return null;
  const item = items[active];
  const onKeyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (event.target.closest("a, input, textarea, select") || (event.target.closest("button") && !event.target.closest(".home2-slider__nav"))) return;
    event.preventDefault();
    show(active + (event.key === "ArrowRight" ? 1 : -1));
  };
  const onPointerDown = (event) => {
    if (!event.isPrimary || event.target.closest("a, button, input, textarea, select")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) show(active + (deltaX < 0 ? 1 : -1));
  };

  return <section className={`home2-slider${autoRunning ? " is-auto-running" : " is-auto-paused"}`} aria-label="Marketing Hub highlights" aria-roledescription="carousel" tabIndex="0" onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { pointerStart.current = null; }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocusWithin(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}>
    <DHomepageSlide key={item.id} item={item} index={active} count={count} onOpenNews={onOpenNews} onOpenStudio={onOpenStudio} onOpenAssistant={onOpenAssistant} askHubEnabled={askHubEnabled} />
    <p className="sr-only" aria-live={autoRunning ? "off" : "polite"} aria-atomic="true">Slide {active + 1} of {count}: {item.type}</p>
    <div className="home2-slider__nav" role="group" aria-label="Choose a hero slide">
      {items.map((slide, index) => <button type="button" key={slide.id} className={index === active ? "is-active" : ""} onClick={() => show(index)} aria-current={index === active ? "true" : undefined} aria-label={`Show slide ${index + 1}: ${slide.type}`}><span /><span className="sr-only">{slide.type}</span></button>)}
    </div>
  </section>;
}

/* ---------------------------------------------------------------- Header */
function dMenuGroups(items) {
  const groups = [];
  let current = null;
  items.forEach((item) => {
    if (item.type === "group") {
      current = { label: item.label, items: [] };
      groups.push(current);
    } else {
      if (!current) { current = { label: "Pages", items: [] }; groups.push(current); }
      current.items.push(item);
    }
  });
  return groups;
}

function DHeader({ goHome, goSection, activeSection, activePageKey, onNavigationChange, language, onLanguageChange }) {
  const [open, setOpen] = React.useState(null);
  const [sectionDrawerDismissed, setSectionDrawerDismissed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const menuToggleRef = React.useRef(null);
  const triggerRefs = React.useRef({});
  const nav = DFrontify.buildHubNavigation();
  const disabledSections = new Set(["assets"]);
  const persistentSections = new Set(["brand", "community"]);
  const persistentSection = persistentSections.has(activeSection) && !sectionDrawerDismissed ? activeSection : null;
  const drawerSection = open || persistentSection;
  const brandOverview = { key: "hub::56", label: "Brand Overview", source: "hub" };
  const mediaOverview = { key: "hub::69", label: "Media Library", source: "hub" };
  const openMenu = (id) => {
    if (persistentSections.has(id)) {
      setSectionDrawerDismissed(false);
      setOpen(null);
      setMobileNavOpen(false);
      goSection(id, id === "brand" ? brandOverview : undefined);
      return;
    }
    if (id === "assets") {
      goSection("assets", mediaOverview);
      setOpen(null);
      return;
    }
    setOpen(id);
  };
  const toggleMenu = (id) => { if (open === id) setOpen(null); else openMenu(id); };
  const closeDrawer = (restoreFocus = true) => {
    if (!drawerSection) return;
    const trigger = triggerRefs.current[drawerSection];
    setOpen(null);
    if (persistentSections.has(drawerSection)) setSectionDrawerDismissed(true);
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus());
  };
  React.useEffect(() => { onNavigationChange?.(Boolean(drawerSection)); }, [drawerSection, onNavigationChange]);
  React.useEffect(() => () => onNavigationChange?.(false), [onNavigationChange]);
  React.useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (drawerSection) {
        closeDrawer(true);
        return;
      }
      if (mobileNavOpen) {
        setMobileNavOpen(false);
        window.requestAnimationFrame(() => menuToggleRef.current?.focus());
      }
    };
    const closeOutside = (event) => {
      if (headerRef.current?.contains(event.target)) return;
      if (open) setOpen(null);
      if (mobileNavOpen) setMobileNavOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [drawerSection, open, mobileNavOpen]);
  React.useEffect(() => {
    setSectionDrawerDismissed(false);
    setMobileNavOpen(false);
    setOpen(null);
  }, [activeSection]);
  React.useEffect(() => {
    setMobileNavOpen(false);
    setOpen(null);
  }, [activePageKey]);
  return (
    <header className={`dv-header${activeSection === "home" ? " is-home-overlay" : ""}${mobileNavOpen ? " is-mobile-nav-open" : ""}${drawerSection ? " has-section-drawer" : ""}`} ref={headerRef} onBlur={(event) => {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      if (open) setOpen(null);
      if (mobileNavOpen) setMobileNavOpen(false);
    }}>
      <button className="dv-brand dv-brand--separate" type="button" onClick={() => { setOpen(null); setMobileNavOpen(false); goHome(); }} aria-label="ImmoScout24 , back to the Hub homepage">
        <span className="hub-logo hub-logo--header" role="img" aria-label="ImmoScout24"></span>
      </button>
      <div className="wrap dv-header__inner dv-nav-shell">
        <button ref={menuToggleRef} type="button" className="dv-menu-toggle" aria-label={mobileNavOpen ? "Close main navigation" : "Open main navigation"} aria-expanded={mobileNavOpen} aria-controls="dv-main-navigation" onClick={() => setMobileNavOpen((value) => !value)}><span className="dv-menu-toggle__icon" aria-hidden="true"><i /><i /><i /></span><span>{mobileNavOpen ? "Close" : "Menu"}</span></button>
        <nav className="dv-nav" id="dv-main-navigation" aria-label="Main navigation">
          {[['create','Create / AI Studio'],['brand','Brand'],['assets','Assets'],['knowledge','Knowledge'],['community','Community']].map(([id, label]) => {
            const menuId = `dv-nav-menu-${id}`;
            const isOpen = drawerSection === id;
            const groups = dMenuGroups(nav[id]);
            const isDisabled = disabledSections.has(id);
            const opensDirectly = id === "create" || id === "knowledge";
            return <div className="dv-nav__item" key={id}>
              <button
                ref={(node) => { triggerRefs.current[id] = node; }}
                className={`${activeSection === id ? 'is-active' : ''}${isOpen ? ' is-open' : ''}`.trim()}
                type="button"
                disabled={isDisabled}
                aria-current={activeSection === id ? "page" : undefined}
                aria-expanded={opensDirectly || isDisabled ? undefined : isOpen}
                aria-controls={opensDirectly || isDisabled ? undefined : menuId}
                onClick={() => {
                  if (opensDirectly) {
                    setOpen(null);
                    setMobileNavOpen(false);
                    goSection(id);
                    return;
                  }
                  toggleMenu(id);
                }}
                onKeyDown={(event) => {
                  if (opensDirectly || isDisabled) return;
                  if (event.key !== "ArrowDown") return;
                  event.preventDefault();
                  openMenu(id);
                  window.requestAnimationFrame(() => document.querySelector(`#${menuId} .dv-nav__drawer-links button:not(:disabled)`)?.focus());
                }}
              >{label}</button>
              {isOpen && !opensDirectly && !isDisabled && <aside className="dv-nav__submenu" id={menuId} aria-label={`${label} navigation`}>
                <div className="dv-nav__drawer-head">
                  <div><span>Navigation</span><strong>{label}</strong></div>
                  <button className="dv-nav__drawer-close" type="button" onClick={() => closeDrawer(true)} aria-label={`Close ${label} navigation`}><DI name="cancel" size={15}/></button>
                </div>
                <div className="dv-nav__drawer-scroll">
                  {groups.map((group) => <section className="dv-nav__drawer-links" aria-labelledby={`${menuId}-${group.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} key={group.label}>
                    <span className="dv-nav__group" id={`${menuId}-${group.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>{group.label}</span>
                    {group.items.map((item) => {
                      const openAvailablePage = () => {
                        setOpen(null);
                        setMobileNavOpen(false);
                        goSection(id, item);
                      };
                      return <button type="button" className={item.key === activePageKey ? "is-active" : ""} aria-current={item.key === activePageKey ? "page" : undefined} key={item.key} onPointerDown={(event) => {
                        event.preventDefault();
                        openAvailablePage();
                      }} onClick={() => {
                        openAvailablePage();
                      }}>{item.label}<DI name="arrow-right" size={13}/></button>;
                    })}
                  </section>)}
                </div>
              </aside>}
            </div>;
          })}
        </nav>
      </div>
      <div className="dv-language" role="group" aria-label="Language selector">
        <button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => onLanguageChange("en")}>EN</button>
        <span aria-hidden="true">/</span>
        <button type="button" className={language === "de" ? "is-active" : ""} aria-pressed={language === "de"} onClick={() => onLanguageChange("de")}>DE</button>
      </div>
    </header>);

}

function DEmptyPage({ section, pageKey, title, onNavigate }) { return <DFrontifyPage section={section} pageKey={pageKey} title={title} onNavigate={onNavigate} />; }

const D_SHOWCASE_TINTS = ["var(--is24-teal)", "var(--is24-purple)", "var(--is24-yellow)", "var(--is24-blue)", "var(--is24-orange)", "var(--is24-sand)"];

function DShowcaseCard({ agent, index, clone, onTutorial }) {
  return <article className="home2-agent-card" style={{"--home2-card-accent": D_SHOWCASE_TINTS[index % D_SHOWCASE_TINTS.length]}} aria-hidden={clone || undefined}>
    <div className="home2-agent-card__visual"><DI name={agent.icon} size={52}/></div>
    <div className="home2-agent-card__body"><h3>{agent.name}</h3><p>{agent.what}</p></div>
    <div className="home2-agent-card__actions">
      <button type="button" tabIndex={clone ? -1 : undefined} onClick={() => onTutorial(agent)}>Tutorial</button>
      {agent.link && <a href={agent.link} target="_blank" rel="noreferrer" tabIndex={clone ? -1 : undefined} onClick={() => dRememberAgent(agent.id)}>Open agent <DI name="arrow-right" size={15}/></a>}
    </div>
  </article>;
}

function DHeroAgentRail({ onTutorial, onOpenStudio }) {
  const agents = D_AGENTS.filter((agent) => agent.status === "live");
  const [revealed, setRevealed] = React.useState(() => window.scrollY > 12);
  React.useEffect(() => {
    const updateReveal = () => setRevealed(window.scrollY > 12);
    updateReveal();
    window.addEventListener("scroll", updateReveal, { passive: true });
    return () => window.removeEventListener("scroll", updateReveal);
  }, []);
  return <section className={`home2-agents${revealed ? " is-revealed" : ""}`} id="agents" aria-label="Explore agents">
    <div className="home2-agent-rail" tabIndex="0" aria-label="Featured agents. The rail moves slowly and pauses when focused or hovered; scroll horizontally to explore.">
      <div className="home2-agent-track">
        <div className="home2-agent-set">{agents.map((agent, index) => <DShowcaseCard key={agent.id} agent={agent} index={index} onTutorial={onTutorial}/>)}</div>
        <div className="home2-agent-set" aria-hidden="true">{agents.map((agent, index) => <DShowcaseCard key={`${agent.id}-clone`} agent={agent} index={index} clone onTutorial={onTutorial}/>)}</div>
      </div>
    </div>
    <div className="wrap home2-agents__action"><button type="button" onClick={onOpenStudio}>View all agents <DI name="arrow-right" size={17}/></button></div>
  </section>;
}

/* ----------------------------------------------------------- Marquee band */
function DMarquee() {
  const items = ["Rough brief in, on-brand asset out", "AI agents for everyday marketing work", "From idea to first draft in minutes", "On brand, every single time", "Tested on real marketing use cases", "Built & maintained by Creative Studio"];
  const run = (key) =>
  <div className="dv-marquee__run" key={key} aria-hidden={key !== "a"}>
      {items.map((t, i) =>
    <span className="dv-marquee__item" key={i}>
          {t}<span className="dv-marquee__star">✦</span>
        </span>
    )}
    </div>;

  return (
    <div className="dv-marquee" role="presentation">
      <div className="dv-marquee__track">{run("a")}{run("b")}</div>
    </div>);

}

/* ------------------------------------------------------------ Agent card */
function DCard({ agent, onTutorial, index }) {
  const tint = D_TINT[agent.categories[0]] || "var(--is24-teal)";
  return (
    <article className="dv-card reveal" style={{ "--tint": tint }}>
      <div className="dv-card__head">
        <span className="dv-card__icon"><DI name={agent.icon} size={30} /></span>
        <div className="dv-card__cats">
          <span className="dv-card__cat" style={{ "--cat-tint": D_TINT[agent.categories[0]] || "var(--is24-teal)" }}>{D_CATLABEL[agent.categories[0]]}</span>
        </div>
      </div>
      <div className="dv-card__body">
        <h3>{agent.name}</h3>
        <p className="dv-card__what">{agent.what}</p>
        <div className="dv-card__owner">
          <span><b>{agent.owner}</b> · Creative Studio</span>
        </div>
      </div>
      <div className="dv-card__actions">
        <button className="btn btn--ghost btn--sm btn--tut" onClick={() => onTutorial(agent)}>
          <DI name="education" size={16} /> Tutorial
        </button>
        {agent.link ?
        <a className="btn btn--brand btn--sm" href={agent.link} target="_blank" rel="noreferrer">
            Open agent <DI name="arrow-right" size={16} />
          </a> :

        <span className="btn btn--soon btn--sm" aria-disabled="true">
            <span className="dot" /> Coming soon
          </span>
        }
      </div>
    </article>);

}

function DStudioCard({ agent, onTutorial, index }) {
  const tint = D_TINT[agent.categories[0]] || D_SHOWCASE_TINTS[index % D_SHOWCASE_TINTS.length];
  const status = DHUB.STATUS[agent.status]?.label || agent.status;
  const launchLink = agent.id === "lp-builder" ? null : agent.link;
  return <article className="studio2-card" style={{"--studio2-accent":tint}}>
    <div className="studio2-card__head">
      <span className="studio2-card__icon"><DI name={agent.icon} size={29}/></span>
      <div className="studio2-card__meta">
        <span>{agent.categories.map((category) => D_CATLABEL[category]).filter(Boolean).join(" · ")}</span>
        <small className={`is-${agent.status}`}>{status}</small>
      </div>
    </div>
    <div className="studio2-card__body">
      <h2>{agent.name}</h2>
      <p>{agent.what}</p>
      <small>Owner · {agent.owner}</small>
    </div>
    <div className="studio2-card__actions">
      <button type="button" onClick={() => onTutorial(agent)}><DI name="education" size={16}/> Tutorial</button>
      {launchLink
        ? <a href={launchLink} target="_blank" rel="noreferrer" onClick={() => dRememberAgent(agent.id)}>Open agent <DI name="arrow-right" size={16}/></a>
        : <span aria-disabled="true">{agent.id === "lp-builder" ? "Link unavailable" : "Coming soon"}</span>}
    </div>
  </article>;
}

function DAgentCatalog({ agents, filter, setFilter, q, setQ, cats, counts, onTutorial }) {
  const query = q.trim();
  const controlsRef = React.useRef(null);
  const agentEndRef = React.useRef(null);
  const [dockOffset, setDockOffset] = React.useState(0);

  React.useEffect(() => {
    const updateDock = () => {
      const controls = controlsRef.current;
      const end = agentEndRef.current;
      if (!controls || !end) return;
      const bottomGap = window.innerWidth <= 800 ? 12 : 18;
      const defaultTop = window.innerHeight - bottomGap - controls.offsetHeight;
      const dockTop = end.getBoundingClientRect().top + bottomGap;
      const nextOffset = Math.min(0, Math.round(dockTop - defaultTop));
      setDockOffset((current) => current === nextOffset ? current : nextOffset);
    };
    updateDock();
    window.addEventListener("scroll", updateDock, { passive: true });
    window.addEventListener("resize", updateDock);
    return () => {
      window.removeEventListener("scroll", updateDock);
      window.removeEventListener("resize", updateDock);
    };
  }, [agents.length]);
  return <main className="studio2" id="all-agents">
    <section className="studio2-hero" aria-labelledby="studio2-title">
      <div className="wrap studio2-hero__layout">
        <div>
          <span className="studio2-eyebrow"><i/> Create / AI Studio</span>
          <h1 id="studio2-title" tabIndex="-1">Find the right specialist for the work.</h1>
        </div>
        <div className="studio2-hero__intro">
          <p>Browse every published Creative Studio agent, from presentation and imagery tools to automation, adaptation and brand guidance.</p>
        </div>
      </div>
    </section>

    <section className="studio2-browser" aria-label="Browse all agents">
      <div className="wrap">
        <div ref={controlsRef} className={`studio2-controls${dockOffset < 0 ? " is-docked" : ""}`} style={{"--studio2-controls-dock": `${dockOffset}px`}} id="studio2-controls" role="search" aria-label="Search and filter agents">
          <div className="studio2-filter-groups">
            <div><div className="studio2-filters" role="group" aria-label="Filter by work type">
              <button type="button" className={filter === "all" ? "is-active" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All <span>{counts.all}</span></button>
              {cats.map((category) => <button type="button" key={category.id} className={filter === category.id ? "is-active" : ""} aria-pressed={filter === category.id} onClick={() => setFilter(category.id)}>{category.label} <span>{counts[category.id]}</span></button>)}
            </div></div>
          </div>
          <div className="studio2-search">
            <DI name="search" size={22}/>
            <label htmlFor="studio2-search-input"><small className="sr-only">Search agents</small><input id="studio2-search-input" type="search" value={q} placeholder="Search…" onChange={(event) => setQ(event.target.value)}/></label>
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear agent search"><DI name="cancel" size={15}/></button>}
          </div>
        </div>

        {(filter !== "all" || q) && <div className="studio2-results" aria-live="polite" aria-atomic="true">
          <button type="button" onClick={() => {setFilter("all");setQ("");}}>Reset filters</button>
        </div>}

        {agents.length > 0
          ? <div className="studio2-grid">{agents.map((agent, index) => <DStudioCard agent={agent} key={agent.id} index={index} onTutorial={onTutorial}/>)}</div>
          : <div className="studio2-empty"><DI name="search" size={34}/><h2>No specialists found.</h2><p>Try a broader term or reset the filters.</p><button type="button" onClick={() => {setFilter("all");setQ("");}}>Show all agents</button></div>}
        <div className="studio2-controls-stop" ref={agentEndRef} aria-hidden="true" />
        <aside className="studio2-help"><span>Not sure which specialist fits?</span><div><h2>Bring the task.<br/>We’ll help with the route.</h2><a href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer">Talk to Creative Studio <DI name="arrow-right" size={17}/></a></div></aside>
      </div>
    </section>
  </main>;
}

/* ------------------------------------------------------------- Home/gallery */
function DHomeDashboardLegacy({ onTutorial, onOpenStudio, onOpenAssistant }) {
  const spotlight = D_AGENTS.filter((a) => a.featured).slice(0, 3);
  const recent = D_AGENTS.slice(0, 4);
  const trending = D_AGENTS.slice(3, 6);
  const actions = [
    ["Find an agent", "search", "Describe the outcome you need", onOpenAssistant],
    ["Start a campaign", "edit", "Move from brief to first draft", onOpenStudio],
    ["Explore resources", "picture", "Find prompts and workflows", () => document.getElementById("resources")?.scrollIntoView({behavior:"smooth"})],
    ["Ask Creative Studio", "chat", "Get help from the team", () => window.open("https://scout24.slack.com/archives/C026PM1HP2N", "_blank")],
  ];
  const agentActions = (agent) => <div className="home-agent-actions">
    <button type="button" onClick={() => onTutorial(agent)}>Tutorial</button>
    {agent.link && <a href={agent.link} target="_blank" rel="noreferrer">Open agent <DI name="arrow-right" size={14}/></a>}
  </div>;

  return <main className="dh-home home-story">
    <section className="home-section home-dashboard" id="dashboard">
      <div className="wrap">
        <header className="home-section-head">
          <span>Dashboard / 02</span>
          <div><h2>Choose the work.<br/>Meet the right agent.</h2><p>Start with the outcome you need. Every agent includes a short tutorial, a clear purpose and a direct path into the tool.</p></div>
          <button className="home-inline-link" type="button" onClick={onOpenStudio}>View all agents <DI name="arrow-right" size={16}/></button>
        </header>
        <div className="home-dashboard-grid">
          <article className="home-dashboard-intro">
            <span className="home-dashboard-intro__mark">AI</span>
            <div><small>Your starting point</small><h3>What do you want to make today?</h3><p>Pick a specialist below or open the full studio when you already know what you need.</p></div>
            <button type="button" onClick={onOpenStudio}>Open AI Studio <DI name="arrow-right" size={18}/></button>
          </article>
          <div className="home-dashboard-agents">
            {spotlight.map((agent, index) => <article className="home-dashboard-agent" key={agent.id} style={{"--tint":D_TINT[agent.categories[0]]}}>
              <div className="home-dashboard-agent__top"><span>0{index + 1}</span><i><DI name={agent.icon} size={24}/></i></div>
              <small>{D_CATLABEL[agent.categories[0]]}</small><h3>{agent.name}</h3><p>{agent.what}</p>{agentActions(agent)}
            </article>)}
          </div>
        </div>
      </div>
    </section>

    <section className="home-section home-updates" id="recently-updated">
      <div className="wrap">
        <header className="home-section-head home-section-head--compact"><span>Recently updated / 03</span><div><h2>New, improved,<br/>ready to use.</h2><p>See what changed and jump straight into the latest tools.</p></div></header>
        <div className="home-update-list">{recent.map((agent, index) => <button type="button" key={agent.id} onClick={() => onTutorial(agent)}>
          <b>0{index + 1}</b><span className="home-update-list__icon" style={{"--tint":D_TINT[agent.categories[0]]}}><DI name={agent.icon} size={22}/></span><span><small>Updated · {D_CATLABEL[agent.categories[0]]}</small><strong>{agent.name}</strong></span><em>{agent.tags.slice(0, 2).join(" / ")}</em><DI name="arrow-right" size={18}/>
        </button>)}</div>
      </div>
    </section>

    <section className="home-section home-continue" id="continue-working">
      <div className="wrap home-continue__grid">
        <div className="home-continue__index"><span>Continue working / 04</span><b>↳</b></div>
        <div className="home-continue__copy"><small>Return to your workspace</small><h2>Keep the momentum.</h2><p>Continue with your agents, tutorials and saved starting points without searching for them again.</p></div>
        <button type="button" onClick={onOpenStudio}><span>Continue in AI Studio</span><DI name="arrow-right" size={20}/></button>
      </div>
    </section>

    <section className="home-section home-resources" id="resources">
      <div className="wrap">
        <header className="home-section-head home-section-head--light"><span>New resources / 05</span><div><h2>Less blank page.<br/>More useful starts.</h2><p>Practical guidance for getting from an idea to a strong first result.</p></div></header>
        <div className="home-resource-grid">
          {[['01','education','Agent tutorials','Short walkthroughs that show what to provide and what a useful output looks like.'],['02','document-empty','Prompt library','Reusable starting points for common marketing jobs, ready to adapt.'],['03','service-security-check','Workflow library','Repeatable, on-brand paths from brief to review-ready asset.']].map(([number, icon, title, copy]) => <article key={title}>
            <span>{number}</span><i><DI name={icon} size={28}/></i><div><h3>{title}</h3><p>{copy}</p></div><button type="button" onClick={onOpenStudio} aria-label={`Explore ${title}`}>Explore <DI name="arrow-right" size={15}/></button>
          </article>)}
        </div>
      </div>
    </section>

    <section className="home-section home-trending" id="trending">
      <div className="wrap">
        <header className="home-section-head"><span>Trending / 06</span><div><h2>What teams are<br/>using right now.</h2><p>Three tools gaining momentum across everyday marketing work.</p></div></header>
        <div className="home-trending-grid">{trending.map((agent, index) => <article key={agent.id} style={{"--tint":D_TINT[agent.categories[0]]}}>
          <div className="home-trending-card__visual"><span>0{index + 1}</span><DI name={agent.icon} size={index === 0 ? 64 : 46}/></div>
          <small>Trending in {D_CATLABEL[agent.categories[0]]}</small><h3>{agent.name}</h3><p>{agent.what}</p>{agentActions(agent)}
        </article>)}</div>
      </div>
    </section>

    <section className="home-section home-search" id="search">
      <div className="wrap home-search__grid">
        <span>Search / 07</span>
        <div><h2>Start with what<br/>you need to make.</h2><p>Search by task, channel or output. We’ll take you to the right agent or resource.</p></div>
        <button type="button" onClick={onOpenAssistant}><DI name="search" size={22}/><span>Ask the Hub , rules, assets and agents</span><kbd>⌘ K</kbd></button>
      </div>
    </section>

    <section className="home-section home-actions" id="quick-actions">
      <div className="wrap">
        <header className="home-section-head home-section-head--compact"><span>Quick actions / 08</span><div><h2>One clear<br/>next step.</h2><p>Choose where you want to begin.</p></div></header>
        <div className="home-action-grid">{actions.map(([label, icon, copy, action], index) => <button type="button" key={label} onClick={action} style={{"--action-index":index}}>
          <span className="home-action-grid__top"><b>0{index + 1}</b><DI name={icon} size={24}/></span><span><strong>{label}</strong><em>{copy}</em></span><DI name="arrow-right" size={18}/>
        </button>)}</div>
      </div>
    </section>
  </main>;
}

function DHomeDashboard({ onTutorial, onOpenStudio, onOpenAssistant, onOpenNews, askHubEnabled }) {
  const byId = (id) => D_AGENTS.find((agent) => agent.id === id);
  const slideDeck = byId("slide-deck-studio");
  const imagery = byId("is24-imagery");
  const picks = [byId("loft-ad-designer"), byId("video-endcard-editor"), byId("ae-expression")].filter(Boolean);
  const updateGroups = [
    { icon: "add-glyph", label: "New AI products", kicker: "In development", description: "Fresh tools moving from useful idea to trusted release.", tone: "purple", items: ["Campaign Brief Generator", "Image Style Explorer", "Social Caption Generator"] },
    { icon: "stopwatch", label: "Coming soon", kicker: "", description: "A clear view of what Creative Studio is preparing next.", tone: "charcoal", items: ["AI Video Studio", "Personal Dashboard", "Workflow Builder"] },
  ];
  const outcomes = [
    { number: "01", icon: "dashboard", title: "Build a presentation", copy: "Shape the story and export an on-brand deck.", href: slideDeck?.link, agentId: slideDeck?.id },
    { number: "02", icon: "edit", title: "Plan campaign work", copy: "Describe the brief and let the Hub route the next step.", prompt: "I need to plan a campaign. Help me choose the right agent, workflow and starting assets." },
    { number: "03", icon: "picture", title: "Create an image", copy: "Generate photorealistic, on-brand campaign imagery.", href: imagery?.link, agentId: imagery?.id },
    { number: "04", icon: "premium-2", title: "Check a brand rule", copy: "Get the exact guidance and its source, without hunting through pages.", prompt: "Find the exact ImmoScout24 brand rule I need and show me the source." },
    { number: "05", icon: "search", title: "Find an approved asset", copy: "Search icons, logos and media by describing what you need.", prompt: "Help me find and download the right approved asset." },
  ];
  const promptExamples = [
    "What teal can I use on a dark background?",
    "Find a white 48px search icon",
    "Which agent should build campaign imagery?",
  ];
  const renderOutcome = (outcome) => {
    const isDisabled = !outcome.href && !askHubEnabled;
    const content = <React.Fragment><span>{outcome.number}</span><i><DI name={outcome.icon} size={25}/></i><div><h3>{outcome.title}</h3><p>{outcome.copy}</p>{isDisabled && <small className="home2-outcome-soon">Coming soon</small>}</div>{isDisabled ? <span aria-hidden="true" /> : <DI name="arrow-right" size={19}/>}</React.Fragment>;
    return outcome.href
      ? <a key={outcome.number} href={outcome.href} target="_blank" rel="noreferrer" onClick={() => outcome.agentId && dRememberAgent(outcome.agentId)}>{content}</a>
      : <button key={outcome.number} type="button" disabled={isDisabled} onClick={() => onOpenAssistant?.(outcome.prompt)}>{content}</button>;
  };

  return <div className="home2-main">
    <section className="home2-outcomes" id="dashboard" aria-labelledby="home2-outcomes-title">
      <div className="wrap">
        <header className="home2-section-heading home2-section-heading--dashboard home2-section-heading--unlabelled">
          <div><h2 id="home2-outcomes-title">Start with the work. Not the tool.</h2><p>Choose the outcome you need. Live routes go straight to a trusted specialist, while planned routes are marked clearly.</p></div>
        </header>
        <div className="home2-outcome-grid">
          <article className="home2-outcome-intro">
            <small>A curated starting point</small>
            <h3>One job. The right specialist.</h3>
            <p>Browse trusted Creative Studio agents by the outcome you need, with tutorials beside every tool.</p>
            <button type="button" onClick={onOpenStudio}>Explore all agents <DI name="arrow-right" size={18}/></button>
          </article>
          <div className="home2-outcome-list">{outcomes.map(renderOutcome)}</div>
        </div>
      </div>
    </section>

    <section className="home2-updates" id="recently-updated" aria-labelledby="home2-updates-title">
      <div className="wrap">
        <header className="home2-section-heading home2-section-heading--unlabelled">
          <div><h2 id="home2-updates-title">What’s new. Ready to use.</h2><p>A new release to use now, plus a clear view of what Creative Studio is preparing next.</p></div>
        </header>
        <div className="home2-update-grid">
          {slideDeck && <article className="home2-update-card home2-update-card--release">
            <span className="home2-update-card__meta"><b>Featured release</b><DI name={slideDeck.icon} size={24}/></span>
            <div><small>Presentation Studio</small><h3>SlideDeck Studio 2.0</h3><p>Generate presentations from a brief.</p></div>
            <a className="home2-update-card__action" href={slideDeck.link} target="_blank" rel="noreferrer" onClick={() => dRememberAgent(slideDeck.id)}>Open <DI name="arrow-right" size={17}/></a>
          </article>}
          {updateGroups.map((group) => <article className={`home2-update-card home2-update-card--group home2-update-card--${group.tone}`} key={group.label}>
            <div className="home2-update-card__intro">{group.kicker && <small>{group.kicker}</small>}<h3>{group.label}</h3><p>{group.description}</p></div>
            <ul>{group.items.map((item, itemIndex) => <li key={item}><span>{String(itemIndex + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <section className="home2-picks" id="trending" aria-labelledby="home2-picks-title">
      <div className="wrap home2-picks__layout">
        <header><h2 id="home2-picks-title">Specialist tools for the jobs between the big jobs.</h2><p>Selected by Creative Studio, not ranked by invented popularity data.</p></header>
        <div className="home2-pick-list">{picks.map((agent) => <article key={agent.id}>
          <div><h3>{agent.name}</h3><p>{agent.what}</p></div><div><button type="button" onClick={() => onTutorial(agent)}>Tutorial</button>{agent.link && <a href={agent.link} target="_blank" rel="noreferrer" onClick={() => dRememberAgent(agent.id)} aria-label={`Open ${agent.name}`}><DI name="arrow-right" size={18}/></a>}</div>
        </article>)}</div>
      </div>
    </section>

    {askHubEnabled && <section className="home2-assistant" id="search" aria-labelledby="home2-assistant-title">
      <div className="wrap home2-assistant__layout">
        <span>Ask the Hub / 05</span>
        <div className="home2-assistant__copy"><small>Answers that lead somewhere</small><h2 id="home2-assistant-title">Ask once. Get the rule, asset or next action.</h2><p>The AI layer searches the Hub’s agents, guidance and local asset library, shows where an answer came from, and lets you act without navigating the site first.</p></div>
        <div className="home2-assistant__panel">
          <button className="home2-assistant__command" type="button" onClick={() => onOpenAssistant?.(promptExamples[0])}><DI name="search" size={22}/><span>Ask a question or describe an asset</span><kbd>⌘ K</kbd></button>
          <div>{promptExamples.map((prompt) => <button type="button" key={prompt} onClick={() => onOpenAssistant?.(prompt)}>{prompt}<DI name="arrow-right" size={14}/></button>)}</div>
        </div>
      </div>
    </section>}

    <section className="home2-final" id="quick-actions">
      <div className="wrap home2-final__layout">
        <div><span>Ready when you are</span><h2>Make the next thing easier to make.</h2></div>
        <div className="home2-final__actions">
          <button type="button" onClick={onOpenStudio}>Explore AI Studio <DI name="arrow-right" size={18}/></button>
          {askHubEnabled && <button type="button" onClick={() => onOpenAssistant?.("Help me choose the best next step for my marketing task.")}>Ask the Hub <DI name="search" size={17}/></button>}
          <a href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer">Talk to Creative Studio <DI name="chat" size={17}/></a>
        </div>
      </div>
    </section>
  </div>;
}

function DHome({ onTutorial, showStudio, onOpenStudio, onOpenNews, onOpenAssistant, askHubEnabled }) {
  const [filter, setFilter] = React.useState("all");
  const [q, setQ] = React.useState("");

  const counts = React.useMemo(() => {
    const m = { all: D_AGENTS.length };
    DHUB.CATEGORIES.forEach((c) => {m[c.id] = D_AGENTS.filter((a) => a.categories.includes(c.id)).length;});
    return m;
  }, []);
  const cats = DHUB.CATEGORIES.filter((c) => counts[c.id] > 0);

  // The shared scroll-reveal observer only runs once, so cards re-rendered when
  // the filter / search changes never get `.in` and stay invisible. After the
  // first paint, force any freshly-rendered gallery cards visible.
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    document.querySelectorAll(".dv-gallery .dv-card.reveal").forEach((el) => el.classList.add("in"));
  }, [filter, q]);

  let shown = filter === "all" ? D_AGENTS : D_AGENTS.filter((a) => a.categories.includes(filter));
  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    shown = shown.filter((a) => {
      const sourceValues = [
        a.name,
        a.what,
        ...a.tags,
        a.owner,
        ...a.audience,
        ...a.target,
        ...a.categories.map((category) => D_CATLABEL[category] || category),
      ];
      const bilingualSearchText = sourceValues
        .flatMap((value) => [value, window.HubLanguage.translate(value, "de")])
        .join(" ")
        .toLowerCase();
      return bilingualSearchText.includes(needle);
    });
  }

  return (
    <React.Fragment>
      {!showStudio && <main className="home2-page"><h1 className="sr-only">ImmoScout24 Creative Hub , make the next thing easier to make.</h1><DHomepageSlider items={HOMEPAGE_SLIDES} onOpenNews={onOpenNews} onOpenStudio={onOpenStudio} onOpenAssistant={onOpenAssistant} askHubEnabled={askHubEnabled} /><DHeroAgentRail onTutorial={onTutorial} onOpenStudio={onOpenStudio} /><DHomeDashboard onTutorial={onTutorial} onOpenStudio={onOpenStudio} onOpenAssistant={onOpenAssistant} onOpenNews={onOpenNews} askHubEnabled={askHubEnabled} /></main>}

      {showStudio && <DAgentCatalog agents={shown} filter={filter} setFilter={setFilter} q={q} setQ={setQ} cats={cats} counts={counts} onTutorial={onTutorial}/>}

    </React.Fragment>);

}

/* --------------------------------------------------------------- Hub news */
function DNewsArticle({ articleId, onBack, onOpenStudio }) {
  if (articleId === "campaign-creation-at-scout24") return <DCampaignCreationArticle onBack={onBack} onOpenStudio={onOpenStudio} />;
  const modelCards = [
    {
      name: "Luna",
      label: "Fast and focused",
      tint: "var(--brand-yellow)",
      summary: "Use it for clear, contained tasks where speed matters more than deep exploration.",
      examples: ["Summarise a short document", "Create copy variants from an approved message", "Reformat or classify existing content"],
    },
    {
      name: "Terra",
      label: "The everyday default",
      tint: "var(--is24-teal)",
      summary: "A strong starting point for most knowledge and creative work across ImmoScout24 teams.",
      examples: ["Draft a campaign brief", "Turn meeting notes into actions", "Develop email or social concepts"],
    },
    {
      name: "Sol",
      label: "For complex work",
      tint: "var(--brand-purple)",
      summary: "Choose it when the task has multiple sources, important trade-offs or a high quality bar.",
      examples: ["Build a presentation narrative", "Research and compare options", "Prototype and test a digital experience"],
    },
  ];
  const taskRows = [
    ["A quick summary or copy variation", "Luna · light or medium", "Give it the approved source text and the exact output format."],
    ["A campaign brief or structured first draft", "Terra · medium", "Add the audience, objective, channel, constraints and examples."],
    ["A strategic recommendation or polished deliverable", "Sol · high", "Provide the real sources and template; ask for evidence, assumptions and alternatives."],
  ];
  const chapters = [
    ["news2-intro", "In one minute"],
    ["choose-a-model", "Choose a model"],
    ["choose-an-effort-level", "Decision guide"],
    ["news2-guardrails", "Guardrails"],
  ];

  return <main className="news2" id="news-article" data-article-id={articleId}>
    <article aria-labelledby="news2-title">
      <header className="news2-hero">
        <div className="wrap">
          <div className="news2-utility">
            <button type="button" onClick={onBack}><DI name="arrow-left" size={16}/> Back to homepage</button>
            <span>Creative Hub weekly · Issue 01</span>
          </div>
          <div className="news2-hero__layout">
            <div className="news2-hero__copy">
              <span className="news2-kicker"><i/> For ImmoScout24 teams</span>
              <h1 id="news2-title" tabIndex="-1">GPT‑5.6: use more intelligence only when the work needs it.</h1>
              <p>The new GPT‑5.6 family gives us more choice, not a reason to use the largest model for everything. Here is a practical way to choose between Luna, Terra and Sol for everyday ImmoScout24 work.</p>
              <dl><div><dt>Published</dt><dd><time dateTime="2026-08-04">4 August 2026</time></dd></div><div><dt>Reading time</dt><dd>4 minutes</dd></div><div><dt>By</dt><dd>Creative Studio &amp; Creative Ops</dd></div></dl>
            </div>
            <figure className="news2-cover" aria-label="Creative Hub weekly issue cover for GPT-5.6">
              <figcaption><span>Creative Hub Weekly</span><time dateTime="2026-08-04">04.08.26</time></figcaption>
              <strong>5.6</strong>
              <div><small>Field guide</small><b>Which model<br/>for which job?</b></div>
              <footer><span>Luna</span><span>Terra</span><span>Sol</span></footer>
            </figure>
          </div>
        </div>
      </header>

      <nav className="news2-index" aria-label="Article sections"><div className="wrap"><span>On this page</span><div>{chapters.map(([id, label], index) => <a href={`#${id}`} key={id}><b>0{index + 1}</b>{label}</a>)}</div></div></nav>

      <section className="news2-intro" id="news2-intro">
        <div className="wrap news2-reading-grid">
          <aside><span>In one minute</span></aside>
          <div>
            <p className="news2-standfirst">The useful question is no longer “Which model is best?” It is “What level of capability does this piece of work actually need?”</p>
            <div className="news2-takeaways">
              <article><b>01</b><h2>Start smaller</h2><p>Use the fastest capable option for routine, well-defined work.</p></article>
              <article><b>02</b><h2>Add references</h2><p>Real examples and templates improve quality more than vague requests for “something premium”.</p></article>
              <article><b>03</b><h2>Keep judgment human</h2><p>AI can accelerate the work. Teams remain responsible for accuracy, brand, risk and the final decision.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="news2-models" id="choose-a-model">
        <div className="wrap">
          <header className="news2-section-head"><span>01 / Choose a model</span><div><h2>Match the model to the job.</h2><p>OpenAI positions Luna as the fastest and most affordable tier, Terra as the balanced everyday model, and Sol as the flagship for demanding work.</p></div></header>
          <div className="news2-model-grid">{modelCards.map((model, index) => <article key={model.name} style={{"--news2-tint":model.tint}}>
            <div><span>0{index + 1}</span><small>{model.label}</small></div><h3>{model.name}</h3><p>{model.summary}</p><ul>{model.examples.map(example => <li key={example}>{example}</li>)}</ul>
          </article>)}</div>
        </div>
      </section>

      <section className="news2-decisions" id="choose-an-effort-level">
        <div className="wrap news2-reading-grid">
          <aside><span>02 / Make the choice</span><p>Start here, then adjust based on the quality of the result.</p></aside>
          <div>
            <h2>A simple decision guide for common team tasks.</h2>
            <div className="news2-table-scroll" tabIndex="0" role="region" aria-label="Model decision guide"><table><caption className="sr-only">Recommended GPT-5.6 setup for common ImmoScout24 tasks</caption><thead><tr><th scope="col">Task</th><th scope="col">Start with</th><th scope="col">Make it useful</th></tr></thead><tbody>{taskRows.map(([task, setup, guidance]) => <tr key={task}><th scope="row">{task}</th><td data-label="Start with">{setup}</td><td data-label="Make it useful">{guidance}</td></tr>)}</tbody></table></div>
            <p className="news2-note"><b>Access varies.</b> The models and effort levels available to you depend on the Scout24 workspace, product and plan you are using.</p>
          </div>
        </div>
      </section>

      <section className="news2-guardrails" id="news2-guardrails">
        <div className="wrap news2-reading-grid">
          <aside><span>Before you start</span></aside>
          <div><h2>Capability does not replace responsibility.</h2><p>Follow Scout24’s current AI, privacy and information-security requirements. Check whether the workspace and data are approved before adding internal material. Never include credentials or data you are not authorised to share. For customer-facing work, verify facts and claims, review accessibility and involve the right brand, legal or specialist reviewers.</p></div>
        </div>
      </section>

      <section className="news2-cta">
        <div className="wrap"><span>Ready to try it?</span><div><h2>Bring a real task. Start with the right agent.</h2><button type="button" onClick={onOpenStudio}>Explore the AI Studio <DI name="arrow-right" size={18}/></button></div></div>
      </section>

      <footer className="news2-sources">
        <div className="wrap news2-reading-grid"><aside><span>Sources</span></aside><div><p>This is an original ImmoScout24-focused adaptation informed by Ben’s Bites and checked against OpenAI’s product announcement.</p><ul><li><a href="https://www.bensbites.com/p/how-to-use-gpt-56" target="_blank" rel="noreferrer">Ben’s Bites: How to use GPT‑5.6 <span className="sr-only">(opens in a new tab)</span></a></li><li><a href="https://openai.com/index/gpt-5-6/" target="_blank" rel="noreferrer">OpenAI: GPT‑5.6 product announcement <span className="sr-only">(opens in a new tab)</span></a></li></ul></div></div>
      </footer>
    </article>
  </main>;
}

function DCampaignCreationArticle({ onBack, onOpenStudio }) {
  const chapters = [
    ["campaign-intro", "In one minute"],
    ["campaign-speed", "The AI workflow"],
    ["campaign-performance", "Results"],
    ["campaign-autonomy", "Marketing autonomy"],
  ];
  const workflow = [
    ["01", "Develop campaign concepts independently", "Move from a campaign idea to concrete routes without first waiting for a new production request."],
    ["02", "Generate multiple creative variations", "Explore several concepts, native-ad assets and display routes in the same working session."],
    ["03", "Adapt for the platforms that matter", "Resize assets for the required formats while protecting composition, typography, branding and safe zones."],
    ["04", "Launch and learn faster", "Use the strongest route in real campaign work, then involve Creative Studio for strategic design challenges and higher-value refinement."],
  ];
  return <main className="news2 news2--campaign" id="news-article" data-article-id="campaign-creation-at-scout24">
    <article aria-labelledby="news2-title">
      <header className="news2-hero">
        <div className="wrap">
          <div className="news2-utility">
            <button type="button" onClick={onBack}><DI name="arrow-left" size={16}/> Back to updates</button>
            <span>Creative Hub weekly · Issue 02</span>
          </div>
          <div className="news2-hero__layout">
            <div className="news2-hero__copy">
              <span className="news2-kicker"><i/> Internal AI / Performance Marketing</span>
              <h1 id="news2-title" tabIndex="-1">From weeks to minutes: how AI is transforming campaign creation at Scout24.</h1>
              <p>Campaign Creative Studio is helping Marketing teams move from a brief to initial concepts in minutes, creating more room to test, learn and improve before production capacity becomes the constraint.</p>
              <dl><div><dt>Published</dt><dd><time dateTime="2026-08-05">5 August 2026</time></dd></div><div><dt>Reading time</dt><dd>4 minutes</dd></div><div><dt>By</dt><dd>Creative Studio &amp; Performance Marketing</dd></div></dl>
            </div>
            <figure className="news2-cover news2-cover--campaign" aria-label="Creative Hub weekly issue cover for Campaign Creative Studio">
              <figcaption><span>Creative Hub Weekly</span><time dateTime="2026-08-05">05.08.26</time></figcaption>
              <strong>15</strong>
              <div><small>Campaign studio</small><b>From brief<br/>to first route.</b></div>
              <footer><span>Minutes</span><span>More routes</span><span>Real learning</span></footer>
            </figure>
          </div>
        </div>
      </header>

      <nav className="news2-index" aria-label="Article sections"><div className="wrap"><span>On this page</span><div>{chapters.map(([id, label], index) => <a href={`#${id}`} key={id}><b>0{index + 1}</b>{label}</a>)}</div></div></nav>

      <section className="news2-intro" id="campaign-intro">
        <div className="wrap news2-reading-grid">
          <aside><span>In one minute</span></aside>
          <div>
            <p className="news2-standfirst">Over the past few months, Creative Studio has been developing a suite of AI tools to help Marketing teams work faster, explore more ideas and reduce dependency on manual production. One of the strongest validations came from its first production user in Performance Marketing.</p>
            <div className="news2-takeaways">
              <article><b>2 to 8</b><h2>Weeks before</h2><p>A single display-creative request could take roughly two to eight weeks from ticket to delivery.</p></article>
              <article><b>15 to 30</b><h2>Minutes now</h2><p>An initial campaign concept can be generated in 15 to 30 minutes; a varied set can take three to four hours.</p></article>
              <article><b>Live</b><h2>Real validation</h2><p>Performance Marketing’s AI generated Taboola assets have produced more conversions than the manually designed assets previously used for the same campaigns.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="news2-decisions" id="campaign-speed">
        <div className="wrap news2-reading-grid">
          <aside><span>01 / Three AI agents</span><p>One connected workflow for campaign imagery, resizing and native advertising.</p></aside>
          <div>
            <h2>Three AI agents. One faster workflow.</h2>
            <p>Performance Marketing uses three AI agents as part of its daily campaign creation workflow. Together, they move marketers from idea to campaign ready assets in a fraction of the time previously required.</p>
            <div className="news2-table-scroll" tabIndex="0" role="region" aria-label="AI agents used in the Performance Marketing workflow"><table><caption className="sr-only">AI agents used in the Performance Marketing workflow</caption><thead><tr><th scope="col">Agent</th><th scope="col">What it does</th><th scope="col">Workflow value</th></tr></thead><tbody>
              <tr><th scope="row">Brand Imagery Builder</th><td data-label="What it does">Generates high-quality, brand-safe marketing imagery for campaigns.</td><td data-label="Workflow value">Creates strong starting points for campaign concepts.</td></tr>
              <tr><th scope="row">Image Size Adapter</th><td data-label="What it does">Adapts assets to required dimensions while preserving composition, typography, branding and safe zones.</td><td data-label="Workflow value">Produces the right format without losing the creative intent.</td></tr>
              <tr><th scope="row">Taboola &amp; Outbrain Ad Creator</th><td data-label="What it does">Creates production-ready native advertising assets optimised for Taboola and Outbrain.</td><td data-label="Workflow value">Turns a campaign route into channel-ready native ads.</td></tr>
            </tbody></table></div>
          </div>
        </div>
      </section>

      <section className="news2-workflow" id="campaign-performance">
        <div className="wrap">
          <header className="news2-section-head"><span>02 / Real business results</span><div><h2>Faster assets. Stronger campaign performance.</h2><p>Performance Marketing began using AI generated display assets in live Taboola campaigns. The team’s feedback was clear: the AI generated creatives produced more conversions than the manually designed assets previously used for the same campaigns.</p></div></header>
          <ol>{workflow.map(([number, title, text]) => <li key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>

      <section className="news2-guardrails" id="campaign-autonomy">
        <div className="wrap news2-reading-grid">
          <aside><span>03 / Increasing marketing autonomy</span></aside>
          <div><h2>Independence with the right review points.</h2><p>Teams can now develop concepts, create variations and adapt them for the right platforms without waiting for a new production cycle. The purpose is not to replace designers: it is to remove repeatable production work, so Creative Studio can focus on strategic creative challenges.</p></div>
        </div>
      </section>

      <section className="news2-cta">
        <div className="wrap"><span>Looking ahead</span><div><h2>Explore more. Learn faster. Keep the creative judgment human.</h2><p>Early results show campaign concepts shrinking from two to eight weeks to 15 to 30 minutes, complete sets taking three to four hours, and AI-generated creatives improving live performance.</p><button type="button" onClick={onOpenStudio}>Explore the AI Studio <DI name="arrow-right" size={18}/></button></div></div>
      </section>
    </article>
  </main>;
}

/* ---------------------------------------------------- Knowledge updates */
const D_KNOWLEDGE_TOPICS = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "marketing", label: "Marketing" },
  { id: "internal", label: "Internal" },
  { id: "inspiration", label: "Inspiration" },
];

const D_KNOWLEDGE_ARTICLES = [...D_PUBLISHED_NEWS_STORIES]
    .sort((a, b) => b.publishedISO.localeCompare(a.publishedISO))
    .map((story) => ({
      id: story.knowledgeId || story.articleId,
      topic: story.knowledgeTopic,
      label: story.knowledgeLabel,
      title: story.knowledgeTitle || story.title,
      summary: story.knowledgeSummary || story.body,
      meta: story.knowledgeMeta,
      action: "Read article",
      articleId: story.articleId,
    }));

const D_KNOWLEDGE_SIGNALS = [
  {
    id: "campaign-studio",
    topic: "internal",
    label: "Internal release",
    title: "New Campaign Studio released internally.",
    summary: "A clearer starting point for campaign planning, connected to the right specialists, reference material and review steps.",
    meta: "Internal AI · Product update",
  },
  {
    id: "openai-image-editing",
    topic: "ai",
    label: "AI update",
    title: "OpenAI releases new image editing capabilities.",
    summary: "What matters for teams is the workflow: provide approved source imagery, define what can change and review every campaign variant before use.",
    meta: "AI · Workflow impact",
  },
  {
    id: "figma-design-systems",
    topic: "ai",
    label: "Design update",
    title: "Figma launches Design Systems improvements.",
    summary: "Stronger systems reduce rework when design decisions, components and handoff stay connected across the marketing workflow.",
    meta: "Design · Systems",
  },
  {
    id: "google-ads-optimisation",
    topic: "marketing",
    label: "Marketing practice",
    title: "Google Ads introduces AI campaign optimisation.",
    summary: "Automation can make more choices quickly; the briefing, approved assets, claims and audience strategy still determine whether those choices are useful.",
    meta: "Marketing · Platform update",
  },
  {
    id: "spotify-inspiration",
    topic: "inspiration",
    label: "Campaign inspiration",
    title: "How Spotify used AI for personalised advertising.",
    summary: "The useful question is not whether AI was used, but how the data, audience insight and brand idea combined into something people recognised.",
    meta: "Inspiration · Case study",
  },
];

const D_KNOWLEDGE_TICKER = D_KNOWLEDGE_SIGNALS.map((signal) => ({
  id: signal.id,
  topic: signal.meta,
  title: signal.title,
  takeaway: signal.summary,
}));

function DKnowledgeUpdates({ onOpenArticle }) {
  const openUpdate = (update) => { if (update.articleId) onOpenArticle?.(update.articleId); };
  return <main className="knowledge2" id="knowledge-updates">
    <header className="knowledge2-hero">
      <div className="wrap knowledge2-hero__layout">
        <div><span className="knowledge2-eyebrow"><i/> Knowledge / Industry intelligence</span><h1 tabIndex="-1">AI &amp; Marketing Updates.</h1></div>
        <p>Curated signals for ImmoScout24 teams: what changed in AI, design and marketing, and why it could change the way you work.</p>
      </div>
    </header>

    <section className="knowledge2-latest" aria-labelledby="knowledge2-latest-title">
      <div className="wrap">
        <header className="knowledge2-heading knowledge2-heading--single"><div><h2 id="knowledge2-latest-title">Latest articles.</h2><p>Concise reads on the developments that are changing how ImmoScout24 teams create, test and ship work.</p></div></header>
        <div className="knowledge2-feed knowledge2-feed--articles" id="knowledge2-articles">
          {D_KNOWLEDGE_ARTICLES.map((update, index) => <article className={`knowledge2-update knowledge2-update--${update.topic}`} key={update.id}>
            <span>0{index + 1}</span><div><small>{update.label}</small><h3>{update.title}</h3><p>{update.summary}</p><em>{update.meta}</em></div>
            <button type="button" onClick={() => openUpdate(update)}>{update.action} <DI name="arrow-right" size={17}/></button>
          </article>)}
        </div>
      </div>
    </section>

    <section className="knowledge2-signals" aria-labelledby="knowledge2-signals-title">
      <div className="wrap">
        <header className="knowledge2-heading knowledge2-heading--single"><div><h2 id="knowledge2-signals-title">A quick view of what is moving.</h2><p>Short, curated notes for the changes worth knowing about, without turning the page into another article feed.</p></div></header>
        <div className="knowledge2-ticker" aria-label="AI and marketing update ticker">
          <div className="knowledge2-ticker__track">
            {[...D_KNOWLEDGE_TICKER, ...D_KNOWLEDGE_TICKER].map((update, index) => <article className="knowledge2-ticker__item" key={`${update.id}-${index}`} aria-hidden={index >= D_KNOWLEDGE_TICKER.length || undefined}>
              <small>{update.topic}</small><h3>{update.title}</h3><p>{update.takeaway}</p>
            </article>)}
          </div>
        </div>
      </div>
    </section>

    <section className="knowledge2-insight" aria-labelledby="knowledge2-insight-title">
      <div className="wrap knowledge2-insight__layout"><span>Weekly insight</span><div><h2 id="knowledge2-insight-title">The best updates explain the next move, not only the headline.</h2><p>Each edition will connect a development to a practical decision: which team it helps, what to test, and what still needs human review.</p></div><button type="button" onClick={() => onOpenArticle?.("gpt-5-6-for-immoscout24")}>Read this week’s guide <DI name="arrow-right" size={18}/></button></div>
    </section>
  </main>;
}

/* ---------------------------------------------------------- Tutorial modal */
function DTutorialModal({ agent, onClose }) {
  const d = DHUB.getAgentDetail(agent);
  const tint = D_TINT[agent.categories[0]] || "var(--is24-teal)";
  const video = (d.tutorials || [])[0];
  const hasTutorialVideo = !!(video && video.videoUrl && video.photo);
  const steps = DHUB.TUTORIAL_FORMAT || [];
  const [playing, setPlaying] = React.useState(false);
  // The preview server can't stream large MP4s (no range requests), so fetch
  // the file into a blob URL once playback is requested. Blob URLs (standalone
  // bundle) pass straight through.
  const [blobSrc, setBlobSrc] = React.useState(null);
  const [loadingVideo, setLoadingVideo] = React.useState(false);
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);
  const startPlayback = () => {
    if (!hasTutorialVideo) return;
    if (video.videoUrl.startsWith("blob:") || blobSrc) { setPlaying(true); return; }
    setLoadingVideo(true);
    fetch(video.videoUrl)
      .then((r) => r.blob())
      .then((b) => { setBlobSrc(URL.createObjectURL(b)); setLoadingVideo(false); setPlaying(true); })
      .catch(() => { setLoadingVideo(false); setPlaying(true); });
  };
  React.useEffect(() => () => { if (blobSrc) URL.revokeObjectURL(blobSrc); }, [blobSrc]);
  // Prefetch the video into a blob as soon as the modal opens so play is instant.
  React.useEffect(() => {
    if (!hasTutorialVideo || video.videoUrl.startsWith("blob:")) return;
    let cancelled = false;
    fetch(video.videoUrl)
      .then((r) => r.blob())
      .then((b) => { if (!cancelled) setBlobSrc(URL.createObjectURL(b)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    previousFocusRef.current = document.activeElement;
    document.body.classList.add("modal-open");
    const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusTimer = window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll(focusableSelector) || []).filter((node) => !node.hidden && node.getClientRects().length > 0);
      if (!focusable.length) { e.preventDefault(); dialogRef.current?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="dv-scrim">
      <button className="dv-scrim__dismiss" type="button" aria-label="Close tutorial" onClick={onClose} />
      <div className="dv-modal" ref={dialogRef} tabIndex="-1" style={{ "--tint": tint }} role="dialog" aria-modal="true" aria-labelledby={`dv-modal-title-${agent.id}`}>
        <div className="dv-modal__head">
          <button className="dv-modal__close" ref={closeRef} onClick={onClose} aria-label="Close"><DI name="cancel" size={16} /></button>
          <div className="dv-modal__id">
            <span className="dv-modal__icon"><DI name={agent.icon} size={28} /></span>
            <h2 id={`dv-modal-title-${agent.id}`}>{agent.name}</h2>
          </div>
          <p className="dv-modal__best">{d.bestFor}</p>
          {agent.audience && agent.audience.length > 0 &&
          <div className="dv-modal__aud">
            {agent.audience.map((a) => <span className="dv-modal__aud-chip" key={a}>{a}</span>)}
          </div>
          }
        </div>

        <div className="dv-modal__body">
          {hasTutorialVideo &&
          <div className="dv-modal__sec">
              <h3><DI name="video" size={15} /> Watch the walkthrough</h3>
              <div className={`dv-tut ${playing ? "is-playing" : ""}`}>
                <div className="dv-tut__media">
                  {playing ?
                  <video className="dv-tut__video" src={blobSrc || video.videoUrl} poster={video.photo} controls autoPlay playsInline /> :
                  <React.Fragment>
                    <img src={video.photo} alt="" />
                    <button className={`dv-tut__play ${loadingVideo ? "is-loading" : ""}`} onClick={startPlayback} disabled={loadingVideo} aria-label="Play tutorial video">
                      <span className="ring">{loadingVideo ? <DI name="stopwatch" size={20} /> : <DI name="arrow-right" size={20} />}</span>
                    </button>
                  </React.Fragment>
                  }
                </div>
                <div className="dv-tut__meta">
                  <span className="lvl">Tutorial</span>
                  <h4>{video.title}</h4>
                  <span className="dur"><DI name="stopwatch" size={13} /> {video.duration}</span>
                </div>
              </div>
            </div>
          }

          {d.helps ?
          <div className="dv-modal__sec">
            <h3><DI name="list-view" size={15} /> What this helps you do</h3>
            <ul className="dv-helps">
              {d.helps.map((s, i) => <li key={i}><DI name="accept" size={15} /> <span>{s}</span></li>)}
            </ul>
          </div> :

          <div className="dv-modal__sec">
            <h3><DI name="list-view" size={15} /> How to work with it</h3>
            <ol className="dv-steps">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
          }

          <div className="dv-modal__sec">
            <div className="dv-usewhen">
              <div className="dv-use dv-use--do">
                <h4><DI name="accept-glyph" size={16} /> Good for</h4>
                <ul>{d.whenToUse.map((it, i) => <li key={i}><DI name="accept" size={14} /> <span>{it}</span></li>)}</ul>
              </div>
              <div className="dv-use dv-use--dont">
                <h4><DI name="caution-glyph" size={16} /> Not for</h4>
                <ul>{d.whenNotToUse.map((it, i) => <li key={i}><DI name="cancel" size={14} /> <span>{it}</span></li>)}</ul>
              </div>
            </div>
          </div>

        </div>

        <div className="dv-modal__foot">
          {agent.link ?
          <a className="btn btn--brand" href={agent.link} target="_blank" rel="noreferrer"><DI name="arrow-right" /> Open agent</a> :

          <span className="btn btn--brand is-disabled" aria-disabled="true"><DI name="stopwatch" /> Coming soon</span>
          }
          <span className="by">Maintained by {agent.owner}</span>
        </div>
      </div>
    </div>);

}

/* ---------------------------------------------------------------- Footer */
function DFooter({ goHome, goSection }) {
  const footerNav = [['home','Homepage'],['create','AI Studio'],['brand','Brand'],['knowledge','Knowledge'],['community','Community']];
  const footerComing = [['assets','Assets']];
  const footerPages = [
    ['Terms of Use', 'resources', 'home::Terms of Use'],
    ['Datenschutz', 'resources', 'home::Datenschutzerklärung'],
    ['Imprint', 'resources', 'home::Imprint'],
    ['Fonts', 'resources', 'home::Fonts'],
    ['Colours', 'resources', 'home::Colours'],
  ];
  return (
    <footer className="home2-footer">
      <div className="wrap">
        <div className="home2-footer__lead">
          <div className="home2-footer__identity">
            <a className="hub-brand" href="./" aria-label="Back to the Hub homepage" onClick={(e) => {e.preventDefault();goHome();}}>
              <span className="hub-logo hub-logo--footer" role="img" aria-label="ImmoScout24"></span>
            </a>
            <span>Creative Hub</span>
          </div>
        </div>

        <nav className="home2-footer__nav" aria-label="Footer navigation">
          <section aria-labelledby="footer-hub-links"><h3 id="footer-hub-links">Hub</h3>{footerNav.map(([id, label]) => <button type="button" key={id} onClick={() => id === 'home' ? goHome() : goSection(id, id === 'knowledge' ? { key: 'knowledge::updates', label: 'AI & Marketing Updates', source: 'local' } : undefined)}><span>{label}</span><DI name="arrow-right" size={13}/></button>)}</section>
          <section aria-labelledby="footer-coming-links"><h3 id="footer-coming-links">Roadmap</h3>{footerComing.map(([id, label]) => <span className="home2-footer__soon" key={id}><span>{label}</span><em>Coming soon</em></span>)}</section>
          <section aria-labelledby="footer-legal-links"><h3 id="footer-legal-links">Legal &amp; brand</h3>{footerPages.map(([label, section, key]) => <button type="button" key={key} onClick={() => goSection(section, { label, key, source: 'frontify' })}><span>{label}</span><DI name="arrow-right" size={13}/></button>)}</section>
          <section aria-labelledby="footer-support-links"><h3 id="footer-support-links">Support</h3><a href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer"><span>Creative Studio on Slack</span><DI name="arrow-right" size={13}/></a><a href="https://github.com/scout24-creative-ops/creative-hub" target="_blank" rel="noreferrer"><span>Creative Hub repository</span><DI name="arrow-right" size={13}/></a></section>
        </nav>

        <div className="home2-footer__bottom">
          <span>Built and maintained by Creative Studio &amp; Creative Ops.</span>
          <span>ImmoScout24 · © {new Date().getFullYear()} Scout24</span>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { DHeader, DHome, DNewsArticle, DKnowledgeUpdates, DTutorialModal, DFooter });
