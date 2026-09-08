import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

// Exercise the shipped guards, not a second implementation of their rules.
const html = readFileSync(new URL("../concept-studio.html", import.meta.url), "utf8");
const caseStart = html.indexOf("function looksAllCaps(value)");
const caseEnd = html.indexOf("/* What the chips are actually toggling", caseStart);
const pageKinds = html.match(/function campaignPageKinds\(campaign\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(caseStart >= 0 && caseEnd > caseStart && pageKinds, "production guards are present");
const guard = vm.runInNewContext(`${pageKinds}\n${html.slice(caseStart, caseEnd)}\nprofessionalsCaseViolations`);
const selected = [{ id: "A", headline_de: "Mehr Erfolg für Sie.", subline_de: "Präsentieren Sie Ihre Immobilien.", cta_de: "Beratung anfragen" }];
const violations = campaign => Array.from(guard(selected, campaign));

test("hidden draft copy cannot block an image-only export", () => {
  const campaign = { over: { A: { headline: "JETZT ERFOLGREICH" } }, proof: [{ on: true, short: "MEHR ERFOLG", line: "MEHR MÖGLICHKEITEN" }] };
  assert.deepEqual(violations(campaign), []);
  assert.deepEqual(violations({ ...campaign, outputs: { landingpage: false, email: false } }), []);
});

test("selected document customer copy is checked", () => {
  const campaign = { outputs: { landingpage: true }, over: { A: { headline: "JETZT ERFOLGREICH" } }, proof: [{ on: true, short: "MEHR ERFOLG", line: "MEHR MÖGLICHKEITEN" }] };
  assert.deepEqual(violations(campaign), ["Campaign Concept A headline", "Campaign proof point 1 heading", "Campaign proof point 1 line"]);
});

test("overrides belonging to excluded concepts are ignored", () => {
  assert.deepEqual(violations({ outputs: { landingpage: true, email: true }, over: { B: { headline: "JETZT ERFOLGREICH", cta: "JETZT ANFRAGEN" } } }), []);
});

test("disabled proof and fields not printed by the document are ignored", () => {
  const campaign = { outputs: { email: true }, proof: [
    { on: false, short: "MEHR ERFOLG", line: "MEHR MÖGLICHKEITEN" },
    { on: true, short: "INTERNAL HEADING", line: "Mehr Möglichkeiten für Sie." },
  ], url: "HTTPS://EXAMPLE.COM/AGENTS", internal: "INTERNAL INSTRUCTIONS", over: { A: { rationale: "INTERNAL NOTES" } } };
  assert.deepEqual(violations(campaign), []);
});

test("legacy enabled proof without an on property is checked when exported", () => {
  assert.deepEqual(violations({ outputs: { email: true }, proof: [{ line: "JETZT BERATEN LASSEN" }] }), ["Campaign proof point 1 line"]);
});

test("image copy remains checked independently of draft selection", () => {
  const allCaps = [{ ...selected[0], headline_de: "JETZT ERFOLGREICH" }];
  assert.deepEqual(Array.from(guard(allCaps, { outputs: { email: false } })), ["Concept A headline"]);
});
