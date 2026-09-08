/* =====================================================================
   PROFESSIONALS AD ENGINE
   The renderer behind the Concept Studio. One module, imported by the
   Studio and by qa/render-lab.html, so what you test is what ships.

   Three ideas hold the whole thing up.

   1. TYPE IS SIZED FROM THE CANVAS, NEVER FROM A LEFTOVER BOX.
      A headline on a 1200x1200 feed post and a headline on a 320x50
      banner are the same design decision at two scales. The engine
      computes one ideal size from the canvas with a sub-linear law,
      then flexes the LAYOUT to hold it. The old engine did the reverse,
      which is why some files came out cramped and others came out lost
      in whitespace.

   2. MEASURE, THEN PLACE.
      Nothing is drawn hopefully. The copy stack is measured with real
      glyph metrics first, the panel is sized around it, and only then
      does anything reach the canvas. Every mark reports its exact ink
      box, so safe-zone compliance is arithmetic, not a claim.

   3. EVERY SAFETY ZONE PROTECTS THE OUTPUT.
      Platform interface strips and studio crop guides have different
      sources, but essential content stays inside both. Anything outside
      either boundary is held before export.

   Everything customer facing stays German. This file is English.
   ===================================================================== */

import { lookupSafeZone, SAFE_ZONE_VERSION } from "./safe-zones.js";
import approvedTokens from "./brand-tokens.json" with { type: "json" };
/* The one sentence about an enlarged file, imported rather than written
   again here. This is a cycle on paper — studio-facts.js reads this file's
   tables — and it is safe in practice because neither side touches the
   other at module-evaluation time: every use is inside a function body. */
import { fileEnlargement } from "./studio-facts.js";

export const COLORS = {
  teal: "#3DF5DC", blue: "#24E3FF", charcoal: "#333333",
  white: "#FFFFFF", sand: "#FBF8F6",
};

export const BRAND = {
  logoMinPx: 24,          /* brand minimum height for any logo lockup */
  plusMaxPerComposition: 3,
  plusMaxRotation: 30,
};

/* These are application roles, not a second token catalogue. Supporting
   advertising copy uses the approved body role; Extra Bold is for page H1s. */
export const ASSET_TYPE_ROLES = Object.freeze({
  headline: Object.freeze({
    role: "display", family: approvedTokens.fontFamily.headline.$value,
    weight: approvedTokens.fontWeight.display.$value,
    minPx: parseFloat(approvedTokens.fontSize.minimumAdHeadline.$value),
    lineHeight: approvedTokens.lineHeight.displayMin.$value,
    smallLineHeight: approvedTokens.lineHeight.displayMax.$value,
  }),
  subline: Object.freeze({
    role: "body", family: approvedTokens.fontFamily.body.$value,
    weight: approvedTokens.fontWeight.body.$value,
    minPx: parseFloat(approvedTokens.fontSize.minimumAdBody.$value),
    lineHeight: approvedTokens.lineHeight.body.$value,
  }),
  cta: Object.freeze({
    role: "caption", family: approvedTokens.fontFamily.body.$value,
    weight: approvedTokens.fontWeight.caption.$value,
    minPx: parseFloat(approvedTokens.fontSize.minimumAdBody.$value),
  }),
  kicker: Object.freeze({
    role: "caption", family: approvedTokens.fontFamily.body.$value,
    weight: approvedTokens.fontWeight.caption.$value,
    minPx: parseFloat(approvedTokens.fontSize.minimumAdBody.$value),
    lineHeight: approvedTokens.lineHeight.displayMax.$value,
  }),
});

export const ENGINE_VERSION = "2.6.0";

export const BRAND_CLAIM = "Mehr Möglichkeiten. Mehr Erfolg. Mehr für Sie.";
export function isBrandClaim(value) {
  return String(value || "").replace(/\s+/g, " ").trim() === BRAND_CLAIM;
}

/* WCAG 2.2 AA for normal text. Large bold display type is allowed 3:1 by the
   standard, but the whole set is held to 4.5:1 so the promise is one number
   and it holds for the subline and the legal line as well as the headline. */
export const WCAG_AA = 4.5;

/* WHEN TWO SHAPES COUNT AS THE SAME SHAPE. 16:9 against 1.91:1 is 4%
   apart and the preset file instructs that they are one family, so the
   line sits above that. Read in three places and it must be one number in
   all three: the adapter uses it to spot a placement filed under a family
   it does not match, `pickImg` below uses it to decide whether a family's
   master is the right picture to draw into a given box, and `masterFor` in
   the Studio uses it to decide whether to hand that master over at all.

   IT WAS TWO NUMBERS. This file called it MASTER_FIT and size-adapter
   called it ASPECT_TOLERANCE, each deferring to the other in its own
   comment and neither importing anything — so the Studio could hand a
   master to a canvas this engine then declined to draw it into, the moment
   one of them moved. One name, authored once. */
export const ASPECT_TOLERANCE = 0.08;

/* WHERE A PHOTOGRAPH STARTS LOOKING SOFT, authored once and read by both
   files. This engine's own upscale warning carried the number as a bare
   literal, while size-adapter's SOFT_UPSCALE said, in as many words, that it was
   "borrowed from ad-engine's own upscale warning so one build cannot call
   the same file soft in one place and fine in another" — and nothing bound
   them. They agreed by coincidence.

   It is authored HERE because `analyzeImage` and `bestFocal` live here and
   size-adapter is built on them, so this is the lower file of the two;
   size-adapter re-exports both constants under their existing names, and
   every other reader is unchanged. This file's own comparison against it is
   gone: `finish` hands the measurement to `fileEnlargement` and pushes the
   sentence it gets back, so the boundary is applied in one place. */
export const SOFT_UPSCALE = 1.45;
export const MIN_PHOTO_RETAINED = 0.25;

/* ---------------------------------------------------------------------
   Palettes. The field colour decides the type colour and which logo file
   to use, so a composition can never end up with charcoal type on charcoal.
   --------------------------------------------------------------------- */
export const BAND_CHOICES = [
  { id: "sand",     bg: COLORS.sand,     fg: COLORS.charcoal, logo: "",       accent: COLORS.teal,   label: "Sand" },
  { id: "white",    bg: COLORS.white,    fg: COLORS.charcoal, logo: "",       accent: COLORS.blue, label: "White" },
  { id: "teal",     bg: COLORS.teal,     fg: COLORS.charcoal, logo: "",       accent: COLORS.sand, label: "Brand Teal" },
  { id: "charcoal", bg: COLORS.charcoal, fg: COLORS.white,    logo: "-inverse", accent: COLORS.teal, label: "Charcoal" },
];

/* A colour choice is an intent, not permission to create an unreadable
   control. Resolve the button as one unit: field contrast first, then its
   text. The returned colours are all approved brand colours. */
export function resolveAssetPalette(band, requestedCtaBg) {
  const b = band || BAND_CHOICES[0];
  let bg = requestedCtaBg || (b.id === "charcoal" ? COLORS.blue : COLORS.charcoal);
  const tooClose = contrastRatio(hexL(bg), hexL(b.bg)) < 3;
  const tealBlue = (b.bg === COLORS.teal && bg === COLORS.blue)
    || (b.bg === COLORS.blue && bg === COLORS.teal);
  if (tooClose || tealBlue) bg = b.id === "charcoal" ? COLORS.blue : COLORS.charcoal;
  const dark = contrastRatio(hexL(COLORS.charcoal), hexL(bg));
  const light = contrastRatio(hexL(COLORS.white), hexL(bg));
  return { band: b, ctaBg: bg, ctaFg: dark >= light ? COLORS.charcoal : COLORS.white,
    adjusted: bg !== requestedCtaBg };
}

export const VARIANTS = [
  { id: "clean", label: "Image only",   logo: false, copy: false },
  { id: "logo",  label: "Logo only",    logo: true,  copy: false },
  { id: "copy",  label: "Copy only",    logo: false, copy: true  },
  { id: "full",  label: "Logo and copy", logo: true, copy: true  },
];

export const LOGO_FILES = {
  "Professionals": "logo-professionals",
};
/* The stacked mark is the default. Small banners use the horizontal master
   only when the stacked logo cannot meet its approved minimum size. */
const COMPACT_LOGO = "logo-professionals-horizontal";

/* ---------------------------------------------------------------------
   Text policy. Only two of these are actual platform rules; the rest are
   advice, usually because the platform renders its own headline beside
   the image. Advice is surfaced, not enforced.
   --------------------------------------------------------------------- */
const NO_TEXT = new Set(["forbidden", "no_baked_text"]);
const LOGO_ONLY = new Set(["logo_only"]);
export const ADVISORY = new Set(["discouraged", "forbidden_in_practice"]);

export function allowedVariants(policy, forceCopy) {
  if (NO_TEXT.has(policy) && !forceCopy) return ["clean"];
  if (LOGO_ONLY.has(policy)) return ["clean", "logo"];
  return ["clean", "logo", "copy", "full"];
}

/* THE OTHER HALF OF THE SAME RULE, AND IT WAS MISSING.
   `allowedVariants` withholds three of the four on a landing page hero,
   because the H1 is live HTML there and baking it into the picture is the
   defect rather than the feature. That is correct and it was also SILENT:
   step 3's header promised four variants for every placement, the build
   composed one, and the accounting afterwards — which names every file the
   format guard withholds, with the reason — said nothing at all. Nine files
   a person had been promised were absent from the ZIP and absent from the
   report.

   So the withholding is now a fact with a name and a sentence, derived here
   beside the rule it belongs to and read by both counters: `plannedBuild`
   before the build, and the build loop after it, which files one blocked
   row per withheld variant exactly as it does for a placement that takes no
   still image. One rule, one reason, two surfaces that cannot disagree.

   The reason carries no placement name in it: `buildFacts` groups blocked
   rows BY REASON and names the placements each reason cost, so a sentence
   that named one placement would produce one line per placement instead of
   one line per rule.

   `takes` is the same rule at the length a one-line count can hold — the
   object of "this placement takes …" — so the bar before the build and the
   card after it state one rule rather than two paraphrases of it. */
export function withheldVariants(policy, forceCopy) {
  const allowed = allowedVariants(policy, forceCopy);
  const ids = VARIANTS.map(v => v.id).filter(id => !allowed.includes(id));
  if (!ids.length) return null;
  return NO_TEXT.has(policy)
    ? {
      ids,
      takes: "nothing baked into the image",
      reason: "This placement takes nothing baked into the image: its headline is live text set beside the picture, so only the image-only variant is built.",
    }
    : {
      ids,
      takes: "the logo and nothing else",
      reason: "This placement takes the logo and nothing else, so the variants carrying copy are not built.",
    };
}
export function policyNote(policy) {
  if (policy === "forbidden_in_practice")
    return "This platform renders its own headline next to the image, so baked copy can read as duplicated. Text variants are built, use them knowingly.";
  if (policy === "discouraged") return "The platform discourages baked text here.";
  if (NO_TEXT.has(policy)) return "The platform forbids baked text here.";
  return null;
}

/* ---------------------------------------------------------------------
   Asset loading
   --------------------------------------------------------------------- */
/* Assets resolve against this module, not against whatever page imported it,
   so the QA lab in a subfolder loads exactly the same files as the Studio. */
const ASSET_BASE = new URL("./", import.meta.url);
export function assetUrl(path) {
  return /^(https?:|data:|blob:|\/)/.test(path) ? path : new URL(path, ASSET_BASE).href;
}

const imgCache = new Map();
const MAX_CACHED_IMAGES = 48;
export function loadImg(src) {
  const url = assetUrl(src);
  if (imgCache.has(url)) {
    const cached = imgCache.get(url);
    imgCache.delete(url); imgCache.set(url, cached);
    return cached;
  }
  const p = new Promise((res, rej) => {
    const i = new Image();
    const label = /^(data:|blob:)/.test(url) ? "the selected image" : String(src).split("?")[0];
    const timeout = setTimeout(() => {
      i.onload = null; i.onerror = null;
      i.src = "";
      rej(new Error("Image loading timed out for " + label + ". Try selecting it again."));
    }, 15000);
    i.crossOrigin = "anonymous";
    i.onload = () => { clearTimeout(timeout); res(i); };
    i.onerror = () => { clearTimeout(timeout); rej(new Error("Could not load " + label + ". Try selecting it again.")); };
    i.src = url;
  });
  imgCache.set(url, p);
  p.catch(() => { if (imgCache.get(url) === p) imgCache.delete(url); });
  while (imgCache.size > MAX_CACHED_IMAGES) imgCache.delete(imgCache.keys().next().value);
  return p;
}

/* A missing colourway must not take the whole build down. Fall back to the
   charcoal artwork, and say so, rather than throwing on one placement. */
async function loadLogo(key, suffix, notes) {
  const professional = key === "logo-professionals" || key === "logo-professionals-horizontal";
  const orientation = key === "logo-professionals-horizontal" ? "horizontal" : "vertical";
  const canonical = professional
    ? (suffix === "-inverse"
      ? `assets/logos/immoscout24-${orientation}-inverse.svg`
      : suffix === "-white"
        ? `assets/logos/immoscout24-${orientation}-white.svg`
        : `assets/logos/immoscout24-${orientation}.svg`)
    : `assets/${key}${suffix || ""}.svg`;
  if (!suffix || professional) return loadImg(canonical);
  try {
    return await loadImg(canonical);
  } catch (e) {
    if (notes) notes.push({ level: "warn", text: `The requested logo colourway is unavailable, so the standard artwork is used. Check contrast before export.` });
    return loadImg(`assets/${key}.svg`);
  }
}

let fontsReady = null;
export function preloadFonts() {
  if (fontsReady) return fontsReady;
  fontsReady = (async () => {
    try {
      const faces = await Promise.all([
        document.fonts.load('800 64px "Make It Better"'),
        document.fonts.load('700 32px "Make It Better"'),
        document.fonts.load('400 32px "Make It Better"'),
      ]);
      await document.fonts.ready;
      if (faces.some(group => !group.length || group.some(face => face.status !== "loaded"))) {
        throw new Error("The Make It Better font is not available.");
      }
    } catch (e) {
      fontsReady = null;
      throw new Error("The brand font could not be loaded. Reload the Studio before building assets.");
    }
  })();
  return fontsReady;
}

/* =====================================================================
   1. THE SCALE
   One law for the whole size ladder. Type does not scale linearly with
   the canvas, it scales sub-linearly: a banner needs proportionally
   bigger type than a poster or it disappears, and a poster needs
   proportionally smaller type than a banner or it shouts.

   idealHeadline = 0.472 * ref^0.753,  ref = sqrt(w*h)

   Calibrated so 320x50 lands near 15px, 300x250 near 32px, 1200x1200
   near 98px, 1440x1800 near 123px and 2560x1440 near 140px. Those are
   the sizes a designer would have set by hand.
   ===================================================================== */
export function tokens(w, h, safe) {
  /* Scale from the box the design actually lives in. On a Reels frame the
     platform owns 35% of the height, so a headline sized from the full
     canvas comes out a third too big and pushes the photograph down to a
     sliver. Only a HARD zone shrinks the reference: a house margin does not
     change how big the frame feels, because you can still see all of it. */
  const hard = safe && safe.kind === "hard";
  const uw = hard ? Math.max(40, w - safe.left - safe.right) : w;
  const uh = hard ? Math.max(40, h - safe.top - safe.bottom) : h;
  const ref = Math.sqrt(uw * uh);
  const short = Math.min(uw, uh);
  let ideal = 0.440 * Math.pow(ref, 0.753);
  /* A very flat canvas cannot carry type sized from its area alone. */
  ideal = Math.min(ideal, short * 0.26);
  ideal = Math.max(ideal, ASSET_TYPE_ROLES.headline.minPx);

  const pad = Math.max(8, Math.round(ideal * 0.62));
  return {
    ref, short, ideal: Math.round(ideal),
    floor: Math.max(ASSET_TYPE_ROLES.headline.minPx, Math.round(ideal * 0.55)),
    pad,
    gutter: Math.round(pad * 1.15),
    radius: Math.round(ref * 0.028),
    hairline: Math.max(1, Math.round(ref * 0.0022)),
    /* Ratio ladder, all relative to the headline. */
    sublineRatio: 0.435,
    /* The button carries the click. At 0.355 it read as a footnote under a
       headline three times its size; the gap between them is now a step, not
       a cliff. */
    ctaRatio: 0.440,
    kickerRatio: 0.255,
  };
}

/* Aspect classes. Every style has designed geometry for each of these, so
   no size ever produces "this layout does not work here". */
export function ratioClass(w, h) {
  const ar = w / h;
  if (Math.min(w, h) < 130 || ar >= 3.0 || ar <= 0.34) return "banner";
  if (ar >= 1.45) return "wide";
  if (ar >= 0.86) return "square";
  if (ar >= 0.62) return "tall";
  return "story";
}

/* =====================================================================
   2. TEXT MEASUREMENT AND THE JOINT FIT
   ===================================================================== */

/* Tracking has to move with size or the type stops looking like one family:
   small type wants to open up, display type wants to close in. The curve is
   the standard logarithmic one, clamped so it never becomes a mannerism. */
const SUPPORTS_TRACKING = typeof CanvasRenderingContext2D !== "undefined" &&
  "letterSpacing" in CanvasRenderingContext2D.prototype;
function trackingEm(px) {
  return Math.max(-0.03, Math.min(0.04, 0.0686 - 0.01955 * Math.log(px)));
}
function setFont(ctx, weight, px, family = ASSET_TYPE_ROLES.headline.family) {
  ctx.font = `${weight} ${px}px "${family}"`;
  if (SUPPORTS_TRACKING) ctx.letterSpacing = (trackingEm(px) * px).toFixed(2) + "px";
}

function measureLine(ctx, text) {
  const m = ctx.measureText(text);
  return {
    w: m.width,
    asc: m.actualBoundingBoxAscent || 0,
    desc: m.actualBoundingBoxDescent || 0,
  };
}

/* Words stay intact. A requested emphasis phrase is also kept together when
   it matches complete words. A phrase that cannot fit makes the fit fail. */
function splitTokens(text, emphasis) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const phrase = String(emphasis || "").trim().split(/\s+/).filter(Boolean);
  if (phrase.length > 1) {
    const at = words.findIndex((word, index) => phrase.every((part, offset) => words[index + offset] === part));
    if (at >= 0) words.splice(at, phrase.length, phrase.join(" "));
  }
  return words;
}

function wrap(ctx, text, maxW, emphasis) {
  const toks = splitTokens(text, emphasis);
  const lines = [];
  lines.broke = false;
  let cur = "";
  for (const t of toks) {
    const test = cur ? cur + " " + t : t;
    if (cur && ctx.measureText(test).width > maxW) { lines.push(cur); cur = t; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function blockAt(ctx, text, weight, px, maxW, lhRatio, emphasis, role) {
  setFont(ctx, weight, px, role && role.family);
  const raw = wrap(ctx, text, maxW, emphasis);
  const lines = raw.map(t => ({ t, ...measureLine(ctx, t) }));
  lines.broke = raw.broke;
  const lh = px * lhRatio;
  const widest = lines.reduce((m, l) => Math.max(m, l.w), 0);
  const first = lines[0] || { asc: px * 0.72, desc: px * 0.2 };
  const last = lines[lines.length - 1] || first;
  return {
    px, lh, lines, widest, broke: !!lines.broke,
    weight, role: role ? role.role : null, minPx: role ? role.minPx : null,
    h: lines.length ? first.asc + (lines.length - 1) * lh + last.desc : 0,
    firstAsc: first.asc,
  };
}

/* The joint fit. One scale parameter drives the whole stack, so the
   headline, subline and CTA always look like one decision. We search
   downward from the canvas ideal and stop at the first size where the
   whole block fits the column and the height it has been given. */
export function fitStack(ctx, content, colW, maxH, tk, opts) {
  const o = opts || {};
  if (!Number.isFinite(colW) || !Number.isFinite(maxH) || colW <= 0 || maxH <= 0) return null;
  const wantSub = o.subline !== false && !!content.subline;
  const wantCta = o.cta !== false && !!content.cta;
  const wantKicker = !!o.kicker && !!content.kicker;
  const maxLines = o.maxLines || 3;
  const roles = ASSET_TYPE_ROLES;
  /* An option may ask for larger type, which is the whole point of the
     typographic style. Capped so it can never run away from the scale. */
  const startPx = Math.max(roles.headline.minPx, Math.min(Math.round(o.startPx || tk.ideal), Math.round(tk.ideal * 1.5)));
  const floorPx = Math.max(o.floorPx || tk.floor, roles.headline.minPx);

  /* Measure, in characters per line. Display type reads best between 20 and
     40 characters; a headline set across a 2560px hero would run to 70 and
     stop being a headline. The column is capped at the type's own scale, so
     the cap moves with the size rather than being a fixed pixel width. */
  const maxCPL = o.maxCPL || 36;

  /* Complete content gets every acceptable size before supporting copy can
     be omitted. An unfittable CTA never turns into a successful silent drop. */
  const passes = wantSub && !o.sublineRequired ? [true, false] : [wantSub];
  for (const includeSub of passes) {
    for (let px = startPx; px >= floorPx; px = Math.max(floorPx, Math.round(px * 0.94)) - (px <= floorPx ? 1 : 0)) {
      const hlLh = px >= parseFloat(approvedTokens.fontSize.headlineMin.$value)
        ? roles.headline.lineHeight : roles.headline.smallLineHeight;
      setFont(ctx, roles.headline.weight, px, roles.headline.family);
      const text = String(content.headline || "");
      const avgChar = ctx.measureText(text).width / Math.max(1, text.length);
      const effW = Math.min(colW, Math.max(px * 4.5, avgChar * maxCPL));
      const hl = blockAt(ctx, text, roles.headline.weight, px, effW, hlLh,
        o.emphasis || content.emphasis, roles.headline);
      if (hl.lines.length > maxLines || hl.widest > effW) continue;

      let total = hl.h, sub = null, cta = null, kicker = null;
      const gapSub = px * 0.46, gapCta = px * 0.66, gapKicker = px * 0.40;
      if (wantKicker) {
        const kpx = Math.max(roles.kicker.minPx, Math.round(px * tk.kickerRatio));
        kicker = blockAt(ctx, content.kicker, roles.kicker.weight, kpx, colW,
          roles.kicker.lineHeight, null, roles.kicker);
        if (kicker.lines.length > 1 || kicker.widest > colW) kicker = null;
        else total += kicker.h + gapKicker;
      }
      if (includeSub) {
        const spx = Math.max(roles.subline.minPx, Math.round(px * tk.sublineRatio));
        sub = blockAt(ctx, content.subline, roles.subline.weight, spx, Math.min(colW, effW * 1.12),
          roles.subline.lineHeight, null, roles.subline);
        if (sub.lines.length > (o.sublineLines || 2) || sub.widest > colW) continue;
        total += gapSub + sub.h;
      }
      if (wantCta) {
        const cpx = Math.max(roles.cta.minPx, Math.round(px * tk.ctaRatio));
        setFont(ctx, roles.cta.weight, cpx, roles.cta.family);
        const m = measureLine(ctx, content.cta);
        const cw = Math.ceil(m.w + cpx * 2.5), ch = Math.ceil(cpx * 2.5);
        if (cw > colW) continue;
        cta = { px: cpx, w: cw, h: ch, text: content.cta, asc: m.asc,
          weight: roles.cta.weight, role: roles.cta.role, minPx: roles.cta.minPx };
        total += gapCta + ch;
      }
      if (total <= maxH) {
        const stackW = Math.max(effW, sub ? sub.widest : 0, cta ? cta.w : 0, kicker ? kicker.widest : 0);
        return buildStack({ hl, sub, cta, kicker, gapSub, gapCta, gapKicker, total, px,
          colW: stackW, align: o.align, tk, droppedSub: wantSub && !sub, droppedCta: false,
          fitMode: wantSub && !sub ? "without-subline" : "complete" });
      }
    }
  }
  return null;
}

function buildStack(s) {
  const { hl, sub, cta, kicker, gapSub, gapCta, gapKicker } = s;
  const centred = s.align === "center";
  const ax = (x, lineW) => centred ? x + Math.round((s.colW - lineW) / 2) : x;
  return {
    h: s.total, headlinePx: s.px, colW: s.colW, align: s.align,
    droppedSub: !!s.droppedSub, droppedCta: !!s.droppedCta,
    fitMode: s.fitMode,
    lineCount: hl.lines.length,
    measureChars: Math.round(hl.lines.reduce((a, l) => a + l.t.length, 0) / Math.max(1, hl.lines.length)),
    parts: { hl, sub, cta, kicker },
    gaps: { sub: gapSub, cta: gapCta, kicker: gapKicker },
    /* Draw at a top-left origin. Cap height sits flush with y, which is
       what makes a block of display type look aligned to its container. */
    draw(ctx, x, y, C, ink) {
      let cy = y;
      const fgc = C.fg;
      if (kicker) {
        setFont(ctx, kicker.weight, kicker.px, ASSET_TYPE_ROLES.kicker.family);
        ctx.fillStyle = C.accentInk || C.fg;
        ctx.globalAlpha = 0.9;
        let by = cy + kicker.firstAsc;
        for (const l of kicker.lines) {
          const lx = ax(x, l.w);
          ctx.fillText(l.t, lx, by);
          ink(lx, by - l.asc, l.w, l.asc + l.desc, C.accentInk || fgc);
          by += kicker.lh;
        }
        ctx.globalAlpha = 1;
        cy += kicker.h + gapKicker;
      }
      setFont(ctx, hl.weight, hl.px, ASSET_TYPE_ROLES.headline.family);
      let by = cy + hl.firstAsc;
      for (let i = 0; i < hl.lines.length; i++) {
        const l = hl.lines[i];
        const lineColour = C.headlineLineColours && C.headlineLineColours[i]
          ? C.headlineLineColours[i] : C.fg;
        const lx = ax(x, l.w);
        const run = C.headlineRuns && C.headlineRuns[i];
        if (run && Number.isInteger(run.start) && Number.isInteger(run.end)
            && run.start >= 0 && run.end > run.start && run.end <= l.t.length) {
          const segments = [
            { start: 0, end: run.start, colour: C.fg },
            { start: run.start, end: run.end, colour: run.colour },
            { start: run.end, end: l.t.length, colour: C.fg },
          ];
          for (const segment of segments) {
            const text = l.t.slice(segment.start, segment.end);
            if (!text) continue;
            const sx = lx + measureLine(ctx, l.t.slice(0, segment.start)).w;
            const metrics = measureLine(ctx, text);
            ctx.fillStyle = segment.colour;
            ctx.fillText(text, sx, by);
            ink(sx, by - metrics.asc, metrics.w, metrics.asc + metrics.desc, segment.colour);
          }
        } else {
          ctx.fillStyle = lineColour;
          ctx.fillText(l.t, lx, by);
          ink(lx, by - l.asc, l.w, l.asc + l.desc, lineColour);
        }
        by += hl.lh;
      }
      cy += hl.h;
      if (sub) {
        cy += gapSub;
        setFont(ctx, sub.weight, sub.px, ASSET_TYPE_ROLES.subline.family);
        ctx.fillStyle = C.fg;
        let sy = cy + sub.firstAsc;
        for (const l of sub.lines) {
          const lx = ax(x, l.w);
          ctx.fillText(l.t, lx, sy);
          ink(lx, sy - l.asc, l.w, l.asc + l.desc, fgc);
          sy += sub.lh;
        }
        ctx.globalAlpha = 1;
        cy += sub.h;
      }
      if (cta) {
        cy += gapCta;
        const bx = ax(x, cta.w);
        ctx.fillStyle = C.ctaBg;
        pill(ctx, bx, cy, cta.w, cta.h);
        ctx.fill();
        setFont(ctx, cta.weight, cta.px, ASSET_TYPE_ROLES.cta.family);
        ctx.fillStyle = C.ctaFg;
        ctx.fillText(cta.text, bx + cta.px * 1.25, cy + cta.h / 2 + cta.asc / 2);
        ink(bx, cy, cta.w, cta.h, null);   /* a solid pill, measured against its own fill */
        cy += cta.h;
      }
      return cy;
    },
  };
}

/* The Professionals claim is artwork-like typography, not a sentence for the
   normal line wrapper. Its three lines, highlighted word, punctuation and
   underline/bold relationship are protected as one lockup. */
function fitClaimStack(ctx, colW, maxH, tk, treatment) {
  const lines = ["Mehr Möglichkeiten.", "Mehr Erfolg.", "Mehr für Sie."];
  const phrase = "Möglichkeiten.";
  const outline = treatment === "outline";
  const start = Math.round(tk.ideal * 1.22);
  const floor = ASSET_TYPE_ROLES.headline.minPx;
  for (let px = start; px >= floor; px--) {
    const lh = px * 1.08;
    const measured = lines.map((text, index) => {
      const weight = outline && index === 2 ? 700 : 400;
      setFont(ctx, weight, px, ASSET_TYPE_ROLES.headline.family);
      return { t: text, weight, ...measureLine(ctx, text) };
    });
    const widest = Math.max(...measured.map(line => line.w));
    const underlineSpace = outline ? 0 : px * 0.18;
    const h = measured[0].asc + lh * 2 + measured[2].desc + underlineSpace;
    if (widest > colW || h > maxH) continue;
    const firstAsc = measured[0].asc;
    return {
      h, headlinePx: px, colW: widest, align: "left", lineCount: 3,
      measureChars: Math.round(lines.reduce((sum, text) => sum + text.length, 0) / 3),
      droppedSub: false, droppedCta: false, fitMode: "brand-claim-lockup",
      isClaimLockup: true, claimTreatment: treatment,
      parts: { hl: { lines: measured, lh, h: h - underlineSpace, firstAsc, weight: 400, px }, sub: null, cta: null, kicker: null },
      gaps: { sub: 0, cta: 0, kicker: 0 },
      draw(drawCtx, x, y, C, ink) {
        const accent = C.bandId === "teal" ? COLORS.white : COLORS.teal;
        const foreground = C.fg;
        let baseline = y + firstAsc;
        measured.forEach((line, index) => {
          setFont(drawCtx, line.weight, px, ASSET_TYPE_ROLES.headline.family);
          if (index === 0) {
            const prefix = "Mehr ";
            const prefixMetrics = measureLine(drawCtx, prefix);
            const phraseMetrics = measureLine(drawCtx, phrase);
            const pillX = x + prefixMetrics.w - px * 0.08;
            const pillY = baseline - line.asc - px * 0.08;
            const pillW = phraseMetrics.w + px * 0.20;
            const pillH = line.asc + line.desc + px * 0.16;
            pill(drawCtx, pillX, pillY, pillW, pillH);
            if (outline) {
              drawCtx.strokeStyle = accent;
              drawCtx.lineWidth = Math.max(1, tk.hairline);
              drawCtx.stroke();
            } else {
              drawCtx.fillStyle = accent;
              drawCtx.fill();
            }
            drawCtx.fillStyle = foreground;
            drawCtx.fillText(prefix, x, baseline);
            ink(x, baseline - line.asc, prefixMetrics.w, line.asc + line.desc, foreground);
            drawCtx.fillStyle = outline ? foreground : COLORS.charcoal;
            const phraseX = x + prefixMetrics.w + px * 0.02;
            drawCtx.fillText(phrase, phraseX, baseline);
            ink(phraseX, baseline - line.asc, phraseMetrics.w, line.asc + line.desc,
              outline ? foreground : COLORS.charcoal);
          } else {
            drawCtx.fillStyle = foreground;
            drawCtx.fillText(line.t, x, baseline);
            ink(x, baseline - line.asc, line.w, line.asc + line.desc, foreground);
          }
          baseline += lh;
        });
        if (!outline) {
          const underlineY = y + measured[0].asc + lh * 2 + measured[2].desc + px * 0.08;
          drawCtx.fillStyle = accent;
          drawCtx.fillRect(x, underlineY, measured[2].w, Math.max(tk.hairline, px * 0.055));
          ink(x, underlineY, measured[2].w, Math.max(tk.hairline, px * 0.055), null);
        }
      },
    };
  }
  return null;
}

/* =====================================================================
   3. CONTENT AWARE CROPPING
   Cover-cropping is a one-dimensional problem: the scale is forced, so
   the only freedom is how far to slide along the long axis. That makes
   an exact search cheap. We build a small saliency map once per photo,
   then for each target ratio slide the window over every position and
   keep the one that holds the most of the subject without slicing it at
   an edge. A face cut in half at the crop boundary is the failure this
   is here to prevent.
   ===================================================================== */
const analysisCache = new WeakMap();

export function analyzeImage(img) {
  if (analysisCache.has(img)) return analysisCache.get(img);
  const W = 72, H = Math.max(8, Math.round(W * img.height / img.width));
  let sal, ok = true;
  try {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data;
    sal = saliency(d, W, H);
  } catch (e) { ok = false; sal = new Float32Array(W * H).fill(1); }

  /* Weighted centroid, for the default focal point and for reporting. */
  let sx = 0, sy = 0, tot = 0;
  for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) {
    const v = sal[y * W + x2]; sx += v * (x2 + 0.5); sy += v * (y + 0.5); tot += v;
  }
  const a = {
    w: W, h: H, sal, total: tot, ok,
    focal: tot > 0 ? { x: sx / tot / W, y: sy / tot / H } : { x: 0.5, y: 0.42 },
    person: ok && sal.person ? personCentre(sal.person, W, H) : null,
  };
  analysisCache.set(img, a);
  return a;
}

/* Where the people are, as distinct from where the detail is. An interior
   photograph has edges everywhere, so a plain saliency centroid sits at dead
   centre for every picture and tells you nothing about which half to cover
   with a card. The skin channel does tell you. */
function personCentre(skinMap, W, H) {
  let sx = 0, sy = 0, tot = 0;
  const cols = new Float32Array(W), rows = new Float32Array(H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = skinMap[y * W + x];
    if (!v) continue;
    sx += v * (x + 0.5); sy += v * (y + 0.5); tot += v;
    cols[x] += v; rows[y] += v;
  }
  const frac = tot / (W * H);
  if (!(tot > 0) || frac < 0.0003) return null;
  const quantile = (values, q) => {
    const target = tot * q;
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (sum >= target) return i;
    }
    return values.length - 1;
  };
  return {
    x: sx / tot / W, y: sy / tot / H, strength: frac,
    x0: quantile(cols, 0.06) / W,
    x1: (quantile(cols, 0.94) + 1) / W,
    y0: quantile(rows, 0.04) / H,
    y1: (quantile(rows, 0.96) + 1) / H,
  };
}

function saliency(d, W, H) {
  const lum = new Float32Array(W * H), sat = new Float32Array(W * H), skin = new Float32Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += 4) {
    const r = d[p], g = d[p + 1], b = d[p + 2];
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    lum[i] = l;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    sat[i] = mx === 0 ? 0 : (mx - mn) / mx;
    /* Chai and Ngan chroma window. Chroma is far less affected by skin
       tone than luminance is, so this holds across a range of tones; the
       luminance gate only throws away crushed shadows and blown highlights. */
    const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
    const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
    /* Chai and Ngan chroma window, tightened. The plain window also swallows
       beige walls and warm wood, which is most of an apartment interior, so a
       saturation band is added: skin is neither flat like paint nor as
       saturated as varnished oak. */
    skin[i] = (cb >= 80 && cb <= 122 && cr >= 137 && cr <= 172 &&
               sat[i] > 0.14 && sat[i] < 0.58 && l > 0.14 && l < 0.94) ? 1 : 0;
  }
  const out = new Float32Array(W * H), person = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const l = lum[i];
    const lx = lum[y * W + Math.max(0, x - 1)], rx = lum[y * W + Math.min(W - 1, x + 1)];
    const uy = lum[Math.max(0, y - 1) * W + x], dy = lum[Math.min(H - 1, y + 1) * W + x];
    const edge = Math.min(1, (Math.abs(2 * l - lx - rx) + Math.abs(2 * l - uy - dy)) * 2.2);
    const s = sat[i] > 0.32 && l > 0.2 && l < 0.85 ? (sat[i] - 0.32) / 0.68 : 0;
    /* Flat walls the colour of skin should not win. Skin only counts where
       there is also some structure, which is what a face has. Saturation is
       deliberately weak: the approved photography has large saturated Professionals
       shapes composed into it, and a crop should follow the person, not the
       decoration. */
    out[i] = 0.55 * edge + 0.10 * s + 1.45 * skin[i] * (0.30 + 0.70 * edge);
    /* A face has structure; a wall the colour of a face does not. */
    person[i] = skin[i] * edge;
  }
  out.person = person;
  return out;
}

/* WHERE THE SUBJECT LANDS WHEN NOBODY ASKS FOR ANYTHING. Centred across,
   and a little above the middle down, because faces read best there.

   It is a decision made here and it is exported because it was being
   restated: step 2's COMPOSED FOR row compared the safe-zone target
   against two bare literals and then printed a third and fourth copy of
   them as prose, so changing this line would have left a panel describing
   a decision nobody makes. Every surface that needs to know what the crop
   would otherwise have done reads FOCAL_DEFAULT. */
export const FOCAL_DEFAULT = Object.freeze({ x: 0.5, y: 0.46 });

/* Returns the focal point (0..1) that best frames this photo at this ratio.
   targetY says where in the frame the subject should land, which is how a
   composition with a colour block over the lower half keeps the person in
   the part of the picture you can still see. */
export function bestFocal(img, boxW, boxH, targetY, targetX) {
  const a = analyzeImage(img);
  if (!a.ok || a.total <= 0) return { x: targetX != null ? targetX : 0.5, y: targetY != null ? targetY : 0.42, coverage: 1, zoom: 1, auto: true };
  const { w: W, h: H, sal, total } = a;
  const scale = Math.max(boxW / img.width, boxH / img.height);
  /* The visible window, expressed on the small map. */
  const vw = Math.min(W, (boxW / scale) * (W / img.width));
  const vh = Math.min(H, (boxH / scale) * (H / img.height));

  const colSum = new Float32Array(W), rowSum = new Float32Array(H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = sal[y * W + x]; colSum[x] += v; rowSum[y] += v;
  }

  const pick = (len, span, sums, axis) => {
    if (span >= len - 0.5) return { off: 0, kept: 1 };
    const cum = new Float32Array(len + 1), mom = new Float32Array(len + 1);
    for (let i = 0; i < len; i++) {
      cum[i + 1] = cum[i] + sums[i];
      mom[i + 1] = mom[i] + sums[i] * (i + 0.5);
    }
    const totalAll = cum[len] || 1;
    /* Where the subject starts and ends, ignoring the long thin tails of
       background texture. */
    const quant = f => { const t = totalAll * f; let i = 0; while (i < len && cum[i + 1] < t) i++; return i; };
    const subjTop = quant(0.07), subjBottom = quant(0.93);

    let best = 0, bestScore = -Infinity;
    const maxOff = len - span;
    for (let off = 0; off <= maxOff; off += 0.25) {
      const a0 = interp(cum, off), a1 = interp(cum, off + span);
      const mass = a1 - a0;
      const inside = mass / totalAll;
      /* Slicing straight through something important. On the vertical axis
         a cut at the top is a decapitation and a cut at the bottom usually
         is not, so the two are not weighted the same. */
      const bandW = Math.max(1, span * 0.07);
      const cutLo = off > 0 ? (interp(cum, off) - interp(cum, Math.max(0, off - bandW))) / totalAll : 0;
      const cutHi = off + span < len ? (interp(cum, Math.min(len, off + span + bandW)) - interp(cum, off + span)) / totalAll : 0;
      const topWeight = axis === "y" ? 2.1 : 1.0;
      /* Where the subject's centre of mass lands inside the crop. Faces read
         best a little above the geometric centre. */
      const centroid = mass > 1e-6 ? ((interp(mom, off + span) - interp(mom, off)) / mass - off) / span : 0.5;
      const target = axis === "y" ? (targetY != null ? targetY : FOCAL_DEFAULT.y)
                                  : (targetX != null ? targetX : FOCAL_DEFAULT.x);
      const composed = 1 - Math.min(1, Math.abs(centroid - target) * 2.2);
      /* Headroom: never start the frame below where the subject begins. */
      const headroom = axis === "y" && off > subjTop
        ? Math.min(1, (off - subjTop) / Math.max(1, span * 0.22)) : 0;
      const footroom = axis === "y" && off + span < subjBottom
        ? Math.min(1, (subjBottom - off - span) / Math.max(1, span * 0.5)) : 0;

      /* When the caller has asked for the subject to sit high, honouring
         that matters more than perfect headroom. */
      const wantHigh = axis === "y" && targetY != null && targetY < 0.4;
      const wantSide = axis === "x" && targetX != null && Math.abs(targetX - 0.5) > 0.08;
      const score = inside * 1.0
        - cutLo * 0.9 * topWeight - cutHi * 0.9
        + composed * (wantHigh || wantSide ? 0.45 : 0.18)
        - headroom * (wantHigh ? 0.30 : 0.60) - footroom * 0.12;
      if (score > bestScore) { bestScore = score; best = off; }
    }
    const a0 = interp(cum, best), a1 = interp(cum, best + span);
    return { off: best, kept: (a1 - a0) / totalAll };
  };

  const X = pick(W, vw, colSum, "x");
  const Y = pick(H, vh, rowSum, "y");
  return {
    x: (X.off + vw / 2) / W,
    y: (Y.off + vh / 2) / H,
    coverage: Math.min(X.kept, Y.kept),
    /* How much of the original picture survives at all. Coverage says the
       crop kept the subject; zoom says how much of the photograph you are
       still looking at, which is the number that catches a 9:16 portrait
       squeezed into a 16:9 slot. */
    zoom: (vw / W) * (vh / H),
    auto: true,
  };
}
function interp(cum, p) {
  const i = Math.floor(p), f = p - i;
  if (i >= cum.length - 1) return cum[cum.length - 1];
  return cum[i] + (cum[i + 1] - cum[i]) * f;
}

/* Cover-draw the photo into a box around a focal point. */
function photoTransform(img, box, focal) {
  const fx = Number.isFinite(focal && focal.x) ? Math.max(0, Math.min(1, focal.x)) : 0.5;
  const fy = Number.isFinite(focal && focal.y) ? Math.max(0, Math.min(1, focal.y)) : 0.42;
  const s = Math.max(box.w / img.width, box.h / img.height);
  const dw = img.width * s, dh = img.height * s;
  let x = box.x + box.w / 2 - dw * fx;
  let y = box.y + box.h / 2 - dh * fy;
  x = Math.min(box.x, Math.max(box.x + box.w - dw, x));
  y = Math.min(box.y, Math.max(box.y + box.h - dh, y));
  return { x, y, dw, dh, s };
}

export function drawPhoto(ctx, img, box, focal) {
  const { x, y, dw, dh, s } = photoTransform(img, box, focal);
  ctx.save();
  ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, y, dw, dh);
  ctx.restore();
  return s;
}

function subjectRectOnCanvas(img, box, focal, padding) {
  const person = analyzeImage(img).person;
  if (!person) return null;
  const t = photoTransform(img, box, focal);
  const raw = {
    x: t.x + person.x0 * t.dw,
    y: t.y + person.y0 * t.dh,
    w: (person.x1 - person.x0) * t.dw,
    h: (person.y1 - person.y0) * t.dh,
  };
  const p = Math.max(0, padding || 0);
  const left = Math.max(box.x, raw.x - p), top = Math.max(box.y, raw.y - p);
  const right = Math.min(box.x + box.w, raw.x + raw.w + p);
  const bottom = Math.min(box.y + box.h, raw.y + raw.h + p);
  return right > left && bottom > top ? { x: left, y: top, w: right - left, h: bottom - top } : null;
}

/* Quality is derived from the actual decoded source and destination, even
   when a caller supplies a focal point without analysis metadata. */
export function photoFitMetrics(img, box) {
  const sourceWidth = Number(img && (img.naturalWidth || img.width));
  const sourceHeight = Number(img && (img.naturalHeight || img.height));
  if (!(sourceWidth > 0 && sourceHeight > 0 && box && box.w > 0 && box.h > 0)) {
    return { sourceWidth, sourceHeight, upscale: Infinity, retained: 0, usable: false };
  }
  const upscale = Math.max(box.w / sourceWidth, box.h / sourceHeight);
  const retained = Math.min(1, (box.w * box.h) / (sourceWidth * sourceHeight * upscale * upscale));
  return { sourceWidth, sourceHeight, upscale, retained,
    usable: upscale <= SOFT_UPSCALE && retained >= MIN_PHOTO_RETAINED };
}

/* A manual focal point is measured where it actually crops, not credited
   with the automatic crop's score. Saliency is a framing aid, not a face or
   legal-content detector, so this score never certifies subject identity. */
export function focalCoverage(img, box, focal) {
  const a = analyzeImage(img);
  if (!a.ok || !(a.total > 0)) return null;
  const scale = Math.max(box.w / img.width, box.h / img.height);
  const spanX = Math.min(1, box.w / (img.width * scale));
  const spanY = Math.min(1, box.h / (img.height * scale));
  const fx = Number.isFinite(focal && focal.x) ? focal.x : 0.5;
  const fy = Number.isFinite(focal && focal.y) ? focal.y : 0.42;
  const left = Math.max(0, Math.min(1 - spanX, fx - spanX / 2)) * a.w;
  const top = Math.max(0, Math.min(1 - spanY, fy - spanY / 2)) * a.h;
  const right = left + spanX * a.w, bottom = top + spanY * a.h;
  let mass = 0;
  for (let y = Math.floor(top); y < Math.ceil(bottom); y++) {
    for (let x = Math.floor(left); x < Math.ceil(right); x++) {
      if (x < 0 || x >= a.w || y < 0 || y >= a.h) continue;
      const shareX = Math.max(0, Math.min(x + 1, right) - Math.max(x, left));
      const shareY = Math.max(0, Math.min(y + 1, bottom) - Math.max(y, top));
      mass += a.sal[y * a.w + x] * shareX * shareY;
    }
  }
  return Math.max(0, Math.min(1, mass / a.total));
}

/* Keep the complete photograph, at no more than its native resolution.
   The remaining space belongs to the layout's solid field. It is never
   filled by stretching, mirroring or blurring the photograph. */
export function containPhotoBox(img, slot) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const scale = Math.min(1, slot.w / iw, slot.h / ih);
  const w = iw * scale, h = ih * scale;
  return { x: slot.x + (slot.w - w) / 2, y: slot.y + (slot.h - h) / 2, w, h };
}

/* =====================================================================
   4. PRIMITIVES
   ===================================================================== */
/* TRUE arcs, not quadratic curves.

   A quadratic Bézier is a poor stand-in for a quarter circle, and the error is
   invisible at a 12px card corner but obvious at the end of a pill: with the
   radius set to half the height the ends came out flattened, roughly r=35 on an
   82px button where a real semicircle is r=41. That is what "the buttons do not
   follow the fully rounded corners" was pointing at. arcTo draws the circle. */
export function roundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* A button is always a pill: the radius is half the height, never a guess. */
export function pill(ctx, x, y, w, h) {
  roundRect(ctx, x, y, w, h, h / 2);
}

/* Layouts may use an angled seam or a circular crop, but the photograph is
   still the same editable source. Keeping the clipping shape in the plan
   means every format is rebuilt rather than flattening a reference image. */
function tracePolygon(ctx, points) {
  if (!points || points.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  return true;
}

function polygonArea(points) {
  return Math.abs(points.reduce((sum, p, i) => {
    const next = points[(i + 1) % points.length];
    return sum + p.x * next.y - next.x * p.y;
  }, 0)) / 2;
}

function pointInPolygon(point, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if (((a.y > point.y) !== (b.y > point.y))
      && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

const HIGHLIGHTER_FILES = {
  straight: "assets/highlighters/IS24_Straight_Highlighter_01.svg",
  underline: "assets/highlighters/IS24_Underline_01.svg",
  arrow: "assets/highlighters/IS24_Arrow_03.svg",
  rise: "assets/highlighters/IS24_Arrow_uprising_01.svg",
};

/* The supplied SVG remains the silhouette master. Recolouring happens on an
   offscreen canvas with source-in, so the artwork is never redrawn or warped. */
async function drawTintedHighlighter(ctx, kind, colour, box, rotation, safeBounds) {
  const src = HIGHLIGHTER_FILES[kind];
  if (!src || !box || !(box.w > 0)) return null;
  const img = await loadImg(src);
  let dw = box.w;
  let dh = dw * (img.height / img.width);
  if (box.maxH && dh > box.maxH) {
    const s = box.maxH / dh;
    dw *= s; dh *= s;
  }
  const radians = (rotation || 0) * Math.PI / 180;
  const cos = Math.abs(Math.cos(radians)), sin = Math.abs(Math.sin(radians));
  if (safeBounds) {
    const scale = Math.min(1, safeBounds.w / (dw * cos + dh * sin), safeBounds.h / (dw * sin + dh * cos));
    dw *= scale; dh *= scale;
  }
  const off = document.createElement("canvas");
  off.width = Math.max(2, Math.round(dw));
  off.height = Math.max(2, Math.round(dh));
  const ox = off.getContext("2d");
  ox.drawImage(img, 0, 0, off.width, off.height);
  ox.globalCompositeOperation = "source-in";
  ox.fillStyle = colour;
  ox.fillRect(0, 0, off.width, off.height);
  const boundsW = dw * cos + dh * sin, boundsH = dw * sin + dh * cos;
  let cx = box.x + box.w / 2, cy = box.y + (box.h || dh) / 2;
  if (safeBounds) {
    cx = Math.max(safeBounds.x + boundsW / 2, Math.min(safeBounds.x + safeBounds.w - boundsW / 2, cx));
    cy = Math.max(safeBounds.y + boundsH / 2, Math.min(safeBounds.y + safeBounds.h - boundsH / 2, cy));
  }
  ctx.save();
  ctx.translate(cx, cy);
  if (rotation) ctx.rotate(radians);
  ctx.drawImage(off, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
  return { x: cx - boundsW / 2, y: cy - boundsH / 2, w: boundsW, h: boundsH };
}

/* A small deterministic generator. Seeded from the placement so a composition
   is stable for a given size but different across the set: the same campaign
   never ships ten rescalings of one arrangement. */
function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function seedOf(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) { h ^= String(str).charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* Relative luminance and WCAG contrast, used to keep type legible over
   photography rather than assuming it will be fine. */
function srgbL(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
export function luminance(r, g, b) { return 0.2126 * srgbL(r) + 0.7152 * srgbL(g) + 0.0722 * srgbL(b); }
export function contrastRatio(l1, l2) { const a = Math.max(l1, l2), b = Math.min(l1, l2); return (a + 0.05) / (b + 0.05); }
function hexL(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return luminance((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

/* The worst background a piece of type actually sits on, measured off a copy
   of the canvas taken before any glyph was drawn. A percentile rather than the
   single worst pixel, so one specular highlight does not force a black frame,
   but strict enough that a bright window behind a word is caught. */
function worstBackdrop(backdrop, rect, lightText, q) {
  const bx = backdrop.getContext("2d", { willReadFrequently: true });
  const x = Math.max(0, Math.floor(rect.x)), y = Math.max(0, Math.floor(rect.y));
  const w = Math.max(1, Math.min(backdrop.width - x, Math.ceil(rect.w)));
  const h = Math.max(1, Math.min(backdrop.height - y, Math.ceil(rect.h)));
  let d;
  try { d = bx.getImageData(x, y, w, h).data; } catch (e) { return { l: 0.5, rgb: [128, 128, 128] }; }
  /* Sample on a two dimensional grid. A flat stride through the buffer looks
     like it spreads the samples out, but when it divides evenly into the row
     width it walks the same handful of columns over and over and can miss the
     bright window that is actually sitting under the headline. */
  const stride = Math.max(1, Math.round(Math.sqrt((w * h) / 3000)));
  const rows = [];
  let sr = 0, sg = 0, sb = 0, n = 0;
  for (let y2 = 0; y2 < h; y2 += stride) {
    for (let x2 = 0; x2 < w; x2 += stride) {
      const p = (y2 * w + x2) * 4;
      rows.push(luminance(d[p], d[p + 1], d[p + 2]));
      sr += d[p]; sg += d[p + 1]; sb += d[p + 2]; n++;
    }
  }
  rows.sort((a, b) => a - b);
  const tail = q == null ? 0.03 : q;
  const v = lightText ? rows[Math.min(rows.length - 1, Math.floor(n * (1 - tail)))]
                      : rows[Math.floor(n * tail)];
  return { l: v, rgb: [sr / n, sg / n, sb / n] };
}

/* A line of type sits on a band, not on the whole block. Judging the block as
   one region lets a bright window that covers 0.2% of the block, but 3% of the
   one line crossing it, slip through: the block's extreme percentile never
   sees it. So the rect is measured in bands roughly a line tall and the worst
   band decides. This is the difference between 4.2:1 shipping and not. */
function worstBanded(backdrop, rect, lightText) {
  const bands = Math.max(3, Math.min(10, Math.round(rect.h / 26)));
  const bh = rect.h / bands;
  let worst = null;
  for (let i = 0; i < bands; i++) {
    const b = worstBackdrop(backdrop, { x: rect.x, y: rect.y + i * bh, w: rect.w, h: bh }, lightText, 0.04);
    if (!worst || (lightText ? b.l > worst.l : b.l < worst.l)) worst = b;
  }
  return worst;
}

/* Photography is never recoloured, veiled or faded to rescue contrast. The
   renderer measures the untouched photograph and chooses another approved
   layout or surface when it cannot carry the mark safely. */
function ensureContrast(ctx, backdrop, rect, textHex) {
  const textL = hexL(textHex);
  const dark = textL > 0.4;
  const worst = worstBanded(backdrop, rect, dark);
  return { ratio: contrastRatio(textL, worst.l), alpha: 0 };
}

/* =====================================================================
   5. STYLES
   Three approved visual families, expressed through four structural planners,
   each with designed geometry for every aspect
   class. A style never "fails at this size": it has an answer for banner,
   wide, square, tall and story, and the copy is measured before the
   geometry is fixed, so the panel is built around the words rather than
   the words being crushed into a panel.
   ===================================================================== */
export const LAYOUTS = [
  { id: "editorial", label: "Editorial split", blurb: "Photograph and colour field meet on one hard edge, with a kicker above the headline. Magazine structure." },
  { id: "fullbleed", label: "Full bleed",     blurb: "The photograph remains untouched. Copy uses detected negative space and is held when the original cannot carry it at 4.5:1." },
  { id: "poster",    label: "Poster",         blurb: "Headline on top, a full-width band of photograph under it, button and mark on a footer line. Three tiers, read top to bottom." },
  { id: "statement", label: "Typography only",blurb: "No photograph. The headline carries the composition with a clear hierarchy and generous space." },
];
/* Old ids kept working, so saved sessions and filenames do not break. */
const LAYOUT_ALIAS = {
  band: "editorial", anchor: "editorial", split: "editorial",
  card: "editorial", frame: "editorial", field: "editorial", panel: "editorial",
  mask: "fullbleed", cutout: "fullbleed", grid: "editorial", mosaic: "editorial",
  gallery: "editorial", type: "statement", bleed: "fullbleed",
};
export function normaliseLayout(id) { return LAYOUT_ALIAS[id] || id || "editorial"; }

/* THE STRUCTURES NOBODY PICKS. Three compositions exist that are not in the
   library above, because they are not choices: the engine reaches for them
   when the requested structure cannot be drawn. They still have to be
   nameable, because `composeAsset` now reports the structure it actually
   drew and a record that says "micro" must be readable as something. */
export const ENGINE_STRUCTURES = {
  micro:   { label: "Brand end frame", blurb: "Too small for a sentence, so the canvas runs as a mark and a button." },
  centred: { label: "Centred lockup",  blurb: "A publisher that re-crops the file into several widget shapes, so the words sit in the centred band its own guidance asks for." },
  photo:   { label: "Photograph only", blurb: "The clean variant: the picture edge to edge, with no structure over it at all." },
};

/* What to call a structure on screen. Takes either a library id or one of the
   three above, and never returns an empty string for something that ran. */
export function structureLabel(id) {
  if (!id) return "";
  const known = LAYOUTS.find(x => x.id === normaliseLayout(id));
  if (known) return known.label;
  return (ENGINE_STRUCTURES[id] || {}).label || String(id);
}

/* THE DESIGN LIBRARY.

   Professionals uses only typography, split screens and full bleed imagery.
   Every public design below is one executable variation of those three
   families. Circular crops, modular grids, inset photographs and floating
   cards are deliberately absent from the library.

   ONE DESIGN PER SET. Every placement in a campaign shares it, so the set
   reads as one campaign rather than a shelf of samples. The variety belongs
   between campaigns, not inside one: that is what an auction rewards and what
   an audience notices.

   A design that has been used is RETIRED. The Studio reads the build history,
   marks what has run, and offers what has not. Nothing is deleted; a retired
   design can be chosen again deliberately, it just stops being suggested. */
export const DESIGNS = [
  { id: "editorial-vertical",style: "editorial", params: { copy: "left", axis: "vertical" }, label: "Hard vertical split", note: "A vertical message field and photograph at every social ratio." },
  { id: "editorial-angle-left", style: "editorial", params: { copy: "left", angled: true }, label: "Angled split", note: "A sloped seam gives the message field and photograph different weight." },
  { id: "editorial-angle-right", style: "editorial", params: { copy: "right", angled: true }, label: "Angled split, mirrored", note: "The angled seam mirrored with the message on the right." },
  { id: "fullbleed-negative-space", style: "fullbleed", params: { copy: "top", negativeSpace: "left", highlight: "underline", highlightColour: "blue" }, label: "Negative space portrait", note: "The person is held to one side and the message uses the clear side of the photograph." },
  { id: "fullbleed-impact", style: "fullbleed", params: { copy: "top", impact: true, highlight: "straight", highlightColour: "teal" }, label: "Oversized photo message", note: "Oversized sentence case type and one approved highlighter sit directly on the photograph." },
  { id: "poster-angle-type-first", style: "poster", params: { angled: true }, label: "Angled message cap", note: "A large message field cuts diagonally into the photograph below." },
  { id: "poster-angle-photo-first", style: "poster", params: { order: "photo-first", angled: true }, label: "Angled image cap", note: "The photograph opens the composition with an angled edge into the message." },
  { id: "statement-impact",  style: "statement", params: { impact: true, highlight: "straight", highlightColour: "blue" }, label: "Type statement", note: "A bold type led frame with one highlighted line and generous open space." },
  { id: "fullbleed-lower-caption", style: "fullbleed", params: { copy: "bottom", caption: true }, label: "Quiet photo caption", note: "A restrained caption at the lower left gives the photograph room to lead." },
  { id: "statement-centred", style: "statement", params: { align: "middle", textAlign: "center", restrained: true }, label: "Centred statement", note: "A centred benefit, supporting sentence and logo with generous surrounding space." },
  { id: "statement-underline", style: "statement", params: { align: "bottom", highlight: "underline", highlightColour: "teal" }, label: "Underlined statement", note: "A statement anchored low in the frame with one supplied underline." },
  { id: "claim-lockup-filled", style: "statement", params: { claim: true, claimTreatment: "filled" }, label: "Brand claim lockup", note: "The approved claim with its filled Möglichkeiten pill and underline." },
  { id: "claim-lockup-outline", style: "statement", params: { claim: true, claimTreatment: "outline" }, label: "Brand claim lockup outline", note: "The approved claim with its outlined Möglichkeiten pill and bold closing line." },
];

export function designById(id) {
  return DESIGNS.find(d => d.id === id) || DESIGNS[0];
}
/* Designs that have not been used yet, in library order. */
export function freshDesigns(usedIds) {
  const used = new Set(usedIds || []);
  return DESIGNS.filter(d => !used.has(d.id));
}

/* CREATIVE ROTATION.

   Every major auction rewards new creative and punishes a stale one: the same
   file served to the same person twice earns less each time, and the ranking
   models read declining engagement as declining relevance. The usual answer is
   to make one ad and run it until it dies. The better answer is to ship the
   same message in structurally different frames, so the set never looks
   repeated even though it says one thing.

   The rotation is deterministic, seeded from the placement, so a rebuild
   reproduces the same set exactly. It is not random art direction: it walks a
   shuffled cycle so the styles are spread evenly rather than clumped, and it
   never puts the same structure on two placements a person is likely to see in
   the same session.

   EIGHT OF THE NINE STRUCTURES ROTATE, and the one that does not is left out
   deliberately rather than by omission. `statement` is the only style with no
   photograph: renderAd treats it as the answer for a concept that has no
   picture at all, and reaches for it on its own in that case. A rotation set
   is one concept, one picture, one message, shown in different frames, so
   dropping the picture on one placement of that set is a different ad rather
   than a different structure. Leaving it out costs nothing, because the one
   situation that wants it already gets it without the rotation's help.

   `cutout` is in, and its earlier absence was an oversight. The mask is a
   compositing step over whatever photograph it is handed, not a demand for a
   particular silhouette, and the subject is centred into the mask box before
   it is cut, so no picture is disqualified. It has designed geometry for every
   aspect class, and it is the one photographic style that adds no Professionals glyph
   of its own, because the photograph has already been cut into one. */
export const ROTATION_POOL = ["editorial", "fullbleed", "poster"];

export function rotationSet(count, seed, pool) {
  const src = (pool && pool.length ? pool : ROTATION_POOL).slice();
  const rnd = mulberry(seed >>> 0);
  for (let i = src.length - 1; i > 0; i--) {          /* one shuffle per set */
    const j = Math.floor(rnd() * (i + 1));
    [src[i], src[j]] = [src[j], src[i]];
  }
  const out = [];
  for (let i = 0; i < count; i++) out.push(src[i % src.length]);
  return out;
}

/* The content rectangle: the safe box, widened by the house margin so a
   composition never hugs the trim edge even where a platform allows it. */
export function contentRect(w, h, safe, tk) {
  const m = Math.round(tk.ref * 0.045);
  return {
    x: Math.max(safe.left, m), y: Math.max(safe.top, m),
    w: w - Math.max(safe.left, m) - Math.max(safe.right, m),
    h: h - Math.max(safe.top, m) - Math.max(safe.bottom, m),
  };
}

/* Every planner is handed this. It answers "how much room do these words
   need in a column this wide", which is what lets the geometry be built
   around the copy instead of the other way round. */
function makeFitter(ctx, C, tk) {
  return (colW, maxH, opts) => fitStack(ctx, C, colW, maxH, tk, opts);
}

function logoPlan(G, box, align, vAlign) {
  /* The logo is a fixed brand element, so it is reserved before the copy
     competes for space, and it never renders below the brand minimum. */
  const { tk } = G;
  const ratio = G.logoImg ? G.logoImg.width / G.logoImg.height : 2.45;
  let lh = Math.round(Math.max(BRAND.logoMinPx, Math.min(tk.ref * 0.056, box.h * 0.5)));
  let lw = lh * ratio;
  const maxW = box.w * (tk.ref < 200 ? 0.88 : tk.ref < 320 ? 0.66 : 0.52);
  if (lw > maxW) { lw = maxW; lh = lw / ratio; }
  if (lh > box.h) { lh = box.h; lw = lh * ratio; }
  return { w: Math.round(lw), h: Math.round(lh), align, vAlign, belowMin: lh < BRAND.logoMinPx - 0.5 };
}

const STYLE_PLANNERS = {
  /* ---- Anchored block ------------------------------------------------ */
  anchor(G, fit) {
    const { w, h, safe, tk, cls, v } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;

    const dp = G.dp || {};
    if (cls === "wide" || cls === "banner") {
      /* The column is measured from the content rectangle, never from the
         canvas. On a native placement with a 16% centre-bias guide the two
         differ by hundreds of pixels, and taking it from the canvas is what
         used to squeeze the headline into an unreadable ribbon. */
      const colW = Math.round(C.w * (cls === "banner" ? 0.54 : 0.47));
      const left = dp.side === "left";
      const innerX = left ? C.x : C.x + C.w - colW;
      const fieldX = left ? 0 : Math.max(0, Math.round(innerX - pad * 1.25));
      const fieldW = left ? Math.round(innerX + colW + pad * 1.25) : w - fieldX;
      return blockPlan(G, fit, {
        field: { x: fieldX, y: 0, w: fieldW, h },
        photo: left ? { x: fieldW, y: 0, w: w - fieldW, h } : { x: 0, y: 0, w: fieldX, h },
        inner: { x: innerX, y: C.y, w: colW, h: C.h },
        vAlign: "center",
        plusses: [],
      });
    }

    /* The block can sit at the top instead. Same logic, mirrored, and on a
       story it puts the words above the picture rather than under it. */
    if (dp.side === "top") {
      const colW0 = C.w;
      const logo0 = v.logo && G.logoImg ? logoPlan(G, { w: colW0, h }, "left", "bottom") : null;
      const reserve0 = logo0 ? logo0.h + pad * 0.85 : 0;
      const roomiest0 = Math.min(C.h, h * (cls === "story" ? 0.50 : 0.58)) - pad;
      const stack0 = v.copy ? fit(colW0, roomiest0 - reserve0, { maxLines: 3 }) : null;
      const needed0 = (stack0 ? stack0.h : 0) + (logo0 ? logo0.h + (v.copy ? pad * 0.85 : 0) : 0);
      const fieldBot = Math.round(Math.max(C.y + needed0 + pad, h * 0.20));
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h: fieldBot },
        photo: { x: 0, y: fieldBot, w, h: Math.max(1, h - fieldBot) },
        inner: { x: C.x, y: C.y, w: colW0, h: fieldBot - pad - C.y },
        vAlign: "top", stack: stack0, logo: logo0,
        plusses: [],
      });
    }

    /* Portrait and square: the block is as tall as the words need, no more.
       The words are measured against the whole content rectangle first, so a
       subline is only ever dropped because there is genuinely no room, not
       because of an arbitrary cap on how tall the block may be. */
    const colW = C.w;
    const bottom = C.y + C.h;
    const logo = v.logo && G.logoImg ? logoPlan(G, { w: colW, h }, "left", "bottom") : null;
    const reserve = logo ? logo.h + pad * 0.85 : 0;
    const roomiest = Math.min(C.h, h * (cls === "story" ? 0.54 : tk.ref < 460 ? 0.80 : 0.62)) - pad;
    const stack = v.copy ? fit(colW, roomiest - reserve, { maxLines: 3 }) : null;
    const needed = v.copy && !stack
      ? roomiest - pad                       /* first pass failed: give it the room, not a stripe */
      : (stack ? stack.h : 0) + (logo ? logo.h + (v.copy ? pad * 0.85 : 0) : 0);
    const minBlock = Math.round(h * (v.copy ? 0.19 : 0.12));
    const fieldTop = Math.round(Math.min(bottom - needed - pad, h - Math.max(needed + pad * 2, minBlock)));

    /* On a story the platform paints its own interface over the bottom third.
       Filling that with flat colour makes the exported file look half empty,
       so the photograph runs full bleed and the block stops where the
       interface begins. */
    /* On a story the block is a band across a full-bleed photograph rather
       than a slab filling everything below the picture. The platform paints
       its interface over the bottom third, and a flat colour slab there
       makes the exported file look half finished. */
    const story = cls === "story";
    const fieldBottom = story ? Math.min(h, bottom + pad * 0.6) : h;
    return blockPlan(G, fit, {
      field: { x: 0, y: fieldTop, w, h: fieldBottom - fieldTop },
      photo: story ? { x: 0, y: 0, w, h } : { x: 0, y: 0, w, h: Math.max(1, fieldTop) },
      fieldOver: story,
      /* On a story the block sits over the middle of the picture, so the
         person has to be framed into the part that is still visible. */
      focalTargetY: story ? Math.max(0.16, Math.min(0.46, (fieldTop * 0.52) / h)) : undefined,
      inner: { x: C.x, y: fieldTop + pad, w: colW, h: bottom - (fieldTop + pad) },
      vAlign: "top", stack, logo,
      plusses: [],
    });
  },

  /* ---- Editorial split ---------------------------------------------- */
  editorial(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const dp = G.dp || {};
    if (dp.axis === "horizontal") {
      const seam = Math.round(C.y + C.h * 0.46);
      return blockPlan(G, fit, {
        field: { x: 0, y: seam, w, h: h - seam },
        photo: { x: 0, y: 0, w, h: seam },
        inner: { x: C.x, y: seam + pad, w: C.w, h: C.y + C.h - seam - pad },
        vAlign: "center", tightLines: 3, logoPhotoCorner: "top-right", plusses: [],
      });
    }
    /* Portrait placements need a wide photographic area. A narrow side crop
       would discard most landscape source images, so vertical and angled
       concepts become a top/bottom split while keeping their seam character. */
    if ((cls === "story" || cls === "tall") && (dp.angled || dp.axis === "vertical")) {
      const seam = Math.round(h * 0.48);
      const sweep = dp.angled ? Math.round(Math.min(w * 0.07, h * 0.055)) : 0;
      const risesRight = dp.copy !== "right";
      const seamLeft = seam + (risesRight ? sweep : -sweep);
      const seamRight = seam - (risesRight ? sweep : -sweep);
      const photoBottom = Math.max(seamLeft, seamRight);
      const copyTop = Math.max(seamLeft, seamRight) + pad;
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h },
        photo: { x: 0, y: 0, w, h: photoBottom },
        photoClip: [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: seamRight }, { x: 0, y: seamLeft }],
        inner: { x: C.x, y: copyTop, w: C.w, h: C.y + C.h - copyTop },
        vAlign: "center", kicker: true,
        focalTargetX: risesRight ? 0.62 : 0.38,
        logoPhotoCorner: risesRight ? "top-right" : "top-left",
        plusses: [],
      });
    }
    /* On wider placements the references use a vertical split, plus a true
       angled alternative. Both are geometry, not a decorative stripe: the
       photograph is clipped to one side and the field owns the other. */
    if (dp.angled || dp.axis === "vertical") {
      const left = dp.copy !== "right";
      const fieldShare = cls === "story" ? 0.66 : cls === "tall" ? 0.61
        : cls === "square" ? 0.55 : 0.49;
      const seam = Math.round(w * (left ? fieldShare : 1 - fieldShare));
      const sweep = dp.angled ? Math.round(Math.min(w * 0.09, h * 0.12)) : 0;
      const seamTop = seam + (left ? sweep : -sweep);
      const seamBottom = seam - (left ? sweep : -sweep);
      const narrow = left ? Math.min(seamTop, seamBottom) : Math.max(seamTop, seamBottom);
      const photo = left
        ? { x: Math.max(0, Math.min(seamTop, seamBottom)), y: 0, w: w - Math.max(0, Math.min(seamTop, seamBottom)), h }
        : { x: 0, y: 0, w: Math.min(w, Math.max(seamTop, seamBottom)), h };
      const photoClip = left
        ? [{ x: seamTop, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: seamBottom, y: h }]
        : [{ x: 0, y: 0 }, { x: seamTop, y: 0 }, { x: seamBottom, y: h }, { x: 0, y: h }];
      const inner = left
        ? { x: C.x, y: C.y, w: narrow - C.x - pad * 1.05, h: C.h }
        : { x: narrow + pad * 1.05, y: C.y, w: C.x + C.w - narrow - pad * 1.05, h: C.h };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoClip, inner,
        vAlign: "center", kicker: true,
        focalTargetX: left ? 0.74 : 0.26,
        logoPhotoCorner: left ? "bottom-right" : "bottom-left",
        plusses: [],
      });
    }
    if (cls === "wide" || cls === "banner" || cls === "square") {
      const colW = Math.round(C.w * (cls === "square" ? 0.52 : 0.48));
      const left = dp.copy === "left";
      const innerX = left ? C.x : C.x + C.w - colW;
      const split = left ? Math.round(innerX + colW + pad * 1.15) : Math.max(0, Math.round(innerX - pad * 1.15));
      return blockPlan(G, fit, {
        field: left ? { x: 0, y: 0, w: split, h } : { x: split, y: 0, w: w - split, h },
        photo: left ? { x: split, y: 0, w: w - split, h } : { x: 0, y: 0, w: split, h },
        inner: { x: innerX, y: C.y, w: colW, h: C.h },
        vAlign: "center", kicker: true,
        plusses: [],
      });
    }
    /* Tall and story: the seam runs horizontally, high enough that the
       photograph still carries the frame. */
    const seam = Math.round(Math.min(h * (dp.seam === "low" ? 0.64 : dp.seam === "high" ? 0.40 : 0.52),
                                     C.y + C.h * (dp.seam === "low" ? 0.68 : dp.seam === "high" ? 0.42 : 0.55)));
    return blockPlan(G, fit, {
      field: { x: 0, y: seam, w, h: h - seam },
      photo: { x: 0, y: 0, w, h: seam },
      inner: { x: C.x, y: Math.max(seam + pad, C.y), w: C.w, h: (C.y + C.h) - Math.max(seam + pad, C.y) },
      vAlign: "top", kicker: true,
      plusses: [],
    });
  },

  /* ---- Floating card ------------------------------------------------- */
  frame(G, fit) {
    const { w, h, safe, tk, cls, v } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = Math.round(tk.pad * 1.15);
    /* The card runs along the bottom on every shape, never down one side.
       A side card on a wide frame sits on top of whoever is in the middle of
       the photograph, and on a full-bleed cover crop of a landscape source
       there is no horizontal room left to move them out of the way. Along
       the bottom it never competes with the subject. */
    const wide = cls === "wide" || cls === "banner";
    const cardW = C.w;
    const colW = cardW - pad * 2;
    const logo = v.logo && G.logoImg ? logoPlan(G, { w: colW, h }, "left", "bottom") : null;
    const reserve = logo ? logo.h + pad * 0.85 : 0;
    const stack = v.copy ? fit(colW, C.h - pad * 2 - reserve, { maxLines: 3 }) : null;
    const needed = (stack ? stack.h : 0) + (logo ? logo.h + (v.copy ? pad * 0.85 : 0) : 0);
    /* If the first pass could not set the copy, give the card the whole
       content rectangle rather than shrinking it to the logo. A collapsed
       card guarantees failure on the second pass, which is how a perfectly
       usable 1200x674 ended up as a bare end frame. */
    const cardH = v.copy && !stack
      ? C.h
      : Math.min(C.h, Math.round(needed + pad * 2),
                 Math.round(h * (cls === "banner" ? 1 : wide ? 0.62 : 0.58)));
    const dp = G.dp || {};
    const cx = C.x;
    const cy = dp.card === "top" ? C.y : C.y + C.h - cardH;
    return blockPlan(G, fit, {
      photo: { x: 0, y: 0, w, h },
      card: { x: cx, y: cy, w: cardW, h: cardH, r: Math.round(Math.min(cardW, cardH) * 0.075) },
      inner: { x: cx + pad, y: cy + pad, w: colW, h: cardH - pad * 2 },
      vAlign: "top", stack, logo,
      /* The card covers part of the frame, so frame the subject into what
         is left rather than behind the card. */
      focalTargetY: dp.card === "top"
        ? Math.max(0.54, Math.min(0.86, (cy + cardH + (h - cy - cardH) / 2) / h))
        : Math.max(0.18, Math.min(0.46, (cy * 0.55) / h)),
      plusses: [],
    });
  },

  /* ---- Colour field with an inset photograph -------------------------- */
  panel(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const r = Math.round(tk.ref * 0.035);
    const dp = G.dp || {};
    if (dp.photo === "sliver") {
      const seamTop = Math.round(w * (cls === "wide" || cls === "banner" ? 0.68 : 0.73));
      const seamBottom = Math.round(w * (cls === "wide" || cls === "banner" ? 0.58 : 0.64));
      const photo = { x: seamBottom, y: 0, w: w - seamBottom, h };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h },
        photo,
        photoClip: [{ x: seamTop, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: seamBottom, y: h }],
        inner: { x: C.x, y: C.y, w: seamBottom - C.x - pad * 1.2, h: C.h },
        vAlign: "top", bigType: true, startScale: 1.42, tightLines: 4, maxCPL: 18,
        focalTargetX: 0.72, logoPhotoCorner: "bottom-right",
        plusses: [],
      });
    }
    if (cls === "wide" || cls === "banner") {
      const pw = Math.round(C.w * 0.40);
      const pLeft = dp.photo === "left";
      const photo = { x: pLeft ? C.x : C.x + C.w - pw, y: C.y, w: pw, h: C.h, r };
      const inner = { x: pLeft ? C.x + pw + pad * 1.2 : C.x, y: C.y, w: C.w - pw - pad * 1.2, h: C.h };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoRound: true, inner, vAlign: "center",
        plusses: [],
      });
    }
    const ph = Math.round(C.h * (cls === "story" ? 0.44 : 0.50));
    const low = dp.photo === "bottom";
    const photo = { x: C.x, y: low ? C.y + C.h - ph : C.y, w: C.w, h: ph, r };
    const inner = low
      ? { x: C.x, y: C.y, w: C.w, h: (C.y + C.h - ph - pad * 1.2) - C.y }
      : { x: C.x, y: C.y + ph + pad * 1.2, w: C.w, h: (C.y + C.h) - (C.y + ph + pad * 1.2) };
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, photo, photoRound: true, inner, vAlign: low ? "bottom" : "top",
      plusses: [],
    });
  },

  /* ---- Portrait inset --------------------------------------------------
     This route was inherited as a photograph clipped into a Plus symbol.
     Professionals has no standalone product symbol, so the same measured
     composition now uses a simple rounded image block. */
  cutout(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const dpc = G.dp || {};
    if (dpc.circle) {
      if (cls === "wide" || cls === "banner" || cls === "square") {
        const side = Math.min(C.h * 0.82, C.w * 0.43);
        const photo = { x: C.x + C.w - side, y: C.y + (C.h - side) / 2, w: side, h: side };
        return blockPlan(G, fit, {
          field: { x: 0, y: 0, w, h }, photo, photoEllipse: true,
          inner: { x: C.x, y: C.y, w: C.w * 0.46, h: C.h },
          vAlign: "center", bigType: true, startScale: 1.40, tightLines: 3, maxCPL: 18,
          decorations: dpc.arrow ? [{ kind: "rise", colour: "teal", box: {
            x: C.x + C.w * 0.48, y: C.y + C.h * 0.43, w: C.w * 0.11, h: C.h * 0.18,
          } }] : [],
          plusses: [],
        });
      }
      const side = Math.min(C.w * 0.66, C.h * 0.43);
      const photo = { x: C.x + C.w - side, y: C.y + C.h - side, w: side, h: side };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoEllipse: true,
        inner: { x: C.x, y: C.y, w: C.w * 0.84, h: C.h * 0.48 },
        vAlign: "top", bigType: true, startScale: 1.36, tightLines: 3, maxCPL: 18,
        decorations: dpc.arrow ? [{ kind: "rise", colour: "teal", box: {
          x: C.x + C.w * 0.10, y: C.y + C.h * 0.54, w: C.w * 0.21, h: C.h * 0.16,
        } }] : [],
        plusses: [],
      });
    }
    if (cls === "wide" || cls === "banner") {
      const side = Math.min(C.w * 0.42, C.h);
      const photo = { x: C.x + C.w - side, y: C.y + (C.h - side) / 2, w: side, h: side };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoRound: true,
        inner: { x: C.x, y: C.y, w: photo.x - C.x - pad * 1.2, h: C.h },
        vAlign: "center",
      });
    }
    const side = Math.min(C.w * 0.86, C.h * 0.46);
    const low = dpc.mask === "bottom";
    const photo = { x: C.x + (C.w - side) / 2, y: low ? C.y + C.h - side : C.y, w: side, h: side };
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, photo, photoRound: true,
      inner: low
        ? { x: C.x, y: C.y, w: C.w, h: (photo.y - pad * 1.1) - C.y }
        : { x: C.x, y: photo.y + photo.h + pad * 1.1, w: C.w, h: (C.y + C.h) - (photo.y + photo.h + pad * 1.1) },
      vAlign: low ? "bottom" : "top",
    });
  },

  /* A simple editorial mat respects the photograph's own ratio. These four
     recipes also provide the repair geometry when a cover crop would lose
     the subject or need an unacceptably soft enlargement. */
  gallery(G, fit) {
    const { w, h, safe, tk } = G;
    const C = contentRect(w, h, safe, tk);
    const gap = tk.gutter;
    const direction = (G.dp || {}).gallery || (C.w > C.h * 1.25 ? "right" : "top");
    const vertical = direction === "top" || direction === "bottom";
    let photo, inner;
    if (vertical) {
      const ph = Math.max(1, (C.h - gap) * 0.46);
      const photoFirst = direction === "top";
      photo = { x: C.x, y: photoFirst ? C.y : C.y + C.h - ph, w: C.w, h: ph };
      inner = { x: C.x, y: photoFirst ? C.y + ph + gap : C.y, w: C.w, h: C.h - ph - gap };
    } else {
      const pw = Math.max(1, (C.w - gap) * 0.43);
      const photoFirst = direction === "left";
      photo = { x: photoFirst ? C.x : C.x + C.w - pw, y: C.y, w: pw, h: C.h };
      inner = { x: photoFirst ? C.x + pw + gap : C.x, y: C.y, w: C.w - pw - gap, h: C.h };
    }
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, photo, photoContain: true, inner,
      vAlign: "center", tightLines: 4, maxCPL: vertical ? 30 : 22,
      textAlign: safe.centreBias ? "center" : undefined,
      logoPhotoCorner: direction === "left" ? "bottom-left" : "bottom-right", plusses: [],
    });
  },

  /* ---- Full bleed ------------------------------------------------------
     The photograph is the whole design. No field, no card, no block behind
     the words. Legibility comes from the picture itself being veiled where
     the type sits, measured against 4.5:1 rather than guessed at. */
  fullbleed(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const dp = G.dp || {};
    const impact = !!dp.impact;
    const person = G.photoImg ? analyzeImage(G.photoImg).person : null;
    const copyRight = !!(person && person.x < 0.5);
    const copyHigh = !(person && person.y < 0.5);
    if (cls === "wide" || cls === "banner") {
      /* Words in one half, picture readable in the other. */
      const colW = Math.round(C.w * (dp.caption ? 0.50 : impact ? 0.46 : 0.48));
      return blockPlan(G, fit, {
        photo: { x: 0, y: 0, w, h },
        inner: { x: copyRight ? C.x + C.w - colW : C.x, y: C.y, w: colW, h: C.h },
        vAlign: dp.caption ? (copyHigh ? "top" : "bottom") : "center", autoPolarity: true,
        copyOverPhoto: true, logoOnPhoto: true, logoPhotoCorner: "bottom-right",
        avoidSubject: true,
        bigType: impact, startScale: dp.caption ? 0.82 : impact ? 1.50 : undefined,
        tightLines: impact ? 3 : undefined, maxCPL: impact ? 18 : 28,
        highlight: dp.highlight ? { kind: dp.highlight, colour: dp.highlightColour || "teal", line: "shortest" } : null,
        focalTargetX: copyRight ? 0.24 : 0.76,
      });
    }
    /* Portrait, square and story: the lockup sits low by default, the way a
       poster does, and the subject is framed into the clear part away from it. */
    const colW = dp.caption ? Math.round(C.w * 0.48) : impact
      ? Math.round(C.w * 0.49)
      : dp.negativeSpace ? Math.round(C.w * 0.48)
      : Math.round(Math.min(C.w, tk.ideal * 11));
    const requestedAt = impact || dp.copy === "top" ? "top" : dp.copy === "middle" ? "center" : "bottom";
    const at = person ? (copyHigh ? "top" : "bottom") : requestedAt;
    return blockPlan(G, fit, {
      photo: { x: 0, y: 0, w, h },
      inner: { x: copyRight ? C.x + C.w - colW : C.x, y: C.y, w: colW, h: C.h },
      vAlign: at, autoPolarity: true,
      copyOverPhoto: true, logoOnPhoto: true, logoPhotoCorner: "bottom-right",
      avoidSubject: true,
      bigType: impact, startScale: dp.caption ? 0.82 : impact ? 1.50 : undefined,
      tightLines: impact ? 3 : undefined,
      maxCPL: impact ? 18 : dp.negativeSpace ? 24 : undefined,
      highlight: dp.highlight ? { kind: dp.highlight, colour: dp.highlightColour || "teal", line: impact ? "shortest" : "last" } : null,
      focalTargetX: person ? (copyRight ? 0.24 : 0.76) : (dp.negativeSpace || impact ? 0.76 : undefined),
      focalTargetY: at === "top" ? (cls === "story" ? 0.70 : 0.66)
                  : at === "center" ? 0.5
                  : (cls === "story" ? 0.30 : 0.34),
    });
  },

  /* ---- Modular grid ----------------------------------------------------
     Squares on a field. Some carry a crop of the photograph, some carry flat
     accent, and the copy runs through a channel with nothing in it, so no
     square is ever behind a word. The arrangement is seeded from the
     placement, so every size in a set gets its own composition rather than
     the same one rescaled. */
  mosaic(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const cols = cls === "wide" || cls === "banner" ? 5 : 4;
    const gap = Math.max(2, Math.round(tk.ref * 0.014));
    const cw = (C.w - gap * (cols - 1)) / cols;
    /* Enough rows that two can be given to the words and a block of two can
       still be given to the photograph on one side of them. */
    /* A letterbox gets fewer, taller rows: seven rows on a 628px frame leaves
       the channel too shallow to hold a headline at its proper size. */
    const wide = cls === "wide" || cls === "banner";
    const rows = wide ? Math.max(4, Math.round(C.h / (cw + gap)))
                      : Math.max(7, Math.round(C.h / (cw + gap)));
    const ch = (C.h - gap * (rows - 1)) / rows;
    /* Three rows for the words on anything but a letterbox: two left the
       headline at 55px on a 1080 square, which is a whisper. */
    const chanSpan = wide ? 2 : 3;
    const dp = G.dp || {};
    const chanAt = dp.channel === "low" ? 0.9 : dp.channel === "high" ? 0.1 : 0.5;
    /* On a shallow banner the channel can sit against an edge; its image is
       then wholly on the other side. The old two-row clamp made the lower
       bound exceed the upper bound in every production canvas, silently
       turning high and low into the middle layout. */
    const minChannelRow = 0;
    const maxChannelRow = Math.max(minChannelRow, rows - chanSpan);
    const chanRow = Math.max(minChannelRow, Math.min(maxChannelRow, Math.round((rows - chanSpan) * chanAt)));
    const inner = { x: C.x, y: C.y + chanRow * (ch + gap), w: C.w, h: ch * chanSpan + gap * (chanSpan - 1) };

    const rnd = mulberry(G.seed);
    /* The photograph goes wholly above or wholly below the channel. Never
       across it: a picture behind the headline is the one thing this
       arrangement must not do. */
    const above = chanRow, below = rows - (chanRow + chanSpan);
    const span = Math.min(2, Math.max(above, below));
    const goAbove = above >= span && (below < span || rnd() > 0.5);
    const pr = goAbove ? chanRow - span : chanRow + chanSpan;
    const pc = rnd() > 0.5 ? cols - 2 : 0;
    const photo = { x: Math.round(C.x + pc * (cw + gap)), y: Math.round(C.y + pr * (ch + gap)),
                    w: Math.round(cw * 2 + gap), h: Math.round(ch * span + gap * (span - 1)) };
    const cells = [];
    for (let r = 0; r < rows; r++) {
      if (r >= chanRow && r < chanRow + chanSpan) continue;
      for (let c = 0; c < cols; c++) {
        if (rnd() > (dp.density === "dense" ? 0.82 : dp.density === "sparse" ? 0.42 : 0.62)) continue;
        const cell = { x: Math.round(C.x + c * (cw + gap)), y: Math.round(C.y + r * (ch + gap)),
                       w: Math.round(cw), h: Math.round(ch) };
        if (cell.x < photo.x + photo.w && cell.x + cell.w > photo.x &&
            cell.y < photo.y + photo.h && cell.y + cell.h > photo.y) continue;
        cells.push(cell);
      }
    }
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, photo, mosaic: cells,
      inner, vAlign: "center", tightLines: wide ? 2 : 3, plusses: [],
    });
  },

  /* ---- Poster ----------------------------------------------------------
     Headline on top, a band of photograph under it, button and mark on a
     footer line. Three tiers, read top to bottom, nothing overlapping. */
  poster(G, fit) {
    const { w, h, safe, tk, cls, v } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const logo = v.logo && G.logoImg ? logoPlan(G, { w: C.w, h }, "left", "bottom") : null;
    const footerH = Math.round(Math.max(logo ? logo.h : 0, tk.ideal * 1.25));
    const dp = G.dp || {};
    const footerY = Math.round(C.y + C.h - footerH);
    const usableBottom = footerY - pad * 0.75;
    const usableH = Math.max(tk.ideal * 2.8, usableBottom - C.y);
    const copyShare = cls === "wide" || cls === "banner" ? 0.48 : cls === "story" ? 0.34 : 0.39;
    const copyH = Math.max(tk.ideal * 2.25, Math.round(usableH * copyShare));
    const highlightColour = G.band.id === "teal" ? "sand" : G.band.id === "white" ? "blue" : "teal";
    /* The band can sit above the words instead: picture first, then the line
       that explains it. A different read, same three tiers. */
    if (dp.order === "photo-first") {
      const bandH2 = Math.max(1, Math.round(usableH - copyH - pad));
      const sweep = dp.angled ? Math.round(Math.min(h * 0.055, w * 0.08)) : 0;
      const photoBottomLeft = Math.round(C.y + bandH2 + sweep);
      const photoBottomRight = Math.round(C.y + bandH2 - sweep);
      const messageY = Math.max(photoBottomLeft, photoBottomRight) + pad;
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h },
        photo: { x: 0, y: Math.round(C.y), w, h: Math.max(1, Math.max(photoBottomLeft, photoBottomRight) - C.y) },
        photoClip: dp.angled ? [
          { x: 0, y: C.y }, { x: w, y: C.y },
          { x: w, y: photoBottomRight }, { x: 0, y: photoBottomLeft },
        ] : null,
        inner: { x: C.x, y: messageY, w: C.w, h: Math.max(tk.ideal * 2.25, usableBottom - messageY) },
        vAlign: "center", noLogoReserve: true,
        footer: { x: C.x, y: footerY, w: C.w, h: footerH },
        bigType: !!dp.angled, startScale: dp.angled ? 1.18 : undefined,
        tightLines: 4, maxCPL: dp.angled ? 22 : undefined,
        cta: false,
        highlight: dp.angled ? { kind: "underline", colour: highlightColour, line: "last" } : null,
        logoPhotoCorner: "top-right",
        plusses: [],
      });
    }
    const bandY = Math.round(C.y + copyH + pad);
    const sweep = dp.angled ? Math.round(Math.min(h * 0.055, w * 0.08)) : 0;
    const photoTopLeft = bandY + sweep;
    const photoTopRight = bandY - sweep;
    const photoTop = Math.min(photoTopLeft, photoTopRight);
    /* The photograph continues to the bottom edge. The footer remains the
       safe placement for the CTA and logo, but it now overlays the image
       instead of exposing another colour strip below it. */
    const photoBottom = h;
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h },
      photo: { x: 0, y: photoTop, w, h: Math.max(1, photoBottom - photoTop) },
      photoClip: dp.angled ? [
        { x: 0, y: photoTopLeft }, { x: w, y: photoTopRight },
        { x: w, y: photoBottom }, { x: 0, y: photoBottom },
      ] : null,
      inner: { x: C.x, y: C.y, w: C.w, h: copyH },
      vAlign: "center", noLogoReserve: true,
      footer: { x: C.x, y: footerY, w: C.w, h: footerH },
      bigType: !!dp.angled, startScale: dp.angled ? 1.18 : undefined,
      tightLines: 4, maxCPL: dp.angled ? 22 : undefined,
      cta: false,
      highlight: dp.angled ? { kind: "underline", colour: highlightColour, line: "last" } : null,
      logoOnPhoto: true, logoPhotoCorner: "bottom-left",
      plusses: [],
    });
  },

  /* ---- Typographic ---------------------------------------------------- */
  statement(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const dp = G.dp || {};
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h },
      inner: { x: C.x, y: C.y, w: C.w, h: C.h },
      vAlign: dp.align === "middle" || cls === "banner" ? "center" : dp.align === "bottom" ? "bottom" : "top",
      textAlign: dp.textAlign,
      kicker: !dp.restrained, noPhoto: true, bigType: !dp.restrained,
      startScale: dp.restrained ? 1.05 : dp.impact ? 1.50 : 1.35,
      maxCPL: dp.impact ? 18 : 28,
      tightLines: dp.impact ? 4 : undefined,
      highlight: dp.highlight ? { kind: dp.highlight, colour: dp.highlightColour || "teal", line: "shortest" } : null,
      claimLockup: dp.claim ? { treatment: dp.claimTreatment || "filled" } : null,
      plusses: [],
    });
  },

  /* ---- Pattern only ---------------------------------------------------
     A graphic route, not a texture switch on a photographic layout. The
     Professionals field is the visual and the message gets one deliberately empty
     zone, so this remains readable at every platform crop without needing a
     source image at all. */
  pattern(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const large = G.dp && G.dp.scale === "large";
    const insetX = cls === "wide" || cls === "banner" ? 0.08 : 0.04;
    const inner = {
      x: Math.round(C.x + C.w * insetX),
      y: Math.round(C.y + C.h * (cls === "story" ? 0.22 : 0.16)),
      w: Math.round(C.w * (cls === "wide" || cls === "banner" ? 0.58 : 0.88)),
      h: Math.round(C.h * (cls === "story" ? 0.54 : 0.66)),
    };
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, inner,
      vAlign: "center", kicker: true, noPhoto: true,
      patternOnly: true,
      patternCell: Math.max(28, Math.round(tk.ref * (large ? 0.34 : 0.18))),
      patternAlpha: G.band.id === "charcoal" ? (large ? 0.28 : 0.20) : (large ? 0.20 : 0.13),
      plusses: [],
    });
  },
};

/* Shared tail of every planner: reserve the logo, fit the copy in what is
   left, and report an honest note when something had to give. */
function blockPlan(G, fit, p) {
  const { tk, v } = G;
  const notes = [];
  const inner = p.inner;
  const safeRight = G.w - G.safe.right, safeBottom = G.h - G.safe.bottom;
  const right = Math.min(safeRight, inner.x + inner.w);
  const bottom = Math.min(safeBottom, inner.y + inner.h);
  inner.x = Math.max(G.safe.left, inner.x);
  inner.y = Math.max(G.safe.top, inner.y);
  inner.w = Math.max(1, Math.floor(right - inner.x));
  inner.h = Math.max(1, Math.floor(bottom - inner.y));

  /* If the box a style has produced could not hold one line of type at a
     legible size, do not squeeze: this canvas wants an end frame. Deciding
     it here rather than after three failed fits keeps the reasoning in one
     place and stops a 320x50 banner reporting a panel it overflows. */
  const minPanelH = tk.ideal * (G.cls === "banner" ? 2.0 : 1.15);
  if (v.copy && (inner.h < minPanelH || inner.w < tk.ideal * 2.4)) {
    return { ...p, logo: null, stack: null, micro: true, notes };
  }
  /* A logo-only composition needs a box that can hold the mark at its brand
     minimum with a little air. Below that it is an end frame too, otherwise
     the mark overflows the panel it was supposed to sit inside. */
  if (!v.copy && v.logo && (inner.h < BRAND.logoMinPx * 1.45 || inner.w < BRAND.logoMinPx * 2.6)) {
    return { ...p, logo: null, stack: null, micro: true, notes };
  }

  let logo = null;
  if (v.logo && G.logoImg) {
    /* A style that sized its panel around the logo hands its own measurement
       through. Re-deriving it here against the box it just filled would halve
       it, because logoPlan clamps to half the box height. */
    logo = p.logo || logoPlan(G, inner, "left", "bottom");
    if (logo.belowMin && G.compactLogoImg) {
      const wordmark = G.logoImg;
      G.logoImg = G.compactLogoImg;
      const compact = logoPlan(G, inner, "left", "bottom");
      G.logoImg = wordmark;          /* always restored: G outlives this call */
      if (compact.belowMin) {
        logo = null;
        notes.push({ level: "warn", text: "No room for the logo at the 24px brand minimum, so this size ships without it." });
      } else {
        logo = compact; logo.usedCompact = true;
      }
    } else if (logo.belowMin) {
      logo = null;
      notes.push({ level: "warn", text: "No room for the logo at the 24px brand minimum, so this size ships without it." });
    }
  }

  let stack = null;
  if (v.copy) {
    const reserve = logo && !p.noLogoReserve ? logo.h + tk.pad * 0.85 : 0;
    const avail = inner.h - reserve;
    const baseLines = p.tightLines || (p.bigType ? 4 : (G.cls === "banner" ? 2 : 3));
    /* Native placements re-crop the file into several widget shapes, and the
       only region guaranteed to survive all of them is the centred band. A
       centred lockup is the correct answer there, not an edge column that
       gets sliced off in half the widgets. Colour can bleed, ink cannot. */
    const opts = {
      maxLines: baseLines,
      kicker: !!p.kicker,
      align: !G.strictDesign && G.safe && G.safe.centreBias ? "center" : p.textAlign,
      startPx: p.startScale ? Math.round(tk.ideal * p.startScale)
        : p.bigType ? Math.round(tk.ideal * 1.35) : tk.ideal,
      maxCPL: p.maxCPL,
      subline: p.subline,
      cta: p.cta,
    };
    stack = p.claimLockup
      ? fitClaimStack(G.ctx, inner.w, avail, tk, p.claimLockup.treatment)
      : (p.stack && p.stack.h <= avail ? p.stack : fit(inner.w, avail, opts));
    /* An extra line of type at full size beats the same words shrunk to fit
       three. Legibility first, tidy line count second. */
    if (!p.claimLockup && (!stack || stack.headlinePx < tk.ideal * 0.86) && baseLines < 4) {
      const longer = fit(inner.w, avail, { ...opts, maxLines: baseLines + 1 });
      if (longer && (!stack || longer.headlinePx > stack.headlinePx)) stack = longer;
    }
    // A selected recipe cannot discard its action to make a layout fit.
    // Poster recipes explicitly put that action in their footer instead.
    if (!stack) {
      /* Nothing legible fits. That is not a failure to report on every tile,
         it is a different design: a brand end frame. */
      return { ...p, logo, stack: null, micro: true, notes };
    }
    if (stack.droppedSub) notes.push({ level: "info", text: "Subline dropped, there was no room for it here." });
    if (stack.droppedCta) notes.push({ level: "info", text: "CTA dropped, there was no room for it here." });
  }
  return { ...p, logo, stack, notes };
}

/* The centred lockup, for placements the publisher re-crops itself.
   Taboola and Outbrain take one file and cut it into six widget shapes, so
   the only region certain to survive is the centred band their own guidance
   points at. An edge column is the wrong structure there, however good it
   looks in the master. Colour and photograph still follow the chosen style;
   the words move to the middle, where they will still be there afterwards. */
function centreLockupPlan(G, fit) {
  const { w, h, safe, tk, v } = G;
  const C = contentRect(w, h, safe, tk);
  const pad = Math.round(tk.pad * 1.05);
  const colW = C.w - pad * 2;
  const logo = v.logo && G.logoImg ? logoPlan(G, { w: colW, h }, "center", "bottom") : null;
  const reserve = logo ? logo.h + pad * 0.8 : 0;
  const maxCard = Math.min(C.h, h * 0.76);
  const opts = { maxLines: 3, align: "center", subline: false, maxCPL: 30 };
  let stack = v.copy ? fit(colW, maxCard - pad * 2 - reserve, opts) : null;
  if (!stack && v.copy) stack = fit(colW, maxCard - pad * 2 - reserve, { ...opts, cta: false });
  const needed = (stack ? stack.h : 0) + (logo ? logo.h + (v.copy ? pad * 0.8 : 0) : 0);
  const cardH = Math.min(maxCard, Math.round(needed + pad * 2));
  /* The card sits low rather than dead centre. Widget re-crops eat width,
     not height, so a low card is just as safe and it leaves the person in
     the photograph visible instead of hiding them behind the copy. */
  const cardY = Math.round(C.y + C.h - cardH);
  return {
    photo: { x: 0, y: 0, w, h },
    focalTargetY: Math.max(0.20, Math.min(0.46, (cardY * 0.55) / h)),
    card: { x: C.x, y: cardY, w: C.w, h: cardH, r: Math.round(Math.min(C.w, cardH) * 0.06) },
    inner: { x: C.x + pad, y: cardY + pad, w: colW, h: cardH - pad * 2 },
    vAlign: "top", stack, logo, centred: true, fromCentreBias: true,
    plusses: [],
    notes: [],
  };
}

/* The end frame. Used where the canvas is genuinely too small for a
   sentence: a 320x50 banner, a 100x75 thumbnail. Real banner advertising
   solves this with a mark and a button, not with six point type, so that
   is what the engine does rather than apologising in a warning. */
function microPlan(G) {
  const { w, h, safe, tk } = G;
  const C = contentRect(w, h, safe, tk);
  const pad = Math.max(4, Math.round(tk.pad * 0.6));
  const hasPhoto = !!G.photoImg;

  /* A long thin canvas can carry a photograph beside the mark. Anything
     squarer carries it behind, full bleed, because a flat colour rectangle
     with a small mark on it is not an advertisement. Dropping the picture
     entirely was the old behaviour and it made a 300x250 unusable. */
  const strip = hasPhoto && C.w > C.h * 1.7;
  const photoW = strip ? Math.round(Math.min(C.h * 1.25, C.w * 0.42)) : 0;
  const inner = {
    x: strip ? C.x + photoW + pad : C.x,
    y: C.y, w: C.w - (strip ? photoW + pad : 0), h: C.h,
  };
  const full = hasPhoto && !strip;
  return {
    field: full ? null : { x: 0, y: 0, w, h },
    photo: strip ? { x: 0, y: 0, w: photoW + C.x, h } : (full ? { x: 0, y: 0, w, h } : null),
    inner, vAlign: "center", micro: true, microOverPhoto: full, logo: null, stack: null,
    notes: [],
  };
}

/* =====================================================================
   6. COMPOSE
   ===================================================================== */
export function resolveSafeBox(pl, w, h) {
  return lookupSafeZone(pl && pl.platform, pl && pl.placement, w, h);
}

async function composeAssetOnce(spec) {
  await preloadFonts();
  const {
    w, h, variant, photo, band, headline, subline, cta, kicker,
    logoKey, placement, focal: requestedFocal, showSafe,
  } = spec;
  const focal = requestedFocal && Number.isFinite(requestedFocal.x) && Number.isFinite(requestedFocal.y)
    ? { ...requestedFocal, x: Math.max(0, Math.min(1, requestedFocal.x)), y: Math.max(0, Math.min(1, requestedFocal.y)) } : null;
  /* A design id carries the structure and the decisions inside it. A bare
     layout id still works, and resolves to that structure's first design.

     THE REQUESTED STRUCTURE AND THE DRAWN STRUCTURE ARE TWO DIFFERENT FACTS,
     and this function used to report only the first one. Four things below
     can put a structure on the canvas that nobody asked for: a concept with
     no photograph is set typographically, a canvas too small for a sentence
     runs as a brand end frame, a centre-bias publisher gets a centred
     lockup, and the clean variant is the photograph with no structure over
     it at all. Every one of those used to be reported — to the result card,
     to the placement cards, to the history row and to the learning store —
     as the structure that was never drawn.

     `requested` is what the caller asked for and never moves. `drawn`
     follows the canvas, and is what `finish()` reports as `layout`. The
     seed stays on `requested`, so a rebuild still reproduces byte for
     byte. */
  const design = spec.design ? DESIGNS.find(item => item.id === spec.design) : null;
  const strictDesign = !!spec.design;
  let compatibilityReason = strictDesign && !design
    ? "This selected design is unavailable. Choose a design from the current library. Not exported." : null;
  const requested = normaliseLayout(design ? design.style : spec.layout);
  const noPhotoRoute = requested === "statement" || requested === "pattern";
  let drawn = requested;
  const designParams = design ? design.params : (spec.designParams || {});
  const v = VARIANTS.find(x => x.id === variant) || VARIANTS[3];
  const safe = resolveSafeBox(placement || { w, h }, w, h);
  const tk = tokens(w, h, safe);
  const cls = ratioClass(w, h);

  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = band.bg;
  ctx.fillRect(0, 0, w, h);

  const notes = [];
  /* THE PICTURE AND ITS NAME ARE TWO DIFFERENT FACTS.
     `photoSource` is an already-decoded picture to draw — the size
     adapter's family master, which is a canvas and has no URL. `photo`
     stays the source's own path either way, because two things below key
     off what the file IS rather than what it looks like: photoHasProfessionals
     reads the filename to know the approved library already has Professionals
     shapes composed in, and re-encoding a master to a data URI would
     silently defeat that and put a fourth Professionals on the canvas. So the
     master is passed beside the path, never in place of it. */
  const srcImg = photo ? await loadImg(photo) : null;
  const master = spec.photoSource || null;
  const img = srcImg || master;

  /* A MASTER SERVES A FRAME OF ITS OWN SHAPE, AND ONLY THAT.
     The family master is a crop at the family's ratio, so it is exactly
     right for a photograph that fills the canvas and wrong for one that
     does not. Several structures put the picture in a box whose shape is
     nothing like the canvas — a wide strip across the top of a 4:5 feed
     post, for instance — and feeding those from the master crops the
     same photograph twice: once to the family ratio and again to the
     box. Measured over the real library that cost the 4:5 family more
     than half of the surviving frame, 0.73 of the picture down to 0.27,
     and pushed files past the softness threshold that were comfortably
     under it before. Losing detail is the one thing the adapter exists
     to prevent, so the master is used where it fits and the source is
     used where it does not. The composition still comes from the master
     everywhere the master is the composition. */
  const pickImg = (bw, bh) => {
    if (!master || !srcImg || !(bw > 0 && bh > 0)) return img;
    const ma = master.width / master.height;
    if (Math.abs((bw / bh) / ma - 1) > ASPECT_TOLERANCE) return srcImg;
    /* The master is the adapter's final crop for this ratio. Comparing its
       pixel dimensions with the original here used to select the original
       again whenever a placement was larger than the source. That bypassed
       the adapter and surfaced the exact repair request it had already
       resolved. Matching shape is the contract: use the prepared master for
       that family and let the export canvas perform the final resampling. */
    return master;
  };
  let logoImg = null, compactLogoImg = null;
  if (v.logo || (strictDesign && variant !== "clean")) {
    logoImg = await loadLogo(logoKey, band.logo, notes);
    compactLogoImg = logoKey === COMPACT_LOGO ? logoImg : await loadLogo(COMPACT_LOGO, band.logo, notes);
  } else if (v.copy) {
    /* The end frame below only ever fires on a copy variant, and a mark is
       the one thing it has to show. Without this a 320x50 "copy only" ad
       exports as a flat rectangle with a button and no brand on it at all. */
    compactLogoImg = await loadLogo(COMPACT_LOGO, band.logo, notes);
  }
  /* A photograph can carry the mark in split and angled layouts too, so both
     colourways stay available wherever a logo may move off the colour field. */
  const altSuffix = band.logo === "-inverse" ? "" : "-inverse";
  let logoAltImg = null, compactAltImg = null;
  if (v.logo || (strictDesign && variant !== "clean")) {
    logoAltImg = await loadLogo(logoKey, altSuffix, notes);
    compactAltImg = logoKey === COMPACT_LOGO ? logoAltImg : await loadLogo(COMPACT_LOGO, altSuffix, notes);
  }

  const requestedCtaBg = spec.ctaBg || (band.id === "charcoal" ? COLORS.white : COLORS.charcoal);
  const invalidCtaPair = (band.bg === COLORS.teal && (requestedCtaBg === COLORS.blue || requestedCtaBg === COLORS.teal))
    || (band.bg === COLORS.blue && (requestedCtaBg === COLORS.teal || requestedCtaBg === COLORS.blue));
  const resolvedCtaBg = invalidCtaPair ? COLORS.charcoal : requestedCtaBg;
  if (invalidCtaPair) notes.push({ level: "info", text: "The button was changed to Charcoal because Teal and Professionals Blue may not sit on each other." });
  const C = {
    headline, subline, cta, kicker: strictDesign ? "" : kicker,
    emphasis: String(spec.emphasis || "").trim(),
    fg: band.fg,
    accentInk: band.id === "charcoal" ? band.accent : COLORS.charcoal,
    ctaBg: resolvedCtaBg,
    ctaFg: resolvedCtaBg === COLORS.charcoal ? COLORS.white : COLORS.charcoal,
    headlineLineColours: {},
    bandId: band.id,
  };

  const INK = [];
  const ink = (x, y, iw, ih, colour) => INK.push({ x, y, w: iw, h: ih, colour });
  const safeBounds = { x: safe.left, y: safe.top, w: w - safe.left - safe.right, h: h - safe.top - safe.bottom };

  /* The approved library already has the Professionals shapes composed into the
     photography. Knowing that stops the engine from adding a fourth. */
  const photoHasProfessionals = /photo-plus-/.test(String(photo || ""));
  /* Seeded from what this file actually is, so a composition is stable for a
     given placement and different across the set. */
  const seed = seedOf(`${spec.design || requested}|${w}x${h}|${(placement && placement.platform) || ""}|${(placement && placement.placement) || ""}|${spec.rotationSeed || ""}`);
  // Plan one full composition. Logo/copy variants hide their content only
  // at paint time, so their photo area, seam and alignment cannot jump.
  const planningVariant = strictDesign && variant !== "clean" ? VARIANTS[3] : v;
  const G = { w, h, safe, tk, cls, strictDesign, v: planningVariant, band, logoImg, compactLogoImg, photoImg: img, photoHasProfessionals, seed, dp: designParams, ctx };
  const rawFit = makeFitter(ctx, C, tk);
  const fit = (width, height, options = {}) => rawFit(width, height, {
    ...options, sublineRequired: strictDesign || options.sublineRequired,
  });

  /* Declared before the early return below, because the report is built the
     same way for every variant. */
  let cropCoverage = 1, upscale = 1, cropZoom = 1, plan = null, photoDrawn = false;
  let photoRect = null, photoSourceSize = null, photoAdaptation = null, logoDrawn = false;
  let photoFocalUsed = null, photoImageUsed = null;
  let headlineDrawn = false, sublineDrawn = false, ctaDrawn = false;
  let emphasisDrawn = false;
  let emphasisKind = null, emphasisColour = null;
  const textBounds = [];
  let geometry = null;
  /* Which picture the photograph was actually drawn from. The adapter's
     family master and the original source are both legitimate answers
     and they mean different things to anyone reading these numbers: a
     cropZoom of 0.9 against a master is not the same claim as a cropZoom
     of 0.9 against the source. The file says which one it is rather than
     leaving it to be inferred. */
  let drewFrom = null;
  let contrast = contrastRatio(hexL(band.fg), hexL(band.bg));
  let veilAlpha = 0, backdrop = null, refreshBackdrop = () => {};

  if (compatibilityReason) return finish();

  /* The clean variant is the photograph and nothing else. No planner runs,
     so no structure is drawn: reporting the requested one here would credit
     a design with a file it had no hand in. */
  if (!v.copy && !v.logo && img) {
    drawn = "photo";
    let pi = pickImg(w, h);
    let box = { x: 0, y: 0, w, h };
    const quality = photoFitMetrics(pi, box);
    let f = focal ? { ...focal, coverage: focalCoverage(pi, box, focal) } : bestFocal(pi, w, h);
    if (!quality.usable || (f.coverage != null && f.coverage < 0.42)) {
      pi = srcImg || img;
      box = containPhotoBox(pi, contentRect(w, h, safe, tk));
      f = { x: 0.5, y: 0.5, coverage: 1, zoom: 1 };
      photoAdaptation = "contained-original";
      notes.push({ level: "info", text: "The complete original is fitted inside a solid field to preserve its detail and framing." });
    }
    cropCoverage = f.coverage != null ? f.coverage : 1;
    cropZoom = photoFitMetrics(pi, box).retained;
    upscale = drawPhoto(ctx, pi, box, f);
    photoFocalUsed = f;
    photoImageUsed = pi;
    photoRect = { ...box };
    photoSourceSize = { w: pi.naturalWidth || pi.width, h: pi.naturalHeight || pi.height };
    drewFrom = pi === master ? "master" : "source";
    photoDrawn = true;
    if (showSafe) drawSafeOutline();
    return finish();
  }

  if (!strictDesign && safe.centreBias && v.copy && img && !noPhotoRoute) {
    drawn = "centred";
    plan = blockPlan(G, fit, centreLockupPlan(G, fit));
    notes.push({ level: "info", text: "This publisher re-crops the file into several widget shapes, so the words sit in the centred band its own guidance asks for." });
  } else {
    /* An unknown structure falls back to the anchor. It draws an anchor, so
       it has to say anchor. */
    if (!STYLE_PLANNERS[drawn]) drawn = "editorial";
    plan = STYLE_PLANNERS[drawn](G, fit);
  }
  /* Typographic and pattern-led routes have no photograph by definition;
     every other style needs one. */
  if (!img && drawn !== "statement" && drawn !== "pattern") {
    if (strictDesign) {
      compatibilityReason = "This design needs a photograph. Add a suitable original or explicitly choose a typography design. Not exported.";
      return finish();
    }
    drawn = "statement";
    plan = STYLE_PLANNERS.statement(G, fit);
    notes.push({ level: "info", text: "No photograph on this concept, so it is set typographically." });
  }
  if (plan && plan.micro && (v.copy || v.logo)) {
    if (strictDesign) {
      compatibilityReason = "The selected design cannot fit its headline, action and logo safely in this format. Shorten the copy, remove this format or choose another design. Not exported.";
      return finish();
    }
    drawn = "micro";
    plan = microPlan(G);
    notes.push({ level: "info", text: v.copy
      ? "Too small for a sentence, so this size runs as a brand end frame: mark and button only."
      : "Too small for a laid-out logo lockup, so this size runs as a brand end frame." });
  }

  /* A crop warning should change the composition. Quality is assessed at
     export dimensions, before painting, then the actual original is fitted
     into a source-sized rectangle. Copy which used to sit over that photo
     moves to an independent field so no text is left floating over a mat. */
  if (img && plan.photo && !plan.noPhoto) {
    let pi = pickImg(plan.photo.w, plan.photo.h);
    const quality = photoFitMetrics(pi, plan.photo);
    const analysis = focal ? { ...focal, coverage: focalCoverage(pi, plan.photo, focal) }
      : bestFocal(pi, plan.photo.w, plan.photo.h, plan.focalTargetY, plan.focalTargetX);
    const clippedFraction = plan.photoEllipse ? Math.PI / 4
      : plan.photoClip ? polygonArea(plan.photoClip) / (plan.photo.w * plan.photo.h) : 1;
    const needsRepair = !quality.usable || quality.retained * clippedFraction < MIN_PHOTO_RETAINED
      || (analysis.coverage != null && analysis.coverage < 0.42);
    const adaptedMaster = pi === master;
    if (adaptedMaster && needsRepair) {
      photoAdaptation = "ratio-family-master";
      notes.push({ level: "info", text: "The size adapter prepared this photograph for the placement family automatically." });
    }
    if (needsRepair && strictDesign && !plan.photoContain && !adaptedMaster) {
      compatibilityReason = quality.upscale > SOFT_UPSCALE
        ? "The original is too small for this design's photo area. Supply a larger original or choose another design. The selected layout was not replaced. Not exported."
        : "This photograph loses too much of its framing in the selected design. Choose a photograph closer to this shape or another design. The selected layout was not replaced. Not exported.";
    }
    if ((!strictDesign && needsRepair) || plan.photoContain) {
      const overlay = plan.copyOverPhoto || plan.microOverPhoto || plan.fieldOver || plan.card || !plan.field;
      if (needsRepair && overlay && !plan.micro) {
        const area = contentRect(w, h, safe, tk);
        const gallery = designParams.negativeSpace ? "right"
          : area.w > area.h * 1.25 ? (designParams.copy === "right" ? "left" : "right")
          : plan.vAlign === "top" ? "bottom" : "top";
        const next = STYLE_PLANNERS.gallery({ ...G, dp: { gallery } }, fit);
        if (!next.micro) { plan = next; drawn = "gallery"; }
        else if (area.w > area.h * 1.7) {
          /* A narrow banner cannot support two full columns. Use its compact
             structure, with the complete photograph in a small side slot
             and the logo/button on the existing neutral field. */
          plan = microPlan(G);
          drawn = "micro";
          notes.push({ level: "info", text: "This narrow size uses a compact logo and button beside the complete photograph." });
        }
      }
      if (!(plan.micro && plan.microOverPhoto)) {
        pi = srcImg || img;
        const r = plan.photo;
        const slot = {
          x: Math.max(safe.left, r.x), y: Math.max(safe.top, r.y),
          w: Math.max(1, Math.min(w - safe.right, r.x + r.w) - Math.max(safe.left, r.x)),
          h: Math.max(1, Math.min(h - safe.bottom, r.y + r.h) - Math.max(safe.top, r.y)),
        };
        plan.photo = containPhotoBox(pi, slot);
        plan.photoImage = pi;
        plan.photoContain = true;
        if (!strictDesign) { plan.photoClip = null; plan.photoEllipse = false; plan.photoRound = false; }
        plan.field = plan.field || { x: 0, y: 0, w, h };
        plan.photoFocal = { x: 0.5, y: 0.5, coverage: 1, zoom: 1 };
        photoAdaptation = needsRepair ? "contained-original" : "complete-original";
        if (needsRepair) notes.push({ level: "info", text: "The photo area was adapted to keep the complete original sharp. The message and logo stay inside the safe area." });
      }
    }
  }
  notes.push(...(plan.notes || []));
  geometry = {
    photo: plan.photo ? { ...plan.photo } : null,
    photoClip: plan.photoClip ? plan.photoClip.map(point => ({ ...point })) : null,
    photoEllipse: !!plan.photoEllipse, photoRound: !!plan.photoRound,
    field: plan.field ? { ...plan.field } : null,
    fieldPolygon: plan.fieldPolygon ? plan.fieldPolygon.map(point => ({ ...point })) : null,
    copy: plan.inner ? { ...plan.inner } : null,
    logo: null, recipeParams: { ...designParams },
    highlight: plan.highlight ? { ...plan.highlight } : null,
  };

  /* ---- paint ---- */
  const paintField = () => {
    if (!plan.field) return;
    ctx.fillStyle = band.bg;
    if (plan.fieldPolygon && tracePolygon(ctx, plan.fieldPolygon)) ctx.fill();
    else ctx.fillRect(plan.field.x, plan.field.y, plan.field.w, plan.field.h);
  };
  if (!plan.fieldOver) paintField();

  if (img && plan.photo && !plan.noPhoto) {
    const box = plan.photo;
    const pi = plan.photoImage || pickImg(box.w, box.h);
    const f = plan.photoFocal || (focal ? { ...focal, coverage: focalCoverage(pi, box, focal) }
      : bestFocal(pi, box.w, box.h, plan.focalTargetY, plan.focalTargetX));
    cropCoverage = f.coverage != null ? f.coverage : 1;
    const clippedFraction = plan.photoEllipse ? Math.PI / 4
      : plan.photoClip ? polygonArea(plan.photoClip) / (box.w * box.h) : 1;
    cropZoom = photoFitMetrics(pi, box).retained * clippedFraction;
    const clipped = !!(plan.photoRound || plan.photoClip || plan.photoEllipse);
    if (clipped) {
      ctx.save();
      if (plan.photoClip && tracePolygon(ctx, plan.photoClip)) ctx.clip();
      if (plan.photoEllipse) {
        ctx.beginPath();
        ctx.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
        ctx.clip();
      }
      if (plan.photoRound) { roundRect(ctx, box.x, box.y, box.w, box.h, box.r || tk.radius); ctx.clip(); }
    }
    upscale = drawPhoto(ctx, pi, box, f);
    photoFocalUsed = f;
    photoImageUsed = pi;
    photoRect = { x: box.x, y: box.y, w: box.w, h: box.h };
    photoSourceSize = { w: pi.naturalWidth || pi.width, h: pi.naturalHeight || pi.height };
    drewFrom = pi === master ? "master" : "source";
    photoDrawn = true;
    if (clipped) ctx.restore();
  }
  if (plan.fieldOver) paintField();

  /* Directional gestures use only supplied highlighter SVGs. A requested
     colour is ignored when it would place Teal on Blue or Blue on Teal. */
  for (const d of (plan.decorations || [])) {
    const colour = COLORS[d.colour] || band.accent;
    const conflicts = (band.bg === COLORS.teal && colour === COLORS.blue)
      || (band.bg === COLORS.blue && colour === COLORS.teal)
      || colour === band.bg;
    if (!conflicts) {
      const mark = await drawTintedHighlighter(ctx, d.kind, colour, d.box, d.rotation || 0, safeBounds);
      if (mark) ink(mark.x, mark.y, mark.w, mark.h, null);
    }
  }
  /* The modular grid's flat cells. Drawn after the photograph so a cell can
     sit over the picture's edge the way the reference does. */
  if (plan.mosaic && plan.mosaic.length) {
    const rnd = mulberry(G.seed ^ 0x9e3779b9);
    for (const cell of plan.mosaic) {
      const r2 = rnd();
      /* Two greys and the accent, at the strength the reference uses: squares
         you can actually see, not a whisper of tone on tone. */
      ctx.fillStyle = r2 > 0.78 ? band.accent
        : r2 > 0.40 ? (band.id === "charcoal" ? "rgba(255,255,255,.30)" : "rgba(51,51,51,.16)")
                    : (band.id === "charcoal" ? "rgba(255,255,255,.13)" : "rgba(51,51,51,.07)");
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
    }
  }
  if (plan.card) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.20)";
    ctx.shadowBlur = Math.round(tk.ref * 0.045);
    ctx.shadowOffsetY = Math.round(tk.ref * 0.010);
    ctx.fillStyle = band.bg;
    roundRect(ctx, plan.card.x, plan.card.y, plan.card.w, plan.card.h, plan.card.r);
    ctx.fill();
    ctx.restore();
  }
  /* Type sits on a solid field in every style, so contrast is a property of
     the palette, not a hope. The one exception is a logo dropped onto the
     photograph, which gets measured and scrimmed if the picture is busy. */
  const inner = plan.inner;
  const overPhoto = plan.copyOverPhoto != null ? plan.copyOverPhoto : !plan.field && !plan.card;

  if (plan.micro) {
    const mark = band.id === "teal" && !plan.microOverPhoto ? null : (compactLogoImg || logoImg);
    if (v.logo && band.id === "teal" && !plan.microOverPhoto) {
      notes.push({ level: "info", text: "The logo was omitted because no approved logo colourway may sit directly on the Teal field." });
    }
    const gap = Math.max(4, Math.round(tk.pad * 0.6));
    /* The mark is sized first and the button gets what is left. The other
       way round produces a thumbnail-sized logo beside a huge pill, which
       is both off brand and the wrong hierarchy. */
    let lw = 0, lh = 0;
    if (mark) {
      const ratio = mark.width / mark.height;
      lh = Math.min(inner.h * 0.78, Math.max(BRAND.logoMinPx, tk.ref * 0.13));
      lw = lh * ratio;
      const cap = inner.w * (cta ? 0.46 : 0.9);
      if (lw > cap) { lw = cap; lh = lw / ratio; }
      if (lh < BRAND.logoMinPx) { lh = Math.min(BRAND.logoMinPx, inner.h); lw = lh * ratio; }
      if (lw > inner.w) { lw = inner.w; lh = lw / ratio; }
    }
    let ctaPx = 0, ctaW = 0, ctaH = 0;
    const room = inner.w - lw - gap;
    if (cta && v.copy && room > tk.ideal * 3) {
      ctaPx = Math.max(10, Math.round(Math.min(tk.ideal * 0.92, inner.h * 0.42)));
      setFont(ctx, 700, ctaPx);
      ctaW = Math.round(ctx.measureText(cta).width + ctaPx * 2.4);
      ctaH = Math.round(ctaPx * 2.4);
      while (ctaW > room && ctaPx > 10) {
        ctaPx = Math.round(ctaPx * 0.9);
        setFont(ctx, 700, ctaPx);
        ctaW = Math.round(ctx.measureText(cta).width + ctaPx * 2.4);
        ctaH = Math.round(ctaPx * 2.4);
      }
      if (ctaW > room || ctaH > inner.h) { ctaPx = 0; ctaW = 0; }
    }
    const totalW = lw + (ctaW ? gap + ctaW : 0);
    const x0 = Math.round(inner.x + (ctaW ? 0 : Math.max(0, (inner.w - totalW) / 2)));
    if (mark && lh > 0) {
      const ly = Math.round(inner.y + (inner.h - lh) / 2);
      if (plan.microOverPhoto) {
        const snap = document.createElement("canvas");
        snap.width = w; snap.height = h;
        snap.getContext("2d", { willReadFrequently: true }).drawImage(c, 0, 0);
        const r = ensureContrast(ctx, snap,
          { x: x0 - gap, y: ly - gap, w: lw + gap * 2, h: lh + gap * 2 }, band.fg, WCAG_AA, w, h);
        veilAlpha = r.alpha;
        backdrop = snap;
      }
      ctx.drawImage(mark, x0, ly, Math.round(lw), Math.round(lh));
      logoDrawn = v.logo && lh >= BRAND.logoMinPx - 0.5;
      ink(x0, ly, Math.round(lw), Math.round(lh), band.fg);
      if (lh < BRAND.logoMinPx - 0.5) notes.push({ level: "warn", text: "This size cannot hold the logo at the 24px brand minimum." });
    } else if (!ctaW) {
      /* Neither a mark nor a button fits. Shipping a blank colour rectangle
         would be worse than an ugly one, so set the headline at the floor. */
      const last = fitStack(ctx, C, inner.w, inner.h, tk, { maxLines: 2, cta: false, subline: false, floorPx: 11, startPx: tk.floor });
      if (last) {
        last.draw(ctx, inner.x, Math.round(inner.y + (inner.h - last.h) / 2), C, ink);
        headlineDrawn = true;
      }
      else notes.push({ level: "warn", text: "Nothing legible fits on a canvas this small. Do not ship this size." });
    }
    if (ctaW) {
      const bx = Math.round(inner.x + inner.w - ctaW);
      const by = Math.round(inner.y + (inner.h - ctaH) / 2);
      ctx.fillStyle = C.ctaBg;
      pill(ctx, bx, by, ctaW, ctaH);
      ctx.fill();
      setFont(ctx, 700, ctaPx);
      const m = measureLine(ctx, cta);
      ctx.fillStyle = C.ctaFg;
      ctx.fillText(cta, bx + ctaPx * 1.2, by + ctaH / 2 + m.asc / 2);
      ctaDrawn = true;
      ink(bx, by, ctaW, ctaH);
    }
    if (showSafe) drawSafeOutline();
    return finish();
  }

  let stackTop = inner.y;
  const stackX = plan.stack && plan.stack.align === "center"
    ? Math.round(inner.x + Math.max(0, (inner.w - plan.stack.colW) / 2)) : inner.x;
  let logo = plan.logo;

  /* Teal is the main field colour, but none of the approved logo masters is
     intended to sit directly on it. When a photograph is available, the mark
     moves into that photographic area. A flat Teal statement simply omits the
     mark and reports why; drawing a white logo or inventing a backplate would
     break the brand rule in a different way. */
  const logoCanLiveOnPhoto = !!(logo && img && plan.photo && !plan.noPhoto && !plan.photoEllipse);
  const logoOnPhoto = !!(logo && (plan.logoOnPhoto || (band.id === "teal" && logoCanLiveOnPhoto)));
  if (logo && band.id === "teal" && !logoOnPhoto) {
    logo = null;
    notes.push({ level: "info", text: "The logo was omitted because no approved logo colourway may sit directly on the Teal field." });
  }
  const footerLogo = !!(plan.footer && !logoOnPhoto);
  const inlineLogo = !!(logo && !footerLogo && !logoOnPhoto);
  const contentH = (plan.stack ? plan.stack.h : 0) + (inlineLogo ? logo.h + (planningVariant.copy ? tk.pad * 0.85 : 0) : 0);
  if (plan.vAlign === "center") stackTop = Math.round(inner.y + Math.max(0, (inner.h - contentH) / 2));
  else if (plan.vAlign === "bottom") stackTop = Math.round(inner.y + Math.max(0, inner.h - contentH));
  /* A fractional measured stack height must round inward at the lower safe
     edge. Rounding its origin up can otherwise spill the final glyph by a
     fraction of a pixel even though the fit itself was correct. */
  stackTop = Math.max(Math.ceil(inner.y), Math.min(stackTop,
    Math.floor(Math.min(inner.y + inner.h, h - safe.bottom) - contentH)));

  /* A copy of the frame with no type on it. Every mark's contrast is measured
     against this afterwards, so the number in the report is what a person
     actually sees rather than what the palette promised. */
  backdrop = document.createElement("canvas");
  backdrop.width = w; backdrop.height = h;
  backdrop.getContext("2d", { willReadFrequently: true }).drawImage(c, 0, 0);
  refreshBackdrop = () => {
    const bx = backdrop.getContext("2d");
    bx.clearRect(0, 0, w, h);
    bx.drawImage(c, 0, 0);
  };

  const centredLockup = plan.stack ? plan.stack.align === "center" : !!safe.centreBias;
  let logoY = logo ? Math.round(plan.vAlign === "center" && !planningVariant.copy
    ? inner.y + (inner.h - logo.h) / 2
    : inner.y + inner.h - logo.h) : 0;
  let logoX = logo ? Math.round(centredLockup ? inner.x + (inner.w - logo.w) / 2 : inner.x) : 0;

  /* A logo on photography gets its own corner and its own polarity. The box
     stays inside both the photograph and the platform safe area, including on
     angled crops. */
  if (logo && logoOnPhoto) {
    const pb = plan.photo;
    const inset = Math.max(6, Math.round(tk.pad * 0.72));
    const leftEdge = Math.max(safe.left, pb.x + inset);
    const topEdge = Math.max(safe.top, pb.y + inset);
    const rightEdge = Math.min(w - safe.right, pb.x + pb.w - inset);
    const bottomEdge = Math.min(h - safe.bottom, pb.y + pb.h - inset);
    const maxW = Math.max(1, rightEdge - leftEdge);
    const maxH = Math.max(1, bottomEdge - topEdge);
    const scale = Math.min(1, maxW / logo.w, maxH / logo.h);
    logo.w = Math.round(logo.w * scale);
    logo.h = Math.round(logo.h * scale);
    if (logo.h < BRAND.logoMinPx - 0.5) {
      logo = null;
      notes.push({ level: "warn", text: "The photographic area cannot hold the logo at the 24px brand minimum, so this size ships without it." });
    } else {
      const corner = plan.logoPhotoCorner || "bottom-right";
      const right = corner.includes("right");
      const bottom = corner.includes("bottom");
      logoX = Math.round(right ? rightEdge - logo.w : leftEdge);
      logoY = Math.round(bottom ? bottomEdge - logo.h : topEdge);
      if (plan.photoClip) {
        const xs = right ? [rightEdge - logo.w, leftEdge] : [leftEdge, rightEdge - logo.w];
        const ys = bottom ? [bottomEdge - logo.h, topEdge] : [topEdge, bottomEdge - logo.h];
        const fits = (x, y) => [[x,y], [x + logo.w,y], [x,y + logo.h], [x + logo.w,y + logo.h]]
          .every(([px, py]) => pointInPolygon({ x: px, y: py }, plan.photoClip));
        const candidates = ys.flatMap(y => xs.map(x => ({ x, y }))).filter(b => fits(b.x, b.y));
        if (candidates.length) { logoX = Math.round(candidates[0].x); logoY = Math.round(candidates[0].y); }
        else {
          logo = null;
          notes.push({ level: "warn", text: "The angled photo area cannot hold the logo inside the safe area. Choose a layout with a separate logo area." });
        }
      }
    }
  }

  let logoUsesInverse = band.logo === "-inverse";

  /* Which approved foreground reads better on the untouched photograph. */
  if (plan.autoPolarity && overPhoto && plan.stack) {
    const t = plan.stack ? stackTop : logoY;
    const b = stackTop + (plan.stack ? plan.stack.h : 0);
    const probe = { x: inner.x, y: t, w: inner.w, h: Math.max(1, b - t) };
    const forWhite = worstBackdrop(backdrop, probe, true);
    const forDark = worstBackdrop(backdrop, probe, false);
    const whiteRatio = contrastRatio(hexL(COLORS.white), forWhite.l);
    const darkRatio = contrastRatio(hexL(COLORS.charcoal), forDark.l);
    const wantWhite = whiteRatio >= darkRatio;
    C.fg = wantWhite ? COLORS.white : COLORS.charcoal;
    C.accentInk = C.fg;
    if (logoImg && logoAltImg) {
      if (!logoOnPhoto && wantWhite !== logoUsesInverse) {
        const swap = logoImg; logoImg = logoAltImg; logoAltImg = swap;
        const swapC = compactLogoImg; compactLogoImg = compactAltImg; compactAltImg = swapC;
        logoUsesInverse = wantWhite;
      }
    }
  }

  if (logo && logoOnPhoto && logoImg && logoAltImg) {
    const probe = { x: logoX, y: logoY, w: logo.w, h: logo.h };
    const forWhite = worstBackdrop(backdrop, probe, true);
    const forDark = worstBackdrop(backdrop, probe, false);
    const whiteRatio = contrastRatio(hexL(COLORS.white), forWhite.l);
    const darkRatio = contrastRatio(hexL(COLORS.charcoal), forDark.l);
    const wantInverse = whiteRatio >= darkRatio;
    if (wantInverse !== logoUsesInverse) {
      const swap = logoImg; logoImg = logoAltImg; logoAltImg = swap;
      const swapC = compactLogoImg; compactLogoImg = compactAltImg; compactAltImg = swapC;
      logoUsesInverse = wantInverse;
    }
  }

  /* Measure first, always. Deciding whether to check by asking "is this over a
     photograph" was a guess, and it missed a flat accent square landing under a
     headline in the modular grid. Measuring costs one read of the canvas and
     never lies. */
  if (plan.stack || inlineLogo) {
    /* Measure the copy lockup without changing the photograph. */
    const top = plan.stack ? stackTop : logoY;
    const bot = inlineLogo ? logoY + logo.h : stackTop + contentH;
    const contrastRect = {
      x: inner.x - tk.pad * 0.6, y: top - tk.pad * 0.6,
      w: inner.w + tk.pad * 1.2, h: (bot - top) + tk.pad * 1.2,
    };
    const res = ensureContrast(ctx, backdrop, contrastRect, C.fg);
    veilAlpha = res.alpha;
    if (res.ratio < WCAG_AA) {
      notes.push({ level: "warn", text: `The photograph is too busy under the words here: ${res.ratio.toFixed(1)}:1 against the 4.5:1 the guidelines ask for. Move the copy or pick a calmer picture.` });
    }
  }

  if (logo && logoOnPhoto) {
    const logoInk = logoUsesInverse ? COLORS.white : COLORS.charcoal;
    const inset = Math.max(4, Math.round(tk.pad * 0.38));
    const res = ensureContrast(ctx, backdrop, {
      x: logoX - inset, y: logoY - inset,
      w: logo.w + inset * 2, h: logo.h + inset * 2,
    }, logoInk, WCAG_AA * 1.06, w, h);
    veilAlpha = Math.max(veilAlpha, res.alpha);
  }

  /* Emphasis is authored once for the campaign, never inferred from which
     line happens to be shortest at this ratio. Empty means no highlighter. */
  if (v.copy && plan.stack && plan.highlight && C.emphasis) {
    const lines = plan.stack.parts.hl.lines;
    const phrase = C.emphasis.replace(/\s+/g, " ");
    const runs = lines.flatMap((line, index) => {
      const start = line.t.indexOf(phrase);
      if (start < 0 || line.t.indexOf(phrase, start + 1) >= 0) return [];
      const before = line.t[start - 1] || "", after = line.t[start + phrase.length] || "";
      if (/[\p{L}\p{N}]/u.test(before) || /[\p{L}\p{N}]/u.test(after)) return [];
      return [{ index, start, end: start + phrase.length }];
    });
    const normalizedHeadline = String(headline).replace(/\s+/g, " ");
    const uniquePhrase = normalizedHeadline.indexOf(phrase) === normalizedHeadline.lastIndexOf(phrase);
    const run = runs.length === 1 && uniquePhrase ? runs[0] : null;
    const lineIndex = run ? run.index : -1;
    const line = lines[lineIndex];
    const kind = plan.highlight.kind;
    const colour = COLORS[plan.highlight.colour] || band.accent;
    const conflicts = colour === band.bg
      || (band.bg === COLORS.teal && colour === COLORS.blue)
      || (band.bg === COLORS.blue && colour === COLORS.teal);
    if (!run) {
      compatibilityReason = "The emphasis phrase must appear once in the headline and fit on one line. Choose a shorter exact phrase or clear the emphasis field. Not exported.";
    } else if (conflicts) {
      compatibilityReason = "The selected highlighter cannot be used on this background. Choose a neutral background or clear the emphasis field. Not exported.";
    } else if (line) {
      setFont(ctx, plan.stack.parts.hl.weight, plan.stack.headlinePx);
      const prefixWidth = ctx.measureText(line.t.slice(0, run.start)).width;
      const phraseWidth = ctx.measureText(phrase).width;
      const kickerOffset = plan.stack.parts.kicker
        ? plan.stack.parts.kicker.h + plan.stack.gaps.kicker : 0;
      const lineTop = stackTop + kickerOffset + lineIndex * plan.stack.parts.hl.lh;
      const lineX = (plan.stack.align === "center"
        ? stackX + Math.round((plan.stack.colW - line.w) / 2) : stackX) + prefixWidth;
      const underline = kind === "underline";
      const underlineBox = () => ({
        x: lineX, y: lineTop + plan.stack.parts.hl.firstAsc + line.desc + plan.stack.headlinePx * 0.08,
            w: phraseWidth, h: plan.stack.parts.hl.lh * 0.14,
            maxH: plan.stack.parts.hl.lh * 0.12,
      });
      const box = underline
        ? underlineBox()
        : { x: lineX - plan.stack.headlinePx * 0.10,
            y: lineTop - plan.stack.headlinePx * 0.06,
            w: phraseWidth + plan.stack.headlinePx * 0.22,
            h: plan.stack.parts.hl.lh * 1.05,
            maxH: plan.stack.parts.hl.lh * 1.02 };
      // Keep the selected artwork. Never swap it or highlight other words
      // when the chosen phrase does not fit the intact master.
      refreshBackdrop();
      const underlineRotation = C.fg === COLORS.white ? 0 : -1.2;
      const mark = await drawTintedHighlighter(ctx, kind, colour, box, underline ? underlineRotation : -0.6, safeBounds);
      if (!underline) {
        const probe = {
          x: lineX, y: lineTop + plan.stack.parts.hl.firstAsc - line.asc,
          w: phraseWidth, h: line.asc + line.desc,
        };
        const worst = worstBackdrop(c, probe, false);
        if (contrastRatio(hexL(COLORS.charcoal), worst.l) < WCAG_AA) {
          ctx.drawImage(backdrop, 0, 0);
          compatibilityReason = "The selected highlighter cannot keep this phrase readable at its original proportions. Use a shorter phrase or a neutral background. Not exported.";
        }
      }
      if (mark && !compatibilityReason) {
        ink(mark.x, mark.y, mark.w, mark.h, null);
        emphasisDrawn = true;
        emphasisKind = kind;
        emphasisColour = colour;
        if (!underline) C.headlineRuns = { [lineIndex]: { ...run, colour: COLORS.charcoal } };
      } else if (!mark) {
        compatibilityReason = "The selected highlighter does not fit inside the safe area. Shorten the emphasis phrase or choose another format. Not exported.";
      }
      refreshBackdrop();
    }
  }

  if (v.copy && plan.stack) {
    const stack = plan.stack, parts = stack.parts;
    let top = stackTop;
    const addTextBounds = (kind, part) => {
      if (!part) return;
      let baseline = top + part.firstAsc;
      for (const line of part.lines) {
        const x = stackX + (stack.align === "center" ? Math.round((stack.colW - line.w) / 2) : 0);
        textBounds.push({ kind, x, y: baseline - line.asc, w: line.w, h: line.asc + line.desc });
        baseline += part.lh;
      }
      top += part.h;
    };
    if (parts.kicker) { addTextBounds("kicker", parts.kicker); top += stack.gaps.kicker; }
    addTextBounds("headline", parts.hl);
    if (parts.sub) { top += stack.gaps.sub; addTextBounds("subline", parts.sub); }
    if (parts.cta) {
      top += stack.gaps.cta;
      textBounds.push({ kind: "cta", x: stackX + (stack.align === "center" ? Math.round((stack.colW - parts.cta.w) / 2) : 0),
        y: top, w: parts.cta.w, h: parts.cta.h });
    }
    plan.stack.draw(ctx, stackX, stackTop, C, ink);
    headlineDrawn = !!plan.stack.parts.hl.lines.length;
    sublineDrawn = !!plan.stack.parts.sub;
    ctaDrawn = !!plan.stack.parts.cta;
  }

  if (plan.footer) {
    /* A footer line carries the mark and the button side by side, which is the
       structure a poster reads fastest and the one a stacked lockup cannot do. */
    const f = plan.footer;
    let cx2 = f.x;
    if (footerLogo && logo && logoImg) {
      const src = logo.usedCompact ? compactLogoImg : logoImg;
      const ly2 = Math.round(f.y + (f.h - logo.h) / 2);
      if (v.logo) {
        ctx.drawImage(src, Math.round(f.x), ly2, logo.w, logo.h);
        logoDrawn = true;
        ink(Math.round(f.x), ly2, logo.w, logo.h, logoUsesInverse ? COLORS.white : COLORS.charcoal);
        textBounds.push({ kind: "logo", x: Math.round(f.x), y: ly2, w: logo.w, h: logo.h });
      }
      if (geometry) geometry.logo = { x: Math.round(f.x), y: ly2, w: logo.w, h: logo.h };
      cx2 = f.x + logo.w + tk.pad;
    }
    if (v.copy && cta) {
      let cpx = Math.max(ASSET_TYPE_ROLES.cta.minPx, Math.min(Math.floor(f.h / 2.5), Math.round((plan.stack ? plan.stack.headlinePx : tk.ideal) * tk.ctaRatio)));
      setFont(ctx, ASSET_TYPE_ROLES.cta.weight, cpx);
      let m2 = measureLine(ctx, cta);
      while (m2.w + cpx * 2.5 > f.x + f.w - cx2 && cpx > ASSET_TYPE_ROLES.cta.minPx) {
        cpx--;
        setFont(ctx, ASSET_TYPE_ROLES.cta.weight, cpx);
        m2 = measureLine(ctx, cta);
      }
      const bw = Math.round(m2.w + cpx * 2.5), bh = Math.round(cpx * 2.5);
      if (bw <= f.x + f.w - cx2 && bh <= f.h) {
        const bx2 = Math.round(f.x + f.w - bw), by2 = Math.round(f.y + (f.h - bh) / 2);
        ctx.fillStyle = C.ctaBg; pill(ctx, bx2, by2, bw, bh); ctx.fill();
        setFont(ctx, 700, cpx);
        ctx.fillStyle = C.ctaFg;
        ctx.fillText(cta, bx2 + cpx * 1.25, by2 + bh / 2 + m2.asc / 2);
        ctaDrawn = true;
        ink(bx2, by2, bw, bh, null);
        textBounds.push({ kind: "cta", x: bx2, y: by2, w: bw, h: bh });
      }
    }
  }
  if (logo && !footerLogo && geometry) geometry.logo = { x: logoX, y: logoY, w: logo.w, h: logo.h };
  if (v.logo && logo && logoImg && !footerLogo) {
    const src = logo.usedCompact ? compactLogoImg : logoImg;
    ctx.drawImage(src, logoX, logoY, logo.w, logo.h);
    logoDrawn = true;
    ink(logoX, logoY, logo.w, logo.h, logoUsesInverse ? COLORS.white : COLORS.charcoal);
    textBounds.push({ kind: "logo", x: logoX, y: logoY, w: logo.w, h: logo.h });
  }

  if (showSafe) drawSafeOutline();

  return finish();

  function drawSafeOutline() {
    ctx.save();
    const hard = safe.kind === "hard";
    ctx.strokeStyle = hard ? "rgba(255,0,90,.92)" : "rgba(0,120,255,.75)";
    ctx.setLineDash([Math.max(4, w * 0.008), Math.max(4, w * 0.008)]);
    ctx.lineWidth = Math.max(2, Math.round(tk.ref * 0.005));
    ctx.strokeRect(safe.left, safe.top, w - safe.left - safe.right, h - safe.top - safe.bottom);
    ctx.restore();
  }

  /* The honest number: every mark measured against the frame as it was before
     any type was drawn on it. */
  function verifyContrast() {
    const ctaRatio = contrastRatio(hexL(C.ctaFg), hexL(C.ctaBg));
    let worst = Infinity, worstWhat = null;
    if (backdrop) {
      for (const k of INK) {
        if (!k.colour) continue;               /* the CTA pill carries its own field */
        const textL = hexL(k.colour);
        const b = worstBackdrop(backdrop, k, textL > 0.4);
        const r = contrastRatio(textL, b.l);
        if (r < worst) { worst = r; worstWhat = k; }
      }
    }
    if (worst === Infinity) worst = contrast;
    return { text: worst, cta: ctaRatio, min: Math.min(worst, ctaRatio), where: worstWhat };
  }

  function finish() {
    /* Every essential mark must fit inside the recorded safe rectangle.
       Its provenance remains explicit, including studio crop guides. */
    const tol = 0.01;
    const outside = INK.filter(k =>
      k.x < safe.left - tol || k.y < safe.top - tol ||
      k.x + k.w > w - safe.right + tol || k.y + k.h > h - safe.bottom + tol);
    const missingLogo = v.logo && !logoDrawn;
    const subject = plan && plan.avoidSubject && photoImageUsed && photoRect
      ? subjectRectOnCanvas(photoImageUsed, photoRect, photoFocalUsed, tk.pad * 0.35) : null;
    const overlaps = subject ? textBounds.filter(mark =>
      mark.x < subject.x + subject.w && mark.x + mark.w > subject.x
      && mark.y < subject.y + subject.h && mark.y + mark.h > subject.y) : [];
    const failedPhoto = photoDrawn && drewFrom !== "master"
      && (upscale > SOFT_UPSCALE + 1e-6 || cropZoom < MIN_PHOTO_RETAINED - 1e-6);
    const emptyComposition = !photoDrawn && !logoDrawn && !headlineDrawn && !sublineDrawn && !ctaDrawn;
    const protectedClaim = !!(plan && plan.stack && plan.stack.isClaimLockup);
    const requiredCopyMissing = strictDesign && v.copy && (!headlineDrawn
      || (!protectedClaim && ((!!subline && !sublineDrawn) || (!!cta && !ctaDrawn))));
    const wc = verifyContrast();
    const failedContrast = !(wc.min >= WCAG_AA - 0.05);
    const blocked = !!compatibilityReason || outside.length > 0 || overlaps.length > 0 || missingLogo || failedPhoto || emptyComposition || requiredCopyMissing || failedContrast;
    /* THE SOFTNESS SENTENCE IS NOT WRITTEN HERE ANY MORE.
       This engine measured the upscale while drawing and then drew its own
       conclusion in its own words, while `fileEnlargement` stated the same
       conclusion about the same measurement in different words — so one
       build could call a file soft in two vocabularies, and step 2 could
       call the family fine while step 3 called its files soft. The
       measurement is this engine's; the sentence is the module's. */
    const enlarged = fileEnlargement({ upscale, hasPhoto: photoDrawn, source: photoSourceSize });
    if (enlarged.warns && drewFrom !== "master") notes.push({ level: "warn", text: enlarged.sentence });
    /* An extreme ratio always throws most of a photograph away. Saying so on
       a 728x90 is noise; saying so on a feed post is useful. */
    /* One line per kind of problem, not one per file. Exact percentages read
       as twenty separate findings when they are one. */
    if (cls !== "banner" && !(plan && plan.micro)) {
      if (cropCoverage < 0.42)
        notes.push({ level: "warn", text: "This ratio cuts into the subject. A photograph shaped closer to this family would hold together better." });
      if (cropZoom < MIN_PHOTO_RETAINED)
        notes.push({ level: "warn", text: "Less than a quarter of the photograph survives this ratio. It is the wrong shape for this placement." });
    }
    const st = plan && plan.stack;
    const copyDropped = {
      headline: !!(v.copy && headline && !headlineDrawn),
      subline: !!(!protectedClaim && v.copy && subline && !sublineDrawn),
      cta: !!(!protectedClaim && v.copy && cta && !ctaDrawn),
    };
    const omitted = Object.entries(copyDropped).filter(([, dropped]) => dropped).map(([name]) => name === "cta" ? "button" : name);
    if (omitted.length) notes.push({ level: "info", text: `This layout omits the ${omitted.join(" and ")}. Check that the remaining message is complete for this placement.` });
    if (!(wc.min >= WCAG_AA - 0.05)) {
      notes.push({ level: "warn", text: `Lowest measured text contrast is ${wc.min.toFixed(1)}:1, under the 4.5:1 this system holds itself to.` });
    }
    return {
      /* `layout` is the structure that ended up on this canvas. `requestedLayout`
         is the one the caller asked for. They differ whenever the engine had to
         substitute, and a consumer that wants to know it was substituted
         compares the two. */
      canvas: c, safe, layout: drawn, requestedLayout: requested,
      substituted: drawn !== requested,
      design: design ? design.id : null, cls, tk, notes, geometry,
      blocked,
      blockedReason: blocked
        ? compatibilityReason || (outside.length ? `${outside.length} element${outside.length > 1 ? "s" : ""} could not be kept inside the safe area at ${w}x${h}. Not exported.`
          : overlaps.length ? "The message or logo would cover the detected person in this photograph. Another approved layout is required. Not exported."
          : missingLogo ? "The required logo could not fit on an approved background inside the safe area. Choose another layout or colour field. Not exported."
          : requiredCopyMissing ? "The complete message does not fit this design at the approved minimum sizes. Shorten the copy or choose another format. Not exported."
          : emptyComposition ? "This variant contains no photograph, logo or message. Choose a variant with visible content. Not exported."
          : failedContrast ? "The text cannot stay readable on this photograph or colour field. Choose a different photograph or a neutral field. Not exported."
          : "This photograph cannot retain enough detail and framing in the chosen layout. Choose a complete photo layout or a larger original. Not exported.")
        : null,
      ink: INK,
      metrics: {
        designPreserved: variant === "clean" ? null : !!(design && drawn === requested && !compatibilityReason),
        emphasisPhrase: C.emphasis, emphasisDrawn, textBounds,
        emphasisKind, emphasisColour,
        emphasisSupported: !!(v.copy && plan && plan.highlight),
        claimLockup: !!(st && st.isClaimLockup),
        claimTreatment: st && st.isClaimLockup ? st.claimTreatment : null,
        headlineWeight: st ? st.parts.hl.weight : null,
        sublineWeight: st && st.parts.sub ? st.parts.sub.weight : null,
        headlinePx: st ? st.headlinePx : 0,
        idealPx: tk.ideal,
        scaleRatio: st ? +(st.headlinePx / tk.ideal).toFixed(3) : null,
        lines: st ? st.lineCount : 0,
        measureChars: st ? st.measureChars : 0,
        /* How full the copy panel is. A logo mounted on a footer line is not
           in that panel, so counting it there reported 118% on a layout that
           is not crowded at all. */
        fill: plan && plan.inner
          ? +(((st ? st.h : 0) + (plan.logo && !plan.footer ? plan.logo.h : 0)) / Math.max(1, plan.inner.h)).toFixed(3)
          : null,
        logoPx: plan && plan.logo ? plan.logo.h : 0,
        contrast: +wc.min.toFixed(2),
        contrastText: +wc.text.toFixed(2),
        contrastCta: +wc.cta.toFixed(2),
        wcagAA: wc.min >= WCAG_AA - 0.05,
        veil: +veilAlpha.toFixed(2),
        cropCoverage: +cropCoverage.toFixed(3),
        cropZoom: +cropZoom.toFixed(3),
        upscale,
        sourceWidth: photoSourceSize ? photoSourceSize.w : null,
        sourceHeight: photoSourceSize ? photoSourceSize.h : null,
        photoRect,
        photoAdaptation,
        safeViolations: outside.length,
        subjectOverlap: overlaps.length,
        subjectGuard: subject ? { x: Math.round(subject.x), y: Math.round(subject.y), w: Math.round(subject.w), h: Math.round(subject.h) } : null,
        logoDrawn,
        emptyComposition,
        copyDropped,
        drewFrom,
        safeKind: safe.kind,
        marks: INK.length,
        contrastWorstAt: wc.where ? { x: Math.round(wc.where.x), y: Math.round(wc.where.y), w: Math.round(wc.where.w), h: Math.round(wc.where.h), colour: wc.where.colour } : null,
        hasPhoto: photoDrawn,
        engine: ENGINE_VERSION, safeZones: SAFE_ZONE_VERSION,
      },
    };
  }
}

/* Public composition is self-correcting for approved colour combinations.
   The design geometry and copy never change. If a Teal field cannot carry an
   approved logo colourway, the renderer tries the neutral fields itself and
   returns the first complete, safe result. */
export async function composeAsset(spec) {
  const claim = isBrandClaim(spec.headline);
  const selectedClaimDesign = spec.design === "claim-lockup-filled" || spec.design === "claim-lockup-outline";
  const resolvedDesign = claim
    ? (selectedClaimDesign ? spec.design : "claim-lockup-filled")
    : (selectedClaimDesign ? "statement-impact" : spec.design);
  const requestedBand = spec.band || BAND_CHOICES[0];
  const palette = resolveAssetPalette(requestedBand, spec.ctaBg);
  const prepared = { ...spec, design: resolvedDesign, band: palette.band, ctaBg: palette.ctaBg, ctaFg: palette.ctaFg };
  let result = await composeAssetOnce(prepared);
  let resolvedBand = requestedBand;
  let resolvedPalette = palette;
  let colourAdjusted = palette.adjusted;
  const colourBlocked = result.blocked && /logo|background|colour field|contrast|readable/i.test(result.blockedReason || "");
  if (colourBlocked) {
    const candidates = ["sand", "white", "charcoal", "teal"]
      .filter(id => id !== requestedBand.id)
      .map(id => BAND_CHOICES.find(candidate => candidate.id === id)).filter(Boolean);
    for (const candidate of candidates) {
      const nextPalette = resolveAssetPalette(candidate, spec.ctaBg);
      const next = await composeAssetOnce({ ...spec, design: resolvedDesign, band: candidate,
        ctaBg: nextPalette.ctaBg, ctaFg: nextPalette.ctaFg });
      if (!next.blocked) {
        result.canvas.width = result.canvas.height = 1;
        result = next; resolvedBand = candidate; resolvedPalette = nextPalette; colourAdjusted = true;
        result.notes.unshift({ level: "info", text: `Colours were resolved automatically for this format using the approved ${candidate.label} field.` });
        break;
      }
      next.canvas.width = next.canvas.height = 1;
    }
  }
  result.metrics = { ...(result.metrics || {}),
    requestedBand: requestedBand.id, resolvedBand: resolvedBand.id,
    requestedCtaBg: spec.ctaBg || null, resolvedCtaBg: resolvedPalette.ctaBg,
    colourAdjusted,
  };
  return result;
}
