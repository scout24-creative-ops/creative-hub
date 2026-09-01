# One System Studio

One System Studio is a planned product workspace owned by [alexpenk](https://github.com/alexpenk). Its scope covers Brand, Assets and the One System Studio product.

It uses the shared brand-neutral Studio framework and is not imported by the Creative Hub webpage.

## Create the local environment

```sh
node .github/studio-template/create-studio.mjs one-system-studio
```

The ignored local workspace is created at `.studio-workspaces/one-system-studio/`.

## Validate

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/one-system-studio/studio-manifest.json
```
