const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = { step: 1, brief: "", concepts: [], selected: new Set(), formats: new Set(), layout: "anchor", image: "", built: false };

const placements = [
  { id: "meta-story", platform: "Meta", label: "Story / Reel", size: "1080 × 1920", ratio: "9:16" },
  { id: "meta-portrait", platform: "Meta", label: "Feed portrait", size: "1080 × 1350", ratio: "4:5" },
  { id: "meta-square", platform: "Meta", label: "Feed square", size: "1080 × 1080", ratio: "1:1" },
  { id: "linkedin-feed", platform: "LinkedIn", label: "Sponsored image", size: "1200 × 627", ratio: "1.91:1" },
  { id: "display-landscape", platform: "Display", label: "Landscape", size: "1200 × 628", ratio: "1.91:1" },
  { id: "presentation", platform: "Presentation", label: "Campaign slide", size: "1920 × 1080", ratio: "16:9" }
];
const layouts = [
  { id: "anchor", label: "Anchor", cls: "" },
  { id: "split", label: "Split", cls: "split" },
  { id: "clean", label: "Editorial", cls: "clean" },
  { id: "poster", label: "Poster", cls: "poster" }
];
const conceptBlueprints = [
  { name: "The Mehr promise", headline: "Mehr Möglichkeiten. Mehr Erfolg. Mehr für Sie.", hook: "Use the approved umbrella claim as the campaign anchor.", body: "A professional, approachable direction for Immobilien-Profis that leads with shared business value." },
  { name: "Every listing counts", headline: "Mehr Sichtbarkeit für Immobilien-Profis.", hook: "Treat the portfolio as a standard of care.", body: "A collaborative direction that links consistent presentation to professional credibility." },
  { name: "From interest to mandate", headline: "Mehr Kontakte. Mehr Chancen für Sie.", hook: "Show the commercial outcome with restraint.", body: "An engaged, supportive route built around clarity, trust and one obvious next step." },
  { name: "Visible where it matters", headline: "Mehr Erfolg für Makler-Profis.", hook: "Make reach tangible without overclaiming.", body: "A benefit-led direction for listings, regional campaigns and professional prospecting." }
];

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]); }
function saveHistory(entry) { const history = JSON.parse(localStorage.getItem("professionals.history") || "[]"); history.unshift(entry); localStorage.setItem("professionals.history", JSON.stringify(history.slice(0, 12))); }
function showStep(step) {
  state.step = step;
  $$(".panel").forEach((panel, i) => panel.classList.toggle("active", i === step - 1));
  $$(".step-btn").forEach((button, i) => { button.classList.toggle("active", i === step - 1); button.classList.toggle("done", i < step - 1); });
  $("#composer").style.display = step === 1 ? "block" : "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function makeConcepts(brief) {
  const cue = brief.split(/[.!?]/)[0].trim();
  return conceptBlueprints.map((item, index) => ({ ...item, id: index + 1, briefCue: cue }));
}
function renderConcepts() {
  const container = $("#conceptResults");
  if (!state.concepts.length) { container.innerHTML = ""; return; }
  container.innerHTML = `<div class="message user"><span class="avatar">You</span><div class="message-body"><div class="message-who">Your brief</div>${escapeHtml(state.brief)}</div></div>
  <div class="message agent"><span class="avatar">PS</span><div class="message-body"><div class="message-who">Professionals Studio</div>I turned that into four distinct campaign routes. Select one or more to carry into formats.</div></div>
  <div class="notice"><b>Working assumptions</b><br>Audience: Immobilien-Profis and Makler-Profis · Market: Germany · Address: formal Sie · Voice: professional, collaborative, approachable, engaged and supportive · Final imagery: human approval required.</div>
  <div class="concept-grid">${state.concepts.map((concept, index) => `<article class="concept-card ${state.selected.has(concept.id) ? "selected" : ""}" data-concept="${concept.id}"><div class="concept-visual layout-${index + 1}"><div class="visual-copy">${escapeHtml(concept.headline)}</div></div><div class="concept-body"><div class="concept-top"><div><span class="concept-num">${concept.id}</span><div class="concept-title">${escapeHtml(concept.name)}</div></div>${state.selected.has(concept.id) ? '<span class="picked-badge">Selected</span>' : ""}</div><p class="concept-hook">${escapeHtml(concept.hook)}</p><p class="concept-copy">${escapeHtml(concept.body)}</p><div class="concept-actions"><button class="pill-btn select-btn" data-select="${concept.id}">${state.selected.has(concept.id) ? "Remove" : "Select concept"}</button></div></div></article>`).join("")}</div>
  <div class="continue-bar"><div class="continue-copy">${state.selected.size ? `${state.selected.size} concept${state.selected.size > 1 ? "s" : ""} selected` : "Choose at least one direction"}<small>The concepts keep their own headline and campaign logic.</small></div><button class="pill-btn primary big" id="continueFormats" ${state.selected.size ? "" : "disabled"}>Continue to formats</button></div>`;
  $$('[data-select]').forEach(button => button.addEventListener("click", () => { const id = Number(button.dataset.select); state.selected.has(id) ? state.selected.delete(id) : state.selected.add(id); renderConcepts(); unlockSteps(); }));
  $("#continueFormats")?.addEventListener("click", () => showStep(2));
}
function unlockSteps() { const buttons = $$(".step-btn"); buttons[1].disabled = !state.selected.size; buttons[2].disabled = !(state.selected.size && state.formats.size); }
function renderPlatforms() {
  $("#platformGrid").innerHTML = placements.map(item => `<label class="platform-option"><input type="checkbox" value="${item.id}" ${state.formats.has(item.id) ? "checked" : ""}><span><b>${item.platform} · ${item.label}</b>${item.size}<br><span class="format-tag">${item.ratio}</span></span></label>`).join("");
  $$("#platformGrid input").forEach(input => input.addEventListener("change", () => { input.checked ? state.formats.add(input.value) : state.formats.delete(input.value); renderFormatPlan(); unlockSteps(); }));
}
function renderFormatPlan() {
  const selected = placements.filter(item => state.formats.has(item.id));
  $("#formatStatus").textContent = selected.length ? `${selected.length} format${selected.length > 1 ? "s" : ""} selected` : "No formats selected";
  $("#toAssets").disabled = !selected.length;
  $("#formatPlan").innerHTML = selected.length ? `<h2>Export plan</h2><table class="export-table"><thead><tr><th>Platform</th><th>Placement</th><th>Size</th><th>Status</th></tr></thead><tbody>${selected.map(item => `<tr><td>${item.platform}</td><td>${item.label}</td><td>${item.size}</td><td><span class="format-tag">Review</span></td></tr>`).join("")}</tbody></table>` : `<h2>Export plan</h2><p class="notice">Choose at least one placement to build the plan.</p>`;
  renderAssets();
}
function renderLayouts() {
  $("#layoutGrid").innerHTML = layouts.map(item => `<button class="layout-option ${state.layout === item.id ? "selected" : ""}" data-layout="${item.id}"><span class="layout-thumb"></span><b>${item.label}</b></button>`).join("");
  $$('[data-layout]').forEach(button => button.addEventListener("click", () => { state.layout = button.dataset.layout; renderLayouts(); renderAssets(); }));
}
function headlineFor(concept) { return $("#campaignHeadline")?.value.trim() || concept.headline; }
function renderAssets() {
  const selectedConcepts = state.concepts.filter(concept => state.selected.has(concept.id));
  const selectedFormats = placements.filter(item => state.formats.has(item.id));
  const layout = layouts.find(item => item.id === state.layout) || layouts[0];
  const total = selectedConcepts.length * selectedFormats.length;
  $("#assetCount").textContent = total;
  const grid = $("#assetGrid"); if (!grid) return;
  if (!total) { grid.innerHTML = `<p class="notice">Select a concept and at least one format to preview the campaign.</p>`; return; }
  grid.innerHTML = selectedConcepts.flatMap(concept => selectedFormats.map(format => `<article class="asset-card"><div class="asset-preview ${layout.cls}" ${state.image ? `style="background-image:linear-gradient(to bottom,rgba(51,51,51,.05),rgba(51,51,51,.88)),url('${state.image}');background-size:cover;background-position:center"` : ""}><div class="asset-logo">ImmoScout24<br>Professionals</div><div class="asset-copy">${escapeHtml(headlineFor(concept)).replace(/(sichtbar|Sichtbarkeit|Auftritt|Auftrag)/gi,"<em>$1</em>")}</div></div><div class="asset-meta"><span>${format.platform}<br>${format.label}</span><span>${format.size}<br>${layout.label}</span></div></article>`)).join("");
}
function buildCampaign() {
  state.built = true; renderAssets();
  const selectedConcepts = state.concepts.filter(concept => state.selected.has(concept.id));
  const selectedFormats = placements.filter(item => state.formats.has(item.id));
  saveHistory({ date: new Date().toISOString(), brief: state.brief, concepts: selectedConcepts.map(c => c.name), formats: selectedFormats.map(f => `${f.platform} ${f.label}`), layout: state.layout });
  renderHistory();
}
function downloadManifest() {
  const selectedConcepts = state.concepts.filter(concept => state.selected.has(concept.id));
  const selectedFormats = placements.filter(item => state.formats.has(item.id));
  const manifest = { studio: "Professionals Studio", status: "human approval required", brief: state.brief, concepts: selectedConcepts, formats: selectedFormats, layout: state.layout, headline: $("#campaignHeadline").value, cta: $("#campaignCta").value, checks: { brand: "passed", imagery: "pending", safeZones: "pending", export: "pending" } };
  const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "professionals-campaign-manifest.json"; a.click(); URL.revokeObjectURL(url);
}
function renderHistory() {
  const history = JSON.parse(localStorage.getItem("professionals.history") || "[]");
  $("#historyList").innerHTML = history.length ? history.map(item => `<article class="history-item"><b>${escapeHtml(item.concepts.join(", "))}</b><span>${new Date(item.date).toLocaleString()} · ${item.formats.length} formats · ${escapeHtml(item.layout)}</span></article>`).join("") : `<p class="notice">No campaigns built in this browser yet.</p>`;
}
function resetSession() { state.step = 1; state.brief = ""; state.concepts = []; state.selected.clear(); state.formats.clear(); state.built = false; $("#briefInput").value = ""; $("#conversation").style.display = "block"; renderConcepts(); renderPlatforms(); renderFormatPlan(); showStep(1); unlockSteps(); }

function init() {
  renderPlatforms(); renderFormatPlan(); renderLayouts(); renderHistory(); unlockSteps();
  $$(".starter").forEach(button => button.addEventListener("click", () => { $("#briefInput").value = button.dataset.starter; $("#briefInput").focus(); }));
  $("#sendBrief").addEventListener("click", () => { const brief = $("#briefInput").value.trim(); if (!brief) return; state.brief = brief; state.concepts = makeConcepts(brief); state.selected.clear(); $("#conversation").style.display = "none"; renderConcepts(); });
  $("#briefInput").addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); $("#sendBrief").click(); } });
  $$(".step-btn").forEach(button => button.addEventListener("click", () => { if (!button.disabled) showStep(Number(button.dataset.step)); }));
  $("#toAssets").addEventListener("click", () => { const concept = state.concepts.find(item => state.selected.has(item.id)); $("#campaignHeadline").value = concept?.headline || ""; showStep(3); renderAssets(); });
  $("#buildCampaign").addEventListener("click", buildCampaign); $("#downloadManifest").addEventListener("click", downloadManifest); $("#newSession").addEventListener("click", resetSession);
  $("#campaignHeadline").addEventListener("input", renderAssets);
  $$('[data-open]').forEach(button => button.addEventListener("click", () => $("#" + button.dataset.open).showModal())); $$('[data-close]').forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  $("#imageUpload").addEventListener("change", event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { state.image = reader.result; $("#imagePreview").innerHTML = `<article class="asset-card"><img src="${state.image}" alt="Uploaded campaign reference" style="width:100%;display:block"><div class="asset-meta"><span>${escapeHtml(file.name)}</span><span>Pending approval</span></div></article>`; renderAssets(); }; reader.readAsDataURL(file); });
  if (location.hash === "#formats") showStep(2); if (location.hash === "#campaign") showStep(3);
}
init();
