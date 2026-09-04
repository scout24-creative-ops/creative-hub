/* =====================================================================
   WHAT AN EXPORTED FILE IS CALLED.

   THE FILENAME NAMES WHAT WAS DRAWN, like the build record beside it.
   The design a build asks for is not always the design the engine grants:
   a concept with no photograph is set typographically, a canvas too small
   for a sentence runs as an end frame, and the image-only variant carries
   no structure at all. The build record was taught to report the drawn
   structure; the filename was not, so a photoless concept drew `statement`
   and shipped as `..._anchor-top_full.jpg`, leaving the one artefact that
   outlives the session as the only one still carrying the intention
   instead of the outcome.

   When the engine DID grant the design, the design's own id stays the
   name, because it carries the decisions taken inside the structure and
   `anchor-top` says more than a bare `anchor`. When it did not, the drawn
   structure is the only true thing to write.

   This lives in its own module for one reason: nothing on any screen
   prints a filename, so the rule could only ever be checked indirectly,
   through the build record and the gallery labels, which are a different
   computation that happens to agree. qa/asset-naming.test.mjs checks the
   rule itself.
   ===================================================================== */

/* Filesystem- and ZIP-safe, and short enough that a placement name of any
   length cannot push the whole thing past what a mail client will show. */
export function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

/* The structure the name is built around. `drawn` is what the engine
   reported it actually laid out; `designStyle` is the structure the chosen
   design is made of. They agree on the ordinary path, and when they do the
   richer design id wins. */
export function drawnDesignId({ drawn, designId, designStyle }) {
  return drawn && drawn !== designStyle ? drawn : designId;
}

export function assetFileName({
  conceptId, manyConcepts, platform, placement, w, h,
  drawn, designId, designStyle, variant,
}) {
  const prefix = manyConcepts ? `concept${conceptId}_` : "";
  const structure = slug(drawnDesignId({ drawn, designId, designStyle }));
  return `${prefix}${slug(platform)}_${slug(placement)}_${w}x${h}_${structure}_${variant}`;
}
