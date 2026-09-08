import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BAND_CHOICES, COLORS, resolveAssetPalette } from "../ad-engine.js";

const studio = await readFile(new URL("../concept-studio.html", import.meta.url), "utf8");

function band(id) { return BAND_CHOICES.find(item => item.id === id); }

test("button colours resolve automatically against every approved field", () => {
  const cases = [
    ["teal", COLORS.blue, COLORS.charcoal],
    ["teal", COLORS.teal, COLORS.charcoal],
    ["charcoal", COLORS.charcoal, COLORS.blue],
    ["sand", COLORS.sand, COLORS.charcoal],
    ["white", COLORS.white, COLORS.charcoal],
  ];
  for (const [field, requested, expected] of cases) {
    const result = resolveAssetPalette(band(field), requested);
    assert.equal(result.ctaBg, expected, `${field} field`);
    assert.ok(result.ctaFg === COLORS.charcoal || result.ctaFg === COLORS.white);
  }
});

test("safe button choices stay unchanged", () => {
  assert.equal(resolveAssetPalette(band("teal"), COLORS.charcoal).ctaBg, COLORS.charcoal);
  assert.equal(resolveAssetPalette(band("charcoal"), COLORS.blue).ctaBg, COLORS.blue);
  assert.equal(resolveAssetPalette(band("sand"), COLORS.charcoal).ctaBg, COLORS.charcoal);
});

test("preview and build both consume the ratio master created by the size adapter", () => {
  assert.match(studio, /photoSource:\s*masterFor\(ad\?\.masters,\s*pl\.ratio,\s*pl\.w,\s*pl\.h\)/);
  assert.match(studio, /photoSource:\s*masterFor\(mastersFor\.get\(concept\.id\),\s*pl\.ratio,\s*pl\.w,\s*pl\.h\)/);
});

test("the renderer does not discard a prepared master because the placement is larger", async () => {
  const engine = await readFile(new URL("../ad-engine.js", import.meta.url), "utf8");
  assert.match(engine, /Matching shape is the contract/);
  assert.doesNotMatch(engine, /return masterFit\.usable && masterFit\.upscale <= sourceFit\.upscale \? master : srcImg/);
});

test("every button option is validated by the same automatic colour resolver", () => {
  assert.match(studio, /option\.disabled\s*=\s*safeCtaId\(cfg\.band,\s*option\.value\)\s*!==\s*option\.value/);
  assert.match(studio, /cfg\.ctaColour\s*=\s*safeCtaId\(cfg\.band,\s*e\.target\.value\)/);
});

test("autonomous adjustments are available in German", async () => {
  const locale = await readFile(new URL("../locales/studio-assets.de.js", import.meta.url), "utf8");
  assert.match(locale, /The size adapter prepared this photograph/);
  assert.match(locale, /Colours were resolved automatically for this format/);
});
