/* ============================================================================
   Shared components: Icon, Hl, StatusBadge, AgentCard, AgentModal, SectionHead
   Exposed on window for the section + app scripts.
   ============================================================================ */
const { useEffect: _useEffect } = React;

function Icon({ name, size, style, className = "" }) {
  return (
    <i
      className={`is24-icon is24-icon-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1, ...style }}
      aria-hidden="true"
    />
  );
}

/* hand-drawn highlighted word */
function Hl({ children, variant }) {
  return <span className={`hl ${variant === "circle" ? "hl--circle" : ""}`}>{children}</span>;
}

function StatusBadge({ status, progress }) {
  const map = {
    idea: { cls: "status--idea", label: "Idea" },
    prototype: { cls: "status--prototype", label: "Prototype" },
    testing: { cls: "status--testing", label: "Testing" },
    live: { cls: "status--live", label: "Live" },
  };
  const s = map[status] || map.idea;
  return (
    <span className={`status ${s.cls}`}>
      <span className="dot" />
      {s.label}
      {typeof progress === "number" && <span className="status__pct">{progress}%</span>}
    </span>
  );
}

function SectionHead({ eyebrow, eyebrowIcon, title, lead, center }) {
  return (
    <div className={`sec-head ${center ? "sec-head--center" : ""}`}>
      {eyebrow && (
        <span className="sec-head__eyebrow">
          {eyebrowIcon && <Icon name={eyebrowIcon} />}
          {eyebrow}
        </span>
      )}
      <h2 className="sec-head__title">{title}</h2>
      {lead && <p className="sec-head__lead">{lead}</p>}
    </div>
  );
}

const CAT_LABELS = {
  create: "Create",
  adapt: "Adapt",
  check: "Check",
  learn: "Learn",
  govern: "Manage",
};

function AgentCard({ agent, onOpen }) {
  return (
    <button className="agent-card reveal" onClick={() => onOpen(agent)}>
      <div className="agent-card__top">
        <span className="agent-card__icon">
          <Icon name={agent.icon} />
        </span>
        <StatusBadge status={agent.status} progress={agent.progress} />
      </div>
      <h3>{agent.name}</h3>
      <p className="agent-card__what">{agent.what}</p>
      <div className="agent-card__meta">
        <div className="agent-card__row">
          <span className="k">Target users</span>
          <span className="v">{agent.target.join(", ")}</span>
        </div>
      </div>
      <div className="agent-card__cats">
        {agent.tags.slice(0, 3).map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
      <div className="agent-card__foot">
        <span className="agent-card__open">
          View agent <Icon name="arrow-right" />
        </span>
        <span className="agent-card__owner">
          <Icon name="profile" size={13} /> {agent.owner}
        </span>
      </div>
    </button>
  );
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function AgentModal({ agent, onClose }) {
  _useEffect(() => {
    document.body.classList.add("modal-open");
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!agent) return null;

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__head">
          <span className="accentbar" />
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="cancel" />
          </button>
          <span className="modal__icon">
            <Icon name={agent.icon} size={28} />
          </span>
          <div className="modal__badges">
            <StatusBadge status={agent.status} progress={agent.progress} />
            {agent.categories.map((c) => (
              <span
                className="tag"
                key={c}
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "none" }}
              >
                {CAT_LABELS[c]}
              </span>
            ))}
          </div>
          <h2>{agent.name}</h2>
          <p>{agent.what}</p>
        </div>

        <div className="modal__body">
          <div className="modal__facts">
            <div className="fact">
              <div className="k">
                <Icon name="persons" size={14} /> Target users
              </div>
              <div className="v">{agent.target.join(", ")}</div>
            </div>
            <div className="fact">
              <div className="k">
                <Icon name="dashboard" size={14} /> Phase
              </div>
              <div className="v">{(window.HUB.STATUS[agent.status] || {}).label} · {agent.progress}%</div>
            </div>
          </div>

          <div className="modal__tags">
            <div className="modal__tags-label">Tags</div>
            <div className="modal__tags-row">
              {agent.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="modal__owner">
            <span className="av">{initials(agent.owner)}</span>
            <div>
              <b>{agent.owner}</b>
              <br />
              <span>Owner & sparring contact</span>
            </div>
          </div>
        </div>

        <div className="modal__foot">
          {agent.link ? (
            <a className="btn btn--brand" href={agent.link} target="_blank" rel="noreferrer">
              <Icon name="arrow-right" /> Open agent
            </a>
          ) : (
            <span className="btn btn--brand is-disabled" aria-disabled="true">
              <Icon name="stopwatch" /> Link coming soon
            </span>
          )}
          <a className="btn btn--quiet" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="chat" /> Request sparring
          </a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Hl, StatusBadge, SectionHead, AgentCard, AgentModal, CAT_LABELS });
