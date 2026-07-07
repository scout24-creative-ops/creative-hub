# AI Marketing Creation Hub – Standalone

A complete, self-contained version of the AI Marketing Creation Hub. Works offline with all assets included.

## Contents

- **index.html** — Main page. Open this in a browser.
- **css/** — All stylesheets (design tokens, component styles).
- **js/** — All JavaScript and React components (data, sections, tweaks).
- **_ds/** — COSMA Design System bundle (colors, typography, icons, fonts).
- **tweaks-panel.jsx** — Tweaks panel component.
- **assets/** — All photos and videos (full-resolution, no compression).

## How to use

1. Open `index.html` in any modern browser.
2. Everything loads from local files — no internet required.
3. Videos play directly from the `assets/` folder (no streaming needed).

## File sizes

- Photos: ~3 MiB
- Videos: ~46 MiB (tutorial-image-builder.mp4, tutorial-script-storyboard.mp4, tutorial-video-endcard-editor.mp4)
- Total folder: ~85 MiB

## Deployment

To host this online:
- Upload the entire folder to any static web host (Netlify, Vercel, GitHub Pages, etc).
- The folder structure must remain intact — browsers will fetch CSS, JS, and assets relative to `index.html`.

## Notes

- All videos are embedded locally; they play without streaming.
- Design system tokens and fonts are self-contained.
- Works in all modern browsers (Chrome, Firefox, Safari, Edge).
