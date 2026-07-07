# COSMA Design System (ImmoScout24)

A design-system extract of **COSMA**, the shared web-component library that powers
the [ImmobilienScout24](https://www.immobilienscout24.de/) family of products from
Scout24. COSMA ships as the npm package `@is24/corecss` plus design tokens at
`@is24/cosma-design-tokens`, and is consumed by every IS24 product surface —
search, expose-detail pages, listing publication, the agent CRM, financing
calculators, the moving planner, and so on.

> ImmobilienScout24 is Germany's largest real-estate marketplace. The brand
> sits inside the larger **Scout24** group; the codebase is also referred to by
> the legacy name `is24-corecss`.

---

## Sources used to build this design system

| Asset | Where | Notes |
| --- | --- | --- |
| Frontend monorepo | `frontend-core-master/` (locally attached) | Public mirror: <https://github.com/Scout24/frontend-core> |
| Component sources | `frontend-core-master/src/main/js/components/` | 60+ React components |
| LESS variables | `frontend-core-master/src/main/less/_variables/` | colors, type, spacing, borders |
| Web fonts | `frontend-core-master/src/main/font/vendor/{make-it-better,make-it-sans,is24-icons}` | copied into `./fonts/` |
| Public Storybook | <https://scout24.github.io/frontend-core/> | live docs the team publishes |
| AGENTS.md (root + per-folder) | various | repo's own agent guidelines |
| Storybook design-token stories | `src/main/documentation/tokens/*.stories.tsx` | reflects canonical tokens |

> **Heads up — missing dependency:** the canonical CSS-variable definitions
> live in the npm package `@is24/cosma-design-tokens` (pinned to `1.1.5`). That
> package was not present in the local checkout (no `node_modules`), so the
> semantic tokens in `colors_and_type.css` are interpolated from the LESS
> primitives plus the way they're used in component CSS (notably
> `RealEstateCard/styles.less` and `ButtonRounded/styles.less`). Bring in the
> real token file when available — a couple of values may shift.

---

## Index

| File | What it is |
| --- | --- |
| `README.md` | You are here. |
| `SKILL.md` | Compact, agent-invocable skill description. |
| `DESIGN-cosma.md` | **Main guideline document.** Component usage catalogue, layout rules, accessibility, responsive behavior, typography voice, brand fundamentals. |
| `FIGMA_MAKE_GUIDELINES.md` | Figma Make specifications. Components, templates, dimensions, states, copy rules. |
| `COSMA.md` | Quick-start templates table + iconography hard rules. |
| `colors_and_type.css` | All design tokens — palette, semantic colors, fonts, spacing, radius, shadows. Just import this. |
| `fonts/` | The four COSMA web-font families + the `IS24Icons` icon font. |
| `fonts/is24-icons.css` | Icon-font class CSS. ~200 glyphs. |
| `assets/` | Logos and brand artwork — official ImmoScout24 horizontal + vertical SVG lockups. |
| `preview/` | Small HTML "cards" rendered into the Design System tab. |
| `ui_kits/immoscout24/` | High-fidelity recreations of IS24 product screens (search, exposé, dashboard). |
| `mobile-bottom-nav.css` | **Mobile bottom navbar component.** Fixed palm navigation: 96px shell (62px nav + 34px home bar), 5 equal items (Suchen · Meine Immos · Inserieren · Nachrichten · HeyImmo). HeyImmo is a button that opens the AI assistant overlay. |
| `heyimmo-modal.css` | **HeyImmo AI assistant modal styling.** Overlay with header aura gradient, sparkle mark, scrollable chat, sticky composer. Pairs with `HeyImmo Mobile Template.html`. |
| `HeyImmo Mobile Template.html` | **Template + working prototype.** Complete palm page with mobile bottom navbar + interactive HeyImmo assistant modal. Start state, user/assistant messages, loading, composer with attachment/voice (placeholder until glyphs ship). |
| `preview/components-mobile-bottom-nav.html` | **Component card.** Two demo stages (navbar with Suchen active, navbar with Inserieren active). Design System tab → Components group. |
| `frontend-core-master/` | The raw codebase you attached (read-only). |

---

## Content fundamentals

COSMA itself is a component library — its public copy is short and
infrastructural. The product copy that lives **on top of** COSMA (the IS24
website + apps it dresses) is what you should mimic for any new IS24 design.

**Language.** German first. All product copy in IS24 surfaces is German;
English copy only appears in dev/docs context (Storybook, GitHub). Component
APIs are US English; default `aria-label` fallbacks are German (see AGENTS.md:
*"default that copy to German unless the task explicitly requires another
localization contract."*).

**Pronoun + tone.**
- Du-form (informal "you") is used in modern product surfaces and marketing,
  with occasional Sie-form on more formal/finance content. Lean Du.
- Friendly, helpful, and matter-of-fact. Real-estate is a high-stakes
  purchase — copy is reassuring but never gimmicky.
- Verbs and noun phrases over full sentences in UI chrome: "Mieten", "Kaufen",
  "Inserate verwalten", "Finanzierung berechnen". Short. Direct.

**Casing.** Sentence case for buttons and headings ("Jetzt Wunschimmobilie
finden"). German nouns are always capitalised, of course. **Avoid ALL CAPS.**
**Avoid Title Case** (it looks Anglo and ugly in German).

**Numbers + formatting.** German conventions throughout:
- `1.250.000 €` (period thousands, trailing € with non-breaking space).
- `120 m²`, `4,5 Zimmer` (comma decimal).
- "Kaltmiete", "Warmmiete", "Provisionsfrei" — domain vocabulary; don't
  invent English equivalents.

**Emoji.** **No.** COSMA does not use emoji as iconography or in product
copy. The `IS24Icons` font + SVG iconography cover every visual need.

**Voice examples (real, paraphrased from IS24 surfaces):**
- "Finde dein neues Zuhause" — find your new home (homepage hero)
- "Wir haben passende Immobilien für dich gefunden" — soft, personal results header
- "Anfrage senden" — primary CTA. Verbs, not "Click here".
- "Du erhältst keine Werbung" — reassurance in form footer
- "Provisionsfrei für Käufer" — flag/badge copy. One line.

**Tone don'ts.** No exclamation marks unless celebrating. No marketing fluff
(no "amazing", "stunning"). No second-guessing the user ("Are you sure?
Really?"). Forms are short. Errors are factual ("Bitte gib eine gültige
E-Mail-Adresse ein").

---

## Visual foundations

### Brand color

COSMA ships **two themes**:

- **`theme-cosma` (the current brand, default).** Primary is **bright teal
  `#00ffd0`** (`--teal-200`). Text is the near-black `#333333` (`--gray-1000`).
  Primary buttons are **charcoal-on-white**, with teal reserved as a brand
  accent on chips/badges/illustrations.
- **`theme-core` (legacy).** Orange `#ff6600` + blue. Still supported for
  back-compat. New work targets `theme-cosma`.

Validation/state colors are: green (positive), red (error), orange (warning),
blue (info). All have a `-light` companion for surface fills.

### Typography

- **`Make It Better`** is the primary brand typeface (sans). 4 weights:
  100 Light, 400 Regular, 700 Bold, 800 XBold. Used for **both** headlines and
  body in `theme-cosma`.
- **`Open Sans`** is the legacy typeface used in `theme-core` and a fallback
  stack everywhere.

Sizes are scaled on a 4-step scale (`xsmall → xlarge`) for headings and a
3-step scale (`small → large`) for body. Mobile sizes are smaller; lap-and-up
viewports promote `xlarge` headings from 32px → 48px. Use the `font-*-*`
helper classes in `colors_and_type.css` — they map 1:1 onto the canonical
Storybook tokens.

### Spacing & rhythm

8-px–based scale rebased on 4: `2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48
· 64 · 80`. The codebase exposes these as `var(--spacing-100)` through
`--spacing-1100`. Mobile (`palm`) and desktop (`lap-and-up`) have separate
token tables — desktop is slightly larger, mobile slightly tighter, but most
component spacing is identical across both.

### Corners

- Buttons (modern, "Rounded"): **`999px`** (`--border-radius-rounded`) — fully circular ends.
- Cards: **`16px`** (`--border-radius-400`).
- Inputs / small chips: **`8px`** (`--border-radius-200`) or **`4px`** (`--border-radius-100`).
- Hero / oversized surfaces: **`40px`** (`--border-radius-1000`).
- Token scale: `50 · 100 · 200 · 300 · 400 · 600 · 1000` + `rounded` (2 · 4 · 8 · 12 · 16 · 24 · 40 · 999 px).
- Sharp corners (`0px`) only on mobile-edge layouts (full-bleed banners).

### Maps

Whenever a design needs a map / location / search-on-map surface, use the
**Map template** (`Map Template.html` → `assets/map-desktop.svg` 595×600 and
`assets/map-mobile.svg` 328×600). **Never hand-draw a map** or pull in an
external map library for a mock. The template carries the canonical treatment:
16px corner radius, a branded teal location pin, a white address label with a
dismiss `×`, a floating pill control bottom-center (Map / Satellite), and
zoom + layer controls top-right. Drop the SVG in as an `<img>` (or inline it)
and overlay your own pins/cards on top as needed.

### Backgrounds & imagery

- The default surface is **plain white**. No noise, no patterns, no
  gradients (the design rejects "bluish-purple gradient" tropes — primary
  surfaces are pure flat color).
- Hero/marketing surfaces use **full-bleed property photography** — warm,
  natural-light interiors and exteriors. No filters, no grain, no B&W.
- The teal brand color appears as **solid blocks or chips**, not gradients.
  When teal is used as a section background it sits behind the standard
  white card stack — high contrast.
- "Protection gradients" appear on `.real-estate-card-brandbar` — a thin
  white border around dealer avatars over the image so the avatar reads
  cleanly. Otherwise gradients are rare.

### Shadows / elevation

Six elevation steps (`--elevation-10` → `--elevation-60`). Soft, low-opacity,
straight-down. Used for cards (10–30), floating buttons (50), modals/menus
(40–60). **No coloured shadows. No long shadows. No inner glows.** Inset
shadows are used as **focus rings** (`box-shadow: inset 0 0 0 2px
var(--color-border-focused)`).

### Borders

1px hairline borders in `--color-border-default` (`#e0e0e0`) for separators
and weak card outlines. `--color-border-strong` for selected/active states.
On hover/focus the border darkens to `--gray-1000` and thickens to 2px (via
inset shadow rather than border-width to avoid layout shift).

### Hover, press & focus

- **Hover.** Filled buttons darken one step in the same hue. Outline buttons
  thicken their inset shadow from 1px → 2px and darken the border. Cards add
  a subtle elevation bump.
- **Press / active.** Filled buttons darken a *second* step. Outlines get a
  2px inset ring in `--color-border-button-strong-active`. No transform; no
  shrink.
- **Focus-visible.** Always a 2-px inset ring in `--color-border-focused`
  (the link blue `#2267e8`).
- **Disabled.** Gray fill + gray text + `cursor: not-allowed`. No "ghost"
  buttons in the COSMA design — disabled is always opaque so it reads on any
  background.

### Animation

Modest. **`200ms ease-in-out`** is the default — applied to button
`background-color, color, border-color, box-shadow` transitions. No bounce,
no spring, no parallax. Two `<DismissAnimation>` and `<StaggeredList>`
helpers exist for richer transitions (slide + fade); the bar for using them
is purposeful motion, not delight.

### Transparency & blur

Used sparingly. Alpha overlays (`fadeout()` LESS calls; CSS
`rgba`/`color-mix`) appear as **focus halos** (`box-shadow: 0 0 0 14px
fade(@teal-400, 10%)`) and **scrim modals** (`rgba(0,0,0,0.8)`). **No
backdrop blur** — glass surfaces are not part of the visual language.

### Layout

- Page wrapper centers at **max-width 1154px** (1106px effective inside
  padding). Use `.page-wrapper > .content-wrapper`.
- Mobile-first; CSS uses LESS media queries `@mediaQueryPalmOnly`,
  `@mediaQueryLapAndUp`. Breakpoints: ~600 (palm/lap), ~960 (lap/desk).
- Real-estate cards have a fixed `263 × 385px` shape — they're consumed in
  grids and carousels at that exact size.

### Mobile overlays & navigation

**Mobile Bottom Navbar** (`mobile-bottom-nav.css`) — Fixed palm navigation docked at the bottom. Five equal-width items: `Suchen` (search) · `Meine Immos` (my properties) · `Inserieren` (publish) · `Nachrichten` (messages) · `HeyImmo` (AI assistant). Total shell is 96px (62px nav row + 34px iPhone home bar). Active route items use bold charcoal text + a filled icon variant (where available); HeyImmo is a `<button>` (not a link) that opens an overlay and carries an AI sparkle glow. Always reserve 96px bottom padding on page content so it clears the navbar. See `FIGMA_MAKE_GUIDELINES.md` for full specs.

**HeyImmo AI Assistant Modal** (`heyimmo-modal.css` + `HeyImmo Mobile Template.html`) — An AI real-estate chatbot overlay opened from the bottom navbar `HeyImmo` button. Sits above the current page (never routes away), locks background scroll, and traps keyboard focus. Anatomy: header with a cyan→teal→yellow→orange aura gradient strip + plain charcoal sparkle mark + close button, scrollable chat region with start-state prompts / user pills / loading rows / assistant responses, and a sticky composer footer with history, new-conversation, attachment, voice-recording (placeholder until glyph ships), and send-button controls. Legal/privacy links sit directly above the composer. German copy throughout. Full working prototype in the template; component card shows both navbar states. See `DESIGN-cosma.md` for component usage rules.

### Iconography (summary — full section in ICONOGRAPHY below)

Two icon systems coexist:

1. **`IS24Icons`** — a custom IcoMoon-built icon font shipped with the
   codebase (`fonts/is24-icons.woff`). ~200 monoline glyphs covering both
   generic UI (search, edit, chevron) and real-estate-specific concepts
   (balcony, fitted-kitchen, elevator, fuel-efficient-tree, EnEV-class,
   solar-potential).
2. **`@is24/cosma-ui-icons`** — newer React SVG components imported as
   `IconS24ArrowLeft24`, `IconS24Search24`, etc. Same visual style, modern
   delivery. *Not present in the local checkout* — see Iconography section.

Style is **outlined, ~1.5px stroke, 24×24 grid, no fills**. Glyph variants
(`-glyph` suffix) are bolder/filled versions for active states.

---

## Iconography

### What the codebase actually ships

`fonts/is24-icons.woff` — a single IcoMoon-generated icon font. Each glyph
gets a class like `is24-icon-balcony` mapped to a Unicode code point. Usage:

```html
<i class="is24-icon is24-icon-balcony" aria-hidden="true"></i>
```

The full glyph table is in `frontend-core-master/src/main/font/vendor/is24-icons/variables.less`
(or the matching CSS variables file `fonts/is24-icons.css` in this project).
A subset of ~140 names is wired up in `fonts/is24-icons.css`; the rest can be
added by following the pattern (codepoint → CSS class).

Glyphs are **outlined** for ambient/decorative use and **filled** (suffix
`-glyph`) for active/pressed states — e.g. `is24-icon-heart-favorite` (outline)
vs `is24-icon-heart-Favorite-glyph` (filled).

### `@is24/cosma-ui-icons` (newer React SVG set)

The component code (e.g. `PageHead.tsx`) imports SVG icons from a separate
package:

```tsx
import { IconS24ArrowLeft24 } from "@is24/cosma-ui-icons";
```

Naming pattern: `IconS24<Name><Size>` — sizes are `16`, `20`, `24`. This
package was **not present in the local checkout**, so the React-side icons in
the UI kits below fall back to the IcoMoon font equivalents. Swap them out
once the SVG set is available.

### Brand / social icons

The icon font also includes color-aware brand glyphs (`is24-icon-facebook`,
`is24-icon-instagram`, `is24-icon-linkedin`, `is24-icon-whatsapp`,
`is24-icon-youtube`, `is24-icon-xing`). The Instagram glyph has a special
gradient `background-clip: text` rule baked in.

### Emoji

**Never.** No emoji are used anywhere in the COSMA codebase. Don't introduce
them in new designs.

### Known glyph gaps

The IS24 icon font does not yet include **microphone** and **stop-recording** glyphs. Until they ship, the HeyImmo assistant modal composer uses placeholder buttons with text labels (`"Aufnahme starten"` / `"Stopp"`) or temporary emoji (`🎤` / `⏹️`). Update `heyimmo-modal.css` and the template markup once the glyphs are available in the font — they should follow the same outline style as the rest of the icon set (24px, ~1.5px stroke, monoline).

### Unicode characters as icons

Used sparingly: `€` for currency, `²` for m², dashes (`–`), checkmark `✓`
appears occasionally in marketing surfaces. Otherwise the icon font carries
the load.

### Substitutions in this design system

- React `IconS24*` imports → swap for IcoMoon font spans (`<i class="is24-icon
  is24-icon-…">`). Same visual; older delivery mechanism.
- Where a glyph isn't in the font (rare), use **Lucide** at the same 24-px
  outlined weight via CDN: `https://unpkg.com/lucide-static@latest/icons/<name>.svg`.
- **FLAG:** the canonical SVG icon set lives in `@is24/cosma-ui-icons`; treat
  any Lucide substitution as a temporary stand-in.

---

## Quick start

```html
<!doctype html>
<link rel="stylesheet" href="colors_and_type.css" />
<link rel="stylesheet" href="fonts/is24-icons.css" />
<body>
  <h1>Finde dein neues Zuhause</h1>
  <button class="btn btn--primary">Suche starten</button>
  <i class="is24-icon is24-icon-balcony"></i>
</body>
```

`colors_and_type.css` is the single import. The UI kit under
`ui_kits/immoscout24/` shows the components in context.

---

## Caveats

- `@is24/cosma-design-tokens` (the canonical token JSON) is not in the local
  checkout. Semantic tokens are interpolated; swap them for the real token
  file when it's available.
- `@is24/cosma-ui-icons` (the SVG icon React package) is similarly absent.
  React components in `ui_kits/` use the IcoMoon font instead.
