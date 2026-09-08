import assert from "node:assert/strict";
import test from "node:test";

let serial = 0;
const flush = async () => { for (let n = 0; n < 5; n++) await Promise.resolve(); };

async function isolated(run) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let next = 0;
  globalThis.setTimeout = callback => { const id = ++next; timers.set(id, callback); return id; };
  globalThis.clearTimeout = id => timers.delete(id);
  const db = {
    closeCount: 0, transactions: [],
    close() { this.closeCount++; },
    transaction() {
      const read = {};
      const tx = {
        writes: [], aborted: false, read,
        objectStore() { return { put: value => tx.writes.push(value), getAll: () => read, get: () => read }; },
        abort() { tx.aborted = true; queueMicrotask(() => tx.onabort?.()); },
      };
      this.transactions.push(tx);
      return tx;
    },
  };
  const opens = [];
  const harness = {
    db, opens, timers,
    open() { const req = {}; opens.push(req); return req; },
    async ready(index = opens.length - 1) { opens[index].result = db; opens[index].onsuccess(); await flush(); },
    expire() { for (const [id, callback] of [...timers]) { if (timers.has(id)) { timers.delete(id); callback(); } } },
    async load(name) { return import(new URL(`../${name}.js?storage-test=${++serial}`, import.meta.url)); },
  };
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, writable: true, value: harness });
  try { await run(harness); }
  finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    if (descriptor) Object.defineProperty(globalThis, "indexedDB", descriptor);
    else delete globalThis.indexedDB;
  }
}

test("image storage waits for commit and closes the connection", () => isolated(async h => {
  const api = await h.load("image-library");
  const record = { id: "image-1", src: "data:image/png;base64,test" };
  let settled = false;
  const promise = api.saveStudioImage(record).then(value => { settled = true; return value; });
  await h.ready();
  const tx = h.db.transactions[0];
  assert.deepEqual(tx.writes, [record]);
  assert.equal(settled, false);
  tx.oncomplete();
  assert.equal(await promise, record);
  assert.equal(h.db.closeCount, 1);
  assert.equal(h.timers.size, 0);
}));

test("image library reads newest first after the read transaction completes", () => isolated(async h => {
  const api = await h.load("image-library");
  const promise = api.allStudioImages();
  await h.ready();
  const tx = h.db.transactions[0];
  tx.read.result = [{ id: "old", createdAt: "2026-01-01" }, { id: "new", createdAt: "2026-09-07" }];
  tx.read.onsuccess(); tx.oncomplete();
  assert.deepEqual((await promise).map(row => row.id), ["new", "old"]);
  assert.equal(h.db.closeCount, 1);
}));

test("blocked image database rejects promptly and closes a late connection", () => isolated(async h => {
  const api = await h.load("image-library");
  const result = api.saveStudioImage({ id: "blocked" }).catch(error => error);
  h.opens[0].onblocked();
  assert.match((await result).message, /Another tab/);
  await h.ready();
  assert.equal(h.db.transactions.length, 0);
  assert.equal(h.db.closeCount, 1);
  assert.equal(h.timers.size, 0);
}));

test("an expired image open cannot start a late write", () => isolated(async h => {
  const api = await h.load("image-library");
  const result = api.saveStudioImage({ id: "late" }).catch(error => error);
  h.expire();
  assert.match((await result).message, /did not open in time/);
  await h.ready();
  assert.equal(h.db.transactions.length, 0);
  assert.equal(h.db.closeCount, 1);
}));

test("a stalled image transaction aborts and closes at its deadline", () => isolated(async h => {
  const api = await h.load("image-library");
  const result = api.saveStudioImage({ id: "stalled" }).catch(error => error);
  await h.ready(); h.expire();
  assert.match((await result).message, /did not respond in time/);
  assert.equal(h.db.transactions[0].aborted, true);
  assert.equal(h.db.closeCount, 1);
}));

test("synchronous image storage errors close the connection", () => isolated(async h => {
  const api = await h.load("image-library");
  h.db.transaction = () => { throw new Error("Version changed"); };
  const result = api.saveStudioImage({ id: "bad" }).catch(error => error);
  await h.ready();
  assert.match((await result).message, /Version changed/);
  assert.equal(h.db.closeCount, 1);
  assert.equal(h.timers.size, 0);
}));

test("both stores tolerate an IndexedDB property that throws", () => isolated(async h => {
  const images = await h.load("image-library");
  const records = await h.load("build-records");
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, get() { throw new Error("Storage disabled"); } });
  await assert.rejects(images.allStudioImages(), /Storage disabled/);
  await assert.rejects(records.getBuildRecord("none"), /no IndexedDB/);
  assert.equal(h.timers.size, 0);
}));

test("an expired build record open cannot write later and the next call retries", () => isolated(async h => {
  const api = await h.load("build-records");
  const result = api.putBuildRecord({ buildId: "late" }).catch(error => error);
  h.expire();
  assert.match((await result).message, /did not (?:open|answer)/);
  await h.ready();
  assert.equal(h.db.transactions.length, 0);
  assert.equal(h.db.closeCount, 1);
  const retry = api.getBuildRecord("missing");
  assert.equal(h.opens.length, 2);
  await h.ready();
  const tx = h.db.transactions[0];
  tx.read.result = null; tx.read.onsuccess(); tx.oncomplete();
  assert.equal(await retry, null);
}));

test("blocked build record open closes its eventual connection without writing", () => isolated(async h => {
  const api = await h.load("build-records");
  const result = api.putBuildRecord({ buildId: "blocked" }).catch(error => error);
  h.opens[0].onblocked();
  assert.match((await result).message, /another tab/);
  await h.ready();
  assert.equal(h.db.transactions.length, 0);
  assert.equal(h.db.closeCount, 1);
  assert.equal(h.timers.size, 0);
}));
