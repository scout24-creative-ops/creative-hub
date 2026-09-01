# Homeowner Studio

Homeowner Studio is a planned product workspace owned by [ndc4scout24](https://github.com/ndc4scout24) for approved homeowner-product workflows and guidance.

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
