/* =====================================================================
   PLATFORM SAFE ZONES, HARD CODED.

   HARD RULE: this file is the single source of truth for every safe zone
   in the Plus system. Nothing may be laid out over these margins, ever.

   Three properties this file is required to hold:

   1. HARD CODED. These numbers live in code, not in a fetched document.
      The Concept Studio imports this module. If the import fails the
      compositor refuses to build assets rather than falling back to a
      guess. Fail closed, never fail open.

   2. ALWAYS ENFORCED. The compositor measures the box of every headline,
      subline, CTA and logo it draws and compares it to the box below.
      An asset with anything outside is blocked, not exported.

   3. TRACKED. Platforms change these numbers without notice. Every entry
      carries where it came from, how well it is verified, and when it was
      last checked. tools/safezone-watch re-checks them on a schedule and
      opens a report when a source disagrees with this file.

   To change a number: edit it here, bump SAFE_ZONE_VERSION, set
   last_checked, and add a line to CHANGELOG at the bottom. Do not edit
   the numbers anywhere else. agents/platform-export-presets.json is
   documentation that mirrors this file, not an input to it.
   ===================================================================== */

export const SAFE_ZONE_VERSION = "2.0.0";
export const SAFE_ZONE_VERIFIED = "2026-08-10";

/* Where each platform publishes its specs. The watcher fetches these.
   Vendors move documentation often, so a dead URL is a finding, not a crash. */
export const SOURCES = Object.freeze({
  meta:    "https://www.facebook.com/business/help/980593475366490",
  metaGuide:"https://www.facebook.com/business/ads-guide/update/image",
  tiktok:  "https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads",
  taboola: "https://help.taboola.com/hc/en-us",
  outbrain:"https://www.outbrain.com/help/advertisers/creative-guidelines/",
  google:  "https://support.google.com/google-ads/answer/1722096",
  moloco:  "https://www.moloco.com/",
});

/* Two kinds of margin, and only one of them may block a file.

   HARD   The platform draws its own interface over this strip. Anything
          placed there is invisible to a real person, so it is a fact about
          the world, not a preference. The compositor refuses to export a
          file whose type or logo enters it.

   SOFT   A studio margin, or a centre-bias guide for a platform that
          re-crops the file itself. This is taste and craft. It shapes the
          layout, it is reported when a composition runs wide of it, and it
          never deletes work.

   Getting this wrong in the other direction is expensive: the old build
   blocked perfectly legal square feed ads because they touched a 5.5%
   house margin that no platform has ever published. */
export const ZONE_KIND = Object.freeze({
  hard: "Reserved by the platform's own interface. Nothing may be placed here.",
  soft: "A studio margin or a crop-survival guide. Shapes the layout, never blocks a file.",
});

/* How much to trust each number. Never present a non-verified figure as fact. */
export const VERIFICATION = Object.freeze({
  verified:  "Confirmed on the platform's own documentation.",
  secondary: "Consistent across multiple independent third-party sources; the platform's own page was unreachable. Confirm before a large spend.",
  consensus: "No authoritative publisher exists. Industry practice.",
  brand:     "Not a platform figure. A studio margin applied where no platform publishes one.",
});

/* The house margin used ONLY where a platform publishes nothing. It is a
   deliberate choice, not a discovered fact, and is always labelled as such. */
export const BRAND_MARGIN_RATIO = 0.055;

const K = (platform, placement) =>
  String(platform || "").toLowerCase().replace(/[^a-z0-9]+/g, "") + "|" +
  String(placement || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

/* ---- The table. Pixel boxes on the canvas each figure was measured against. ---- */
export const SAFE_ZONES = Object.freeze({
  /* Meta publishes ONE 9:16 rule and it now covers Stories, Reels, Facebook
     Stories, Facebook Reels and 9:16 Instagram Feed alike: 14% top, 35%
     bottom, 6% each side. The 20% bottom figure that this file used to carry,
     and that most of the internet still repeats, is out of date by 456px. */
  [K("Meta", "Stories")]: Object.freeze({
    kind: "hard",
    canvas: { w: 1080, h: 1920 }, top: 269, right: 65, bottom: 672, left: 65,
    verification: "verified", source: SOURCES.meta, last_checked: "2026-08-10",
    note: "Top 14%, bottom 35%, sides 6%. Meta's own wording, unified across every 9:16 placement. Was 20% bottom in this file until 2026-08-10, which was wrong by 456px.",
  }),
  [K("Meta", "Reels")]: Object.freeze({
    kind: "hard",
    canvas: { w: 1080, h: 1920 }, top: 269, right: 65, bottom: 672, left: 65,
    verification: "verified", source: SOURCES.meta, last_checked: "2026-08-10",
    note: "Top 14%, bottom 35%, sides 6%. If the ad carries a disclaimer, Meta asks for 40% at the bottom, which is 768px. Build disclaimer creative to that instead.",
  }),
  /* TikTok publishes NO pixel values at all. The geometry ships only as
     downloadable template overlays, and TikTok says plainly that the zone
     changes with aspect ratio, caption length and interactive add-ons.
     Third-party figures disagree by roughly 2.4x on every edge, so this
     entry takes the strictest of the widely cited values and says so.
     It is not presented as a platform figure, because there is none. */
  [K("TikTok", "In-Feed (Auction)")]: Object.freeze({
    kind: "hard",
    canvas: { w: 1080, h: 1920 }, top: 254, right: 242, bottom: 707, left: 122,
    verification: "consensus", source: SOURCES.tiktok, last_checked: "2026-08-10",
    note: "TikTok publishes no numbers, only template files. Cited third-party figures span 2.4x on every edge (right 100 to 242, bottom 300 to 707, top 108 to 254). These are the strictest of them. Pull the official template from Ads Manager before a large spend.",
  }),

  /* Recrop surfaces. The platform re-crops the same file into several ratios,
     so the rule is a clear side margin rather than a fixed box. Soft: no part
     of the frame is covered by an interface, the risk is the platform's own
     crop, and that is a composition problem rather than a compliance one. */
  [K("Taboola", "Native thumbnail (primary)")]: Object.freeze({
    kind: "soft",
    canvas: { w: 1200, h: 674 }, top_ratio: 0.06, right_ratio: 0.281, bottom_ratio: 0.06, left_ratio: 0.281,
    centre_bias: true, verification: "verified", source: SOURCES.taboola, last_checked: "2026-08-10",
    note: "Taboola's own words: centre text or logos with a 300px guard each side on a 1067px wide image, which is 28.1% per side and leaves a centred band of 43.8%. The same file is re-cropped into 16:9, 4:3, 1:1, 6:5 and 2:1, so the width is what gets eaten, not the height.",
  }),
  [K("Outbrain", "Standard Native / In the Feed")]: Object.freeze({
    kind: "soft",
    canvas: { w: 1200, h: 800 }, top_ratio: 0.06, right_ratio: 0.167, bottom_ratio: 0.06, left_ratio: 0.167,
    centre_bias: true, verification: "consensus", source: SOURCES.outbrain, last_checked: "2026-08-10",
    note: "Outbrain publishes no safe-area pixels, only 'place the important part of the image in the centre'. 16.7% per side is derived: it is exactly what a 3:2 file loses when a publisher widget crops it to 1:1.",
  }),
});

/* One box that clears Meta Stories, Meta Reels and TikTok at once: the union of
   the strictest margin on each side. Used for any 9:16 surface not named above. */
export const UNIVERSAL_9_16 = Object.freeze({
  kind: "hard",
  canvas: { w: 1080, h: 1920 }, top: 269, right: 242, bottom: 707, left: 122,
  verification: "consensus", source: SOURCES.meta, last_checked: "2026-08-10",
  note: "Union box for a 9:16 surface with no entry of its own. Top 269 = Meta 14%. Bottom 707 and the asymmetric sides come from the strictest cited TikTok figures. Deliberately pessimistic: it is the box that clears every vertical surface at once.",
});

/* Surfaces nobody draws an interface over: a web hero, an email header, a
   banner in an app. These carry a house margin only, so they are never
   blocked, only advised. */
const NO_PLATFORM_UI = /^(web|email|plus \(internal\)|internal)$/i;

function scaled(e, w, h) {
  const sx = e.canvas ? w / e.canvas.w : 1, sy = e.canvas ? h / e.canvas.h : 1;
  const px = (abs, ratio, axis) =>
    ratio != null ? Math.round((axis === "x" ? w : h) * ratio)
                  : Math.round((abs || 0) * (axis === "x" ? sx : sy));
  return {
    top: px(e.top, e.top_ratio, "y"), right: px(e.right, e.right_ratio, "x"),
    bottom: px(e.bottom, e.bottom_ratio, "y"), left: px(e.left, e.left_ratio, "x"),
    kind: e.kind || "hard",
    source: "platform", centreBias: !!e.centre_bias,
    verification: e.verification, sourceUrl: e.source,
    lastChecked: e.last_checked, note: e.note,
  };
}

function houseMargin(w, h, why) {
  const m = Math.round(Math.min(w, h) * BRAND_MARGIN_RATIO);
  return {
    top: m, right: m, bottom: m, left: m,
    kind: "soft", source: "brand", centreBias: false,
    verification: "brand", sourceUrl: null, lastChecked: SAFE_ZONE_VERIFIED,
    note: why || "No platform safe zone published for this placement. Studio margin applied.",
  };
}

/* The only function anything should call. Returns the box in pixels of the
   target canvas, says plainly whether it is a platform figure or a house
   margin, and says whether it is allowed to block an export. It never
   invents a platform number. */
export function lookupSafeZone(platform, placement, w, h) {
  const e = SAFE_ZONES[K(platform, placement)];
  if (e) return scaled(e, w, h);
  if (NO_PLATFORM_UI.test(String(platform || "").trim()))
    return houseMargin(w, h, "Nothing is drawn over this surface, so there is no platform safe zone. Studio margin applied.");
  if (Math.abs(h / w - 16 / 9) < 0.06)
    return scaled(UNIVERSAL_9_16, w, h);
  return houseMargin(w, h);
}

/* Used by the watcher and by the studio's self-check. */
export function allEntries() {
  return Object.entries(SAFE_ZONES).map(([k, v]) => ({ key: k, ...v }));
}

/* =====================================================================
   CHANGELOG
   2.0.0  2026-08-10  Re-verified against the platforms' own documentation.
                      META: Stories bottom corrected from 20% (384px) to 35%
                      (672px). Meta now publishes ONE 9:16 rule, 14/35/6,
                      covering Stories, Reels, Facebook Stories, Facebook
                      Reels and 9:16 Instagram Feed. Both entries move from
                      secondary to verified. Anything built to the old 20%
                      figure had 456px of creative sitting under the
                      interface. Meta's disclaimer variant wants 40%.
                      TIKTOK: downgraded from secondary to consensus. TikTok
                      publishes no pixel values anywhere; the geometry ships
                      only as template overlays, and the third-party numbers
                      disagree by about 2.4x on every edge. This file now
                      carries the strictest cited values and says plainly
                      that they are not a platform figure.
                      TABOOLA: replaced the invented 25% with Taboola's own
                      published guard, 300px per side on a 1067px image,
                      which is 28.1%. Vertical relaxed to 6%: the auto-crop
                      eats width, not height.
                      OUTBRAIN: 16.7% per side, derived from what a 3:2 file
                      loses when a widget crops it square, and labelled as
                      derived rather than published.
   1.1.0  2026-08-10  Split every zone into HARD and SOFT. Only a platform's
                      own reserved interface strip may block an export; the
                      Plus house margin and the native centre-bias guides now
                      shape the layout and report, but never delete a file.
                      Web, email and internal display surfaces are explicitly
                      house-margin only, so a 9:16 web hero no longer inherits
                      the social union box. Taboola and Outbrain centre-bias
                      relaxed from 25% to 16% per side: 25% was a guess that
                      left barely half the frame usable.
   1.0.0  2026-08-06  First hard-coded table. Meta Stories and Reels, TikTok
                      In-Feed, Taboola and Outbrain recrop margins, and the
                      universal 9:16 union box. Meta and TikTok figures are
                      secondary sourced: the platforms' own pages were not
                      reachable at the time of research.
   ===================================================================== */
