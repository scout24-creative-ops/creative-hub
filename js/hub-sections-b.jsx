/* ============================================================================
   Sections part B: StartHere, Tutorials, Guardrails, Feedback, Impact,
   Showcase, Footer
   ============================================================================ */
const { Icon: I2, Hl: Hl2, SectionHead: SH2 } = window;
const HUBB = window.HUB;

function StartHere({ onOpenAgent }) {
  const recs = HUBB.RECOMMENDED.map((id) => HUBB.AGENTS.find((a) => a.id === id)).filter(Boolean);
  return (
    <section className="section" id="start">
      <div className="wrap">
        <div className="start-grid">
          <div className="start-aside">
            <SH2
              eyebrow="Start here"
              eyebrowIcon="positive-check"
              title={<span>New to AI powered creation? <Hl2>Start here.</Hl2></span>}
              lead="A short, friendly path for first time users, with no design background needed."
            />
            <div className="start-aside__rec">
              <div style={{ fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", marginBottom: 4 }}>
                Recommended first agents
              </div>
              {recs.map((a) => (
                <div className="rec-item" key={a.id} onClick={() => onOpenAgent(a)}>
                  <span className="ico"><I2 name={a.icon} size={20} /></span>
                  <span style={{ flex: 1 }}>
                    <b>{a.name}</b>
                    <span>{a.target.slice(0, 2).join(", ")}</span>
                  </span>
                  <I2 name="arrow-right" size={15} style={{ color: "var(--color-text-muted)" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="start-steps">
            {HUBB.START_STEPS.map((s, i) => (
              <div className="start-step reveal" key={i}>
                <div className="start-step__icon"><I2 name={s.icon} size={22} /></div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {s.cta} <I2 name="arrow-right" size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Tutorials() {
  return (
    <section className="section section--warm" id="tutorials">
      <div className="wrap">
        <SH2
          eyebrow="Tutorials"
          eyebrowIcon="video"
          title="Short, practical, lightweight"
          lead="2 to 5 minute walkthroughs, not polished corporate videos. Each one follows the same simple format so you always know what to expect."
        />
        <div className="tut-grid">
          {HUBB.TUTORIALS.map((t) => (
            <div className="tut-card reveal" key={t.id}>
              <div className="tut-card__media">
                <img src={t.photo} alt="" />
                <div className="tut-card__play">
                  <span className="ring"><I2 name="virtualtour" size={22} /></span>
                </div>
                <span className="tut-card__dur">{t.duration}</span>
              </div>
              <div className="tut-card__body">
                <div className="tut-card__agent">{t.agent}</div>
                <h4>{t.title}</h4>
                <span className="tut-card__lvl">
                  <I2 name="education" size={14} /> {t.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="tut-format">
          <h4>Every tutorial covers the same seven steps</h4>
          <p>A consistent, scalable format that scales as we add agents, so learning one teaches you all of them.</p>
          <div className="tut-format__steps">
            {HUBB.TUTORIAL_FORMAT.map((s, i) => (
              <span className="step" key={i}>
                <span className="n">{i + 1}</span> {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Guardrails() {
  return (
    <section className="section" id="guardrails">
      <div className="wrap">
        <SH2
          eyebrow="Quality &amp; brand guardrails"
          eyebrowIcon="data-security"
          title="Quality guardrails for AI powered creation"
          lead="AI can accelerate creation, but every output still needs human judgement. Use these principles to keep assets brand safe, accessible, recognisable and ready for the right channel."
        />
        <div className="guard-grid">
          {HUBB.GUARDRAILS.map((g) => (
            <div className={`guard-col guard-col--${g.tone} reveal`} key={g.id}>
              <div className="guard-col__head">
                <span className="guard-col__ico"><I2 name={g.icon} size={22} /></span>
                <h3>{g.title}</h3>
              </div>
              <p className="guard-col__sub">{g.sub}</p>
              <ul>
                {g.items.map((it, i) => (
                  <li key={i}>
                    <I2 name={g.tone === "ask" ? "arrow-right" : g.tone === "ok" ? "accept" : "caution"} size={16} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Feedback() {
  const [sent, setSent] = React.useState(false);
  const actions = [
    { icon: "chat", t: "Give feedback on an agent", s: "Tell us what worked and what didn't" },
    { icon: "add-glyph", t: "Request a new use case", s: "Something the hub should support" },
    { icon: "share", t: "Submit an example", s: "Show what you created" },
    { icon: "telephone", t: "Join the Slack channel", s: "#creative-studio" },
  ];
  return (
    <section className="section section--warm" id="feedback">
      <div className="wrap">
        <SH2
          eyebrow="Feedback &amp; requests"
          eyebrowIcon="chat"
          title="Help us shape the hub"
          lead="This is a living platform. Tell us what you need, report issues, or bring a use case to Creative Studio for sparring."
        />
        <div className="fb-panel">
          <div className="fb-left">
            <h3>However you want to reach us</h3>
            <p>Pick the quickest route. Every one lands with Creative Studio.</p>
            <div className="fb-actions">
              {actions.map((a, i) => (
                <button className="fb-action" key={i}>
                  <span className="ico"><I2 name={a.icon} size={20} /></span>
                  <span>
                    <b>{a.t}</b>
                    <span>{a.s}</span>
                  </span>
                  <I2 name="arrow-right" size={16} className="arr" />
                </button>
              ))}
            </div>
          </div>
          <div className="fb-right">
            <h4>Request a new use case</h4>
            {sent ? (
              <div className="fb-sent">
                <I2 name="accept-glyph" size={20} /> Thanks, Creative Studio will be in touch.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="field">
                  <label>Your team</label>
                  <select defaultValue="">
                    <option value="" disabled>Choose your team…</option>
                    <option>Performance Marketing</option>
                    <option>Content</option>
                    <option>CRM / Mailing</option>
                    <option>Campaign</option>
                    <option>Product Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>What would you like to create or solve?</label>
                  <textarea placeholder="e.g. on brand banner variations for our recurring newsletter…" />
                </div>
                <button className="btn btn--primary btn--block" type="submit">
                  <I2 name="paperplane" /> Send request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section className="section section--ink" id="impact">
      <div className="wrap">
        <span className="impact-note" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.2)" }}>
          <I2 name="info-glyph" size={14} /> Concept, illustrative figures for the MVP
        </span>
        <SH2
          eyebrow="Impact &amp; tracking"
          eyebrowIcon="statistics"
          title="Making AI powered creation measurable"
          lead="For V1 this is a lightweight, partly manual view. The structure makes future impact visible: visits, uses, time saved, quality and the use cases we scale."
        />
        <div className="metric-grid">
          {HUBB.METRICS.map((m, i) => (
            <div className="metric reveal" key={i}>
              <div className="metric__top">
                <span className="metric__ico"><I2 name={m.icon} size={21} /></span>
                <span className="metric__trend">{m.trend}</span>
              </div>
              <div className="metric__val">{m.value}</div>
              <div className="metric__label">{m.label}</div>
              <div className="metric__hint">{m.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="section" id="showcase">
      <div className="wrap">
        <SH2
          eyebrow="Created with our AI agents"
          eyebrowIcon="premium"
          title={<span>Real work, made <Hl2>faster</Hl2></span>}
          lead="Example outcomes from teams using the hub. For this first version these are illustrative, and your story could be next."
        />
        <div className="show-grid">
          {HUBB.SHOWCASES.map((s) => (
            <div className="show-card reveal" key={s.id}>
              <div className="show-card__media">
                <img src={s.photo} alt="" />
                <span className="show-card__pill">{s.team}</span>
              </div>
              <div className="show-card__body">
                <h4>{s.useCase}</h4>
                <div className="show-card__team">
                  <I2 name="dashboard" size={13} /> {s.agent}
                </div>
                <p className="show-card__impact">{s.impact}</p>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.45, marginBottom: 14 }}>
                  <b style={{ color: "var(--hub-ink)" }}>Learning · </b>{s.learning}
                </div>
                <div className="show-card__foot">
                  <I2 name="service-security-check" size={14} /> {s.owner}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onJump }) {
  return (
    <footer className="hub-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="hub-logo hub-logo--footer" role="img" aria-label="ImmoScout24"></span>
            <p>
              The AI Marketing Creation Hub is built, curated and governed by Creative Studio,
              helping marketing teams create faster while staying unmistakably on brand.
            </p>
            <a className="btn btn--brand btn--sm" href="#" onClick={(e) => e.preventDefault()}>
              <I2 name="chat" /> Request Creative Studio sparring
            </a>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <a href="#agents" onClick={onJump("agents")}>All agents</a>
            <a href="#categories" onClick={onJump("categories")}>Categories</a>
            <a href="#start" onClick={onJump("start")}>Start here</a>
            <a href="#tutorials" onClick={onJump("tutorials")}>Tutorials</a>
          </div>
          <div className="footer-col">
            <h5>Quality</h5>
            <a href="#guardrails" onClick={onJump("guardrails")}>Brand guardrails</a>
            <a href="#guardrails" onClick={onJump("guardrails")}>Accessibility</a>
            <a href="#guardrails" onClick={onJump("guardrails")}>When to ask us</a>
            <a href="#impact" onClick={onJump("impact")}>Impact &amp; tracking</a>
          </div>
          <div className="footer-col">
            <h5>Creative Studio</h5>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact the team</a>
            <a href="#" onClick={(e) => e.preventDefault()}>#creative-studio</a>
            <a href="#feedback" onClick={onJump("feedback")}>Give feedback</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Roadmap</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-owner">
            <span className="dot" /> Owned by Creative Studio · ImmoScout24 / Scout24 · Internal MVP concept
          </span>
          <span>© {new Date().getFullYear()} Scout24. Internal use only.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { StartHere, Tutorials, Guardrails, Feedback, Impact, Showcase, Footer });
