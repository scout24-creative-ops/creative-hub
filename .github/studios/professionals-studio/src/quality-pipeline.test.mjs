import test from "node:test";
import assert from "node:assert/strict";
import { adaptFamily, familySafe, fitAspect, SOFT_UPSCALE } from "./size-adapter.js";
import { fileEnlargement, enlargementFacts, softnessOf, safeZoneFacts } from "./studio-facts.js";
import { lookupSafeZone } from "./safe-zones.js";

const base = {
  ratio: "1:1", masterW: 1080, masterH: 1080, srcW: 2400, srcH: 2400,
  subject: { x0: .3, y0: .3, x1: .7, y1: .7 }, focal: { x: .5, y: .5 },
  placements: [{ platform: "Meta", placement: "Facebook Feed", w: 1080, h: 1080 }],
};

test("unknown analysis and unmatched placements cannot be marked served", () => {
  assert.equal(adaptFamily(base).served, true);
  assert.equal(adaptFamily({ ...base, measured: false }).served, false);
  const outlier = adaptFamily({ ...base, placements: [{ w: 300, h: 250 }] });
  assert.equal(outlier.detail, "unknown");
  assert.equal(outlier.served, false);
});

test("crop guides combine all platforms regardless of placement order", () => {
  const placements = [
    { platform: "Outbrain", placement: "Standard Native / In the Feed" },
    { platform: "Taboola", placement: "Native thumbnail (primary)" },
  ];
  const family = { master_w: 1200, master_h: 800, placements };
  const forward = familySafe(family);
  assert.deepEqual(forward, familySafe({ ...family, placements: [...placements].reverse() }));
  for (const p of placements) {
    const individual = lookupSafeZone(p.platform, p.placement, 1200, 800);
    for (const edge of ["top", "right", "bottom", "left"]) assert.ok(forward[edge] >= individual[edge]);
  }
  const facts = safeZoneFacts(family);
  for (const edge of ["top", "right", "bottom", "left"]) assert.equal(facts.box[edge], forward[edge]);
});

test("invalid or missing resolution is never reported as native detail", () => {
  for (const upscale of [null, undefined, NaN, Infinity, -1, 0, "1.5"]) {
    assert.equal(softnessOf(upscale), "unknown");
    assert.equal(fileEnlargement({ upscale, hasPhoto: true }).band, "unknown");
  }
  assert.equal(fileEnlargement({ upscale: 9, hasPhoto: false }).band, "none");
  assert.equal(fileEnlargement({ upscale: 9, hasPhoto: false }).warns, false);
});

test("enlargement warning identifies the exact original needed for this composition", () => {
  const fact = fileEnlargement({ upscale: 1.5, hasPhoto: true, source: { w: 800, h: 600 } });
  assert.equal(fact.warns, true);
  assert.deepEqual(fact.needSource, { w: 1200, h: 900 });
  assert.match(fact.sentence, /1200×900 pixels/);
  assert.match(fact.sentence, /smaller image area/);
  assert.doesNotMatch(fact.sentence, /will look soft/);
});

test("a reduced master never triggers a request to replace an already sufficient original", () => {
  const verdict = adaptFamily({ ...base, ratio: "3:2", masterW: 1200, masterH: 800,
    srcW: 6000, srcH: 4000, placements: [{ platform: "Web", placement: "Hero", w: 1800, h: 1200 }] });
  assert.equal(verdict.upscale, 1.5);
  assert.equal(verdict.sourceUpscale, .3);
  assert.equal(verdict.needSource, null);
  assert.match(enlargementFacts(verdict).sentence, /uses the original directly/);
  assert.ok(verdict.requirements.every(line => !line.includes("source of at least")));
});

test("threshold decisions use the unrounded render measurement", () => {
  assert.equal(fileEnlargement({ upscale: SOFT_UPSCALE }).warns, false);
  assert.equal(fileEnlargement({ upscale: SOFT_UPSCALE + .00001 }).warns, true);
  assert.equal(fileEnlargement({ upscale: SOFT_UPSCALE - .00001 }).warns, false);
});

test("3,456 source and crop combinations keep master bounds and served claims honest", () => {
  let checked = 0;
  for (const srcW of [320, 800, 1600, 4000]) for (const srcH of [320, 800, 1600, 4000]) {
    for (const [masterW, masterH] of [[1080, 1080], [1080, 1350], [1080, 1920], [1920, 1080]]) {
      for (const span of [.1, .5, .9]) for (const x of [.05, .5, .95]) for (const y of [.05, .5, .95]) {
        for (const measured of [true, false]) {
          const subject = { x0: Math.max(0, x - span / 2), x1: Math.min(1, x + span / 2), y0: Math.max(0, y - span / 2), y1: Math.min(1, y + span / 2) };
          const verdict = adaptFamily({ ...base, srcW, srcH, masterW, masterH, subject, measured,
            placements: [{ platform: "Meta", placement: "Feed", w: masterW, h: masterH }] });
          const win = fitAspect(srcW, srcH, masterW / masterH);
          assert.ok(verdict.master.w <= Math.round(win.w) && verdict.master.h <= Math.round(win.h));
          assert.ok(verdict.window.x >= 0 && verdict.window.y >= 0);
          assert.ok(verdict.window.x + verdict.window.w <= srcW + 1e-8);
          assert.ok(verdict.window.y + verdict.window.h <= srcH + 1e-8);
          if (verdict.served) {
            assert.equal(measured, true);
            assert.equal(verdict.cuts.length, 0);
            assert.ok(["native", "adequate"].includes(verdict.detail));
          }
          checked++;
        }
      }
    }
  }
  assert.equal(checked, 3456);
});
