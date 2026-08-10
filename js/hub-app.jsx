/* ============================================================================
   App root , hosts BOTH concepts and a floating A/B toggle.
     · Concept A (AppA): the full single-scroll hub (original).
     · Concept B (AppB): agent-first flow , Home → Agent Library → Agent Detail.
   The chosen concept persists in localStorage so a refresh keeps it.
   ============================================================================ */
const {
  Header, Hero, WhyExists, Categories, Agents,
  StartHere, Tutorials, Guardrails, Feedback, Impact, Showcase, Footer,
  AgentModal,
  BHeader, BHome, BLibrary, BAgentDetail, BFooter,
  CHeader, CHome, CAgentDetail, CFooter,
  DHeader, DHome, DNewsArticle, DKnowledgeUpdates, DTutorialModal, DFooter, HubAIAssistant,
} = window;

function useReveal(dep) {
  React.useEffect(() => {
    const root = document.querySelector(".hub-app");
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    const forceAll = () => {
      els.forEach((el) => el.classList.add("in"));
      if (root) root.classList.add("reveal-static");
    };
    if (!("IntersectionObserver" in window)) {
      forceAll();
      return;
    }
    let ioWorks = false;
    const io = new IntersectionObserver(
      (entries) => {
        ioWorks = true;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    // Some embedded webviews never fire IntersectionObserver (and throttle CSS
    // transitions). If no callback arrives, snap everything visible instantly.
    const t = setTimeout(() => { if (!ioWorks) forceAll(); }, 600);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [dep]);
}

/* ----------------------------------------------------------- Concept A */
function AppA() {
  const dir = "b"; // Warm , the only visual direction
  const [filter, setFilter] = React.useState("all");
  const [modalAgent, setModalAgent] = React.useState(null);
  useReveal(filter);

  const jump = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };
  const scrollAgents = (e) => {
    e.preventDefault();
    const el = document.getElementById("agents");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };
  const pickCategory = (id) => {
    setFilter(id);
    const el = document.getElementById("agents");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };
  const openAgent = (a) => setModalAgent(a);

  return (
    <div className="hub-app" data-direction={dir}>
      <Header onJump={jump} />
      <Hero onJump={jump} onScrollAgents={scrollAgents} />
      <WhyExists />
      <Categories onPick={pickCategory} />
      <Agents filter={filter} setFilter={setFilter} onOpen={openAgent} />
      <Showcase />
      <StartHere onOpenAgent={openAgent} />
      <Tutorials />
      <Guardrails />
      <Impact />
      <Feedback />
      <Footer onJump={jump} />
      {modalAgent && <AgentModal agent={modalAgent} onClose={() => setModalAgent(null)} />}
    </div>
  );
}

/* ----------------------------------------------------------- Concept B */
function AppB() {
  const [route, setRoute] = React.useState({ view: "home", agentId: null, filter: "all" });
  useReveal(route.view + ":" + route.agentId + ":" + route.filter);

  // scroll to top on view / agent change
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [route.view, route.agentId]);

  const goHome = () => setRoute({ view: "home", agentId: null, filter: "all" });
  const goLibrary = (filter = "all") => setRoute({ view: "library", agentId: null, filter });
  const goAgent = (a) => setRoute((r) => ({ ...r, view: "agent", agentId: a.id }));
  const setFilter = (f) => setRoute((r) => ({ ...r, filter: f }));

  const agent = route.agentId ? BHUB_AGENT(route.agentId) : null;

  return (
    <div className="hub-app" data-direction="b" data-concept="b">
      <BHeader view={route.view} goHome={goHome} goLibrary={goLibrary} />
      {route.view === "home" && <BHome goLibrary={goLibrary} goAgent={goAgent} />}
      {route.view === "library" && (
        <BLibrary filter={route.filter} setFilter={setFilter} goAgent={goAgent} />
      )}
      {route.view === "agent" && agent && (
        <BAgentDetail agent={agent} goLibrary={goLibrary} goAgent={goAgent} />
      )}
      <BFooter goHome={goHome} goLibrary={goLibrary} />
    </div>
  );
}

function BHUB_AGENT(id) {
  return window.HUB.AGENTS.find((a) => a.id === id) || null;
}

/* ----------------------------------------------------------- Concept C */
function AppC() {
  const [route, setRoute] = React.useState({ view: "home", agentId: null });
  useReveal(route.view + ":" + route.agentId);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [route.view, route.agentId]);

  const goHome = () => setRoute({ view: "home", agentId: null });
  const goAgent = (a) => setRoute({ view: "agent", agentId: a.id });
  const agent = route.agentId ? BHUB_AGENT(route.agentId) : null;

  return (
    <div className="hub-app" data-direction="b" data-concept="c">
      <CHeader goHome={goHome} />
      {route.view === "home" && <CHome goAgent={goAgent} />}
      {route.view === "agent" && agent && <CAgentDetail agent={agent} goHome={goHome} goAgent={goAgent} />}
      <CFooter goHome={goHome} />
    </div>
  );
}

/* ----------------------------------------------------------- Concept D */
const D_NEWS_TITLES = {
  "gpt-5-6-for-immoscout24": "GPT‑5.6 for ImmoScout24 teams",
  "campaign-creation-at-scout24": "From Weeks to Minutes: AI campaign creation at Scout24",
};

function dViewFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const newsPage = params.get("news");
  if (D_NEWS_TITLES[newsPage]) return { section: "news", pageKey: `news::${newsPage}`, title: D_NEWS_TITLES[newsPage] };
  if (newsPage) return { section: "home", pageKey: null, title: "Home" };
  if (params.get("knowledge") === "updates") return { section: "knowledge", pageKey: "knowledge::updates", title: "AI & Marketing Updates" };
  if (params.get("studio") === "agents") return { section: "create", pageKey: null, title: "All Agents" };
  const mediaPage = params.get("media-library");
  if (!mediaPage) return { section: "home", pageKey: null, title: "Home" };
  if (mediaPage === "overview") return { section: "assets", pageKey: "hub::69", title: "Media Library" };
  const labels = { images: "Images", immopics: "ImmoPics", highlighter: "Highlighter", icons: "Icons", logos: "Logos", templates: "Templates" };
  return labels[mediaPage]
    ? { section: "assets", pageKey: `media-library::${mediaPage}`, title: labels[mediaPage] }
    : { section: "home", pageKey: null, title: "Home" };
}

function dSyncLocation(nextView, mode = "push") {
  const url = new URL(window.location.href);
  url.searchParams.delete("news");
  url.searchParams.delete("studio");
  url.searchParams.delete("knowledge");
  if (nextView.section !== "assets") url.searchParams.delete("media-library");
  if (nextView.section === "news") url.searchParams.set("news", (nextView.pageKey || "news::gpt-5-6-for-immoscout24").split("::")[1]);
  if (nextView.section === "create") url.searchParams.set("studio", "agents");
  if (nextView.section === "knowledge") url.searchParams.set("knowledge", "updates");
  window.history[`${mode}State`]({ ...(window.history.state || {}), hubRoute: true }, "", url);
}

function AppD() {
  const askHubEnabled = false;
  const [language, setLanguage] = React.useState(() => window.HubLanguage.getLanguage());
  const [tutorialAgent, setTutorialAgent] = React.useState(null);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const [assistantPrompt, setAssistantPrompt] = React.useState("");
  const [view, setView] = React.useState(dViewFromLocation);
  const [navigationOpen, setNavigationOpen] = React.useState(false);
  useReveal(`d:${view.section}:${view.pageKey || "index"}`);

  React.useEffect(() => {
    const onPopState = () => { setView(dViewFromLocation()); window.scrollTo({ top: 0, behavior: "auto" }); };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  React.useEffect(() => {
    const title = view.section === "news"
      ? `${D_NEWS_TITLES[(view.pageKey || "news::gpt-5-6-for-immoscout24").split("::")[1]] || "Creative Hub News"} · Creative Hub`
      : view.section === "create"
        ? "All Agents · Creative Hub"
        : view.section === "knowledge"
          ? "AI & Marketing Updates · Creative Hub"
        : "AI Marketing Creation Hub · Creative Studio";
    document.title = window.HubLanguage.translate(title, language);
    if (!["news", "create", "knowledge"].includes(view.section)) return undefined;
    const focusTimer = window.setTimeout(() => document.querySelector("main h1[tabindex='-1']")?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(focusTimer);
  }, [view.section, view.pageKey, language]);

  const changeLanguage = React.useCallback((nextLanguage) => {
    const next = window.HubLanguage.setLanguage(nextLanguage);
    setLanguage(next);
  }, []);

  const goHome = () => {
    const next = { section: "home", pageKey: null, title: "Home" };
    dSyncLocation(next);
    setView(next);
    window.scrollTo({ top: 0, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const goSection = (section, page) => {
    const destination = section === "brand" && !page
      ? { key: "hub::56", label: "Brand Overview", source: "hub" }
      : section === "assets" && !page
        ? { key: "hub::69", label: "Media Library", source: "hub" }
        : page;
    const next = { section, pageKey: destination?.key || null, title: destination?.label || (section.charAt(0).toUpperCase() + section.slice(1)) };
    dSyncLocation(next);
    setView(next);
    window.scrollTo({ top: 0, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const leaveNews = () => {
    if (window.history.state?.hubRoute) window.history.back();
    else goHome();
  };
  const openTutorial = (a) => setTutorialAgent(a);
  const openAssistant = (prompt = "") => {
    setAssistantPrompt(typeof prompt === "string" ? prompt : "");
    setAssistantOpen(true);
  };
  const closeAssistant = () => {
    setAssistantOpen(false);
    setAssistantPrompt("");
  };

  return (
    <div className={`hub-app${navigationOpen ? " is-nav-open" : ""}`} data-direction="b" data-concept="d">
      <DHeader goHome={goHome} goSection={goSection} activeSection={view.section} activePageKey={view.pageKey} onNavigationChange={setNavigationOpen} language={language} onLanguageChange={changeLanguage} />
      {view.section === "home" || view.section === "create"
        ? <DHome onTutorial={openTutorial} showStudio={view.section === "create"} onOpenStudio={() => goSection("create")} onOpenAssistant={openAssistant} askHubEnabled={askHubEnabled} onOpenNews={(articleId = "gpt-5-6-for-immoscout24") => goSection("news", { key: `news::${articleId}`, label: D_NEWS_TITLES[articleId] || "Creative Hub News" })} />
        : view.section === "news"
          ? <DNewsArticle articleId={(view.pageKey || "news::gpt-5-6-for-immoscout24").split("::")[1]} onBack={leaveNews} onOpenStudio={() => goSection("create")} />
          : view.section === "knowledge"
            ? <DKnowledgeUpdates onOpenArticle={(articleId) => goSection("news", { key: `news::${articleId}`, label: D_NEWS_TITLES[articleId] || "Creative Hub News" })} />
            : <DEmptyPage section={view.section} pageKey={view.pageKey} title={view.title} onNavigate={goSection} />}
      <DFooter goHome={goHome} goSection={goSection} />
      {askHubEnabled && <HubAIAssistant
        open={assistantOpen}
        onOpen={() => openAssistant("")}
        onClose={closeAssistant}
        onNavigate={goSection}
        onTutorial={openTutorial}
        context={{ section: view.section, title: view.title }}
        initialPrompt={assistantPrompt}
      />}
      {tutorialAgent && <DTutorialModal agent={tutorialAgent} onClose={() => setTutorialAgent(null)} />}
    </div>
  );
}

/* ------------------------------------------------------- Version toggle */
function VersionToggle({ version, setVersion }) {
  return (
    <div className="ver-toggle" role="group" aria-label="Switch concept">
      <span className="ver-toggle__label">Concept</span>
      <button className={version === "a" ? "is-active" : ""} onClick={() => setVersion("a")}>
        <b>A</b><span>Full hub</span>
      </button>
      <button className={version === "b" ? "is-active" : ""} onClick={() => setVersion("b")}>
        <b>B</b><span>Agent-first</span>
      </button>
      <button className={version === "c" ? "is-active" : ""} onClick={() => setVersion("c")}>
        <b>C</b><span>Gallery</span>
      </button>
      <button className={version === "d" ? "is-active" : ""} onClick={() => setVersion("d")}>
        <b>D</b><span>Playful</span>
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- Root */
function Root() {
  return <AppD />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
