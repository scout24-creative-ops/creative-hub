/* =====================================================================
   WHICH PLACEMENTS A SENTENCE ASKS FOR, AND WHICH IT REFUSES.

   THIS USED TO ADD THE THING YOU ASKED IT TO LEAVE OUT.
   It was one substring test per platform against the whole sentence, so
   „Meta Feed and Stories & Reels only, no TikTok" built the plan WITH
   TikTok: the word is in the sentence, and nothing ever looked at what sat
   in front of it. Only „Meta Feed, Stories & Reels" produced the intended
   plan, and the sentence that named TikTok in order to refuse it produced
   the opposite of itself without a word of warning.

   Of the two honest ways out — read a negation properly, or stop reading
   prose and say so — this takes the first, because the second leaves the
   substring match in place and a sentence that means "not TikTok" would
   still add TikTok. A cue (no, not, without, except, ohne, kein …) opens a
   span that runs to the next clause boundary, and a placement named inside
   that span is read OUT rather than in.

   It still does not pretend to be a language model, and that is the second
   half of the fix: what it understood is said on screen, both halves of it,
   before the plan is built.

   WHY THE NAMES ARE FOUND BEFORE THE CLAUSE BOUNDARIES.
   The first version scanned the raw sentence for boundaries, and exactly
   one of the ten placement names contains a word that scan treats as a
   boundary: "Professionals display set". In "no Professionals display set" the refusal span
   opened at index 0, closed on the word "Professionals" at index 3, the name also
   started at index 3, and the set the sentence existed to refuse was
   added. It survived a whole pass over the negation parser because it is
   the only one of the ten that collides.

   Deleting `plus` from the boundary list would fix that one name and leave
   the next collision to be found by a user: "and", "und", "but" and every
   punctuation mark are all live inside a placement name somebody may add
   later. So the names are located FIRST and their spans are masked out of
   the boundary scan. A boundary word sitting inside a placement name is
   part of the name, whatever the name is, and adding an eleventh name
   cannot silently reintroduce this. qa/placement-parser.test.mjs walks all
   ten under "no X", "without X" and "except X" so that stays true.
   ===================================================================== */

export const PLATFORM_CHOICES = [
  { id: "meta",        label: "Meta Feed",           hint: "Facebook + Instagram feed and carousel" },
  { id: "stories",     label: "Meta Stories & Reels", hint: "9:16 with published UI safe zone" },
  { id: "tiktok",      label: "TikTok",               hint: "Vertical video keyframe; template safe zone", availability: "coming_soon" },
  { id: "youtube",     label: "YouTube",              hint: "In-feed, Shorts and video keyframes", availability: "coming_soon" },
  { id: "linkedin",    label: "LinkedIn",             hint: "Single image, carousel and video keyframe" },
  { id: "pinterest",   label: "Pinterest",            hint: "Pins, carousel and full-screen" },
  { id: "snapchat",    label: "Snapchat",             hint: "9:16 with UI safe zone" },
  { id: "reddit",      label: "Reddit",               hint: "Mobile, desktop and conversation crops" },
  { id: "x",           label: "X",                    hint: "Standalone, cards and expanded ratios" },
  { id: "demandgen",   label: "Google Demand Gen",    hint: "YouTube, Discover and Gmail images" },
  { id: "gdn",         label: "Google Display",       hint: "Responsive images + uploaded banners" },
  { id: "microsoft",   label: "Microsoft Audience",   hint: "Responsive native image assets" },
  { id: "amazon",      label: "Amazon Ads",           hint: "Commerce, Stores and CTV keyframe" },
  { id: "spotify",     label: "Spotify",              hint: "Companion, carousel, display and keyframes" },
  { id: "twitch",      label: "Twitch",               hint: "Stream display and video keyframe", availability: "coming_soon" },
  { id: "taboola",     label: "Taboola",              hint: "Native thumbnails built for re-cropping" },
  { id: "outbrain",    label: "Outbrain",             hint: "Standard native + carousel" },
  { id: "moloco",      label: "Moloco",               hint: "Mobile-app image inventory" },
  { id: "criteo",      label: "Criteo",               hint: "Four sizes cover about 90% of inventory" },
  { id: "openweb",     label: "Open Web / IAB",       hint: "DSP and publisher-standard display set" },
  { id: "lp",          label: "Landing page",         hint: "Responsive desktop + mobile heroes" },
  { id: "email",       label: "Email",                hint: "Retina header with images-off fallback" },
  { id: "plusads",     label: "Professionals display set",     hint: "Project-specific 4:3 ladder" },
];

const NEGATION_CUE = /\b(no|not|without|except|excluding|exclude|minus|drop|skip|ohne|kein|keine|nicht)\b/g;
const CLAUSE_END = /[,;.:!?–—]|\band\b|\bbut\b|\bplus\b|\bund\b/g;

/* Every occurrence of every placement name in the sentence, by id and by
   label, sorted by where it starts. One list, used for two questions —
   "was this placement named?" and "is this character part of a name?" —
   so the two can never disagree about where a name is. */
export function placementSpans(text) {
  const t = String(text || "").toLowerCase();
  const spans = [];
  const labels = PLATFORM_CHOICES.flatMap(p => [{ p, term: p.label.toLowerCase() }]);
  const labelMatches = [];
  for (const { p, term } of labels) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "g");
    for (let m; (m = re.exec(t)); ) labelMatches.push({ choice: p, start: m.index, end: m.index + term.length });
  }
  spans.push(...labelMatches);
  for (const p of PLATFORM_CHOICES) {
    for (const term of [p.id.toLowerCase()]) {
      if (!term) continue;
      /* IDs such as `x` must not match inside "export" or "except". Names
         are tokens, not arbitrary substrings; labels with punctuation still
         match because the boundary is only enforced at their outer edges. */
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "g");
      for (let m; (m = re.exec(t)); ) {
        const insideLabel = labelMatches.some(s => m.index >= s.start && m.index < s.end);
        if (!insideLabel) spans.push({ choice: p, start: m.index, end: m.index + term.length });
      }
    }
  }
  return spans.sort((a, b) => a.start - b.start || b.end - a.end);
}

export function readPlacements(text) {
  const t = String(text || "").toLowerCase();
  const named = placementSpans(t);
  const insideName = i => named.some(s => i >= s.start && i < s.end);

  /* How far each refusal reaches. A cue owns everything up to the next
     clause boundary that is not itself inside a placement name, which is
     what makes „Meta, no TikTok, and Google Display" keep Google Display
     AND „no Professionals display set" drop the Professionals display set. */
  const spans = [];
  NEGATION_CUE.lastIndex = 0;
  for (let m; (m = NEGATION_CUE.exec(t)); ) {
    if (insideName(m.index)) continue;
    CLAUSE_END.lastIndex = m.index + m[0].length;
    let end = t.length;
    for (let b; (b = CLAUSE_END.exec(t)); ) {
      if (insideName(b.index)) continue;
      end = b.index;
      break;
    }
    spans.push([m.index, end]);
  }
  const negated = i => spans.some(([a, b]) => i >= a && i < b);

  const wanted = [], excluded = [];
  for (const p of PLATFORM_CHOICES) {
    let asked = false, refused = false;
    for (const s of named) {
      if (s.choice !== p) continue;
      if (negated(s.start)) refused = true; else asked = true;
    }
    /* Named both ways in one sentence is a contradiction, not an
       instruction. The refusal wins, because adding something that was
       explicitly refused is the failure this exists to stop, and the
       notice on screen says it happened. */
    if (refused) excluded.push(p);
    else if (asked) wanted.push(p);
  }
  return { wanted, excluded };
}
