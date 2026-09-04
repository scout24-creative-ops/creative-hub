/* =====================================================================
   THE STORYLINE

   A concept is not an ad. It is a story, and a campaign tells that story
   on every surface a person meets: the ad that stops them, the page they
   land on, the email that follows. If those three disagree, the click is
   wasted. A viewer who taps a charcoal Reels frame and lands on a sand
   hero with different words reads it as the wrong page and leaves, and
   that is the cheapest conversion work there is.

   So this module takes ONE concept and writes the other two surfaces from
   it: the same headline, the same subline, the same button, the same
   photograph, the same colour field, the same proof points, in the same
   order. Nothing here invents a message. It carries one.

   Both outputs are standalone files. The landing page is a single HTML
   document with the fonts linked and the images inlined as data URIs, so
   it opens anywhere. The email is 600px of tables with inline styles and
   a system font fallback, because that is the only thing every client
   agrees on.

   Brand rules this file is built to keep:
   - Five colours. Charcoal on sand, white, teal or purple; white on
     charcoal. Never white on teal or purple, which measures 1.4:1.
   - Nothing coloured behind a word. Colour is the field the type sits on,
     or it is a button, and there is nothing in between.
   - Buttons are pills, radius half the height, never a rounded rectangle.
   - The Professionals is a shape, never a bullet. Lists use a check chip.
   - German B2B, formal Sie throughout, sentence case, no exclamation marks.

   WHAT A PERSON CAN CHANGE HERE, AND WHY IT IS NOT EVERYTHING.
   These two documents used to be written silently at build time and seen
   only afterwards, as files, with nothing to set and nothing to check. Four
   of the slots in them are the ones a person genuinely wants their hands
   on before a build — the headline, the subline, the button, and the proof
   points — so those four take a `campaign` object and the rest still comes
   off the concept. Everything else on these pages is fixed prose that
   belongs to the product rather than to a campaign: the four steps, the
   reassurance line, the section eyebrow, the legal footer. A campaign does
   not get to rewrite what the product is, and an editor that pretended
   otherwise would be a page builder wearing a campaign's clothes.

   NOTHING IS INVENTED TO FILL A HOLE. An empty slot prints its own name in
   square brackets — [Headline], [Button] — the same contract deck-builder
   keeps, so a gap is visible in the document rather than being an absence
   nobody notices until it is in front of a client.
   ===================================================================== */

export const STORY_VERSION = "1.1.0";

const C = {
  charcoal: "#333333", sand: "#FBF8F6", white: "#FFFFFF",
  teal: "#3DF5DC", blue: "#24E3FF",
};

/* The four pairings that clear 4.5:1. White on teal is 1.4:1 and is not
   one of them, so the type colour is derived rather than chosen. */
const FIELDS = {
  sand:     { bg: C.sand,     fg: C.charcoal, accent: C.teal,   logo: "",       soft: "rgba(51,51,51,.72)" },
  white:    { bg: C.white,    fg: C.charcoal, accent: C.blue, logo: "",       soft: "rgba(51,51,51,.72)" },
  teal:     { bg: C.teal,     fg: C.charcoal, accent: C.blue, logo: "",       soft: "rgba(51,51,51,.78)" },
  blue:     { bg: C.blue,     fg: C.charcoal, accent: C.teal, logo: "",       soft: "rgba(51,51,51,.82)" },
  charcoal: { bg: C.charcoal, fg: C.white,    accent: C.teal,   logo: "-inverse", soft: "rgba(255,255,255,.78)" },
};
export function fieldOf(id) { return FIELDS[id === "purple" ? "blue" : id] || FIELDS.sand; }

function storyLogoSource(story, field) {
  if (story.logoDataUri) return story.logoDataUri;
  if (story.logoKey === "logo-professionals") {
    return field.logo === "-inverse"
      ? "assets/logos/immoscout24-horizontal-inverse.svg"
      : field.logo === "-white"
        ? "assets/logos/immoscout24-horizontal-white.svg"
        : "assets/logos/immoscout24-horizontal.svg";
  }
  return `assets/${story.logoKey}${field.logo}.svg`;
}

const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------------------------------------------------------------
   THE CAMPAIGN: THE FOUR THINGS A PERSON SETS BEFORE THE BUILD
   --------------------------------------------------------------------- */

/* The bracketed gap, and it is a contract rather than a detail. The screen
   that lets somebody empty a field has to show exactly the marker the
   document will carry, so both read this one function. English inside the
   brackets on a German page for the same reason deck-builder does it: a gap
   is an instruction to whoever is making the thing, not customer copy. */
export function gap(label) { return `[${label}]`; }

/* SLOT NAMES ARE WRITTEN DOWN ONCE. The card in the Studio labels its four
   inputs off this, and `storyFrom` marks its gaps off this, so a field
   called "Button" on screen cannot print "[CTA]" in the document. */
export const SLOTS = Object.freeze({
  headline: "Headline", subline: "Subline", cta: "Button",
  proofShort: "Proof point", proofLine: "Proof line", url: "Button link",
});

/* WHERE THE BUTTONS GO. Every button on both documents was `href="#"` — four
   on the page, two in the email — so the one thing a landing page exists to
   do was the one thing nobody could set.

   A destination is a URL a browser will follow, and only that. A `javascript:`
   href in a file that gets emailed to a client and opened from a desktop is a
   script somebody else wrote running in their browser, so anything that is not
   plainly http, https or a root-relative path is refused and the button stays
   where it was. `linkOf` returns "#" for a refusal exactly as it does for an
   empty box; `linkRefused` is what tells the two apart, because a link that
   was typed and quietly dropped is the failure worth naming out loud. */
export function linkOf(url) {
  const s = String(url ?? "").trim();
  if (!s) return "#";
  if (/^https?:\/\/\S+$/i.test(s)) return s;
  if (/^\/\S*$/.test(s)) return s;
  return "#";
}
export function linkRefused(url) {
  const s = String(url ?? "").trim();
  return !!s && linkOf(s) === "#";
}

/* The starting point for a campaign: the product's own proof points, all of
   them, all on, and nothing else set. `on` is what a person unticks; `short`
   and `line` are what they rewrite. Copies rather than references, because
   the PROOF table is a module constant and an editor holding it by reference
   would rewrite the product for every campaign after it. */
export function seedCampaign(proof) {
  return {
    url: "",
    proof: (Array.isArray(proof) ? proof : []).map(p => ({
      short: String((p && p.short) ?? ""),
      line: String((p && p.line) ?? ""),
      on: true,
    })),
    over: {},
  };
}

/* The proof points that will actually be written, in order, with an emptied
   field showing as a gap rather than as nothing. */
function proofOf(campaign, fallback, gaps) {
  const chosen = Array.isArray(campaign.proof)
    ? campaign.proof.filter(p => p && p.on !== false)
    : (fallback || []);
  return chosen.map(p => {
    const short = String((p && p.short) ?? "").trim();
    const line = String((p && p.line) ?? "").trim();
    if (!short) gaps.push(SLOTS.proofShort);
    if (!line) gaps.push(SLOTS.proofLine);
    return { short: short || gap(SLOTS.proofShort), line: line || gap(SLOTS.proofLine) };
  });
}

/* Everything the two surfaces need, read once from the concept so the
   three of them cannot drift apart.

   `campaign` is optional and additive: with none, this is the concept on its
   own, which is what every build did before there was anywhere to set one.
   An override that is blank is not an override — the ad's own word is used
   and the box on screen shows it as the placeholder — so "same as the ads"
   costs nothing to say and is the default. */
export function storyFrom({ brief, concept, band, logoKey, proof, heroDataUri, logoDataUri, plusDataUri, photoPath, campaign }) {
  const product = (brief && brief.product) || "Professionals";
  const f = fieldOf(band);
  /* The approved library already has the Professionals shapes composed into the
     photography. Laying another one over it is the over-branding the ad
     engine refuses to do, and the page should not do it either. */
  const photoHasProfessionals = /photo-plus-/.test(String(photoPath || ""));
  const c = (campaign && typeof campaign === "object") ? campaign : {};
  const over = (c.over && c.over[concept && concept.id]) || {};

  /* WHICH SLOTS ARE EMPTY, COLLECTED WHILE THEY ARE FILLED. The card above
     the preview prints this list, so what it warns about and what the
     document carries are the same reading rather than two. */
  const gaps = [];
  const fill = (chosen, inherited, label) => {
    const v = String(chosen ?? "").trim() || String(inherited ?? "").trim();
    if (v) return v;
    gaps.push(label);
    return gap(label);
  };

  return {
    product,
    headline: fill(over.headline, concept.headline_de, SLOTS.headline),
    subline: fill(over.subline, concept.subline_de, SLOTS.subline),
    /* "Mehr erfahren" used to stand here as the fallback, which is invented
       copy: nobody wrote it, and it shipped on a real page looking exactly
       like a decision. An empty button now says it is empty. */
    cta: fill(over.cta, concept.cta_de, SLOTS.cta),
    idea: concept.big_idea || concept.storyline || "",
    hook: concept.creative_hook || "",
    /* NO `.slice(0, 3)`. That silently dropped the fourth proof point of
       "Professionals" — the SCHUFA one — from every landing page and
       every email this Studio has ever written, with nothing on any screen
       saying so. Which points run is now a decision somebody makes. */
    proof: proofOf(c, proof, gaps),
    href: linkOf(c.url),
    urlRefused: linkRefused(c.url),
    gaps,
    field: f, band, photoHasProfessionals,
    logoKey, heroDataUri, logoDataUri,
    plusDataUri: photoHasProfessionals ? null : plusDataUri,
  };
}

/* A pill. The one filled shape a text surface is allowed. `href` is escaped
   like every other interpolation: it lands inside a double-quoted attribute,
   and `linkOf` has already refused anything that is not a URL. */
function button(label, bg, fg, size, href) {
  const px = size === "lg" ? "20px 40px" : "16px 32px";
  const fs = size === "lg" ? "18px" : "16px";
  return `<a href="${esc(href || "#")}" style="display:inline-block;background:${bg};color:${fg};font-size:${fs};font-weight:700;`
       + `text-decoration:none;padding:${px};border-radius:999px;line-height:1">${esc(label)}</a>`;
}

/* A check chip. The Professionals shape is never used as a bullet, which is the
   rule this helper exists to make easy to follow. */
function checkRow(text, accent, fg, soft) {
  return `<li style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(51,51,51,.12);list-style:none">
    <span style="flex:none;width:28px;height:28px;border-radius:999px;background:${accent};color:${C.charcoal};
      display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;margin-top:2px">&#10003;</span>
    <span style="font-size:19px;font-weight:700;line-height:1.45;color:${fg}">${esc(text)}</span></li>`;
}

/* ---------------------------------------------------------------------
   THE LANDING PAGE
   Hero, proof triad, the three steps, a detail split, and a closing band.
   The hero repeats the ad exactly: same words, same picture, same field.
   --------------------------------------------------------------------- */
export function buildLandingPage(story) {
  const f = story.field;
  const dark = story.band === "charcoal";
  /* The closing band takes the opposite polarity, so the page has one
     hard change of colour in it rather than a gradient of beige. */
  const close = dark ? FIELDS.sand : FIELDS.charcoal;
  const proof = story.proof;
  const href = story.href || "#";
  const btn = (size) => button(story.cta, f.fg === C.white ? C.white : C.charcoal,
                               f.fg === C.white ? C.charcoal : C.white, size, href);

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(story.product)} · ${esc(story.headline)}</title>
<style>
  @font-face { font-family:"Make It Better"; font-weight:400; src:url("_ds/cosma-design-system-immoscout24-8eb67f26-7064-4594-8f25-60ab9a5637e2/fonts/MakeItBetter-Regular.woff2") format("woff2"); }
  @font-face { font-family:"Make It Better"; font-weight:700; src:url("_ds/cosma-design-system-immoscout24-8eb67f26-7064-4594-8f25-60ab9a5637e2/fonts/MakeItBetter-Bold.woff2") format("woff2"); }
  @font-face { font-family:"Make It Better"; font-weight:800; src:url("_ds/cosma-design-system-immoscout24-8eb67f26-7064-4594-8f25-60ab9a5637e2/fonts/MakeItBetter-XBold.woff2") format("woff2"); }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body { font-family:"Make It Better","Open Sans",Arial,sans-serif; background:${f.bg}; color:${f.fg}; line-height:1.55; }
  .wrap { max-width:1154px; margin:0 auto; padding:0 32px; }
  .nav { display:flex; align-items:center; justify-content:space-between; padding:22px 0; gap:20px; }
  .nav img { height:26px; display:block; }
  h1 { font-size:clamp(38px,5.2vw,68px); font-weight:800; line-height:1.06; letter-spacing:-.015em; }
  h2 { font-size:clamp(28px,3.4vw,44px); font-weight:800; line-height:1.12; letter-spacing:-.01em; }
  h3 { font-size:22px; font-weight:800; line-height:1.25; }
  .lead { font-size:clamp(18px,1.9vw,23px); font-weight:700; color:${f.soft}; line-height:1.5; }
  .eyebrow { font-size:13px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; color:${f.soft}; }
  section { padding:clamp(56px,7vw,104px) 0; }
  .hero { display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(32px,5vw,72px); align-items:center; }
  /* The frame clips the photograph to its radius; the Professionals sits outside it
     so it can bleed off the corner the way the brand does. */
  .hero-media { position:relative; }
  .hero-frame { border-radius:20px; overflow:hidden; aspect-ratio:4/5; background:rgba(51,51,51,.06); }
  .hero-frame img { width:100%; height:100%; object-fit:cover; display:block; }
  .hero-media .hero-plus { position:absolute; width:20%; height:auto; right:-6%; top:-6%; z-index:2; }
  /* AS MANY COLUMNS AS THERE ARE PROOF POINTS. This was a hard
     repeat(3,1fr), and three of the five products carry two proof points,
     so those pages ran with a third of the row empty and nothing saying
     why. Auto-fit takes two, three or four without a hole in the row. */
  .triad { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:clamp(24px,3vw,44px); }
  .rule { height:6px; width:80px; margin-bottom:22px; }
  .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(20px,2.4vw,36px); position:relative; }
  .stepno { width:52px; height:52px; border-radius:999px; display:flex; align-items:center; justify-content:center;
            font-size:22px; font-weight:800; margin-bottom:20px; }
  .split { display:grid; grid-template-columns:1fr 1fr; gap:clamp(32px,5vw,72px); align-items:center; }
  .split-media { border-radius:20px; overflow:hidden; aspect-ratio:3/2; }
  .split-media img { width:100%; height:100%; object-fit:cover; display:block; }
  .closing { background:${close.bg}; color:${close.fg}; }
  .foot { font-size:13px; color:${f.soft}; padding:34px 0 56px; border-top:1px solid rgba(51,51,51,.12); }
  @media (max-width:860px) {
    .hero, .split { grid-template-columns:1fr; }
    .triad, .steps { grid-template-columns:1fr; gap:32px; }
    .hero-media { aspect-ratio:4/3; }
  }
</style>
</head>
<body>

<div class="wrap">
  <nav class="nav">
    <img src="${storyLogoSource(story, f)}" alt="${esc(story.product)}">
    ${btn("sm")}
  </nav>
</div>

<section>
  <div class="wrap hero">
    <div>
      <div class="eyebrow" style="margin-bottom:20px">${esc(story.product)}</div>
      <h1>${esc(story.headline)}</h1>
      <p class="lead" style="margin-top:24px;max-width:30ch">${esc(story.subline)}</p>
      <div style="margin-top:36px">${btn("lg")}</div>
      <p style="margin-top:18px;font-size:14px;color:${f.soft}">Für professionelle Immobilienvermarktung. Klar im Prozess, verbindlich in der Freigabe.</p>
    </div>
    <div class="hero-media">
      <div class="hero-frame">${story.heroDataUri ? `<img src="${story.heroDataUri}" alt="">` : ""}</div>
      ${story.plusDataUri ? `<img class="hero-plus" src="${story.plusDataUri}" alt="">` : ""}
    </div>
  </div>
</section>

${proof.length ? `<section style="background:${dark ? "rgba(255,255,255,.05)" : "rgba(51,51,51,.035)"}">
  <div class="wrap">
    <h2 style="margin-bottom:clamp(36px,4vw,64px);max-width:18ch">${esc(story.hook || story.headline)}</h2>
    <div class="triad">
      ${proof.map((p, i) => `<div>
        <div class="rule" style="background:${[f.accent, C.blue, C.charcoal][i % 3] === f.bg ? C.charcoal : [f.accent, C.blue, C.charcoal][i % 3]}"></div>
        <h3 style="margin-bottom:12px">${esc(p.short)}</h3>
        <p style="font-size:18px;font-weight:700;color:${f.soft};line-height:1.55">${esc(p.line)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>` : ""}

<section>
  <div class="wrap">
    <h2 style="margin-bottom:clamp(36px,4vw,64px)">In vier Schritten zur Kampagne</h2>
    <div class="steps">
      ${[
        ["Briefing festlegen", "Ziel, Zielgruppe und gewünschte Wirkung klar benennen."],
        ["Konzept wählen", "Die stärkste Route für Ihre Positionierung auswählen."],
        ["Formate prüfen", "Platzierungen, Zuschnitte und Safe Zones kontrollieren."],
        ["Kampagne freigeben", "Finale Inhalte vor der Veröffentlichung menschlich prüfen."],
      ].map(([t, d], i) => `<div>
        <div class="stepno" style="background:${i === 3 ? f.accent : (dark ? C.white : C.charcoal)};color:${i === 3 ? C.charcoal : (dark ? C.charcoal : C.white)}">${i + 1}</div>
        <h3 style="margin-bottom:10px">${esc(t)}</h3>
        <p style="font-size:17px;font-weight:700;color:${f.soft};line-height:1.5">${esc(d)}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<section style="background:${dark ? "rgba(255,255,255,.05)" : "rgba(51,51,51,.035)"}">
  <div class="wrap split">
    <div class="split-media">${story.heroDataUri ? `<img src="${story.heroDataUri}" alt="">` : ""}</div>
    <div>
      <div class="eyebrow" style="margin-bottom:18px">Ihre Vorteile</div>
      <h2 style="margin-bottom:28px">${esc(story.idea || "Professionelle Immobilienvermarktung mit einem klaren nächsten Schritt.")}</h2>
      ${proof.length ? `<ul style="margin:0;padding:0">
        ${proof.map(p => checkRow(p.line, f.accent, f.fg, f.soft)).join("")}
      </ul>` : ""}
      <div style="margin-top:34px">${btn("lg")}</div>
    </div>
  </div>
</section>

<section class="closing">
  <div class="wrap" style="text-align:center">
    <h2 style="max-width:20ch;margin:0 auto 26px">${esc(story.headline)}</h2>
    <p style="font-size:19px;font-weight:700;color:${close.soft};max-width:44ch;margin:0 auto 36px">${esc(story.subline)}</p>
    ${button(story.cta, close.fg === C.white ? close.accent : C.charcoal, close.fg === C.white ? C.charcoal : C.white, "lg", href)}
  </div>
</section>

<div class="wrap"><div class="foot">
  ImmoScout24 · ${esc(story.product)} · Finale Inhalte vor Veröffentlichung freigeben.
</div></div>

</body>
</html>`;
}

/* ---------------------------------------------------------------------
   THE EMAIL
   600px, tables, inline styles, system font fallback. Every colour is a
   background attribute as well as CSS, because Outlook ignores one of
   them and there is no way to know which.
   --------------------------------------------------------------------- */
export function buildEmail(story) {
  const f = story.field;
  const dark = story.band === "charcoal";
  const btnBg = f.fg === C.white ? C.white : C.charcoal;
  const btnFg = f.fg === C.white ? C.charcoal : C.white;
  /* SINGLE quotes. This stack is interpolated into style="..." attributes,
     and a double quote inside a double-quoted attribute closes it early:
     every colour after font-family silently reverted to the client default,
     which is how both buttons came out as link blue on charcoal. */
  const FONT = `'Make It Better', 'Open Sans', Arial, Helvetica, sans-serif`;
  const href = esc(story.href || "#");
  const proof = story.proof;

  const row = (inner, bg) =>
    `<tr><td align="center" bgcolor="${bg}" style="background-color:${bg};padding:0">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">
        ${inner}
      </table></td></tr>`;

  return `<!doctype html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(story.headline)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  @media only screen and (max-width:620px) {
    .w600 { width:100% !important; max-width:100% !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:30px !important; line-height:1.15 !important; }
    .stack { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${f.bg};">
<div style="display:none;font-size:1px;color:${f.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
  ${esc(story.subline)}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       bgcolor="${f.bg}" style="background-color:${f.bg};margin:0;padding:0">

  ${row(`<tr><td class="px" style="padding:28px 40px 8px 40px" align="left">
      <img src="${storyLogoSource(story, f)}" width="150" alt="${esc(story.product)}"
           style="display:block;border:0;height:auto;width:150px">
    </td></tr>`, f.bg)}

  ${row(`<tr><td style="padding:0">
      ${story.heroDataUri
        ? `<img src="${story.heroDataUri}" width="600" alt="" style="display:block;border:0;width:100%;height:auto">`
        : ""}
    </td></tr>`, f.bg)}

  ${row(`<tr><td class="px" style="padding:36px 40px 0 40px" align="left">
      <p style="margin:0 0 14px 0;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;
                text-transform:uppercase;color:${f.soft}">${esc(story.product)}</p>
      <h1 class="h1" style="margin:0;font-family:${FONT};font-size:38px;line-height:1.1;font-weight:800;color:${f.fg}">
        ${esc(story.headline)}</h1>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:18px;line-height:1.55;font-weight:700;color:${f.soft}">
        ${esc(story.subline)}</p>
    </td></tr>
    <tr><td class="px" style="padding:30px 40px 0 40px" align="left">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td bgcolor="${btnBg}" style="background-color:${btnBg};border-radius:999px">
          <a href="${href}" style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;
             color:${btnFg};text-decoration:none;padding:16px 34px;border-radius:999px">${esc(story.cta)}</a>
        </td></tr></table>
    </td></tr>`, f.bg)}

  ${!proof.length ? "" : row(proof.map((p, i) => `
    <tr><td class="px" style="padding:${i === 0 ? "34" : "0"}px 40px 0 40px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="border-top:1px solid rgba(51,51,51,.12)">
        <tr>
          <td width="44" valign="top" style="padding:20px 0">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr><td width="28" height="28" align="center" valign="middle" bgcolor="${f.accent}"
                      style="background-color:${f.accent};border-radius:999px;font-family:${FONT};
                             font-size:15px;font-weight:800;color:${C.charcoal};line-height:28px">&#10003;</td></tr>
            </table>
          </td>
          <td valign="top" style="padding:20px 0;font-family:${FONT};font-size:17px;line-height:1.45;
                                  font-weight:700;color:${f.fg}">${esc(p.line)}</td>
        </tr>
      </table>
    </td></tr>`).join(""), f.bg)}

  ${row(`<tr><td class="px" align="center" bgcolor="${dark ? C.sand : C.charcoal}"
             style="background-color:${dark ? C.sand : C.charcoal};padding:44px 40px">
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:24px;line-height:1.25;font-weight:800;
                color:${dark ? C.charcoal : C.white}">${esc(story.headline)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td bgcolor="${dark ? C.charcoal : f.accent}"
            style="background-color:${dark ? C.charcoal : f.accent};border-radius:999px">
          <a href="${href}" style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;
             color:${dark ? C.white : C.charcoal};text-decoration:none;padding:16px 34px;border-radius:999px">${esc(story.cta)}</a>
        </td></tr></table>
    </td></tr>`, dark ? C.sand : C.charcoal)}

  ${row(`<tr><td class="px" align="center" style="padding:28px 40px 44px 40px;font-family:${FONT};
             font-size:12px;line-height:1.6;color:${f.soft}">
      ImmoScout24 &middot; ${esc(story.product)} &middot; Finale Inhalte vor Veröffentlichung freigeben.<br>
      <a href="#" style="color:${f.soft}">Abmelden</a> &middot; <a href="#" style="color:${f.soft}">Impressum</a>
    </td></tr>`, f.bg)}

</table>
</body>
</html>`;
}
