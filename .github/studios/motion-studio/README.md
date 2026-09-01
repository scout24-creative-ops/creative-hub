# Motion Studio

Motion Studio is a planned product workspace owned by [ScoutBoyDesign](https://github.com/ScoutBoyDesign) for creating and maintaining motion guidelines.

It uses the shared brand-neutral Studio framework and is not imported by the Creative Hub webpage.

## Create the local environment

```sh
node .github/studio-template/create-studio.mjs motion-studio
```

The ignored local workspace is created at `.studio-workspaces/motion-studio/`.

## Validate

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/motion-studio/studio-manifest.json
```
