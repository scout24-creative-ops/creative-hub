import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ASSET_TYPE_ROLES, fitStack, tokens } from "../ad-engine.js";

const source = JSON.parse(await readFile(new URL("../../brand/tokens.json", import.meta.url), "utf8"));
function context() {
  return {
    font: "", globalAlpha: 1, fillStyle: "", drawn: [],
    measureText(text) {
      const size = Number(this.font.match(/ ([\d.]+)px/)?.[1]) || 0;
      return { width: String(text).length * size * 0.5,
        actualBoundingBoxAscent: size * 0.75, actualBoundingBoxDescent: size * 0.2 };
    },
    fillText(text, x, y) { this.drawn.push({ text, x, y, font: this.font, colour: this.fillStyle, alpha: this.globalAlpha }); },
    beginPath() {}, moveTo() {}, lineTo() {}, arcTo() {}, closePath() {}, fill() {},
  };
}
const ladder = { ideal: 100, floor: 55, sublineRatio: 0.435, ctaRatio: 0.44, kickerRatio: 0.255 };
const copy = { headline: "Mehr Erfolg", subline: "Für Ihr Geschäft.", cta: "Beratung anfragen" };
const palette = { fg: "foreground", ctaBg: "button", ctaFg: "button text" };

test("advertising roles derive exact family, weights, minima and leading from approved tokens", () => {
  assert.equal(ASSET_TYPE_ROLES.headline.family, source.fontFamily.headline.$value);
  assert.equal(ASSET_TYPE_ROLES.headline.weight, source.fontWeight.display.$value);
  assert.equal(ASSET_TYPE_ROLES.subline.weight, source.fontWeight.body.$value);
  assert.equal(ASSET_TYPE_ROLES.cta.weight, source.fontWeight.caption.$value);
  assert.equal(ASSET_TYPE_ROLES.kicker.weight, source.fontWeight.caption.$value);
  assert.equal(ASSET_TYPE_ROLES.headline.minPx, parseFloat(source.fontSize.minimumAdHeadline.$value));
  assert.equal(ASSET_TYPE_ROLES.subline.minPx, parseFloat(source.fontSize.minimumAdBody.$value));
  assert.equal(ASSET_TYPE_ROLES.subline.lineHeight, source.lineHeight.body.$value);
});

test("responsive scale never defines a headline below the approved minimum", () => {
  for (const [w, h] of [[320, 50], [728, 90], [100, 75], [1080, 1080], [1080, 1920]]) {
    const scale = tokens(w, h, { kind: "house", top: 0, right: 0, bottom: 0, left: 0 });
    assert.ok(scale.ideal >= ASSET_TYPE_ROLES.headline.minPx);
    assert.ok(scale.floor >= ASSET_TYPE_ROLES.headline.minPx);
  }
});

test("complete copy at a smaller acceptable size beats an oversized headline without its subline", () => {
  const stack = fitStack(context(), copy, 1200, 300, ladder);
  assert.ok(stack && stack.headlinePx < ladder.ideal);
  assert.ok(stack.parts.sub && stack.parts.cta);
  assert.equal(stack.fitMode, "complete");
  assert.equal(stack.droppedSub, false);
});

test("a wide CTA triggers another complete fit rather than being silently removed", () => {
  const stack = fitStack(context(), { ...copy, subline: "" }, 350, 600, ladder);
  assert.ok(stack && stack.headlinePx < ladder.ideal);
  assert.equal(stack.parts.cta.text, copy.cta);
  assert.equal(stack.droppedCta, false);
});

test("an impossible CTA rejects the fit even when the headline fits", () => {
  const stack = fitStack(context(), { headline: "Mehr", cta: "Beratung für Immobilienunternehmen anfragen" }, 200, 900,
    { ...ladder, floor: 1 });
  assert.equal(stack, null);
});

test("only the optional subline is removed after every complete size has been checked", () => {
  const stack = fitStack(context(), copy, 1200, 185, ladder);
  assert.ok(stack);
  assert.equal(stack.parts.sub, null);
  assert.equal(stack.parts.cta.text, copy.cta);
  assert.equal(stack.fitMode, "without-subline");
  assert.equal(stack.droppedSub, true);
  assert.equal(stack.droppedCta, false);
  assert.equal(fitStack(context(), copy, 1200, 185, ladder, { sublineRequired: true }), null);
});

test("a smaller caller floor cannot bypass approved headline or supporting copy minima", () => {
  const stack = fitStack(context(), copy, 500, 500,
    { ...ladder, ideal: 10, floor: 1 }, { floorPx: 1, startPx: 10 });
  assert.ok(stack);
  assert.ok(stack.headlinePx >= ASSET_TYPE_ROLES.headline.minPx);
  assert.ok(stack.parts.sub.px >= ASSET_TYPE_ROLES.subline.minPx);
  assert.ok(stack.parts.cta.px >= ASSET_TYPE_ROLES.cta.minPx);
});

test("long words never fragment or gain manufactured hyphens", () => {
  const headline = "Immobilienmarketing";
  const stack = fitStack(context(), { headline }, 240, 300, { ...ladder, ideal: 48, floor: 24 });
  assert.ok(stack);
  assert.deepEqual(stack.parts.hl.lines.map(line => line.t), [headline]);
  assert.equal(fitStack(context(), { headline }, 100, 300,
    { ...ladder, ideal: 48, floor: 1 }, { floorPx: 1 }), null);
});

test("requested multiword emphasis remains on one line", () => {
  const stack = fitStack(context(), { headline: "Mehr Erfolg für Sie", emphasis: "Erfolg für" }, 210, 500,
    { ...ladder, ideal: 48, floor: 24 }, { maxLines: 4 });
  assert.ok(stack);
  assert.ok(stack.parts.hl.lines.some(line => line.t.includes("Erfolg für")));
  assert.equal(stack.parts.hl.lines.map(line => line.t).join(" "), "Mehr Erfolg für Sie");
});

test("centred supporting elements cannot exceed the measured stack width", () => {
  const stack = fitStack(context(), { headline: "Mehr", cta: "Beratung für Sie anfragen" }, 800, 800, ladder,
    { align: "center", maxCPL: 6 });
  assert.ok(stack);
  assert.ok(stack.colW >= stack.parts.cta.w);
  const ink = [];
  stack.draw(context(), 0, 0, palette, (x, y, w, h) => ink.push({ x, y, w, h }));
  assert.ok(ink.every(box => box.x >= 0 && box.x + box.w <= stack.colW));
});

test("drawing uses the same declared weights as measurement, with regular opaque supporting copy", () => {
  const stack = fitStack(context(), { ...copy, kicker: "Professionals" }, 1200, 900, ladder, { kicker: true });
  const ctx = context();
  stack.draw(ctx, 0, 0, palette, () => {});
  for (const [key, value] of Object.entries({ hl: copy.headline, sub: copy.subline, cta: copy.cta, kicker: "Professionals" })) {
    const draw = ctx.drawn.find(item => item.text === value);
    assert.ok(draw);
    assert.ok(draw.font.startsWith(`${stack.parts[key].weight} `));
    assert.ok(draw.font.endsWith('"Make It Better"'));
  }
  assert.equal(stack.parts.hl.role, "display");
  assert.equal(stack.parts.sub.role, "body");
  assert.equal(ctx.drawn.find(item => item.text === copy.subline).alpha, 1);
  assert.ok(ctx.drawn.every(item => !item.font.startsWith("800 ")));
});

test("headline emphasis colours only the requested run and exposes each colour to contrast checks", () => {
  const stack = fitStack(context(), { headline: "Mehr Erfolg für Sie" }, 1200, 900, ladder);
  const ctx = context(), ink = [];
  stack.draw(ctx, 0, 0, { ...palette, headlineRuns: { 0: { start: 5, end: 11, colour: "emphasis" } } },
    (x, y, w, h, colour) => ink.push({ x, y, w, h, colour }));
  assert.deepEqual(ctx.drawn.map(item => [item.text, item.colour]),
    [["Mehr ", "foreground"], ["Erfolg", "emphasis"], [" für Sie", "foreground"]]);
  assert.deepEqual(ink.map(box => box.colour), ["foreground", "emphasis", "foreground"]);
});
