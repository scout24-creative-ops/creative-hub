/* =========================================================================
   STUDIO FACTS. ONE DERIVATION PER FACT.

   WHY THIS FILE EXISTS. A reviewer walked this product three times and came
   back with the same finding each time: every fact on screen was recomputed
   by whichever surface happened to print it. Not one bug eleven times — one
   missing module, showing through in eleven places.

     - `planCounts` filtered out the group with no master and said "7 ratio
       families"; the adapter line two elements below said "of 8"; the deck
       slide built from the same record said "8 | ratio families"; and the
       card underneath all three said "Not a ratio family".
     - The rotation switch promised "8 structures" from a prediction over a
       pool of eight, and the results card for that same build named eleven,
       because the engine substitutes `statement`, `micro` and `photo` and
       the pool never contained them.
     - One 9:16 rectangle was described by a hand-written sentence carrying
       269/242/707/122, drawn by an SVG carrying 269/672/65/**140**, and
       measured by `familySafe` as a third thing. The 140 matched nothing in
       the product.
     - Settings computed its headline from the browser key and its rows from
       the server, so one card read "Connected from this browser" three rows
       above "Key — none. The server is running and holds no key."
     - A set under a megabyte read "870 KB" on the results card and "0.9 MB"
       on the bar directly beneath it.

   Eleven individual fixes would have produced another eleven next time,
   because the defect is not in any of the printed sentences. It is that a
   printed sentence was a computation. So: every contested fact gets exactly
   one function here, every printed figure is a field on the object it
   returns, and no surface does arithmetic on it.

   THE RULE THIS MODULE ENCODES, taken from what has actually worked in this
   product rather than from taste:

     1. COUNT FROM THE ARTIFACTS. A function whose answer can be counted
        from files, rows or blobs takes those as its first argument and is
        named for the fact. "Counted from the files themselves" has beaten
        every prediction in this repo, every time the two were compared.
     2. A PREDICTION SAYS SO IN ITS OWN NAME. Where an answer is genuinely
        needed before the files exist, the function is named `planned*` and
        returns an object, never a bare number, so `${plannedStructures(…)}`
        cannot be mistaken for a measurement at the call site. It also
        carries `prediction: true`, and its sentences say "would".
     3. TWO QUESTIONS ARE TWO FIELDS. Where something was previously fused,
        it stays apart and both halves keep their names: `clean` is not
        `served`, PLANNED is not DELIVERED, the geometry of an extension is
        not the capability to perform one, a family's predicted enlargement
        is not a file's measured one.
     4. NO SURFACE MAY `Math.round`, `filter`, `reduce`, `new Set`,
        `||`-fallback or write a plural rule of its own. Those five
        operations produced every disagreement listed above. Everything they
        were doing is a field here.

   CONTRACT, the same one build-records.js states in its own header:
   importing this module touches no browser API. It holds no state, reads no
   localStorage, no IndexedDB and no DOM, makes no network call and reads no
   clock. Plain data in, plain data out — which is what lets every sentence
   below be checked under `node --test` instead of only by looking at a
   screen. It imports only from safe-zones.js, size-adapter.js and the
   tables in ad-engine.js, all three of which already run in Node.

   ESCAPING. Every sentence comes out as plain text with no markup in it,
   and the caller still escapes at the interpolation. The house rule stands
   unchanged: nothing here is safe to inject, because nothing here is HTML.

   Interface copy is English. Nothing in this file is customer facing.
   ========================================================================= */

import {
  SOFT_UPSCALE, HARD_UPSCALE, EXTEND_LIMIT, ASPECT_TOLERANCE, NATIVE_TOLERANCE,
  familySafe,
} from "./size-adapter.js";
import { lookupSafeZone, BRAND_MARGIN_RATIO, SAFE_ZONE_VERSION } from "./safe-zones.js";
import {
  LAYOUTS, ENGINE_STRUCTURES, DESIGNS, ROTATION_POOL,
  rotationSet, seedOf, normaliseLayout, allowedVariants, withheldVariants,
} from "./ad-engine.js";

export const FACTS_VERSION = "1.0.0";

/* ---------------------------------------------------------------- shaping */
/* Tolerant readers. Every function here is handed something a browser built
   at three in the afternoon after a build that may have gone wrong, or a
   history row written by an older version of this Studio. None of them may
   throw, and none of them may invent. */
const arr = v => (Array.isArray(v) ? v : []);
const obj = v => (v && typeof v === "object" ? v : {});
const str = v => (typeof v === "string" ? v : "");
const num = v => (typeof v === "number" && Number.isFinite(v) ? v : null);
const uniq = list => [...new Set(list)];

/* =========================================================================
   0. THE SHARED RULES
   Three of them, and every sentence below is built out of these. They are
   here rather than at each call site because a plural rule written twice is
   a plural rule that will eventually disagree with itself — which is
   exactly what happened on two consecutive lines of the export plan header,
   where one sentence read "1 ratio families … 1 recompositions" directly
   above one that had it right.
   ========================================================================= */

/* THE ONE PLURAL RULE. Not a general English pluraliser and not trying to
   be: it covers the nouns this product prints, and an unknown noun gets the
   regular -s rather than a wrong -ies. */
const IRREGULAR = { is: "are", was: "were", has: "have" };
function pluralOf(noun) {
  const n = str(noun);
  if (IRREGULAR[n]) return IRREGULAR[n];
  if (/[^aeiou]y$/.test(n)) return n.slice(0, -1) + "ies";      /* family → families */
  if (/(s|x|z|ch|sh)$/.test(n)) return n + "es";
  return n + "s";
}
function plural(n, noun) { return n === 1 ? str(noun) : pluralOf(noun); }

/* THE ONE COUNT PHRASE, and the generalisation of `placementPhrase`, which
   already found the right shape and was applied in two of the nine places
   that printed a count.

   PLANNED and DELIVERED are two facts that must always travel together. One
   build printed "8 of 9 placements" in Concept Studio's history row, "9
   placements" in Deck Studio's campaign row and "9 | placements" on the
   deck's big-numbers slide — the delivered figure was in the record the
   whole time and neither Deck surface read it.

   Both numbers whenever they differ, one when they do not, and a null
   `planned` means the caller genuinely has no plan to compare against
   rather than a plan that happened to agree. */
export function countPhrase(delivered, planned, noun) {
  return countParts(delivered, planned, noun).text;
}

/* THE SAME DECISION, TAKEN APART, for the one surface that cannot print a
   sentence: the deck's big-numbers slide is a value column beside a label
   column. It used to re-decide "one number or two?" from the same two
   fields twelve lines below the call that had already decided — and the two
   readings disagreed about a null plan, so a build recordFacts described as
   "8 placements" reached the slide as "8 of null | placements".
   `value` is the figure column, and it is the figure the sentence carries. */
export function countParts(delivered, planned, noun) {
  const d = num(delivered) == null ? 0 : delivered;
  const p = num(planned);
  const both = p != null && p !== d;
  const value = both ? `${d} of ${p}` : `${d}`;
  return { value, delivered: d, planned: both ? p : null, both, text: `${value} ${plural(both ? p : d, noun)}` };
}

/* "The other placement", "The other 2 placements". A count of one is not
   worth printing when the article already says which one, and "The other 1
   placement" is what a template with no plural rule in it produces. */
function otherPhrase(n, noun) {
  return n === 1 ? `The other ${str(noun)}` : `The other ${n} ${pluralOf(noun)}`;
}

/* A LIST A PERSON CAN READ. "a, b and c". Used for platforms contributing a
   safe-zone edge and for structures counted off the files. Never for things
   that are alternatives — "a or b" would read as a choice nobody made.

   EXPORTED, BECAUSE THIS JOINER WAS WRITTEN THREE TIMES. size-adapter.js
   carried one called `orList` that joined with "and", and
   concept-studio.html carried a third that joined with "or" and stringified
   its items. Three joiners, two of them named for the conjunction the other
   one used, and the cut list printed "top and left and bottom" from one
   while the placement list printed "a, b or c" from another. One joiner per
   conjunction, and the conjunction is in the name. */
export function andList(list) {
  const a = arr(list).filter(Boolean);
  if (a.length <= 1) return a[0] || "";
  return a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
}

/* And the alternatives version, for a list of things that each independently
   caused the same refusal: "TikTok In-Feed or Snap Story accepts no still". */
export function orList(list) {
  const a = arr(list).filter(Boolean);
  if (a.length <= 1) return a[0] || "";
  return a.slice(0, -1).join(", ") + " or " + a[a.length - 1];
}

/* A SHARE AND THE CEILING IT IS BEING COMPARED TO, PRINTED SO THEY READ
   DIFFERENTLY WHEN THEY ARE DIFFERENT.

   Reproduced exactly, and this is the case that named the problem: source
   1400x933, subject {0.2115, 0.7885, 0.20, 0.80}, family 9:16 gives
   `outside = 0.35031876702153`, which is past EXTEND_LIMIT, so the family
   is classified `rebuild` — correctly. The card then printed
   `Math.round(outside * 100)`, so it read "35% … which is past the 35% an
   extension can honestly invent". Every `outside` in (0.35, 0.355) collides
   the same way.

   The fix is NOT the comparison. Changing `>` to `>=` does nothing for that
   band and newly pushes exactly 0.35 into the rebuild branch, where the
   card would call a family sitting precisely ON the ceiling "past" it. The
   ceiling is inclusive on the extend side on purpose: "an extension can
   honestly invent up to 35%" means 35% is still honest. So the comparison
   stays and the PRINT widens: format both figures at the same precision, 0
   then 1 then 2 decimal places, and stop at the first precision where they
   read differently. The ceiling then prints at its own natural precision,
   because it is an authored figure and "35.00%" claims a decision nobody
   made.

   Past 2 dp the honest answer is words rather than digits: a value that is
   0.0001 over its ceiling is "just over", and printing "35.0001%" would be
   an invented measurement of a rounding error. */
export function sharePhrase(value, ceiling) {
  const v = num(value);
  const c = num(ceiling);
  if (v == null) return { value: null, ceiling: c, text: "", ceilingText: c == null ? "" : pct(c, 0), decimals: 0, distinct: false };
  if (c == null) return { value: v, ceiling: null, text: pct(v, 0), ceilingText: "", decimals: 0, distinct: true };
  for (let d = 0; d <= 2; d++) {
    if (pct(v, d) !== pct(c, d)) {
      return { value: v, ceiling: c, text: pct(v, d), ceilingText: pct(c, 0), decimals: d, distinct: true };
    }
  }
  /* Indistinguishable at the precision this module is willing to claim. */
  const text = v === c ? pct(c, 0) : v > c ? `just over ${pct(c, 0)}` : `just under ${pct(c, 0)}`;
  return { value: v, ceiling: c, text, ceilingText: pct(c, 0), decimals: 2, distinct: false };
}
function pct(v, decimals) {
  return `${(v * 100).toFixed(decimals)}%`;
}

/* AN ENLARGEMENT FACTOR, PRINTED ONCE, for the same reason `sharePhrase`
   exists one screen further down: a figure that is rounded where it is
   printed is rounded once per surface, and two surfaces then disagree about
   one measurement.

   This was already true INSIDE this file. `enlargementFacts` wrote
   `u.toFixed(2)` and `fileEnlargement` wrote it twice more, so the plan's
   figure and the file's figure agreed only because nobody had touched
   either — and two more surfaces wrote a fourth and fifth copy: the extend
   panel's "the source is enlarged 1.29×" and the family card's "would cost
   1.29×". Five roundings, one rule, no owner. This is the owner.

   THE CEILINGS DO NOT COME THROUGH HERE, deliberately, and for the reason
   `sharePhrase` gives about its own: SOFT_UPSCALE and HARD_UPSCALE are
   authored figures rather than measurements, and printing "2.00×" for a
   limit somebody wrote as 2 claims a precision nobody chose.

   A missing measurement returns "" rather than "null×", because there is no
   enlargement to report and inventing one is the defect one file over. */
export function timesPhrase(value) {
  const v = num(value);
  return { value: v, text: v == null ? "" : `${v.toFixed(2)}×` };
}

/* =========================================================================
   1. IS THIS GROUP A RATIO FAMILY, AND WHAT DOES THE PLAN ADD UP TO?

   THE FACT LIVES IN THE PRESET FILE AND THE VERDICT CARRIES IT.
   `adaptPlan` decides once, from the preset file's own statement, whether a
   group has a master: `has_master === false || !master_w || !master_h ||
   !placements.length` sends it to `adaptMixed`. The verdict it produces
   (`v.mixed`) is the artifact every surface reads. Not `fam.has_master`,
   not `fam.master_w`, and never `families.length`.

   `misc_banners` is the group that exposed this. It declares no master,
   because ten fixed-size IAB banners with baked text are a layout job and
   not crops of a photograph; `buildExportPlan` invents a stand-in size so
   the card has something to print. Every surface that counted
   `families.length`, or read the stand-in, counted it as a ratio family and
   promised a recomposition off a master that does not exist.
   ========================================================================= */

/* THE DECLARATION, READ THE WAY `adaptPlan` READS IT, AND USED ONLY WHEN
   THERE IS NO VERDICT TO READ INSTEAD.
   A verdict is missing in exactly one situation that matters: the export
   plan exists but the photograph could not be loaded, so nothing was
   measured. The plan header still has to count. Falling back to the
   family's own declaration is not a second opinion — it is the same
   sentence in the preset file that `adaptPlan` itself consults — and
   qa/studio-facts.test.mjs pins the two against each other over every
   family shape this product produces, so they cannot drift.

   `declaresMaster` is the narrower question "is there a rectangle here at
   all", which is what the safe zone needs; the ratio-family test adds the
   placements clause, which is `adaptPlan`'s exactly. */
function declaresMaster(family) {
  const f = obj(family);
  return f.has_master !== false && num(f.master_w) > 0 && num(f.master_h) > 0;
}
function ratioFamilyByDeclaration(family) {
  return declaresMaster(family) && arr(obj(family).placements).length > 0;
}

/* The plan's vocabulary and the adapter's are one word apart, deliberately:
   the screen has said direct / outpaint / rebuild since before the adapter
   existed, and `extend` is the same finding. Both are carried so nothing
   has to translate at a call site. */
const METHOD_PLAN_WORD = { direct: "direct", extend: "outpaint", rebuild: "rebuild", unmeasured: "unmeasured" };
const METHOD_LABEL = {
  direct: "Crops directly", outpaint: "Needs outpainting", rebuild: "Needs a rebuild",
  unmeasured: "Not measured yet",
};

/* THE CROP SENTENCE, WITH THE FIGURES IN IT — the direct-crop half of the
   rule `extendFacts` already keeps for the extend and rebuild halves.

   size-adapter.js wrote these two sentences itself, with its own
   `Math.round(win.w)`, `Math.round(win.h)` and `Math.round(frameSurvival *
   100)` in them. That is a printing rule living in a measuring module, and
   it is the shape qa/one-source-of-truth.test.mjs fails the build over: the
   share read "75%" here while `sharePhrase` — which the FRAME KEPT row two
   lines below prints, and which widens a figure until it reads differently
   from any ceiling beside it — was free to read it another way off the same
   number.

   The adapter cannot call `sharePhrase`: this file imports size-adapter.js,
   so importing it back is a cycle. `hardCasesFrom` met the same wall and
   solved it by handing the verdict over and letting the surface write the
   sentence; this is that solution again. The verdict already carries the
   window and `frameSurvival`, so nothing new is measured here — the words
   are assembled where the one share formatter lives.

   The sentences are word-for-word the ones the adapter used to write, on
   purpose. A rule satisfied by deleting a sentence a reader needed is not a
   fix, and this rule is about WHERE a figure is derived, not whether the
   reader is allowed to see it. */
function cropGeometry(verdict) {
  const v = obj(verdict);
  if (v.mixed) return "";
  const win = obj(v.window);
  const w = num(win.w), h = num(win.h);
  const kept = sharePhrase(v.frameSurvival, null).text;
  if (w == null || h == null || !kept) return "";
  const frame = `${Math.round(w)}x${Math.round(h)}`;
  /* An unmeasured family is always `direct` — the adapter has no subject to
     reason about and refuses to guess one — so this order is the one that
     distinguishes them. */
  if (v.measured === false)
    return `The photograph could not be analysed in this browser, so nothing is claimed about where the subject sits. The frame arithmetic still holds: this ratio takes a ${frame} window and keeps ${kept} of the picture.`;
  if (str(v.method) === "direct")
    return `Crops directly. The subject sits inside the ${frame} frame this ratio takes from the source, with ${kept} of the photograph kept.`;
  return "";
}

/* ONE FAMILY, ANSWERED ONCE.
   `verdict` is the adapter's verdict for this family — `fam.adapt` on the
   screen. Pass null when the adapter did not run; every field then says
   what it is reading from, and `measured` is false. */
export function familyFacts(family, verdict) {
  const f = obj(family);
  const v = verdict && typeof verdict === "object" ? verdict : null;
  const placements = arr(f.placements);

  /* READ, NEVER RECOMPUTED. */
  const isRatioFamily = v ? !v.mixed : ratioFamilyByDeclaration(f);
  const master = v && v.master ? { ...v.master } : null;
  const hasMaster = isRatioFamily && !!master;

  const outliers = v ? arr(v.outliers) : [];
  const onMaster = isRatioFamily ? placements.length - outliers.length : 0;
  const loose = placements.length - onMaster;

  /* NO VERDICT MEANS NO METHOD. `buildExportPlan` used to decide the method
     with two lines — 3:2 and 3:1 are a rebuild, anything taller than 1.4 is
     an outpaint — before anything had looked at the photograph. A method is
     a measurement now, so an unmeasured family says so rather than being
     handed a plausible word to print. */
  const methodId = v ? str(v.method) || "direct" : "unmeasured";
  const planWord = METHOD_PLAN_WORD[methodId] || methodId;
  const ext = extendFacts(v, null);

  return {
    ratio: str(f.ratio) || (v ? str(v.ratio) : ""),
    isRatioFamily,
    hasMaster,
    /* WHERE THE ANSWER CAME FROM, said out loud. A caller that wants to
       know whether it is looking at a measurement or a declaration must
       not have to infer it from which fields are null. */
    fromVerdict: !!v,
    /* A group with no master measured nothing, whatever the canvas did:
       `adaptMixed` never looks at the photograph, so "measured" would be a
       claim about work that did not happen. */
    measured: !!v && !v.mixed && v.measured !== false,
    master,
    /* The header chip used to interpolate `master_w`/`master_h` regardless,
       which is `buildExportPlan`'s stand-in, so a card read "Master 300×250"
       three lines above "None. These sizes do not share a ratio".

       THREE STATES, NOT TWO. A group that declares no master has none. A
       ratio family that has been measured has the one the adapter built,
       which is capped at the source's own resolution and is therefore
       often not the size the preset file declares. And a ratio family
       whose photograph could not be read has a declared size and no
       master — printing the declared one there would present a plan's
       request as a measured frame, which is the whole defect. */
    masterLabel: hasMaster ? `Master ${master.w}×${master.h}`
      : isRatioFamily ? "Master not measured yet"
      : "No master",
    placements: placements.length,
    onMaster,
    loose,
    outliers,
    methodId,                                   /* the adapter's word: direct | extend | rebuild */
    methodPlanWord: planWord,                   /* the screen's word: direct | outpaint | rebuild */
    methodLabel: METHOD_LABEL[planWord] || planWord,
    /* THE SENTENCE WITH THE FIGURES IN IT, where there are figures. The
       adapter is a pure module and states the geometry without a
       percentage in it, precisely because a percentage printed beside a
       ceiling has to be widened until the two read differently and that is
       a printing rule, not a measurement. `extendFacts` does the widening
       for the two methods that compare against the extension ceiling, and
       `cropGeometry` for the two that do not — a direct crop and a family
       whose photograph could not be read, which used to be the last two
       sentences in the product with a `Math.round(x * 100)%` inside them.
       The adapter's own sentence is the fallback, and it is what a group
       with no master gets, because `adaptMixed` measures no frame at all. */
    reason: v ? (ext.geometry || cropGeometry(v) || str(v.methodReason)) : "",
    /* GEOMETRY ONLY. Whether an extension is possible in this session is a
       fact about serve.py and lives in `extendFacts(verdict, connection)`.
       A family card that fused the two told the reader an extension was
       impossible while the button beside it sent one. */
    extendable: ext.offer,
    /* TWO PREDICATES, KEPT APART, because they answer different questions
       and a reviewer already caught them being collapsed. `clean` is "the
       subject is whole and nothing was enlarged". `served` is "there is
       nothing to ask the owner for", and it tolerates an enlargement up to
       1.45x — so an `adequate` family is served and is not clean. The
       summary line that counted `served` while claiming the stronger
       sentence is why both names exist. */
    clean: !!(v && v.clean),
    served: !!(v && v.served),
    detail: v ? str(v.detail) || "n/a" : "n/a",
  };
}

/* THE WHOLE PLAN, COUNTED ONCE.
   `source` is optional and describes the photograph everything was measured
   against — `{ version, name, source, analysisOk }`, exactly the report
   `measurePlan` already assembles. Given it, `sentences.adapter` is a
   complete sentence; without it, the sentence is the counts alone. */
export function planFacts(families, verdicts, source) {
  const fams = arr(families);
  const vs = arr(verdicts);
  /* Pair by index where the arrays correspond, which is what `adaptPlan`
     produces, and by ratio otherwise, which is what the screen does. A
     family with no verdict at all falls through to its own declaration. */
  const byRatio = new Map();
  for (const v of vs) if (v && v.ratio != null && !byRatio.has(v.ratio)) byRatio.set(v.ratio, v);
  const paired = fams.map((f, i) => {
    if (vs.length === fams.length && vs[i]) return [f, vs[i]];
    const own = obj(f).adapt;
    if (own && typeof own === "object") return [f, own];
    return [f, byRatio.get(obj(f).ratio) || null];
  });

  const all = paired.map(([f, v]) => familyFacts(f, v));
  const ratio = all.filter(x => x.isRatioFamily);
  const looseFams = all.filter(x => !x.isRatioFamily);

  const sum = (list, key) => list.reduce((n, x) => n + x[key], 0);
  const onMaster = sum(ratio, "onMaster");
  const allPlacements = sum(all, "placements");

  const facts = {
    allFamilies: all.length,
    ratioFamilies: ratio.length,
    looseFamilies: looseFams.length,
    /* ONE MASTER PER RATIO FAMILY. That is the whole reason the number of
       recompositions is the number of families rather than the number of
       placements, and it is named rather than left for a caller to infer
       from `ratioFamilies` — which is how three surfaces each ended up
       with their own arithmetic. */
    recompositions: ratio.length,
    onMaster,
    loose: allPlacements - onMaster,
    allPlacements,
    clean: all.filter(x => x.clean).length,
    served: all.filter(x => x.served).length,
    measured: all.filter(x => x.measured).length,
    families: all,
    /* The original family objects, split, so a caller that has to hand a
       list on to something else — `chooseGenerationSize` scores the API
       size against the families it is given, and used to score it against
       misc_banners' invented 300x250 — passes the right list instead of
       filtering one itself. */
    ratioFamilyList: paired.filter((_, i) => all[i].isRatioFamily).map(([f]) => f),
    looseFamilyList: paired.filter((_, i) => !all[i].isRatioFamily).map(([f]) => f),
  };
  facts.sentences = {
    plan: planSentenceOf(facts),
    adapter: adapterSentenceOf(facts, source),
  };
  return facts;
}

function planSentenceOf(c) {
  /* Degenerate and real: the picker can produce a selection that matches no
     preset placement at all, and "0 placements, and not one ratio family
     among them" is arithmetic pretending to be a finding. */
  if (!c.allPlacements) return "Nothing is planned yet: no placements, and so no families to compose for.";
  const pl = n => countPhrase(n, null, "placement");
  const loose = c.loose
    ? ` ${otherPhrase(c.loose, "placement")} ${c.loose === 1 ? "shares" : "share"} no ratio with anything, so each is built at its own size rather than off a master.`
    : "";
  if (!c.ratioFamilies)
    return `${pl(c.allPlacements)}, and not one ratio family among them: every size here is its own shape, so every one is built individually.`;
  const fam = countPhrase(c.ratioFamilies, null, "ratio family");
  /* One placement per family is not a saving, and "3 recompositions instead
     of 3 separate renders" would be arithmetic pretending to be an
     achievement. */
  if (c.ratioFamilies === c.onMaster)
    return `${pl(c.onMaster)} from ${fam}: one master per placement, so there is no saving to claim here.${loose}`;
  return `${pl(c.onMaster)} from ${fam}, `
       + `${countPhrase(c.recompositions, null, "recomposition")} instead of `
       + `${countPhrase(c.onMaster, null, "separate render")}.${loose}`;
}

/* THE ADAPTER LINE, WITH THE DENOMINATOR THE HEADER ABOVE IT USES.
   It printed "X of 8 families come off this photograph" under a header that
   had just said "7 ratio families", because it counted `verdicts.length`
   and one of those verdicts was the group that denies having a master. A
   group with no master cannot come off the photograph at all, so it was
   never a candidate and does not belong in the denominator — it belongs in
   its own clause, which is what it gets. */
function adapterSentenceOf(c, source) {
  const s = obj(source);
  const head = str(s.name) && str(s.source)
    ? `Measured against ${s.name}, ${s.source}. `
    : "";
  const loose = c.looseFamilies
    ? ` ${otherPhrase(c.looseFamilies, "group")} ${c.looseFamilies === 1 ? "declares" : "declare"} no master, so ${c.looseFamilies === 1 ? "it is" : "they are"} not counted here: every size in ${c.looseFamilies === 1 ? "it" : "them"} is composed from the source at its own size.`
    : "";
  const unread = s.analysisOk === false
    ? " The picture could not be read back off the canvas, so only the frame arithmetic is a measurement."
    : "";
  if (!c.ratioFamilies)
    return `${head}No family here declares a master, so nothing comes off this photograph as a recomposition.${loose}${unread}`;
  return `${head}${c.clean} of ${c.ratioFamilies} ${plural(c.ratioFamilies, "family")} `
       + `${c.ratioFamilies === 1 ? "comes" : "come"} off this photograph with the subject whole and no enlargement.`
       + `${loose}${unread}`;
}

/* =========================================================================
   2. WHAT STRUCTURES WERE ACTUALLY DRAWN?

   THE FILES KNOW. `built[].style` is `composeAsset`'s own `r.layout`: the
   structure the engine laid out AFTER substitution. That is the only place
   the answer exists, because the engine substitutes `statement` for a
   photoless concept, `micro` for a canvas too small for a sentence and
   `photo` for a clean variant. ROTATION_POOL is a prediction of a different
   thing — which of the eight rotatable structures a seed will visit — and
   printing it as an answer is how the switch promised 8 while the results
   card for that same build named 11.
   ========================================================================= */

/* COUNTED FROM WHATEVER LIST YOU HAND IT, AND IT SAYS WHICH LIST THAT WAS.
   `rows` is any array of entries carrying `style` (what was drawn) and
   optionally `requestedStyle` (what was asked for) and `design`. Two lists
   exist in this product and they are not the same list: `built` holds the
   files that shipped, `perAssetMetrics` holds every file that was COMPOSED
   including the ones the safe-zone check then blocked. The same build
   therefore stored one structure list and displayed a shorter one. Neither
   is wrong; they answer different questions, so this function reports how
   many rows it counted and how many carried no structure at all, and the
   caller picks its list once. */
export function structureFacts(rows) {
  const list = arr(rows).map(obj);
  const drawn = list.map(r => str(r.style)).filter(Boolean);
  const ids = uniq(drawn);
  const designs = uniq(list.map(r => str(r.design)).filter(Boolean));
  /* ONE READING OF "THIS FRAME IS NOT WHAT WAS ASKED FOR", and the count and
     the frame now share it. This filter used to compare the two ids itself
     and hand back a bare pair, so the aggregate knew a thing no frame could
     say, and an aliased id — `band` against `anchor`, which `normaliseLayout`
     calls the same structure — would have counted here as a substitution
     while the frame drew exactly what it was asked for. */
  const substituted = list
    .map(r => ({ ...substitutionFacts(r), platform: str(r.platform), placement: str(r.placement) }))
    .filter(s => s.substituted);
  const labels = ids.map(id => labelOf("structure", id).label);
  /* THE DESIGN IS NAMED IN THE SENTENCE, AND IT HAD TO BE.
     Every structure's plainest design carries the structure's own label —
     `anchor` is "Anchored block" and so is `anchor-bottom`, `editorial` is
     "Editorial split" and so is `editorial-right` — because a design is a
     structure plus the decisions taken inside it, and the design that takes
     none of them is the structure. That is a fine convention until a list of
     STRUCTURE labels is printed with no noun in front of it: a build drawn
     from "Editorial split, mirrored" reported "What was drawn … Editorial
     split", which is a real design in this library, a different one, and one
     nobody had selected. The bar two inches away said "Editorial split,
     mirrored". Same build, two designs named, one of them never chosen.

     Nothing is renamed to get out of it. The sentence says which design drew
     the files and calls the list what it is — the structures — so the two
     nouns can no longer be read as one, whichever design is picked. Both
     labels come from `labelOf`, which is the one lookup for both kinds and
     brackets an id it cannot name rather than borrowing a label. */
  const designLabels = designs.map(id => labelOf("design", id).label);
  const drewFrom = !designLabels.length ? ""
    : designLabels.length === 1 ? `Every file was drawn from ${designLabels[0]}. `
    : `${countPhrase(designLabels.length, null, "design")} drew this set. `;
  /* KNOWN, RATHER THAN ZERO. A history row written before `structures`
     existed carries an empty array, and the row printed
     `(h.structures||[]).length || ROTATION_POOL.length` — eight, a number
     nothing had measured. An empty list is not a count of zero structures,
     it is the absence of a record, and the two must not print the same. */
  const known = ids.length > 0;
  return {
    ids, labels, count: ids.length, known,
    designs,
    /* ASKED OF THE FILES, NOT OF THE SWITCH. A rotation that was turned on
       and quietly produced one design is caught here and nowhere else. */
    rotated: designs.length > 1,
    substituted, substitutedCount: substituted.length,
    counted: list.length,
    withoutStructure: list.length - drawn.length,
    phrase: known ? countPhrase(ids.length, null, "structure") : "",
    sentence: ids.length > 1
      ? `${drewFrom}The structures counted from the files themselves: ${andList(labels)}.`
      : "",
    /* THE AGGREGATE, COUNTED FROM THE SAME FILES THE FRAMES ARE. The panel
       used to explain substitution in the abstract — "the engine substitutes
       a structure whenever the one asked for cannot be drawn" — over a set
       in which a definite number of frames had been substituted, and never
       said the number. A paragraph that describes a possibility while the
       screen holds the actuality is how a correct behaviour gets read as a
       tool ignoring an instruction. It ends by pointing at the frames,
       because the frames now carry the same fact one at a time. */
    substitutedSentence: substituted.length
      ? `${countPhrase(substituted.length, null, "frame")} of ${list.length} could not take the structure asked for, `
        + `so the engine drew one that fits. Each of those frames says which.`
      : "",
  };
}

/* WHAT ONE FRAME WAS DRAWN IN, WHEN THAT IS NOT WHAT IT WAS ASKED FOR.

   `structureFacts` counts these across a set. This names ONE, and it exists
   because the count was the only place the fact was ever stated. The
   behaviour is right and is not changing: a concept with no photograph is
   set typographically, a canvas too small for a sentence runs as an end
   frame, the image-only variant carries no structure at all. What was wrong
   is that it was explained only in aggregate, in a paragraph, while the grid
   of preview frames visibly disagreeing with the chosen design said nothing
   at all. The product owner read that as the tool ignoring the choice —
   "Preview changes the designs throughout the set" — which is the one
   reading this behaviour cannot afford.

   REGISTER, AND IT IS NOT AN ERROR. The withheld-files card sets the voice:
   state the fact, then say whose fact it is. A frame drawn as a brand end
   frame is the engine protecting a headline that would not have fitted, not
   a build that went wrong, and nothing here may read as a warning.

   WHY THE REASON IS NOT IN THE SENTENCE, WHICH IS THE ONE JUDGEMENT CALL
   HERE. The reason is already authored twice in this product: once as each
   structure's blurb in ENGINE_STRUCTURES and LAYOUTS, reachable through
   `labelOf(...).note`, and once as the info note `composeAsset` pushes onto
   the frame while it substitutes — "Too small for a sentence, so the canvas
   runs as a mark and a button" against "Too small for a sentence, so this
   size runs as a brand end frame: mark and button only". Same fact, two
   vocabularies, and the big preview prints the engine's one directly under
   where this sentence lands. Folding a third phrasing in here, or stacking
   the blurb on top of the note, is precisely the defect this module exists
   to end. So this states what happened and leaves the reason to the one
   surface that already carries it.

   Takes a row in either of the two shapes this product holds: the build's
   own `{ style, requestedStyle }` and the `{ drawn, requested }` pair
   `structureFacts` hands out. Both ids go through `normaliseLayout`, so a
   saved session carrying the old `band` id is not reported as a substitution
   for the `anchor` it is a spelling of. */
export function substitutionFacts(row) {
  const r = obj(row);
  const drawn = str(r.drawn) || str(r.style);
  const requested = str(r.requested) || str(r.requestedStyle);
  /* A file that was never composed has no drawn structure, and a frame that
     got what it asked for has nothing to say. Neither is a substitution, and
     both must return the same empty shape rather than a half-filled one. */
  if (!drawn || !requested || normaliseLayout(drawn) === normaliseLayout(requested))
    return { substituted: false, drawn, requested, drawnLabel: "", requestedLabel: "", short: "", line: "", sentence: "" };
  const d = labelOf("structure", drawn);
  const q = labelOf("structure", requested);
  const line = `Drawn as ${d.label}, not ${q.label}.`;
  return {
    substituted: true, drawn, requested,
    drawnLabel: d.label, requestedLabel: q.label,
    /* Three lengths, because the surfaces are three sizes. `short` is a chip
       beside a 38px thumbnail, `line` is a caption under a card, `sentence`
       is what a person reads when they stop and ask. All one derivation, so
       a frame and the card above it cannot name two different structures. */
    short: `Drawn as ${d.label}`,
    line,
    sentence: `${line} The engine substitutes whenever the structure asked for cannot be drawn `
      + `on the canvas in front of it. That is a fact about this frame, not a change of design.`,
  };
}

/* THE PREDICTION, NAMED AS ONE.
   Returns an object, never a number, so `${plannedStructures(…)}` at a call
   site reads as a mistake rather than as a measurement — which is the whole
   defence against the switch's number and the results card's number being
   printed as the same noun again.

   It asks `rotationSet`, the same function the build uses, so the count on
   the switch is the count the ZIP would contain if nothing were
   substituted. It cannot know about substitution, because substitution is
   decided per canvas at compose time; that is precisely why it is a
   prediction and why `structureFacts(built)` is the answer afterwards. */
export function plannedStructures(designId, conceptId, placementCount) {
  const count = Math.max(0, num(placementCount) || 0);
  const prediction = { prediction: true, ids: [], count: 0, frames: count };
  if (!count) {
    return {
      ...prediction,
      labels: [], phrase: "",
      sentence: "Nothing is planned yet, so there is no rotation to predict.",
    };
  }
  const ids = uniq(rotationSet(count, seedOf(`${str(designId)}|${str(conceptId)}|rotation`), ROTATION_POOL));
  const labels = ids.map(id => labelOf("structure", id).label);
  /* TWO NUMBERS, EACH CALLED WHAT IT IS. The pool holds eight, so a nine
     placement plan draws nine frames in eight structures, and the switch
     used to promise "one thing in 8 frames" — fewer frames than the plan
     has, which reads as the switch dropping a placement. It was right only
     at or below eight, which is why it went unnoticed. */
  return {
    ...prediction,
    ids, labels, count: ids.length,
    phrase: `${countPhrase(ids.length, null, "structure")}, rotated`,
    /* `framesPhrase` USED TO BE HERE and it is deleted rather than fixed.
       It was the one field on a prediction with no hedge in it — "34 frames
       drawn in 8 structures" — and the switch printed exactly that, in the
       present tense, over a card that named eleven structures after the
       build. A prediction that can be printed as a measurement will be. The
       only sentence this function hands out now is the hedged one. */
    sentence: `The rotation would draw ${countPhrase(count, null, "frame")} in ${countPhrase(ids.length, null, "structure")}. `
      + "What actually ships is counted from the files, because the engine substitutes a structure whenever the one asked for cannot be drawn.",
  };
}

/* =========================================================================
   2b. WHAT THE BUILD WILL PRODUCE, BEFORE IT RUNS.

   `buildFacts` answers this AFTER the build. Before it, the pinned bar, the
   step header and the progress line each read a small tower of functions
   welded into step 3's render closure — variantsFor, adsFor, heldFor,
   plannedAds, plannedHeld, plannedPages, plannedFiles — and the comment
   left beside them records what the two counts cost the last time they
   disagreed: the bar promised 96 files and 90 ads, the build handed over 85
   and 79, and the eleven missing were one TikTok placement across three
   concepts.

   Two counts of one quantity, one of them unreachable from any test,
   because a function inside a browser closure cannot be called. This is the
   same arithmetic with a door on it. It takes only the two things it cannot
   derive — whether a concept has a photograph, and whether a placement
   accepts a still image at all — and does every count from them.

   `prediction: true` for the same reason `plannedStructures` carries it:
   what ships is counted from the files. */
export function plannedBuild(input) {
  const i = obj(input);
  const concepts = arr(i.concepts).map(obj);
  const places = arr(i.placements).map(obj);
  /* Every build writes one landing page and one email per concept. They
     always shipped; the count left them out, so the bar promised 24 files
     and handed over 26, and the two nobody counted were the two nobody
     found. */
  const perConcept = num(i.pagesPerConcept) == null ? 2 : Math.max(0, i.pagesPerConcept);

  /* Three things the build withholds, and all three are withheld here or the
     bar promises files that never come: the image-only variant of a concept
     with no photograph, every variant of a placement whose platform accepts
     no still image, and the variants a placement's own text rule refuses.

     THE THIRD ONE WAS COUNTED AND NEVER NAMED. `variantsFor` has always
     asked `allowedVariants`, so the FILE COUNT was right — a run with a
     landing page hero in it promised 29 ads and built 29. What was missing
     was the sentence: the bar said four files were not built and named
     TikTok, while three more were not built for a different reason nothing
     mentioned, and step 3's header above it promised four variants for every
     placement. A count that is right while the words beside it are wrong is
     the harder version of the same defect. */
  const variantsFor = (c, p) =>
    allowedVariants(p.text_in_image).filter(v => c.hasPhoto || v !== "clean").length;

  let ads = 0, held = 0;
  /* GROUPED BY REASON, THE WAY `buildFacts` GROUPS THE ROWS AFTERWARDS, so
     the prediction and the report are the same shape and the same count. */
  const byReason = new Map();
  const hold = (n, reason, at) => {
    held += n;
    if (!byReason.has(reason)) byReason.set(reason, { reason, files: 0, placements: [] });
    const e = byReason.get(reason);
    e.files += n;
    if (at && !e.placements.includes(at)) e.placements.push(at);
  };
  const NO_STILL = "accepts no still image";
  for (const c of concepts) for (const p of places) {
    const at = `${str(p.platform)} ${str(p.placement)}`.trim();
    const n = variantsFor(c, p);
    if (p.stills === false) hold(n, NO_STILL, at);
    else ads += n;
    /* The refused variants are counted whatever else is true of the
       placement, because four is what the header offers and every one of
       the four is either built or accounted for. */
    const w = withheldVariants(p.text_in_image);
    if (w) hold(w.ids.length, `takes ${w.takes}`, at);
  }
  const pages = concepts.length * perConcept;
  const files = ads + pages;
  const heldReasons = [...byReason.values()].sort((a, b) => b.files - a.files);
  const heldAt = (byReason.get(NO_STILL) || { placements: [] }).placements;
  const many = concepts.length > 1;

  return {
    prediction: true,
    concepts: concepts.length, placements: places.length,
    ads, held, pages, files, heldAt, heldReasons,
    phrases: {
      files: countPhrase(files, null, "file"),
      ads: countPhrase(ads, null, "ad"),
      concepts: countPhrase(concepts.length, null, "concept"),
      placements: countPhrase(places.length, null, "placement"),
      /* A count that silently drops eleven files is the count that lied.
         Which placement they would have been, and under which rule, said
         before the build rather than in the report afterwards, is the whole
         point of counting honestly. */
      held: !held ? ""
        : ` ${countPhrase(held, null, "file")} more ${held === 1 ? "is" : "are"} not built: `
          /* One clause per rule, separated by a semicolon rather than by
             "and": the placements inside a clause are already joined with
             one, and two levels of "and" in a sentence this long reads as a
             single list of unrelated things. */
          + heldReasons.map(r =>
            `${andList(r.placements)} ${r.placements.length === 1 ? "" : "each "}${r.reason}`).join("; ") + ".",
      pagesDefinite: many ? "The landing pages and the emails" : "The landing page and the email",
      pagesIndefinite: many ? "a landing page and an email for each concept"
                            : "a landing page and an email from the same concept",
    },
  };
}

/* =========================================================================
   3. THE SAFE ZONE FOR A FAMILY. ONE RECTANGLE.

   `lookupSafeZone` is the single source of truth for one placement and
   `familySafe` is the union across a family — the strictest hard margin on
   every side, falling through to a centre-bias publisher. `familySafe` was
   already the single derivation and NOTHING ON SCREEN READ IT: the card
   printed a hand-written sentence carrying 269/242/707/122, the SVG beside
   it drew 269/672/65 and a right margin of 140 that appears in no table, no
   JSON and no measurement, and the adapter measured a third thing.

   And the sentence was keyed on `ratio === "9:16"`, so every other family
   got "No platform safe zone published, a Professionals house margin is applied" —
   including the 16:9 family holding Taboola's native thumbnail and the 3:2
   family that is Outbrain Standard Native, both of which publish a
   centre-bias zone that `familySafe` finds. The same card printed "SAFE
   ZONE — No platform safe zone published" three rows above "COMPOSED FOR —
   This publisher re-crops the file itself".

   `box` and `diagram` below are the same four numbers, one in pixels of the
   family master and one as fractions of it. The sentence is written from
   `box`. There is no fourth restatement.
   ========================================================================= */

const VERIFICATION_RANK = { verified: 3, secondary: 2, consensus: 1, brand: 0 };

export function safeZoneFacts(family) {
  const f = obj(family);
  const W = num(f.master_w), H = num(f.master_h);

  /* A group with no declared master has no rectangle to measure. Saying so
     is the answer; measuring the stand-in `buildExportPlan` invented would
     produce a safe zone for a canvas that is not this group's shape. */
  if (!declaresMaster(f)) {
    return {
      applicable: false, ratio: str(f.ratio),
      canvas: null, box: null, diagram: null,
      kind: null, centreBias: false, house: false,
      verification: null, verificationNote: "", sourceUrl: null, lastChecked: null,
      platforms: [], note: "",
      sentence: "These sizes share no master, so there is no one rectangle to build to. Each is composed at its own size and carries its own placement's margin.",
      version: SAFE_ZONE_VERSION,
    };
  }

  /* Sanitised once and used for both lookups below, so this function and
     `familySafe` are looking at the same list. A truncated plan can hold a
     null where a placement was. */
  const placements = arr(f.placements).map(obj);
  const zones = placements.map(p => lookupSafeZone(p.platform, p.placement, W, H));
  /* THE BOX, FROM THE ONE DERIVATION. `familySafe` returns the hard union,
     or a centre-bias publisher's zone, or null where neither exists — null
     meaning every placement here resolves to the house margin, which is
     the same box on every side because it is a fraction of this one
     canvas. The fallback takes the widest of those rather than the first,
     which is the same union rule, so one code path can never be stricter
     than the other. */
  const union = familySafe({ ...f, placements });
  const nothing = zones.length ? null : lookupSafeZone(null, null, W, H);
  const box = union ? pick4(union) : zones.length ? unionOf(zones) : pick4(nothing);

  /* WHICH ZONES ACTUALLY SET THIS BOX, by the same three-step rule
     `familySafe` resolves it with: the hard ones if there are any, then the
     centre-bias publisher, then the house margins. Attributing a box to
     every zone in the family instead would let one house-margin placement
     make a Taboola-derived rectangle read as "no platform publishes one",
     which is the sentence this whole section exists to stop printing. */
  const contributors = union
    ? (union.kind === "hard" ? zones.filter(z => z.kind === "hard") : zones.filter(z => z.centreBias))
    : zones.length ? zones : [nothing];

  /* Provenance travels with the numbers. A union is only as trustworthy as
     its weakest contributing figure — TikTok publishes no pixel values at
     all — so the verification reported is the lowest of the ones that
     actually set an edge, never the best of them. */
  const rank = z => (VERIFICATION_RANK[z.verification] == null ? 0 : VERIFICATION_RANK[z.verification]);
  const weakest = contributors.reduce((a, b) => (rank(b) < rank(a) ? b : a));
  const house = contributors.every(z => z.source === "brand");
  const kind = union ? union.kind : weakest.kind;
  const centreBias = union ? !!union.centreBias : !!weakest.centreBias;
  const platforms = uniq(placements
    .filter((p, i) => zones[i] && zones[i].source === "platform")
    .map(p => `${str(p.platform)} ${str(p.placement)}`.trim()));

  return {
    applicable: true, ratio: str(f.ratio),
    canvas: { w: W, h: H },
    box,
    /* The same four numbers as fractions of the master, for anything that
       draws rather than prints. The CSS reads these; it does not carry its
       own copy of them. */
    diagram: { top: box.top / H, right: box.right / W, bottom: box.bottom / H, left: box.left / W },
    kind, centreBias, house,
    verification: weakest.verification || null,
    verificationNote: verificationNoteOf(weakest.verification),
    sourceUrl: weakest.sourceUrl || null,
    lastChecked: weakest.lastChecked || null,
    note: str(weakest.note),
    platforms,
    sentence: safeSentenceOf({ box, W, H, kind, centreBias, house, platforms, weakest }),
    version: SAFE_ZONE_VERSION,
  };
}

function pick4(z) {
  return { top: Math.round(z.top || 0), right: Math.round(z.right || 0), bottom: Math.round(z.bottom || 0), left: Math.round(z.left || 0) };
}
function unionOf(zones) {
  return {
    top: Math.max(...zones.map(z => z.top || 0)),
    right: Math.max(...zones.map(z => z.right || 0)),
    bottom: Math.max(...zones.map(z => z.bottom || 0)),
    left: Math.max(...zones.map(z => z.left || 0)),
  };
}
const VERIFICATION_NOTE = {
  verified: "Confirmed on the platform's own documentation.",
  secondary: "No reachable page from the platform itself; consistent across independent sources. Confirm before a large spend.",
  consensus: "The platform publishes no figures at all. These are the strictest of the cited ones.",
  brand: "Not a platform figure. A studio margin, applied where no platform publishes one.",
};
function verificationNoteOf(v) { return VERIFICATION_NOTE[v] || ""; }

function safeSentenceOf({ box, W, H, kind, centreBias, house, platforms, weakest }) {
  const rect = `top ${box.top} / right ${box.right} / bottom ${box.bottom} / left ${box.left} on ${W}×${H}`;
  if (house) {
    return `No platform publishes a safe zone for ${platformsClause(platforms, "these placements")}, so a studio margin is applied: `
      + `${rect}, ${Math.round(BRAND_MARGIN_RATIO * 1000) / 10}% of the short edge. It shapes the layout and never blocks a file.`;
  }
  if (kind === "hard") {
    const who = platforms.length > 1
      ? `Build to the union of what ${andList(platforms)} each reserve and one asset clears all of them`
      : platforms.length === 1
        ? `Build to what ${platforms[0]} reserves`
        : "Build to the union box for this shape";
    return `${who}: ${rect}. The strictest margin on every side, and nothing may be laid out inside it. ${verificationNoteOf(weakest.verification)}`.trim();
  }
  /* Soft. A centre-bias publisher is the only reason a platform figure ends
     up here, and it is worth saying WHY the margin exists: nothing is drawn
     over the frame, the risk is the publisher's own crop. */
  const who = platforms.length ? andList(platforms) : "This publisher";
  const why = centreBias
    ? `${who} re-${platforms.length > 1 ? "crop" : "crops"} the file itself rather than drawing an interface over it, so nothing here blocks a file.`
    : `${who} ${platforms.length > 1 ? "publish" : "publishes"} a guide rather than a reserved strip, so nothing here blocks a file.`;
  return `${why} Keep the subject and the type in the band its own guidance keeps: ${rect}. ${verificationNoteOf(weakest.verification)}`.trim();
}
function platformsClause(platforms, fallback) {
  return platforms.length ? andList(platforms) : fallback;
}

/* =========================================================================
   4. CONNECTION. IS AN API REACHABLE, FROM WHERE, AND WHAT CAN IT DO?

   `GET /api/status` and the key in this browser are the whole world. Five
   names existed for those two facts — SERVER_KEY, SERVER_IMAGES,
   browserKey, serverKey and `j.key` — and each surface picked its own
   subset, so one card read "Connected from this browser" with the lit dot
   three rows above "Key — none. The server is running and holds no key",
   and the headline computed forty lines earlier was then ignored by the
   branch that hard-coded "Connected".

   The subtler one, which nobody had named: the imagery panel decided which
   route to DESCRIBE with `SERVER_KEY || !state.openaiKey` while the send
   twenty lines later used `SERVER_KEY` alone. There is no state where they
   differ today, and that is luck rather than design — a panel printing a
   prediction of its own behaviour, computed by a different expression than
   the behaviour, is the same defect as everything else on this list. Below,
   `route` is what the send does and `describeRoute` is what the panel shows
   when there is no route at all, and each says which it is.
   ========================================================================= */

export const START_LINE = "export OPENAI_API_KEY=sk-… && python3 serve.py";
const KEY_SOURCE = {
  env: "OPENAI_API_KEY, read from the terminal that started serve.py",
  dotenv: "OPENAI_API_KEY, read from the .env file next to serve.py",
};

export function connectionFacts(input) {
  const i = obj(input);
  /* `status` is null whenever nothing answered, which is not the same as a
     server that answered "no key". "We did not ask" must never read as "no
     key", so the two are separate fields all the way down. */
  const j = i.status && typeof i.status === "object" ? i.status : null;
  const serverPresent = !!j;
  const serverKey = !!(j && j.key);
  const serverImages = !!(j && j.images);
  const browserKey = !!i.browserKey;

  const state = serverKey && browserKey ? "both" : serverKey ? "server" : browserKey ? "browser" : "none";
  const route = serverKey ? "server" : browserKey ? "browser" : "none";

  const can = {
    /* Only a key held by the server can write concepts: the browser-direct
       path is images only. */
    writeConcepts: serverKey,
    generatePhoto: serverImages || browserKey,
    /* /images/edits is multipart and the browser-direct path posts JSON, so
       an extension is server-only by construction. */
    extend: serverKey,
  };

  const rows = [];
  if (serverPresent) {
    rows.push(serverKey
      ? { k: "Key", v: KEY_SOURCE[j.source] || "OPENAI_API_KEY, held by serve.py", note: "It stays in the server process and never reaches this page." }
      : { k: "Key", v: "none on the server", note: "serve.py is running and holds no key." });
    if (browserKey)
      rows.push({ k: "Browser key", v: "pasted into this browser and kept in its localStorage", note: "It renders photographs and nothing else." });
    rows.push({ k: "Endpoint", v: str(j.baseUrl) || "not reported", note: "" });
    rows.push({ k: "Text model", v: str(j.textModel) || "not reported", note: serverKey ? "writes the concept copy in step 1" : "would write the concept copy in step 1" });
    rows.push({ k: "Image model", v: imageModelValue(j), note: imageModelNote(j) });
  } else if (browserKey) {
    rows.push({ k: "Browser key", v: "pasted into this browser and kept in its localStorage", note: "It renders photographs and nothing else." });
  }

  return {
    state, serverPresent, serverKey, serverImages, browserKey,
    headline: HEADLINE[state],
    /* The dot is on whenever an API is reachable from anywhere, which
       includes a key in this browser. It used to be switched on for the
       browser key and never switched back off in the branch below it. */
    lit: state !== "none",
    lead: leadOf({ state, serverPresent, j }),
    rows,
    can,
    /* WHAT THE SEND DOES. */
    route,
    /* WHAT A PANEL SHOULD DESCRIBE when nothing is configured: the server
       route, because that is the one the instructions above it tell you to
       set up, and printing a browser-direct URL to someone who has
       configured neither answers a question they did not ask. `route` still
       says "none", so a description can never be mistaken for a capability. */
    describeRoute: route === "none" ? "server" : route,
    routeReason: ROUTE_REASON[route],
    startLine: START_LINE,
    howTo: `Turn it on by starting the server with a key, in this folder: ${START_LINE}`,
    /* The paragraph on the first screen, and the sentence a disabled button
       explains itself with. Both were computed from their own subsets. */
    emptyRuns: EMPTY_RUNS[state],
    keylessLine: can.generatePhoto
      ? ""
      : "Nothing was sent, because there is no key to send it with. Run python3 serve.py with OPENAI_API_KEY set in the environment or in a .env beside it, or paste a key into Settings. Everything below is exactly what would go out the moment there is one.",
  };
}

const HEADLINE = {
  none: "No API connected",
  browser: "Connected from this browser",
  server: "Connected through serve.py",
  /* The branch that hard-coded "Connected" dropped the second key from its
     headline while the paragraph below it admitted the key was there. */
  both: "Connected through serve.py, with a second key in this browser",
};
const ROUTE_REASON = {
  server: "The request goes to serve.py, so the key stays in your terminal and never touches this browser.",
  browser: "serve.py holds no key, so the request goes from this page straight to api.openai.com with the key you pasted here.",
  none: "There is no key anywhere, so nothing is sent.",
};
const EMPTY_RUNS = {
  none: "Everything runs in this page. No API key, no second tool, nothing to copy or paste anywhere else.",
  browser: "Concepts are written in this page by the built-in brand engine. The key you pasted here is used for one thing: rendering a photograph when you press Generate photo.",
  server: "serve.py is holding an API key, so a model writes the concepts and the server renders the photographs. Everything else runs in this page, and nothing is copied or pasted anywhere else.",
  both: "serve.py is holding an API key, so a model writes the concepts, and the key you pasted here renders photographs. Everything else runs in this page.",
};

function leadOf({ state, serverPresent, j }) {
  if (!serverPresent) {
    const tail = state === "browser"
      ? "Concepts are written by the built-in brand engine. Pictures come from the approved photo library, except when you press Generate photo, which calls api.openai.com from this browser with the key you pasted."
      : "No model is called anywhere in this Studio: concepts are written by the built-in brand engine and pictures come from the approved photo library.";
    return `Nothing answered /api/status, so this page is not being served by serve.py and has no endpoint to reach. ${tail}`;
  }
  if (state === "none")
    return "No model is called anywhere in this Studio: concepts are written by the built-in brand engine and pictures come from the approved photo library. Every step works end to end like this.";
  if (state === "browser")
    return "serve.py is running and holds no key, so the concepts are still written by the built-in brand engine — only a key held by the server can write them. The key you pasted here renders photographs: pressing Generate photo posts to api.openai.com from this page with it.";
  if (state === "server")
    return "The server's key never reaches this page. It stays in the server process, which is why nothing below shows one.";
  return "The server's key never reaches this page; it stays in the server process. The key you pasted into this browser is a different one, it is held in localStorage, and it renders photographs only.";
}

function imageModelValue(j) {
  const name = str(j.imageModel);
  if (!name) return "name not reported by this server, restart it to see it";
  return name;
}
function imageModelNote(j) {
  /* serve.py reports images:false both when the endpoint cannot make
     pictures and when it simply has no key yet. `imagesNote` is written
     only in the first case, so it is what tells the two apart — saying
     "this endpoint does not serve image generation" about OpenAI's own
     endpoint, because nobody had set a key, would be its own small lie. */
  if (str(j.imagesNote)) return `off. ${j.imagesNote}`;
  return j.images ? "renders the photograph behind Generate photo" : "would render the photographs, once a key exists";
}

/* =========================================================================
   5. COUNTS. PLANNED AND DELIVERED, NEVER FOLDED INTO ONE NUMBER.

   Nine places printed a count and they disagreed in four different ways:
   the record stored `files: built.length` (ads only) while the history row
   for the same build stored `built.length + pageCount`; `measurementPhrase`
   counted rows with metrics, the results card counted `built + pages`, and
   the record counted `built` — three totals on one screen for one build;
   Deck Studio printed the PLANNED placements from a record that was holding
   the delivered figure the whole time.

   `buildFacts` is written once, by the build, and persisted by BOTH
   `saveToHistory` and `makeBuildRecord`, so the history row, the results
   card, the verdict card, Deck Studio's campaign row and the deck's
   big-numbers slide read fields instead of re-deriving.
   ========================================================================= */

export function buildFacts(input) {
  const i = obj(input);
  const built = arr(i.built).map(obj);
  const pages = arr(i.pages).map(obj);
  const rows = arr(i.rows).map(obj);
  const planned = num(i.planned);

  const placementsBuilt = uniq(built.map(b => `${obj(b.pl).platform}|${obj(b.pl).placement}`).filter(x => x !== "|")).length;
  const blockedRows = rows.filter(r => r.blocked);
  const measured = rows.filter(r => r.metrics && Object.keys(obj(r.metrics)).length);
  const bytes = byteFacts([...built, ...pages]);
  const structures = structureFacts(built);

  /* WHY IT WAS NOT EXPORTED, GROUPED BY REASON RATHER THAN BY FILE. Exact
     per-file lines read as twenty separate findings when they are one, and
     a count of blocked files with no reason attached is what lets a
     video-only placement ship a JPEG unnoticed. */
  const byReason = new Map();
  for (const r of blockedRows) {
    const reason = str(r.blockedReason) || "No reason recorded.";
    if (!byReason.has(reason)) byReason.set(reason, { reason, files: 0, placements: [] });
    const e = byReason.get(reason);
    e.files++;
    const where = `${str(r.platform)} ${str(r.placement)}`.trim();
    if (where && !e.placements.includes(where)) e.placements.push(where);
  }
  const heldReasons = [...byReason.values()].sort((a, b) => b.files - a.files);

  const facts = {
    /* EVERY FILE IN THE SET. The landing page and the email are files: a 21
       file run came back as "19 files" with neither of them named anywhere
       on the row, which is the exact covering-up this module exists to
       end. `ads` and `pageFiles` stay apart so any surface can name both. */
    files: built.length + pages.length,
    ads: built.length,
    pageFiles: pages.length,
    placementsPlanned: planned,
    placementsBuilt,
    blocked: blockedRows.length,
    heldReasons,
    blockedRows,
    bytes,
    measurements: {
      /* A row exists for every file the build COMPOSED, including the ones
         the safe-zone check then blocked. Those rows are kept on purpose —
         "this structure could not be made to fit this reserved area" is the
         row a learning layer most wants — but they are not measurements,
         and folding them in told somebody 57 things had been measured when
         50 had. */
      measured: measured.length,
      withoutMetrics: rows.length - measured.length,
      rows: rows.length,
    },
    structures,
    designs: structures.designs,
    rotated: structures.rotated,
    version: FACTS_VERSION,
  };
  facts.phrases = {
    files: countPhrase(facts.files, null, "file"),
    ads: countPhrase(facts.ads, null, "ad"),
    placements: countPhrase(placementsBuilt, planned, "placement"),
    /* Every build writes one landing page and one email per concept, which
       is what makes this a count of pairs. If that ever stops being true the
       honest answer is the file count, not half of an odd number. */
    pages: !pages.length ? ""
      : pages.length % 2 ? countPhrase(pages.length, null, "page file")
      : `${countPhrase(pages.length / 2, null, "landing page")} and ${plural(pages.length / 2, "email")}`,
    blocked: facts.blocked
      ? `${countPhrase(facts.blocked, null, "file")} ${facts.blocked === 1 ? "was" : "were"} not exported`
      : "",
    /* AND THE PARENTHESIS COUNTS FILES, BECAUSE THAT IS WHAT IT COUNTS.
       `withoutMetrics` is a difference of two ROW counts, and a row is a
       composed file. It printed "plus 4 blocked placements that produced
       none" on a screen whose card above it said one PLACEMENT was blocked
       and four FILES were withheld — placements and files folded into one
       number, in the module that exists to stop exactly that. */
    measurements: `${countPhrase(facts.measurements.measured, null, "measurement")} from this build`
      + (facts.measurements.withoutMetrics
        ? ` (plus ${countPhrase(facts.measurements.withoutMetrics, null, "file")} that produced none)`
        : ""),
  };
  return facts;
}

/* =========================================================================
   6. ENLARGEMENT. TWO MEASUREMENTS THAT WERE PRINTED WITH THE SAME WORDS.

   (a) A FAMILY's enlargement is the worst `placement / master` scale across
       the placements that come off the master. It is the plan's prediction,
       made before a file exists, and it belongs on step 2.
   (b) A FILE's enlargement is what `drawPhoto` actually scaled the picture
       by into the box its layout gave it — which on an inset panel or a
       poster band is a different, larger number for the same file.

   Step 2 said of the 4:5 family "enlarges the master 1.37x … inside the
   1.45x this system calls soft", no warning; step 3 then emitted "the
   source photograph is smaller than the export and has to be enlarged, so
   these will look soft" for files in that same family. Same photograph,
   same placement, opposite verdicts — because (a) and (b) are different
   measurements and both were called "enlargement".

   The threshold was authored twice on top of that, and the SENTENCE was
   authored twice as well: ad-engine drew its own conclusion per file and
   said it in its own words, ending "Supply a larger original", while
   `fileEnlargement` below said the same thing about the same measurement in
   different ones. Whichever you read, the other existed.

   `softnessOf` is the one classifier and both functions below go through
   it. ad-engine measures the upscale while drawing and now calls
   `fileEnlargement` for the words, so one build cannot call a file soft in
   two vocabularies — nor, as it could, call it soft in one place and fine
   in another. `qa/one-source-of-truth.test.mjs` fails the build if the
   sentence is ever authored in a second file.
   ========================================================================= */

/* The adapter's own bands, in one place. NATIVE_TOLERANCE rather than 1 is
   the adapter's tolerance for a scale that is arithmetically 1.0000001, and
   it is imported rather than repeated: this file used to carry its own
   fourth copy of that literal. */
export function softnessOf(upscale) {
  const u = num(upscale);
  if (u == null) return "unknown";
  if (u <= NATIVE_TOLERANCE) return "native";
  if (u <= SOFT_UPSCALE) return "adequate";
  if (u <= HARD_UPSCALE) return "soft";
  return "insufficient";
}

/* THE PLAN'S FIGURE, for one family, off the adapter's verdict. */
export function enlargementFacts(verdict) {
  const v = obj(verdict);
  const u = num(v.upscale);
  if (v.mixed || u == null) {
    return {
      scope: "family-plan", prediction: true,
      upscale: null, at: null, band: "n/a", sentence: "", needSource: null,
    };
  }
  const band = softnessOf(u);
  const at = v.upscaleAt
    ? { platform: str(v.upscaleAt.platform), placement: str(v.upscaleAt.placement), w: v.upscaleAt.w, h: v.upscaleAt.h }
    : null;
  const where = at ? ` on ${at.platform} ${at.placement} at ${at.w}×${at.h}` : "";
  const x = timesPhrase(u).text;
  const sentence =
    band === "native" ? "Every size in this family comes off the master without being enlarged."
    : band === "adequate" ? `The largest size in this family enlarges the master ${x}${where}, inside the ${SOFT_UPSCALE}× this system calls soft.`
    : band === "soft" ? `The largest size in this family enlarges the master ${x}${where}, past ${SOFT_UPSCALE}×, so those files will look soft.`
    : `The largest size in this family enlarges the master ${x}${where}. That is past ${HARD_UPSCALE}×, where the resampler is inventing most of the detail.`;

  /* WHAT SOURCE WOULD FIX IT, in pixels, because "supply a larger original"
     is not actionable and "supply at least 2882x1920" is. READ OFF THE
     VERDICT, never divided out again here: this function used to take the
     adapter's own window and source and reproduce the arithmetic the
     adapter had already done to write its requirement sentence. Two
     implementations of one figure, agreeing only because neither had been
     touched. The adapter measures it, carries it, and this hands it on. */
  const needSource = v.needSource ? { w: v.needSource.w, h: v.needSource.h } : null;
  return { scope: "family-plan", prediction: true, upscale: u, at, band, sentence, needSource };
}

/* THE FILE'S FIGURE, off the metrics the engine stored while drawing it.
   This is the artifact-derived one and it wins wherever a file exists. */
export function fileEnlargement(metrics) {
  const m = obj(metrics);
  const u = num(m.upscale);
  /* A set with no photograph: `statement` draws no picture at all, and the
     clean variant of a photoless concept is never built. There is no
     enlargement to report and reporting 1.00x would be a claim about a
     draw that never happened. */
  if (u == null || m.hasPhoto === false) {
    return { scope: "file", upscale: null, band: "none", hasPhoto: false, warns: false, sentence: "" };
  }
  const band = softnessOf(u);
  /* The exact boundary ad-engine's own warning uses, expressed once. */
  const warns = u > SOFT_UPSCALE;
  const x = timesPhrase(u).text;
  return {
    scope: "file", upscale: u, band, hasPhoto: true, warns,
    sentence: warns
      ? `This file enlarges the photograph ${x}, past the ${SOFT_UPSCALE}× this system calls soft, so it will look soft. Supply a larger original.`
      : band === "native"
        ? "The photograph was drawn at its own resolution or smaller, so nothing in this file is enlarged."
        : `This file enlarges the photograph ${x}, inside the ${SOFT_UPSCALE}× this system calls soft.`,
  };
}

/* =========================================================================
   7. LABELS. ONE HUMAN NAME PER THING, AND AN UNKNOWN ID SAYS SO.

   There was no home at all for "the label for an arbitrary id from a
   foreign record", which is why Concept Studio's design card printed
   "Anchored block" while Deck Studio's slide, built from the same history
   entry, printed "ANCHOR-BOTTOM": deck-builder's `designLabel` took a
   string and handed it straight back, and the layout uppercased it.

   Three more, each of which was silent:
     - `designById` returns DESIGNS[0] for an unknown id, so a row written
       by a future or foreign version of the library prints "Anchored block"
       rather than admitting it cannot name the design.
     - `saveToHistory` writes `category: c.category`, but concepts carry
       `visual_category` and never `category`. The field is always
       undefined, so deck-builder's `concept.angle || concept.category`
       fallback is dead and the German angle slug is the only thing that can
       ever reach the risk slide.
     - ANGLES carries `label: "Lebensmoment"` and CATEGORY_LABEL carries
       "Life moment" for the same angle. Two human labels for one thing, in
       one file. Interface copy is English, and every Concept Studio surface
       prints the English one, so that is the label here and the German slug
       is an id.

   `known: false` returns a bracketed id rather than a fabricated label or a
   raw slug, so a foreign id is visible instead of silently wrong. */

/* The angle ids this Studio and the imagery pack file their angles under,
   mapped to the English visual category every card is labelled with. Both
   halves live here because two products have to agree about them and
   neither can import an HTML file. */
export const ANGLE_CATEGORY = Object.freeze({
  "lebensmoment": "life-event-moment",
  "person": "person-portrait",
  "wohnung": "apartment-interior",
  "plus-im-raum": "plus-in-place",
  "detail": "object-detail",
  "typo": "typographic-pattern",
  "stadt": "city-neighbourhood",
  "produkt-ui": "product-ui-mock",
});
export const CATEGORY_LABEL = Object.freeze({
  "apartment-interior": "Apartment / space",
  "person-portrait": "Person / portrait",
  "life-event-moment": "Life moment",
  "plus-in-place": "Professionals in the room",
  "product-ui-mock": "Product UI",
  "typographic-pattern": "Typography / pattern",
  "object-detail": "Object detail",
  "city-neighbourhood": "City / neighbourhood",
});

export const LABEL_KINDS = ["design", "structure", "angle", "category"];

export function labelOf(kind, id) {
  const k = str(kind);
  const raw = str(id);
  const unknown = extra => ({ kind: k, id: raw, label: `[unknown ${k || "id"}: ${raw || "none"}]`, known: false, ...extra });
  if (!LABEL_KINDS.includes(k)) return { kind: k, id: raw, label: `[unknown kind: ${k}]`, known: false };
  if (!raw) return unknown({});

  if (k === "design") {
    const d = DESIGNS.find(x => x.id === raw);
    /* Deliberately not `designById`, which falls back to DESIGNS[0]. */
    return d ? { kind: k, id: raw, label: d.label, known: true, note: d.note, style: d.style } : unknown({});
  }
  if (k === "structure") {
    const l = LAYOUTS.find(x => x.id === normaliseLayout(raw));
    if (l) return { kind: k, id: raw, label: l.label, known: true, note: l.blurb, choosable: true };
    const e = ENGINE_STRUCTURES[raw];
    /* The three the engine reaches for on its own are not choices, and a
       record that says "micro" still has to be readable as something. */
    if (e) return { kind: k, id: raw, label: e.label, known: true, note: e.blurb, choosable: false };
    return unknown({});
  }
  if (k === "angle") {
    const cat = ANGLE_CATEGORY[raw];
    if (!cat) return unknown({ category: null });
    return { kind: k, id: raw, label: CATEGORY_LABEL[cat], known: true, category: cat };
  }
  /* category */
  const label = CATEGORY_LABEL[raw];
  return label ? { kind: k, id: raw, label, known: true, category: raw } : unknown({ category: null });
}

/* =========================================================================
   8. HAS THIS DESIGN RUN, AND HOW MANY ARE STILL UNUSED?

   The derivation was already right and was read at the wrong moment: step 3
   called `usedDesigns()` once at render time and painted two surfaces from
   that frozen Map, while the chosen-design card re-read history on every
   paint. Immediately after a build the card read "Used before · ran just
   now · 25 of 26 designs are still unused" and the picker it opens read "26
   of 26 have not run yet", with the design that had just run still sitting
   in the fresh grid.

   So this takes the history as an argument and is called on every paint.
   The picker keeps its deliberate no-reflow behaviour by rendering from the
   tiles it already has and updating only the used markers and the count
   from a fresh call — the snapshot stops being the source of a NUMBER,
   which is the only part that was lying.
   ========================================================================= */

/* WHICH DESIGNS DREW ONE BUILD, off the build's own record of what it drew.

   Every row and every record written since the facts branch carries
   `facts.designs`, counted from the files that actually shipped; a record
   from before it carries one metric row per file, each naming the design
   that drew it; and the oldest rows carry only the design that was ASKED
   for. Three shapes, one reading, in the order of how much the row
   actually knows.

   The single id was the whole defect: a rotated build draws eight designs
   and records all eight, and `designFacts` counted the one in `h.design` —
   so the picker's "not run yet" grid held designs that had drawn half the
   set, in the same modal where the verdict counts underneath were being
   read off `facts.designs` and getting all eight. Concept Studio had its
   own copy of this reader for the verdict counts; it imports this one. */
export function designsOf(row) {
  const r = obj(row);
  const f = obj(r.facts);
  const listed = arr(f.designs).map(str).filter(Boolean);
  if (listed.length) return uniq(listed);
  const drawn = uniq(arr(r.perAssetMetrics).map(m => str(obj(m).design)).filter(Boolean));
  if (drawn.length) return drawn;
  const asked = str(r.design)
    || (str(r.layout) && (DESIGNS.find(d => d.style === r.layout) || {}).id)
    || "";
  return asked ? [asked] : [];
}

export function designFacts(designId, history) {
  const rows = arr(history).map(obj);
  /* WHICH DESIGNS HAVE RUN, AND WHEN. History is written newest-first, so
     the first row that names a design is that design's most recent run —
     which is what "ran 3 days ago" means. `at` is handed back as the ISO
     string the row carries; formatting it as "3 days ago" reads a clock,
     and this module does not. */
  const used = new Map();
  for (const h of rows) {
    for (const id of designsOf(h)) {
      if (!used.has(id)) used.set(id, { id, ranAt: str(h.at), product: str(h.product), runCount: 0 });
      used.get(id).runCount++;
    }
  }

  const entry = d => {
    const u = used.get(d.id) || null;
    return {
      id: d.id, label: d.label, note: d.note, style: d.style,
      styleLabel: labelOf("structure", d.style).label, known: true,
      used: !!u, ranAt: u ? u.ranAt : null, runCount: u ? u.runCount : 0,
      product: u ? u.product : null,
    };
  };
  const library = DESIGNS.map(entry);

  /* A DESIGN THAT RAN AND IS NOT IN THIS LIBRARY. Once the reading above
     takes the row's own list, a record written by another version of this
     Studio can name a design this one cannot draw. Dropping it would put
     the count back to counting only what is convenient, so it is kept,
     named through `labelOf` (which brackets an id it cannot name rather
     than borrowing a label), and marked `known: false` so the picker can
     count it without offering a tile that would compose the wrong design. */
  const foreign = [...used.values()]
    .filter(u => !DESIGNS.some(d => d.id === u.id))
    .map(u => ({
      id: u.id, label: labelOf("design", u.id).label, note: "", style: null,
      styleLabel: "", known: false,
      used: true, ranAt: u.ranAt, runCount: u.runCount, product: u.product,
    }));

  const all = library.concat(foreign);
  /* `fresh` is what the picker can still offer, so it is the library.
     `spent` is everything that ran, so it is both. `total` is the library,
     because that is the denominator the sentence is about — and when the
     two do not add up, the sentence says why rather than leaving a reader
     to notice that 25 and 2 do not make 26. */
  const fresh = library.filter(x => !x.used);
  const spent = all.filter(x => x.used);

  const id = str(designId);
  const chosen = all.find(x => x.id === id) || null;
  const label = labelOf("design", id);

  return {
    id, known: label.known, label: label.label,
    note: chosen ? chosen.note : "", style: chosen ? chosen.style : null,
    used: !!(chosen && chosen.used),
    ranAt: chosen ? chosen.ranAt : null,
    runCount: chosen ? chosen.runCount : 0,
    freshCount: fresh.length, spentCount: spent.length, total: library.length,
    fresh, spent, all,
    /* ONE DENOMINATOR SENTENCE, so the card and the picker modal it opens
       cannot differ by however many builds were made this session. */
    sentence: (fresh.length === library.length
      ? `${countPhrase(library.length, null, "design")}, none of them run yet.`
      : fresh.length === 0
        ? `Every one of the ${library.length} designs has run at least once.`
        : `${fresh.length} of ${library.length} designs have not run yet.`)
      + (foreign.length
        ? ` ${countPhrase(foreign.length, null, "design")} in this history ${foreign.length === 1 ? "is" : "are"} not in this library, and ${foreign.length === 1 ? "is" : "are"} counted as used without a tile to click.`
        : ""),
  };
}

/* =========================================================================
   9. BYTES. ONE SUM, ONE THRESHOLD, ONE ROUNDING RULE.

   A set under a megabyte printed "870 KB" on the results card and "0.9 MB"
   on the pinned bar directly beneath it, because the two used different
   unit thresholds and different rounding, and a third formatter rounded
   megabytes to whole numbers so the same quantity read "3 MB" or "3.4 MB"
   depending on which line you were on. One of the three dereferenced
   `x.blob.size` with no guard while the others treated a missing blob as
   zero, so they could not agree about a set containing one.
   ========================================================================= */

const KB = 1024, MB = 1024 * 1024;

/* `files` is any list of things that carry bytes: built entries and pages
   (`.blob.size`), metric rows (`.bytes`), or plain numbers. A missing size
   counts as zero AND is reported, because a set with a file that failed to
   encode is a fact worth having rather than a silent shortfall. */
export function byteFacts(files) {
  const list = arr(files);
  let bytes = 0, missing = 0;
  for (const f of list) {
    const n = sizeOf(f);
    if (n == null) { missing++; continue; }
    bytes += n;
  }
  return { bytes, files: list.length, missing, text: byteText(bytes) };
}
function sizeOf(f) {
  if (typeof f === "number") return Number.isFinite(f) ? f : null;
  const o = obj(f);
  if (o.blob && num(o.blob.size) != null) return o.blob.size;
  if (num(o.bytes) != null) return o.bytes;
  if (num(o.size) != null) return o.size;
  return null;
}
/* THE ONE RULE. Under a megabyte, whole kilobytes; at or above, one
   decimal megabyte. A measured total always carries the decimal, including
   "3.0 MB", because dropping it where it happens to be zero is the
   conditional rounding that produced "3 MB" and "3.4 MB" on one screen. */
function byteText(bytes) {
  const b = num(bytes) || 0;
  return b < MB ? `${Math.round(b / KB)} KB` : `${(b / MB).toFixed(1)} MB`;
}

/* A PUBLISHED LIMIT IS NOT A MEASUREMENT. A platform that says 150 KB or
   30 MB stated an exact figure, so a trailing ".0" would claim a precision
   the publisher did not offer. Same units and same threshold, one
   difference, stated. */
export function capText(bytes) {
  const b = num(bytes) || 0;
  if (b < MB) return `${Math.round(b / KB)} KB`;
  const mb = b / MB;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/* =========================================================================
   10. THE EXTENSION CEILING: GEOMETRY AND CAPABILITY, KEPT APART.

   Two facts were fused into one sentence. The GEOMETRY is `outside`
   compared against EXTEND_LIMIT, measured by size-adapter, which is a pure
   Node module. The CAPABILITY is whether serve.py is holding a key, which
   size-adapter cannot know and must not speak about — and did:

     "…inside the 35% an extension can honestly invent. There is no
      outpainting in this build, so it is served as the tightest crop…"

   That clause stopped being true when the extend executor shipped, and the
   very same family card now carries a working "Extend the photograph to
   9:16" button. A green test in qa/size-adapter.test.mjs was holding the
   false sentence on screen. So the geometry sentence is written here,
   without a capability clause in it, and the capability clause comes from
   `connectionFacts` — the only thing that knows.
   ========================================================================= */

export function extendFacts(verdict, connection) {
  const v = obj(verdict);
  const conn = connection && typeof connection === "object" ? connection : null;
  const canExtend = conn ? !!obj(conn.can).extend : null;
  const method = str(v.method);
  const outside = num(v.outside);
  const ratio = str(v.ratio) || "this family";
  const share = sharePhrase(outside, EXTEND_LIMIT);
  const ceilingText = sharePhrase(EXTEND_LIMIT, null).text;

  const base = {
    outside, ceiling: EXTEND_LIMIT, share, ceilingText,
    available: canExtend, offer: false,
  };

  /* Not a ratio family, or a frame that holds the subject as it is: there
     is no extension question to answer. */
  if (v.mixed || (method !== "extend" && method !== "rebuild")) {
    return { ...base, classification: "none", geometry: "", availabilityLine: "", sentence: "" };
  }

  if (method === "rebuild") {
    const geometry = outside == null
      ? `Needs a fresh composition: no ${ratio} frame inside this photograph holds the whole subject.`
      : `Needs a fresh composition. ${share.text} of the ${ratio} frame this subject needs does not exist in the source, which is past the ${ceilingText} an extension can honestly invent.`;
    /* Past the ceiling, so no key changes anything and claiming otherwise
       in either direction would be a capability clause about a decision
       geometry already made. */
    return { ...base, classification: "rebuild", available: false, geometry, availabilityLine: "", sentence: geometry };
  }

  const geometry = outside == null
    ? `Needs the canvas to grow past the source edge: no ${ratio} frame inside this photograph holds the whole subject.`
    : `Needs the canvas to grow past the source edge: no ${ratio} frame inside this photograph holds the whole subject, and ${share.text} of the frame it needs is not in the file, inside the ${ceilingText} an extension can honestly invent.`;
  const availabilityLine = canExtend === null
    ? ""
    : canExtend
      ? "serve.py is holding a key, so this family can be extended."
      : "Nothing can be sent: serve.py is not running with a key, so this ships as the tightest crop that keeps the most of the subject.";
  return {
    ...base,
    classification: "extend",
    /* The button is offered on the geometry, not on the key: without a key
       the panel is still the dry run that shows the whole request, which is
       the one place "what would it do" is answerable before it is done. */
    offer: true,
    geometry,
    availabilityLine,
    sentence: [geometry, availabilityLine].filter(Boolean).join(" "),
  };
}

/* Re-exported so a surface printing one of these thresholds never writes
   the number itself. The constants stay authored where they are argued
   with; this file is only the door. */
export { SOFT_UPSCALE, HARD_UPSCALE, EXTEND_LIMIT, ASPECT_TOLERANCE };
