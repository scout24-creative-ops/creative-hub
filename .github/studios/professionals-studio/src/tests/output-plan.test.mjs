import test from "node:test";
import assert from "node:assert/strict";
import { plannedBuild, buildFacts } from "../studio-facts.js";

const concept = { id: "one", hasPhoto: true };
const placement = { platform: "Meta", placement: "Facebook Feed", w: 1080, h: 1080, stills: true };
const plan = (pageKinds, extra = {}) => plannedBuild({ concepts: [concept], placements: [placement], pageKinds, ...extra });

test("explicit empty output selection creates no document files or phrases", () => {
  const value = plan([]);
  assert.equal(value.pages, 0);
  assert.equal(value.files, value.ads);
  assert.deepEqual(value.pageKinds, []);
  assert.deepEqual(value.pageCounts, { landingpage: 0, email: 0, other: 0 });
  for (const key of ["pages", "pagesDefinite", "pagesIndefinite"]) assert.equal(value.phrases[key], "");
});

test("landing page selection creates exactly one landing page per concept", () => {
  const value = plan(["landingpage"]);
  assert.equal(value.pages, 1);
  assert.equal(value.files, value.ads + 1);
  assert.deepEqual(value.pageCounts, { landingpage: 1, email: 0, other: 0 });
  assert.equal(value.phrases.pages, "1 landing page");
  assert.equal(value.phrases.pagesDefinite, "The landing page");
  assert.equal(value.phrases.pagesIndefinite, "a landing page from the same concept");
});

test("email selection creates exactly one email per concept", () => {
  const value = plan(["email"]);
  assert.equal(value.pages, 1);
  assert.deepEqual(value.pageCounts, { landingpage: 0, email: 1, other: 0 });
  assert.equal(value.phrases.pages, "1 email");
  assert.equal(value.phrases.pagesDefinite, "The email");
  assert.equal(value.phrases.pagesIndefinite, "an email from the same concept");
});

test("both kinds deduplicate in a stable order and ignore unknown choices", () => {
  const value = plan(["email", "unknown", "email", "landingpage", "landingpage"]);
  assert.deepEqual(value.pageKinds, ["landingpage", "email"]);
  assert.equal(value.pages, 2);
  assert.equal(value.phrases.pages, "1 landing page and 1 email");
  assert.equal(value.phrases.pagesDefinite, "The landing page and the email");
  assert.equal(value.phrases.pagesIndefinite, "a landing page and an email from the same concept");
});

test("multiple concepts multiply only the selected document kinds", () => {
  const concepts = [concept, { id: "two", hasPhoto: false }, { id: "three", hasPhoto: true }];
  for (const pageKinds of [[], ["landingpage"], ["email"], ["landingpage", "email"]]) {
    const value = plan(pageKinds, { concepts });
    assert.equal(value.pages, concepts.length * pageKinds.length);
    assert.equal(value.files, value.ads + value.pages);
  }
  const value = plan(["email"], { concepts });
  assert.equal(value.phrases.pages, "3 emails");
  assert.equal(value.phrases.pagesDefinite, "The emails");
  assert.equal(value.phrases.pagesIndefinite, "an email for each concept");
});

test("blocked placements and empty inputs do not invent or remove selected documents", () => {
  const blocked = plan(["landingpage"], { placements: [{ ...placement, stills: false }] });
  assert.equal(blocked.ads, 0);
  assert.equal(blocked.pages, 1);
  assert.equal(blocked.files, 1);
  assert.ok(blocked.held > 0);
  const empty = plan(["email", "landingpage"], { concepts: [] });
  assert.equal(empty.files, 0);
  assert.equal(empty.pages, 0);
  assert.equal(empty.phrases.pagesDefinite, "");
  assert.equal(empty.phrases.pagesIndefinite, "");
  assert.equal(plan(["unknown"]).pages, 0);
  assert.equal(plan(null).pages, 0);
});

test("callers without pageKinds retain the default pair and legacy count override", () => {
  const normal = plannedBuild({ concepts: [concept], placements: [placement] });
  assert.equal(normal.pages, 2);
  assert.equal(normal.phrases.pagesDefinite, "The landing page and the email");
  const legacy = plannedBuild({ concepts: [concept, concept], placements: [], pagesPerConcept: 3 });
  assert.equal(legacy.pages, 6);
  assert.equal(legacy.pageCounts.other, 6);
  assert.equal(legacy.phrases.pages, "6 page files");
  assert.equal(plan([], { pagesPerConcept: 20 }).pages, 0);
});

test("delivered document summaries count actual kinds instead of guessing pairs", () => {
  const cases = [
    { pages: [], counts: [0, 0, 0], phrase: "" },
    { pages: [{ kind: "landingpage" }], counts: [1, 0, 0], phrase: "1 landing page" },
    { pages: [{ kind: "email" }], counts: [0, 1, 0], phrase: "1 email" },
    { pages: [{ kind: "email" }, { kind: "email" }], counts: [0, 2, 0], phrase: "2 emails" },
    { pages: [{ kind: "landingpage" }, { kind: "landingpage" }], counts: [2, 0, 0], phrase: "2 landing pages" },
    { pages: [{ kind: "landingpage" }, { kind: "email" }], counts: [1, 1, 0], phrase: "1 landing page and 1 email" },
    { pages: [{ kind: "email" }, { kind: "landingpage" }, { kind: "email" }], counts: [1, 2, 0], phrase: "1 landing page and 2 emails" },
    { pages: [{}, {}], counts: [0, 0, 2], phrase: "2 page files" },
  ];
  for (const { pages, counts, phrase } of cases) {
    const value = buildFacts({ built: [], pages, rows: [{ blocked: true, blockedReason: "Outside the safe zone" }] });
    assert.equal(value.files, pages.length);
    assert.equal(value.pageFiles, pages.length);
    assert.deepEqual(value.pageCounts, { landingpage: counts[0], email: counts[1], other: counts[2] });
    assert.equal(value.phrases.pages, phrase);
    assert.equal(value.blocked, 1);
  }
  assert.equal(buildFacts({}).files, 0);
  assert.equal(buildFacts({}).phrases.pages, "");
});
