/* =====================================================================
   PLUS IMAGERY AGENT
   The rules in agents/imagery-agent.md, turned into a brief and a prompt.

   WHAT THIS REPLACES. concept-studio.html used to build its render prompt
   from eight array elements: six fixed English sentences and the
   concept's German `big_idea` and `aesthetic` spliced in raw. It routed
   no workflow, named no source SVG, forced people into every frame
   including the ones about an empty room, invented "35mm at f/2.0" from
   no source, wrote two brand hex values as literals, sent no negative
   list, kept no record of what it asked for, and generated one 1536x1024
   frame whatever the campaign was. That is roughly a fifth of the
   specification. This module is the rest of it.

   WHAT A BRIEF IS HERE. Nine parts, in the order the packaged skill at
   plus-agents/skills/plus-imagery/SKILL.md lays them out: workflow,
   scene, German setting, people, brand elements, light and camera, render
   prompt, negative prompt, production note. `buildImageryBrief` returns
   all nine as data. The prompt is derived from the brief rather than the
   brief being derived from the prompt, which is what makes the thing
   inspectable before a key is ever set, and what lets the QA panel and
   the asset record say the same thing the model was told.

   FOUR DECISIONS WORTH ARGUING WITH.

   1. THE PROMPT IS ENGLISH THROUGHOUT.
      The old prompt concatenated German concept sentences into an
      English instruction, which made the two concept-driven slots the
      least controlled part of the whole request. Every angle here
      carries an English scene line instead, and the German copy is shown
      to the person in the panel but never sent. The German never appears
      in the picture anyway: the text rule forbids any lettering at all.

   2. THE WORKFLOW IS ASKED, ONCE, AND ONLY WHEN IT IS CONSEQUENTIAL.
      The spec allows exactly one question, in these words: "immersive 3D
      integration or faithful original SVG application?". It is inferred
      from the concept first, and the inference is shown with its reason
      so the answer can be overruled in one click. Before this, Original
      SVG Professionals — half the specification, and the only route that produces
      a surface pattern or a faithful flat application — was unreachable
      from the Studio at all.

   3. EVERY PLUS NAMES ITS SOURCE FILE.
      The spec makes the approved SVG the origin of shape, proportion and
      colour, and requires each Professionals in a brief to say which file it
      derives from. Two are chosen deterministically from the concept id,
      one teal and one purple, because both accents must appear in every
      frame. Deterministic matters: a build is reproducible byte for
      byte, and a prompt that changed run to run would end that.

   4. THE NEGATIVE LIST IS IN THE PROMPT, BECAUSE THE API HAS NO FIELD
      FOR IT. /images/generations takes model, prompt, n and size. There
      is no negative_prompt parameter, so a negative list held beside the
      request would simply never be sent — which is exactly what happened
      to generateImageDirections' list, computed and dropped. It is
      appended to the prompt as an explicit exclusion sentence AND kept
      as a structured list on the record, so a model that does take one
      can be given it without re-deriving anything.

   THE CONFLICT THE SOURCES DO NOT RESOLVE. brand/tokens.json
   plusses.rules caps hero brand elements at 3 per composition. imagery-agent.md
   says "more may be used when compositionally appropriate" with no cap.
   The cap is implemented, additional brand elements are described as background
   pattern, and the conflict is carried on the brief as `conflicts` so it
   appears on screen rather than being settled silently in code.

   WHAT IS AUTHORED HERE RATHER THAN SPECIFIED. agents/imagery-agent.md
   contains rules and a QA list. It contains no prompt skeleton, no
   negative list, no lens, no aperture, no camera height, no lighting
   vocabulary, no list of German cities or architecture typologies, and
   no mapping from a concept's visual category to a workflow. Every
   vocabulary below is therefore a judgement made in this repo, kept in
   one object so it can be argued with and so it can be replaced wholesale
   by an export of the real agent. See agents/imagery/README.md for the
   shape a dropped-in file has to take.

   Interface copy and this file are English. Customer-facing copy is
   German and never passes through here.
   ===================================================================== */

import { COLORS } from "./ad-engine.js";
import { containWindow } from "./size-adapter.js";
/* The two shared printing rules. This file writes sentences a person reads,
   and it was writing its own plural ("famil" + y/ies) and its own rounding —
   the two operations that produced every disagreement studio-facts.js exists
   to end. It imports only helpers, and studio-facts imports nothing from
   here. */
import { countPhrase, sharePhrase } from "./studio-facts.js";

export const IMAGERY_VERSION = "1.0.0";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* A stable small hash, so "which city" and "which Professionals" are decided the
   same way on every run of the same brief. Reproducibility is a promise
   the build records already make; a prompt that drifted would break it. */
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < String(s).length; i++) {
    h ^= String(s).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}
const pick = (arr, seed) => arr[hash(seed) % arr.length];

/* =====================================================================
   1. THE PACK
   Every vocabulary in one object. Nothing below this section invents a
   word that is not in here, which is what makes an export of the real
   agent able to replace the vocabulary without touching the logic.
   ===================================================================== */

export const DEFAULT_PACK = {
  id: "built-in",
  label: "Built-in spec",
  note: "Derived from agents/imagery-agent.md and brand/tokens.json. Every vocabulary is authored in this repo; the source documents supply rules, not words.",

  /* SCOPE GATE. imagery-agent.md: decline or redirect image requests
     unrelated to Professionals products. */
  products: ["Professionals", "Professionals", "Professionals", "Professionals", "Professionals"],

  /* THE APPROVED LIBRARY. Mirrors brand/tokens.json plusses.assets.
     loadImageryPacks() overwrites this from that file at runtime, so the
     copy here is the offline fallback and the thing the Node tests read.
     If the two ever disagree, the JSON wins. */
  plusAssets: {
    teal: ["assets/plus-teal-1.svg", "assets/plus-teal-2.svg", "assets/plus-teal-3.svg", "assets/plus-teal-4.svg"],
    purple: ["assets/plus-purple-1.svg", "assets/plus-purple-2.svg", "assets/plus-purple-3.svg", "assets/plus-purple-4.svg"],
    pairs: ["assets/plus-pair-teal-lead.svg", "assets/plus-pair-purple-lead.svg", "assets/plus-pair-ux.svg"],
  },

  /* Immersive object vocabulary, verbatim from
     brand/tokens.json imagery.plus_in_place.object_types. */
  objectTypes: [
    "flat wall graphic", "freestanding lacquered volume", "shelving unit",
    "coffee table", "framed artwork", "cushion/textile",
  ],

  /* Original SVG material applications, from the agent's own list of
     valid applications. */
  svgApplications: [
    "wallpaper across one wall", "chair upholstery", "a woven rug",
    "printed curtains", "cushion covers", "glazed wall tiles",
    "a painted wall pattern", "bedding",
  ],

  /* GERMAN SETTINGS. No source document lists an approved city, region or
     architecture typology; the agent says only "choose a plausible German
     setting". These are that choice, made once and written down. */
  cities: [
    { name: "Berlin", typology: "a Gründerzeit Altbau flat, high stucco ceilings, tall double casement windows, herringbone parquet", street: "a leafy Kiez street with a bike lane and linden trees" },
    { name: "Hamburg", typology: "a red-brick Backstein building, white timber sash windows, a black-and-white tiled stairwell", street: "a canal-side street with cobbles and cast-iron railings" },
    { name: "Leipzig", typology: "a restored Gründerzeit flat, tall windows, a tiled Kachelofen kept as a feature", street: "a wide street of five-storey facades with balconies" },
    { name: "München", typology: "a post-war Neubau flat, wide balcony doors, warm oak floors, roller shutters in their boxes", street: "a quiet residential street with hedges and a Biergarten chestnut" },
    { name: "Köln", typology: "a narrow 1950s reconstruction building, tall thin windows, a compact tiled bathroom", street: "a corner street with a Trinkhalle awning and parked bicycles" },
    { name: "Stuttgart", typology: "a hillside flat with a long balcony, sliding glass doors, a wall-mounted panel radiator", street: "a stepped Stäffele path between garden walls" },
    { name: "Dresden", typology: "a renovated Plattenbau flat, generous windows, a compact fitted kitchen", street: "an open green courtyard with mature trees between blocks" },
    { name: "Hannover", typology: "a 1930s Reihenhaus, timber staircase, a small conservatory to the garden", street: "a row of brick terraces with clipped front hedges" },
  ],

  seasons: [
    "early spring, bare branches and the first light coming back",
    "high summer, windows open to the courtyard",
    "early autumn, warm low sun and leaves down on the pavement",
    "clear winter, cold light and the heating on",
  ],

  /* LIGHT AND CAMERA. Keyed on the angle, because the aesthetic line the
     concept carries is German prose and parsing it would be guessing.
     Every value is authored: no source states a lens, an aperture or a
     camera height anywhere, and the "35mm at f/2.0" the old prompt used
     appears in no document in this repo. */
  angles: {
    lebensmoment: {
      category: "life-event-moment", kind: "people",
      scene: "the moment of arriving: a small removal box still in the hallway, a jacket not yet hung up, the front door just closed behind them",
      people: "one of them is holding the keys and both have stopped in the hall, looking into the flat for the first time",
      light: { quality: "warm low afternoon sun, soft-edged", direction: "raking in from a window camera-left, throwing long shadows across the floor" },
      camera: { lens: "35mm", aperture: "f/2.2", dof: "shallow, the far wall falling gently out of focus", height: "chest height, about 1.35m" },
      route: "immersive",
    },
    person: {
      category: "person-portrait", kind: "people",
      scene: "one person alone in the flat they are about to take, phone in hand, half-turned toward the window",
      people: "one seeker only, caught mid-thought, the phone forgotten in their hand",
      light: { quality: "bright overcast daylight, broad and even", direction: "frontal from a large window camera-right, a soft fill bouncing off a pale wall" },
      camera: { lens: "50mm", aperture: "f/2.0", dof: "shallow, the room dissolving behind the face", height: "eye level, about 1.55m" },
      route: "immersive",
    },
    wohnung: {
      category: "apartment-interior", kind: "architecture",
      scene: "the empty room a few days before anyone moves in: bare floor, one folded blanket left on the sill, dust visible in the light",
      people: null,
      /* This route's whole premise is the room BEFORE anyone lives in it,
         so the standing lived-in instruction would contradict its own
         scene. Overridden rather than dropped: the rule it replaces is
         "never a showroom", and that still has to be said. */
      room: "The flat is genuinely empty but not a showroom: scuffed skirting, a bare bulb on a flex, tape marks on the floor, the previous tenant's picture hooks still in the wall.",
      light: { quality: "high clear daylight, crisp", direction: "straight down through a tall window camera-centre, a hard bright rectangle on the floor" },
      camera: { lens: "24mm", aperture: "f/5.6", dof: "deep, every corner of the room sharp", height: "1.45m, level, no converging verticals" },
      route: "immersive",
    },
    "plus-im-raum": {
      category: "plus-in-place", kind: "people",
      scene: "an evening in a lived-in living room, someone reading on the sofa, the room already theirs",
      people: "one of them is on the sofa and one is crossing the room with a glass, neither performing for the camera",
      light: { quality: "warm dimensional lamplight against the last of the daylight", direction: "a table lamp camera-right and cool window light camera-left, real contact shadows under everything" },
      camera: { lens: "35mm", aperture: "f/2.8", dof: "moderate, the sofa sharp and the far wall soft", height: "seated eye level, about 1.15m" },
      route: "immersive",
    },
    detail: {
      category: "object-detail", kind: "architecture",
      scene: "close on two pairs of hands and a phone on a kitchen table, a set of keys and a cold coffee beside them",
      people: "hands and forearms only, no faces anywhere in frame",
      room: "The table is in use rather than styled: crumbs, a ring from a glass, a folded newspaper pushed aside.",
      /* A tabletop close-up has no room for a shelving unit or a coffee
         table, and a rug is not in shot. The frame decides the
         vocabulary, so this angle carries its own. */
      plusScope: {
        objectTypes: ["framed artwork propped against the wall behind the table", "cushion/textile on the chair just in frame"],
        svgApplications: ["the printed tablecloth under their hands", "the glazed tile the phone is resting on"],
      },
      light: { quality: "soft directional daylight, one source, no fill", direction: "from a window camera-left, a single soft shadow running right across the table" },
      camera: { lens: "50mm", aperture: "f/2.8", dof: "very shallow, the table falling away within a hand's width", height: "just above the table, about 1.0m, looking down at 40 degrees" },
      route: "original-svg",
    },
    typo: {
      category: "typographic-pattern", kind: "none",
      scene: null, people: null, light: null, camera: null, route: null,
    },
    stadt: {
      category: "city-neighbourhood", kind: "architecture",
      scene: "the street the flat is on, seen from the pavement opposite: facades, balconies, a bakery awning with no lettering on it, a bicycle against a railing",
      people: "one or two passers-by, far enough away to be part of the street rather than the subject",
      /* Pore-level skin direction for someone twenty metres away is noise
         in the prompt. The identity and legal rules still apply and are
         emitted regardless; only the retouching paragraph is dropped. */
      skin: false,
      room: "The street is used rather than dressed: bins out, a scooter chained to a post, weeds at the base of the wall.",
      plusScope: {
        objectTypes: ["freestanding lacquered volume in the front garden", "flat wall graphic on the gable end"],
        svgApplications: ["the awning fabric over the shopfront", "the painted pattern on the courtyard wall"],
      },
      light: { quality: "cool documentary daylight under a light overcast", direction: "flat and open from above, no hard shadow anywhere" },
      camera: { lens: "35mm", aperture: "f/4", dof: "deep, the far end of the street still readable", height: "standing eye level, about 1.6m" },
      route: "immersive",
    },
    "produkt-ui": {
      category: "product-ui-mock", kind: "none",
      scene: null, people: null, light: null, camera: null, route: null,
    },
  },

  /* The standing instruction for any frame that does not override it. */
  roomDefault: "The room is lived in rather than staged: plants, books, worn textiles, something slightly out of place. Never a showroom, never staged-empty.",

  /* CASTING. Derived from the brief's audience line, which parseBrief
     already produces in German. Matched on substring, defaulting to the
     general seeker rather than to nobody. */
  casting: [
    { match: /jung|erste eigene/i, cast: "people in their early twenties, first flat of their own, unpolished clothes that have been worn before" },
    { match: /famil/i, cast: "two parents in their thirties and a child of about six, mid-move, nothing staged" },
    { match: /vermieter|eigentüm/i, cast: "a person in their fifties, an owner rather than a tenant, comfortable in the space" },
  ],
  castingDefault: "people in their late twenties to mid thirties, actively looking, dressed for a normal weekday",

  /* THE NEGATIVE LIST. Not present in any source document. Assembled here
     from the agent's own forbidden lists plus the brand rules' AI
     rejection criteria. */
  negative: [
    "text", "letters", "numbers", "words", "captions", "watermark", "logos", "signage",
    "street signs", "number plates", "packaging labels", "screens with type", "pseudo-text",
    "posed stock photography", "staged smiles at camera", "handshakes", "business suits",
    "plastic skin", "retouched skin", "waxy faces", "beauty filter", "airbrushing",
    "symmetrical dead-eyed faces", "warped hands", "extra fingers",
    "illustration", "cartoon", "3D render look", "CGI",
    "colour filters", "colour grading", "duotone", "grayscale", "black and white", "HDR",
    "studio lighting", "softbox", "showroom interior", "staged empty room",
    "American kitchen", "non-European windows", "non-European radiators",
    "identifiable landmarks", "recognisable real people", "other brands",
    "geometric cross", "mathematical plus sign", "flat pasted overlay", "sticker",
    "corner badge", "drop shadow on the plus", "outlined plus",
  ],
};

/* =====================================================================
   2. THE EXTENSION POINT
   agents/imagery/ is where an export of the real ChatGPT agent lands.
   Nothing there is executed: a pack is data that is merged into the
   vocabulary above, and prose is carried as reference for the person,
   never spliced into a prompt. agents/imagery/README.md is the contract.
   ===================================================================== */

/* Merge order is manifest order, later wins for scalars and maps. Lists
   append and de-duplicate unless the pack sets `replace: true`, because
   the common case for an export is "here are eleven more object types",
   not "throw away everything you had". */
export function mergePacks(...packs) {
  /* A shallow copy, deliberately. A structured clone through JSON would
     turn the casting matchers into empty objects and cast every brief to
     the default, silently — the kind of bug that only shows up as
     "everyone in every picture is thirty". Nothing below mutates a
     nested value: every merge replaces a top-level key with a new array
     or a new object, so one level is all that is needed. */
  const out = { ...DEFAULT_PACK };
  const trail = [DEFAULT_PACK.id];
  for (const p of packs) {
    if (!p || typeof p !== "object") continue;
    trail.push(p.id || "unnamed");
    for (const [k, v] of Object.entries(p)) {
      if (k === "id" || k === "label" || k === "note" || k === "replace") continue;
      if (Array.isArray(v)) {
        out[k] = p.replace || !Array.isArray(out[k]) ? v.slice() : dedupe(out[k].concat(v));
      } else if (v && typeof v === "object") {
        out[k] = p.replace ? { ...v } : { ...(out[k] || {}), ...v };
      } else {
        out[k] = v;
      }
    }
  }
  out.trail = trail;
  return out;
}

function dedupe(list) {
  const seen = new Set(), out = [];
  for (const item of list) {
    const key = typeof item === "string" ? item : JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key); out.push(item);
  }
  return out;
}

/* Read the brand rules and whatever is in agents/imagery/. Both are
   optional and both failures are reported rather than swallowed: a
   studio running on the built-in spec because a fetch 404'd should say
   so, not look identical to one running on the real agent's vocabulary. */
export async function loadImageryPacks(fetchFn) {
  const f = fetchFn || (typeof fetch === "function" ? fetch : null);
  const notes = [];
  const packs = [];

  if (!f) return { pack: mergePacks(), notes: ["No fetch available, so the built-in spec is all there is."] };

  /* The brand rules are the authority on which SVGs exist and on the
     immersive object vocabulary. Reading them here is what keeps this
     module from holding a second, drifting copy. */
  try {
    const r = await f("brand/tokens.json");
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    const p = { id: "brand/tokens.json", replace: false };
    if (j.plusses && j.plusses.assets) p.plusAssets = j.plusses.assets;
    if (j.imagery && j.imagery.plus_in_place && j.imagery.plus_in_place.object_types)
      p.objectTypes = j.imagery.plus_in_place.object_types;
    packs.push(p);
  } catch (e) {
    notes.push(`brand/tokens.json could not be read (${e.message}), so the Professionals asset list is this module's own copy of it.`);
  }

  /* A static server cannot be asked what is in a folder, so the folder
     declares itself. No manifest is not an error: it is the state this
     repo is in today, and saying so is more useful than silence. */
  let manifest = null;
  try {
    const r = await f("agents/imagery/index.json");
    if (r.ok) manifest = await r.json();
  } catch (e) { /* handled below by the null check */ }

  if (!manifest) {
    notes.push("No agents/imagery/index.json, so nothing extends the built-in spec. Drop the agent export in that folder and list it there.");
    return { pack: mergePacks(...packs), notes, manifest: null };
  }
  /* An empty manifest is the state this repo ships in. Saying that is not
     the same as saying the folder is missing, and the two want different
     things done about them. */
  if (!(manifest.packs || []).length)
    notes.push("agents/imagery/index.json lists no packs, so the built-in spec is the whole vocabulary. When the agent export arrives, add its JSON files to that list; agents/imagery/README.md has the shape.");

  for (const entry of (manifest.packs || [])) {
    try {
      const r = await f("agents/imagery/" + entry);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      packs.push({ ...j, id: j.id || entry });
    } catch (e) {
      notes.push(`agents/imagery/${entry} is listed in the manifest but could not be read: ${e.message}`);
    }
  }
  /* Prose files are for the person reading the panel. They are never
     spliced into a render prompt: a text-to-image model handed three
     pages of markdown produces worse pictures, not more compliant ones. */
  const reference = (manifest.reference || []).map(x => "agents/imagery/" + x);
  return { pack: mergePacks(...packs), notes, manifest, reference };
}

/* =====================================================================
   3. THE GATE AND THE ROUTE
   ===================================================================== */

/* WHICH ANGLE A CONCEPT IS ON, UNDER EITHER OF ITS TWO NAMES.
   Every angle in the pack has two: the key it is filed under (`typo`,
   `produkt-ui`) and the `category` the Studio's own cards are labelled
   with (`typographic-pattern`, `product-ui-mock`). A concept carries
   whichever one its author had to hand — `angle` when the Studio
   generated it, `visual_category` when a model wrote it or a fixture
   declared it.

   Looking up the key and stopping there is why concept 3 was presented as
   "NO PHOTOGRAPH, BY DESIGN … set typographically" above an imagery brief
   specifying a full photographic scene with people in it. Its
   `visual_category` is "typographic-pattern", `angles["typographic-pattern"]`
   is undefined, the gate fell through to its unknown-angle default, and
   that default is a life-event moment with a couple in a hallway. The
   refusal IS the gate; it is not allowed to depend on which of an angle's
   two names a concept happens to spell it with. */
export function angleOf(concept, pack) {
  const p = pack || DEFAULT_PACK;
  const names = [concept && concept.angle, concept && concept.visual_category].filter(Boolean);
  for (const n of names) if (p.angles[n]) return p.angles[n];
  for (const n of names) {
    const hit = Object.values(p.angles).find(a => a && a.category === n);
    if (hit) return hit;
  }
  return null;
}

/* imagery-agent.md algorithm step 4: a concept whose category is
   typographic-pattern or product-ui-mock carries no photograph at all
   and must not be sent to image generation. Both of those routes exist
   in this Studio, and both are handed a library photo by the ANGLES
   table anyway, which is a contradiction inside the repo rather than a
   rule this module gets to break. The decline names the route and says
   what actually draws it. */
export function imageGate(concept, pack) {
  const a = angleOf(concept, pack);
  if (!a) return { ok: true, kind: "people", category: "life-event-moment", unknown: true };
  if (a.kind === "none") return {
    ok: false, kind: "none", category: a.category,
    reason: a.category === "typographic-pattern"
      ? "This route's own premise is that there is no photograph: the headline is set at scale and the brand elements run off the edge. The imagery spec forbids sending a typographic concept to image generation, so nothing was requested. The layout engine draws this route; a photograph would be fighting it."
      : "This route shows the product mechanism, not a place. The imagery spec keeps product-UI concepts out of image generation because the mechanism is drawn as a solid card by the layout engine, and a generated screen would carry text, which is forbidden in every frame. Nothing was requested.",
  };
  return { ok: true, kind: a.kind, category: a.category };
}

/* WORKFLOW ROUTING. Inferred from the concept's own words first, in both
   languages, because a concept edited by a person is edited in German.
   The spec permits exactly one question when the inference is weak, and
   it dictates its wording, so that is what the panel asks. */
const IMMERSIVE_WORDS = /\b(objekt|raum|möbel|mobel|skulptur|dimensional|physisch|gebaut|regal|tisch|durchgang|3d|object|furniture|sculpture|built|shelving|table|doorway|volume|installation|sit|hold|carry|step through)\b/i;
const SVG_WORDS = /\b(muster|tapete|stoff|teppich|kissen|fliesen|bedruckt|gewebt|flach|original|svg|exakt|unverändert|unverandert|vorlage|pattern|wallpaper|upholstery|rug|carpet|cushion|tile|printed|woven|flat|faithful|exact|unchanged|source file)\b/i;

export function routeWorkflow(concept, pack, override) {
  if (override === "immersive" || override === "original-svg" || override === "combined")
    return { workflow: override, why: "Chosen by hand on the imagery panel.", asked: true };

  const p = pack || DEFAULT_PACK;
  const text = [concept.big_idea, concept.storyline, concept.visual_structure,
                concept.aesthetic, concept.creative_hook].filter(Boolean).join(" ");
  const imm = IMMERSIVE_WORDS.test(text);
  const svg = SVG_WORDS.test(text);

  if (imm && svg) return {
    workflow: "combined",
    why: "The concept asks for both a dimensional Professionals and a faithful flat one, so they are combined deliberately and the original SVG stays visibly distinct from the immersive element.",
    asked: false,
  };
  if (svg) return {
    workflow: "original-svg",
    why: "The concept describes the Professionals as a surface, a pattern or a faithful source-file application, which is what routes a request to Original SVG Professionals.",
    asked: false,
  };
  if (imm) return {
    workflow: "immersive",
    why: "The concept describes the Professionals as an object in the photographed world, which is what routes a request to Immersive Professionals.",
    asked: false,
  };

  const a = p.angles[concept.angle || concept.visual_category];
  return {
    workflow: (a && a.route) || "immersive",
    why: "Neither treatment is named in the concept, so the route defaults to the brand's own hero campaign treatment, plus-in-place. This is the one case the spec allows a single question about: immersive 3D integration or faithful original SVG application?",
    asked: false, weak: true,
  };
}

/* =====================================================================
   4. THE NINE-PART BRIEF
   ===================================================================== */

/* PLUS SELECTION. One teal and one purple always, because the brand
   rules require both accents in every frame and the agent requires a
   minimum of two distinct brand elements. Deterministic on the concept id: the
   same concept asks for the same two files every time, which is what
   keeps a rebuild identical to the build it reopens. */
export function chooseBrandElements({ concept, pack, workflow, hasPeople, count, scope }) {
  const p = pack || DEFAULT_PACK;
  const id = Number(concept.id) || 1;
  const teal = p.plusAssets.teal[(id - 1) % p.plusAssets.teal.length];
  const purple = p.plusAssets.purple[id % p.plusAssets.purple.length];
  const n = clamp(count || 2, 2, 3);
  /* An angle may narrow the vocabulary to what fits its frame — a
     tabletop close-up has nowhere to put a shelving unit. Falls back to
     the whole approved list, which is what every angle used to get. */
  const objects = (scope && scope.objectTypes) || p.objectTypes;
  const surfaces = (scope && scope.svgApplications) || p.svgApplications;

  const immersive = [
    { asset: teal, colour: "teal",
      role: objects[(id - 1) % objects.length],
      belongs: hasPeople
        ? "a person is touching it, resting against it or reaching past it, and no arm of it is hidden by them"
        : "it stands with its own weight, casting a contact shadow where it meets the ground" },
    { asset: purple, colour: "purple",
      role: objects[(id + 2) % objects.length],
      belongs: "it sits further back in the frame, catching the same light, throwing coloured bounce onto the surface beside it" },
    { asset: p.plusAssets.teal[(id + 1) % p.plusAssets.teal.length], colour: "teal",
      role: objects[(id + 4) % objects.length],
      belongs: "it reads as part of the furniture of the place rather than as a third statement" },
  ];

  const flat = [
    { asset: teal, colour: "teal",
      application: surfaces[(id - 1) % surfaces.length],
      belongs: "the motif follows the weave, the folds and the perspective of the material it is printed into, and never sits on top of the photograph" },
    { asset: purple, colour: "purple",
      application: surfaces[(id + 3) % surfaces.length],
      belongs: "a second, smaller application in the same frame, complete motifs only, intentional spacing and rhythm" },
    { asset: p.plusAssets.purple[(id + 1) % p.plusAssets.purple.length], colour: "purple",
      application: surfaces[(id + 5) % surfaces.length],
      belongs: "held back to a low-density repeat so it reads as texture rather than as a third hero" },
  ];

  /* Combined leads with the dimensional teal and answers it with the flat
     purple, so the two-Professionals minimum still carries both accents AND both
     treatments. Ordering it teal-then-teal was the first version, and a
     two-Professionals combined frame then had one accent colour in it, which the
     plus-in-place mandate forbids outright. */
  const list = workflow === "original-svg" ? flat
    : workflow === "combined" ? [immersive[0], flat[1], immersive[1]]
    : immersive;

  return list.slice(0, n).map(x => ({
    ...x,
    colourName: x.colour === "teal" ? "Brand Teal" : "Professionals Blue",
    hex: COLORS[x.colour],
  }));
}

/* THE BRIEF. Nine parts, all data, no strings joined yet. */
export function buildImageryBrief({ brief, concept, pack, workflowOverride, direction, plusCount }) {
  const p = pack || DEFAULT_PACK;
  const b = brief || {};
  const gate = imageGate(concept, p);
  if (!gate.ok) return { ok: false, gate, concept: conceptEcho(concept), version: IMAGERY_VERSION };

  const angle = angleOf(concept, p) || p.angles.lebensmoment;
  const route = {
    workflow: "natural",
    why: "Use supplied Professionals imagery first. If a new photograph is required, create natural B2B photography without an added product symbol.",
    weak: false,
  };

  /* THE GERMAN SETTING. The brief's city when it named one; otherwise a
     plausible one chosen from the brief rather than from the concept, so
     all four concepts in a set share a city and the family holds
     together. The spec says choose and proceed, never ask. */
  const named = (b.city || "").trim();
  const seedText = (b.source_text || "") + "|" + (b.product || "") + "|" + (b.audience || "");
  const cityEntry = named
    ? (p.cities.find(c => c.name.toLowerCase() === named.toLowerCase())
       || { name: named, typology: p.cities[0].typology, street: p.cities[0].street })
    : pick(p.cities, seedText);
  const season = pick(p.seasons, seedText + "|" + concept.id);

  /* Casting is the brief's (who these people are); the angle supplies the
     action (what they are doing). Keeping them apart is what stops a
     twenty-two-year-old audience arriving as "two people in their late
     twenties" because the angle happened to say so. */
  const castRule = p.casting.find(c => c.match && c.match.test(b.audience || ""));
  const cast = angle.people
    ? `${castRule ? castRule.cast : p.castingDefault}; ${angle.people}`
    : null;

  const conflicts = [];

  const nine = {
    ok: true, version: IMAGERY_VERSION, pack: p.id, packTrail: p.trail || [p.id],

    /* 1 */ workflow: route.workflow, workflowWhy: route.why, workflowWeak: !!route.weak,
    /* 2 */ scene: angle.scene, kind: gate.kind, category: gate.category,
            room: angle.room || p.roomDefault, skin: angle.skin !== false,
            direction: (direction || "").trim() || null,
    /* 3 */ setting: {
              city: cityEntry.name, chosen: !named,
              typology: cityEntry.typology, street: cityEntry.street, season,
            },
    /* 4 */ people: cast,
    /* 5 */ plusses: [], conflicts,
    /* 6 */ light: angle.light, camera: angle.camera,
    /* 7, 8, 9 filled in below so they are always derived from 1..6 */
  };

  nine.renderPrompt = renderPromptOf(nine, p);
  nine.negative = negativePromptOf(nine, p);
  nine.productionNote = productionNoteOf(nine);
  nine.concept = conceptEcho(concept);
  return nine;
}

function conceptEcho(c) {
  return {
    id: c.id, name: c.name, angle: c.angle || c.visual_category,
    /* Shown in the panel, never sent. A bilingual prompt is the least
       controlled thing you can hand a text-to-image model, and none of
       this copy can appear in the picture anyway. */
    german: { big_idea: c.big_idea, aesthetic: c.aesthetic, headline_de: c.headline_de },
  };
}

/* =====================================================================
   5. THE PROMPT
   One continuous paragraph. No headings, no bullets, no markdown. Order
   fixed by the spec: subject and scene, then the Professionals integration, then
   light and camera, with the no-text constraint stated inside it.
   ===================================================================== */

export function renderPromptOf(n, pack) {
  const p = pack || DEFAULT_PACK;
  const s = [];

  /* --- subject and scene --------------------------------------------- */
  s.push(`A candid documentary photograph, ${n.setting.season}, in ${n.setting.city}, Germany.`);
  s.push(`The setting is ${n.setting.typology}, unmistakably German: ${n.setting.street}, German fittings and proportions throughout, tilt-and-turn windows, panel radiators under the sills, European sockets and door furniture.`);
  s.push(`The scene is ${n.scene}.`);
  if (n.people) {
    s.push(`In frame: ${n.people}. They are contemporary, inclusive and unposed, caught mid-action and never looking at the camera, and they look happy or relieved — the register of finding a place and getting the keys.`);
    if (n.skin)
      s.push("Skin is rendered at documentary level: visible pores, fine lines, freckles, stray hair, under-eye texture, uneven pigmentation, a credible range of complexions and undertones with no lightening, no smoothing, no gloss and no beauty filter, and equally no exaggerated blemishes or over-sharpened pores.");
    s.push("Everyone in the picture is an invented person who resembles nobody real, and no property, brand or signage in the frame is identifiable.");
  } else {
    s.push("There are no people in this frame; it is an architectural photograph of a real place, and no property or brand in it is identifiable.");
  }
  s.push(n.room);
  if (n.direction) s.push(n.direction.replace(/\s+/g, " ").trim().replace(/([^.!?])$/, "$1."));

  /* Professionals has no standalone product symbol. Brand elements are
     added later in layout, using only the supplied logo and highlighters. */
  s.push("Do not add a product symbol, cross, badge, decorative circle, graphic overlay or invented brand mark. Leave useful negative space at one side for approved copy and logo placement in layout.");

  /* --- light and camera ---------------------------------------------- */
  s.push(`The light is ${n.light.quality}, ${n.light.direction}, with natural shadow and perspective.`);
  s.push(`Shot on ${n.camera.lens} at ${n.camera.aperture}, ${n.camera.dof}, camera at ${n.camera.height}.`);
  s.push("No colour filter, no colour grading, no duotone, no grayscale, no black and white, no HDR, no studio lighting, no impossible light.");

  /* --- the absolute constraint, stated inside the paragraph ----------- */
  s.push("There is absolutely no visible text anywhere in this image: no words, no letters, no numbers, no signage, no number plates, no packaging labels, no screens showing type, no watermark and no pseudo-text of any kind. Nothing that would carry lettering is in frame.");

  /* The API has no negative-prompt field, so the exclusions travel here
     or they do not travel at all. See the header. */
  s.push(`Do not include: ${p.negative.join(", ")}.`);

  return s.join(" ");
}

export function negativePromptOf(n, pack) {
  const p = pack || DEFAULT_PACK;
  const base = p.negative.filter(x => !/plus|cross/i.test(x));
  return dedupe(base.concat(["product symbol", "decorative badge", "decorative circle", "invented brand mark"])).join(", ");
}

export function productionNoteOf(n) {
  return [
    "This file is a photographic base, not finished artwork. Add only the supplied ImmoScout24 logo and approved Professionals highlighters during layout.",
    "Check that the image contains no text, numbers, letterforms, watermarks, third-party logos or invented brand marks.",
    "Mark the asset as AI generated, retain this prompt and follow the platform's disclosure rules.",
    "Nothing here is published without human approval.",
  ].join(" ");
}

/* =====================================================================
   6. WHAT SIZE TO ASK FOR
   The old code asked for 1536x1024 always, which is 3:2 — the one ratio
   the export plan hardcoded as unsalvageable, and the ratio of exactly
   one placement in the whole matrix. The size is now derived from the
   families the plan actually asked for.
   ===================================================================== */

/* THE MODEL, NAMED ONCE IN THIS REPO.
   It was written down in three files and ten places: a browser fallback in
   concept-studio.html, two request builders here, and serve.py's own
   default — so the panel could describe a request to a model the server
   would never send to. serve.py reads this declaration at start-up and
   publishes what it will actually use on GET /api/status; the browser
   prints that and falls back through this one export. */
/* GPT Image 1.5 is the current ImageGPT 2-class renderer selected for this
   Studio. The name is exported so the UI, create route and extension route
   cannot silently use different image models. */
export const IMAGE_MODEL_DEFAULT = "gpt-image-1.5";

/* The image model's documented sizes. UNVERIFIED HERE: there is no key in
   this environment, so this list is from the API documentation and has
   never been exercised against the account that will run it. If the
   model gains a size, add it here and every decision below follows. */
export const API_SIZES = [
  { id: "1024x1024", w: 1024, h: 1024 },
  { id: "1536x1024", w: 1536, h: 1024 },
  { id: "1024x1536", w: 1024, h: 1536 },
];

/* The fraction of a source of aspect `s` that survives a cover-crop to
   aspect `t`. Identical arithmetic to size-adapter's fitAspect, reduced
   to one line because both dimensions cancel. */
export const survival = (s, t) => Math.min(s, t) / Math.max(s, t);

/* ONE FRAME HAS TO SERVE EVERY FAMILY, so the size to ask for is the one
   whose worst family is least bad. Worst-case first because a campaign
   is judged by its weakest file, then the mean as a tie-break. */
export function chooseGenerationSize(families, sizes) {
  const list = (families || []).filter(scorable);
  const cand = (sizes || API_SIZES);
  if (!list.length) return {
    size: cand.find(s => s.id === "1536x1024") || cand[0],
    perFamily: [],
    reason: "No export plan yet, so there is no family to serve. Landscape is the default because six of the eight families in the preset matrix are landscape or square; pick the placements first and this is measured instead.",
    measured: false,
  };

  const scored = cand.map(s => {
    const a = s.w / s.h;
    const per = list.map(f => ({ ratio: f.ratio, survival: survival(a, f.master_w / f.master_h) }));
    const worst = Math.min(...per.map(x => x.survival));
    const mean = per.reduce((n, x) => n + x.survival, 0) / per.length;
    return { s, a, per, worst, mean };
  }).sort((x, y) => (y.worst - x.worst) || (y.mean - x.mean));

  const best = scored[0], runner = scored[1];
  const worstFam = best.per.slice().sort((x, y) => x.survival - y.survival)[0];
  return {
    size: best.s,
    /* WORST FIRST, AND THE HEAD OF THIS LIST IS THE ANSWER TO "WHICH FAMILY
       IS WORST". The imagery panel used to re-sort `sizeCostReport`'s rows
       by its own key and print the result in the same kv block as the
       `reason` sentence below, which names `perFamily[0]` — two answers to
       one question, one after the other, off one plan. A surface that wants
       the pixel detail looks its row up in the cost report BY THIS RATIO
       rather than sorting the report again. */
    perFamily: best.per.sort((x, y) => x.survival - y.survival),
    measured: true,
    reason: `${best.s.id} is the shape that serves this plan best. Across ${countPhrase(list.length, null, "family")} its worst case keeps ${sharePhrase(best.worst, null).text} of the frame, on ${worstFam.ratio}`
      + (runner ? `, against ${sharePhrase(runner.worst, null).text} for ${runner.s.id}.` : ".")
      + ` The image API offers ${cand.map(x => x.id).join(", ")} and nothing else, so no family gets its exact ratio out of the model: the size adapter takes each master out of this frame.`,
  };
}

/* What that choice costs each family, in the adapter's own terms, so the
   panel can say it before anything is generated. */
/* ONE DOMAIN, SHARED WITH THE CHOICE ABOVE. A family declaring a master
   width and no master height is not a family either function can score: it
   has no ratio. `chooseGenerationSize` dropped it and this kept it, so the
   two walked different lists off one plan — and a family with `master_h: 0`
   sorted to the head of this report as the worst, while the sentence beside
   it named a different one. */
const scorable = f => f.master_w > 0 && f.master_h > 0;

export function sizeCostReport(sizeChoice, families) {
  const a = sizeChoice.size.w / sizeChoice.size.h;
  return (families || []).filter(scorable).map(f => {
    const t = f.master_w / f.master_h;
    const keep = survival(a, t);
    /* The largest frame of the family's ratio inside the generated one. */
    const w = a > t ? Math.round(sizeChoice.size.h * t) : sizeChoice.size.w;
    const h = a > t ? sizeChoice.size.h : Math.round(sizeChoice.size.w / t);
    return {
      ratio: f.ratio, keep, w, h,
      declared: `${f.master_w}×${f.master_h}`,
      short: w < f.master_w || h < f.master_h,
      upscale: Math.max(f.master_w / w, f.master_h / h),
    };
  });
}

/* =====================================================================
   7. THE EXTEND PATH
   For a family the size adapter classifies as needing extension: grow the
   canvas past the source edge instead of cropping harder.

   THE PART THAT KEEPS THE PROMISE. Mask adherence on an image edit is
   prompt-shaped, not exact: the model is asked to leave the opaque region
   alone and it mostly does, but "mostly" is not "losing no detail". The
   composite step below is therefore not an optimisation and not a
   nicety. Without it, every extended file has been silently re-rendered
   by a generative model in the region the user believes is their own
   photograph, and "extended without losing detail" is a claim the code
   cannot back. `rect` is the one number both halves depend on: the mask
   is opaque over exactly that rectangle and the original is drawn back
   over exactly that rectangle.
   ===================================================================== */

/* The window, in source pixels, that the extension fills. It is the
   smallest window at the target aspect that still contains the protected
   subject, positioned to overlap the source as much as possible, so the
   invented area is the least this ratio can be built with. Deliberately
   the same window size-adapter's `outside` is measured against, because
   a classifier and an executor that disagree about the same photograph
   is a bug this repo has already paid for once. */
export function extendFrame({ srcW, srcH, subject, aspect }) {
  const box = {
    x0: subject.x0 * srcW, y0: subject.y0 * srcH,
    x1: subject.x1 * srcW, y1: subject.y1 * srcH,
  };
  const win = containWindow(box, aspect);

  /* Per axis: stay inside the source when the window fits (nothing
     invented on that axis), cover the source when it does not, and in
     both cases keep the subject inside. The two intervals always
     intersect — the window is at least as long as the subject by
     construction — so this cannot return a frame that slices it. */
  const seat = (lo, hi, span, size) => {
    const srcLo = span <= size ? 0 : size - span;
    const srcHi = span <= size ? size - span : 0;
    const subLo = hi - span, subHi = lo;
    const low = Math.max(srcLo, subLo), high = Math.min(srcHi, subHi);
    const centred = (lo + hi) / 2 - span / 2;
    return low <= high ? clamp(centred, low, high) : clamp(centred, subLo, subHi);
  };

  const x = seat(box.x0, box.x1, win.w, srcW);
  const y = seat(box.y0, box.y1, win.h, srcH);
  const overlapW = Math.max(0, Math.min(x + win.w, srcW) - Math.max(x, 0));
  const overlapH = Math.max(0, Math.min(y + win.h, srcH) - Math.max(y, 0));
  return {
    x, y, w: win.w, h: win.h,
    margins: {
      left: Math.max(0, -x), top: Math.max(0, -y),
      right: Math.max(0, (x + win.w) - srcW), bottom: Math.max(0, (y + win.h) - srcH),
    },
    outside: 1 - (overlapW * overlapH) / (win.w * win.h),
  };
}

/* Which API size to extend into. It has to move the frame TOWARD the
   family's ratio; a size on the far side of the source would be a
   different crop dressed up as an extension, and is refused by name. */
export function extendTarget(srcAspect, familyAspect, sizes) {
  const cand = sizes || API_SIZES;
  const scored = cand.map(s => ({ s, a: s.w / s.h }))
    .map(x => ({ ...x, d: Math.abs(Math.log(x.a / familyAspect)) }))
    .sort((p, q) => p.d - q.d);
  const best = scored[0];
  const srcD = Math.abs(Math.log(srcAspect / familyAspect));
  if (best.d >= srcD) return {
    ok: false, target: best.s,
    reason: `The image API's closest size to ${familyAspect.toFixed(3)}:1 is ${best.s.id} at ${best.a.toFixed(3)}:1, which is no nearer that ratio than this ${srcAspect.toFixed(3)}:1 photograph already is. Extending into it would move the frame away from the family, not toward it, so nothing is sent.`,
  };
  return {
    ok: true, target: best.s, aspect: best.a,
    reason: `Extending into ${best.s.id} (${best.a.toFixed(3)}:1) moves the frame from ${srcAspect.toFixed(3)}:1 toward the family's ${familyAspect.toFixed(3)}:1. It does not reach it — the API offers no size at that ratio — so the size adapter still takes the master out of the extended frame, from a much better shape than it had.`,
  };
}

/* Where the original lands on the target canvas, to the pixel. Rounded
   once, here, so the mask and the composite cannot disagree by a pixel:
   both read this rect. */
export function extendPlacement({ frame, srcW, srcH, target }) {
  const scale = target.w / frame.w;
  const px = (0 - frame.x) * scale, py = (0 - frame.y) * scale;
  const x0 = clamp(Math.round(px), 0, target.w);
  const y0 = clamp(Math.round(py), 0, target.h);
  const x1 = clamp(Math.round(px + srcW * scale), 0, target.w);
  const y1 = clamp(Math.round(py + srcH * scale), 0, target.h);
  const rect = { x: x0, y: y0, w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0) };
  const covered = rect.w * rect.h;
  return {
    rect, scale, target,
    margins: {
      left: rect.x, top: rect.y,
      right: target.w - (rect.x + rect.w), bottom: target.h - (rect.y + rect.h),
    },
    invented: 1 - covered / (target.w * target.h),
    /* A scale over 1 means the source is being enlarged into the canvas
       before a single generated pixel exists. Reported, never hidden. */
    upscale: scale,
    nothingToDo: rect.x === 0 && rect.y === 0 && rect.w === target.w && rect.h === target.h,
  };
}

/* THE MASK, as raw RGBA. Transparent where the model must paint, opaque
   over the original. Built as bytes rather than with canvas calls so the
   shipped mask is the tested mask: `node --test` can assert per pixel
   that the alpha is 0 in the margin and 255 over the photograph, which
   a fillRect on a canvas context could never be asked in Node. */
export function maskBytes(W, H, rect) {
  const out = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    const inY = y >= rect.y && y < rect.y + rect.h;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const keep = inY && x >= rect.x && x < rect.x + rect.w;
      out[i] = out[i + 1] = out[i + 2] = 0;
      out[i + 3] = keep ? 255 : 0;
    }
  }
  return out;
}

/* The whole extend decision for one family, with no canvas involved, so
   the panel can show it and a test can check it. */
export function planExtend({ srcW, srcH, subject, familyAspect, sizes }) {
  const srcAspect = srcW / srcH;
  const t = extendTarget(srcAspect, familyAspect, sizes);
  if (!t.ok) return { ok: false, reason: t.reason };
  const frame = extendFrame({ srcW, srcH, subject, aspect: t.aspect });
  const place = extendPlacement({ frame, srcW, srcH, target: t.target });
  if (place.nothingToDo) return {
    ok: false,
    reason: `At ${t.target.id} the photograph already fills the canvas, so there is no margin to invent and nothing to send.`,
  };
  return {
    ok: true, target: t.target, aspect: t.aspect, targetReason: t.reason,
    frame, ...place,
    summary: `${sharePhrase(place.invented, null).text} of the ${t.target.id} canvas is invented: ${place.margins.top}px above, ${place.margins.bottom}px below, ${place.margins.left}px left, ${place.margins.right}px right of the original, which sits at ${place.rect.x},${place.rect.y} at ${place.rect.w}×${place.rect.h}. The original is composited back over exactly that rectangle after the model answers, so those pixels are yours and not a regeneration of them.`,
  };
}

/* The prompt for an extension. It is not the render prompt: the picture
   already exists and the model is only being asked to continue it. */
export function extendPromptOf(n) {
  const s = [
    "Continue this photograph outward into the transparent area so the result reads as one single frame taken with a wider lens.",
    `The scene is ${n.scene || "a real German interior"} in ${n.setting.city}, Germany: ${n.setting.typology}.`,
    "Match the existing perspective, vanishing lines, focal length, depth of field, grain, white balance and light direction exactly. Continue the floor, the walls, the ceiling and the furniture that are already cut off at the edge.",
    "Do not add a person, do not add a new Professionals shape, and do not change anything inside the opaque area.",
    "There is absolutely no visible text anywhere: no words, letters, numbers, signage, number plates or watermark.",
    "The extension is German architecture throughout: tilt-and-turn windows, panel radiators, European sockets and door furniture. No American kitchen, no non-European window or radiator details, no identifiable landmark.",
  ];
  return s.join(" ");
}

/* =====================================================================
   8. THE REQUEST, DESCRIBED
   Exactly what would be sent, whether or not there is a key to send it
   with. This is the object the keyless path shows, and the object the
   keyed path records beside the asset.
   ===================================================================== */
export function describeRequest({ nine, sizeChoice, model, viaServer }) {
  return {
    what: "image generation",
    endpoint: viaServer ? "POST /api/image → {base}/images/generations" : "POST https://api.openai.com/v1/images/generations",
    model: model || IMAGE_MODEL_DEFAULT,
    body: { model: model || IMAGE_MODEL_DEFAULT, prompt: nine.renderPrompt, n: 1, size: sizeChoice.size.id },
    sizeReason: sizeChoice.reason,
    negativeNote: "The API has no negative-prompt field, so the exclusion list is the final sentence of the prompt above. It is kept separately as well, for a model that does take one.",
    negative: nine.negative,
    productionNote: nine.productionNote,
    promptChars: nine.renderPrompt.length,
  };
}

export function describeExtendRequest({ plan, prompt, model, viaServer }) {
  return {
    what: "image extension",
    endpoint: viaServer ? "POST /api/image/extend → {base}/images/edits" : "not available without the local server: /images/edits is multipart, and the browser-direct path only ever spoke JSON to /images/generations",
    model: model || IMAGE_MODEL_DEFAULT,
    body: { model: model || IMAGE_MODEL_DEFAULT, prompt, n: 1, size: plan.target.id, image: "<the padded PNG>", mask: "<the mask PNG>" },
    geometry: plan.summary,
    composite: `After the response, the original is drawn back at ${plan.rect.x},${plan.rect.y} at ${plan.rect.w}×${plan.rect.h}. Mask adherence is not exact, so without this step the middle of the picture is a regeneration rather than the photograph.`,
  };
}

/* =====================================================================
   9. THE BROWSER SIDE
   Everything below needs a canvas. Nothing above does.
   ===================================================================== */

/* The padded source and its mask, both at the target size, both PNG data
   URIs. The padded canvas is filled with the original where the rect is
   and left transparent elsewhere; the model sees the photograph and the
   hole it has to fill in the same file. */
export function buildExtendInputs(img, plan) {
  const { target, rect } = plan;

  const base = document.createElement("canvas");
  base.width = target.w; base.height = target.h;
  const bx = base.getContext("2d");
  bx.imageSmoothingQuality = "high";
  bx.clearRect(0, 0, target.w, target.h);
  bx.drawImage(img, 0, 0, img.width, img.height, rect.x, rect.y, rect.w, rect.h);

  const mask = document.createElement("canvas");
  mask.width = target.w; mask.height = target.h;
  mask.getContext("2d").putImageData(new ImageData(maskBytes(target.w, target.h, rect), target.w, target.h), 0, 0);

  return { image: base.toDataURL("image/png"), mask: mask.toDataURL("image/png"), baseCanvas: base };
}

/* THE COMPOSITE. Draw what came back, then draw the original straight
   over its own rectangle. Nothing feathers into the seam on purpose: a
   feather inside the original would be overwritten by this draw a
   moment later, so it would be a blend the code immediately undoes. Any
   visible join is a real finding for the human reviewer, and hiding it
   under a gradient would be hiding it. */
export function compositeExtended(returnedImg, sourceImg, plan) {
  const { target, rect } = plan;
  const c = document.createElement("canvas");
  c.width = target.w; c.height = target.h;
  const x = c.getContext("2d");
  x.imageSmoothingQuality = "high";
  x.drawImage(returnedImg, 0, 0, target.w, target.h);
  x.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height, rect.x, rect.y, rect.w, rect.h);
  return c;
}
