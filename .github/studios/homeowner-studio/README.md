# Homeowner Studio

Homeowner Studio is a planned product workspace for approved homeowner-product workflows and guidance. Ownership has not yet been assigned.

It uses the shared brand-neutral Studio framework and is not imported by the Creative Hub webpage.

## Create the local environment

```sh
node .github/studio-template/create-studio.mjs homeowner-studio
```

The ignored local workspace is created at `.studio-workspaces/homeowner-studio/`.

## Validate

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/homeowner-studio/studio-manifest.json
```
