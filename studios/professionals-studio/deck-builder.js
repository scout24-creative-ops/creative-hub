/* =====================================================================
   THE DECK MODEL

   A brief is not a deck. It is a person thinking in a text box, and the
   thinking is already there: the first line is what the thing is called,
   a short line with nothing after the full stop is a heading, the lines
   under it that end in a full stop are the argument, and the ones that
   do not are the list. Nobody has to be asked for keys. This module
   reads that shape and hands it to a narrative.

   A narrative is an order of slides, and the order is the opinion. The
   same brief told as a pitch and told as a readout is not the same deck:
   the pitch puts the problem before the number, the readout puts the
   number first because the number already happened. Four of them ship,
   and each one names only layouts that exist in deck-layouts.js.

   The one rule this file will not bend: it never writes prose. Where a
   role asks for a field the brief cannot feed, the slide gets the field's
   own label in square brackets — [Kicker], [Headline] — so the gap is
   visible from the back of the room. Filler that reads like copy is worse
   than an empty slide, because it gets shipped. This tool structures and
   typesets. It does not pretend to have written the thinking.

   Pure and DOM-free on purpose. Everything arrives in the arguments, so
   the whole model runs under node --test with no browser anywhere near
   it. Colour is never named here; it comes from the layouts, which get
   it from story-builder's fields.
   ===================================================================== */

import { layoutById, fieldFor, assertLegible } from "./deck-layouts.js";
/* THE OTHER PRODUCT'S DERIVATIONS, READ RATHER THAN REPEATED.
   Deck Studio builds slides out of Concept Studio's own history records, so
   every number and every label on a campaign slide is a fact that product
   already answered. It answered them differently here: `designLabel` took a
   string design id and handed it straight back, so the Product UI slide
   printed "ANCHOR-BOTTOM" where every Concept Studio surface for the same
   entry printed "Anchored block"; the risk slide's eyebrow printed the
   German angle slug where the other product prints "Life moment"; and the
   big-numbers slide printed the PLANNED placement count from a record that
   was holding the delivered figure the whole time. */
import { labelOf as studioLabel, countPhrase, countParts, planFacts } from "./studio-facts.js";

export const DECK_VERSION = "1.0.0";

/* ---------------------------------------------------------------------
   The four narratives.

   `from` names what the slide is fed, not where it sits. A role that
   asks for "sections" gets the next unread section; one that asks for
   "numbers" gets every numeral the brief contained. Nothing here knows
   how a slide looks.
   --------------------------------------------------------------------- */

export const NARRATIVES = [
  { id: "pitch", label: "Pitch", note: "Problem, size, close.",
    roles: [
      { layout: "title-field",      from: "title" },
      { layout: "statement",        from: "lede" },
      { layout: "three-up",         from: "sections" },
      { layout: "big-numbers",      from: "numbers" },
      { layout: "comparison",       from: "sections" },
      { layout: "closing",          from: "ask" },
    ] },
  { id: "strategy", label: "Strategy", note: "Where we are, where we go, how.",
    roles: [
      { layout: "title-field",      from: "title" },
      { layout: "agenda",           from: "headings" },
      { layout: "divider",          from: "sections" },
      { layout: "split-copy-left",  from: "sections" },
      { layout: "process",          from: "items" },
      { layout: "list",             from: "items" },
      { layout: "closing",          from: "ask" },
    ] },
  { id: "readout", label: "Readout", note: "What happened, what it means.",
    roles: [
      { layout: "title-field",      from: "title" },
      { layout: "statement",        from: "lede" },
      { layout: "big-numbers",      from: "numbers" },
      { layout: "three-up",         from: "sections" },
      { layout: "quote",            from: "quote" },
      { layout: "closing",          from: "ask" },
    ] },
  { id: "campaign", label: "Campaign", note: "The concept, the work, where it runs.",
    roles: [
      { layout: "title-fullbleed",  from: "keyVisual" },
      { layout: "statement",        from: "lede" },
      { layout: "split-photo-left", from: "keyVisual" },
      { layout: "product-ui",       from: "keyVisual" },
      { layout: "list",             from: "placements" },
      { layout: "big-numbers",      from: "numbers" },
      { layout: "closing",          from: "ask" },
    ] },
];

export function narrativeById(id) {
  const n = NARRATIVES.find(x => x.id === id);
  if (!n) throw new Error(`unknown narrative: ${id}`);
  return n;
}

/* ---------------------------------------------------------------------
   mapBrief: the keyless structuring step.
   --------------------------------------------------------------------- */

/* Numerals that carry a unit are the only ones worth a 132px slide.
   A bare "3" is a footnote; "3x" is a headline. */
/* The closing test is a negative lookahead, not \b. A word boundary after
   an alternation that can end in a non-word character — "%", "€" — asks
   for a word character on the far side of it, so "42% der Anfragen" and
   "5€ pro Monat" matched nothing at all and no percentage or price a
   brief stated ever reached layout 09. (?!\w) makes the same promise the
   \b was there to make, that "3xyz" is not a numeral, without demanding
   the unit end in a letter. */
const NUMERAL = /\b\d+([.,]\d+)?\s?(x|%|€|k|mio|min|h|tage?)(?!\w)/gi;

/* Terminal punctuation. A line that ends in one of these is a sentence,
   and a sentence is never a heading. */
const TERMINAL = /[.!?…:;]$/;

/* The body/items split uses only the three marks the spec enumerates. A
   line ending in a colon — "Was wir tun:" — is a label introducing a
   list, not prose, and must stay an item or it disappears from every
   items-fed slide. Heading detection keeps the wider set above, because
   a line ending in a colon is not a heading either. */
const SENTENCE_END = /[.!?]$/;

const HEADING_MAX = 60;

function sentencesOf(s) {
  return String(s || "").split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
}

function firstSentence(s) { return sentencesOf(s)[0] || ""; }

/* A heading is short, unpunctuated, starts its own block and has
   something under it. The "starts its own block" clause is what stops
   the first line of a bullet list from being read as a heading for the
   bullets beneath it. */
function isHeading(line, hasBody) {
  return Boolean(hasBody) && line.length > 0 && line.length < HEADING_MAX && !TERMINAL.test(line);
}

/* Every numeral in a stretch of text, with the phrase that follows it up
   to the end of its sentence. Three at most, because layout 09 has three
   columns and a fourth number is a table. */
function numeralsIn(text) {
  const src = String(text || "");
  const out = [];
  NUMERAL.lastIndex = 0;
  let m;
  while ((m = NUMERAL.exec(src)) && out.length < 3) {
    const token = m[0].trim();
    const after = src.slice(m.index + m[0].length).split(/[.!?\n]/)[0];
    out.push({ token, phrase: after.trim().replace(/^[-–—:,]\s*/, "") });
  }
  return out;
}

function sectionFrom(heading, lines) {
  const body = lines.filter(l => SENTENCE_END.test(l)).join(" ");
  const items = lines.filter(l => !SENTENCE_END.test(l));
  const found = numeralsIn([heading, ...lines].join("\n"));
  return {
    heading,
    body,
    items,
    numbers: found.map(n => n.token),
    /* The token alone is what a caller compares against; the pairing is
       what layout 09 renders, so both are kept rather than re-derived. */
    numberRows: found.map(n => (n.phrase ? `${n.token} | ${n.phrase}` : n.token)),
  };
}

/* THE MAPPED BRIEF — the full shape, because anything that builds one of
   these by hand instead of calling mapBrief has to build all of it.

     {
       title:  string   the first non-empty line
       lede:   string   everything said before the first heading
       sections: [{
         heading:    string
         body:       string    lines ending in . ! ? joined
         items:      string[]  every other line, in order
         numbers:    string[]  bare numerals with units, max 3 — "3x"
         numberRows: string[]  the same numerals paired with the phrase
                               that follows — "3x | faster to a viewing"
       }]
     }

   `lede` and `numberRows` are not decoration. `lede` is the only thing
   that feeds the `statement` layout, and `numberRows` is the only thing
   that feeds layout 09's "3,4× | mehr Einladungen" field. A caller that
   synthesises a brief object with just `{ title, sections }` — the
   campaign path reading Concept Studio history is the obvious one — gets
   a deck whose statement slides all read [The sentence] and whose
   numbers all read [Up to three]. Nothing throws and no test fails; the
   deck is simply empty where it should have argued. Set both. */
export function mapBrief(text) {
  const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  const title = (lines[i] || "").trim();

  /* Blank lines are the author's own paragraph marks. Use them. */
  const blocks = [];
  let cur = [];
  for (const raw of lines.slice(i + 1)) {
    const l = raw.trim();
    if (!l) { if (cur.length) blocks.push(cur); cur = []; }
    else cur.push(l);
  }
  if (cur.length) blocks.push(cur);

  const sections = [];
  const lede = [];
  for (const b of blocks) {
    if (isHeading(b[0], b.length > 1)) {
      sections.push(sectionFrom(b[0], b.slice(1)));
    } else if (sections.length) {
      /* A stray block after a heading belongs to that heading. */
      const s = sections[sections.length - 1];
      sections[sections.length - 1] = sectionFrom(
        s.heading,
        [...(s.body ? sentencesOf(s.body) : []), ...s.items, ...b],
      );
    } else {
      lede.push(...b);
    }
  }

  /* The lede is everything said before the first heading — the sentence
     the statement slide exists for. It is derived, not a section. */
  return { title, lede: lede.join(" "), sections };
}

/* ---------------------------------------------------------------------
   deckFrom: a narrative plus a mapped brief becomes slides.
   --------------------------------------------------------------------- */

/* The bracketed gap. Labels that carry an instruction ("Up to three
   columns, one per line, ...") are cut at the first comma so the slide
   reads [Up to three columns] rather than a sentence of guidance.

   Exported because it is a contract, not an implementation detail: an
   editor that lets a person empty a field has to put back exactly the gap
   deckFrom would have written, and a second copy of this one line in a
   second file is the thing that quietly drifts.

   A gap also has to obey the field's own `max`. `divider`'s number field
   declares max: 4 and sits in a 180px slot; "[Section number]" is sixteen
   characters and overflowed the slot on the normal path — every added
   slide starts fully placeholdered. So the label is cut to fit, and the
   brackets are never what gets cut: a clipped gap still reads as a gap. */
export function placeholder(field) {
  const label = String(field.label || field.k).split(",")[0].trim();
  const max = Number(field.max);
  if (!Number.isFinite(max) || max <= 0 || label.length + 2 <= max) return `[${label}]`;
  /* Two brackets plus at least one character of label, or an ellipsis on
     its own where even that will not fit. */
  const room = Math.max(1, max - 2);
  return `[${room <= 1 ? "…" : `${label.slice(0, room - 1)}…`}]`;
}

/* A layout's max is a promise about the design, not a suggestion. Cut on
   a word where there is one. */
function clip(value, max) {
  const s = String(value ?? "").trim();
  if (!max || s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:]+$/, "")}…`;
}

function rowsFrom(list, n) {
  return list.slice(0, n).filter(Boolean).join("\n");
}

function titleValues(map) {
  /* No kicker in a brief, so no kicker on the slide. */
  return { headline: map.title, subline: firstSentence(map.lede) || map.lede };
}

/* One section becomes one slide. Where the layout has an eyebrow the
   heading takes it and the first sentence becomes the headline, so
   nothing is said twice; where it has none — the divider — the heading
   is the headline, because that is what a divider is for. */
function oneSection(section, index, hasEyebrow) {
  if (!section) return {};
  const sen = sentencesOf(section.body);
  const v = { number: String(index + 1).padStart(2, "0") };
  if (sen.length && hasEyebrow && section.heading) {
    v.eyebrow = section.heading;
    v.headline = sen[0];
    if (sen.length > 1) v.body = sen.slice(1).join(" ");
  } else if (sen.length && !section.heading) {
    v.headline = sen[0];
    if (sen.length > 1) v.body = sen.slice(1).join(" ");
  } else if (sen.length) {
    v.headline = section.heading;
    v.body = section.body;
  } else {
    v.headline = section.heading;
    if (section.items.length) v.body = section.items.join(", ");
  }
  v.statement = section.body || section.heading;
  if (section.items.length) {
    v.items = rowsFrom(section.items, 6);
    v.steps = rowsFrom(section.items, 4);
  }
  if (section.numberRows.length) v.numbers = rowsFrom(section.numberRows, 3);
  return v;
}

function columnFor(section) {
  const body = firstSentence(section.body) || section.items[0] || "";
  return body ? `${section.heading} | ${body}` : section.heading;
}

/* ONE LEDGER, NOT TWO CURSORS.

   A section is spent the moment a slide prints it, whichever kind of
   slide that was. Two independent cursors — one walking sections, one
   walking the sections that carry a list — will hand the same section to
   a split slide and a process slide in the same deck, and the reader
   sees the same three lines twice with different typography. That is the
   most expensive kind of bug in a deck, because it looks deliberate.

   Sections carrying a list are reserved up front for the roles that need
   one, so a prose slide earlier in the order cannot eat the only list in
   the brief and leave the list slide bracketed. Where the brief has
   fewer sections than the narrative has slots, the surplus slides stay
   bracketed. That is the correct outcome: a slide with nothing to say
   says so. */
function claim(map, state, wantItems) {
  for (let i = 0; i < map.sections.length; i++) {
    if (state.spent.has(i)) continue;
    if (wantItems) { if (!map.sections[i].items.length) continue; }
    else if (state.reserved.has(i)) continue;
    state.spent.add(i);
    return i;
  }
  return -1;
}

function sectionValues(layout, map, state) {
  const has = k => layout.fields.some(f => f.k === k);

  /* Three-up reads several sections at once and spends every one it
     prints, so a later slide cannot repeat them. */
  if (has("columns")) {
    const taken = [];
    while (taken.length < 3) {
      const i = claim(map, state, false);
      if (i < 0) break;
      taken.push(map.sections[i]);
    }
    return taken.length ? { columns: rowsFrom(taken.map(columnFor), 3) } : {};
  }
  /* The comparison argues one section against the next, and spends both. */
  if (has("leftHeadline")) {
    const side = p => {
      const i = claim(map, state, false);
      if (i < 0) return {};
      const s = map.sections[i];
      const copy = s.body || s.items.join(", ");
      return { [`${p}Headline`]: s.heading, ...(copy ? { [`${p}Body`]: copy } : {}) };
    };
    return { ...side("left"), ...side("right") };
  }
  const i = claim(map, state, false);
  return i < 0 ? {} : oneSection(map.sections[i], i, has("eyebrow"));
}

/* list and process take a section that actually carries a list, and
   spend it against the same ledger every other slide reads. */
function itemValues(map, state) {
  const i = claim(map, state, true);
  if (i < 0) return {};
  const s = map.sections[i];
  return {
    headline: s.heading,
    items: rowsFrom(s.items, 6),
    steps: rowsFrom(s.items, 4),
    columns: rowsFrom(s.items, 3),
  };
}

function deckNumbers(map) {
  return rowsFrom(map.sections.flatMap(s => s.numberRows), 3);
}

function valuesFor(from, layout, map, state) {
  const has = k => layout.fields.some(f => f.k === k);
  switch (from) {
    case "title":
      return titleValues(map);
    case "lede":
      return map.lede ? { statement: map.lede, headline: firstSentence(map.lede) } : {};
    case "headings":
      return map.sections.length
        ? { items: rowsFrom(map.sections.map(s => s.heading), 6) } : {};
    case "numbers": {
      const n = deckNumbers(map);
      return n ? { numbers: n } : {};
    }
    case "items":
    case "placements":
      return itemValues(map, state);
    /* A brief holds no attributed quote and no ask. Both stay bracketed
       until a person types them, which is the point. */
    case "quote":
    case "ask":
      return {};
    /* The key visual carries the picture; its words come from wherever
       the slide sits — the title up front, a section further in. */
    case "keyVisual":
      return has("subline") ? titleValues(map) : sectionValues(layout, map, state);
    case "sections":
    default:
      return sectionValues(layout, map, state);
  }
}

/* Art is only ever attached where the layout asked for it. A layout that
   declares art "none" gets null, and so does one that wanted a picture
   and was given nothing — the layouts all render without. */
function artFor(layout, assets, state) {
  if (layout.art === "none") return null;
  const named = layout.id === "product-ui" ? (assets.productUi || assets.ui) : null;
  const pool = [assets.keyVisual, assets.hero]
    .concat(assets.images || [], assets.photos || [])
    .filter(Boolean);
  const src = named || (pool.length ? pool[state.art++ % pool.length] : null);
  if (!src) return null;
  return { src, veil: typeof assets.veil === "number" ? assets.veil : 0.55 };
}

export function deckFrom({ brief, narrative, source, assets } = {}) {
  const n = narrativeById(narrative);
  const map = mapBrief(brief);
  const art = assets || {};

  /* Reserve, before anything is printed, as many list-bearing sections
     as this narrative has slides that need one. */
  const wants = n.roles.filter(r => r.from === "items" || r.from === "placements").length;
  const withItems = map.sections.reduce((acc, s, i) => (s.items.length ? [...acc, i] : acc), []);
  const state = { spent: new Set(), reserved: new Set(withItems.slice(0, wants)), art: 0 };

  const slides = n.roles.map(role => {
    const layout = layoutById(role.layout);
    const found = valuesFor(role.from, layout, map, state);
    const fields = {};
    for (const f of layout.fields) {
      fields[f.k] = clip(found[f.k], f.max) || placeholder(f);
    }
    return { layout: layout.id, fields, art: artFor(layout, art, state) };
  });

  return {
    meta: {
      title: map.title || "[Title]",
      narrative: n.id,
      source: source || "brief",
      at: new Date().toISOString(),
      version: DECK_VERSION,
    },
    slides,
  };
}

/* ---------------------------------------------------------------------
   deckFromBuild: the second door.

   Concept Studio writes localStorage["plus_studio_history"] and Deck
   Studio only ever reads it. A history entry is already structured — a
   concept, a design, an export plan, a file count — so there is nothing
   for mapBrief to infer and no brief to infer it from. This maps the
   entry onto the campaign narrative directly.

   Two shapes are accepted, because two exist. The real writer
   (concept-studio.html, saveToHistory) stores `concepts` — an array,
   projected down to a few fields — and `exportPlan` with its families,
   each family carrying its own placements, plus `hard_cases`. The task
   brief's fixture is a simplified stand-in: a singular `concept`, a
   `plan` with a flat `placements` array and `hard`. Both are read, the
   real one first. Nothing here invents a field either of them lacks.

   The risk is the one thing this function will not let fall on the
   floor. A campaign deck that shows the headline and quietly drops the
   concept's stated weakness is the exact failure this whole feature was
   built to avoid, so the risk has a slide of its own — the split — and
   where the entry carries no risk the slide says so in brackets rather
   than closing the gap with something agreeable.
   --------------------------------------------------------------------- */

/* The concept-studio vocabulary for its own counts, taken from the words
   that product already prints under a finished build ("24 files · 10
   placements"). These are metric labels, not copy: nothing here writes a
   sentence a person did not. */
const COUNT_LABEL = { files: "files", placements: "placements", families: "ratio families",
  blocked: "blocked" };

/* A record from another browser, another version of Concept Studio or a
   truncated write is not a promise about types. `||` is not a type check:
   `plan.placements || []` hands a *number* straight to the spread, and the
   real record's top-level `placements` is exactly that — a count. A single
   coercion at every point where a list is expected turns a foreign shape
   into an empty deck section instead of a TypeError, which is the whole
   difference between a bracketed slide and a modal that stops responding. */
const arr = v => (Array.isArray(v) ? v : []);

const obj = v => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

/* The first usable concept, not the first slot. A record cut off mid-write
   can hold a null where a concept was, and taking it would bracket a deck
   the record could actually have filled. */
function conceptOf(entry) {
  if (entry.concept) return obj(entry.concept);
  return obj(arr(entry.concepts).find(c => c && typeof c === "object"));
}

function planOf(entry) {
  return obj(entry.exportPlan || entry.plan);
}

/* Every placement the plan names, wherever it named it: inside a ratio
   family (the real shape) or in a flat list (the fixture's). */
function placementsOf(plan) {
  const fromFamilies = arr(plan.families).flatMap(f => arr(obj(f).placements));
  return [...fromFamilies, ...arr(plan.placements)].filter(p => p && typeof p === "object");
}

const labelOf = p => [p.platform, p.placement].filter(Boolean).join(" · ")
  || String(p.name || p.id || "").trim();

/* A hard case is a constraint the platform imposes, so it belongs on the
   same list as the placement it constrains, not in a footnote nobody
   opens. */
function hardOf(plan) {
  const cases = arr(plan.hard_cases).length ? plan.hard_cases : plan.hard;
  return arr(cases).map(h => {
    const who = String(obj(h).placement || obj(h).id || "").trim();
    const what = String(obj(h).problem || "").trim();
    return [who, what].filter(Boolean).join(" — ");
  }).filter(Boolean);
}

/* WHAT A RECORD SAYS ITS BUILD PRODUCED, read once, in both products.
   Records written since studio-facts landed carry the build's own `facts`
   object — the same one Concept Studio's results card and history row print
   — so nothing here counts anything. Older records carry flat fields, and a
   fixture carries neither, so the plan is counted instead. That ladder is
   stated once, here, rather than by three optional-field expressions inside
   `countRows` and a fourth inside deck-studio's campaign row. */
export function recordFacts(entry, plan) {
  const e = obj(entry);
  const f = e.facts && typeof e.facts === "object" ? e.facts : null;
  const planned = f ? f.placementsPlanned
    : typeof e.placements === "number" ? e.placements : placementsOf(plan).length;
  /* THE DELIVERED FIGURE, which was in the record all along and which
     neither Deck surface read: one build's history row said "8 of 9
     placements" in Concept Studio while the campaign row here said "9
     placements" and the slide said "9 | placements". */
  const built = f ? f.placementsBuilt
    : typeof e.placementsBuilt === "number" ? e.placementsBuilt : null;
  const files = f ? f.files : typeof e.files === "number" ? e.files : null;
  /* ONE DECISION ABOUT "ONE NUMBER OR TWO", TAKEN HERE.
     `countParts` decides it and hands back both the sentence and the figure
     column the big-numbers slide needs, because that slide is the one
     surface that cannot print a sentence — and it used to re-decide from
     these same two fields twelve lines below this call. The two readings
     disagreed about a build with no planned figure recorded: this said "8
     placements", the slide said "8 of null | placements". */
  const parts = planned || built
    ? countParts(built == null ? planned : built, built == null ? null : planned, "placement")
    : null;
  return {
    files, placementsPlanned: planned, placementsBuilt: built,
    blocked: f ? f.blocked : typeof e.blocked === "number" ? e.blocked : 0,
    filesPhrase: files == null ? "" : countPhrase(files, null, "file"),
    placementsPhrase: parts ? parts.text : "",
    placementsValue: parts ? parts.value : "",
  };
}

function countRows(entry, plan) {
  const c = recordFacts(entry, plan);
  const rows = [];
  if (c.files != null) rows.push(`${c.files} | ${COUNT_LABEL.files}`);
  /* BOTH NUMBERS WHERE THEY DIFFER, and `recordFacts` is what knows where
     they differ. This block used to work that out for itself and got a
     null plan wrong, printing the word "null" on a slide somebody takes
     into a room. It prints the figure the phrase carries. */
  if (c.placementsValue) rows.push(`${c.placementsValue} | ${COUNT_LABEL.placements}`);
  /* Blocked files outrank the family count for the third column. A build
     that blocked exports says so on the slide, not in a log. */
  if (c.blocked) rows.push(`${c.blocked} | ${COUNT_LABEL.blocked}`);
  else {
    /* THE RATIO FAMILIES, NOT THE GROUPS. This counted `plan.families`,
       which includes the group that declares no master — so the slide read
       "8 | ratio families" for a build whose Concept Studio header said 7,
       and whose own card for that eighth group said "Not a ratio family". */
    const fams = planFacts(arr(plan.families), null).ratioFamilies;
    if (fams) rows.push(`${fams} | ${COUNT_LABEL.families}`);
  }
  return rows;
}

/* Pictures the entry carries in its own right. The caller may hand in
   assets as well, and those win: a page that has already loaded a
   full-size key visual should not be overruled by a thumbnail. */
function buildAssets(entry, assets) {
  const concept = conceptOf(entry);
  /* A truncated record can hold a null where a concept was. */
  const photos = arr(entry.concepts).map(c => obj(c).photo).filter(Boolean);
  const thumbs = arr(entry.thumbs).filter(Boolean);
  return {
    keyVisual: concept.photo || null,
    images: [...photos, ...thumbs],
    productUi: thumbs[0] || null,
    ...(assets || {}),
  };
}

/* What each campaign slide is fed, by layout. Every value below is a
   string the entry already held; where it held none the field falls
   through to placeholder() in the loop, exactly as deckFrom does. */
/* THE ENGLISH LABEL FOR A CONCEPT'S VISUAL WORLD, from whichever id the
   record carries. Concept Studio files an angle under a German slug and a
   visual category under an English one, and both name the same eight worlds;
   `labelOf` maps either to the one label both products print. */
function eyebrowFor(concept) {
  const c = obj(concept);
  const cat = studioLabel("category", c.visual_category);
  if (cat.known) return cat.label;
  const ang = studioLabel("angle", c.angle);
  if (ang.known) return ang.label;
  /* Neither id names a world this product knows. Show whichever one the
     record actually carried, bracketed, so a foreign slug is visible from
     the back of the room rather than silently printed as a label. */
  if (c.visual_category) return cat.label;
  if (c.angle) return ang.label;
  return "";
}

function buildValues(entry, concept, plan) {
  const places = placementsOf(plan).map(labelOf).filter(Boolean);
  const ratios = arr(plan.families).map(f => obj(f).ratio).filter(Boolean);
  return {
    "title-fullbleed": {
      kicker: entry.product, headline: concept.headline_de, subline: concept.subline_de,
    },
    "statement": { statement: concept.why_it_works },
    /* The risk slide. THE EYEBROW IS THE ENGLISH LABEL, like every other
       surface in both products. It was `concept.angle || concept.category`,
       and the fallback was dead: Concept Studio wrote `category: c.category`
       into history while concepts have only ever carried `visual_category`,
       so the field was always undefined and the German angle slug was the
       only thing that could reach this slide. It printed LEBENSMOMENT — the
       layout uppercases the eyebrow — where Concept Studio printed "Life
       moment" for the same concept. */
    "split-photo-left": {
      eyebrow: eyebrowFor(concept),
      headline: concept.name || concept.hook_de,
      body: concept.risk,
    },
    /* `designLabel` was here: a string design id went in and came straight
       back out, and the layout uppercased it, so this slide read
       ANCHOR-BOTTOM while Concept Studio's design card read "Anchored
       block". `labelOf` resolves the id against the engine's own library
       and says `[unknown design: x]` for one it cannot name, rather than
       falling through to DESIGNS[0] and inventing a label. */
    "product-ui": {
      eyebrow: studioLabel("design", entry.design).label, headline: concept.hook_de,
      body: ratios.join(", "),
    },
    "list": {
      headline: entry.product,
      items: rowsFrom([...places, ...hardOf(plan)], 6),
    },
    "big-numbers": {
      eyebrow: entry.product, headline: entry.objective,
      numbers: rowsFrom(countRows(entry, plan), 3),
    },
    "closing": { headline: concept.cta_de, next: plan.summary },
  };
}

export function deckFromBuild(entry, assets) {
  const e = obj(entry);
  const n = narrativeById("campaign");
  const concept = conceptOf(e);
  const plan = planOf(e);
  const art = buildAssets(e, assets);
  const values = buildValues(e, concept, plan);
  const state = { art: 0 };

  const slides = n.roles.map(role => {
    const layout = layoutById(role.layout);
    const found = values[layout.id] || {};
    const fields = {};
    for (const f of layout.fields) {
      fields[f.k] = clip(found[f.k], f.max) || placeholder(f);
    }
    return { layout: layout.id, fields, art: artFor(layout, art, state) };
  });

  return {
    meta: {
      title: concept.headline_de || e.product || "[Title]",
      narrative: n.id,
      source: e.id ? `build:${e.id}` : "build",
      at: new Date().toISOString(),
      version: DECK_VERSION,
    },
    slides,
  };
}

/* =====================================================================
   THE RENDERER
   buildDeck(deck) belongs below this line. Everything above is the
   model and stays free of markup.
   ===================================================================== */

/* ---------------------------------------------------------------------
   buildDeck: the deck model becomes one file that opens from a desktop.

   Pure and DOM-free like everything above it. Nothing is fetched, nothing
   is measured in a browser, and no asset is ever referenced by URL — a
   deck that needs a server is a deck that fails in the room it was made
   for. Assets arrive as data URIs on `deck.assets` or they do not arrive.

   The layouts render a slide's inside and nothing else. The wrapper is
   this file's job, and so is everything that belongs to the deck rather
   than to a slide: the field the slide sits on, the 1920x1080 box, the
   scale that fits it to a screen, the slide number, the logo footer, the
   navigation and the print sheet.
   --------------------------------------------------------------------- */

const escHtml = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Nothing over the network, ever. A caller that hands in an http(s)
   source gets it dropped rather than baked into a file that will look
   fine on the machine that built it and break on the one that presents
   it. Data URIs and local paths pass through untouched.

   Trim first: a leading space defeats an anchored test but not a browser,
   which strips whitespace before resolving a URL. A protocol-relative
   `//cdn…` is a network fetch too, and looks like neither `http:` nor a
   path, so it is named explicitly rather than left to the scheme test. */
const localOnly = v => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return /^data:/i.test(s) ? s : "";
  return s.startsWith("//") ? "" : s;
};

/* The layouts hold their content to a 132px house margin. Chrome lives in
   the band outside those boxes and inside the slide's edge. */
const CHROME_X = 56;   /* 56px from the side edge: clear of the 132 content box */
const CHROME_Y = 52;   /* 52px up from the bottom edge, same band */

/* How far the slide number is allowed to recede. Chrome is quiet, but a
   quiet mark is still a readable one, and this number is the only thing
   on a slide that tells a reader where they are.

   It was .55, which measures 3.19:1 on sand, 2.98:1 on teal and 2.59:1 on
   purple — every field in the deck below 4.5:1, measured by deck-lab.
   Blue is the binding case, because charcoal type has the least room to
   fade against the lightest of the two accent fields. At .9 the pairings
   measure, worst first: purple 5.40:1, teal 7.23:1, sand 8.82:1,
   white 9.23:1, charcoal 10.56:1. The value is named rather than inlined
   so the next person to dim the chrome has to read this. */
const CHROME_INK = ".9";

/* One line of guidance turned into one number: how many slides across the
   overview grid is, and therefore how far down each slide is scaled. */
const GRID_COLS = 4;
const GRID_SCALE = 0.25;

function fontFaces(fonts) {
  /* `fonts` is { weight: dataUri }, e.g. { 400: "data:font/woff2;base64,…" }.
     Anything that is not a data URI is not a font this file can carry. */
  const entries = Object.entries(fonts || {})
    .map(([weight, src]) => [weight, String(src ?? "")])
    .filter(([, src]) => src.startsWith("data:"));
  if (!entries.length) return "";
  return entries.map(([weight, src]) => `@font-face{font-family:"Make It Better";
    font-weight:${Number(weight) || 400};font-style:normal;font-display:block;
    src:url("${src}") format("woff2")}`).join("\n");
}

/* Slide numbers and the logo footer are deck chrome, not slide content,
   which is why no layout emits them. They sit in the bottom margin band —
   the logo bottom left, the number bottom right, both 56px in from the
   edge and so a clear 76px outside the 132px box every layout keeps its
   type inside. Nothing is drawn behind either of them.

   The colour is the slide's own type colour, because the chrome sits on
   the slide's own field. The comparison layout is the one slide with two
   fields on it — its right half is charcoal — so the number, which lives
   on that half, takes the charcoal field's type colour instead. */
function chromeFor(layoutId, colours) {
  return {
    left: colours.fg,
    right: layoutId === "comparison" ? fieldFor("charcoal").fg : colours.fg,
  };
}

function chromeHtml(index, count, layoutId, colours, logo) {
  const ink = chromeFor(layoutId, colours);
  const mark = logo
    ? `<img class="chrome-logo" src="${escHtml(logo)}" alt="" style="position:absolute;
        left:${CHROME_X}px;bottom:${CHROME_Y - 8}px;height:34px;width:auto;
        opacity:.85;pointer-events:none">`
    : "";
  const num = `<div class="chrome-num" style="position:absolute;right:${CHROME_X}px;
      bottom:${CHROME_Y}px;font-size:22px;font-weight:700;letter-spacing:.04em;
      color:${ink.right};opacity:${CHROME_INK};pointer-events:none">${escHtml(
        `${index + 1} / ${count}`)}</div>`;
  return `${mark}${num}`;
}

function slideHtml(slide, i, count, assets) {
  const layout = layoutById(slide.layout);
  const bg = slide.bg || layout.bg;

  /* A slide's art is a URL like any other, and the layouts interpolate it
     straight into <img src=…>. The three shared assets are filtered in
     buildDeck; this is the fourth source, and without this line a deck
     whose art points at a CDN produces a file that fetches over the
     network the moment it is opened. Dropping the src leaves the layout's
     own no-picture branch, which every layout has. */
  if (slide.art && slide.art.src) {
    const src = localOnly(slide.art.src);
    slide = { ...slide, art: src ? { ...slide.art, src } : null };
  }

  /* Measure before rendering. A slide nobody can read is not a slide, and
     the error has to name which one so it can be found in the deck. */
  let colours;
  try {
    assertLegible(bg);
    colours = fieldFor(bg);
  } catch (err) {
    throw new Error(`slide ${i + 1} (${layout.id}): ${err.message}`);
  }

  const ctx = { esc: escHtml, field: colours, assets };
  let inner;
  try {
    inner = layout.render(slide, ctx);
  } catch (err) {
    throw new Error(`slide ${i + 1} (${layout.id}): ${err.message}`);
  }

  return `<div class="cell" data-i="${i}">
  <section class="slide" style="background:${colours.bg};color:${colours.fg}">
    ${inner}
    ${chromeHtml(i, count, layout.id, colours, assets.logo)}
  </section>
</div>`;
}

/* The whole stylesheet. The slide's own numbers never move: 1920x1080 is
   the slide, and fitting it to a screen is a transform on the stage above
   it.

   `--k` is a bare number, and CSS has no way to express a viewport ratio
   as one: dividing a length by a number gives a length, so
   `min(calc(100vw/1920), …)` resolves to `1px` and `transform:scale(1px)`
   is simply dropped. The script sets `--k` on load and on resize. The
   declaration below is the value a browser with its script blocked keeps:
   half size, which fits a 1920x1080 slide whole inside any screen at
   least 960 wide, so a scriptless deck is small but never cropped. */
function styles(fonts, page) {
  const stack = fonts
    ? `"Make It Better",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`
    : `system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`;
  return `${fonts}
*{box-sizing:border-box}
html,body{margin:0;padding:0;height:100%}
body{background:${page.bg};color:${page.fg};font-family:${stack};
  -webkit-font-smoothing:antialiased}
.deck{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
  overflow:hidden}
.stage{--k:.5;
  width:1920px;height:1080px;transform:scale(var(--k));transform-origin:center center;
  flex:none}
.cell{display:none}
.cell.is-current{display:block}
.slide{width:1920px;height:1080px;position:relative;overflow:hidden}

/* The overview. Esc lays every slide out at a quarter size; a click on one
   goes to it. The slides keep their own dimensions and are scaled, never
   resized. */
body.is-overview .deck{align-items:flex-start;justify-content:flex-start;overflow:auto}
body.is-overview .stage{--k:1;transform:none;width:auto;height:auto;
  display:grid;grid-template-columns:repeat(${GRID_COLS},${1920 * GRID_SCALE}px);
  gap:24px;padding:24px}
body.is-overview .cell{display:block;width:${1920 * GRID_SCALE}px;
  height:${1080 * GRID_SCALE}px;overflow:hidden;cursor:pointer;
  outline:2px solid ${page.fg}33}
body.is-overview .cell.is-current{outline:3px solid ${page.accent}}
body.is-overview .slide{transform:scale(${GRID_SCALE});transform-origin:top left}

@media print{
  @page { size: 1920px 1080px; margin: 0 }
  html,body{height:auto;background:none}
  .deck{position:static;display:block;overflow:visible}
  .stage,body.is-overview .stage{transform:none;width:auto;height:auto;
    display:block;padding:0;gap:0}
  .cell,body.is-overview .cell{display:block;width:auto;height:auto;
    overflow:visible;outline:none}
  .slide,body.is-overview .slide{break-after:page;page-break-after:always;
    transform:none}
  /* Only the deck's last slide, which is the last .cell's slide. The rule
     is scoped to the cell on purpose: an unscoped :last-child on the slide
     itself matches every slide, since each one is the only child of its
     cell, and would cancel every page break in the deck. */
  .cell:last-child .slide{break-after:auto;page-break-after:auto}
}`;
}

/* Navigation. Right/Space forward, Left back, Esc toggles the overview,
   and the index lives in location.hash so a reload holds its place. */
const NAV = `(function(){
  var cells=[].slice.call(document.querySelectorAll('.cell'));
  if(!cells.length)return;
  var i=0;
  /* The display scale. A bare number, which is why CSS cannot compute it:
     100vw/1920 is a length, and scale() will not take one. */
  var stage=document.querySelector('.stage');
  function fit(){
    if(!stage)return;
    var k=Math.min(window.innerWidth/1920,window.innerHeight/1080);
    stage.style.setProperty('--k',String(k));
  }
  window.addEventListener('resize',fit);
  fit();
  function clamp(n){return Math.max(0,Math.min(cells.length-1,n));}
  function show(n,push){
    i=clamp(n);
    cells.forEach(function(c,j){c.classList.toggle('is-current',j===i);});
    var h='#'+(i+1);
    if(push!==false&&location.hash!==h)location.hash=h;
    if(document.body.classList.contains('is-overview'))
      cells[i].scrollIntoView({block:'nearest'});
  }
  function fromHash(){
    var n=parseInt(String(location.hash).replace('#',''),10);
    show(isNaN(n)?0:n-1,false);
  }
  function overview(on){
    document.body.classList.toggle('is-overview',on);
    show(i,false);
  }
  document.addEventListener('keydown',function(e){
    var over=document.body.classList.contains('is-overview');
    if(e.key==='ArrowRight'||e.key===' '||e.key==='Spacebar'||e.key==='PageDown'){
      e.preventDefault();show(i+1);}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(i-1);}
    else if(e.key==='Escape'){e.preventDefault();overview(!over);}
    else if(e.key==='Enter'&&over){e.preventDefault();overview(false);}
    else if(e.key==='Home'){e.preventDefault();show(0);}
    else if(e.key==='End'){e.preventDefault();show(cells.length-1);}
  });
  cells.forEach(function(c,j){c.addEventListener('click',function(){
    if(document.body.classList.contains('is-overview')){show(j);overview(false);}
    });});
  window.addEventListener('hashchange',fromHash);
  fromHash();
})();`;

export function buildDeck(deck) {
  if (!deck || !Array.isArray(deck.slides)) throw new Error("buildDeck: no deck");
  const meta = deck.meta || {};
  const src = deck.assets || {};
  const assets = {
    plusTeal: localOnly(src.plusTeal),
    plusPurple: localOnly(src.plusPurple),
    logo: localOnly(src.logo),
  };
  /* The page around the slides is the deck's dark surround, so a slide on
     any field reads as an object on a table. Its colour comes from the
     fields like every other colour in this tool. */
  const page = fieldFor("charcoal");
  const count = deck.slides.length;
  /* The document's declared language. A deck built from an English brief
     was still shipping lang="de", which is wrong for a screen reader and
     for hyphenation. The model may carry one (`meta.lang`); when it does
     not, "de" stays the default, because the brand's own copy, the
     template this deck is lifted from and every layout note in it are
     German. Only a plain language tag is accepted, so nothing a person
     typed can reach the attribute. */
  const lang = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(String(meta.lang || ""))
    ? meta.lang : "de";
  const body = deck.slides.map((s, i) => slideHtml(s, i, count, assets)).join("\n");

  return `<!doctype html>
<html lang="${escHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(meta.title || "Deck")}</title>
<meta name="generator" content="Deck Studio ${escHtml(meta.version || DECK_VERSION)}">
<meta name="deck-narrative" content="${escHtml(meta.narrative || "")}">
<meta name="deck-source" content="${escHtml(meta.source || "")}">
<meta name="deck-built" content="${escHtml(meta.at || "")}">
<style>
${styles(fontFaces(src.fonts), page)}
</style>
</head>
<body>
<div class="deck"><div class="stage">
${body}
</div></div>
<script>
${NAV}
</script>
</body>
</html>
`;
}
