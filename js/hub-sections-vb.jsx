/* ============================================================================
   Concept B — agent-first experience.
   Flow: Home → Agent Library → Agent Detail Page. Simplified navigation,
   reduced duplication: tutorials, examples, guardrails and feedback now live
   on the agent detail page that each card opens.
   Views: BHeader · BHome · BLibrary · BAgentDetail · BFooter
   ============================================================================ */
const { Icon: BI, Hl: BHl, StatusBadge: BStatus, AgentCard: BAgentCard, CAT_LABELS: BCATS } = window;
const BHUB = window.HUB;

function initialsB(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

/* ---------------------------------------------------------------- Header */
function BHeader({ view, goHome, goLibrary }) {
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
              <BI name="chat" size={13} /> &nbsp;#creative-studio
            </a>
          </div>
        </div>
      </div>
      <header className="hub-header">
        <div className="wrap hub-header__inner">
          <a className="hub-brand" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>
            <span className="hub-logo hub-logo--header" role="img" aria-label="ImmoScout24"></span>
            <span className="hub-brand__div" />
            <span className="hub-brand__studio">
              <b>Creative Studio</b>
              <span>AI Creation Hub</span>
            </span>
          </a>
          <nav className="hub-nav">
            <a href="#" className={view === "home" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); goHome(); }}>Home</a>
            <a href="#" className={view === "library" || view === "agent" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); goLibrary("all"); }}>Agent Library</a>
          </nav>
          <div className="hub-header__actions">
            <a className="btn btn--brand btn--sm" href="#" onClick={(e) => { e.preventDefault(); goLibrary("all"); }}>
              Browse agents
            </a>
            <span className="hub-avatar" title="Your account">
              <BI name="profile" />
            </span>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

/* ------------------------------------------------------------------ Home */
function BHome({ goLibrary, goAgent }) {
  const recs = BHUB.RECOMMENDED.map((id) => BHUB.AGENTS.find((a) => a.id === id)).filter(Boolean);
  const liveCount = BHUB.AGENTS.filter((a) => a.status === "live").length;

  return (
    <React.Fragment>
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
                <span className="pin" /> The home for AI powered marketing creation
              </span>
              <h1>
                Find the <BHl>right agent</BHl><br /> for the job
              </h1>
              <p className="hero__sub">One curated library of AI agents.</p>
              <p className="hero__copy">
                For creation, adaptation, checks and brand guidance, enabled and governed by
                Creative Studio. Pick an agent, see exactly what it does and when to use it, then
                open it.
              </p>
              <div className="hero__cta">
                <a className="btn btn--primary btn--lg" href="#" onClick={(e) => { e.preventDefault(); goLibrary("all"); }}>
                  <BI name="search" /> Browse the Agent Library
                </a>
                <a className="btn btn--ghost btn--lg" href="#" onClick={(e) => e.preventDefault()}>
                  <BI name="video" /> Watch the 3 min intro
                </a>
              </div>
              <div className="hero__trust">
                <span><b>{BHUB.AGENTS.length}</b> agents</span>
                <span className="sep" />
                <span><b>{liveCount}</b> live now</span>
                <span className="sep" />
                <span><b>{BHUB.CATEGORIES.length}</b> categories</span>
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
                <span className="ico"><BI name="add-glyph" size={20} /></span>
                <span>
                  <b>First drafts in minutes</b>
                  <span>not days</span>
                </span>
              </div>
              <div className="hero__chip hero__chip--br">
                <span className="ico"><BI name="service-security-check" size={20} /></span>
                <span>
                  <b>Quality guardrails</b>
                  <span>built in</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start with these */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="bhome-head">
            <div>
              <span className="sec-head__eyebrow"><BI name="premium" /> Recommended first agents</span>
              <h2 className="bhome-head__title">New here? Start with these</h2>
            </div>
            <a className="bhome-head__link" href="#" onClick={(e) => { e.preventDefault(); goLibrary("all"); }}>
              See all {BHUB.AGENTS.length} agents <BI name="arrow-right" size={14} />
            </a>
          </div>
          <div className="agent-grid">
            {recs.map((a) => <BAgentCard agent={a} key={a.id} onOpen={goAgent} />)}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="section section--tight section--warm">
        <div className="wrap">
          <div className="bhome-head">
            <div>
              <span className="sec-head__eyebrow"><BI name="dashboard" /> Browse by category</span>
              <h2 className="bhome-head__title">Five ways the hub supports your work</h2>
            </div>
          </div>
          <div className="cat-grid">
            {BHUB.CATEGORIES.map((c) => {
              const count = BHUB.AGENTS.filter((a) => a.categories.includes(c.id)).length;
              return (
                <div className="cat-card reveal" key={c.id} style={{ "--cat-tint": c.tint }} onClick={() => goLibrary(c.id)}>
                  <div className="cat-card__icon"><BI name={c.icon} size={22} /></div>
                  <h4>{c.label}</h4>
                  <p>{c.blurb}</p>
                  <div className="cat-card__count">{count} {count === 1 ? "agent" : "agents"} <BI name="arrow-right" size={13} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="breassure">
            <div className="breassure__lead">
              <span className="breassure__ico"><BI name="data-security" size={24} /></span>
              <div>
                <h3>Governed, so you can move fast safely</h3>
                <p>Every agent carries clear guidance on when to use it, when not to, and where Creative Studio review is required, right on its page.</p>
              </div>
            </div>
            <div className="breassure__links">
              <a href="#" onClick={(e) => e.preventDefault()}><BI name="video" size={16} /> Learn basic prompting</a>
              <a href="#" onClick={(e) => e.preventDefault()}><BI name="chat" size={16} /> Request Creative Studio sparring</a>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

/* --------------------------------------------------------------- Library */
function BLibrary({ filter, setFilter, goAgent }) {
  const [q, setQ] = React.useState("");

  const counts = React.useMemo(() => {
    const m = { all: BHUB.AGENTS.length };
    BHUB.CATEGORIES.forEach((c) => { m[c.id] = BHUB.AGENTS.filter((a) => a.categories.includes(c.id)).length; });
    return m;
  }, []);

  let shown = filter === "all" ? BHUB.AGENTS : BHUB.AGENTS.filter((a) => a.categories.includes(filter));
  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    shown = shown.filter((a) =>
      a.name.toLowerCase().includes(needle) ||
      a.what.toLowerCase().includes(needle) ||
      a.tags.join(" ").toLowerCase().includes(needle) ||
      a.owner.toLowerCase().includes(needle)
    );
  }
  const featured = shown.filter((a) => a.featured);
  const rest = shown.filter((a) => !a.featured);

  return (
    <section className="section blib">
      <div className="wrap">
        <div className="blib-head">
          <div>
            <span className="sec-head__eyebrow"><BI name="dashboard-glyph" /> Agent Library</span>
            <h1 className="blib-head__title">Every agent, in one place</h1>
            <p className="blib-head__lead">Browse, filter or search. Open any agent for what it does, when to use it, tutorials and examples.</p>
          </div>
          <label className="blib-search">
            <BI name="search" size={18} />
            <input
              type="text"
              value={q}
              placeholder="Search agents, tags, owners…"
              onChange={(e) => setQ(e.target.value)}
            />
            {q && <button className="blib-search__clear" onClick={() => setQ("")} aria-label="Clear"><BI name="cancel" size={14} /></button>}
          </label>
        </div>

        <div className="cat-bar blib-bar">
          <button className={`cat-pill ${filter === "all" ? "is-active" : ""}`} onClick={() => setFilter("all")}>
            All agents <span className="count">{counts.all}</span>
          </button>
          {BHUB.CATEGORIES.map((c) => (
            <button key={c.id} className={`cat-pill ${filter === c.id ? "is-active" : ""}`} style={{ "--cat-tint": c.tint }} onClick={() => setFilter(c.id)}>
              <span className="ico"><BI name={c.icon} size={16} /></span>
              {c.label} <span className="count">{counts[c.id]}</span>
            </button>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="blib-empty">
            <BI name="search" size={28} />
            <p>No agents match “{q}”.</p>
            <button className="btn btn--ghost btn--sm" onClick={() => { setQ(""); setFilter("all"); }}>Reset filters</button>
          </div>
        )}

        {featured.length > 0 && (
          <React.Fragment>
            <div className="blib-label"><BI name="premium" size={15} /> Featured &amp; recommended</div>
            <div className="agent-grid" style={{ marginBottom: rest.length ? 40 : 0 }}>
              {featured.map((a) => <BAgentCard agent={a} key={a.id} onOpen={goAgent} />)}
            </div>
          </React.Fragment>
        )}
        {rest.length > 0 && (
          <React.Fragment>
            <div className="blib-label">{featured.length ? "More agents" : "All agents"}</div>
            <div className="agent-grid">
              {rest.map((a) => <BAgentCard agent={a} key={a.id} onOpen={goAgent} />)}
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Agent detail */
function BDetailSection({ id, eyebrow, icon, title, children }) {
  return (
    <section className="adp-sec" id={id}>
      <div className="adp-sec__head">
        {eyebrow && <span className="adp-sec__eyebrow"><BI name={icon} size={15} /> {eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BAgentDetail({ agent, goLibrary, goAgent }) {
  const d = BHUB.getAgentDetail(agent);
  const phase = (BHUB.STATUS[agent.status] || {}).label;
  const related = BHUB.AGENTS
    .filter((a) => a.id !== agent.id && a.categories.some((c) => agent.categories.includes(c)))
    .slice(0, 3);

  const [sent, setSent] = React.useState(false);

  return (
    <div className="adp">
      {/* hero band */}
      <div className="adp-hero">
        <div className="wrap">
          <button className="adp-back" onClick={() => goLibrary(agent.categories[0])}>
            <BI name="arrow-left" size={16} /> Agent Library
          </button>
          <div className="adp-hero__main">
            <span className="adp-hero__icon"><BI name={agent.icon} size={34} /></span>
            <div className="adp-hero__text">
              <div className="adp-hero__badges">
                <BStatus status={agent.status} progress={agent.progress} />
                {agent.categories.map((c) => (
                  <span className="tag tag--ondark" key={c}>{BCATS[c]}</span>
                ))}
              </div>
              <h1>{agent.name}</h1>
              <p>{d.bestFor}</p>
              <div className="adp-hero__meta">
                <span><BI name="profile" size={14} /> {agent.owner}</span>
                <span><BI name="dashboard" size={14} /> {phase} · {agent.progress}%</span>
                <span><BI name="persons" size={14} /> {agent.target.slice(0, 3).join(", ")}{agent.target.length > 3 ? "…" : ""}</span>
              </div>
            </div>
          </div>
          <div className="adp-hero__cta">
            {agent.link ? (
              <a className="btn btn--brand btn--lg" href={agent.link} target="_blank" rel="noreferrer"><BI name="arrow-right" /> Open agent</a>
            ) : (
              <span className="btn btn--brand btn--lg is-disabled" aria-disabled="true"><BI name="stopwatch" /> Link coming soon</span>
            )}
            <a className="btn btn--ondark btn--lg" href="#" onClick={(e) => e.preventDefault()}><BI name="chat" /> Request sparring</a>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="wrap adp-grid">
        <div className="adp-main">
          <BDetailSection id="what" eyebrow="What it does" icon="info-glyph" title="What it does">
            <p className="adp-lead">{agent.what}</p>
          </BDetailSection>

          <div className="adp-usewhen">
            <div className="adp-use adp-use--do">
              <h3><BI name="accept-glyph" size={18} /> When to use it</h3>
              <ul>
                {d.whenToUse.map((it, i) => (
                  <li key={i}><BI name="accept" size={16} /> <span>{it}</span></li>
                ))}
              </ul>
            </div>
            <div className="adp-use adp-use--dont">
              <h3><BI name="caution-glyph" size={18} /> When not to use it</h3>
              <ul>
                {d.whenNotToUse.map((it, i) => (
                  <li key={i}><BI name="cancel" size={16} /> <span>{it}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <BDetailSection id="tutorials" eyebrow="Tutorials" icon="video" title="Learn how to use it">
            {d.tutorials.length > 0 ? (
              <div className="adp-tut-grid">
                {d.tutorials.map((t) => (
                  <div className="tut-card reveal" key={t.id}>
                    <div className="tut-card__media">
                      <img src={t.photo} alt="" />
                      <div className="tut-card__play"><span className="ring"><BI name="virtualtour" size={22} /></span></div>
                      <span className="tut-card__dur">{t.duration}</span>
                    </div>
                    <div className="tut-card__body">
                      <div className="tut-card__agent">{t.level}</div>
                      <h4>{t.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="adp-empty">
                <p><b>A walkthrough for this agent is on the way.</b> Every tutorial follows the same seven-step format, so learning one teaches you all of them.</p>
                <div className="adp-format__steps">
                  {BHUB.TUTORIAL_FORMAT.map((s, i) => (
                    <span className="step" key={i}><span className="n">{i + 1}</span> {s}</span>
                  ))}
                </div>
              </div>
            )}
          </BDetailSection>

          <BDetailSection id="examples" eyebrow="Examples" icon="premium" title="Real work, made faster">
            {d.examples.length > 0 ? (
              <div className="adp-ex-grid">
                {d.examples.map((s) => (
                  <div className="show-card reveal" key={s.id}>
                    <div className="show-card__media">
                      <img src={s.photo} alt="" />
                      <span className="show-card__pill">{s.team}</span>
                    </div>
                    <div className="show-card__body">
                      <h4>{s.useCase}</h4>
                      <p className="show-card__impact">{s.impact}</p>
                      <div className="adp-ex__learn"><b>Learning · </b>{s.learning}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="adp-empty adp-empty--center">
                <BI name="picture" size={26} />
                <p><b>No examples published yet.</b> Used this agent on something good? Submit it and your story could be next.</p>
                <button className="btn btn--ghost btn--sm" onClick={(e) => e.preventDefault()}><BI name="share" /> Submit an example</button>
              </div>
            )}
          </BDetailSection>
        </div>

        {/* aside */}
        <aside className="adp-aside">
          <div className="adp-card">
            <div className="adp-card__title">At a glance</div>
            <div className="adp-glance">
              <div className="adp-glance__row">
                <span className="k">Phase</span>
                <span className="v"><BStatus status={agent.status} /></span>
              </div>
              <div className="adp-progress"><span style={{ width: agent.progress + "%" }} /></div>
              <div className="adp-glance__row"><span className="k">Target users</span><span className="v adp-tw">{agent.target.join(", ")}</span></div>
              <div className="adp-glance__row adp-glance__tags">
                <span className="k">Tags</span>
                <span className="v">
                  <span className="adp-tagrow">{agent.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="adp-card">
            <div className="adp-card__title">Owner &amp; support</div>
            <div className="adp-owner">
              <span className="av">{initialsB(agent.owner)}</span>
              <div><b>{agent.owner}</b><span>Owner &amp; sparring contact</span></div>
            </div>
            {sent ? (
              <div className="adp-fb-sent"><BI name="accept-glyph" size={18} /> Thanks — Creative Studio will be in touch.</div>
            ) : (
              <div className="adp-fb">
                <button className="adp-fb-btn" onClick={() => setSent(true)}><BI name="chat" size={16} /> Give feedback on this agent</button>
                <button className="adp-fb-btn" onClick={() => setSent(true)}><BI name="caution" size={16} /> Report an issue</button>
                <button className="adp-fb-btn" onClick={() => setSent(true)}><BI name="telephone" size={16} /> Ask in #creative-studio</button>
              </div>
            )}
          </div>

          <div className="adp-open">
            {agent.link ? (
              <a className="btn btn--brand btn--block btn--lg" href={agent.link} target="_blank" rel="noreferrer"><BI name="arrow-right" /> Open agent</a>
            ) : (
              <span className="btn btn--brand btn--block btn--lg is-disabled" aria-disabled="true"><BI name="stopwatch" /> Link coming soon</span>
            )}
          </div>
        </aside>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="section section--tight section--warm adp-related">
          <div className="wrap">
            <div className="bhome-head">
              <div>
                <span className="sec-head__eyebrow"><BI name="list-view-compare" /> Related agents</span>
                <h2 className="bhome-head__title">You might also need</h2>
              </div>
              <a className="bhome-head__link" href="#" onClick={(e) => { e.preventDefault(); goLibrary(agent.categories[0]); }}>
                More in {BCATS[agent.categories[0]]} <BI name="arrow-right" size={14} />
              </a>
            </div>
            <div className="agent-grid">
              {related.map((a) => <BAgentCard agent={a} key={a.id} onOpen={goAgent} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Footer */
function BFooter({ goHome, goLibrary }) {
  return (
    <footer className="hub-footer">
      <div className="wrap">
        <div className="bfooter-grid">
          <div className="footer-brand">
            <span className="hub-logo hub-logo--footer" role="img" aria-label="ImmoScout24"></span>
            <p>The AI Marketing Creation Hub is built, curated and governed by Creative Studio, helping marketing teams create faster while staying unmistakably on brand.</p>
            <a className="btn btn--brand btn--sm" href="#" onClick={(e) => e.preventDefault()}><BI name="chat" /> Request Creative Studio sparring</a>
          </div>
          <div className="footer-col">
            <h5>Navigate</h5>
            <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); goLibrary("all"); }}>Agent Library</a>
          </div>
          <div className="footer-col">
            <h5>Creative Studio</h5>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact the team</a>
            <a href="#" onClick={(e) => e.preventDefault()}>#creative-studio</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Give feedback</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-owner"><span className="dot" /> Owned by Creative Studio · ImmoScout24 / Scout24 · Internal MVP concept</span>
          <span>© {new Date().getFullYear()} Scout24. Internal use only.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { BHeader, BHome, BLibrary, BAgentDetail, BFooter });
