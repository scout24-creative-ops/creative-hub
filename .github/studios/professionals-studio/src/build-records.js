/* =========================================================================
   THE BUILD RECORD STORE.

   ONE DOOR. Everything the Studio remembers about the quality of a set it
   has built comes through this module, and nothing else in the product
   touches IndexedDB. A learning layer that wants to know which sets a
   person approved, and what the engine measured while building them, reads
   `allBuildRecords()` and never has to know where any of it lives.

   WHY NOT localStorage, WHICH IS WHERE EVERYTHING ELSE HERE LIVES.
   `professionals_studio_history` is a couple of dozen rows of brief, concepts and
   three thumbnails, and it already costs a full JSON.stringify of the whole
   list on the main thread every time a set is built. A quality record is a
   different animal: one build is 244 files and one measurement report per
   file, and localStorage is about five megabytes, synchronous, and stores
   strings only. Adding this to that key would evict the history inside a
   handful of builds, block the main thread while doing it, and force every
   number through a string on the way in and out. IndexedDB is asynchronous,
   stores structured objects as they are, and is measured in hundreds of
   megabytes. This store is ADDITIVE: it never reads, writes or trims
   `professionals_studio_history`, which Deck Studio depends on.

   NOTHING HERE IS LOAD BEARING FOR A BUILD. Every call can fail, and the
   caller is expected to say so rather than pretend. A browser in private
   mode, a browser with storage disabled, a full quota, a database blocked
   by another tab mid-upgrade: each rejects with a sentence a person can
   read, and the set the user just built is untouched either way.

   No dependencies, no build step, plain IndexedDB. Importing this module
   touches no browser API, so it is safe to load anywhere, including Node.
   ========================================================================= */

export const DB_NAME = "professionals_studio";
export const DB_VERSION = 1;
export const STORE = "build_records";
export const RECORD_SCHEMA = 1;

/* Room for a long history of judged sets without ever being the reason a
   browser runs out of room. Sixty builds is more than a year of campaigns
   at the rate this Studio is used, and trimming only ever happens when the
   quota actually says no. */
export const KEEP_RECORDS = 60;

/* IndexedDB has a failure mode that is worse than an error: it hangs. An
   open blocked by another tab mid-upgrade never calls back at all. Nothing
   in a build may wait on that forever, so every call has a deadline. */
const TIMEOUT_MS = 6000;

export const VERDICTS = ["approved", "rejected"];

/* ---------------------------------------------------------------- shaping */

/* PURE. Takes whatever a caller assembled and returns the record this store
   promises to hold, with every field present and of the type it claims. It
   touches no browser API and no clock beyond `now`, so it can be tested and
   reasoned about on its own.

   `design`, `style` and `params` describe THE DESIGN THE PERSON CHOSE, which
   is one thing even when the structure was rotated across the placements.
   What each individual file actually used is on that file's own entry in
   `perAssetMetrics`, and `rotation` says which of the two readings applies. */
export function makeBuildRecord(input, now) {
  const o = obj(input);
  const at = str(o.at) || new Date(now == null ? Date.now() : now).toISOString();
  const verdict = VERDICTS.includes(o.verdict) ? o.verdict : null;
  return {
    schema: RECORD_SCHEMA,
    buildId: str(o.buildId),
    at,
    design: str(o.design) || null,
    designReference: str(o.designReference) || null,
    style: str(o.style) || null,
    /* A COPY, not the caller's object. The caller hands us the params off the
       DESIGNS entry in the engine, which is a module-level constant: holding
       that by reference would make a record a live view on the library rather
       than a snapshot of what was built, in both directions. Same reason
       `assetEntry` copies its metrics below. */
    params: { ...obj(o.params) },
    rotation: {
      rotate: !!obj(o.rotation).rotate,
      /* Which structures the set actually put on screen, in the engine's
         own vocabulary. On an unrotated set this is one entry long. */
      structures: arr(obj(o.rotation).structures).map(String).filter(Boolean),
    },
    verdict,
    /* A verdict time without a verdict is a lie about a decision nobody
       made, so the two travel together or neither does. */
    verdictAt: verdict ? (str(o.verdictAt) || new Date(now == null ? Date.now() : now).toISOString()) : null,
    product: str(o.product) || null,
    /* WHAT THE LANDING PAGE AND THE EMAIL SAID. Every set carries two of
       them and until now the record described the ads only, so a record
       could not answer the first question anyone asks about a set they
       approved: what did the page say. Shaped rather than trusted, and
       copied for the same reason `params` is — a record is a snapshot, and
       `state.campaign` is a live object the next keystroke edits.

       A record written before this existed has none, and `null` is the
       honest answer for it: that build ran on the product's own proof
       points and nothing was ever entered. */
    campaign: campaignOf(o.campaign),
    concepts: arr(o.concepts).map(Number).filter(n => Number.isFinite(n)),
    files: num(o.files),
    blocked: num(o.blocked),
    placements: num(o.placements),
    /* THE BUILD'S OWN COUNTS, carried whole rather than counted again by
       every reader. `studio-facts.js`'s `buildFacts` is written once by the
       build and persisted both here and onto the history row, which is what
       stops the record saying `files: built.length` (ads only) while the row
       for the same build says `built.length + pages.length`. A copy, for the
       same reason `params` is copied: a record is a snapshot, not a live
       view on whatever the caller still holds. */
    facts: o.facts && typeof o.facts === "object" ? JSON.parse(JSON.stringify(o.facts)) : null,
    perAssetMetrics: arr(o.perAssetMetrics).filter(e => e && typeof e === "object").map(assetEntry),
  };
}

/* The four campaign slots, shaped. `over` is keyed by concept id and holds
   only the three words a person can override, so a caller handing over a
   whole concept cannot smuggle a photograph's base64 into a record. */
function campaignOf(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const over = {};
  for (const [id, o] of Object.entries(obj(v.over))) {
    const e = obj(o);
    const one = {};
    for (const k of ["headline", "subline", "cta"]) if (str(e[k])) one[k] = str(e[k]);
    if (Object.keys(one).length) over[id] = one;
  }
  return {
    url: str(v.url),
    proof: arr(v.proof).map(p => ({
      short: str(obj(p).short), line: str(obj(p).line), on: obj(p).on !== false,
    })),
    over,
  };
}

/* One file, one measurement. The engine already reports all of this from
   composeAsset; this only names where the file was going and which design
   drew it, because a metric with no placement attached cannot be learned
   from.

   `style` IS THE STRUCTURE THAT WAS DRAWN, not the one that was asked for.
   The engine substitutes: a concept with no photograph is set
   typographically, a canvas too small for a sentence runs as an end frame,
   a clean variant carries no structure at all, and a file that was withheld
   was never composed and so has none. `requestedStyle` keeps the intention
   next to it, and `substituted` says the two disagreed, because "we asked
   for the poster and drew the typographic" is the row a learning layer most
   wants and it cannot be reconstructed from either field alone. */
function assetEntry(e) {
  const m = obj(e.metrics);
  const style = str(e.style) || null;
  const requested = str(e.requestedStyle) || null;
  return {
    concept: num(e.concept),
    platform: str(e.platform),
    placement: str(e.placement),
    w: num(e.w), h: num(e.h),
    variant: str(e.variant),
    design: str(e.design) || null,
    style,
    requestedStyle: requested,
    substituted: !!(style && requested && style !== requested),
    blocked: !!e.blocked,
    blockedReason: e.blockedReason ? str(e.blockedReason) : null,
    bytes: num(e.bytes),
    metrics: { ...m },
  };
}

const obj = v => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
const arr = v => (Array.isArray(v) ? v : []);
const str = v => (v == null ? "" : String(v));
const num = v => (Number.isFinite(+v) ? +v : 0);

/* ------------------------------------------------------------- the store */

/* Is there anything to talk to at all. Cheap, synchronous, and deliberately
   not a promise: it answers whether to offer the feature, not whether a
   particular write will land. Only an actual call can answer that. */
export function recordsAvailable() {
  try { return typeof indexedDB !== "undefined" && indexedDB != null; }
  catch (e) { return false; }   /* some browsers throw on the property itself */
}

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  if (!recordsAvailable()) return Promise.reject(new Error("this browser offers no IndexedDB, so nothing can be stored"));
  const p = new Promise((resolve, reject) => {
    let req;
    try { req = indexedDB.open(DB_NAME, DB_VERSION); }
    catch (e) { reject(new Error(describe(e))); return; }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "buildId" });
        /* Age order without reading anything. `trimOldest` walks this to find
           what goes; it is the reason the housekeeping does not have to
           deserialise every measurement in the store to delete one record. */
        os.createIndex("at", "at", { unique: false });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      /* Another tab upgrading the schema must not find this connection in
         its way: let go, and let the next call open again. */
      db.onversionchange = () => { try { db.close(); } catch (e) {} dbPromise = null; };
      db.onclose = () => { dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => reject(new Error(describe(req.error)));
    req.onblocked = () => reject(new Error("another tab is holding an older version of the database open"));
  });
  /* A failed open must not be remembered as the answer forever: a private
     window that the user leaves, or a quota that gets cleared, deserves a
     second attempt on the next call. */
  p.catch(() => { if (dbPromise === p) dbPromise = null; });
  dbPromise = p;
  return p;
}

function run(mode, work) {
  /* The deadline needs a handle on the transaction, not just on the promise:
     giving up on a write is not the same as stopping it, and only one of the
     two is something we can honestly report. */
  let tx = null;
  const p = (async () => {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      let t;
      try { t = db.transaction(STORE, mode); }
      catch (e) { reject(new Error(describe(e))); return; }
      tx = t;
      let out;
      t.oncomplete = () => resolve(out);
      t.onerror = () => reject(new Error(describe(t.error)));
      t.onabort = () => reject(new Error(describe(t.error)));
      try { work(t.objectStore(STORE), v => { out = v; }); }
      catch (e) { try { t.abort(); } catch (_) {} reject(new Error(describe(e))); }
    });
  })();
  return withDeadline(p, () => tx);
}

/* The deadline exists because IndexedDB can hang, and nothing in a build may
   wait forever. But a deadline is the absence of an answer, not an answer, and
   reporting "not stored" for a write that was merely slow is the one outcome
   worse than either the wait or the failure: it tells a person their
   measurements are gone while they sit in the database.

   So the deadline stops the write rather than merely stopping the wait. Aborting
   is what makes the failure true, and the browser's refusal to abort is what
   tells us it is not. */
function withDeadline(promise, transaction) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const finish = (fn, v) => { if (settled) return; settled = true; clearTimeout(timer); fn(v); };
    const late = () => new Error(`the browser's database did not answer within ${Math.round(TIMEOUT_MS / 1000)} seconds`);
    const expire = () => {
      const t = transaction();
      /* No transaction yet means the open itself is hanging, which is the
         blocked-by-another-tab case: nothing was written, and saying so is true. */
      if (!t) { finish(reject, late()); return; }
      try { t.abort(); }
      catch (e) {
        /* The only thing that refuses an abort is a transaction that has already
           finished — the write committed, or failed on its own terms. Either way
           the real answer is a heartbeat away and it is the one worth reporting,
           so wait for it. Not forever, though: one more deadline, and if even
           that passes the wait is the failure. */
        timer = setTimeout(() => finish(reject, late()), TIMEOUT_MS);
        return;
      }
      /* Aborted, so it rolled back, so the failure being reported is now a fact.
         The abort event that follows finds this promise already settled. */
      finish(reject, late());
    };
    timer = setTimeout(expire, TIMEOUT_MS);
    promise.then(v => finish(resolve, v), e => finish(reject, e));
  });
}

/* The reason, in words, because "InvalidStateError" on screen tells a person
   nothing about what to do next. */
function describe(err) {
  const name = err && err.name ? String(err.name) : "";
  const msg = err && err.message ? String(err.message) : "";
  if (name === "QuotaExceededError") return "the browser's storage for this site is full";
  if (name === "SecurityError" || name === "InvalidStateError")
    return "the browser refused to open its database, which is what a private window usually does";
  if (name === "VersionError") return "a newer version of this database already exists in this browser";
  if (name === "AbortError") return "the browser cancelled the write";
  return msg || name || "the browser gave no reason";
}

/* -------------------------------------------------------------- the door */

/* Write the record, keyed by its build id, so saving the same build twice
   updates it rather than growing a second copy. That is what makes a verdict
   arriving minutes after the build a plain second put with no read first. */
export async function putBuildRecord(record) {
  const rec = makeBuildRecord(record);
  if (!rec.buildId) throw new Error("a build record with no build id cannot be stored");
  try {
    await run("readwrite", (os) => { os.put(rec); });
  } catch (e) {
    /* One honest attempt to make room, then the truth. Only the quota gets
       a retry: everything else would fail again for the same reason. */
    if (!/storage for this site is full/.test(e.message)) throw e;
    await trimOldest(Math.ceil(KEEP_RECORDS / 3));
    await run("readwrite", (os) => { os.put(rec); });
  }
  /* Counting is cheap; reading sixty records to find out whether there are
     sixty-one is not, so the housekeeping asks first. A failure here is not
     the caller's problem: the record is already stored. */
  try {
    const n = await run("readonly", (os, done) => {
      const r = os.count();
      r.onsuccess = () => done(r.result || 0);
    });
    if (n > KEEP_RECORDS) await trimOldest(n - KEEP_RECORDS);
  } catch (e) { /* the store is full or gone; the record above still landed */ }
  return rec;
}

/* The verdict is a whole-record write, not a read-modify-write, because the
   caller is holding the record it built and a put is idempotent. It also
   means a verdict still lands when the write at build time never did. */
export async function setBuildVerdict(record, verdict, now) {
  if (!VERDICTS.includes(verdict)) throw new Error(`"${verdict}" is not a verdict this store knows`);
  return putBuildRecord({ ...record, verdict, verdictAt: new Date(now == null ? Date.now() : now).toISOString() });
}

export async function getBuildRecord(buildId) {
  return run("readonly", (os, done) => {
    const r = os.get(String(buildId));
    r.onsuccess = () => done(r.result || null);
  });
}

/* Newest first, which is the order every caller has wanted so far. */
export async function allBuildRecords() {
  const list = await run("readonly", (os, done) => {
    const r = os.getAll();
    r.onsuccess = () => done(r.result || []);
  });
  return (list || []).sort((a, b) => String(b.at).localeCompare(String(a.at)));
}

/* Only the sets somebody actually judged. This is the learning set. */
export async function judgedBuildRecords() {
  return (await allBuildRecords()).filter(r => VERDICTS.includes(r.verdict));
}

export async function deleteBuildRecord(buildId) {
  return run("readwrite", (os) => { os.delete(String(buildId)); });
}

export async function clearBuildRecords() {
  return run("readwrite", (os) => { os.clear(); });
}

/* Oldest out first, and a judged record is worth more than an unjudged one,
   so an approved set is the last thing to go.

   THROUGH THE INDEX, which is what the index is for. Asking for every record
   to find the oldest one deserialises sixty builds of per-file measurements —
   at 244 files a build, tens of thousands of rows on the main thread — to
   delete one of them. A cursor on `at` arrives in age order and stops as soon
   as it has found enough to make the room, which on a routine trim is one
   record. */
async function trimOldest(n) {
  const want = Math.max(0, Math.floor(num(n)));
  if (!want) return 0;
  const doomed = await run("readonly", (os, done) => {
    const going = [];    /* unjudged, oldest first */
    const spared = [];   /* judged, oldest first: only if the above runs out */
    const r = os.index("at").openCursor();
    r.onsuccess = () => {
      const c = r.result;
      if (!c || going.length >= want) { done(going.concat(spared).slice(0, want)); return; }
      (judged(c.value) ? spared : going).push(String(c.primaryKey));
      c.continue();
    };
  });
  for (const id of doomed) {
    try { await deleteBuildRecord(id); } catch (e) { /* nothing left to try */ }
  }
  return doomed.length;
}
const judged = r => (VERDICTS.includes(r && r.verdict) ? 1 : 0);
