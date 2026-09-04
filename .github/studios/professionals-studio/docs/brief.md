# B2B Social Asset Automation Brief

## User

A B2B marketer at ImmoScout24 who needs one standard social asset for a
Meta placement, without opening a Creative Studio ticket or working
outside the brand in Canva.

## Main action

Produce one on-brand, placement-ready social asset — from entering a
brief through to a checked, reviewable output — without a designer
touching it, unless a check fails or the request falls outside what the
system currently supports.

## Inputs

### Required

| Field | What it is | Supplied by | Source | If missing |
|---|---|---|---|---|
| Placement | Feed, or Story/Reel | Marketer | `docs/brief.md` formats/channels requirement | Cannot determine safe-zone rules — block continue |
| Ratio | 9:16, 16:9, 1:1 or 4:5 | Marketer | `docs/brief.md` formats/channels requirement | Cannot route to a template — block continue |
| Headline | One concise, benefit-led sentence | Marketer | `brand/notes.md` — "Lead with one concise, benefit-led headline" | No primary content exists — block continue |
| Emphasis word or phrase | The exact word/phrase from the headline to receive the emphasis colour | Marketer | `brand/notes.md` — "Use `color.text.emphasis` only for the deliberately emphasised word" | Render the headline with no emphasis applied — never guess which word |
| Image | An approved image, or an explicit flag that one is needed from the library | Marketer (selection) or Creative Studio (library — not yet built) | `docs/brief.md` — "Images from an approved library"; `brand/notes.md` — "approved professional/person imagery only" | Request cannot proceed past review — shown as a pending check, not skipped |
| CTA wording | Text for the call to action | Marketer, chosen from an approved CTA list | `docs/brief.md` — "Approved CTA wording" | **No approved CTA list exists yet** (see `docs/brandsources.md` open question 9) — field is collected as free text but always shown as pending until a list exists |

### Optional

| Field | What it is | Supplied by | Source | If missing |
|---|---|---|---|---|
| Campaign details | Dates, locations, statistics, campaign name | Marketer | `docs/brief.md` — "Campaign information, dates, locations and statistics" | Field is simply left blank; nothing is inferred |

## Output

- `src/formats.html` — recorded placement and ratio.
- `src/conceptstudio.html` — a completed brief plus one chosen headline
  direction.
- `src/assets.html` — a reference preview of that direction on the
  approved `A4-3` layout, a check report against the Required inputs
  above and the locked brand rules, and a Download control that only
  activates once every check passes.

No exported production file exists yet — see Not included.

## Rules

- Every colour, font, size and spacing value shown or applied must come
  from a named token in `brand/tokens.json`. No raw values.
- Apply `brand/notes.md` exactly: one dominant headline, emphasis on the
  named word only, approved imagery with the dark lower-image gradient,
  the `A4-3` logo placement, no invented layout or corner radius.
- Anything marked `TO CONFIRM` in `brand/tokens.json` — Teal, Blue, Sand,
  formats beyond `A4-3`, logo clear space, CTA/body type scale — is not
  approved. The interface must show these as pending, never as a pass.

## Human approval

- **Creative Studio designer** approves final export, per `brand/notes.md`'s
  human approval check: confirms approved image, `logo.asset`, the
  applicable typography and colour tokens, the confirmed layout for the
  format, and highlighter treatment where used.
- **The system** may only auto-approve once every Required input above is
  present and every check in `assets.html` passes. Today that combination
  cannot occur, because no ratio has an approved template and no CTA or
  legal-content token exists — so every request currently routes to a
  designer.
- **The marketer** decides content within the Required/Optional fields
  above and nothing else — they cannot resolve a pending check themselves.

## Not included (first version limits)

- No approved production template for 9:16, 16:9, 1:1 or 4:5 — only the
  `A4-3` reference example is approved, and it isn't confirmed to match
  any of these ratios.
- No approved CTA list or mandatory legal-content token.
- No approved image library — image selection is marketer-supplied only.
- No real export pipeline — Download is a locked placeholder.
- No automated validation beyond the structural checks in `assets.html`
  (colour, typography, layout, imagery, safe zone, mandatory content) —
  no accessibility, legal-claims or content-quality check.
