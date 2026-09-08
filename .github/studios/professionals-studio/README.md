# Professionals Studio

Professionals Studio is the ImmoScout24 campaign workspace for agents and other real estate professionals.

## Open locally

Serve the `src` folder with a local web server and open `index.html`.

The main routes are:

* `src/index.html` for the dashboard
* `src/brand.html` for the bilingual brand guidelines
* `src/concept-studio.html` for the concept, format and asset workflow

## Brand sources

Approved reusable values live in `brand/tokens.json`. Practical usage rules live in `brand/notes.md`. The evidence inventory lives in `docs/brandsources.md`.

The Brand Guidelines explains the system and offers quiet downloads for production. Run `node scripts/sync-brand-tokens.mjs` after changing a canonical brand file. This validates every token source and publishes `src/brand-tokens.json`, `src/brand-tokens.css`, `src/brand-notes.md` and `src/brandsources.md`.

The full 196 MB Professionals imagery archive is retained outside Git. Web ready reference images needed by the product are included under `src/assets/imagery-guidelines`.
