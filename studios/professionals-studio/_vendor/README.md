# `_vendor/`

Third-party code checked in so that the documents open with no network, the
same bargain `_ds/` already makes for the design system. Nothing here is ours,
nothing here is edited, and nothing here is fetched at run time.

## Why it exists

Every `.dc.html` in this repo — `Plus Brand Guidelines.dc.html` and the four
`Template *.dc.html` — is a React document. Until this folder existed,
`support.js` pulled React and ReactDOM from `unpkg.com` when the page opened.
With the network unavailable the runtime never booted, `x-dc{display:none}` was
already applied, and the reader got a blank white page. The brand guidelines
are the file we send to people outside the company, so that was the file most
likely to be opened on a train.

## `react-18.3.1/`

| File | Bytes | sha384 (base64, as in an SRI attribute) |
|---|---:|---|
| `react.production.min.js` | 10,751 | `DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z` |
| `react-dom.production.min.js` | 131,835 | `gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1` |
| `LICENSE` | 1,086 | MIT, Meta Platforms — covers both files, which ship identical copies |

**Licence.** MIT, in `react-18.3.1/LICENSE`. It permits redistribution as long
as the notice travels with the code; both minified files also carry their own
`@license React` header, so the notice is present three times over.

**Provenance.** These are the official UMD production builds of `react` and
`react-dom` at 18.3.1. Their hashes are byte-for-byte the `REACT_SRI` and
`REACT_DOM_SRI` values that `support.js` has always pinned against unpkg — that
is, this folder holds exactly the code these documents were already running,
now sitting next to them instead of a CDN. `qa/offline-documents.test.mjs`
re-checks that equality on every `npm test`.

To confirm by hand:

```bash
openssl dgst -sha384 -binary _vendor/react-18.3.1/react.production.min.js | openssl base64 -A
```

**Cost.** 142,586 bytes of code, about 139 KB; 152 KB for the folder once the
licence and this file are counted. The tracked repo is 9.6 MB, so this is about
1.5% of it — against 2.9 MB for `_ds/` and 2.6 MB for the photography in
`assets/`. The checkout on disk reads as 18 MB, but 7.1 MB of that is `.git`.

## What is deliberately not here

**Babel.** `support.js` also names `@babel/standalone` on unpkg, but it is only
fetched to transpile a `.jsx` or `.tsx` module named by an `<x-import>` element,
and no document in this repo contains an `<x-import>` at all. Vendoring a ~3 MB
transpiler that nothing loads would cost twenty times what React costs and buy
nothing. The test file asserts that no document ships JSX, so if that ever
stops being true it fails and points back here rather than letting the
offline promise rot silently.
