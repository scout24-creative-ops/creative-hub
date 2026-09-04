# Build plan — Professionals Studio

Sequence for `src/`. Exact values live in `brand/tokens.json`; practical
application rules live in `brand/notes.md`; sourcing and conflicts live in
`docs/brandsources.md`. This file records the sequence and decisions, not
new brand values.

## Open questions (must be resolved before the affected step is final)

1. **Teal production hex** — `#3DF5DC` vs `#00FFD0` conflict between the
   two supplied Figma sources. Blocks any screen that needs a brand accent
   colour beyond the neutral tokens already confirmed.
2. **Blue and Sand hex values** — named in `docs/brief.md` as part of the
   B2B Professionals palette, but no source supplies exact values. Blocks
   the same screens as above.
3. **Professionals vs Agent journey scope** — unclear whether the Agent
   journey's palette, imagery and highlighter package is the approved
   Professionals system. Blocks imagery and highlighter rules everywhere.
4. **Typography beyond the one headline token** — family choice (Make It
   Better vs Make It Sans), full type scale, line-height, fallback stack.
   Blocks any body copy, CTA text or secondary type element.
5. **Logo rules beyond the single `A4-3` example** — clear space, minimum
   size, colour variants, placement on other formats. Blocks logo
   placement on `formats.html`'s three unapproved ratios.
6. **Highlighter eligibility** — which asset(s) apply to Professionals,
   and when a highlighter is mandatory, optional or prohibited. Blocks
   the highlighter option in `conceptstudio.html`'s direction step.
7. **Approved image library** — persona eligibility, treatment, gradients,
   AI-image policy. Blocks the "I have one" / "I need one" imagery choice
   from ever resolving to a real library.
8. **Exact formats and safe zones** — export pixels and safe-zone
   coordinates for 9:16, 16:9, 1:1 and 4:5. Blocks `formats.html` from
   ever marking a ratio as approved, and blocks the safe-zone check on
   `assets.html`.
9. **CTA library and mandatory legal copy** — no approved CTA options or
   legal/disclaimer token exists. Blocks the CTA field and the mandatory
   legal content check on `assets.html`.
10. **A real approved Professionals social example** — every source so
    far is a brand cheat-sheet slide, not a signed-off template. Blocks
    calling any screen "final" rather than a draft against reference
    material.

Until these are resolved, every step below stays a working draft that
visibly defers to a designer wherever a question above applies.

## Steps

### 1. `index.html`

- **Purpose:** Entry point. Orient a new user to what the Studio is and
  where to go.
- **User action:** Read the one-sentence purpose and three-step
  explainer, then choose Start Studio or Brand Guidelines.
- **Visible result:** Studio name, purpose sentence, three numbered
  steps, two links (`formats.html`/`conceptstudio.html` entry and
  `brand.html`).
- **Source files:** `docs/goal.md` (vision line), `docs/brief.md`
  (three-step summary), `brand/tokens.json` (colour/type/spacing tokens
  only — no invented values).
- **Test:** Load the page; confirm both links resolve and no colour/font
  appears that isn't a named token.

### 2. `brand.html`

- **Purpose:** Read-only reference so a marketer can check a rule without
  asking a designer.
- **User action:** Read; no input taken.
- **Visible result:** Approved `A4-3` tokens (colour, typography, logo,
  image treatment, allowed layout, prohibited choices, human approval
  check) plus a clearly separated "not yet approved" list.
- **Source files:** `brand/tokens.json`, `brand/notes.md`.
- **Test:** Every value shown traces to a named token; every `TO CONFIRM`
  item from `brand/tokens.json` appears in the "not yet approved" block
  and nowhere else on the page.

### 3. `formats.html`

- **Purpose:** Capture placement and ratio before any content is
  written, since they determine which safe-zone and template rules apply.
- **User action:** Pick a placement (Feed / Story-Reel) and a ratio
  (9:16, 16:9, 1:1, 4:5).
- **Visible result:** Selection stored; a standing note that no ratio yet
  has an approved template (open question 8); a safe-zone note appears
  only for Story/Reel.
- **Source files:** `docs/brief.md` (required formats, safe-zone
  requirement), `brand/tokens.json` (`format.a4_3`, marked as the only
  approved example).
- **Test:** Each of the 8 placement/ratio combinations is selectable;
  the safe-zone note toggles correctly; the choice survives navigation
  into `conceptstudio.html`.

### 4. `conceptstudio.html`

- **Purpose:** Turn the brief into a locked-template asset request
  without letting the marketer touch a brand-critical property.
- **User action:** Fill in headline, campaign details and CTA; answer
  three clarification questions (safe zone, imagery source, emphasis
  word); pick one of three headline directions; confirm.
- **Visible result:** A pre-filled brief (from step 3), a clarification
  screen, three direction previews using the same locked template and
  tokens, then a full summary before sending.
- **Source files:** `docs/brief.md` (proposed workflow steps 1–3,
  marketer-editable fields), `brand/notes.md` (headline hierarchy,
  emphasis rule), `brand/tokens.json` (headline typography/colour
  tokens).
- **Test:** Format/placement pre-fill correctly from `formats.html`;
  each direction preview reflects the entered headline and emphasis word;
  the confirm screen's summary matches every field entered; the request
  reaches `assets.html` intact.

### 5. `assets.html`

- **Purpose:** Make the automated-check outcome visible before anything
  can be treated as final, and gate export on it.
- **User action:** Review the preview and summary; read each check;
  attempt Download only once all checks pass.
- **Visible result:** A reference preview of the chosen direction on the
  locked template; six checks (colour, typography, layout/export
  dimensions, imagery, safe zone, mandatory legal content), each showing
  pass or a specific pending reason; Download disabled while any check is
  pending.
- **Source files:** `docs/brief.md` (automated blocking conditions),
  `brand/tokens.json` (confirmed tokens used in the pass checks),
  open questions 6–9 (why layout/imagery/safe-zone/legal checks are
  pending rather than passed).
- **Test:** With a complete, Feed-placement, has-image request, only the
  layout/dimensions and mandatory-legal-content checks show pending
  (since no ratio and no legal token is approved); with a Story/Reel,
  needs-image request, safe zone and imagery also show pending; Download
  stays disabled in every case until that changes.

## Next up (not yet built)

- Designer escalation view — where a pending check or new-format request
  actually lands.
- Real validation pipeline behind the `assets.html` checks.
- Approved templates for the remaining three Meta ratios, once open
  question 8 is resolved.
