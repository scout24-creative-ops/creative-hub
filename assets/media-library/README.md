# Media Library import

Run `python3 scripts/import-media-library.py` from the repository root to rebuild this directory from the Frontify bulk export without extracting or copying the original 11.7 GB payload. The small SVG icon library is deliberately extracted so the static Hub can provide real downloads.

The importer emits:

- `media-manifest.json`: `{ generated, source, libs, files, videos, dupes }`. Library keys are `images`, `immopics`, `highlighter`, `icons`, and `logos`. Asset records contain `{ id, n, lib, ext, kb, collection }` plus optional `col`, `w`, `h`, and `previewId` fields.
- `media-thumbs.json`: preview lookup keyed by `previewId`; each value is `{ m, d }`, where `m` is the MIME type and `d` is the base64 payload.
- `icon-catalog.json`: groups the 823 exported SVG files into icon designs and records each design's available 24/48 variants, original filename, view box, byte size, and style.
- `icons/originals/`: the complete exported SVG icon set used for full SVG downloads and client-side PNG generation.
- `tiles/`: the six exact category captures (`05-media-library_01` through `05-media-library_06`) plus the overview mark (`05-media-library_07`), retaining their source filenames.

Deduplication uses the ZIP-provided CRC plus uncompressed byte size. Finder metadata (`__MACOSX`, `.DS_Store`, and AppleDouble `._*` entries) is excluded. The nested `Logos.zip` archive is indexed in memory and is not unpacked. Use `--verify-all` to stream every retained member through Python's ZIP CRC validation without writing originals.
