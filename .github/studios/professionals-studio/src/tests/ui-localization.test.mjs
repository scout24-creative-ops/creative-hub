import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const catalogFiles = ['common', 'studio-concepts', 'studio-assets', 'studio-quality'];
function boot() {
  const window = {};
  const context = vm.createContext({window, document:{readyState:'loading', documentElement:{lang:'de'}, addEventListener(){}}});
  for (const file of catalogFiles) vm.runInContext(readFileSync(new URL(`../locales/${file}.de.js`, import.meta.url),'utf8'), context);
  vm.runInContext(readFileSync(new URL('../ui-localization.js', import.meta.url),'utf8'), context);
  return {translate:window.ProfessionalsUI.translate, catalogs:window.ProfessionalsLocaleCatalogs};
}

test('German catalog keys are normalized and message templates are full matches', () => {
  const {catalogs} = boot();
  for (const catalog of catalogs) {
    for (const [key,value] of Object.entries(catalog.messages)) {
      assert.equal(key,key.replace(/\s+/g,' ').trim(),key);
      assert.equal(typeof value,'string');
      assert.ok(value.trim(),key);
    }
    for (const [pattern] of catalog.patterns || []) {
      assert.ok(pattern.source.startsWith('^') && pattern.source.endsWith('$'),pattern.source);
    }
  }
});

test('core workflow and nested dynamic labels translate', () => {
  const {translate} = boot();
  for (const [source,expected] of [
    ['Change design','Design ändern'],['Download ZIP','ZIP herunterladen'],
    ['20 files','20 Dateien'],['Concept 12','Konzept 12'],
    ['1 · Apartment / space','1 · Immobilie und Raum'],
    ['Live preview of Message over image','Livevorschau: Botschaft über Bild'],
    ['Brand Teal','Markenfarbe Teal'],['Too risky','Zu riskant']
  ]) assert.equal(translate(source),expected,source);
});

test('specific Concept status is not swallowed by the short label pattern', () => {
  const {translate} = boot();
  assert.equal(translate('Concept 12 has no photograph, so it is set typographically and has no image-only variant.'),
    'Konzept 12 enthält kein Bild. Es wird daher typografisch gestaltet und hat keine reine Bildvariante.');
});

test('complete exact entries take precedence over earlier pattern matches', () => {
  const {translate,catalogs} = boot();
  catalogs.unshift({messages:{},patterns:[[/^Download (.+)$/,v=>`wrong ${v}`]]});
  assert.equal(translate('Download ZIP'),'ZIP herunterladen');
});

test('unknown copy and technical identifiers are not translated by substring', () => {
  const {translate} = boot();
  for (const value of ['Customer campaign says Change design today.','my-Download ZIP.png','https://example.test/Change design','Mehr Möglichkeiten. Mehr Erfolg. Mehr für Sie.']) {
    assert.equal(translate(value),value);
  }
});

test('English passthrough and whitespace are preserved', () => {
  const {translate} = boot();
  assert.equal(translate('  Change design\n'),'  Design ändern\n');
  assert.equal(translate('  Change design\n','en'),'  Change design\n');
});

test('quality diagnostics preserve measurements while translating guidance', () => {
  const {translate} = boot();
  const result = translate('Studio margin, 59 top, 59 right, 59 bottom, 59 left. Essential content stays inside this margin before export. This is a Studio requirement, not a platform rule.');
  assert.ok(result.startsWith('Schutzabstand des Studios:'));
  assert.equal((result.match(/59/g)||[]).length,4);
  assert.ok(!result.includes('Essential content'));
});

test('all main product pages include a translation runtime before the switch', () => {
  for (const page of ['index','brand','concept-studio','template-social','template-landing','template-email']) {
    const source = readFileSync(new URL(`../${page}.html`,import.meta.url),'utf8');
    assert.ok(source.includes('locales/common.de.js'),page);
    assert.ok(source.indexOf('ui-localization.js') < source.indexOf('src="language.js"'),page);
  }
});

test('current placement names and guidance have German translations', () => {
  const {translate} = boot();
  const formats = JSON.parse(readFileSync(new URL('../agents/platform-format-catalog.json',import.meta.url),'utf8'));
  const preservedNames = new Set(['Facebook Feed','Instagram Feed','Stories','Reels']);
  const strings = new Set(Object.values(formats.best_practices));
  for (const family of Object.values(formats.ratio_families)) {
    for (const placement of family.placements) {
      if (!preservedNames.has(placement.placement)) strings.add(placement.placement);
      if (placement.best_practice) strings.add(placement.best_practice);
    }
  }
  for (const value of strings) assert.notEqual(translate(value),value,value);
});

test('combined export summaries preserve complete design labels and translate the trailing diagnostic', () => {
  const {translate} = boot();
  const source = 'Image exports passed the configured safe zone checks (safe-zones.js v2.0.0, engine v2.3.0). Review the crop, copy, claims and brand before publishing. Every file was drawn from Photo above message. The structures counted from the files themselves: Photograph only and Photo and message. 3 frames of 12 could not take the structure asked for, so the engine drew one that fits. Each of those frames says which.';
  const result = translate(source);
  assert.ok(result.includes('Nur Foto und Foto und Botschaft'),result);
  assert.ok(result.includes('3 von 12 Motiven'),result);
  assert.ok(!/Every file|Photo and message|frames of|Each of those/.test(result),result);
});
