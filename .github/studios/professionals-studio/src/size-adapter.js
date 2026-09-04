/* =====================================================================
   PLUS SIZE ADAPTER
   One photograph, many placements. This module decides what that
   photograph becomes for each aspect-ratio family, renders it once, and
   says out loud what the adaptation cost.

   The export plan in step 2 has always declared a master size and an
   adaptation method per family. Nothing produced them. Every placement
   was cover-cropped straight off the source at its own pixel size, which
   is precisely the thing the strategy in agents/platform-export-presets.json
   forbids: "Never treat each pixel size as a separate generation." This
   file is the executor that was missing.

   Five ideas hold it up.

   1. A MASTER IS A DECISION, NOT A RESIZE.
      One composition per ratio family, taken once, and every pixel size
      in that family is a scale of it. That is what makes a set read as
      one campaign instead of twenty independent crops of the same
      picture, and it is why the number of recompositions is the number
      of families rather than the number of placements.

   2. NEVER ENLARGE TO MAKE A MASTER.
      The declared master is a ceiling, not a target. If the source
      cannot fill 2560x1440 the master is rendered at the largest frame
      the source genuinely holds at that ratio, and the shortfall is
      reported as a number. Enlarging here would bake softness into
      every file in the family and hide it behind an official-looking
      size. Losing detail is the exact thing this was built to stop, so
      the source -> master step is the one step that is guaranteed
      lossless in scale.

   3. A VERDICT IS MEASURED, NOT LOOKED UP.
      The old plan decided the method with two lines: 3:2 and 3:1 are a
      rebuild, anything taller than 1.4 is an outpaint, everything else
      crops. It never looked at the image. A family here is classified
      from the actual geometry of the actual photograph: where the
      protected subject sits, whether any frame at that ratio can hold
      it inside the source at all, and how far past the source edge the
      frame would have to grow. Two photographs of different shapes give
      two different verdicts for the same family, because they should.

   4. THE CROP IS TOLD WHERE THE PLATFORM'S INTERFACE IS.
      bestFocal is excellent and it has never been shown a safe zone. On
      9:16 the usable box is 716x944 floating in the upper middle of
      1080x1920, and TikTok's own margins are asymmetric, 122 left
      against 242 right, so the geometric centre of the frame is the one
      place the subject should not be. The master asks bestFocal to land
      the subject in the middle of the band a person can actually see,
      not the middle of the canvas.

   5. WHAT CANNOT BE SERVED IS SAID, NOT SMOOTHED OVER.
      A family that cannot be filled without slicing a protected element,
      or without enlarging past a defensible limit, produces a verdict
      and a requirement: what is wrong, and what source would fix it. It
      is written in the same voice as the export plan's own hard
      adaptations, and it appears in the same place. The file is still
      built, because a missing file helps nobody, but nobody is left to
      discover the damage in the export.

   WHAT THIS FILE DOES NOT DO. It does not extend anything. A family
   classified `extend` is reported as needing an extension and served as
   the tightest honest crop; it is never silently downgraded to `direct`.
   imagery-agent.js and /api/image/extend can now actually perform that
   extension when a key is present — the classification below is what
   decides which families are offered it — and when one is run the
   extended frame comes back through here as a new source for that one
   family, so every number in the verdict is remeasured rather than
   inherited. Nothing in this file calls an API.

   WHAT "PROTECTED" MEANS HERE, EXACTLY. There is no face detector, no
   object detector and no floating-UI detector in this repo, and none is
   invented here. The protected box is the region holding the bulk of the
   saliency mass, widened to include the skin channel's own core. It is a
   guard against slicing the subject, and it is not element recognition:
   it cannot tell a face from a lamp, and at 72 cells across it cannot
   isolate a Professionals shape from the wall behind it. The size-adapter spec
   makes floating UI its hardest-protected class with an automatic
   validation failure attached, and that check is NOT implemented here
   because nothing in this repo can see a UI card in a photograph. Saying
   so is the point; a detector that returns "no UI found" for every
   picture would be worse than an absent one.

   THE NUMBERS BELOW ARE AUTHORED, NOT SPEC. agents/size-adapter-agent.md
   states the direct / extend / rebuild decision qualitatively and gives
   no threshold for any of it; the words upscale, resolution and enlarge
   do not appear in it at all. Every constant in this file is a judgement
   made here, labelled as such, and kept in one place so it can be argued
   with. SOFT_UPSCALE and ASPECT_TOLERANCE are the two exceptions: both are
   ad-engine's, imported and re-exported below rather than re-authored, so
   the two files cannot disagree about when a photograph has gone soft or
   about when two shapes are the same shape. They used to be written down
   twice, in comments that pointed at each other, and agreed by luck.

   Everything customer facing stays German. This file is English.
   ===================================================================== */

import { analyzeImage, bestFocal, SOFT_UPSCALE, ASPECT_TOLERANCE } from "./ad-engine.js";
import { lookupSafeZone } from "./safe-zones.js";

export const ADAPTER_VERSION = "1.0.0";

/* ---------------------------------------------------------------------
   The authored constants. All of them.
   --------------------------------------------------------------------- */

/* Where a photograph starts looking soft, and where two shapes count as
   the same shape. Both are authored in ad-engine.js and re-exported here
   under the names this file has always used, because both were previously
   written down twice — SOFT_UPSCALE against a literal 1.45 in ad-engine's
   own upscale warning, ASPECT_TOLERANCE against ad-engine's MASTER_FIT —
   with each copy's comment pointing at the other and nothing binding them.
   They are imported rather than the other way round because this file is
   built on ad-engine's `analyzeImage` and `bestFocal`, so ad-engine is the
   lower of the two. */
export { SOFT_UPSCALE, ASPECT_TOLERANCE };

/* Where enlargement stops being a compromise and becomes a defect. At 2x
   a 1400px source is being asked to fill 2800px and every edge in the
   picture is invented by the resampler. Past this the adapter refuses to
   call the family served and states the source it would need. */
export const HARD_UPSCALE = 2.0;

/* WHEN A SCALE OF 1.0000001 IS A SCALE OF 1. Floating point arithmetic
   over integer pixel sizes lands a hair either side of 1 constantly, and
   the difference between "native" and "enlarged" is a sentence a person
   acts on. This is the tolerance that decides it, and it is declared here
   because this file is where the enlargement is measured.

   It used to be a bare 1.0005 in four places, one of which was a browser
   template deciding for itself whether a photograph was being enlarged —
   the exact shape of the disagreement `studio-facts.js`'s `softnessOf`
   was written to end. Nothing outside this file compares an upscale any
   more: they call `softnessOf(upscale)`, which classifies through this. */
export const NATIVE_TOLERANCE = 1.0005;

/* How far past the source edge a frame may need to grow and still count
   as an extension rather than a new composition. At a third of the
   target frame invented, a generative fill is finishing a photograph; at
   more than that it is making one up, and the honest answer is that the
   picture is the wrong shape for the placement. */
export const EXTEND_LIMIT = 0.35;

/* How much of the saliency mass is treated as tail rather than subject,
   per side, per axis. At 0.15 the protected box is the region holding
   the central 70% of the mass on each axis.

   THIS NUMBER EXISTS BECAUSE A BOUNDING BOX DOES NOT WORK HERE, which is
   worth writing down so nobody re-tries it. The first version thresholded
   the map and took the bounding box of every cell above the line. On the
   real library that answers "the whole photograph" almost every time: the
   skin channel alone fires on 6 to 10% of cells scattered right across
   the frame, because warm wood, beige walls and textiles pass a chroma
   window that was tuned to be tone-inclusive, and a box drawn around
   scattered cells is the frame. Every family then reported a cut, which
   is noise, not a finding. Mass is diffuse in a photograph of a room, so
   the question has to be asked of the distribution rather than of its
   extremes. bestFocal already works this way, taking subject extent from
   the 7th and 93rd percentiles of cumulative mass for exactly the same
   reason. */
export const PROTECT_TAIL = 0.15;

/* A placement below this many pixels is not a resize of a hero shot at
   any focal point. 100x75 is 7,500 pixels; a 300x250 banner is 75,000
   and survives a tight crop. The line is drawn between them. */
export const MICRO_PIXELS = 40000;

/* THE PRECISION THIS MODULE IS ENTITLED TO CLAIM.
   analyzeImage builds a map 72 cells wide and takes the height from the
   aspect, so the cells are square and one of them is srcW/72 across
   whatever the orientation. A protected box read off that map is
   accurate to a cell and no better, so an overhang smaller than a cell
   is not a cut, it is rounding. Every containment test in this file uses
   this one figure, which is what stops the classification disagreeing
   with the cut list about the same photograph. */
export const ANALYSIS_CELLS = 72;
export const cellOf = srcW => srcW / ANALYSIS_CELLS;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* =====================================================================
   1. PURE GEOMETRY
   No canvas, no Image, no DOM. Everything in this section is arithmetic
   over numbers, which is what makes the verdicts testable under
   `node --test` instead of only in a browser.
   ===================================================================== */

/* The largest window of a given aspect that fits inside a source. This is
   the frame a cover-crop actually shows, and its area is the honest
   answer to "how much of my photograph survives this ratio". */
export function fitAspect(srcW, srcH, aspect) {
  if (!(srcW > 0 && srcH > 0 && aspect > 0)) return { w: 0, h: 0 };
  return srcW / srcH > aspect
    ? { w: srcH * aspect, h: srcH }
    : { w: srcW, h: srcW / aspect };
}

/* The smallest window of a given aspect that contains a box. If this is
   larger than the source on either axis, then no crop at this ratio can
   hold that box, and the frame has to grow past the source edge. That
   single comparison is the whole direct-versus-extend decision. */
export function containWindow(box, aspect) {
  const w = Math.max(1e-6, box.x1 - box.x0), h = Math.max(1e-6, box.y1 - box.y0);
  return w / h > aspect ? { w, h: w / aspect } : { w: h * aspect, h };
}

/* Where the crop lands, in source pixels, for a focal point. This mirrors
   drawPhoto's clamp exactly: the window is pinned inside the source, so
   it can never hang off an edge and leave a gap. Reimplementing it here
   rather than importing is deliberate, because drawPhoto works on a
   canvas context and this has to run in Node. The two are checked against
   each other by the tests. */
export function windowAt(srcW, srcH, win, focal) {
  const fx = focal && focal.x != null ? focal.x : 0.5;
  const fy = focal && focal.y != null ? focal.y : 0.42;
  return {
    x: clamp(fx * srcW - win.w / 2, 0, Math.max(0, srcW - win.w)),
    y: clamp(fy * srcH - win.h / 2, 0, Math.max(0, srcH - win.h)),
    w: win.w, h: win.h,
  };
}

/* RECOMPOSE BEFORE YOU CROP.
   The spec is explicit that a crop is the last resort, not the first
   move: if the composition does not fit safely, move things inward
   before cutting. A bitmap has nothing to move except the frame, so this
   is that rule in the only form it can take here. If the chosen window
   slices the protected box, and a window at this ratio exists that would
   not, slide to the nearest one. If no such window exists the slice is
   geometric rather than a bad choice, and bestFocal's own decision is
   left alone: it already weights a cut at the top of the frame 2.1x a
   cut at the bottom, which is a judgement this function has no business
   overriding. */
export function recompose(rect, srcW, srcH, box, tol) {
  const t = tol != null ? tol : 0;
  /* Three cases per axis, and the middle one is the one that matters.

     The frame is bigger than the subject: slide the minimum distance that
     clears it, which keeps as much of bestFocal's decision as possible.

     The frame is within a cell of the subject: the overhang is inside the
     measurement's own precision, so it is not a cut, but it still has to
     be SPLIT rather than dumped on one side. Pinning to the subject's
     leading edge was the first version and it put the entire overhang on
     the far edge, which then read as a cut on that side while the
     containment test said the subject fitted. Centring makes the two
     agree and is the better composition anyway: if a sliver has to go,
     take it evenly off both ends rather than lopping one off.

     The frame is genuinely smaller: leave bestFocal alone. It already
     weights a cut at the top of the frame 2.1x a cut at the bottom
     because one is a decapitation and the other is not, and no rule in
     here is entitled to overrule that. */
  const seat = (v, lo, hi, span, extent, size) => {
    if (span >= extent) return clamp(clamp(v, hi - span, lo), 0, Math.max(0, size - span));
    if (span + 2 * t >= extent) return clamp((lo + hi) / 2 - span / 2, 0, Math.max(0, size - span));
    return v;
  };
  return {
    x: seat(rect.x, box.x0, box.x1, rect.w, box.x1 - box.x0, srcW),
    y: seat(rect.y, box.y0, box.y1, rect.h, box.y1 - box.y0, srcH),
    w: rect.w, h: rect.h,
  };
}

/* Which sides of the protected box the frame cuts through. Named sides
   rather than a boolean, because "cut at the top" and "cut at the bottom"
   are not the same finding to anyone looking at a photograph of a person. */
export function cutsOf(rect, box, tol) {
  const t = tol != null ? tol : 0.5;
  const cuts = [];
  if (box.x0 < rect.x - t) cuts.push("left");
  if (box.y0 < rect.y - t) cuts.push("top");
  if (box.x1 > rect.x + rect.w + t) cuts.push("right");
  if (box.y1 > rect.y + rect.h + t) cuts.push("bottom");
  return cuts;
}

/* How much of the protected box the frame keeps. Area of the overlap over
   area of the box: 1 means the subject is entirely inside the frame. */
export function held(rect, box) {
  const w = Math.max(0, Math.min(rect.x + rect.w, box.x1) - Math.max(rect.x, box.x0));
  const h = Math.max(0, Math.min(rect.y + rect.h, box.y1) - Math.max(rect.y, box.y0));
  const a = (box.x1 - box.x0) * (box.y1 - box.y0);
  return a > 0 ? (w * h) / a : 1;
}

/* How far apart the shapes in a group are, as a single number. Not a
   gate: whether a group is a ratio family is settled by whether the
   preset file declares a master for it, because that is the file's own
   statement and it is not something to be re-derived from the placements.
   This exists so the refusal can say HOW far apart they are — 320x50 next
   to 768x1024 is not a near miss, and the number makes that concrete. */
export function aspectSpread(placements) {
  const ars = (placements || []).map(p => p.w / p.h).filter(n => n > 0);
  if (ars.length < 2) return 0;
  return Math.max(...ars) / Math.min(...ars) - 1;
}

/* WHICH TWO PLACEMENTS THE SPREAD IS ACTUALLY BETWEEN.
   `aspectSpread` answers "how far apart"; the sentence that printed it
   answered "between which two" with `placements[0]` and the last row of
   the array. Those are file order, not aspect order, and on the real
   misc_banners group the result was arithmetically impossible: "These 10
   sizes span 1518% of aspect between them, from 300x250 to 1024x768" —
   1.20:1 and 1.33:1, an 11% spread, printed as the endpoints of a 1518%
   one. The extremes are a measurement, so they get measured here rather
   than assumed from the order somebody wrote the JSON in.

   `times` is the spread said the way the sentence says it: the widest
   shape divided by the tallest, so "16.2x apart" is a multiplication
   anyone can check against the two ratios printed beside it. */
export function aspectExtremes(placements) {
  const rows = (placements || []).filter(p => p && p.w > 0 && p.h > 0);
  if (!rows.length) return null;
  let widest = rows[0], tallest = rows[0];
  for (const p of rows) {
    if (p.w / p.h > widest.w / widest.h) widest = p;
    if (p.w / p.h < tallest.w / tallest.h) tallest = p;
  }
  return {
    widest, tallest,
    widestAspect: widest.w / widest.h,
    tallestAspect: tallest.w / tallest.h,
    times: (widest.w / widest.h) / (tallest.w / tallest.h),
  };
}

/* Where the subject should land inside the frame, given what the platform
   draws over it. The centre of the band a person can actually see, which
   on a 9:16 union box is y 0.386 and x 0.444 rather than the 0.5 / 0.46
   the crop optimiser would otherwise aim at. Only a hard zone moves this:
   a house margin is taste and taste does not get to move the subject. A
   centre-bias publisher does, because on those surfaces the platform
   re-crops the picture rather than the type. */
export function safeTarget(safe, w, h) {
  if (!safe || !(safe.kind === "hard" || safe.centreBias)) return { x: null, y: null };
  const x = ((safe.left || 0) + (w - (safe.right || 0))) / 2 / w;
  const y = ((safe.top || 0) + (h - (safe.bottom || 0))) / 2 / h;
  return { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
}

/* ---------------------------------------------------------------------
   The verdict for one family.
   --------------------------------------------------------------------- */

/* `subject` is normalised 0..1 against the source, so a caller can hand
   one over from a saliency map, from a face detector, or from a test
   fixture, and this function does not care which. `focal` is likewise
   whatever the caller chose: bestFocal in the browser, a fixed point in a
   test. Keeping both out of here is what makes the classification
   testable without a canvas. */
export function adaptFamily(input) {
  const {
    ratio, masterW, masterH, srcW, srcH,
    subject, focal, placements = [], safe = null, measured = true,
  } = input;

  const aspect = masterW / masterH;
  const box = {
    x0: subject.x0 * srcW, y0: subject.y0 * srcH,
    x1: subject.x1 * srcW, y1: subject.y1 * srcH,
  };

  /* --- the frame ------------------------------------------------------ */
  const tol = cellOf(srcW);
  const win = fitAspect(srcW, srcH, aspect);
  const frameSurvival = (win.w * win.h) / (srcW * srcH);
  const rect = recompose(windowAt(srcW, srcH, win, focal), srcW, srcH, box, tol);
  const cuts = cutsOf(rect, box, tol);
  const subjectHeld = held(rect, box);

  /* --- could any frame at this ratio have held the subject? ------------ */
  /* `win` is the largest frame at this ratio inside the source, so this is
     the same containment question the cut list asks, resolved before the
     focal point gets a vote. It is deliberately measured against `win`
     rather than against the source, and with the same one-cell tolerance
     per side, so the two answers cannot contradict each other. */
  const holdable = win.w + 2 * tol >= box.x1 - box.x0
                && win.h + 2 * tol >= box.y1 - box.y0;
  const need = containWindow(box, aspect);
  const outside = holdable ? 0
    : 1 - (Math.min(need.w, srcW) * Math.min(need.h, srcH)) / (need.w * need.h);

  /* --- the master, which is never enlarged ---------------------------- */
  /* The declared master is what the plan asks for. `wanted` is what that
     would cost the source. Anything over 1 is enlargement, so the render
     size is capped at the frame the source actually holds and the
     shortfall is carried as a number rather than absorbed. */
  const wanted = masterW / win.w;
  const cap = Math.min(1, 1 / wanted);
  const renderW = Math.max(1, Math.round(masterW * cap));
  const renderH = Math.max(1, Math.round(masterH * cap));
  const capped = wanted > NATIVE_TOLERANCE;
  /* BUILT HERE RATHER THAN IN THE RETURN, because the two per-placement
     findings below are written from it and `hardCasesFrom` writes the same
     two findings from the verdict it ends up on. One object in, one sentence
     out, whichever of the two lists is printing it. */
  const master = { w: renderW, h: renderH, declaredW: masterW, declaredH: masterH, capped, wanted };

  /* --- placements that are not actually this family's shape ------------ */
  /* A ratio family is supposed to hold one ratio, and one in the preset
     matrix does not: Moloco's 300x250 "Square banner" is filed under 1:1
     and is 6:5. Refusing the whole family over it was the first version
     and it cost four genuinely square placements their master to
     quarantine one misfiled row. The declared master is the family's
     authority on its own shape, so anything that disagrees with it by
     more than the tolerance is named as an outlier and served from the
     source, and the rest of the family is unaffected. */
  const outliers = placements.filter(p =>
    Math.abs((p.w / p.h) / aspect - 1) > ASPECT_TOLERANCE);
  const onMaster = placements.filter(p => !outliers.includes(p));

  /* --- what the placements then cost ---------------------------------- */
  /* Every pixel size in the family is a scale of the master, so the worst
     enlargement across the ones that actually come off it is the number
     that decides whether the source was big enough for this plan. An
     outlier is drawn from the source and its enlargement is not the
     master's fault, so it is not counted here. */
  let worst = 0, worstAt = null, micro = [];
  for (const p of onMaster) {
    const u = Math.max(p.w / renderW, p.h / renderH);
    if (u > worst) { worst = u; worstAt = p; }
  }
  for (const p of placements) if (p.w * p.h < MICRO_PIXELS) micro.push(p);

  /* NOTHING COMES OFF THE MASTER IS NOT NOTHING WAS ENLARGED.
     `worst` used to be set to 1 here whenever every placement in the family
     was an outlier, which classifies as `native`, and the card then printed
     "Every size in this family comes off the master without being enlarged"
     about a family in which no size comes off the master at all. That is a
     different statement, and it is the friendlier of the two. There is no
     enlargement to measure, so none is reported: null is the absence of a
     measurement, `softnessOf` names that `unknown`, and `enlargementFacts`
     prints no sentence for it. The outliers say what is happening to them,
     one line each, which is the honest answer. */
  const upscale = onMaster.length ? worst : null;
  const detail = upscale == null ? "unknown"
    : upscale <= NATIVE_TOLERANCE ? "native"
    : upscale <= SOFT_UPSCALE ? "adequate"
    : upscale <= HARD_UPSCALE ? "soft"
    : "insufficient";

  /* --- the method ----------------------------------------------------- */
  /* Measured, in this order.

     A frame that holds the whole protected box crops directly, whatever
     the ratio is. Otherwise the subject cannot be held by ANY frame at
     this ratio inside this source, and the only question left is how far
     past the source edge the frame would have to grow.

     Those two cases are exhaustive, and that is a property rather than an
     accident: `win` is the largest window at this ratio inside the source
     and `need` is the smallest one containing the subject, so whenever
     `need` fits in the source at all, `win` is at least as large on both
     axes and recompose above can always slide it clear. `holdable` and
     `cuts.length` are therefore never both true, and the test file pins
     that so a future change to recompose cannot quietly break it. */
  let method, methodReason;
  if (!measured) {
    /* The canvas could not be read, so there is no subject to reason
       about. Reporting "direct" here would be a claim; reporting a cut
       would be a guess. The dimensions are still arithmetic and still
       true, so those are reported and the rest is declared unknown. */
    method = "direct";
    methodReason = "The photograph could not be analysed in this browser, so nothing is claimed about where the subject sits. The window this ratio takes out of the source is still measured, and so is the share of the picture it keeps.";
  } else if (!cuts.length) {
    /* AND NEITHER OF THESE TWO CARRIES ITS FIGURES ANY MORE, for the reason
       the extend and rebuild sentences below stopped carrying theirs.
       Both printed `Math.round(win.w)`, `Math.round(win.h)` and
       `Math.round(frameSurvival * 100)` — a rounding rule authored inside a
       measuring module, three inches from a FRAME KEPT row that prints the
       same share through `sharePhrase`, which widens a figure until it
       cannot be misread as a limit beside it. Two roundings of one number
       on one card is exactly the class qa/one-source-of-truth.test.mjs
       fails the build over.

       This module cannot call `sharePhrase`: studio-facts.js imports THIS
       file, so importing it back is a cycle. `hardCasesFrom` at the foot of
       this file met the same wall and answered it the same way — hand the
       verdict over and let the surface write the sentence. `window` and
       `frameSurvival` are both on the verdict, and studio-facts.js's
       `familyFacts` writes these two sentences back, word for word, with
       the figures in them. */
    method = "direct";
    methodReason = "Crops directly. The subject sits inside the frame this ratio takes from the source.";
  } else if (outside <= EXTEND_LIMIT) {
    /* THE GEOMETRY, AND NOTHING BUT THE GEOMETRY.
       This sentence used to end "There is no outpainting in this build, so
       it is served as the tightest crop that keeps the most of the
       subject." That stopped being true when the extend executor shipped,
       and the very same family card now carries a working "Extend the
       photograph to 9:16" button — while a green test in
       qa/size-adapter.test.mjs held the false clause on screen.

       The clause was a claim about the SESSION: whether serve.py is holding
       a key. This module is pure, runs under `node --test`, and cannot know
       that. So it says only what it measured, and
       `studio-facts.js`'s `extendFacts(verdict, connection)` appends the
       capability sentence from the one thing that does know. The test now
       pins that invariant rather than pinning a sentence.

       NEITHER SENTENCE CARRIES A PERCENTAGE ANY MORE. Both printed
       `Math.round(outside * 100)` beside `Math.round(EXTEND_LIMIT * 100)`,
       so an `outside` of 0.35031876 read "35% … which is past the 35% an
       extension can honestly invent" — and every value in (0.35, 0.355)
       collided the same way. Changing the comparison would be the wrong
       fix: the ceiling is inclusive on the extend side on purpose, because
       "an extension can honestly invent up to 35%" means 35% is still
       honest, and `>=` would newly call a family sitting precisely ON the
       ceiling "past" it while doing nothing for the band that produced the
       sentence. What changes is the print. `outside` and EXTEND_LIMIT are
       both on the verdict, and `studio-facts.js`'s `sharePhrase` widens the
       printed precision until the two read differently — "35.03% … past the
       35% ceiling". One figure, printed once, by the surface that prints
       it. */
    method = "extend";
    methodReason = `Needs the canvas to grow past the source edge: no ${ratio} frame inside this photograph holds the whole subject, and the frame it needs runs past the file. The share that is missing is inside what an extension can honestly invent.`;
  } else {
    method = "rebuild";
    methodReason = `Needs a fresh composition. More of the ${ratio} frame this subject needs is missing from the source than an extension can honestly invent.`;
  }

  /* --- the requirement, when there is one ----------------------------- */
  /* Never a bare complaint. Every refusal says the source that would fix
     it, in pixels, because "supply a larger original" is not actionable
     and "supply at least 2560x1707" is. */
  /* AND IT IS MEASURED ONCE, HERE, AND CARRIED ON THE VERDICT.
     This used to divide the figure out into two local `needW`/`needH`
     consts, spend them on the sentence below and drop them —
     so `studio-facts.js`'s `enlargementFacts` divided the same window into
     the same placement a second time to get the same pair back. Two
     implementations of one measurement, and the only reason they agreed
     was that nobody had touched either. `needSource` is now the adapter's
     answer, the sentence is built from it, and the module reads it. */
  const reqs = [];
  let needSource = null;
  if (!measured)
    reqs.push("The photograph could not be read back off the canvas, usually a cross-origin image. Nothing here is a claim about the subject, only about the frame.");
  if (detail === "soft" || detail === "insufficient") {
    needSource = {
      w: Math.ceil(worstAt.w / (win.w / srcW)),
      h: Math.ceil(worstAt.h / (win.h / srcH)),
    };
    /* AND IT NO LONGER STATES THE ENLARGEMENT ITSELF, for the reason the
       percentages left these sentences: this module cannot import
       `studio-facts.js` — that file imports this one — so a figure printed
       here is a figure rounded here, a second time. It was, and the two
       roundings did not even agree on the character between the number and
       the word: this row read "1.93x" while the DETAIL row two lines above
       it, written by `enlargementFacts` out of `timesPhrase`, read "1.93×"
       off the same measurement. One card, one quantity, two spellings.

       `upscale` is on the verdict and `enlargementFacts` prints it once, in
       the sentence directly above this one, naming the same placement. What
       is left here is the half that sentence does not carry and that a
       person can act on: the source that would fix it. */
    reqs.push(`${worstAt.platform} ${worstAt.placement} at ${worstAt.w}x${worstAt.h} is the size that costs this family its detail. A source of at least ${needSource.w}x${needSource.h} would hold it at native detail.`);
  }
  if (method === "extend")
    reqs.push(`A source shaped closer to ${ratio}, or the same scene shot with room above and below the subject, removes the extension entirely.`);
  if (method === "rebuild")
    reqs.push(`This family wants its own frame: shoot or generate ${ratio} rather than cropping it out of a ${(srcW / srcH).toFixed(2)}:1 photograph.`);
  /* AND THE TWO PER-PLACEMENT FINDINGS ARE WRITTEN ONCE, BELOW.
     Both used to be authored here as prose and again inside
     `hardCasesFrom`, in different words, and both lists are printed on this
     same screen: the family card's NEEDS rows and the hard-adaptations panel
     under it. One reader saw "300x250 is filed under the 1:1 family but is
     1.20:1" and, four inches away, "300x250, which is 1.20:1 and not this
     family's 1.00:1". */
  for (const p of outliers) reqs.push(requirementOf(outlierCase(p, ratio, master)));
  for (const p of micro) reqs.push(requirementOf(microCase(p, master)));

  return {
    ratio, method, methodReason, measured,
    master,
    source: { w: srcW, h: srcH },
    window: rect,
    frameSurvival, subjectHeld: measured ? subjectHeld : null, cuts: measured ? cuts : [],
    holdable, outside,
    upscale, upscaleAt: worstAt, detail, outliers,
    /* The source that would hold the worst placement at native detail, in
       pixels, or null when nothing is short. The requirement sentence above
       is written from these two numbers and nothing recomputes them. */
    needSource,
    safeTarget: safeTarget(safe, masterW, masterH),
    safeKind: safe ? safe.kind : null,
    centreBias: !!(safe && safe.centreBias),
    requirements: reqs,
    micro,
    served: method === "direct" && detail !== "insufficient" && detail !== "soft",
    /* THE ONE ANSWER TO "SUBJECT WHOLE AND NOTHING ENLARGED".
       `served` answers a different question — "is there anything to ask the
       owner for?" — and an `adequate` family is served precisely because a
       1.37x enlargement is a compromise worth nothing being said about. The
       export plan's summary line then counted `served` while claiming "with
       the subject whole and no enlargement", so a 16:9 family whose own card
       read "the largest size enlarges the master 1.37x" was one of the three
       the sentence above it called clean. Two computations of one claim, and
       the weaker one printed the stronger sentence.

       `clean` is that sentence and nothing else, derived from the same
       `detail` the card prints, so the count and the card cannot drift apart
       again: no enlargement means native, and subject whole means a direct
       crop that was actually measured and cuts nothing. */
    clean: method === "direct" && measured && !cuts.length && detail === "native",
  };
}

/* A family whose placements do not share a ratio is not a family. It gets
   a verdict too, because saying nothing about ten Google and Moloco
   banners would be the same silence this module exists to end. */
export function adaptMixed(ratio, placements) {
  const n = (placements || []).length;
  const ex = aspectExtremes(placements);
  const tail = "Each one is composed from the source at its own size, which is what a fixed-size banner is: a layout job, not a crop of a photograph.";
  const shape = p => `${p.w}x${p.h}`;
  const reason = !ex
    ? `Not a ratio family, and no sizes are listed under it, so there is nothing to measure a master against. ${tail}`
    : ex.times > 1 + ASPECT_TOLERANCE
      ? `Not a ratio family. The widest of these ${n} sizes is ${shape(ex.widest)} at ${ex.widestAspect.toFixed(2)}:1 and the tallest is ${shape(ex.tallest)} at ${ex.tallestAspect.toFixed(2)}:1, ${ex.times.toFixed(1)}x apart in aspect, so no single master serves them. ${tail}`
      : `Not a ratio family: these ${n} size${n === 1 ? "" : "s"} agree on aspect, but the preset file declares no master for the group and a stand-in is not a master. ${tail}`;
  return {
    ratio, method: "rebuild", mixed: true,
    methodReason: reason,
    master: null, window: null,
    frameSurvival: null, subjectHeld: null, cuts: [],
    upscale: null, detail: "n/a", outliers: [], safeKind: null, centreBias: false,
    needSource: null,
    safeTarget: { x: null, y: null },
    requirements: [`Build these from display templates rather than expecting one photograph to carry all ${placements.length}.`],
    micro: placements.filter(p => p.w * p.h < MICRO_PIXELS),
    served: false,
    /* No master, so nothing comes off the photograph at all. */
    clean: false,
  };
}

/* ---------------------------------------------------------------------
   The plan.
   --------------------------------------------------------------------- */

/* `focalFor(ratio, aspectW, aspectH, target)` supplies the focal point.
   In the browser that is bestFocal against the real photograph; in a test
   it is a fixed point. The adapter never calls the crop optimiser itself,
   which is what keeps this function pure and what stops anyone
   reimplementing saliency in here. */
export function adaptPlan({ families, srcW, srcH, subject, focalFor, measured = true }) {
  return (families || []).map(f => {
    const placements = f.placements || [];
    /* No declared master means no canonical ratio, which is what
       misc_banners is: a group of fixed-size layout jobs that happens to
       share a JSON key. `has_master: false` is how a caller says the size
       it handed over is a stand-in it invented rather than the preset
       file's own figure — buildExportPlan falls back to the first
       placement's size so it has something to print, and a stand-in must
       never be mistaken for a canonical ratio. A family that DOES declare
       one keeps it even if a stray placement disagrees, because the
       declared master is the family's own statement of its shape and one
       misfiled row is not a reason to refuse the other four. */
    if (f.has_master === false || !f.master_w || !f.master_h || !placements.length)
      return adaptMixed(f.ratio, placements);
    const safe = f.safe || null;
    const target = safeTarget(safe, f.master_w, f.master_h);
    const focal = focalFor(f.ratio, f.master_w, f.master_h, target);
    return adaptFamily({
      ratio: f.ratio, masterW: f.master_w, masterH: f.master_h,
      srcW, srcH, subject, focal, placements, safe, measured,
    });
  });
}

/* ONE PLACEMENT, ONE FINDING, ONE SET OF WORDS.
   `adaptFamily`'s `requirements` and `hardCasesFrom` below are two lists of
   the same findings for two panels on one screen, and each used to author
   its own. These two functions are the finding; `requirementOf` is how the
   card's flat prose list prints it, and the panel prints the three fields
   as they are. */
function outlierCase(p, ratio, master) {
  const aspect = master.declaredW / master.declaredH;
  return {
    placement: `${p.platform} ${p.placement}`,
    problem: `${p.w}x${p.h} is filed under the ${ratio} family but is ${(p.w / p.h).toFixed(2)}:1, not this family's ${aspect.toFixed(2)}:1.`,
    recommendation: "It is composed from the source at its own size rather than off this family's master. Check whether it belongs in this family at all.",
  };
}

/* THE DIRECTION OF THE PROBLEM, NAMED, because the DETAIL row above this
   one says the opposite-sounding thing about the same family. A 4:3 card
   read "Every size in this family comes off the master without being
   enlarged" and then "100x75 is 7500 pixels. No crop of a hero shot
   survives it". Both are true and they are about opposite directions of
   scaling: DETAIL is about ENLARGING the master, this is about how far the
   master can be REDUCED and still be read. Neither sentence said which way
   it was pointing, so together they read as a contradiction. */
function microCase(p, master) {
  const reduces = !!master && p.w <= master.w && p.h <= master.h;
  return {
    placement: `${p.platform} ${p.placement}`,
    problem: `${p.w}x${p.h} is ${p.w * p.h} pixels. ${reduces
      ? "Nothing is enlarged to make it — the master reduces into it — but no crop of a hero shot stays legible that small."
      : "No crop of a hero shot survives that legibly."}`,
    recommendation: "It needs its own tight-crop art direction, not a resize of the family master.",
  };
}
function requirementOf(c) { return `${c.placement}: ${c.problem} ${c.recommendation}`; }

/* The refusals, in the shape and the voice the export plan already uses
   for its hard adaptations: what the placement is, what is wrong with it,
   and what to do instead. Matching that shape is the point; a second
   panel with its own tone would read as a different product.

   AND THE FAMILY'S OWN ROW CARRIES ITS VERDICT INSTEAD OF A SENTENCE.
   It used to write two, and both were third implementations: the subject
   one rounded `subjectHeld` with its own `Math.round`, where the family
   card three inches above prints it through `sharePhrase`, which widens the
   precision until a figure and the ceiling it is compared against read
   differently. The enlargement one said "enlarges the SOURCE 1.37x" where
   the card said "enlarges the MASTER 1.37x" — one number, two denominators,
   one screen, and only the card's was right, because every placement in a
   family is a scale of the master and not of the photograph.

   This module cannot call either derivation: `studio-facts.js` imports THIS
   file, so importing it back would be a cycle. So the row hands over the
   verdict and the surface calls `sharePhrase` and `enlargementFacts` — the
   same two calls the family card above the panel already makes. */
export function hardCasesFrom(verdicts) {
  const out = [];
  for (const v of verdicts || []) {
    if (v.mixed) {
      out.push({ placement: `${v.ratio} group`, problem: v.methodReason, recommendation: v.requirements[0] });
      continue;
    }
    if (v.method === "rebuild" || v.detail === "insufficient" || v.detail === "soft" || v.cuts.length)
      out.push({
        placement: `${v.ratio} family`, ratio: v.ratio, verdict: v,
        recommendation: v.requirements[0] || v.methodReason,
      });
    for (const p of (v.outliers || [])) out.push(outlierCase(p, v.ratio, v.master));
    for (const p of v.micro) out.push(microCase(p, v.master));
  }
  return out;
}

/* =====================================================================
   2. THE PROTECTED BOX
   Pure over a saliency map, so it is testable with a hand-built array.
   ===================================================================== */

/* WHERE THE SUBJECT'S MASS ACTUALLY IS.
   Sum the map down each axis, then take the span between the q and 1-q
   quantiles of cumulative mass on each. A tail of scattered background
   texture cannot drag the box outward, because moving the box takes
   mass, and that is the whole reason this is a quantile rather than a
   bounding box. Where the subject is concentrated the box is tight;
   where the picture is uniformly busy it settles on the middle, which is
   the honest answer for a frame with no subject in particular. */
export function coreBox(map, W, H, q) {
  const cols = new Float32Array(W), rows = new Float32Array(H);
  let total = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = map[y * W + x]; cols[x] += v; rows[y] += v; total += v;
  }
  if (!(total > 0)) return { x0: 0, y0: 0, x1: 1, y1: 1 };
  const at = (s, len, f) => {
    const want = total * f;
    let a = 0;
    for (let i = 0; i < len; i++) { a += s[i]; if (a >= want) return i; }
    return len - 1;
  };
  return {
    x0: at(cols, W, q) / W, x1: (at(cols, W, 1 - q) + 1) / W,
    y0: at(rows, H, q) / H, y1: (at(rows, H, 1 - q) + 1) / H,
  };
}

export function unionBox(a, b) {
  if (!a) return b; if (!b) return a;
  return {
    x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0),
    x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1),
  };
}

/* WHAT THIS MODULE TREATS AS PROTECTED, AND WHY IT DIFFERS FROM bestFocal.

   bestFocal deliberately de-weights saturation to 0.10, with the comment
   that "a crop should follow the person, not the decoration". For
   choosing where to point a crop that is exactly right. For deciding
   whether a crop is allowed to slice something it is exactly wrong: the
   imagery spec requires a minimum of two complete Professionals shapes with every
   arm present, and the size-adapter spec lists branded content in the
   photograph as protected and forbids clipping it. So the protected box
   is taken from the blended saliency map, where the Professionals shapes survive
   on their edge and saturation contribution, and unioned with the skin
   channel, which is the one thing that must never be sliced.

   The honest limit: the map is 72 cells wide and the channels are
   blended, so this cannot isolate a Professionals shape from any other high
   salience detail. It protects the hot region as a whole, which contains
   them. It is a guard against slicing the subject, not a segmentation. */
export function protectedBox(analysis) {
  if (!analysis || !analysis.ok || !(analysis.total > 0)) return { x0: 0, y0: 0, x1: 1, y1: 1 };
  const { sal, w: W, h: H } = analysis;
  const detail = coreBox(sal, W, H, PROTECT_TAIL);
  /* A picture with no people has an all-zero person channel, and an
     empty map has no core. Only union it in when there is actually skin
     there, which is also the only case where it says anything the
     blended map does not: the person core usually sits inside the detail
     core and widens it exactly when the people are somewhere the general
     detail is not. */
  let personMass = 0;
  if (sal.person) for (let i = 0; i < W * H; i++) personMass += sal.person[i];
  return personMass > 0
    ? unionBox(detail, coreBox(sal.person, W, H, PROTECT_TAIL))
    : detail;
}

/* =====================================================================
   3. THE BROWSER SIDE
   Everything below needs a canvas. Nothing above does.
   ===================================================================== */

/* One adaptation plan for one photograph across one export plan's
   families. bestFocal is asked for the focal point, once per family,
   with the safe zone's own centre as the target where the platform
   publishes one. */
export function adaptImage(img, families) {
  const a = analyzeImage(img);
  const subject = protectedBox(a);
  const withSafe = (families || []).map(f => ({ ...f, safe: f.safe || familySafe(f) }));
  const verdicts = adaptPlan({
    families: withSafe, srcW: img.width, srcH: img.height, subject,
    measured: !!a.ok,
    focalFor: (ratio, mw, mh, target) => bestFocal(img, mw, mh, target.y, target.x),
  });
  return { subject, analysisOk: a.ok, verdicts };
}

/* WHICH SAFE ZONE A FAMILY COMPOSES TO.
   A family can hold placements from several platforms whose zones are
   not the same box. One master serves all of them, so it has to satisfy
   the strictest margin on EVERY side at once — the union, not whichever
   entry happened to come first in the matrix.

   This is not a refinement, it is the difference between clearing TikTok
   and not. The 9:16 family holds Meta Stories, Meta Reels, TikTok In-Feed
   and a mobile web hero. Meta's own rule is symmetric, 6% on both sides,
   so taking Meta alone aims the subject at 0.500 across. TikTok's cited
   margins are 122 left against 242 right, and the union of the two puts
   the target at 0.444 — left of centre, which is exactly what the preset
   file means when it says never to centre a subject on the geometric
   centre of a 9:16 frame. The export plan's own safe-zone note already
   tells the reader to build to the union box; this is the code that
   actually does it.

   A hard zone wins outright, because it is a strip the platform draws
   its own interface over. Failing that, a centre-bias publisher, because
   on those surfaces the platform re-crops the picture and the middle is
   the only part guaranteed to survive. A house margin loses: it is taste,
   and taste does not move the subject. lookupSafeZone is the single
   source of truth for every number here and this never invents one. */
export function familySafe(family) {
  const zones = (family.placements || [])
    .map(p => lookupSafeZone(p.platform, p.placement, family.master_w, family.master_h));
  const hard = zones.filter(z => z.kind === "hard");
  if (hard.length) {
    return {
      kind: "hard", centreBias: hard.some(z => z.centreBias),
      top: Math.max(...hard.map(z => z.top || 0)),
      right: Math.max(...hard.map(z => z.right || 0)),
      bottom: Math.max(...hard.map(z => z.bottom || 0)),
      left: Math.max(...hard.map(z => z.left || 0)),
    };
  }
  return zones.find(z => z.centreBias) || null;
}

/* The master itself. A straight source-rectangle draw: no resampling
   beyond the one scale, no filter, no border, and the scale is capped at
   1 by adaptFamily so this step can never enlarge. */
export function renderMaster(img, verdict) {
  if (!verdict || verdict.mixed || !verdict.master) return null;
  const c = document.createElement("canvas");
  c.width = verdict.master.w; c.height = verdict.master.h;
  const x = c.getContext("2d");
  x.imageSmoothingQuality = "high";
  const r = verdict.window;
  x.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, c.width, c.height);
  return c;
}

/* Every master for one photograph, keyed by ratio. A family with no
   master, which is any group whose placements do not share a ratio, is
   absent from the map on purpose: the caller then falls through to the
   source, which is the correct treatment for a fixed-size banner. */
export function buildMasters(img, families) {
  const { subject, analysisOk, verdicts } = adaptImage(img, families);
  const masters = new Map();
  for (const v of verdicts) {
    const c = renderMaster(img, v);
    if (c) masters.set(v.ratio, c);
  }
  return { masters, verdicts, subject, analysisOk };
}
