# Contributing to Creative Hub

## Repository boundaries

The published Creative Hub is the root `index.html` plus its `js/`, `css/`, `_ds/`, and `assets/` dependencies.

The reusable Studio starter kit is isolated in `.github/studio-template/`. Nothing in the published page may import or link to that directory. Changes to the starter kit must not modify the live Hub unless a separate product decision explicitly approves an integration.

## Local setup

1. Clone the repository.
2. Create a feature branch: `git switch -c feature/<short-name>`.
3. Create an isolated Studio workspace:

   ```sh
   node .github/studio-template/create-studio.mjs <studio-id>
   ```

   Registered Studio IDs automatically apply the assignment stored in `.github/studios/registry.json`.

4. Work inside `.studio-workspaces/<studio-id>/` in your own environment.
5. Validate during development:

   ```sh
   node .github/studio-template/validate-studio.mjs .studio-workspaces/<studio-id>/studio-manifest.json
   ```

6. Before release, replace every marked placeholder and run:

   ```sh
   node .github/studio-template/validate-studio.mjs --release .studio-workspaces/<studio-id>/studio-manifest.json
   ```

## Pull requests

- Keep each pull request focused on one Studio or one shared-template improvement.
- Explain whether the change affects repository tooling, a local Studio workspace, or the published Hub.
- Never commit `.studio-workspaces/`, credentials, API keys, generated exports, or private source material.
- Do not embed product content in the shared shell.
- Product themes must use reviewed semantic tokens and remain separate from core navigation, accessibility, status, and language behavior.
- Request review from the Studio owner and a Creative Hub maintainer before merging.

## Required checks

Run the repository-only template self-test:

```sh
node .github/studio-template/validate-studio.mjs --self-test
```

The GitHub workflow runs the same check whenever the template or collaboration documentation changes.
