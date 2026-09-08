import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const sourceRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pages = [
  "index.html",
  "brand.html",
  "concept-studio.html",
  "deck-studio.html",
  "template-email.html",
  "template-landing.html",
  "template-presentation.html",
  "template-social.html",
];

test("every navigable Professionals page includes the Creative Hub navigation", async () => {
  for (const page of pages) {
    const html = await readFile(path.join(sourceRoot, page), "utf8");
    const matches = html.match(/<script src="hub-navigation\.js"(?: defer)?><\/script>/g) || [];
    assert.equal(matches.length, 1, `${page} must include the shared Hub navigation exactly once`);
  }
});

test("the shared navigation exposes working Hub and Studio destinations", async () => {
  const script = await readFile(path.join(sourceRoot, "hub-navigation.js"), "utf8");
  for (const label of ["All agents", "Studio home", "Concept Studio", "Brand guidelines", "Back to Hub"]) {
    assert.match(script, new RegExp(label), `missing navigation item: ${label}`);
  }
  assert.match(script, /\?studio=agents/);
  assert.match(script, /aria-current/);
  assert.match(script, /has-creative-hub-nav/);
});

test("the navigation preserves focus and reduced-motion accessibility", async () => {
  const css = await readFile(path.join(sourceRoot, "hub-navigation.css"), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*540px\)/);
});
