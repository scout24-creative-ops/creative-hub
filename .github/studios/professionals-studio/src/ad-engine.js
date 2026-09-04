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

   3. TWO KINDS OF MARGIN, AND ONLY ONE OF THEM CAN BLOCK.
      A platform's reserved UI strip is a hard fact: content inside it
      is invisible to a real user, so the engine will not export it. A
      house margin is taste. Taste never blocks a file.

   Everything customer facing stays German. This file is English.
   ===================================================================== */

import { lookupSafeZone, SAFE_ZONE_VERSION } from "./safe-zones.js";
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

export const ENGINE_VERSION = "2.1.0";

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

/* ---------------------------------------------------------------------
   Palettes. The field colour decides the type colour and which logo file
   to use, so a composition can never end up with charcoal type on charcoal.
   --------------------------------------------------------------------- */
export const BAND_CHOICES = [
  { id: "sand",     bg: COLORS.sand,     fg: COLORS.charcoal, logo: "",       accent: COLORS.teal,   label: "Sand" },
  { id: "white",    bg: COLORS.white,    fg: COLORS.charcoal, logo: "",       accent: COLORS.blue, label: "White" },
  { id: "teal",     bg: COLORS.teal,     fg: COLORS.charcoal, logo: "",       accent: COLORS.blue, label: "Brand Teal" },
  { id: "blue",     bg: COLORS.blue,     fg: COLORS.charcoal, logo: "",       accent: COLORS.teal, label: "Professionals Blue" },
  { id: "charcoal", bg: COLORS.charcoal, fg: COLORS.white,    logo: "-inverse", accent: COLORS.teal, label: "Charcoal" },
];

export const VARIANTS = [
  { id: "clean", label: "Image only",   logo: false, copy: false },
  { id: "logo",  label: "Logo only",    logo: true,  copy: false },
  { id: "copy",  label: "Copy only",    logo: false, copy: true  },
  { id: "full",  label: "Logo and copy", logo: true, copy: true  },
];

export const LOGO_FILES = {
  "Professionals": "logo-professionals",
};
/* The compact mark. Used when a wide wordmark cannot meet the 24px minimum
   inside the space a placement leaves, which is a real situation on banners. */
const COMPACT_LOGO = "logo-professionals";

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
export function loadImg(src) {
  const url = assetUrl(src);
  if (imgCache.has(url)) return imgCache.get(url);
  const p = new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Could not load " + url));
    i.src = url;
  });
  imgCache.set(url, p);
  return p;
}

/* A missing colourway must not take the whole build down. Fall back to the
   charcoal artwork, and say so, rather than throwing on one placement. */
async function loadLogo(key, suffix, notes) {
  const canonical = key === "logo-professionals"
    ? (suffix === "-inverse"
      ? "assets/logos/immoscout24-horizontal-inverse.svg"
      : suffix === "-white"
        ? "assets/logos/immoscout24-horizontal-white.svg"
        : "assets/logos/immoscout24-horizontal.svg")
    : `assets/${key}${suffix || ""}.svg`;
  if (!suffix || key === "logo-professionals") return loadImg(canonical);
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
      await Promise.all([
        document.fonts.load('800 64px "Make It Better"'),
        document.fonts.load('700 32px "Make It Better"'),
        document.fonts.load('400 32px "Make It Better"'),
      ]);
      await document.fonts.ready;
    } catch (e) { /* the fallback stack still measures, it just looks wrong */ }
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
  ideal = Math.max(ideal, 11);

  const pad = Math.max(8, Math.round(ideal * 0.62));
  return {
    ref, short, ideal: Math.round(ideal),
    floor: Math.max(11, Math.round(ideal * 0.55)),   /* below this, change the layout, not the type */
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
function setFont(ctx, weight, px) {
  ctx.font = `${weight} ${px}px "Make It Better", "Open Sans", Arial, sans-serif`;
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

/* German compounds are long. Break on spaces, and on existing hyphens, and
   only as a last resort inside a word, with a real hyphen so it reads as a
   break rather than a mistake. */
function splitTokens(text) {
  const out = [];
  for (const chunk of String(text || "").split(/\s+/).filter(Boolean)) {
    const parts = chunk.split(/(?<=[-\u2013\/])/);
    for (const p of parts) out.push(p);
  }
  return out;
}

/* Breaking inside a word is a last resort, and a break that strands one or
   two letters reads as a mistake rather than as hyphenation. */
const MIN_PIECE = 3;
function hardBreak(ctx, word, maxW) {
  const out = [];
  let cur = "";
  for (const ch of word) {
    if (ctx.measureText(cur + ch + "-").width > maxW && cur.length >= MIN_PIECE) {
      out.push(cur + "-"); cur = ch;
    } else cur += ch;
  }
  if (cur) {
    if (cur.length < MIN_PIECE && out.length) {
      const prev = out.pop().replace(/-$/, "");
      const keep = Math.max(MIN_PIECE, prev.length - (MIN_PIECE - cur.length));
      out.push(prev.slice(0, keep) + "-");
      cur = prev.slice(keep) + cur;
    }
    out.push(cur);
  }
  return out;
}

/* Returns the lines, and records whether it had to break inside a word so the
   fitter can prefer smaller type over a hyphen. */
function wrap(ctx, text, maxW) {
  const toks = splitTokens(text);
  const lines = [];
  lines.broke = false;
  let cur = "";
  for (let t of toks) {
    const joiner = cur && !/[-\u2013\/]$/.test(cur) ? " " : "";
    const test = cur + joiner + t;
    if (!cur) {
      if (ctx.measureText(t).width > maxW) {
        const pieces = hardBreak(ctx, t, maxW);
        cur = pieces.pop();
        lines.push(...pieces);
        lines.broke = true;
      } else cur = t;
    } else if (ctx.measureText(test).width <= maxW) {
      cur = test;
    } else {
      lines.push(cur);
      if (ctx.measureText(t).width > maxW) {
        const pieces = hardBreak(ctx, t, maxW);
        cur = pieces.pop();
        lines.push(...pieces);
        lines.broke = true;
      } else cur = t;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function blockAt(ctx, text, weight, px, maxW, lhRatio) {
  setFont(ctx, weight, px);
  const raw = wrap(ctx, text, maxW);
  const lines = raw.map(t => ({ t, ...measureLine(ctx, t) }));
  lines.broke = raw.broke;
  const lh = px * lhRatio;
  const widest = lines.reduce((m, l) => Math.max(m, l.w), 0);
  const first = lines[0] || { asc: px * 0.72, desc: px * 0.2 };
  const last = lines[lines.length - 1] || first;
  return {
    px, lh, lines, widest, broke: !!lines.broke,
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
  const wantSub = o.subline !== false && !!content.subline;
  const wantCta = o.cta !== false && !!content.cta;
  const wantKicker = !!o.kicker && !!content.kicker;
  const maxLines = o.maxLines || 3;
  /* An option may ask for larger type, which is the whole point of the
     typographic style. Capped so it can never run away from the scale. */
  const startPx = Math.max(11, Math.min(Math.round(o.startPx || tk.ideal), Math.round(tk.ideal * 1.5)));
  const floorPx = Math.max(o.floorPx || tk.floor, 11);

  /* Measure, in characters per line. Display type reads best between 20 and
     40 characters; a headline set across a 2560px hero would run to 70 and
     stop being a headline. The column is capped at the type's own scale, so
     the cap moves with the size rather than being a fixed pixel width. */
  const maxCPL = o.maxCPL || 36;

  for (let px = startPx; px >= floorPx - 0.5; px = Math.max(floorPx, Math.round(px * 0.94)) - (px <= floorPx ? 1 : 0)) {
    const hlLh = px >= 34 ? 1.055 : 1.14;
    setFont(ctx, 800, px);
    const avgChar = ctx.measureText(content.headline).width / Math.max(1, String(content.headline).length);
    const effW = Math.min(colW, Math.max(px * 4.5, avgChar * maxCPL));
    const hl = blockAt(ctx, content.headline, 800, px, effW, hlLh);
    /* Shrink before hyphenating. Only at the floor does a break inside a word
       become the better of two bad options. */
    if (hl.lines.length > maxLines || hl.widest > colW + 0.5 || (hl.broke && px > floorPx)) {
      if (px <= floorPx) break;
      continue;
    }

    let total = hl.h, sub = null, cta = null, kicker = null;
    const gapSub = px * 0.46, gapCta = px * 0.66, gapKicker = px * 0.40;

    if (wantKicker) {
      const kpx = Math.max(9, Math.round(px * tk.kickerRatio));
      kicker = blockAt(ctx, content.kicker, 800, kpx, colW, 1.2);
      if (kicker.lines.length > 1 || kicker.widest > colW) kicker = null;
      else total += kicker.h + gapKicker;
    }
    if (wantSub) {
      const spx = Math.max(10, Math.round(px * tk.sublineRatio));
      /* Smaller type needs more leading, not less. */
      const s = blockAt(ctx, content.subline, 700, spx, Math.min(colW, effW * 1.12), 1.4);
      if (s.lines.length <= (o.sublineLines || 2) && s.widest <= colW + 0.5) {
        sub = s; total += gapSub + s.h;
      }
    }
    if (wantCta) {
      const cpx = Math.max(10, Math.round(px * tk.ctaRatio));
      setFont(ctx, 700, cpx);
      const m = measureLine(ctx, content.cta);
      const cw = Math.round(m.w + cpx * 2.5), ch = Math.round(cpx * 2.5);
      if (cw <= colW) { cta = { px: cpx, w: cw, h: ch, text: content.cta, asc: m.asc }; total += gapCta + ch; }
    }

    if (total <= maxH + 0.5) {
      return buildStack({ hl, sub, cta, kicker, gapSub, gapCta, gapKicker, total, px, colW: effW, align: o.align, tk,
                          droppedSub: wantSub && !sub, droppedCta: wantCta && !cta });
    }
    /* Too tall at this size. Shed the least important element before
       shrinking type any further, so nothing ends up illegible. */
    if (sub && total - gapSub - sub.h <= maxH + 0.5) {
      const t2 = total - gapSub - sub.h;
      return buildStack({ hl, sub: null, cta, kicker, gapSub, gapCta, gapKicker, total: t2, px,
                          colW: effW, align: o.align, tk,
                          droppedSub: true, droppedCta: wantCta && !cta });
    }
    if (px <= floorPx) break;
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
    lineCount: hl.lines.length,
    measureChars: Math.round(hl.lines.reduce((a, l) => a + l.t.length, 0) / Math.max(1, hl.lines.length)),
    parts: { hl, sub, cta, kicker },
    /* Draw at a top-left origin. Cap height sits flush with y, which is
       what makes a block of display type look aligned to its container. */
    draw(ctx, x, y, C, ink) {
      let cy = y;
      const fgc = C.fg;
      if (kicker) {
        setFont(ctx, 800, kicker.px);
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
      setFont(ctx, 800, hl.px);
      ctx.fillStyle = C.fg;
      let by = cy + hl.firstAsc;
      for (const l of hl.lines) {
        const lx = ax(x, l.w);
        ctx.fillText(l.t, lx, by);
        ink(lx, by - l.asc, l.w, l.asc + l.desc, fgc);
        by += hl.lh;
      }
      cy += hl.h;
      if (sub) {
        cy += gapSub;
        setFont(ctx, 700, sub.px);
        ctx.fillStyle = C.fg; ctx.globalAlpha = 0.78;
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
        setFont(ctx, 700, cta.px);
        ctx.fillStyle = C.ctaFg;
        ctx.fillText(cta.text, bx + cta.px * 1.25, cy + cta.h / 2 + cta.asc / 2);
        ink(bx, cy, cta.w, cta.h, null);   /* a solid pill, measured against its own fill */
        cy += cta.h;
      }
      return cy;
    },
  };
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
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = skinMap[y * W + x];
    if (!v) continue;
    sx += v * (x + 0.5); sy += v * (y + 0.5); tot += v;
  }
  const frac = tot / (W * H);
  return tot > 0 ? { x: sx / tot / W, y: sy / tot / H, strength: frac } : null;
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
export function drawPhoto(ctx, img, box, focal) {
  const fx = focal ? focal.x : 0.5, fy = focal ? focal.y : 0.42;
  const s = Math.max(box.w / img.width, box.h / img.height);
  const dw = img.width * s, dh = img.height * s;
  let x = box.x + box.w / 2 - dw * fx;
  let y = box.y + box.h / 2 - dh * fy;
  x = Math.min(box.x, Math.max(box.x + box.w - dw, x));
  y = Math.min(box.y, Math.max(box.y + box.h - dh, y));
  ctx.save();
  ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, y, dw, dh);
  ctx.restore();
  return s;
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

const PLUS_TEAL = ["plus-teal-1", "plus-teal-2", "plus-teal-3", "plus-teal-4"];
const PLUS_PURPLE = ["plus-purple-1", "plus-purple-2", "plus-purple-3", "plus-purple-4"];
function plusFile(color, i) {
  const set = color === "blue" ? PLUS_PURPLE : PLUS_TEAL;
  return `assets/${set[((i % set.length) + set.length) % set.length]}.svg`;
}
async function drawProfessionals(ctx, color, i, cx, cy, size, rotDeg) {
  return;
  const img = await loadImg(plusFile(color, i));
  const w = size, h = size * (img.height / img.width);
  ctx.save();
  ctx.translate(cx, cy);
  if (rotDeg) ctx.rotate(Math.max(-BRAND.plusMaxRotation, Math.min(BRAND.plusMaxRotation, rotDeg)) * Math.PI / 180);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}
async function drawPhotoInProfessionals(ctx, photoImg, color, i, box, focal) {
  const glyph = await loadImg(plusFile(color, i));
  const off = document.createElement("canvas");
  off.width = Math.max(2, Math.round(box.w));
  off.height = Math.max(2, Math.round(box.h));
  const o = off.getContext("2d");
  const gh = off.width * (glyph.height / glyph.width);
  o.drawImage(glyph, 0, (off.height - gh) / 2, off.width, gh);
  o.globalCompositeOperation = "source-in";
  const scale = drawPhoto(o, photoImg, { x: 0, y: 0, w: off.width, h: off.height }, focal);
  ctx.drawImage(off, box.x, box.y);
  return scale;
}

/* THE PLUS AS A TEXTURE.

   The brand allows a low density Professionals pattern as background texture, and
   forbids it behind body text. Both halves matter, so the tile skips a
   clearance rectangle around the copy: the field stays one flat colour there,
   which is an absence of texture rather than a block behind the words. */
async function drawProfessionalsPattern(ctx, rect, color, cell, alpha, clear) {
  return;
  const img = await loadImg(plusFile(color, 0));
  const ar = img.height / img.width;
  const size = cell * 0.44;
  ctx.save();
  ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
  ctx.globalAlpha = alpha;
  let row = 0;
  for (let y = rect.y - cell; y < rect.y + rect.h + cell; y += cell, row++) {
    const off = row % 2 ? cell / 2 : 0;
    for (let x = rect.x - cell; x < rect.x + rect.w + cell; x += cell) {
      const cx = x + off;
      if (clear && cx + size > clear.x - cell * 0.3 && cx < clear.x + clear.w + cell * 0.3 &&
          y + size * ar > clear.y - cell * 0.3 && y < clear.y + clear.h + cell * 0.3) continue;
      ctx.drawImage(img, cx, y, size, size * ar);
    }
  }
  ctx.restore();
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

/* Solve the scrim rather than guess it. Compositing is source-over in sRGB,
   so for a scrim colour s at alpha a the result is (1-a)*c + a*s per channel.
   Binary search the smallest alpha that clears the contrast target, then stop:
   an over-strong scrim flattens the photograph for no benefit. */
function solveScrimAlpha(bgRgb, scrimDark, textL, target) {
  const s = scrimDark ? 0 : 255;
  let lo = 0, hi = 0.82;
  const ok = a => {
    const c = bgRgb.map(v => (1 - a) * v + a * s);
    return contrastRatio(textL, luminance(c[0], c[1], c[2])) >= target;
  };
  if (ok(0)) return 0;
  if (!ok(hi)) return hi;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) hi = mid; else lo = mid;
  }
  return Math.min(0.82, hi + 0.04);
}

/* A VEIL, NOT A PANEL.

   The brand does not put coloured blocks behind words. So when type sits on a
   photograph, the picture is darkened or lightened by a gradient that runs off
   the edge of the frame and fades to nothing. It spans the full canvas on its
   axis, so there is never a visible rectangle: it reads as the light in the
   photograph falling away, which is what a retoucher would do by hand. */
function drawVeil(ctx, rect, dark, alpha, w, h) {
  const c = dark ? "0,0,0" : "255,255,255";
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
  /* Fade from whichever edge the words are nearest, so the picture keeps as
     much of itself as possible. */
  const offX = Math.abs(cx / w - 0.5), offY = Math.abs(cy / h - 0.5);
  const horizontal = offX > 0.16 && offX > offY;

  const axis = horizontal
    ? { size: w, near: cx > w / 2 ? w : 0, a: rect.x, b: rect.x + rect.w, ext: rect.w }
    : { size: h, near: cy > h / 2 ? h : 0, a: rect.y, b: rect.y + rect.h, ext: rect.h };
  const fromEnd = axis.near > 0;
  /* Distance from the anchored edge to the far side of the words. The veil is
     held at full strength across all of that, then falls to nothing beyond it.
     Tapering across the words themselves is what left the last line short of
     the target no matter how much alpha was thrown at it. */
  const covered = fromEnd ? axis.size - axis.a : axis.b;
  const falloff = Math.max(axis.ext * 0.9, axis.size * 0.16);
  const total = covered + falloff;
  const far = fromEnd ? axis.near - total : axis.near + total;
  const g = horizontal
    ? ctx.createLinearGradient(axis.near, 0, far, 0)
    : ctx.createLinearGradient(0, axis.near, 0, far);

  const plateau = Math.min(0.94, covered / total);
  g.addColorStop(0, `rgba(${c},${alpha.toFixed(3)})`);
  g.addColorStop(plateau, `rgba(${c},${alpha.toFixed(3)})`);
  g.addColorStop(Math.min(1, plateau + (1 - plateau) * 0.45), `rgba(${c},${(alpha * 0.55).toFixed(3)})`);
  g.addColorStop(1, `rgba(${c},0)`);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
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

/* Darken or lighten until the words genuinely clear the target, checking the
   canvas again after each pass instead of trusting the first estimate. */
function ensureContrast(ctx, backdrop, rect, textHex, target, w, h) {
  const textL = hexL(textHex);
  const dark = textL > 0.4;
  const bctx = backdrop.getContext("2d");
  /* Judge the veil against the very worst patch under the block, not a
     comfortable percentile. One blown-out window behind one line is what used
     to leave a handful of files at 4.2:1 after the block as a whole passed. */
  let worst = worstBanded(backdrop, rect, dark);
  let ratio = contrastRatio(textL, worst.l), alpha = 0;
  for (let pass = 0; pass < 6 && ratio < target - 0.02; pass++) {
    const need = solveScrimAlpha(worst.rgb, dark, textL, target * 1.06);
    alpha = Math.min(0.92, Math.max(alpha + 0.10, need));
    drawVeil(ctx, rect, dark, alpha, w, h);
    bctx.clearRect(0, 0, w, h);
    bctx.drawImage(ctx.canvas, 0, 0);
    worst = worstBanded(backdrop, rect, dark);
    ratio = contrastRatio(textL, worst.l);
  }
  return { ratio, alpha };
}

/* =====================================================================
   5. STYLES
   Six structural ideas, each with designed geometry for every aspect
   class. A style never "fails at this size": it has an answer for banner,
   wide, square, tall and story, and the copy is measured before the
   geometry is fixed, so the panel is built around the words rather than
   the words being crushed into a panel.
   ===================================================================== */
export const LAYOUTS = [
  { id: "anchor",    label: "Anchored block", blurb: "Photograph above a solid colour block that is sized to the words. The workhorse: survives every crop and reads at any size." },
  { id: "editorial", label: "Editorial split", blurb: "Photograph and colour field meet on one hard edge, with a kicker above the headline. Magazine structure." },
  { id: "frame",     label: "Floating card",  blurb: "Full-bleed photograph with a solid card set inside the safe area. The most air of the seven." },
  { id: "fullbleed", label: "Full bleed",     blurb: "Nothing but the photograph, with the words set straight onto it. The picture is darkened or lightened until every line clears 4.5:1, and never with a block behind the text." },
  { id: "panel",     label: "Colour field",   blurb: "Colour leads and the photograph becomes an inset panel. The answer when a hard crop would ruin the picture." },
  { id: "mosaic",    label: "Modular grid",   blurb: "A grid of squares: some hold the photograph, some hold flat accent, and the copy runs through a clear channel. Seeded per placement, so every size in a set gets its own arrangement." },
  { id: "poster",    label: "Poster",         blurb: "Headline on top, a full-width band of photograph under it, button and mark on a footer line. Three tiers, read top to bottom." },
  { id: "statement", label: "Typography only",blurb: "No photograph. The headline carries the composition with a clear hierarchy and generous space." },
];
/* Old ids kept working, so saved sessions and filenames do not break. */
const LAYOUT_ALIAS = { band: "anchor", split: "editorial", card: "frame", field: "panel", mask: "cutout", type: "statement", bleed: "fullbleed", grid: "mosaic" };
export function normaliseLayout(id) { return LAYOUT_ALIAS[id] || id || "anchor"; }

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

   A design is a structure plus the decisions taken inside it: which side the
   colour field takes, where the seam sits, how dense the grid is. Nine
   structures with those decisions fixed is nine designs; nine structures with
   the decisions opened up is twenty-six, and twenty-six is enough that a team
   can run a new one every campaign for most of a year without repeating
   itself.

   WHY NOT MORE, WHICH IS THE QUESTION EVERYONE ASKS SECOND. Crossing every
   parameter with every other one enumerates thirty-two. The six that are not
   here are absent on purpose: each renders identically to a design that is
   already in the list, so shipping them would pad the count and give a team
   nothing new to run.

     - `editorial` reads `copy` only on a letterbox, banner or square, and
       `seam` only on a portrait or story. The two are on opposite sides of
       the same branch and never bind in one frame, so a design carrying both
       is `editorial-left` at the first three shapes and `editorial-high` or
       `editorial-low` at the other two, and never a sixth thing.
     - `mosaic` keeps one row either side of its copy channel, which gives the
       high, middle and low variants genuinely different weight at every
       shipped size. The channel × density crossings are therefore real
       creative choices, not duplicate names.

   ONE DESIGN PER SET. Every placement in a campaign shares it, so the set
   reads as one campaign rather than a shelf of samples. The variety belongs
   between campaigns, not inside one: that is what an auction rewards and what
   an audience notices.

   A design that has been used is RETIRED. The Studio reads the build history,
   marks what has run, and offers what has not. Nothing is deleted; a retired
   design can be chosen again deliberately, it just stops being suggested. */
export const DESIGNS = [
  { id: "anchor-bottom",     style: "anchor",    params: {},                          label: "Anchored block",            note: "Photograph above a solid block sized to the words. The workhorse." },
  { id: "anchor-top",        style: "anchor",    params: { side: "top" },             label: "Anchored block, inverted",  note: "The block on top, the photograph running out beneath it." },
  { id: "anchor-left",       style: "anchor",    params: { side: "left" },            label: "Anchored block, left",      note: "On a letterbox, the colour column takes the left." },
  { id: "editorial-right",   style: "editorial", params: {},                          label: "Editorial split",           note: "Hard vertical edge, photograph left, kicker above the headline." },
  { id: "editorial-left",    style: "editorial", params: { copy: "left" },            label: "Editorial split, mirrored", note: "The same edge with the words on the left." },
  { id: "editorial-high",    style: "editorial", params: { seam: "high" },            label: "Editorial, high seam",      note: "On a portrait the seam sits high, giving the words the larger half." },
  { id: "editorial-low",     style: "editorial", params: { seam: "low" },             label: "Editorial, low seam",       note: "The seam drops, the photograph takes the frame." },
  { id: "frame-bottom",      style: "frame",     params: {},                          label: "Floating card",             note: "Full-bleed photograph, solid card low in the safe area." },
  { id: "frame-top",         style: "frame",     params: { card: "top" },             label: "Floating card, high",       note: "The card at the top, the subject framed below it." },
  { id: "fullbleed-bottom",  style: "fullbleed", params: {},                          label: "Full bleed",                note: "Words straight on the picture, low. Veiled until they clear 4.5:1." },
  { id: "fullbleed-top",     style: "fullbleed", params: { copy: "top" },             label: "Full bleed, high",          note: "The lockup at the top, the subject held in the lower half." },
  { id: "fullbleed-middle",  style: "fullbleed", params: { copy: "middle" },          label: "Full bleed, centred",       note: "Centred on the picture. The most poster-like of the three." },
  { id: "panel-top",         style: "panel",     params: {},                          label: "Colour field",              note: "Colour leads, the photograph is an inset panel above the words." },
  { id: "panel-bottom",      style: "panel",     params: { photo: "bottom" },         label: "Colour field, inverted",    note: "Words first, the photograph panel beneath them." },
  { id: "panel-left",        style: "panel",     params: { photo: "left" },           label: "Colour field, panel left",  note: "On a letterbox the panel takes the left." },
  { id: "mosaic-mid",        style: "mosaic",    params: {},                          label: "Modular grid",              note: "Squares on a field, the words running through a clear channel." },
  { id: "mosaic-high",       style: "mosaic",    params: { channel: "high" },         label: "Modular grid, high channel",note: "The channel near the top, the grid weighted below it." },
  { id: "mosaic-low",        style: "mosaic",    params: { channel: "low" },          label: "Modular grid, low channel", note: "The channel near the foot, the grid stacked above." },
  { id: "mosaic-dense",      style: "mosaic",    params: { density: "dense" },        label: "Modular grid, dense",       note: "Most cells filled. Closest to a printed schedule." },
  { id: "mosaic-sparse",     style: "mosaic",    params: { density: "sparse" },       label: "Modular grid, sparse",      note: "A handful of cells and a lot of air." },
  { id: "mosaic-high-dense", style: "mosaic",    params: { channel: "high", density: "dense" }, label: "Modular grid, high & dense", note: "A headline near the top with a busy image field below." },
  { id: "mosaic-high-sparse",style: "mosaic",    params: { channel: "high", density: "sparse" }, label: "Modular grid, high & sparse", note: "A high copy channel with plenty of breathing room." },
  { id: "mosaic-low-dense",  style: "mosaic",    params: { channel: "low", density: "dense" }, label: "Modular grid, low & dense", note: "A dense editorial grid weighted above the message." },
  { id: "mosaic-low-sparse", style: "mosaic",    params: { channel: "low", density: "sparse" }, label: "Modular grid, low & sparse", note: "A quiet grid with the message held near the foot." },
  { id: "poster-type-first", style: "poster",    params: {},                          label: "Poster",                    note: "Headline, band of photograph, footer line with the mark and button." },
  { id: "poster-photo-first",style: "poster",    params: { order: "photo-first" },    label: "Poster, picture first",     note: "The picture opens, the line explains it, the footer closes." },
  { id: "statement-top",     style: "statement", params: {},                          label: "Typography only",           note: "No photograph. The headline carries the frame at full scale." },
  { id: "statement-middle",  style: "statement", params: { align: "middle" },         label: "Typography, centred",       note: "The same, held in the middle of the frame." },
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
export const ROTATION_POOL = ["anchor", "editorial", "frame", "fullbleed", "panel", "mosaic", "poster"];

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
        plusses: [{ color: G.band.id === "teal" ? "purple" : "teal", i: 0,
                    cx: left ? fieldW : fieldX, cy: h * 0.15, size: Math.min(w, h) * 0.16, rot: -12 }],
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
        plusses: [{ color: G.band.id === "teal" ? "purple" : "teal", i: 0,
                    cx: w - Math.max(safe.right, tk.ref * 0.045) - Math.min(w, h) * 0.075,
                    cy: fieldBot, size: Math.min(w, h) * 0.15, rot: -12 }],
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
      plusses: [{ color: G.band.id === "teal" ? "purple" : "teal", i: 0,
                  cx: w - Math.max(safe.right, tk.ref * 0.045) - Math.min(w, h) * 0.075,
                  cy: fieldTop, size: Math.min(w, h) * 0.15, rot: -12 }],
    });
  },

  /* ---- Editorial split ---------------------------------------------- */
  editorial(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const dp = G.dp || {};
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
        plusses: [{ color: G.band.id === "blue" ? "teal" : "blue", i: 2,
                    cx: left ? Math.min(w, h) * 0.05 : w - Math.min(w, h) * 0.05,
                    cy: h - Math.min(w, h) * 0.07, size: Math.min(w, h) * 0.28, rot: 14 }],
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
      plusses: [{ color: G.band.id === "blue" ? "teal" : "blue", i: 2,
                  cx: w - Math.min(w, h) * 0.06, cy: seam, size: Math.min(w, h) * 0.22, rot: 14 }],
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
      plusses: [{ color: G.band.id === "teal" ? "purple" : "teal", i: 1,
                  cx: cx + cardW, cy: cy, size: Math.min(w, h) * 0.16, rot: -18 }],
    });
  },

  /* ---- Colour field with an inset photograph -------------------------- */
  panel(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const pad = tk.pad;
    const r = Math.round(tk.ref * 0.035);
    if (cls === "wide" || cls === "banner") {
      const dp1 = G.dp || {};
      const pw = Math.round(C.w * 0.40);
      const pLeft = dp1.photo === "left";
      const photo = { x: pLeft ? C.x : C.x + C.w - pw, y: C.y, w: pw, h: C.h, r };
      const inner = { x: pLeft ? C.x + pw + pad * 1.2 : C.x, y: C.y, w: C.w - pw - pad * 1.2, h: C.h };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoRound: true, inner, vAlign: "center",
        plusses: [{ color: G.band.id === "blue" ? "teal" : "blue", i: 3, cx: photo.x, cy: photo.y + photo.h, size: Math.min(w, h) * 0.17, rot: 16 }],
      });
    }
    const dp2 = G.dp || {};
    const ph = Math.round(C.h * (cls === "story" ? 0.44 : 0.50));
    const low = dp2.photo === "bottom";
    const photo = { x: C.x, y: low ? C.y + C.h - ph : C.y, w: C.w, h: ph, r };
    const inner = low
      ? { x: C.x, y: C.y, w: C.w, h: (C.y + C.h - ph - pad * 1.2) - C.y }
      : { x: C.x, y: C.y + ph + pad * 1.2, w: C.w, h: (C.y + C.h) - (C.y + ph + pad * 1.2) };
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h }, photo, photoRound: true, inner, vAlign: low ? "bottom" : "top",
      plusses: [{ color: G.band.id === "blue" ? "teal" : "blue", i: 3, cx: photo.x, cy: low ? photo.y : photo.y + photo.h, size: Math.min(w, h) * 0.16, rot: 16 }],
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
    if (cls === "wide" || cls === "banner") {
      const side = Math.min(C.w * 0.42, C.h);
      const photo = { x: C.x + C.w - side, y: C.y + (C.h - side) / 2, w: side, h: side };
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h }, photo, photoRound: true,
        inner: { x: C.x, y: C.y, w: photo.x - C.x - pad * 1.2, h: C.h },
        vAlign: "center",
      });
    }
    const dpc = G.dp || {};
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

  /* ---- Full bleed ------------------------------------------------------
     The photograph is the whole design. No field, no card, no block behind
     the words. Legibility comes from the picture itself being veiled where
     the type sits, measured against 4.5:1 rather than guessed at. */
  fullbleed(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    if (cls === "wide" || cls === "banner") {
      /* Words in one half, picture readable in the other. */
      const colW = Math.round(C.w * 0.52);
      return blockPlan(G, fit, {
        photo: { x: 0, y: 0, w, h },
        inner: { x: C.x, y: C.y, w: colW, h: C.h },
        vAlign: "center", autoPolarity: true,
        focalTargetX: Math.min(0.82, (C.x + colW + (w - C.x - colW) / 2) / w),
      });
    }
    /* Portrait, square and story: the lockup sits low by default, the way a
       poster does, and the subject is framed into the clear part away from it. */
    const dp = G.dp || {};
    const colW = Math.round(Math.min(C.w, tk.ideal * 11));
    const at = dp.copy === "top" ? "top" : dp.copy === "middle" ? "center" : "bottom";
    return blockPlan(G, fit, {
      photo: { x: 0, y: 0, w, h },
      inner: { x: C.x, y: C.y, w: colW, h: C.h },
      vAlign: at, autoPolarity: true,
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
    const topRoom = C.h - footerH - pad * 2 - Math.round(C.h * (cls === "wide" ? 0.32 : 0.40));
    const stack = v.copy
      ? fit(C.w, Math.max(tk.ideal * 1.2, topRoom), { maxLines: 3, cta: false, kicker: true })
      : null;
    const dp = G.dp || {};
    const topH = stack ? stack.h : 0;
    /* The band can sit above the words instead: picture first, then the line
       that explains it. A different read, same three tiers. */
    if (dp.order === "photo-first") {
      const bandH2 = Math.max(1, Math.round(C.h - topH - footerH - pad * 2));
      return blockPlan(G, fit, {
        field: { x: 0, y: 0, w, h },
        photo: { x: 0, y: Math.round(C.y), w, h: bandH2 },
        inner: { x: C.x, y: Math.round(C.y + bandH2 + pad), w: C.w, h: Math.max(topH, tk.ideal) },
        vAlign: "top", stack, noLogoReserve: true,
        footer: { x: C.x, y: Math.round(C.y + C.h - footerH), w: C.w, h: footerH },
        plusses: [],
      });
    }
    const bandY = Math.round(C.y + topH + (topH ? pad : 0));
    const bandH = Math.max(1, Math.round((C.y + C.h - footerH - pad * 0.8) - bandY));
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h },
      photo: { x: 0, y: bandY, w, h: bandH },
      inner: { x: C.x, y: C.y, w: C.w, h: Math.max(topH, tk.ideal) },
      vAlign: "top", stack, noLogoReserve: true,
      footer: { x: C.x, y: Math.round(C.y + C.h - footerH), w: C.w, h: footerH },
      plusses: [],
    });
  },

  /* ---- Typographic ---------------------------------------------------- */
  statement(G, fit) {
    const { w, h, safe, tk, cls } = G;
    const C = contentRect(w, h, safe, tk);
    const s = Math.min(w, h);
    return blockPlan(G, fit, {
      field: { x: 0, y: 0, w, h },
      inner: { x: C.x, y: C.y, w: C.w, h: C.h },
      vAlign: (G.dp && G.dp.align === "middle") || cls === "banner" ? "center" : "top",
      kicker: true, noPhoto: true, bigType: true,
      plusses: [
        { color: "teal", i: 1, cx: w - s * 0.10, cy: h * 0.10, size: s * 0.34, rot: -16 },
        { color: "blue", i: 2, cx: w - s * 0.05, cy: h * 0.88, size: s * 0.26, rot: 22 },
      ],
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
  inner.w = Math.max(1, Math.round(inner.w));
  inner.h = Math.max(1, Math.round(inner.h));

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
      align: G.safe && G.safe.centreBias ? "center" : undefined,
      startPx: p.bigType ? Math.round(tk.ideal * 1.35) : tk.ideal,
    };
    stack = p.stack && p.stack.h <= avail ? p.stack : fit(inner.w, avail, opts);
    /* An extra line of type at full size beats the same words shrunk to fit
       three. Legibility first, tidy line count second. */
    if ((!stack || stack.headlinePx < tk.ideal * 0.86) && baseLines < 4) {
      const longer = fit(inner.w, avail, { ...opts, maxLines: baseLines + 1 });
      if (longer && (!stack || longer.headlinePx > stack.headlinePx)) stack = longer;
    }
    if (!stack) stack = fit(inner.w, avail, { ...opts, maxLines: baseLines + 1, cta: false });
    if (!stack) stack = fit(inner.w, avail, { ...opts, maxLines: baseLines + 1, cta: false, subline: false });
    if (!stack) {
      stack = fit(inner.w, avail, { ...opts, cta: false, subline: false, maxLines: 2, floorPx: Math.max(11, tk.floor * 0.82) });
      if (stack) notes.push({ level: "info", text: "Only the headline fits at this size." });
    }
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

export async function composeAsset(spec) {
  const {
    w, h, variant, photo, band, headline, subline, cta, kicker,
    logoKey, placement, focal, showSafe,
  } = spec;
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
  const design = spec.design ? designById(spec.design) : null;
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
    return Math.abs((bw / bh) / ma - 1) <= ASPECT_TOLERANCE ? master : srcImg;
  };
  let logoImg = null, compactLogoImg = null;
  if (v.logo) {
    logoImg = await loadLogo(logoKey, band.logo, notes);
    compactLogoImg = logoKey === COMPACT_LOGO ? logoImg : await loadLogo(COMPACT_LOGO, band.logo, notes);
  } else if (v.copy) {
    /* The end frame below only ever fires on a copy variant, and a mark is
       the one thing it has to show. Without this a 320x50 "copy only" ad
       exports as a flat rectangle with a button and no brand on it at all. */
    compactLogoImg = await loadLogo(COMPACT_LOGO, band.logo, notes);
  }
  /* Full bleed decides its own polarity from the photograph, so both
     colourways of the mark have to be on hand. */
  const altSuffix = band.logo === "-inverse" ? "" : "-inverse";
  let logoAltImg = null, compactAltImg = null;
  if (v.logo && normaliseLayout(spec.layout) === "fullbleed") {
    logoAltImg = await loadLogo(logoKey, altSuffix, notes);
    compactAltImg = logoKey === COMPACT_LOGO ? logoAltImg : await loadLogo(COMPACT_LOGO, altSuffix, notes);
  }

  const C = {
    headline, subline, cta, kicker,
    fg: band.fg,
    accentInk: band.id === "charcoal" ? band.accent : COLORS.charcoal,
    ctaBg: spec.ctaBg || (band.id === "charcoal" ? COLORS.white : COLORS.charcoal),
    ctaFg: spec.ctaFg || (band.id === "charcoal" ? COLORS.charcoal : COLORS.white),
  };

  const INK = [];
  const ink = (x, y, iw, ih, colour) => INK.push({ x, y, w: iw, h: ih, colour });

  /* The approved library already has the Professionals shapes composed into the
     photography. Knowing that stops the engine from adding a fourth. */
  const photoHasProfessionals = /photo-plus-/.test(String(photo || ""));
  /* Seeded from what this file actually is, so a composition is stable for a
     given placement and different across the set. */
  const seed = seedOf(`${spec.design || requested}|${w}x${h}|${(placement && placement.platform) || ""}|${(placement && placement.placement) || ""}|${spec.rotationSeed || ""}`);
  const G = { w, h, safe, tk, cls, v, band, logoImg, compactLogoImg, photoImg: img, photoHasProfessionals, seed, dp: designParams };
  const fit = makeFitter(ctx, C, tk);

  /* Declared before the early return below, because the report is built the
     same way for every variant. */
  let cropCoverage = 1, upscale = 1, cropZoom = 1, plan = null, photoDrawn = false;
  /* Which picture the photograph was actually drawn from. The adapter's
     family master and the original source are both legitimate answers
     and they mean different things to anyone reading these numbers: a
     cropZoom of 0.9 against a master is not the same claim as a cropZoom
     of 0.9 against the source. The file says which one it is rather than
     leaving it to be inferred. */
  let drewFrom = null;
  let contrast = contrastRatio(hexL(band.fg), hexL(band.bg));
  let veilAlpha = 0, backdrop = null, refreshBackdrop = () => {};

  /* The clean variant is the photograph and nothing else. No planner runs,
     so no structure is drawn: reporting the requested one here would credit
     a design with a file it had no hand in. */
  if (!v.copy && !v.logo && img && !noPhotoRoute) {
    drawn = "photo";
    const pi = pickImg(w, h);
    const f = focal || bestFocal(pi, w, h);
    cropCoverage = f.coverage != null ? f.coverage : 1;
    cropZoom = f.zoom != null ? f.zoom : 1;
    upscale = drawPhoto(ctx, pi, { x: 0, y: 0, w, h }, f);
    drewFrom = pi === master ? "master" : "source";
    photoDrawn = true;
    if (showSafe) drawSafeOutline();
    return finish();
  }

  if (safe.centreBias && v.copy && img && !noPhotoRoute) {
    drawn = "centred";
    plan = blockPlan(G, fit, centreLockupPlan(G, fit));
    notes.push({ level: "info", text: "This publisher re-crops the file into several widget shapes, so the words sit in the centred band its own guidance asks for." });
  } else {
    /* An unknown structure falls back to the anchor. It draws an anchor, so
       it has to say anchor. */
    if (!STYLE_PLANNERS[drawn]) drawn = "anchor";
    plan = STYLE_PLANNERS[drawn](G, fit);
  }
  /* Typographic and pattern-led routes have no photograph by definition;
     every other style needs one. */
  if (!img && drawn !== "statement" && drawn !== "pattern") {
    drawn = "statement";
    plan = STYLE_PLANNERS.statement(G, fit);
    notes.push({ level: "info", text: "No photograph on this concept, so it is set typographically." });
  }
  if (plan && plan.micro && (v.copy || v.logo)) {
    drawn = "micro";
    plan = microPlan(G);
    notes.push({ level: "info", text: v.copy
      ? "Too small for a sentence, so this size runs as a brand end frame: mark and button only."
      : "Too small for a laid-out logo lockup, so this size runs as a brand end frame." });
  }
  notes.push(...(plan.notes || []));

  /* ---- paint ---- */
  const paintField = () => {
    if (!plan.field) return;
    ctx.fillStyle = band.bg;
    ctx.fillRect(plan.field.x, plan.field.y, plan.field.w, plan.field.h);
  };
  if (!plan.fieldOver) paintField();

  if (plan.patternOnly && plan.field) {
    const clear = plan.inner ? { x: plan.inner.x - tk.pad * 0.65, y: plan.inner.y - tk.pad * 0.65,
                                 w: plan.inner.w + tk.pad * 1.3, h: plan.inner.h + tk.pad * 1.3 } : null;
    await drawProfessionalsPattern(ctx, plan.field, band.accent === COLORS.teal ? "teal" : "blue",
      plan.patternCell, plan.patternAlpha, clear);
  }

  /* Optional Professionals texture on the colour field. Low density, palette colour,
     and it stops short of the copy: the brand allows it as texture and forbids
     it behind body text, and both halves of that are enforced here. */
  if (spec.pattern && plan.field && !plan.noPhoto) {
    const clear = plan.inner ? { x: plan.inner.x - tk.pad * 0.5, y: plan.inner.y - tk.pad * 0.5,
                                 w: plan.inner.w + tk.pad, h: plan.inner.h + tk.pad } : null;
    await drawProfessionalsPattern(ctx, plan.field, band.accent === COLORS.teal ? "teal" : "blue",
      Math.max(24, Math.round(tk.ref * 0.16)), band.id === "charcoal" ? 0.16 : 0.10, clear);
  }

  if (img && plan.photo && !plan.noPhoto) {
    const box = plan.photo;
    const pi = pickImg(box.w, box.h);
    const f = focal || bestFocal(pi, box.w, box.h, plan.focalTargetY, plan.focalTargetX);
    cropCoverage = f.coverage != null ? f.coverage : 1;
    cropZoom = f.zoom != null ? f.zoom : 1;
    if (plan.photoRound) { ctx.save(); roundRect(ctx, box.x, box.y, box.w, box.h, box.r || tk.radius); ctx.clip(); }
    upscale = drawPhoto(ctx, pi, box, f);
    drewFrom = pi === master ? "master" : "source";
    photoDrawn = true;
    if (plan.photoRound) ctx.restore();
  }
  if (plan.fieldOver) paintField();
  if (img && plan.mask) {
    const pi = pickImg(plan.mask.w, plan.mask.h);
    const f = focal || bestFocal(pi, plan.mask.w, plan.mask.h);
    cropCoverage = f.coverage != null ? f.coverage : 1;
    cropZoom = f.zoom != null ? f.zoom : 1;
    upscale = await drawPhotoInProfessionals(ctx, pi, band.id === "blue" ? "teal" : "blue", 0, plan.mask, f);
    drewFrom = pi === master ? "master" : "source";
    photoDrawn = true;
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
  /* Restraint with the signature. The approved library already has the Professionals
     shapes built into the photography, and stacking more on top is exactly
     the over-branding that makes a native ad look like an ad. One glyph on
     the colour field, or none when the picture already carries them. */
  const glyphs = [];
  for (const p of glyphs) {
    if (p.size < tk.ref * 0.05) continue;
    await drawProfessionals(ctx, p.color, p.i, p.cx, p.cy, p.size, p.rot);
  }

  /* Type sits on a solid field in every style, so contrast is a property of
     the palette, not a hope. The one exception is a logo dropped onto the
     photograph, which gets measured and scrimmed if the picture is busy. */
  const inner = plan.inner;
  const overPhoto = !plan.field && !plan.card;

  if (plan.micro) {
    const mark = compactLogoImg || logoImg;
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
      ink(x0, ly, Math.round(lw), Math.round(lh), band.fg);
      if (lh < BRAND.logoMinPx - 0.5) notes.push({ level: "warn", text: "This size cannot hold the logo at the 24px brand minimum." });
    } else if (!ctaW) {
      /* Neither a mark nor a button fits. Shipping a blank colour rectangle
         would be worse than an ugly one, so set the headline at the floor. */
      const last = fitStack(ctx, C, inner.w, inner.h, tk, { maxLines: 2, cta: false, subline: false, floorPx: 11, startPx: tk.floor });
      if (last) last.draw(ctx, inner.x, Math.round(inner.y + (inner.h - last.h) / 2), C, ink);
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
      ink(bx, by, ctaW, ctaH);
    }
    if (showSafe) drawSafeOutline();
    return finish();
  }

  let stackTop = inner.y;
  const logo = plan.logo;
  const footerLogo = !!plan.footer;
  const contentH = (plan.stack ? plan.stack.h : 0) + (logo && !footerLogo ? logo.h + (v.copy ? tk.pad * 0.85 : 0) : 0);
  if (plan.vAlign === "center") stackTop = Math.round(inner.y + Math.max(0, (inner.h - contentH) / 2));
  else if (plan.vAlign === "bottom") stackTop = Math.round(inner.y + Math.max(0, inner.h - contentH));

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
  const logoY = logo ? Math.round(plan.vAlign === "center" && !v.copy
    ? inner.y + (inner.h - logo.h) / 2
    : inner.y + inner.h - logo.h) : 0;
  const logoX = logo ? Math.round(centredLockup ? inner.x + (inner.w - logo.w) / 2 : inner.x) : 0;

  /* Which way round reads better on THIS photograph. A bright interior wants
     charcoal type and a light touch; a dark room wants white. Choosing by
     measurement beats defaulting, and it means far less veiling either way. */
  if (plan.autoPolarity && overPhoto && (plan.stack || logo)) {
    const t = plan.stack ? stackTop : logoY;
    const b = logo ? logoY + logo.h : stackTop + contentH;
    const probe = { x: inner.x, y: t, w: inner.w, h: Math.max(1, b - t) };
    const forWhite = worstBackdrop(backdrop, probe, true);
    const forDark = worstBackdrop(backdrop, probe, false);
    const aWhite = solveScrimAlpha(forWhite.rgb, true, hexL(COLORS.white), WCAG_AA * 1.06);
    const aDark = solveScrimAlpha(forDark.rgb, false, hexL(COLORS.charcoal), WCAG_AA * 1.06);
    const wantWhite = aWhite <= aDark;
    C.fg = wantWhite ? COLORS.white : COLORS.charcoal;
    C.accentInk = C.fg;
    if (logoImg && logoAltImg) {
      const isInverseNow = band.logo === "-inverse";
      if (wantWhite !== isInverseNow) {
        const swap = logoImg; logoImg = logoAltImg; logoAltImg = swap;
        const swapC = compactLogoImg; compactLogoImg = compactAltImg; compactAltImg = swapC;
      }
    }
  }

  /* Measure first, always. Deciding whether to check by asking "is this over a
     photograph" was a guess, and it missed a flat accent square landing under a
     headline in the modular grid. Measuring costs one read of the canvas and
     never lies. */
  if (plan.stack || logo) {
    /* One veil for the whole lockup, not one per element, so the picture is
       touched once and the words sit in a single pool of light. */
    const top = plan.stack ? stackTop : logoY;
    const bot = logo ? logoY + logo.h : stackTop + contentH;
    const veilRect = {
      x: inner.x - tk.pad * 0.6, y: top - tk.pad * 0.6,
      w: inner.w + tk.pad * 1.2, h: (bot - top) + tk.pad * 1.2,
    };
    /* Aim above the line, not at it. The veil is solved against a sampled
       estimate of the picture and verified afterwards against every individual
       mark, and those two measurements never agree to the last decimal. A 20%
       margin is what makes the verified number land above 4.5 rather than a
       whisker under it. */
    const res = ensureContrast(ctx, backdrop, veilRect, C.fg, WCAG_AA * 1.2, w, h);
    veilAlpha = res.alpha;
    if (res.ratio < WCAG_AA) {
      notes.push({ level: "warn", text: `The photograph is too busy under the words here: ${res.ratio.toFixed(1)}:1 against the 4.5:1 the guidelines ask for. Move the copy or pick a calmer picture.` });
    }
  }

  if (v.copy && plan.stack) plan.stack.draw(ctx, inner.x, stackTop, C, ink);

  if (plan.footer) {
    /* A footer line carries the mark and the button side by side, which is the
       structure a poster reads fastest and the one a stacked lockup cannot do. */
    const f = plan.footer;
    let cx2 = f.x;
    if (logo && logoImg) {
      const src = logo.usedCompact ? compactLogoImg : logoImg;
      const ly2 = Math.round(f.y + (f.h - logo.h) / 2);
      ctx.drawImage(src, Math.round(f.x), ly2, logo.w, logo.h);
      ink(Math.round(f.x), ly2, logo.w, logo.h, C.fg);
      cx2 = f.x + logo.w + tk.pad;
    }
    if (v.copy && cta) {
      const cpx = Math.max(11, Math.round(tk.ideal * tk.ctaRatio));
      setFont(ctx, 700, cpx);
      const m2 = measureLine(ctx, cta);
      const bw = Math.round(m2.w + cpx * 2.5), bh = Math.round(cpx * 2.5);
      if (bw <= f.x + f.w - cx2) {
        const bx2 = Math.round(f.x + f.w - bw), by2 = Math.round(f.y + (f.h - bh) / 2);
        ctx.fillStyle = C.ctaBg; pill(ctx, bx2, by2, bw, bh); ctx.fill();
        setFont(ctx, 700, cpx);
        ctx.fillStyle = C.ctaFg;
        ctx.fillText(cta, bx2 + cpx * 1.25, by2 + bh / 2 + m2.asc / 2);
        ink(bx2, by2, bw, bh, null);
      }
    }
  } else if (logo && logoImg) {
    const src = logo.usedCompact ? compactLogoImg : logoImg;
    ctx.drawImage(src, logoX, logoY, logo.w, logo.h);
    ink(logoX, logoY, logo.w, logo.h, C.fg);
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
    /* HARD RULE. Only a platform's own reserved area can block a file. A
       house margin is taste, and taste does not get to delete work. */
    const tol = 1.5;
    const outside = INK.filter(k =>
      k.x < safe.left - tol || k.y < safe.top - tol ||
      k.x + k.w > w - safe.right + tol || k.y + k.h > h - safe.bottom + tol);
    const hard = safe.kind === "hard";
    const blocked = hard && outside.length > 0;
    if (outside.length && !hard) {
      notes.push({ level: "info", text: "Sits slightly wider than the studio margin at this size. No platform rule is broken." });
    }
    /* THE SOFTNESS SENTENCE IS NOT WRITTEN HERE ANY MORE.
       This engine measured the upscale while drawing and then drew its own
       conclusion in its own words, while `fileEnlargement` stated the same
       conclusion about the same measurement in different words — so one
       build could call a file soft in two vocabularies, and step 2 could
       call the family fine while step 3 called its files soft. The
       measurement is this engine's; the sentence is the module's. */
    const enlarged = fileEnlargement({ upscale, hasPhoto: !!img });
    if (enlarged.warns) notes.push({ level: "warn", text: enlarged.sentence });
    /* An extreme ratio always throws most of a photograph away. Saying so on
       a 728x90 is noise; saying so on a feed post is useful. */
    /* One line per kind of problem, not one per file. Exact percentages read
       as twenty separate findings when they are one. */
    if (cls !== "banner" && !(plan && plan.micro)) {
      if (cropCoverage < 0.42)
        notes.push({ level: "warn", text: "This ratio cuts into the subject. A photograph shaped closer to this family would hold together better." });
      if (cropZoom < 0.22)
        notes.push({ level: "warn", text: "Less than a quarter of the photograph survives this ratio. It is the wrong shape for this placement." });
    }
    const st = plan && plan.stack;
    const wc = verifyContrast();
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
      design: design ? design.id : null, cls, tk, notes,
      blocked,
      blockedReason: blocked
        ? `${outside.length} element${outside.length > 1 ? "s" : ""} could not be kept out of the platform's reserved area at ${w}x${h}. Not exported.`
        : null,
      ink: INK,
      metrics: {
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
        upscale: +upscale.toFixed(2),
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
