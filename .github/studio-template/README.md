# Brand-neutral Studio starter kit

This directory is the source-controlled starting point for Studio work. It is not part of the published Creative Hub page and must never be imported from the root `index.html`, `js/`, or `css/` files.

## Start a local Studio

From the repository root:

```sh
node .github/studio-template/create-studio.mjs my-studio
```

This creates:

```text
.studio-workspaces/my-studio/
├── README.md
├── studio-manifest.json
└── src/
    ├── StudioShell.jsx
    └── studio-shell.css
```

`.studio-workspaces/` is ignored by Git so every colleague can work in an independent environment without publishing unfinished Studio content or changing the live Hub.

Use `--destination` to place the workspace elsewhere:

```sh
node .github/studio-template/create-studio.mjs my-studio --destination ../my-studio-project
```

## Manifest contract

`studio-manifest.schema.json` defines the public contract. All user-facing strings are localized objects with canonical English and German values. Required guideline sections are stable across products, while templates and related tools may be empty.

Workflow availability is enforced:

- `planned`, `in-development`, `paused`, and `retired`: no launch target.
- `testing`: approved test target only.
- `available`: approved production target only.
- `empty`: development shell only.

## Validate

Development validation allows visibly marked placeholders:

```sh
node .github/studio-template/validate-studio.mjs .studio-workspaces/my-studio/studio-manifest.json
```

Release validation requires approved content, complete guideline bodies, and no placeholders:

```sh
node .github/studio-template/validate-studio.mjs --release .studio-workspaces/my-studio/studio-manifest.json
```

Validate the starter kit and repository boundary:

```sh
node .github/studio-template/validate-studio.mjs --self-test
```

## Rules

- Do not copy product branding into `src/`.
- Do not add literal product colors; consume approved semantic tokens through the host environment.
- Do not store credentials or client-side API instructions.
- Do not make a disabled control look actionable.
- Do not edit the published Hub to preview a local Studio.
- Product-specific manifests and themes require product-owner approval before they leave an ignored workspace.
