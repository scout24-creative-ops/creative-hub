/* ============================================================================
   Concept D — "the playful gallery".
   Self-contained agent cards (no detail page). Each card has two actions:
   Tutorial (opens an inline how-to modal) and Open agent (launches the link).
   Creative Studio ownership is foregrounded in the headline, a scrolling
   marquee, on every card, and in the footer. English throughout.
   Views: DHeader · DHome · DTutorialModal · DFooter
   ============================================================================ */
const { Icon: DI } = window;
const DHUB = window.HUB;

/* Agents "on the platform" = everything actually built (drop idea-stage),
   minus a few hidden from this concept. */
const D_HIDDEN = new Set(["design-direction", "figma-token-architect", "figma-iab-html", "ad-format-adapter", "gif-compression", "brand-channel"]);
const D_AGENTS = DHUB.AGENTS.filter((a) => a.status !== "idea" && !D_HIDDEN.has(a.id));
const D_TINT = {};
const D_CATLABEL = {};
DHUB.CATEGORIES.forEach((c) => {D_TINT[c.id] = c.tint;D_CATLABEL[c.id] = c.label;});

function dInitials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* decorative icon-sticker collage for the hero (real agent glyphs) */
const HERO_TILES = [
{ icon: "document-empty", tint: "var(--is24-teal)" },
{ icon: "picture", tint: "var(--brand-purple)" },
{ icon: "chat", tint: "var(--brand-yellow)" },
{ icon: "video", tint: "var(--brand-blue)" },
{ icon: "edit", tint: "var(--brand-orange)" },
{ icon: "premium-2", tint: "var(--is24-teal)" }];


function dScrollToAgents() {
  const el = document.getElementById("agents");
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
}

/* ---------------------------------------------------------------- Header */
function DHeader({ goHome }) {
  return (
    <header className="dv-header">
      <div className="wrap dv-header__inner">
        <a className="dv-brand" href="#" onClick={(e) => {e.preventDefault();goHome();}} aria-label="ImmoScout24 — back to all agents">
          <span className="hub-logo hub-logo--header" role="img" aria-label="ImmoScout24"></span>
        </a>
        <nav className="dv-nav">
          <span className="dv-nav__by">
            <span className="pulse" /> Made by <b>Creative Studio</b>
          </span>
        </nav>
      </div>
    </header>);

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

/* ------------------------------------------------------------- Home/gallery */
function DHome({ onTutorial }) {
  const [filter, setFilter] = React.useState("all");
  const [q, setQ] = React.useState("");

  const counts = React.useMemo(() => {
    const m = { all: D_AGENTS.length };
    DHUB.CATEGORIES.forEach((c) => {m[c.id] = D_AGENTS.filter((a) => a.categories[0] === c.id).length;});
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

  let shown = filter === "all" ? D_AGENTS : D_AGENTS.filter((a) => a.categories[0] === filter);
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
      <section className="dv-intro">
        <div className="wrap dv-hero__grid">
          <div className="dv-hero__copy">
            <span className="dv-eyebrow"><b>✦</b> AI Marketing Creation Hub</span>
            <h1>
              <window.Hl>Create&nbsp;faster.</window.Hl><br />
              Stay on brand.<br />
              Work smarter with&nbsp;AI.
            </h1>
            <p>
              A growing collection of <b>Creative Studio AI agents</b> built to help Marketing teams create
              faster, stay on brand and turn repeated creative work into reusable workflows. Start with a
              short tutorial, then open the agent.
            </p>
            <div className="dv-cta-row">
              <button className="dv-cta" onClick={dScrollToAgents}>
                Explore Agents
                <span className="dv-cta__arr"><DI name="arrow-right" size={17} /></span>
              </button>
              <a className="dv-cta dv-cta--ghost" href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer">
                Contact us
                <span className="dv-cta__arr dv-cta__arr--ghost"><DI name="chat" size={16} /></span>
              </a>
            </div>
          </div>
          <div className="dv-hero__art" aria-hidden="true">
            <span className="dv-doodle" />
            <span className="dv-doodle dv-doodle--2" />
            {HERO_TILES.map((t, i) =>
            <span className={`dv-tile dv-tile--${i + 1}`} key={i} style={{ "--tint": t.tint }}>
                <DI name={t.icon} size={32} />
              </span>
            )}
            <span className="dv-spark dv-spark--1">✦</span>
            <span className="dv-spark dv-spark--2">✦</span>
            <span className="dv-spark dv-spark--3">+</span>
            <span className="dv-spark dv-spark--4">✦</span>
            <span className="dv-spark dv-spark--5">+</span>
            <span className="dv-dot dv-dot--1" />
            <span className="dv-dot dv-dot--2" />
            <span className="dv-squiggle" aria-hidden="true">
              <svg viewBox="0 0 80 16" fill="none"><path d="M2 8c6-8 12 8 18 0s12-8 18 0 12 8 18 0 12-8 18 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </span>
          </div>
        </div>
      </section>

      <DMarquee />

      <section className="dv-gallery" id="agents">
        <div className="wrap">
          <div className="dv-grid">
            {shown.length === 0 ?
            <div className="dv-empty">
                <DI name="search" size={26} />
                <p>No agents match “{q}”.</p>
                <button className="btn btn--ghost btn--sm" onClick={() => {setQ("");setFilter("all");}}>Reset filters</button>
              </div> :

            shown.map((a, i) => <DCard agent={a} key={a.id} index={i} onTutorial={onTutorial} />)
            }
          </div>
        </div>
      </section>

      <DFilterDock
        filter={filter} setFilter={setFilter}
        q={q} setQ={setQ}
        cats={cats} counts={counts} />
      
    </React.Fragment>);

}

/* ------------------------------------------------ Floating filter dock */
function DFilterDock({ filter, setFilter, q, setQ, cats, counts }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY || document.documentElement.scrollTop;
      const nearBottom = window.innerHeight + sc >= document.documentElement.scrollHeight - 140;
      setVisible(sc > 360 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {window.removeEventListener("scroll", onScroll);window.removeEventListener("resize", onScroll);};
  }, []);

  return (
    <div className={`dv-dock ${visible ? "is-visible" : ""}`} role="search">
      <div className="dv-dock__pills">
        <button className={`dv-pill ${filter === "all" ? "is-active" : ""}`} style={{ "--tint": "var(--is24-teal)" }} onClick={() => setFilter("all")}>
          All <span className="n">{counts.all}</span>
        </button>
        {cats.map((c) =>
        <button key={c.id} className={`dv-pill ${filter === c.id ? "is-active" : ""}`} style={{ "--tint": c.tint }} onClick={() => setFilter(c.id)}>
            {c.label} <span className="n">{counts[c.id]}</span>
          </button>
        )}
      </div>
      <label className="dv-dock__search">
        <DI name="search" size={16} />
        <input type="text" value={q} placeholder="Search…" onChange={(e) => setQ(e.target.value)} />
        {q && <button className="dv-search__clear" onClick={() => setQ("")} aria-label="Clear search"><DI name="cancel" size={12} /></button>}
      </label>
    </div>);

}

/* ---------------------------------------------------------- Tutorial modal */
function DTutorialModal({ agent, onClose }) {
  const d = DHUB.getAgentDetail(agent);
  const tint = D_TINT[agent.categories[0]] || "var(--is24-teal)";
  const video = (d.tutorials || [])[0];
  const steps = DHUB.TUTORIAL_FORMAT || [];
  const [playing, setPlaying] = React.useState(false);
  // The preview server can't stream large MP4s (no range requests), so fetch
  // the file into a blob URL once playback is requested. Blob URLs (standalone
  // bundle) pass straight through.
  const [blobSrc, setBlobSrc] = React.useState(null);
  const [loadingVideo, setLoadingVideo] = React.useState(false);
  const startPlayback = () => {
    if (!video || !video.videoUrl) return;
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
    if (!video || !video.videoUrl || video.videoUrl.startsWith("blob:")) return;
    let cancelled = false;
    fetch(video.videoUrl)
      .then((r) => r.blob())
      .then((b) => { if (!cancelled) setBlobSrc(URL.createObjectURL(b)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    document.body.classList.add("modal-open");
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => {document.body.classList.remove("modal-open");window.removeEventListener("keydown", onKey);};
  }, []);

  return (
    <div className="dv-scrim" onClick={onClose}>
      <div className="dv-modal" style={{ "--tint": tint }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="dv-modal__head">
          <button className="dv-modal__close" onClick={onClose} aria-label="Close"><DI name="cancel" size={16} /></button>
          <div className="dv-modal__id">
            <span className="dv-modal__icon"><DI name={agent.icon} size={28} /></span>
            <h2>{agent.name}</h2>
          </div>
          <p className="dv-modal__best">{d.bestFor}</p>
          {agent.audience && agent.audience.length > 0 &&
          <div className="dv-modal__aud">
            {agent.audience.map((a) => <span className="dv-modal__aud-chip" key={a}>{a}</span>)}
          </div>
          }
        </div>

        <div className="dv-modal__body">
          {video &&
          <div className="dv-modal__sec">
              <h3><DI name="video" size={15} /> Watch the walkthrough</h3>
              <div className={`dv-tut ${playing && video.videoUrl ? "is-playing" : ""}`}>
                <div className="dv-tut__media">
                  {playing && video.videoUrl ?
                  <video className="dv-tut__video" src={blobSrc || video.videoUrl} poster={video.photo} controls autoPlay playsInline /> :
                  <React.Fragment>
                    <img src={video.photo} alt="" />
                    {video.videoUrl ?
                    <button className={`dv-tut__play ${loadingVideo ? "is-loading" : ""}`} onClick={startPlayback} disabled={loadingVideo} aria-label="Play tutorial video">
                      <span className="ring">{loadingVideo ? <DI name="stopwatch" size={20} /> : <DI name="arrow-right" size={20} />}</span>
                    </button> :
                    agent.link ?
                    <a className="dv-tut__play" href={agent.link} target="_blank" rel="noreferrer" aria-label="Watch the walkthrough">
                      <span className="ring"><DI name="arrow-right" size={20} /></span>
                    </a> : null}
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
function DFooter({ goHome }) {
  return (
    <footer className="dv-footer" style={{ backgroundColor: "rgb(51, 51, 51)" }}>
      <div className="wrap">
        <div className="dv-footer__top">
          <div className="dv-footer__blurb">
            <a className="hub-brand" href="#" onClick={(e) => {e.preventDefault();goHome();}}>
              <span className="hub-logo hub-logo--footer" role="img" aria-label="ImmoScout24"></span>
            </a>
            <p>The AI Marketing Creation Hub is built, curated and maintained by Creative Studio & Creative Ops — so every agent is easy to start with, aligned with our brand standards and improved through real Marketing use cases.</p>
          </div>
        </div>
        <div className="dv-footer__bottom">
          <span className="owner"><span className="dot" /> Creative Studio · ImmoScout24 / Scout24</span>
          <span>© {new Date().getFullYear()} Scout24</span>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { DHeader, DHome, DTutorialModal, DFooter });