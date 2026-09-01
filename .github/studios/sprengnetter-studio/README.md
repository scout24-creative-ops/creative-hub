# Sprengnetter Studio

Sprengnetter Studio is a planned product workspace for approved Sprengnetter-product workflows and guidance. Ownership has not yet been assigned.

It uses the shared brand-neutral Studio framework and is not imported by the Creative Hub webpage.

## Create the local environment

```sh
node .github/studio-template/create-studio.mjs sprengnetter-studio
```

The ignored local workspace is created at `.studio-workspaces/sprengnetter-studio/`.

## Validate

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/sprengnetter-studio/studio-manifest.json
```
