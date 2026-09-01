## What changed?

Describe the Studio, template, schema, or collaboration change.

## Change boundary

- [ ] Repository-only Studio tooling (`.github/studio-template/`)
- [ ] Product-specific manifest or theme
- [ ] Published Creative Hub (`index.html`, `js/`, `css/`, `_ds/`, `assets/`)

If the published Hub is checked, link the explicit product decision approving that integration.

## Validation

- [ ] `node .github/studio-template/validate-studio.mjs --self-test`
- [ ] Manifest development validation passes
- [ ] Release validation passes, if this is a release candidate
- [ ] No credentials, API keys, generated exports, or private assets are committed
- [ ] No product-specific content is embedded in the shared shell
- [ ] English and German content is complete for published manifests

## Review

Studio owner:

Creative Hub maintainer:
