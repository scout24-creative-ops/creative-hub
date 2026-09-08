import { composeAsset, DESIGNS, BRAND_CLAIM, COLORS, BAND_CHOICES, SOFT_UPSCALE, MIN_PHOTO_RETAINED, ASSET_TYPE_ROLES, preloadFonts } from '../ad-engine.js';

export const EXPOSED_DESIGN_IDS = Object.freeze([
  'fullbleed-negative-space', 'fullbleed-impact', 'editorial-vertical',
  'editorial-angle-left', 'editorial-angle-right', 'poster-angle-photo-first',
  'poster-angle-type-first', 'statement-impact', 'fullbleed-lower-caption',
  'statement-centred', 'statement-underline', 'claim-lockup-filled', 'claim-lockup-outline',
]);
export const META_PLACEMENTS = Object.freeze([
  { platform: 'Meta', placement: 'Carousel', w: 1080, h: 1080 },
  { platform: 'Meta', placement: 'Facebook Feed', w: 1440, h: 1800 },
  { platform: 'Meta', placement: 'Stories', w: 1080, h: 1920 },
]);
const EXTRA_PLACEMENTS = [
  { platform: 'Google Display', placement: 'Leaderboard', w: 728, h: 90 },
  { platform: 'Google Display', placement: 'Mobile banner', w: 320, h: 50 },
  { platform: 'Taboola', placement: 'Native thumbnail (primary)', w: 1200, h: 674, text_in_image: 'forbidden' },
];
const DESIGNS_BY_ID = new Map(DESIGNS.map(design => [design.id, design]));
export const SHORT_COPY = Object.freeze({ headline: 'Mehr Erfolg für Sie.', subline: 'Ihre Immobilien im Blick.', cta: 'Beratung anfragen' });
const LONG_COPY = { headline: 'Mehr Sichtbarkeit für Ihre Immobilien.', subline: 'Präsentieren Sie Ihre Immobilien professionell und behalten Sie Ihre Anfragen im Blick.', cta: 'Beratung anfragen' };
const EPSILON = 0.02;

function stable(value) {
  if (typeof value === 'number') return Math.round(value * 1000) / 1000;
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value ?? null;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}

// These are composition slots, not the number of glyphs that a variant paints.
export function geometrySignature(result) {
  if (!result.geometry) return null;
  const g = result.geometry;
  return JSON.stringify(stable({ photo: g.photo, photoClip: g.photoClip, photoEllipse: !!g.photoEllipse,
    photoRound: !!g.photoRound, field: g.field, fieldPolygon: g.fieldPolygon,
    copy: g.copy, logo: g.logo, recipeParams: g.recipeParams }));
}

export function hasDiagonalEdge(points) {
  if (!Array.isArray(points) || points.length < 3) return false;
  return points.some((point, index) => {
    const next = points[(index + 1) % points.length];
    return Math.abs(point.x - next.x) > EPSILON && Math.abs(point.y - next.y) > EPSILON;
  });
}

function intersects(a, b) {
  return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > EPSILON
    && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > EPSILON;
}

export function fidelityReasons(result, { design, placement, variant = 'full', requiredCopy = SHORT_COPY, requireUsable = false }) {
  const reasons = [];
  const expected = DESIGNS_BY_ID.get(design);
  if (!expected) reasons.push('unknown selected design');
  if (result.canvas?.width !== placement.w || result.canvas?.height !== placement.h) reasons.push('wrong export dimensions');
  if (result.blocked) {
    if (!result.blockedReason?.trim()) reasons.push('held without an actionable reason');
    if (requireUsable) reasons.push('healthy fixture did not produce a usable export');
    return reasons;
  }
  const metrics = result.metrics || {};
  const safe = result.safe || {};
  if (![safe.left, safe.right, safe.top, safe.bottom].every(Number.isFinite)) reasons.push('safety zone was not measurable');
  for (const box of result.ink || []) {
    if (![box.x, box.y, box.w, box.h].every(Number.isFinite)) reasons.push('nonfinite essential bounds');
    if (box.x < safe.left - EPSILON || box.y < safe.top - EPSILON
      || box.x + box.w > placement.w - safe.right + EPSILON
      || box.y + box.h > placement.h - safe.bottom + EPSILON) reasons.push('essential content outside safety zone');
  }
  if (metrics.hasPhoto && !(metrics.upscale <= SOFT_UPSCALE + 1e-6)) reasons.push('exportable soft enlargement');
  // cropZoom is rounded to three decimals by the renderer.
  if (metrics.hasPhoto && !(metrics.cropZoom >= MIN_PHOTO_RETAINED - 0.0005)) reasons.push('exportable destructive crop');
  if (metrics.wcagAA !== true) reasons.push('exportable contrast below the renderer standard');
  if (variant === 'clean') {
    if ((result.ink || []).length || metrics.logoDrawn) reasons.push('image only variant contains marks');
    if (result.layout !== 'photo') reasons.push('image only variant is not photograph only');
    return [...new Set(reasons)];
  }
  if (result.design !== design || result.layout !== expected?.style || result.requestedLayout !== expected?.style || result.substituted)
    reasons.push('selected design was substituted');
  if (metrics.designPreserved !== true) reasons.push('design preservation was not verified');
  if (!result.geometry) reasons.push('composition geometry was not reported');
  const g = result.geometry || {};
  if (expected?.params.angled && !hasDiagonalEdge(g.photoClip) && !hasDiagonalEdge(g.fieldPolygon)) reasons.push('selected angled seam disappeared');
  if (expected?.params.circle && !g.photoEllipse) reasons.push('selected circular photograph disappeared');
  if (design === 'poster-angle-type-first' && g.photo
    && Math.abs(g.photo.y + g.photo.h - placement.h) > EPSILON) reasons.push('message over image photograph does not fill the bottom edge');
  if (g.recipeParams && JSON.stringify(stable(g.recipeParams)) !== JSON.stringify(stable(expected?.params))) reasons.push('selected recipe parameters changed');
  if ((variant === 'full' || variant === 'logo') && !metrics.logoDrawn) reasons.push('required logo was omitted');
  if (variant === 'full' || variant === 'copy') {
    for (const field of ['headline', 'subline', 'cta']) {
      if (requiredCopy[field] && metrics.copyDropped?.[field]) reasons.push(`required ${field} was omitted`);
    }
    if (!Array.isArray(metrics.textBounds)) reasons.push('text separation was not measurable');
    if (requiredCopy.headline && !metrics.claimLockup && metrics.headlineWeight !== ASSET_TYPE_ROLES.headline.weight) reasons.push('headline uses the wrong approved weight');
    if (requiredCopy.subline && !metrics.copyDropped?.subline && metrics.sublineWeight !== ASSET_TYPE_ROLES.subline.weight) reasons.push('subline uses the wrong approved weight');
    if (metrics.emphasisSupported && metrics.emphasisPhrase && !metrics.emphasisDrawn) reasons.push('chosen emphasis phrase was not drawn');
  }
  const bounds = metrics.textBounds || [];
  for (let i = 0; i < bounds.length; i++) for (let j = i + 1; j < bounds.length; j++) {
    if (intersects(bounds[i], bounds[j])) reasons.push(`${bounds[i].kind} overlaps ${bounds[j].kind}`);
  }
  return [...new Set(reasons)];
}

export function emphasisReasons(result, { emphasis, valid = true, band }) {
  if (result.blocked) return [];
  const metrics = result.metrics || {};
  const requested = String(emphasis || '').trim().replace(/\s+/g, ' ');
  const reasons = [];
  if (String(metrics.emphasisPhrase || '').replace(/\s+/g, ' ') !== requested) reasons.push('authored emphasis phrase changed');
  if (!metrics.emphasisSupported) {
    if (metrics.emphasisDrawn || metrics.emphasisKind || metrics.emphasisColour) reasons.push('unsupported design unexpectedly drew emphasis');
    return reasons;
  }
  if (!requested) {
    if (metrics.emphasisDrawn || metrics.emphasisKind || metrics.emphasisColour) reasons.push('blank emphasis automatically highlighted words');
    return reasons;
  }
  if (!valid) reasons.push('invalid or repeated emphasis was exported instead of held');
  const selected = result.geometry?.highlight;
  if (!selected) reasons.push('selected highlighter was not reported');
  if (!metrics.emphasisDrawn) reasons.push('authored emphasis was omitted');
  if (metrics.emphasisKind !== selected?.kind) reasons.push('selected highlighter artwork was switched');
  const expectedColour = COLORS[selected?.colour] || band?.accent;
  if (metrics.emphasisColour !== expectedColour) reasons.push('selected highlighter colour was switched');
  return [...new Set(reasons)];
}

export function countOutcome(report, result, label, reasons) {
  report.total++;
  if (result.blocked) { report.held++; report.holds.push({ label, reason: result.blockedReason, metrics: result.metrics }); }
  else report.exported++;
  if (reasons.length) report.failures.push({ label, reasons, metrics: result.metrics });
  else if (!result.blocked) report.passed++;
  if (result.metrics?.photoAdaptation) report.adapted++;
}

export function healthyCoverageReasons(rows, designIds = EXPOSED_DESIGN_IDS, placements = META_PLACEMENTS) {
  const reasons = [];
  for (const design of designIds) {
    if (!rows.some(row => row.design === design && row.usable)) reasons.push(`${design}: no usable healthy full output`);
  }
  for (const placement of placements) {
    if (!rows.some(row => row.placement === placement.placement && row.usable)) reasons.push(`${placement.placement}: no usable healthy full output`);
  }
  if (rows.length && rows.filter(row => row.usable).length <= rows.length / 2) reasons.push('most healthy full outputs were held or failed');
  return reasons;
}

// Deliberately synthetic, evenly distributed detail so tests measure geometry,
// not a single artificial salient subject. No generated campaign photographs.
export function sourceFixture(name, width, height) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = COLORS.sand; ctx.fillRect(0, 0, width, height);
  const step = Math.max(8, Math.round(Math.min(width, height) / 20));
  for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) {
    ctx.fillStyle = ((x / step + y / step) % 2) ? '#d6d2d0' : '#c7c2bf';
    ctx.fillRect(x, y, step * .5, step * .5);
  }
  const src = canvas.toDataURL('image/png'); canvas.width = canvas.height = 1;
  return { name, src };
}

function baseSpec(design, placement, source, variant, copy = SHORT_COPY) {
  const resolvedCopy = design.startsWith('claim-lockup-')
    ? { headline: BRAND_CLAIM, subline: '', cta: '' } : copy;
  return { ...resolvedCopy, ...placement, placement, design, variant, photo: source.src,
    band: BAND_CHOICES.find(band => band.id === 'sand'), logoKey: 'logo-professionals',
    ctaBg: COLORS.charcoal, ctaFg: COLORS.white, rotationSeed: 'design-fidelity', showSafe: false };
}

export async function runEmphasisMatrix({ onProgress = () => {} } = {}) {
  await preloadFonts();
  const start = performance.now();
  const report = { mode: 'authored emphasis', total: 0, passed: 0, exported: 0, held: 0, adapted: 0, failures: [], holds: [], emphasisChecks: 0, emphasisCoverage: [] };
  const source = sourceFixture('healthy emphasis source', 2400, 3000);
  const supported = EXPOSED_DESIGN_IDS.filter(id => {
    const design = DESIGNS_BY_ID.get(id);
    return design.params.highlight || (design.style === 'poster' && design.params.angled);
  });
  // Blue is an existing brand colour, although not a field picker option.
  // Testing the renderer input directly ensures its safeguards still hold.
  const blue = { id: 'blue', label: 'Blue', bg: COLORS.blue, fg: COLORS.charcoal, logo: '', accent: COLORS.sand };
  const bands = ['teal', 'charcoal', 'sand'].map(id => BAND_CHOICES.find(band => band.id === id)); bands.push(blue);
  const cases = [
    { name: 'Exact phrase', emphasis: 'Erfolg', valid: true, copy: SHORT_COPY },
    { name: 'Blank phrase', emphasis: '', valid: true, copy: SHORT_COPY },
    { name: 'Missing phrase', emphasis: 'Wachstum', valid: false, copy: SHORT_COPY },
    { name: 'Repeated phrase', emphasis: 'Erfolg', valid: false, copy: { ...SHORT_COPY, headline: 'Mehr Erfolg. Ihr Erfolg.' } },
  ];
  for (const design of supported) for (const placement of META_PLACEMENTS) for (const band of bands) for (const scenario of cases) {
    const spec = { ...baseSpec(design, placement, source, 'full', scenario.copy), band, emphasis: scenario.emphasis };
    const result = await composeAsset(spec);
    const reasons = [
      ...fidelityReasons(result, { design, placement, requiredCopy: scenario.copy }),
      ...emphasisReasons(result, { emphasis: scenario.emphasis, valid: scenario.valid, band }),
    ];
    const label = `${design} · ${placement.placement} · ${band.label} · ${scenario.name}`;
    countOutcome(report, result, label, reasons); report.emphasisChecks++;
    if (scenario.name === 'Exact phrase' && band.id === 'sand') report.emphasisCoverage.push({ design, placement: placement.placement, usable: !result.blocked && !reasons.length });
    result.canvas.width = result.canvas.height = 1; onProgress(report);
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  // A template without a highlighter must ignore this field, not acquire a
  // different template or a new decoration. Its words and geometry stay put.
  for (const placement of META_PLACEMENTS) {
    const design = 'editorial-vertical', band = bands.find(item => item.id === 'sand');
    const result = await composeAsset({ ...baseSpec(design, placement, source, 'full'), emphasis: 'Erfolg' });
    const reasons = [...fidelityReasons(result, { design, placement }), ...emphasisReasons(result, { emphasis: 'Erfolg', band })];
    if (!result.blocked && result.metrics.emphasisSupported !== false) reasons.push('unsupported template claimed highlighter support');
    countOutcome(report, result, `${design} · ${placement.placement} · Unsupported phrase`, reasons); report.emphasisChecks++;
    result.canvas.width = result.canvas.height = 1; onProgress(report);
  }
  for (const design of supported) if (!report.emphasisCoverage.some(row => row.design === design && row.usable)) {
    report.failures.push({ label: `${design} · Authored emphasis coverage`, reasons: ['no usable exact phrase on a neutral field at any standard Meta ratio'] });
  }
  report.renderCalls = report.total; report.durationMs = Math.round(performance.now() - start);
  return report;
}

export async function runFidelityMatrix({ extended = true, onProgress = () => {} } = {}) {
  const report = { mode: extended ? 'fidelity matrix' : 'healthy designs', startedAt: new Date().toISOString(),
    total: 0, passed: 0, exported: 0, held: 0, adapted: 0, failures: [], holds: [], healthy: [], parityChecks: 0 };
  const start = performance.now(); await preloadFonts();
  const healthy = sourceFixture('healthy portrait', 2400, 3000);
  const record = (result, request, label, extra = []) => {
    const reasons = [...fidelityReasons(result, request), ...extra];
    countOutcome(report, result, label, reasons); onProgress(report);
    return reasons;
  };
  for (const design of EXPOSED_DESIGN_IDS) for (const placement of META_PLACEMENTS) {
    let fullSignature = null;
    for (const variant of ['full', 'copy', 'logo', 'clean']) {
      const request = { design, placement, variant };
      const spec = baseSpec(design, placement, healthy, variant);
      const result = await composeAsset(spec);
      const signature = geometrySignature(result);
      const drift = !result.blocked && variant !== 'full' && variant !== 'clean' && fullSignature && signature !== fullSignature
        ? ['copy or logo visibility changed the template skeleton'] : [];
      const reasons = record(result, request, `${design} · ${placement.placement} · ${variant} · healthy`, drift);
      if (variant === 'full') {
        fullSignature = signature;
        report.healthy.push({ design, placement: placement.placement, usable: !result.blocked && reasons.length === 0, held: !!result.blocked });
        // Same export dimensions and settings are rendered twice, exactly as
        // preview and export do. The safety overlay is deliberately disabled.
        const again = await composeAsset(spec);
        const equal = geometrySignature(again) === signature && again.blocked === result.blocked
          && again.canvas.toDataURL('image/png') === result.canvas.toDataURL('image/png');
        report.parityChecks++;
        if (!equal) report.failures.push({ label: `${design} · ${placement.placement}`, reasons: ['identical preview and export specifications produced different output'] });
        again.canvas.width = again.canvas.height = 1;
      }
      result.canvas.width = result.canvas.height = 1;
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  for (const reason of healthyCoverageReasons(report.healthy)) report.failures.push({ label: 'Healthy export coverage', reasons: [reason] });
  if (extended) {
    const extreme = [sourceFixture('small', 720, 480), sourceFixture('panorama', 2400, 360), sourceFixture('tall', 360, 2400), sourceFixture('tiny', 80, 60)];
    for (const design of EXPOSED_DESIGN_IDS) {
      for (const placement of [META_PLACEMENTS[1], META_PLACEMENTS[2], ...EXTRA_PLACEMENTS]) for (const source of extreme) {
        const variant = placement.text_in_image === 'forbidden' ? 'clean' : 'full';
        const result = await composeAsset(baseSpec(design, placement, source, variant));
        record(result, { design, placement, variant }, `${design} · ${placement.placement} · ${source.name}`);
        result.canvas.width = result.canvas.height = 1;
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      for (const placement of META_PLACEMENTS) {
        const result = await composeAsset(baseSpec(design, placement, healthy, 'full', LONG_COPY));
        record(result, { design, placement, variant: 'full', requiredCopy: LONG_COPY }, `${design} · ${placement.placement} · long copy`);
        result.canvas.width = result.canvas.height = 1;
      }
    }
    const emphasis = await runEmphasisMatrix({ onProgress: partial => onProgress({ ...report,
      total: report.total + partial.total, exported: report.exported + partial.exported,
      held: report.held + partial.held, failures: [...report.failures, ...partial.failures] }) });
    for (const count of ['total', 'passed', 'exported', 'held', 'adapted']) report[count] += emphasis[count];
    report.failures.push(...emphasis.failures); report.holds.push(...emphasis.holds);
    report.emphasisChecks = emphasis.emphasisChecks; report.emphasisCoverage = emphasis.emphasisCoverage;
  }
  report.renderCalls = report.total + report.parityChecks;
  report.durationMs = Math.round(performance.now() - start); report.finishedAt = new Date().toISOString();
  return report;
}

export async function renderContactSheet(placement, target, onProgress = () => {}) {
  await preloadFonts(); target.replaceChildren();
  const source = { name: 'Provided photograph', src: 'assets/imagery-guidelines/6557344.jpg' };
  const report = { mode: 'provided photography', total: 0, passed: 0, exported: 0, held: 0, adapted: 0, failures: [], holds: [] };
  for (const design of EXPOSED_DESIGN_IDS) {
    const section = document.createElement('section'); section.className = 'design'; section.dataset.design = design;
    const heading = document.createElement('h2'); heading.textContent = DESIGNS_BY_ID.get(design)?.label || design;
    const examples = document.createElement('div'); examples.className = 'examples'; section.append(heading, examples); target.append(section);
    for (const [claim, copy] of [['Short claim', SHORT_COPY], ['Long claim', LONG_COPY]]) {
      const result = await composeAsset(baseSpec(design, placement, source, 'full', copy));
      const reasons = fidelityReasons(result, { design, placement, requiredCopy: copy });
      countOutcome(report, result, `${design} · ${claim}`, reasons);
      const figure = document.createElement('figure'); figure.dataset.claim = claim;
      const caption = document.createElement('figcaption');
      caption.textContent = `${claim} · ${placement.w} × ${placement.h} · ${result.blocked ? 'Held: ' + result.blockedReason : 'Selected design preserved'}`;
      if (reasons.length) caption.textContent += ` · Failed: ${reasons.join('; ')}`;
      if (result.blocked) result.canvas.classList.add('held');
      result.canvas.setAttribute('aria-label', `${heading.textContent}, ${claim}`);
      figure.append(result.canvas, caption); examples.append(figure); onProgress(report);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  return report;
}

if (typeof document !== 'undefined' && document.body?.hasAttribute('data-fidelity-tests')) {
  const status = document.querySelector('#status'); const output = document.querySelector('#results');
  const buttons = [...document.querySelectorAll('button')]; let latest = null;
  const progress = report => { status.textContent = `${report.total} rendered · ${report.exported} exported · ${report.held} held · ${report.failures.length} failures`; };
  const run = async mode => {
    buttons.forEach(button => button.disabled = true); output.textContent = ''; document.querySelector('#gallery').replaceChildren();
    status.dataset.state = 'running';
    try {
      latest = mode === 'visual' ? await renderContactSheet(META_PLACEMENTS[Number(document.querySelector('#placement').value)], document.querySelector('#gallery'), progress)
        : mode === 'emphasis' ? await runEmphasisMatrix({ onProgress: progress })
        : await runFidelityMatrix({ extended: mode !== 'healthy', onProgress: progress });
      output.textContent = JSON.stringify(latest, null, 2); progress(latest);
      status.dataset.state = latest.failures.length ? 'failed' : 'complete';
    } catch (error) { latest = { fatal: error.stack || error.message }; output.textContent = JSON.stringify(latest, null, 2); status.textContent = error.message; status.dataset.state = 'failed'; }
    finally { buttons.forEach(button => button.disabled = false); window.designFidelityReport = latest; }
    return latest;
  };
  document.querySelector('#run').addEventListener('click', () => run('matrix'));
  document.querySelector('#healthy').addEventListener('click', () => run('healthy'));
  document.querySelector('#emphasis').addEventListener('click', () => run('emphasis'));
  document.querySelector('#visual').addEventListener('click', () => run('visual'));
  document.querySelector('#download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(latest, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'professionals-design-fidelity.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  window.runDesignFidelity = run;
  const automatic = new URLSearchParams(location.search).get('autorun');
  if (['matrix', 'healthy', 'visual', 'emphasis'].includes(automatic)) run(automatic);
}
