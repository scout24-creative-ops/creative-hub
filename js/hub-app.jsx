/* ============================================================================
   App root — hosts BOTH concepts and a floating A/B toggle.
     · Concept A (AppA): the full single-scroll hub (original).
     · Concept B (AppB): agent-first flow — Home → Agent Library → Agent Detail.
   The chosen concept persists in localStorage so a refresh keeps it.
   ============================================================================ */
const {
  Header, Hero, WhyExists, Categories, Agents,
  StartHere, Tutorials, Guardrails, Feedback, Impact, Showcase, Footer,
  AgentModal,
  BHeader, BHome, BLibrary, BAgentDetail, BFooter,
  CHeader, CHome, CAgentDetail, CFooter,
  DHeader, DHome, DTutorialModal, DFooter,
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
  const dir = "b"; // Warm — the only visual direction
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
function AppD() {
  const [tutorialAgent, setTutorialAgent] = React.useState(null);
  useReveal("d");

  const goHome = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openTutorial = (a) => setTutorialAgent(a);

  return (
    <div className="hub-app" data-direction="b" data-concept="d">
      <DHeader goHome={goHome} />
      <DHome onTutorial={openTutorial} />
      <DFooter goHome={goHome} />
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
