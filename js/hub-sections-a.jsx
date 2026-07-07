/* ============================================================================
   Sections part A: Header, Hero, WhyExists, Categories, Agents
   ============================================================================ */
const { Icon, Hl, StatusBadge, SectionHead, AgentCard, CAT_LABELS } = window;
const HUB = window.HUB;

function Header({ onJump }) {
  return (
    <React.Fragment>
      <div className="hub-strip">
        <div className="wrap hub-strip__inner">
          <div className="hub-strip__left">
            <span className="hub-strip__dot" />
            <span>An internal initiative, built, curated &amp; governed by Creative Studio</span>
          </div>
          <div className="hub-strip__right">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <Icon name="chat" size={13} /> &nbsp;#creative-studio
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Status &amp; roadmap
            </a>
          </div>
        </div>
      </div>
      <header className="hub-header">
        <div className="wrap hub-header__inner">
          <a className="hub-brand" href="#" onClick={(e) => e.preventDefault()}>
            <span className="hub-logo hub-logo--header" role="img" aria-label="ImmoScout24"></span>
            <span className="hub-brand__div" />
            <span className="hub-brand__studio">
              <b>Creative Studio</b>
              <span>AI Creation Hub</span>
            </span>
          </a>
          <nav className="hub-nav">
            <a href="#agents" onClick={onJump("agents")}>Agents</a>
            <a href="#start" onClick={onJump("start")}>Start here</a>
            <a href="#tutorials" onClick={onJump("tutorials")}>Tutorials</a>
            <a href="#guardrails" onClick={onJump("guardrails")}>Guardrails</a>
            <a href="#showcase" onClick={onJump("showcase")}>Showcase</a>
          </nav>
          <div className="hub-header__actions">
            <a className="btn btn--brand btn--sm" href="#agents" onClick={onJump("agents")}>
              Explore agents
            </a>
            <span className="hub-avatar" title="Your account">
              <Icon name="profile" />
            </span>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

function Hero({ onJump, onScrollAgents }) {
  return (
    <section className="hero">
      <span
        className="hero__blob"
        style={{ width: 380, height: 380, background: "var(--teal-100)", top: -120, right: -60 }}
      />
      <span
        className="hero__blob"
        style={{ width: 220, height: 220, background: "var(--brand-purple)", bottom: 40, left: -90, opacity: 0.28 }}
      />
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__text">
            <span className="hero__eyebrow">
              <span className="pin" /> Create faster · Stay on brand · Scale smarter
            </span>
            <h1>
              The AI Marketing <br />
              Creation <Hl>Hub</Hl>
            </h1>
            <p className="hero__sub">A curated home for AI powered marketing creation.</p>
            <p className="hero__copy">
              Discover, understand and access AI agents for asset creation, image generation,
              quality checks and brand guidance, enabled and governed by Creative Studio, so your
              team moves fast while staying unmistakably on brand.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary btn--lg" href="#agents" onClick={onScrollAgents}>
                <Icon name="search" /> Explore agents
              </a>
              <a className="btn btn--ghost btn--lg" href="#" onClick={(e) => e.preventDefault()}>
                <Icon name="video" /> Watch intro
              </a>
              <a className="btn btn--quiet btn--lg" href="#" onClick={(e) => e.preventDefault()}>
                <Icon name="chat" /> Request sparring
              </a>
            </div>
            <div className="hero__trust">
              <span><b>{HUB.AGENTS.length}</b> agents available</span>
              <span className="sep" />
              <span><b>{HUB.CATEGORIES.length}</b> categories</span>
              <span className="sep" />
              <span>Curated by <b>Creative Studio</b></span>
            </div>
          </div>

          <div className="hero__media">
            <div className="hero__photo">
              <img src={(window.__resources && window.__resources.photoHero) || "assets/photos/hero.jpg"} alt="Marketing team exploring on brand creation" />
            </div>
            <div className="hero__tag">
              <span className="dot" />
              On brand by design
            </div>
            <div className="hero__chip hero__chip--tl">
              <span className="ico"><Icon name="add-glyph" size={20} /></span>
              <span>
                <b>First drafts in minutes</b>
                <span>not days</span>
              </span>
            </div>
            <div className="hero__chip hero__chip--br">
              <span className="ico"><Icon name="service-security-check" size={20} /></span>
              <span>
                <b>Quality guardrails</b>
                <span>built in</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyExists() {
  const cards = [
    {
      n: "01",
      icon: "stopwatch",
      title: "Create faster",
      body: "Teams create and adapt assets more efficiently through AI supported workflows, from first concept to channel ready draft.",
    },
    {
      n: "02",
      icon: "service-security-check",
      title: "Stay on brand",
      body: "Creative Studio provides the quality framework, brand guardrails and accessibility standards that keep AI outputs consistent and recognisable.",
    },
    {
      n: "03",
      icon: "education",
      title: "Learn together",
      body: "More than a tool list. Tutorials, guidance and feedback loops help every team get better at AI powered creation over time.",
    },
  ];
  return (
    <section className="section section--warm" id="why">
      <div className="wrap">
        <SectionHead
          eyebrow="Why this exists"
          eyebrowIcon="info-glyph"
          title={<span>AI is changing how we create. <Hl>Creative Studio</Hl> keeps it on track.</span>}
          lead="This hub helps teams move faster without losing creative quality, brand consistency, accessibility or recognition, with the tools, guidance and governance to make AI powered creation scalable and safe."
        />
        <div className="why-grid">
          {cards.map((c) => (
            <div className="value-card reveal" key={c.n}>
              <div className="value-card__num">{c.n}</div>
              <div className="value-card__icon">
                <Icon name={c.icon} size={26} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories({ onPick }) {
  return (
    <section className="section" id="categories">
      <div className="wrap">
        <SectionHead
          eyebrow="Explore by category"
          eyebrowIcon="dashboard"
          title="Five ways the hub supports your work"
          lead="Every agent belongs to one or more categories, so you can find the right kind of support fast, whether you're creating, adapting, checking, learning or governing."
        />
        <div className="cat-grid">
          {HUB.CATEGORIES.map((c) => {
            const count = HUB.AGENTS.filter((a) => a.categories.includes(c.id)).length;
            return (
              <div
                className="cat-card reveal"
                key={c.id}
                style={{ "--cat-tint": c.tint }}
                onClick={() => onPick(c.id)}
              >
                <div className="cat-card__icon">
                  <Icon name={c.icon} size={22} />
                </div>
                <h4>{c.label}</h4>
                <p>{c.blurb}</p>
                <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 800, color: "var(--color-text-muted)" }}>
                  {count} {count === 1 ? "agent" : "agents"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Agents({ filter, setFilter, onOpen }) {
  const counts = React.useMemo(() => {
    const m = { all: HUB.AGENTS.length };
    HUB.CATEGORIES.forEach((c) => {
      m[c.id] = HUB.AGENTS.filter((a) => a.categories.includes(c.id)).length;
    });
    return m;
  }, []);

  const shown = filter === "all" ? HUB.AGENTS : HUB.AGENTS.filter((a) => a.categories.includes(filter));
  const featured = shown.filter((a) => a.featured);
  const rest = shown.filter((a) => !a.featured);

  return (
    <section className="section section--warm" id="agents">
      <div className="wrap">
        <SectionHead
          eyebrow="The agents"
          eyebrowIcon="dashboard-glyph"
          title={<span>Find the <Hl>right agent</Hl> for the job</span>}
          lead="Compact cards give you the essentials at a glance. Open any agent for what it's best for, what to expect, and where Creative Studio review is required."
        />

        <div className="agents-head">
          <div className="cat-bar">
            <button
              className={`cat-pill ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All agents <span className="count">{counts.all}</span>
            </button>
            {HUB.CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`cat-pill ${filter === c.id ? "is-active" : ""}`}
                style={{ "--cat-tint": c.tint }}
                onClick={() => setFilter(c.id)}
              >
                <span className="ico"><Icon name={c.icon} size={16} /></span>
                {c.label} <span className="count">{counts[c.id]}</span>
              </button>
            ))}
          </div>
        </div>

        {featured.length > 0 && (
          <React.Fragment>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "8px 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="premium" size={15} /> Featured &amp; recommended
            </div>
            <div className="agent-grid" style={{ marginBottom: rest.length ? 40 : 0 }}>
              {featured.map((a) => (
                <AgentCard agent={a} key={a.id} onOpen={onOpen} />
              ))}
            </div>
          </React.Fragment>
        )}

        {rest.length > 0 && (
          <React.Fragment>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "8px 0 18px" }}>
              {featured.length ? "More agents" : "All agents"}
            </div>
            <div className="agent-grid">
              {rest.map((a) => (
                <AgentCard agent={a} key={a.id} onOpen={onOpen} />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { Header, Hero, WhyExists, Categories, Agents });
