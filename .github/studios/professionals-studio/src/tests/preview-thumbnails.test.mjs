import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../concept-studio.html", import.meta.url), "utf8");
const css = (page.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)?.[1] || "").replace(/\/\*[\s\S]*?\*\//g, "");
function rules(selector) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) => selectors.split(",").map(value => value.trim()).includes(selector))
    .map(([, , declarations]) => declarations);
}

test("finished artwork thumbnails contain the entire canvas without a second crop", () => {
  for (const selector of [".ch-thumb", ".fm-thumb", ".ref-thumb", ".rt-thumb", ".st-thumb"]) {
    const declarations = rules(selector).join("\n");
    assert.match(declarations, /background\s*:[^;]*center\s*\/\s*contain\s+no-repeat/, selector);
    assert.doesNotMatch(declarations, /(?:background|background-size)\s*:[^;]*\bcover\b/, selector);
  }
  const history = rules(".hr-thumbs img").join("\n");
  assert.match(history, /object-fit\s*:\s*contain/);
  assert.match(history, /object-position\s*:\s*center/);
  assert.doesNotMatch(history, /object-fit\s*:\s*cover/);
});

test("contained preview thumbnails preserve their existing layout geometry", () => {
  assert.match(rules(".ch-thumb")[0], /width\s*:\s*92px;\s*height\s*:\s*115px/);
  assert.ok(rules(".ch-thumb").some(rule => /width\s*:\s*74px;\s*height\s*:\s*92px/.test(rule)));
  assert.match(rules(".fm-thumb")[0], /width\s*:\s*38px;\s*height\s*:\s*38px/);
  assert.match(rules(".ref-thumb")[0], /aspect-ratio\s*:\s*var\(--ref-ratio,4\/5\)/);
});

test("source photograph crop previews retain their intentional fill behavior", () => {
  assert.match(page, /class="mt-frame"[^>]*background-size:cover/);
  assert.match(rules(".imgframe img")[0], /object-fit\s*:\s*cover/);
});
