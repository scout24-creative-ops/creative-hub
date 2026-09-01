import React from "react";
import "./studio-shell.css";

const ui = {
  en: {
    development: "Development placeholder",
    overview: "Overview",
    start: "Start Studio",
    guidelines: "Guidelines",
    templates: "Templates",
    related: "Related tools",
    primary: "Primary workflow",
    unavailable: "Launch unavailable",
    emptyTemplates: "No templates have been published for this Studio.",
    emptyTools: "No related tools have been published for this Studio.",
    sectionEmpty: "Approved content has not been published for this section.",
    owner: "Owner",
    version: "Version",
    updated: "Last updated",
  },
  de: {
    development: "Entwicklungsplatzhalter",
    overview: "Übersicht",
    start: "Studio starten",
    guidelines: "Richtlinien",
    templates: "Vorlagen",
    related: "Verwandte Tools",
    primary: "Primärer Workflow",
    unavailable: "Start nicht verfügbar",
    emptyTemplates: "Für dieses Studio wurden noch keine Vorlagen veröffentlicht.",
    emptyTools: "Für dieses Studio wurden noch keine verwandten Tools veröffentlicht.",
    sectionEmpty: "Für diesen Bereich wurden noch keine freigegebenen Inhalte veröffentlicht.",
    owner: "Verantwortlich",
    version: "Version",
    updated: "Zuletzt aktualisiert",
  },
};

const statusLabels = {
  empty: { en: "Not configured", de: "Nicht konfiguriert" },
  planned: { en: "Planned", de: "Geplant" },
  "in-development": { en: "In development", de: "In Entwicklung" },
  testing: { en: "Testing", de: "Testphase" },
  available: { en: "Available", de: "Verfügbar" },
  paused: { en: "Paused", de: "Pausiert" },
  retired: { en: "Retired", de: "Eingestellt" },
};

function localize(value, locale) { return value?.[locale] || value?.en || ""; }
function label(key, locale) { return ui[locale]?.[key] || ui.en[key] || key; }
function status(value, locale) { return statusLabels[value]?.[locale] || statusLabels[value]?.en || value; }

function Status({ value, locale }) {
  return <span className={`studio-shell__status studio-shell__status--${value}`}>{status(value, locale)}</span>;
}

function ProductHeader({ manifest, locale }) {
  const { identity } = manifest;
  return <header className="studio-shell__product-header">
    <div className="studio-shell__identity">
      <img src={identity.logo.src} alt={localize(identity.logo.alt, locale)} />
      <div><small>Creative Hub · Studio</small><h1>{localize(identity.name, locale)}</h1><p>{localize(identity.description, locale)}</p></div>
    </div>
    <dl className="studio-shell__metadata">
      <div><dt>Status</dt><dd><Status value={identity.status} locale={locale} /></dd></div>
      <div><dt>{label("version", locale)}</dt><dd>{identity.version}</dd></div>
      <div><dt>{label("updated", locale)}</dt><dd><time dateTime={identity.updatedAt}>{identity.updatedAt}</time></dd></div>
      <div><dt>{label("owner", locale)}</dt><dd>{identity.owner.name}<small>{identity.owner.team}</small></dd></div>
    </dl>
  </header>;
}

function Workflow({ workflow, locale }) {
  const canLaunch = ["testing", "available"].includes(workflow.availability) && workflow.launchTarget;
  return <section className="studio-shell__workflow" aria-labelledby="studio-workflow-title">
    <div><small>{label("primary", locale)}</small><div className="studio-shell__title-row"><h2 id="studio-workflow-title">{localize(workflow.name, locale)}</h2><Status value={workflow.availability} locale={locale} /></div><p>{localize(workflow.description, locale)}</p>
      {workflow.steps.length > 0 && <ol>{workflow.steps.map((step) => <li key={step.id}><strong>{localize(step.label, locale)}</strong>{step.description && <span>{localize(step.description, locale)}</span>}</li>)}</ol>}
    </div>
    <aside><p>{localize(workflow.availabilityMessage, locale)}</p>{canLaunch ? <a href={workflow.launchTarget.url} target={workflow.launchTarget.openMode === "new-tab" ? "_blank" : undefined} rel="noreferrer">{localize(workflow.launchLabel, locale)} <span aria-hidden="true">→</span></a> : <strong>{label("unavailable", locale)}</strong>}</aside>
  </section>;
}

function GuidelineBlock({ block, locale }) {
  if (block.type === "heading") return <h3>{localize(block.text, locale)}</h3>;
  if (block.type === "paragraph") return <p>{localize(block.text, locale)}</p>;
  if (block.type === "callout") return <aside className="studio-shell__callout">{localize(block.text, locale)}</aside>;
  if (block.type === "list") return <ul>{block.items.map((item, index) => <li key={index}>{localize(item, locale)}</li>)}</ul>;
  if (block.type === "media") return <figure><img src={block.src} alt={localize(block.alt, locale)} />{block.caption && <figcaption>{localize(block.caption, locale)}</figcaption>}</figure>;
  return null;
}

function Guidelines({ manifest, locale }) {
  return <section className="studio-shell__guidelines"><nav aria-label={label("guidelines", locale)}><ol>{manifest.guidelines.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{localize(section.title, locale)}</a></li>)}</ol></nav>
    <div>{manifest.guidelines.sections.map((section) => <article id={section.id} key={section.id}><header><h2>{localize(section.title, locale)}</h2><p>{localize(section.summary, locale)}</p></header>{section.blocks.length ? section.blocks.map((block, index) => <GuidelineBlock block={block} locale={locale} key={index} />) : <p className="studio-shell__empty">{label("sectionEmpty", locale)}</p>}</article>)}</div>
  </section>;
}

function TemplateGallery({ templates, locale }) {
  if (!templates.length) return <p className="studio-shell__empty">{label("emptyTemplates", locale)}</p>;
  return <div className="studio-shell__cards">{templates.map((template) => <article key={template.id}><Status value={template.availability} locale={locale} /><h3>{localize(template.name, locale)}</h3><p>{localize(template.description, locale)}</p><small>{[...template.formats, ...template.dimensions].join(" · ")}</small>{template.action && <a href={template.action.url}>{localize(template.action.label, locale)} <span aria-hidden="true">→</span></a>}</article>)}</div>;
}

function RelatedTools({ tools, locale }) {
  if (!tools.length) return <p className="studio-shell__empty">{label("emptyTools", locale)}</p>;
  return <div className="studio-shell__cards">{tools.map((tool) => <article key={tool.id}><Status value={tool.status} locale={locale} /><h3>{localize(tool.name, locale)}</h3><p>{localize(tool.description, locale)}</p>{tool.action && <a href={tool.action.url}>{localize(tool.action.label, locale)} <span aria-hidden="true">→</span></a>}</article>)}</div>;
}

export function StudioShell({ manifest, locale = "en", view = "overview", onNavigate = () => {} }) {
  const currentLocale = locale === "de" ? "de" : "en";
  const views = ["overview", "start", "guidelines", "templates"];
  const currentView = views.includes(view) ? view : "overview";
  return <div className="studio-shell" data-theme={manifest.theme.tokenSet}>
    {manifest.contentStatus === "placeholder" && <aside className="studio-shell__development"><strong>{label("development", currentLocale)}</strong></aside>}
    <ProductHeader manifest={manifest} locale={currentLocale} />
    <nav className="studio-shell__navigation" aria-label="Studio"><div>{views.map((item) => <button key={item} type="button" aria-current={currentView === item ? "page" : undefined} onClick={() => onNavigate(item)}>{label(item, currentLocale)}</button>)}</div></nav>
    <main>
      {currentView === "start" && <Workflow workflow={manifest.primaryWorkflow} locale={currentLocale} />}
      {currentView === "guidelines" && <Guidelines manifest={manifest} locale={currentLocale} />}
      {currentView === "templates" && <TemplateGallery templates={manifest.templates} locale={currentLocale} />}
      {currentView === "overview" && <React.Fragment><Workflow workflow={manifest.primaryWorkflow} locale={currentLocale} /><section><h2>{label("guidelines", currentLocale)}</h2><p>{localize(manifest.guidelines.overview, currentLocale)}</p></section><section><h2>{label("templates", currentLocale)}</h2><TemplateGallery templates={manifest.templates} locale={currentLocale} /></section><section><h2>{label("related", currentLocale)}</h2><RelatedTools tools={manifest.relatedTools} locale={currentLocale} /></section></React.Fragment>}
    </main>
  </div>;
}
