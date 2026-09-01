# Professionals Studio

Professionals Studio is a planned product workspace owned by [PeterSijtsma](https://github.com/PeterSijtsma). It uses the shared brand-neutral Studio framework while keeping all Professionals-specific content isolated from the Creative Hub webpage.

## Product boundary

- Build approved workflows for professional-product creation.
- Keep identity, content, tools, templates and launch destinations in the product manifest.
- Do not copy Plus+ names, claims, assets, colors, workflows, credentials or links.
- Keep launch actions unavailable until their protected destinations are approved.

## Create the local environment

From the Creative Hub repository root:

```sh
node .github/studio-template/create-studio.mjs professionals-studio
```

The generated workspace is created at `.studio-workspaces/professionals-studio/`. It is intentionally ignored by Git while the product is being developed.

Validate during development:

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/professionals-studio/studio-manifest.json
```

Release validation must not be used until the content, bilingual guidelines, theme and workflow destinations are approved.
