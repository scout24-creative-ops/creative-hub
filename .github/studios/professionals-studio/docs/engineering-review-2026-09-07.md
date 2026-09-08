# Professionals Studio engineering review

Completed on 7 September 2026. Scope: more editable designs, source image handling, all configured safety margins, product regression checks and a practical stability plan.

## Outcome

Change design now contains eighteen executable layouts, including eight additions: Photo above message, Message above photo, Portrait on the left, Portrait on the right, Horizontal split, Photo with lower caption, Centred statement and Underlined statement. Existing straight and angled splits remain available. These are editable compositions, not flattened reference artwork.

The renderer uses the original source pixels. When a chosen photo region would enlarge the image beyond the configured quality threshold or retain less than a quarter of it, the layout can contain the complete photograph at native scale or smaller. The preview and export now use the same final geometry before the thumbnail is reduced. This can change a full frame design into a photo and message composition; the preview names that change.

Every essential mark, including rotated highlighter bounds, is checked against both configured platform areas and Studio margins. Unknown subject geometry is not certified by these checks. Faces, hands, meaningful objects and the licence remain part of human review.

## Engineering loop

| Finding reproduced | Fix | Retest |
| --- | --- | --- |
| A reduced planning master could make an adequate original appear too small. | Preserve original source pixels, keep preview and source enlargement measurements separate and render previews at final dimensions. | Geometry regression and actual browser compositions passed. |
| Severe crops and soft enlargement only produced warnings. | Use contained source compositions when possible and hold unresolved quality failures. | Normal, small, panoramic, tall and tiny sources exercised. |
| A lower caption exceeded a square safe margin by a fractional pixel. | Round the measured stack inward. | Previously held square case passed. |
| A thin banner with an extreme portrait left no valid logo area. | Separate the small photo from the neutral logo and message area. | Previously held banner cases passed. |
| An image only variant could become an empty statement. | Clean variants use the supplied photograph regardless of the selected typographic design. Truly empty compositions are held. | Native clean variants and missing source cases passed. |
| A straight highlighter became narrower than its headline, leaving dark letters on a dark field. | Check actual background coverage before changing text colour. Use the supplied underline when the intact shape cannot support the line. | All five affected Charcoal colour combinations passed the repeat matrix. |
| The archive could include a file exceeding its placement byte limit. | Encode within the allowed formats and hold files still over the cap. | JPEG and PNG regression cases passed. |
| Unavailable or malformed storage could interrupt the page; delayed database opens could write after failure. | Defensive parsing, deadlines, transaction cleanup, late connection cancellation and retryable storage. | Fault regressions passed, including no late record write. |
| Old cached pages could bring removed controls back. | Added a local preview server with a no store policy. | Fresh dashboard navigation loaded current controls. Deployment cache policy remains in the plan. |
| The Studio header overflowed on a narrow screen. | Wrapped header actions and compacted the stepper. | All eighteen route and width checks passed. |
| Exported HTML linked to fonts that were absent outside the Studio. | Embed all three Make It Better font files in both exported documents. | Real downloaded archive contained valid embedded WOFF2 data and no unresolved font paths. |
| Reference templates retained consumer claims and Plus conventions. | Preserve the reference page structure while using supplied imagery, formal Professionals copy and explicit proof placeholders. | Source checks and browser route reviews passed. |
| Generated email contained fake legal footer destinations. | Missing destinations are visible requirements, with an explicit draft label and no fake legal links. | Email readiness regressions and exported draft checked. |

Further safeguards added: bounded image caches, retry after failed image loads, required brand font readiness, API request deadlines, stale image response protection, preview failure recovery, restored setting defaults, build locking and invalidation of an old ZIP after a design change.

## Final test evidence

| Check | Result |
| --- | --- |
| Unit regressions | 34 passed, zero failures. Includes 3,456 source and crop geometry combinations. |
| Browser renderer matrix | 1,152 assertions passed, zero failures: 720 normal geometry cases, 72 adversarial cases and 360 palette and button cases. |
| Render eligibility | 1,078 renderable; 74 correctly held. Holds were 56 missing valid logo backgrounds and 18 empty compositions. A held case passing its assertion does not mean it is exportable. |
| Source adaptation | 698 cases used source preserving geometry. |
| Render performance observation | Final matrix completed in about twelve seconds. The timed geometry subset had a median around a few milliseconds and a 95th percentile of fourteen milliseconds. This is one local browser run, not a performance guarantee. |
| Visual samples | All eighteen designs rendered at portrait Feed and Story dimensions, for thirty six samples with no holds. Samples were inspected in the browser. |
| Responsive routes | Dashboard, brand guidelines, Concept Studio and three template pages checked at narrow, tablet and desktop widths. Eighteen checks passed. |
| Brand publication | Canonical and downloadable tokens, notes and inventory match. Every token has a source. Downloadable notes links resolve. |
| Source audit | Twenty JavaScript and inline script syntax checks and ninety five local references passed. |
| Real workflow | Dashboard, keyless concepts, selection, export plan, design picker, layout change, variants, five social placements, build, ZIP download, invalidation after design change and history reopening exercised. |
| Downloaded archive | Twenty two files. CRC valid. Twenty JPEGs have their declared dimensions and meet the selected placement byte cap. Landing and email HTML contain all three valid embedded fonts. Email is visibly draft. |
| Runtime errors | No errors in the final main workflow and renderer browser logs. |

Machine readable evidence: [engineering-results-2026-09-07.json](./engineering-results-2026-09-07.json).

## What is not certified

No paid generation or live image extension call was made. Actual provider failures, cancellation and real mail client delivery still need integration testing. Responsive route checks do not cover every modal or intermediate workflow state. The English and German switch works on the tested static surfaces, but some dynamic Studio text remains untranslated. Screen reader and keyboard modal coverage is incomplete.

Safe zone values were enforced as currently configured; this pass did not independently reverify the external platform specifications. Source saliency is not face or hand detection. Mandatory copy, product evidence, licensing and final creative approval must not be inferred from a successful render. Generated landing copy still contains a fixed internal Studio workflow that needs to become campaign specific.

These remaining items are prioritised in [stability-plan.md](./stability-plan.md).

## Repeat the checks

From the project directory:

```sh
node --test src/quality-pipeline.test.mjs src/tests/*.test.mjs
node src/tests/source-audit.mjs
python3 scripts/preview.py --port 9330
```

Open the local `tests/render-stress.html` and `tests/product-smoke.html` pages and use their run buttons. The preview is a static server, not an AI API service. The current checked browser run is on port 9330.

For the five placement social test campaign, download the ZIP and run:

```sh
node src/tests/archive-audit.mjs /absolute/path/to/downloaded.zip
```

The archive audit deliberately expects that twenty image and two document fixture. It is not a generic assertion that every campaign should produce those counts.
