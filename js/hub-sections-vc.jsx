/* ============================================================================
   Concept C — the gallery.
   A deliberately simple, editorial experience whose single job is the overview
   of agents that actually exist on the platform. No marketing scaffolding, no
   status/percentage badges, no target-user labels. Just: see every agent, open
   one, get going.
   Views: CHeader · CHome (gallery) · CAgentDetail · CFooter
   ============================================================================ */
const { Icon: CI, Hl: CHl } = window;
const CHUB = window.HUB;

/* Agents "on the platform" = everything that has actually been created.
   The Idea-stage / roadmap entries are intentionally left out of Concept C. */
const C_AGENTS = CHUB.AGENTS.filter((a) => a.status !== "idea");
const C_TINT = {};
const C_CATLABEL = {};
CHUB.CATEGORIES.forEach((c) => { C_TINT[c.id] = c.tint; C_CATLABEL[c.id] = c.label; });

function cInitials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

/* ---------------------------------------------------------------- Header */
function CHeader({ goHome }) {
  return (
    <header className="cv-header">
      <div className="wrap cv-header__inner">
        <a className="hub-brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }} aria-label="ImmoScout24 — back to all agents">
          <span className="hub-logo hub-logo--header" role="img" aria-label="ImmoScout24"></span>
          <span className="hub-brand__div" />
          <span className="hub-brand__studio">
            <b>Creative Studio</b>
            <span>AI Creation Hub</span>
          </span>
        </a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------ Agent card */
function CCard({ agent, goAgent }) {
  const tint = C_TINT[agent.categories[0]] || "var(--teal-200)";
  return (
    <button className="cv-card reveal" style={{ "--tint": tint }} onClick={() => goAgent(agent)}>
      <span className="cv-card__icon"><CI name={agent.icon} size={26} /></span>
      <h3>{agent.name}</h3>
      <p className="cv-card__what">{agent.what}</p>
      <div className="cv-card__foot">
        <span className="cv-card__owner">{agent.owner}</span>
        <span className="cv-card__open">Open <CI name="arrow-right" size={15} /></span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------- Home/gallery */
function CHome({ goAgent }) {
  const [filter, setFilter] = React.useState("all");
  const [q, setQ] = React.useState("");

  const counts = React.useMemo(() => {
    const m = { all: C_AGENTS.length };
    CHUB.CATEGORIES.forEach((c) => { m[c.id] = C_AGENTS.filter((a) => a.categories.includes(c.id)).length; });
    return m;
  }, []);
  const cats = CHUB.CATEGORIES.filter((c) => counts[c.id] > 0);

  let shown = filter === "all" ? C_AGENTS : C_AGENTS.filter((a) => a.categories.includes(filter));
  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    shown = shown.filter((a) =>
      a.name.toLowerCase().includes(needle) ||
      a.what.toLowerCase().includes(needle) ||
      a.tags.join(" ").toLowerCase().includes(needle) ||
      a.owner.toLowerCase().includes(needle)
    );
  }

  return (
    <React.Fragment>
      <section className="cv-intro">
        <span className="cv-intro__blob cv-intro__blob--1" />
        <span className="cv-intro__blob cv-intro__blob--2" />
        <span className="cv-intro__blob cv-intro__blob--3" />
        <div className="wrap">
          <span className="cv-intro__kicker">Creative Studio · AI Agents</span>
          <h1>Find your <CHl>agent</CHl>.</h1>
          <p>{C_AGENTS.length} AI agents, built and maintained by Creative Studio. Pick one and get going.</p>
        </div>
      </section>

      <div className="cv-filterbar">
        <div className="wrap cv-filterbar__inner">
          <div className="cv-pills">
            <button className={`cv-pill ${filter === "all" ? "is-active" : ""}`} style={{ "--tint": "var(--teal-200)" }} onClick={() => setFilter("all")}>
              All <span className="n">{counts.all}</span>
            </button>
            {cats.map((c) => (
              <button key={c.id} className={`cv-pill ${filter === c.id ? "is-active" : ""}`} style={{ "--tint": c.tint }} onClick={() => setFilter(c.id)}>
                {c.label} <span className="n">{counts[c.id]}</span>
              </button>
            ))}
          </div>
          <label className="cv-search">
            <CI name="search" size={17} />
            <input type="text" value={q} placeholder="Search agents…" onChange={(e) => setQ(e.target.value)} />
            {q && <button className="cv-search__clear" onClick={() => setQ("")} aria-label="Clear search"><CI name="cancel" size={13} /></button>}
          </label>
        </div>
      </div>

      <section className="cv-gallery">
        <div className="wrap">
          {shown.length === 0 ? (
            <div className="cv-empty">
              <CI name="search" size={26} />
              <p>No agents match “{q}”.</p>
              <button className="btn btn--ghost btn--sm" onClick={() => { setQ(""); setFilter("all"); }}>Reset filters</button>
            </div>
          ) : (
            <div className="cv-grid">
              {shown.map((a) => <CCard agent={a} key={a.id} goAgent={goAgent} />)}
            </div>
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

/* ---------------------------------------------------------- Agent detail */
function CAgentDetail({ agent, goHome, goAgent }) {
  const d = CHUB.getAgentDetail(agent);
  const tint = C_TINT[agent.categories[0]] || "var(--teal-200)";
  const related = C_AGENTS
    .filter((a) => a.id !== agent.id && a.categories.some((c) => agent.categories.includes(c)))
    .slice(0, 3);
  const tutorials = d.tutorials || [];
  const examples = d.examples || [];

  return (
    <div className="cv-detail" style={{ "--tint": tint }}>
      <div className="cv-detail__hero">
        <div className="wrap">
          <button className="cv-back" onClick={goHome}>
            <CI name="arrow-left" size={16} /> All agents
          </button>
          <span className="cv-detail__icon"><CI name={agent.icon} size={38} /></span>
          <div className="cv-detail__cats">
            {agent.categories.map((c) => <span className="cv-chip" key={c}>{C_CATLABEL[c]}</span>)}
          </div>
          <h1>{agent.name}</h1>
          <p className="cv-detail__lead">{d.bestFor}</p>
          <div className="cv-detail__cta">
            {agent.link ? (
              <a className="btn btn--primary btn--lg" href={agent.link} target="_blank" rel="noreferrer"><CI name="arrow-right" /> Open agent</a>
            ) : (
              <span className="btn btn--primary btn--lg is-disabled" aria-disabled="true"><CI name="stopwatch" /> Coming soon</span>
            )}
            <span className="cv-detail__by"><span className="av">{cInitials(agent.owner)}</span> {agent.owner}</span>
          </div>
        </div>
      </div>

      <div className="wrap cv-detail__body">
        <section className="cv-sec">
          <h2>What it does</h2>
          <p className="cv-prose">{agent.what}</p>
        </section>

        <section className="cv-sec">
          <div className="cv-usewhen">
            <div className="cv-use cv-use--do">
              <h3><CI name="accept-glyph" size={18} /> When to use</h3>
              <ul>
                {d.whenToUse.map((it, i) => <li key={i}><CI name="accept" size={15} /> <span>{it}</span></li>)}
              </ul>
            </div>
            <div className="cv-use cv-use--dont">
              <h3><CI name="caution-glyph" size={18} /> When not to use</h3>
              <ul>
                {d.whenNotToUse.map((it, i) => <li key={i}><CI name="cancel" size={15} /> <span>{it}</span></li>)}
              </ul>
            </div>
          </div>
        </section>

        {tutorials.length > 0 && (
          <section className="cv-sec">
            <h2>Tutorials</h2>
            <div className="cv-tut-grid">
              {tutorials.map((t) => (
                <div className="tut-card reveal" key={t.id}>
                  <div className="tut-card__media">
                    <img src={t.photo} alt="" />
                    <div className="tut-card__play"><span className="ring"><CI name="virtualtour" size={22} /></span></div>
                    <span className="tut-card__dur">{t.duration}</span>
                  </div>
                  <div className="tut-card__body">
                    <div className="tut-card__agent">{t.level}</div>
                    <h4>{t.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {examples.length > 0 && (
          <section className="cv-sec">
            <h2>Examples</h2>
            <div className="cv-ex-grid">
              {examples.map((s) => (
                <div className="show-card reveal" key={s.id}>
                  <div className="show-card__media">
                    <img src={s.photo} alt="" />
                    <span className="show-card__pill">{s.team}</span>
                  </div>
                  <div className="show-card__body">
                    <h4>{s.useCase}</h4>
                    <p className="show-card__impact">{s.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="cv-detail__footcta">
          {agent.link ? (
            <a className="btn btn--brand btn--lg" href={agent.link} target="_blank" rel="noreferrer"><CI name="arrow-right" /> Agent öffnen</a>
          ) : (
            <span className="btn btn--brand btn--lg is-disabled" aria-disabled="true"><CI name="stopwatch" /> Bald verfügbar</span>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="cv-related">
          <div className="wrap">
            <h2>Related agents</h2>
            <div className="cv-grid">
              {related.map((a) => <CCard agent={a} key={a.id} goAgent={goAgent} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Footer */
function CFooter({ goHome }) {
  return (
    <footer className="cv-footer">
      <div className="wrap cv-footer__inner">
        <a className="hub-brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <span className="hub-logo hub-logo--footer" role="img" aria-label="ImmoScout24"></span>
        </a>
        <span className="cv-footer__line">Built, curated and maintained by Creative Studio · ImmoScout24 / Scout24</span>
        <span className="cv-footer__copy">© {new Date().getFullYear()} Scout24</span>
      </div>
    </footer>
  );
}

Object.assign(window, { CHeader, CHome, CAgentDetail, CFooter });
