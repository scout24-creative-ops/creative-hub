import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { fidelityReasons, emphasisReasons, geometrySignature, countOutcome, healthyCoverageReasons, META_PLACEMENTS } from './design-fidelity.js';
import { ASSET_TYPE_ROLES, BRAND_CLAIM, COLORS, DESIGNS, LAYOUTS, isBrandClaim } from '../ad-engine.js';

const placement = META_PLACEMENTS[0];
function result(overrides = {}) {
  return { canvas: { width: placement.w, height: placement.h }, design: 'editorial-angle-left', layout: 'editorial', requestedLayout: 'editorial', substituted: false, blocked: false,
    safe: { top: 20, right: 20, bottom: 20, left: 20 }, ink: [],
    geometry: { photo: { x: 600, y: 0, w: 480, h: 1080 }, photoClip: [{ x: 560, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 1080 }, { x: 650, y: 1080 }], photoEllipse: false, copy: { x: 40, y: 100, w: 480, h: 700 }, recipeParams: { copy: 'left', angled: true } },
    metrics: { designPreserved: true, hasPhoto: true, upscale: 1, cropZoom: .5, logoDrawn: true, copyDropped: {}, textBounds: [],
      wcagAA: true, headlineWeight: ASSET_TYPE_ROLES.headline.weight, sublineWeight: ASSET_TYPE_ROLES.subline.weight }, ...overrides };
}
const request = { design: 'editorial-angle-left', placement, variant: 'full' };

test('unblocked selected split design with preserved angle is accepted', () => assert.deepEqual(fidelityReasons(result(), request), []));
test('same selected ID cannot disguise a different rendered family', () => {
  assert.ok(fidelityReasons(result({ layout: 'statement', substituted: true }), request).includes('selected design was substituted'));
});
test('silent diagonal removal is a fidelity failure', () => {
  const angle = result({ design: 'editorial-angle-left', layout: 'editorial', requestedLayout: 'editorial', geometry: { photoClip: null, recipeParams: { copy: 'left', angled: true } } });
  assert.ok(fidelityReasons(angle, { ...request, design: angle.design }).includes('selected angled seam disappeared'));
  angle.geometry.photoClip = [{ x: 500, y: 0 }, { x: 1080, y: 0 }, { x: 1080, y: 1080 }, { x: 600, y: 1080 }];
  assert.ok(!fidelityReasons(angle, { ...request, design: angle.design }).includes('selected angled seam disappeared'));
});
test('held files require reasons and never count as passed exports', () => {
  const held = result({ blocked: true, blockedReason: 'Use a larger original.' });
  const report = { total: 0, passed: 0, exported: 0, held: 0, adapted: 0, failures: [], holds: [] };
  countOutcome(report, held, 'held example', fidelityReasons(held, request));
  assert.equal(report.held, 1); assert.equal(report.passed, 0); assert.equal(report.exported, 0);
  assert.ok(fidelityReasons(result({ blocked: true }), request).includes('held without an actionable reason'));
  assert.ok(fidelityReasons(held, { ...request, requireUsable: true }).includes('healthy fixture did not produce a usable export'));
});
test('all held healthy fixtures cannot pass coverage', () => {
  const rows = [{ design: 'editorial-angle-left', placement: placement.placement, usable: false }];
  assert.equal(healthyCoverageReasons(rows, ['editorial-angle-left'], [placement]).length, 3);
  rows[0].usable = true; assert.deepEqual(healthyCoverageReasons(rows, ['editorial-angle-left'], [placement]), []);
});
test('the public library contains only typography, split screens and full bleed images', () => {
  assert.deepEqual([...new Set(LAYOUTS.map(layout => layout.id))].sort(), ['editorial', 'fullbleed', 'poster', 'statement']);
  assert.ok(DESIGNS.every(design => ['editorial', 'fullbleed', 'poster', 'statement'].includes(design.style)));
  assert.ok(DESIGNS.every(design => !design.params.circle && !design.params.gallery && !design.params.density));
});
test('the exact Professionals claim is recognised as a protected lockup', () => {
  assert.equal(isBrandClaim(BRAND_CLAIM), true);
  assert.equal(isBrandClaim('  Mehr Möglichkeiten.  Mehr Erfolg. Mehr für Sie. '), true);
  assert.equal(isBrandClaim('Mehr Möglichkeiten für Sie.'), false);
  assert.equal(DESIGNS.filter(design => design.params.claim).length, 2);
});
test('the asset renderer never alters photography with a gradient veil', async () => {
  const source = await readFile(new URL('../ad-engine.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /createLinearGradient|drawVeil|solveScrimAlpha/);
});
test('message over image requires photography to fill the bottom edge', () => {
  const r = result({ design: 'poster-angle-type-first', layout: 'poster', requestedLayout: 'poster',
    geometry: { photo: { x: 0, y: 420, w: 1080, h: 660 }, photoClip: [{ x: 0, y: 480 }, { x: 1080, y: 420 }, { x: 1080, y: 1080 }, { x: 0, y: 1080 }], recipeParams: { angled: true } } });
  assert.ok(!fidelityReasons(r, { ...request, design: r.design }).includes('message over image photograph does not fill the bottom edge'));
  r.geometry.photo.h = 600;
  assert.ok(fidelityReasons(r, { ...request, design: r.design }).includes('message over image photograph does not fill the bottom edge'));
});
test('geometry comparison catches the same family rearranging slots', () => {
  const full = result(); const copy = result(); copy.geometry.copy.x++;
  assert.notEqual(geometrySignature(full), geometrySignature(copy));
  assert.equal(geometrySignature(full), geometrySignature(result()));
});
test('required copy omissions and actual text collisions are rejected', () => {
  const r = result(); r.metrics.copyDropped = { subline: true };
  r.metrics.textBounds = [{ kind: 'headline', x: 40, y: 100, w: 300, h: 100 }, { kind: 'subline', x: 40, y: 190, w: 300, h: 30 }];
  const reasons = fidelityReasons(r, request);
  assert.ok(reasons.includes('required subline was omitted')); assert.ok(reasons.includes('headline overlaps subline'));
});
test('softness and destructive crop cannot be waived by preserving identity', () => {
  const r = result(); r.metrics.upscale = 1.5; r.metrics.cropZoom = .2;
  const reasons = fidelityReasons(r, request);
  assert.ok(reasons.includes('exportable soft enlargement')); assert.ok(reasons.includes('exportable destructive crop'));
});
test('clean photograph only output is the explicit design exception', () => {
  const r = result({ layout: 'photo', substituted: true, geometry: null });
  r.metrics.designPreserved = null; r.metrics.logoDrawn = false;
  assert.deepEqual(fidelityReasons(r, { ...request, variant: 'clean' }), []);
});
test('contrast and declared advertising weights remain required', () => {
  const r = result(); r.metrics.wcagAA = false; r.metrics.headlineWeight = 800; r.metrics.sublineWeight = 700;
  const reasons = fidelityReasons(r, request);
  assert.ok(reasons.includes('exportable contrast below the renderer standard'));
  assert.ok(reasons.includes('headline uses the wrong approved weight'));
  assert.ok(reasons.includes('subline uses the wrong approved weight'));
});
test('unsupported templates do not promise to draw emphasis', () => {
  const r = result(); r.metrics.emphasisSupported = false; r.metrics.emphasisPhrase = 'Erfolg'; r.metrics.emphasisDrawn = false;
  assert.deepEqual(fidelityReasons(r, request), []);
  assert.deepEqual(emphasisReasons(r, { emphasis: 'Erfolg' }), []);
});
test('an exact phrase preserves the selected highlighter artwork and colour', () => {
  const r = result(); r.geometry.highlight = { kind: 'straight', colour: 'teal' };
  Object.assign(r.metrics, { emphasisSupported: true, emphasisPhrase: 'Erfolg', emphasisDrawn: true, emphasisKind: 'straight', emphasisColour: COLORS.teal });
  assert.deepEqual(emphasisReasons(r, { emphasis: 'Erfolg' }), []);
  r.metrics.emphasisKind = 'underline'; r.metrics.emphasisColour = COLORS.blue;
  const reasons = emphasisReasons(r, { emphasis: 'Erfolg' });
  assert.ok(reasons.includes('selected highlighter artwork was switched'));
  assert.ok(reasons.includes('selected highlighter colour was switched'));
});
test('blank emphasis cannot select its own words, and invalid emphasis must be held', () => {
  const r = result(); r.geometry.highlight = { kind: 'straight', colour: 'teal' };
  Object.assign(r.metrics, { emphasisSupported: true, emphasisPhrase: '', emphasisDrawn: true });
  assert.ok(emphasisReasons(r, { emphasis: '' }).includes('blank emphasis automatically highlighted words'));
  r.metrics.emphasisPhrase = 'Erfolg'; r.metrics.emphasisKind = 'straight'; r.metrics.emphasisColour = COLORS.teal;
  assert.ok(emphasisReasons(r, { emphasis: 'Erfolg', valid: false }).includes('invalid or repeated emphasis was exported instead of held'));
  r.blocked = true; assert.deepEqual(emphasisReasons(r, { emphasis: 'Erfolg', valid: false }), []);
});
