import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { buildEmail, buildLandingPage, emailReadiness, fieldOf, landingReadiness, seedCampaign, STORY_FONT_FILES, storyFrom } from "../story-builder.js";

function story(campaign = {}) {
  return storyFrom({
    brief: { product: "Professionals" },
    concept: { id: 1, headline_de: "Mehr Sichtbarkeit für Ihre Immobilien.", subline_de: "Ein freigegebener Nachweis aus dem Briefing.", cta_de: "Beratung anfragen" },
    band: "sand", logoKey: "logo-professionals", proof: [],
    campaign: { ...seedCampaign([]), url: "https://example.com/contact", ...campaign },
  });
}

test("both HTML exports declare the same three existing font assets", async () => {
  assert.deepEqual(STORY_FONT_FILES.map(font => font.weight), [400, 700, 800]);
  for (const font of STORY_FONT_FILES) {
    await access(new URL(`../${font.asset}`, import.meta.url));
    assert.ok(buildLandingPage(story()).includes(`src:url("${font.path}")`));
    assert.ok(buildEmail(story()).includes(`src:url("${font.path}")`));
  }
});

test("an email without legal destinations is visibly a draft and has no fake footer links", () => {
  const output = buildEmail(story());
  assert.match(output, /Entwurf\. Nicht versenden\./);
  assert.match(output, /name="professionals-export-status" content="draft"/);
  assert.match(output, /Abmelden: Link fehlt/);
  assert.match(output, /Impressum: Link fehlt/);
  assert.match(output, /Datenschutz: Link fehlt/);
  assert.doesNotMatch(output, /href="#"/);
});

test("email legal destinations must be absolute web URLs", () => {
  const candidate = story({ emailLegal: { unsubscribeUrl: "javascript:alert(1)", imprintUrl: "/imprint", privacyUrl: "data:text/html,not-allowed" } });
  assert.deepEqual(candidate.emailLegal, { unsubscribeUrl: "", imprintUrl: "", privacyUrl: "" });
  assert.equal(emailReadiness(candidate).reasons.length, 4);
  assert.doesNotMatch(buildEmail(candidate), /javascript:|data:text\/html/);
});

test("supplied legal destinations are preserved but do not imply mail-client approval", () => {
  const candidate = story({ emailLegal: { unsubscribeUrl: "https://example.com/unsubscribe", imprintUrl: "https://example.com/imprint", privacyUrl: "https://example.com/privacy" } });
  const readiness = emailReadiness(candidate);
  assert.equal(readiness.status, "draft");
  assert.equal(readiness.reasons.length, 1);
  assert.match(readiness.reasons[0], /Make It Better/);
  const output = buildEmail(candidate);
  assert.match(output, /href="https:\/\/example.com\/unsubscribe"/);
  assert.doesNotMatch(output, /Link fehlt/);
});

test("an empty or relative email CTA destination is explicitly listed as incomplete", () => {
  for (const url of ["", "/contact", "javascript:alert(1)"]) {
    assert.match(emailReadiness(story({ url })).reasons[0], /Zieladresse/);
  }
});

test("generated pages keep one typeface, sentence case and separate Teal and Blue", () => {
  const lp = buildLandingPage(story());
  const mail = buildEmail(story());
  assert.doesNotMatch(lp + mail, /Open Sans|Arial|Helvetica|text-transform:uppercase/);
  assert.match(lp, /h2 \{[^}]*font-weight:700/);
  assert.match(lp, /h3 \{[^}]*font-weight:700/);
  assert.notEqual(fieldOf("teal").accent, fieldOf("blue").bg);
  assert.notEqual(fieldOf("blue").accent, fieldOf("teal").bg);
});

test("internal concept reasoning never becomes landing page copy", () => {
  for (const key of ["big_idea", "storyline", "creative_hook"]) {
    const internal = `Nur intern: ${key} für die Designbesprechung`;
    const candidate = storyFrom({
      brief: { product: "Professionals" },
      concept: { id: 1, headline_de: "Mehr Sichtbarkeit für Ihre Immobilien.", subline_de: "Ein freigegebener Kundennachweis.", cta_de: "Beratung anfragen", [key]: internal },
      band: "sand", logoKey: "logo-professionals", proof: [{ short: "Bestätigter Nachweis", line: "Die freigegebene Aussage der Kampagne." }],
      campaign: { url: "https://example.com/contact" },
    });
    assert.equal(candidate.idea, undefined);
    assert.equal(candidate.hook, undefined);
    assert.doesNotMatch(buildLandingPage(candidate), /Nur intern:|Designbesprechung/);
    assert.match(buildLandingPage(candidate), /Die freigegebene Aussage der Kampagne\./);
  }
});

test("legacy stored rationale and fixed Studio workflow cannot leak into customer HTML", () => {
  const candidate = { ...story(), idea: "Interne Bildregie", hook: "Interner Workshop", proof: [{ short: "Freigegebener Nachweis", line: "Eine belegte Kundeninformation." }] };
  const output = buildLandingPage(candidate);
  assert.doesNotMatch(output, /Interne Bildregie|Interner Workshop|In vier Schritten zur Kampagne|Briefing festlegen|Konzept wählen|Formate prüfen|Kampagne freigeben|Safe Zones kontrollieren|verbindlich in der Freigabe/);
  assert.match(output, /Mehr Sichtbarkeit für Ihre Immobilien\./);
  assert.match(output, /Eine belegte Kundeninformation\./);
  assert.match(output, /Beratung anfragen/);
});

test("landing page draft readiness names missing destination and content", () => {
  const candidate = { ...story({ url: "javascript:alert(1)" }), headline: "", subline: "[Subline]", cta: "[Button]", proof: [{ short: "", line: "[Proof line]" }] };
  const readiness = landingReadiness(candidate);
  assert.equal(readiness.status, "draft");
  assert.match(readiness.reasons[0], /Zieladresse/);
  assert.match(readiness.reasons[1], /Überschrift, Unterzeile, Hauptaktion, Nachweis/);
  const output = buildLandingPage(candidate);
  assert.match(output, /Entwurf\. Nicht veröffentlichen\./);
  assert.match(output, /name="professionals-export-status" content="draft"/);
  assert.doesNotMatch(output, /javascript:alert/);
});

test("a filled landing page still requires human approval", () => {
  const readiness = landingReadiness(story());
  assert.equal(readiness.status, "draft");
  assert.equal(readiness.reasons.length, 1);
  assert.match(readiness.reasons[0], /menschliche Freigabe/);
  assert.match(buildLandingPage(story()), /<aside class="draft-notice"/);
});

test("malformed and protocol relative landing destinations remain unresolved", () => {
  for (const url of ["https://[invalid", "//example.com/contact", "/\\example.com/contact"]) {
    const candidate = story({ url });
    assert.equal(candidate.href, "#");
    assert.match(landingReadiness(candidate).reasons[0], /Zieladresse/);
  }
  assert.equal(story({ url: "/contact" }).href, "/contact");
});

test("an empty or deselected proof set produces no invented proof section", () => {
  const candidate = story({ proof: [{ short: "Nicht ausgewählt", line: "Nicht veröffentlichen", on: false }] });
  const output = buildLandingPage(candidate);
  assert.doesNotMatch(output, /Nicht ausgewählt|class="triad"|class="wrap split"|Ihre Vorteile|Professionelle Immobilienvermarktung mit einem klaren nächsten Schritt/);
  assert.match(output, /class="wrap hero"/);
  assert.match(output, /class="closing"/);
});
