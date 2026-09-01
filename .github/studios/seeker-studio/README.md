# Seeker Studio

Seeker Studio is a planned product workspace for approved seeker-product workflows and guidance.

## Owner

- Marcus — [`md-at-is24`](https://github.com/md-at-is24)

It uses the shared brand-neutral Studio framework and is not imported by the Creative Hub webpage.

## Create the local environment

```sh
node .github/studio-template/create-studio.mjs seeker-studio
```

The ignored local workspace is created at `.studio-workspaces/seeker-studio/`.

## Validate

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/seeker-studio/studio-manifest.json
```
