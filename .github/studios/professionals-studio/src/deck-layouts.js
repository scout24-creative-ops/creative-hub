/* =====================================================================
   Professionals deck layouts.

   The sixteen slide layouts from "Template Presentation.dc.html", lifted
   out of that specimen sheet and made parametric. Each layout is a
   declaration plus a pure render function, and the declaration is the
   single source of truth: the narrative mapper reads it to decide what a
   slide needs, the editor reads it to decide what inputs to show, and
   deck-lab.html reads it to generate worst-case content.

   Colour is not restated here. It comes from story-builder's FIELDS via
   fieldOf(), so a change to the brand's fields reaches the landing page,
   the email and the deck at once.
   ===================================================================== */

import { fieldOf } from "./story-builder.js";
import { contrastRatio, luminance } from "./ad-engine.js";

export const LAYOUTS_VERSION = "1.0.0";

/* The five fields a slide background may be. There is no sixth, and a
   layout may not invent one. */
export const DECK_FIELDS = ["sand", "white", "teal", "purple", "charcoal"];

export function fieldFor(bg) {
  if (!DECK_FIELDS.includes(bg)) throw new Error(`unknown field: ${bg}`);
  return fieldOf(bg);
}

function hexLuminance(hex) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  return luminance((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

/* Measure, don't assume. Returns the ratio so a caller can report it. */
export function assertLegible(bg) {
  const f = fieldFor(bg);
  const ratio = contrastRatio(hexLuminance(f.fg), hexLuminance(f.bg));
  if (ratio < 4.5) {
    throw new Error(`${f.fg} on ${f.bg} measures ${ratio.toFixed(2)}:1, below 4.5`);
  }
  return ratio;
}

/* A slide's inner HTML only. The .slide wrapper, its background and its
   scaling belong to buildDeck, so a layout never has to know how it is
   being displayed. All sizes are in the slide's own 1920x1080 space.

   A FIELD VALUE IS TEXT CONTENT, NEVER AN ATTRIBUTE VALUE.

   Writing title="<field>" or alt="<field>" is the tempting line, and it is
   the one to refuse. Deck Studio marks the gaps deckFrom left by fencing a
   field's value and rewriting the rendered string, so a field that reaches
   an attribute puts markup inside that attribute and the slide breaks
   quietly — no exception, no console. Only `slide.art.src` belongs in an
   attribute, and it is not a field. qa/deck-layouts.test.mjs enforces
   this against every layout. */

const PAD = 132;                     /* the deck's house margin */

function plusShapes(ctx, which, pos) {
  return "";
  /* Maximum three, rotation within 30 degrees, never near the type. The
     position is optional: without it a shape sits where layout 02 puts it. */
  const src = which === "purple" ? ctx.assets.plusPurple : ctx.assets.plusTeal;
  if (!src) return "";
  const p = pos || {};
  const box = [
    p.left   !== undefined ? `left:${p.left}px`     : "",
    p.right  !== undefined ? `right:${p.right}px`   : (p.left === undefined ? "right:-60px" : ""),
    p.top    !== undefined ? `top:${p.top}px`       : "",
    p.bottom !== undefined ? `bottom:${p.bottom}px` : (p.top === undefined ? "top:96px" : ""),
  ].filter(Boolean).join(";");
  const w = p.w || 340, rot = p.rot === undefined ? 14 : p.rot;
  return `<img src="${src}" alt="" style="position:absolute;${box};
    width:${w}px;transform:rotate(${rot}deg);pointer-events:none">`;
}

/* A brand colour the template names directly, where the slide's own field
   has no property for it (the three rules of layout 08, the dark half of
   13). Derived from the brand fields, never restated as a hex here. */
const swatch = id => fieldFor(id).bg;

/* Repeating structures are one multiline field. A row is "title | body";
   the pipe is optional and a row without one is all title. */
function rows(v, n) {
  return String(v || "").split("\n").map(s => s.trim()).filter(Boolean).slice(0, n);
}
function pair(row) {
  const i = row.indexOf("|");
  return i < 0 ? [row.trim(), ""] : [row.slice(0, i).trim(), row.slice(i + 1).trim()];
}

/* The template's eyebrow: 26px, 800, .10em, uppercase. */
function eyebrow(text, colour, e) {
  if (!text) return "";
  return `<div style="font-size:26px;font-weight:800;letter-spacing:.10em;
    text-transform:uppercase;color:${colour};margin-bottom:22px">${e(text)}</div>`;
}

/* A pill. The one filled shape a text slide is allowed. */
function pill(text, bg, fg, e) {
  if (!text) return "";
  return `<div style="margin-top:36px;display:inline-block;background:${bg};color:${fg};
    font-size:24px;font-weight:700;padding:20px 40px;border-radius:999px">${e(text)}</div>`;
}

export const LAYOUTS = [
  {
    id: "title-fullbleed", n: "01", label: "Title, full bleed", bg: "charcoal", art: "required",
    note: "The photograph carries the whole slide. The veil is a gradient off the bottom edge, never a box.",
    fields: [
      { k: "kicker",   label: "Kicker",   max: 40,  multiline: false },
      { k: "headline", label: "Headline", max: 70,  multiline: false },
      { k: "subline",  label: "Subline",  max: 120, multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc;
      /* 0.55 is a FIXED CONSTANT, not a measurement. No sampler exists in
         this branch: nothing anywhere reads the photograph's pixels, so
         `art.veil` is only ever whatever a caller happened to pass, and in
         practice that is this same constant. The consequence is real —
         112px white type over a bright photograph can fall below 4.5:1 and
         nothing here will notice, because qa/deck-lab.html reports text
         over an IMG as an *estimate* and never as a failure. A canvas
         sampler that raises the veil until the words clear 4.5:1 is still
         to be written. */
      const veil = Number.isFinite(slide.art && slide.art.veil) ? slide.art.veil : 0.55;
      const img = slide.art && slide.art.src
        ? `<img src="${e(slide.art.src)}" alt="" style="position:absolute;inset:0;
             width:100%;height:100%;object-fit:cover">` : "";
      return `${img}
        <div style="position:absolute;inset:0;background:linear-gradient(
          to top, rgba(0,0,0,${veil}) 0%, rgba(0,0,0,${veil * 0.75}) 38%, rgba(0,0,0,0) 72%)"></div>
        <div style="position:absolute;left:${PAD}px;right:${PAD}px;bottom:${PAD}px;color:#FFFFFF">
          ${f.kicker ? `<div style="font-size:30px;font-weight:700;letter-spacing:.06em;
             text-transform:uppercase;margin-bottom:26px;opacity:.85">${e(f.kicker)}</div>` : ""}
          <h1 style="margin:0;font-size:112px;line-height:1.02;font-weight:800;
             letter-spacing:-.02em">${e(f.headline)}</h1>
          ${f.subline ? `<p style="margin:28px 0 0;font-size:38px;line-height:1.4;
             max-width:1200px;opacity:.9">${e(f.subline)}</p>` : ""}
        </div>`;
    },
  },
  {
    id: "title-field", n: "02", label: "Title, colour field", bg: "sand", art: "none",
    note: "When there is no photograph worth the room. Space and hierarchy carry the slide.",
    fields: [
      { k: "kicker",   label: "Kicker",   max: 40,  multiline: false },
      { k: "headline", label: "Headline", max: 70,  multiline: false },
      { k: "subline",  label: "Subline",  max: 120, multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      return `${plusShapes(ctx, "teal")}
        <div style="position:absolute;left:${PAD}px;right:760px;bottom:${PAD}px;color:${c.fg}">
          ${f.kicker ? `<div style="font-size:30px;font-weight:700;letter-spacing:.06em;
             text-transform:uppercase;margin-bottom:26px;color:${c.soft}">${e(f.kicker)}</div>` : ""}
          <h1 style="margin:0;font-size:112px;line-height:1.02;font-weight:800;
             letter-spacing:-.02em">${e(f.headline)}</h1>
          ${f.subline ? `<p style="margin:28px 0 0;font-size:38px;line-height:1.4;
             color:${c.soft}">${e(f.subline)}</p>` : ""}
        </div>`;
    },
  },
  {
    id: "agenda", n: "03", label: "Agenda", bg: "sand", art: "none",
    note: "Numbers and hairlines do the structuring. No decorative glyphs stand in for content.",
    fields: [
      { k: "headline", label: "Headline", max: 50,  multiline: false },
      { k: "items",    label: "Items, one per line", max: 320, multiline: true },
    ],
    render(slide, ctx) {
      const e = ctx.esc, c = ctx.field;
      /* The row numerals recede, but they are type and they are read.
         opacity:.45 over the field's own ink measured 2.48:1 on sand, so
         they were a texture rather than a number. The field's declared
         soft ink is the recession the rest of the deck uses for secondary
         type and measures 5.09:1, clearing the template's own 5.0 rule
         for a faded mark. */
      const items = rows(slide.fields.items, 6);
      return `<div style="position:absolute;inset:${PAD}px;color:${c.fg}">
        <h2 style="margin:0 0 64px;font-size:64px;font-weight:800">${e(slide.fields.headline)}</h2>
        ${items.map((r, i) => `<div style="display:flex;gap:40px;align-items:baseline;
          padding:26px 0;border-top:1px solid ${c.fg}22">
          <span style="font-size:34px;font-weight:800;color:${c.soft};min-width:64px">
            ${String(i + 1).padStart(2, "0")}</span>
          <span style="font-size:44px;font-weight:700">${e(r)}</span>
        </div>`).join("")}
      </div>`;
    },
  },
  {
    id: "divider", n: "04", label: "Section divider", bg: "teal", art: "none",
    note: "A hard colour change is the punctuation of a deck. One accent field, one number, one line. Nothing else on it.",
    fields: [
      { k: "number",   label: "Section number", max: 4,  multiline: false },
      { k: "headline", label: "Section title",  max: 44, multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      return `${plusShapes(ctx, "purple", { right: -70, bottom: -80, w: 460, rot: 18 })}
        <div style="position:absolute;left:${PAD}px;right:620px;top:50%;
           transform:translateY(-50%);color:${c.fg}">
          ${f.number ? `<div style="font-size:180px;font-weight:800;line-height:.9;
             letter-spacing:-.02em;color:${c.soft}">${e(f.number)}</div>` : ""}
          <div style="font-size:88px;font-weight:800;line-height:1.06;
             margin-top:18px">${e(f.headline)}</div>
        </div>`;
    },
  },
  {
    id: "statement", n: "05", label: "Statement", bg: "sand", art: "none",
    note: "One sentence, nothing competing with it. The most useful slide in any deck and the one people skip.",
    fields: [{ k: "statement", label: "The sentence", max: 160, multiline: true }],
    render(slide, ctx) {
      const c = ctx.field;
      return `<div style="position:absolute;inset:${PAD}px;display:flex;align-items:center;color:${c.fg}">
        <p style="margin:0;font-size:88px;line-height:1.14;font-weight:800;
           letter-spacing:-.015em;max-width:1500px">${ctx.esc(slide.fields.statement)}</p>
      </div>`;
    },
  },
  {
    id: "split-photo-left", n: "06", label: "Split, photo left", bg: "sand", art: "required",
    note: "The workhorse. Hard edge, no rounding and no shadow. The photograph is cropped to the panel, not squeezed into it.",
    fields: [
      { k: "eyebrow",  label: "Eyebrow",  max: 30,  multiline: false },
      { k: "headline", label: "Headline", max: 90,  multiline: false },
      { k: "body",     label: "Body",     max: 180, multiline: true },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      const img = slide.art && slide.art.src
        ? `<img src="${e(slide.art.src)}" alt="" style="position:absolute;left:0;top:0;
             width:864px;height:1080px;object-fit:cover">` : "";
      return `${img}
        <div style="position:absolute;left:${864 + PAD}px;right:${PAD}px;top:50%;
           transform:translateY(-50%);color:${c.fg}">
          ${eyebrow(f.eyebrow, c.soft, e)}
          <div style="font-size:64px;font-weight:800;line-height:1.1">${e(f.headline)}</div>
          ${f.body ? `<div style="font-size:30px;font-weight:700;line-height:1.5;
             margin-top:30px;color:${c.soft}">${e(f.body)}</div>` : ""}
        </div>`;
    },
  },
  {
    id: "split-copy-left", n: "07", label: "Split, copy left", bg: "white", art: "none",
    note: "Mirror of 06, with room for a lead paragraph and one action. The button is the only filled shape a text slide is allowed.",
    fields: [
      { k: "eyebrow",  label: "Eyebrow",  max: 30,  multiline: false },
      { k: "headline", label: "Headline", max: 80,  multiline: false },
      { k: "body",     label: "Body",     max: 220, multiline: true },
      { k: "cta",      label: "Action",   max: 28,  multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      return `${plusShapes(ctx, "purple", { right: -80, bottom: -90, w: 380, rot: -18 })}
        <div style="position:absolute;left:${PAD}px;right:760px;top:50%;
           transform:translateY(-50%);color:${c.fg}">
          ${eyebrow(f.eyebrow, c.soft, e)}
          <div style="font-size:64px;font-weight:800;line-height:1.1">${e(f.headline)}</div>
          ${f.body ? `<div style="font-size:28px;font-weight:700;line-height:1.55;
             margin-top:30px;color:${c.soft}">${e(f.body)}</div>` : ""}
          ${pill(f.cta, c.fg, fieldFor("charcoal").fg, e)}
        </div>`;
    },
  },
  {
    id: "three-up", n: "08", label: "Three up", bg: "sand", art: "none",
    note: "A short rule above each column instead of an icon. The rule sits above the words, never behind them.",
    fields: [
      { k: "headline", label: "Headline", max: 60, multiline: false },
      { k: "columns",  label: "Up to three columns, one per line, \"Title | body\"", max: 300, multiline: true },
    ],
    render(slide, ctx) {
      const e = ctx.esc, c = ctx.field;
      /* Teal, purple, charcoal, in the template's own order. */
      const rules = [swatch("teal"), swatch("purple"), c.fg];
      const cols = rows(slide.fields.columns, 3);
      return `<div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${PAD}px;
         bottom:${PAD}px;display:flex;flex-direction:column;justify-content:center;color:${c.fg}">
        <div style="font-size:64px;font-weight:800;line-height:1.1;
           margin-bottom:72px">${e(slide.fields.headline)}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:64px">
          ${cols.map((row, i) => {
            const [title, body] = pair(row);
            return `<div>
              <div style="height:6px;background:${rules[i]};width:88px;margin-bottom:28px"></div>
              <div style="font-size:34px;font-weight:800;line-height:1.2;
                 margin-bottom:16px">${e(title)}</div>
              <div style="font-size:27px;font-weight:700;line-height:1.55;
                 color:${c.soft}">${e(body)}</div>
            </div>`;
          }).join("")}
        </div>
      </div>`;
    },
  },
  {
    id: "big-numbers", n: "09", label: "Big numbers", bg: "charcoal", art: "none",
    note: "Three at most. A fourth stops being a headline and becomes a table, and a table belongs on the comparison.",
    fields: [
      { k: "eyebrow",  label: "Eyebrow",  max: 30, multiline: false },
      { k: "headline", label: "Headline", max: 60, multiline: false },
      { k: "numbers",  label: "Up to three, one per line, \"3,4× | mehr Einladungen\"", max: 220, multiline: true },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      const items = rows(f.numbers, 3);
      return `<div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${PAD}px;
         bottom:${PAD}px;display:flex;flex-direction:column;justify-content:center;color:${c.fg}">
        ${eyebrow(f.eyebrow, c.accent, e)}
        <div style="font-size:56px;font-weight:800;line-height:1.12;
           margin-bottom:76px">${e(f.headline)}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:56px">
          ${items.map(row => {
            const [big, label] = pair(row);
            return `<div>
              <div style="font-size:132px;font-weight:800;line-height:.92;
                 letter-spacing:-.02em">${e(big)}</div>
              <div style="font-size:28px;font-weight:700;line-height:1.5;
                 margin-top:22px;color:${c.soft}">${e(label)}</div>
            </div>`;
          }).join("")}
        </div>
      </div>`;
    },
  },
  {
    id: "quote", n: "10", label: "Quote", bg: "purple", art: "none",
    note: "German quotation marks are set into the type rather than enlarged as a graphic.",
    fields: [
      { k: "quote", label: "The quote", max: 160, multiline: true },
      { k: "name",  label: "Name",      max: 30,  multiline: false },
      { k: "role",  label: "Role",      max: 50,  multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      const q = String(f.quote || "");
      return `${plusShapes(ctx, "teal", { right: -60, top: 150, w: 340, rot: -12 })}
        <div style="position:absolute;left:${PAD}px;right:520px;top:50%;
           transform:translateY(-50%);color:${c.fg}">
          <div style="font-size:64px;font-weight:800;line-height:1.22;
             letter-spacing:-.01em">${q ? `„${e(q)}“` : ""}</div>
          ${(f.name || f.role) ? `<div style="margin-top:48px">
            <div style="font-size:28px;font-weight:800">${e(f.name)}</div>
            <div style="font-size:24px;font-weight:700;color:${c.soft}">${e(f.role)}</div>
          </div>` : ""}
        </div>`;
    },
  },
  {
    id: "list", n: "11", label: "List", bg: "white", art: "none",
    note: "Check chips and hairlines keep the list structured without decorative bullets.",
    fields: [
      { k: "headline", label: "Headline", max: 40,  multiline: false },
      { k: "items",    label: "Up to six items, one per line", max: 320, multiline: true },
    ],
    render(slide, ctx) {
      const e = ctx.esc, c = ctx.field;
      const items = rows(slide.fields.items, 6);
      return `${plusShapes(ctx, "teal", { right: -70, bottom: -80, w: 400, rot: 16 })}
        <div style="position:absolute;left:${PAD}px;right:700px;top:${PAD}px;bottom:${PAD}px;
           display:flex;flex-direction:column;justify-content:center;color:${c.fg}">
          <div style="font-size:56px;font-weight:800;line-height:1.12;
             margin-bottom:48px">${e(slide.fields.headline)}</div>
          ${items.map(item => `<div style="display:flex;align-items:flex-start;gap:22px;
            padding:24px 0;border-bottom:1px solid ${c.fg}1F">
            <span style="flex:none;width:34px;height:34px;border-radius:999px;
              background:${c.accent};display:flex;align-items:center;justify-content:center;
              font-size:20px;font-weight:800;margin-top:3px">✓</span>
            <span style="font-size:30px;font-weight:700;line-height:1.45">${e(item)}</span>
          </div>`).join("")}
        </div>`;
    },
  },
  {
    id: "process", n: "12", label: "Process", bg: "sand", art: "none",
    note: "Four steps is the ceiling. The last marker turns accent so the eye knows where the story ends.",
    fields: [
      { k: "headline", label: "Headline", max: 50, multiline: false },
      { k: "steps",    label: "Up to four steps, one per line, \"Title | body\"", max: 320, multiline: true },
    ],
    render(slide, ctx) {
      const e = ctx.esc, c = ctx.field;
      const steps = rows(slide.fields.steps, 4);
      const last = steps.length - 1;
      return `<div style="position:absolute;left:${PAD}px;right:${PAD}px;top:50%;
         transform:translateY(-50%);color:${c.fg}">
        <div style="font-size:56px;font-weight:800;line-height:1.12;
           margin-bottom:72px">${e(slide.fields.headline)}</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:44px;position:relative">
          <div style="position:absolute;left:0;right:0;top:27px;height:2px;
             background:${c.fg}29"></div>
          ${steps.map((row, i) => {
            const [title, body] = pair(row);
            const done = i === last;
            const markerBg = done ? c.accent : c.fg;
            const markerFg = done ? c.fg : fieldFor("charcoal").fg;
            return `<div style="position:relative">
              <div style="width:56px;height:56px;border-radius:999px;background:${markerBg};
                color:${markerFg};display:flex;align-items:center;justify-content:center;
                font-size:26px;font-weight:800;margin-bottom:28px">${i + 1}</div>
              <div style="font-size:30px;font-weight:800;margin-bottom:12px">${e(title)}</div>
              <div style="font-size:27px;font-weight:700;line-height:1.5;
                 color:${c.soft}">${e(body)}</div>
            </div>`;
          }).join("")}
        </div>
      </div>`;
    },
  },
  {
    id: "comparison", n: "13", label: "Comparison", bg: "white", art: "none",
    note: "A straight 50/50 with the colour doing the arguing. No arrows between the halves and no red and green.",
    fields: [
      { k: "leftEyebrow",   label: "Left eyebrow",  max: 24,  multiline: false },
      { k: "leftHeadline",  label: "Left headline", max: 40,  multiline: false },
      { k: "leftBody",      label: "Left body",     max: 160, multiline: true },
      { k: "rightEyebrow",  label: "Right eyebrow", max: 24,  multiline: false },
      { k: "rightHeadline", label: "Right headline",max: 40,  multiline: false },
      { k: "rightBody",     label: "Right body",    max: 160, multiline: true },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      const dark = fieldFor("charcoal");
      const half = (side, eb, hl, body, ebColour, fg, soft, bg) =>
        `<div style="position:absolute;${side}:0;top:0;width:960px;height:1080px;
           background:${bg};color:${fg};padding:${PAD}px ${side === "left" ? `72px ${PAD}px ${PAD}px` : `${PAD}px ${PAD}px 72px`};
           box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;overflow:hidden">
          ${eyebrow(eb, ebColour, e)}
          <div style="font-size:44px;font-weight:800;line-height:1.16;
             margin-bottom:38px">${e(hl)}</div>
          <div style="font-size:28px;font-weight:700;line-height:1.6;color:${soft}">${e(body)}</div>
          ${side === "right" ? plusShapes(ctx, "teal", { right: -50, bottom: -60, w: 260, rot: 20 }) : ""}
        </div>`;
      return half("left", f.leftEyebrow, f.leftHeadline, f.leftBody, c.soft, c.fg, c.soft, c.bg)
           + half("right", f.rightEyebrow, f.rightHeadline, f.rightBody, dark.accent, dark.fg, dark.soft, dark.bg);
    },
  },
  {
    id: "product-ui", n: "14", label: "Product UI", bg: "teal", art: "required",
    note: "The screen sits in a neutral white card on an accent field, so the interface reads as itself and not as part of the slide.",
    fields: [
      { k: "eyebrow",  label: "Eyebrow",  max: 30,  multiline: false },
      { k: "headline", label: "Headline", max: 60,  multiline: false },
      { k: "body",     label: "Body",     max: 160, multiline: true },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      const shot = slide.art && slide.art.src
        ? `<img src="${e(slide.art.src)}" alt="" style="position:absolute;inset:0;
             width:100%;height:100%;object-fit:cover;object-position:top center">`
        /* Without a screenshot the card holds its own wireframe, so the
           slide still reads. The greys are the card's own chrome, drawn
           from the charcoal type colour, not from a sixth brand colour. */
        : `<div style="position:absolute;inset:0;padding:32px;box-sizing:border-box;
             display:flex;flex-direction:column;gap:22px">
             <div style="height:52px;border-radius:12px;background:${c.fg}0F;flex:none"></div>
             <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;
               grid-template-rows:1fr 1fr;gap:22px">
               ${Array(4).fill(`<div style="border-radius:14px;background:${c.fg}0F"></div>`).join("")}
             </div>
           </div>`;
      return `<div style="position:absolute;left:${PAD}px;right:1000px;top:50%;
         transform:translateY(-50%);color:${c.fg}">
          ${eyebrow(f.eyebrow, c.soft, e)}
          <div style="font-size:56px;font-weight:800;line-height:1.12">${e(f.headline)}</div>
          ${f.body ? `<div style="font-size:28px;font-weight:700;line-height:1.55;
             margin-top:28px;color:${c.soft}">${e(f.body)}</div>` : ""}
        </div>
        <div style="position:absolute;right:${PAD}px;top:${PAD}px;bottom:${PAD}px;width:800px;
          background:${swatch("white")};border-radius:28px;
          box-shadow:0 24px 60px ${c.fg}38;overflow:hidden">${shot}</div>`;
    },
  },
  {
    id: "fullbleed-copy", n: "15", label: "Full bleed with copy", bg: "charcoal", art: "required",
    note: "A photograph may fill the slide as long as the words still clear 4.5:1. The gradient runs off the left edge and dies before the middle.",
    fields: [
      { k: "eyebrow",  label: "Eyebrow",  max: 30,  multiline: false },
      { k: "headline", label: "Headline", max: 80,  multiline: false },
      { k: "body",     label: "Body",     max: 160, multiline: true },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      /* Same fixed 0.55 as layout 01, and the same caveat: it is a
         constant, not a sampled value. There is no canvas sampler in this
         branch, so the note above ("as long as the words still clear
         4.5:1") is an intention the code does not yet enforce — over a
         bright photograph this text may measure below 4.5:1, and the lab
         will pass it because it can only estimate text over an IMG. */
      const veil = Number.isFinite(slide.art && slide.art.veil) ? slide.art.veil : 0.55;
      const img = slide.art && slide.art.src
        ? `<img src="${e(slide.art.src)}" alt="" style="position:absolute;inset:0;
             width:100%;height:100%;object-fit:cover">` : "";
      /* White type over a veiled photograph: the one sanctioned literal. */
      return `${img}
        <div style="position:absolute;inset:0;background:linear-gradient(to right,
          rgba(0,0,0,${veil}) 0%, rgba(0,0,0,${veil}) 48%,
          rgba(0,0,0,${veil * 0.45}) 68%, rgba(0,0,0,0) 86%)"></div>
        <div style="position:absolute;left:${PAD}px;right:1060px;top:50%;
           transform:translateY(-50%);color:#FFFFFF">
          ${eyebrow(f.eyebrow, c.accent, e)}
          <div style="font-size:56px;font-weight:800;line-height:1.14">${e(f.headline)}</div>
          ${f.body ? `<div style="font-size:28px;font-weight:700;line-height:1.55;
             margin-top:28px;opacity:.8">${e(f.body)}</div>` : ""}
        </div>`;
    },
  },
  {
    id: "closing", n: "16", label: "Closing", bg: "charcoal", art: "none",
    note: "The ask, in one line, with the next step attached to it. Never a thank-you slide with nothing on it.",
    fields: [
      { k: "headline", label: "The ask",    max: 70,  multiline: false },
      { k: "next",     label: "Next step",  max: 140, multiline: true },
      { k: "contact",  label: "Contact",    max: 40,  multiline: false },
    ],
    render(slide, ctx) {
      const f = slide.fields, e = ctx.esc, c = ctx.field;
      return `${plusShapes(ctx, "teal", { left: -70, bottom: -90, w: 380, rot: -18 })}
        ${plusShapes(ctx, "purple", { right: 120, top: -60, w: 250, rot: 24 })}
        <div style="position:absolute;left:${PAD}px;right:520px;top:50%;
           transform:translateY(-50%);color:${c.fg}">
          <div style="font-size:88px;font-weight:800;line-height:1.08;
             letter-spacing:-.015em">${e(f.headline)}</div>
          ${f.next ? `<div style="font-size:28px;font-weight:700;line-height:1.5;
             margin-top:32px;color:${c.soft}">${e(f.next)}</div>` : ""}
          ${pill(f.contact, c.accent, fieldFor("teal").fg, e)}
        </div>`;
    },
  },
];

export function layoutById(id) {
  const l = LAYOUTS.find(x => x.id === id);
  if (!l) throw new Error(`unknown layout: ${id}`);
  return l;
}
