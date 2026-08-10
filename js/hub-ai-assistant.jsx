/* Ask the Hub , a grounded answer-and-act overlay.
   V1 uses the local HUB_SEARCH adapter. The UI and action contracts are ready
   for a future authenticated Scout24 retrieval service. */
const { Icon: HAIIcon } = window;
const HAI_SEARCH = window.HUB_SEARCH;

const HAI_SCOPES = [
  ["all", "All trusted"],
  ["guidelines", "Guidelines"],
  ["assets", "Assets"],
  ["agents", "Agents"],
];

const HAI_SUGGESTIONS = [
  "What are the contrast rules for teal?",
  "Find a 48px download icon in white",
  "Which agent can turn my brief into a presentation?",
  "Show homeowner images for social",
];

function haiIntentLabel(intent) {
  return ({ rule: "Trusted answer", asset: "Asset search", tool: "Agent match" })[intent] || "Hub answer";
}

function haiResultIcon(result) {
  if (result.kind === "agent") return result.agent?.icon || "chat";
  if (result.kind === "icon") return "dashboard-glyph";
  if (result.kind === "asset") return result.asset?.lib === "logos" ? "premium" : "picture";
  if (result.kind === "template") return "document-empty";
  return "service-security-check";
}

function haiReadableDate(value) {
  if (!value) return "Current Hub version";
  try { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)); }
  catch (_) { return "Current Hub version"; }
}

function HAIAssetPreview({ result, selectedQuery }) {
  const [state, setState] = React.useState({ loading: result.kind === "asset", url: result.previewUrl || null, error: null });
  React.useEffect(() => {
    let active = true;
    if (result.kind !== "asset" || result.previewUrl) {
      setState({ loading: false, url: result.previewUrl || null, error: null });
      return () => { active = false; };
    }
    setState({ loading: true, url: null, error: null });
    HAI_SEARCH.getPreview(result).then((url) => active && setState({ loading: false, url, error: url ? null : "No local preview is available." })).catch(() => active && setState({ loading: false, url: null, error: "The preview could not be loaded." }));
    return () => { active = false; };
  }, [result.id]);

  const colour = /\bwhite\b/i.test(selectedQuery || "") ? "#ffffff" : "#333333";
  if (state.loading) return <div className="hai-preview hai-preview--loading"><span /><small>Preparing local preview…</small></div>;
  if (!state.url) return <div className="hai-preview hai-preview--empty"><HAIIcon name={haiResultIcon(result)} size={42} /><small>{state.error || "Preview unavailable"}</small></div>;
  if (result.kind === "icon" && result.icon?.colourable) return <div className="hai-preview hai-preview--icon" style={{ "--hai-icon-url": `url("${state.url.replace(/"/g, "%22")}")`, "--hai-icon-colour": colour }}><span /></div>;
  return <div className="hai-preview"><img src={state.url} alt={`Preview of ${result.title}`} /></div>;
}

function HAIResultDetail({ result, query, onNavigate, onTutorial, onClose }) {
  const [copyState, setCopyState] = React.useState("");
  const [downloadState, setDownloadState] = React.useState("");
  if (!result) return null;
  const isVisual = ["asset", "icon"].includes(result.kind);
  const requestedSize = /\b48(?:px)?\b/i.test(query || "") ? 48 : 24;
  const requestedColour = /\bwhite\b/i.test(query || "") ? "white" : "charcoal";
  const copy = async (value, label) => {
    try { await navigator.clipboard.writeText(value); setCopyState(label); window.setTimeout(() => setCopyState(""), 1800); }
    catch (_) { setCopyState("Copy unavailable"); }
  };
  const openRoute = () => {
    if (!result.route) return;
    onNavigate(result.route.section, result.route.page);
    onClose();
  };
  const downloadIcon = async (format) => {
    const helper = window.HUB_FRONTIFY?.downloadIcon;
    const variant = window.HUB_FRONTIFY?.iconVariant?.(result.icon, requestedSize);
    if (!helper || !variant) return setDownloadState("Source unavailable");
    setDownloadState(`Creating ${format.toUpperCase()}…`);
    try { await helper(result.icon, variant, format, requestedColour); setDownloadState(`${format.toUpperCase()} downloaded`); }
    catch (error) { setDownloadState(error.message || "Download failed"); }
    window.setTimeout(() => setDownloadState(""), 2200);
  };

  return <article className={`hai-detail hai-detail--${result.kind}`}>
    <header className="hai-detail__head">
      <span><i /><small>{result.eyebrow}</small></span>
      <em>{result.source}</em>
    </header>
    {isVisual && <HAIAssetPreview result={result} selectedQuery={query} />}
    <div className="hai-detail__body">
      <h3>{result.title}</h3>
      <p>{result.description}</p>
      {result.kind === "rule" && result.evidence && <blockquote><HAIIcon name="quote-open" size={17} /><span>{result.evidence}</span></blockquote>}
      {!!result.palette?.length && <div className="hai-palette" aria-label="Colour values">{result.palette.slice(0, 8).map((colour) => <button type="button" key={`${colour.name}-${colour.hex}`} onClick={() => copy([colour.name, colour.hex, colour.rgb && `RGB ${colour.rgb}`, colour.cmyk && `CMYK ${colour.cmyk}`, colour.pantone].filter(Boolean).join(" · "), `${colour.name} copied`)}><i style={{ background: colour.hex }} /><span><strong>{colour.name}</strong><small>{colour.hex} · {colour.pantone}</small></span></button>)}</div>}
      {result.kind === "asset" && <dl className="hai-metadata">
        <div><dt>Format</dt><dd>{String(result.asset?.extension || "Unknown").toUpperCase()}</dd></div>
        <div><dt>Dimensions</dt><dd>{result.asset?.width && result.asset?.height ? `${result.asset.width} × ${result.asset.height}` : "Not recorded"}</dd></div>
        <div><dt>Collection</dt><dd>{result.asset?.collection || result.asset?.col || result.asset?.lib || "Media Library"}</dd></div>
        <div><dt>Delivery</dt><dd>Optimised Hub preview</dd></div>
      </dl>}
      {result.kind === "icon" && <dl className="hai-metadata">
        <div><dt>Requested</dt><dd>{requestedSize}px · {requestedColour}</dd></div>
        <div><dt>Available</dt><dd>{(result.icon?.sizes || []).map((size) => `${size}px`).join(" + ") || "Special format"}</dd></div>
        <div><dt>Source</dt><dd>Repository-owned SVG</dd></div>
        <div><dt>Style</dt><dd>{result.icon?.style === "glyph" ? "Glyph" : "Standard"}</dd></div>
      </dl>}
      {result.kind === "agent" && <dl className="hai-metadata">
        <div><dt>Owner</dt><dd>{result.agent?.owner}</dd></div>
        <div><dt>Status</dt><dd>{result.agent?.status === "live" ? "Live" : "Testing"}</dd></div>
        <div><dt>Best for</dt><dd>{(result.agent?.audience || []).slice(0, 3).join(" · ")}</dd></div>
        <div><dt>Tags</dt><dd>{(result.agent?.tags || []).slice(0, 3).join(" · ")}</dd></div>
      </dl>}
      <div className="hai-detail__actions">
        {result.kind === "agent" && result.agent?.link && <a className="hai-action hai-action--primary" href={result.agent.link} target="_blank" rel="noreferrer">Open agent <HAIIcon name="arrow-right" size={15} /></a>}
        {result.kind === "agent" && <button className="hai-action" type="button" onClick={() => { onClose(); onTutorial(result.agent); }}>View tutorial</button>}
        {result.kind === "icon" && <React.Fragment><button className="hai-action hai-action--primary" type="button" onClick={() => downloadIcon("svg")}>Download SVG</button><button className="hai-action" type="button" onClick={() => downloadIcon("png")}>Download PNG</button></React.Fragment>}
        {result.kind === "asset" && <button className="hai-action hai-action--primary" type="button" onClick={async () => { const url = await HAI_SEARCH.getPreview(result); if (!url) return; const link = document.createElement("a"); link.href = url; link.download = `${result.title.replace(/\.[^.]+$/, "")}-preview.webp`; document.body.appendChild(link); link.click(); link.remove(); }}>Download preview</button>}
        {["rule", "resource", "template"].includes(result.kind) && <button className="hai-action hai-action--primary" type="button" onClick={() => copy(result.evidence || result.description, "Guidance copied")}>Copy guidance</button>}
        {result.route && <button className="hai-action" type="button" onClick={openRoute}>Open full source</button>}
      </div>
      <p className="hai-detail__status" aria-live="polite">{downloadState || copyState}</p>
    </div>
    <footer><span><HAIIcon name="service-security-check" size={14} /> Permission-safe local result</span><span>{haiReadableDate(result.updated)}</span></footer>
  </article>;
}

function HAIEmptyCanvas() {
  const cards = [
    ["service-security-check", "Ask a rule", "Get the approved guidance and see the exact supporting passage."],
    ["picture", "Find an asset", "Preview images, icons and logos with metadata and delivery options."],
    ["chat", "Choose a tool", "Describe the outcome and get the most relevant Creative Studio agent."],
    ["list-view-compare", "Refine in conversation", "Ask follow-ups like “only SVG”, “in white” or “for paid social”."],
  ];
  return <div className="hai-empty-canvas">
    <span className="hai-empty-canvas__mark">AI</span>
    <div><small>Answer canvas</small><h2>One request.<br/>The right next move.</h2><p>The canvas changes shape for rules, assets and agents instead of giving you a generic list of links.</p></div>
    <div className="hai-capabilities">{cards.map(([icon, title, copy]) => <article key={title}><HAIIcon name={icon} size={22} /><div><strong>{title}</strong><p>{copy}</p></div></article>)}</div>
  </div>;
}

function HubAIAssistant({ open, onOpen, onClose, onNavigate, onTutorial, context, initialPrompt }) {
  const stats = React.useMemo(() => HAI_SEARCH.getStats(), []);
  const [scope, setScope] = React.useState("all");
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [response, setResponse] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [mobilePane, setMobilePane] = React.useState("chat");
  const [status, setStatus] = React.useState("");
  const dialogRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const lastFocusRef = React.useRef(null);
  const lastQueryRef = React.useRef("");

  React.useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open ? inputRef.current?.focus() : onOpen();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [open, onOpen]);

  React.useEffect(() => {
    if (!open) return;
    lastFocusRef.current = document.activeElement;
    const overlay = dialogRef.current?.closest(".hai-overlay");
    const background = overlay?.parentElement ? [...overlay.parentElement.children].filter((element) => element !== overlay) : [];
    const backgroundState = background.map((element) => ({ element, inert: element.inert, ariaHidden: element.getAttribute("aria-hidden") }));
    background.forEach((element) => { element.inert = true; element.setAttribute("aria-hidden", "true"); });
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((node) => !node.hasAttribute("hidden") && node.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
      backgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      lastFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  React.useEffect(() => {
    if (open && initialPrompt) setInput(initialPrompt);
  }, [open, initialPrompt]);

  const reset = () => {
    lastQueryRef.current = "";
    setMobilePane("chat");
    setMessages([]); setResponse(null); setSelected(null); setInput(""); setStatus("New conversation ready."); inputRef.current?.focus();
  };

  const ask = async (value) => {
    const question = String(value || input).trim();
    if (!question || busy) return;
    setInput("");
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text: question }]);
    setBusy(true);
    setStatus("Searching approved Hub content…");
    try {
      const answer = await HAI_SEARCH.query(question, { scope, previous: lastQueryRef.current });
      lastQueryRef.current = answer.contextualQuery;
      setResponse(answer);
      setSelected(answer.results[0] || null);
      if (answer.results.length) setMobilePane("answer");
      setMessages((current) => [...current, { id: answer.id, role: "assistant", text: answer.answer, response: answer }]);
      setStatus(`${answer.results.length} grounded ${answer.results.length === 1 ? "result" : "results"} ready.`);
    } catch (error) {
      setMessages((current) => [...current, { id: `error-${Date.now()}`, role: "assistant", text: "I couldn’t search the local Hub index. Please try again." }]);
      setStatus("Search failed.");
    } finally { setBusy(false); }
  };

  return <React.Fragment>
    {!open && <button className="hai-launcher" type="button" onClick={onOpen} aria-haspopup="dialog" aria-expanded="false"><span><i /> Ask the Hub</span><kbd>⌘ K</kbd></button>}
    {open && <div className="hai-overlay" role="presentation">
      <div className="hai-shell" role="dialog" aria-modal="true" aria-labelledby="hai-title" ref={dialogRef}>
        <header className="hai-shell__header">
          <div className="hai-brand"><span className="hai-brand__mark">AI</span><div><h1 id="hai-title">Ask the Hub</h1><p>Grounded in approved ImmoScout24 content</p></div></div>
          <div className="hai-header-actions"><button type="button" onClick={reset}>New conversation</button><button type="button" className="hai-close" onClick={onClose} aria-label="Close Ask the Hub"><HAIIcon name="cancel" size={18} /></button></div>
        </header>
        <div className="hai-context" aria-label="Search context">
          <span><HAIIcon name="targeting" size={14} /> Context: {context?.title || "Homepage"}</span>
          <div role="group" aria-label="Choose sources">{HAI_SCOPES.map(([id, label]) => <button type="button" key={id} className={scope === id ? "is-active" : ""} aria-pressed={scope === id} onClick={() => setScope(id)}>{label}</button>)}</div>
          <em><i /> Local &amp; permission-safe</em>
        </div>
        <div className={`hai-workspace hai-workspace--${mobilePane}`}>
          <div className="hai-mobile-switch">
            <div role="tablist" aria-label="Assistant workspace">
              <button id="hai-chat-tab" type="button" role="tab" aria-selected={mobilePane === "chat"} aria-controls="hai-pane-chat" className={mobilePane === "chat" ? "is-active" : ""} onClick={() => setMobilePane("chat")}>Chat</button>
              <button id="hai-answer-tab" type="button" role="tab" aria-selected={mobilePane === "answer"} aria-controls="hai-pane-answer" className={mobilePane === "answer" ? "is-active" : ""} disabled={!response?.results?.length} onClick={() => setMobilePane("answer")}>Answer {response?.results?.length ? `· ${response.results.length}` : ""}</button>
            </div>
            <button type="button" onClick={reset}>New</button>
          </div>
          <section className="hai-conversation" id="hai-pane-chat" role="tabpanel" aria-labelledby="hai-chat-tab">
            <div className="hai-thread">
              {!messages.length && <div className="hai-welcome">
                <span>Start anywhere</span>
                <h2>Ask naturally.<br/>Act immediately.</h2>
                <p>Find a rule, preview an approved asset or get the right agent without learning the Hub structure first.</p>
                <div className="hai-suggestions">{HAI_SUGGESTIONS.map((suggestion) => <button type="button" onClick={() => ask(suggestion)} key={suggestion}><span>{suggestion}</span><HAIIcon name="arrow-right" size={15} /></button>)}</div>
                <small>{stats.pages} trusted pages · {stats.agents} agents · {stats.assets.toLocaleString("en-GB")} media records</small>
              </div>}
              {messages.map((message) => <div className={`hai-message hai-message--${message.role}`} key={message.id}>
                <span className="hai-message__author">{message.role === "user" ? "You" : "Hub AI"}</span>
                <div className="hai-message__bubble"><p>{message.text}</p>
                  {message.response?.results?.length > 0 && <div className="hai-message__sources">{message.response.results.slice(0, 4).map((result, index) => <button type="button" key={result.id} onClick={() => { setResponse(message.response); setSelected(result); setMobilePane("answer"); }}><b>{index + 1}</b><span>{result.title}</span></button>)}</div>}
                  {message.response && !message.response.results?.length && <a className="hai-message__escalate" href="https://scout24.slack.com/archives/C026PM1HP2N" target="_blank" rel="noreferrer">Ask Creative Studio <HAIIcon name="arrow-right" size={14} /></a>}
                  {message.response?.trust && <small><HAIIcon name="service-security-check" size={13} /> {message.response.trust.mode} · {message.response.trust.resultCount} results</small>}
                </div>
              </div>)}
              {busy && <div className="hai-message hai-message--assistant"><span className="hai-message__author">Hub AI</span><div className="hai-thinking" aria-label="Searching"><i /><i /><i /><span>Reading the trusted Hub index</span></div></div>}
              {response?.followUps?.length > 0 && !busy && <div className="hai-followups"><span>Continue</span>{response.followUps.map((item) => <button type="button" onClick={() => ask(item)} key={item}>{item}</button>)}</div>}
            </div>
            <form className="hai-composer" onSubmit={(event) => { event.preventDefault(); ask(input); }}>
              <label htmlFor="hai-question">Ask a rule, find an asset or describe what you need to make</label>
              <div><HAIIcon name="search" size={20} /><textarea id="hai-question" ref={inputRef} rows="1" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input); } }} placeholder="e.g. Can I place the white logo on a teal background?" /><button type="submit" disabled={!input.trim() || busy} aria-label="Send question"><HAIIcon name="arrow-up" size={18} /></button></div>
              <footer><span>Search scope: {HAI_SCOPES.find(([id]) => id === scope)?.[1]}</span><span>Shift + Enter for a new line</span></footer>
            </form>
          </section>
          <aside className="hai-canvas" id="hai-pane-answer" role="tabpanel" aria-labelledby="hai-answer-tab">
            {response?.results?.length > 0 ? <React.Fragment>
              <header className="hai-canvas__head"><div><span>{haiIntentLabel(response.intent)}</span><strong>{response.results.length} grounded {response.results.length === 1 ? "result" : "results"}</strong></div><small>Click a source to inspect it here</small></header>
              <nav className="hai-result-tabs" aria-label="Answer sources">{response.results.map((result, index) => <button type="button" aria-pressed={selected?.id === result.id} className={selected?.id === result.id ? "is-active" : ""} onClick={() => setSelected(result)} key={result.id}><b>{String(index + 1).padStart(2, "0")}</b><span><small>{result.eyebrow}</small><strong>{result.title}</strong></span><HAIIcon name="arrow-right" size={13} /></button>)}</nav>
              <HAIResultDetail result={selected} query={response.contextualQuery} onNavigate={onNavigate} onTutorial={onTutorial} onClose={onClose} />
            </React.Fragment> : <HAIEmptyCanvas />}
          </aside>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{status}</p>
      </div>
    </div>}
  </React.Fragment>;
}

window.HubAIAssistant = HubAIAssistant;
