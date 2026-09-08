/* A small, browser-local image library.  Keeping generated image data and its
   production context together makes an image reusable without sending it to a
   third party or pretending there is already a shared DAM behind the Studio. */
const DB = "professionals_studio_image_library";
const STORE = "images";
const TIMEOUT_MS = 6000;

function openDb() {
  return new Promise((resolve, reject) => {
    let req;
    let settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; clearTimeout(timer); fn(value); };
    const timer = setTimeout(() => finish(reject, new Error("The image library did not open in time. Please try again.")), TIMEOUT_MS);
    try {
      if (!globalThis.indexedDB) throw new Error("The image library is unavailable in this browser.");
      req = indexedDB.open(DB, 1);
    } catch (error) { finish(reject, error); return; }
    req.onupgradeneeded = () => {
      if (settled) { try { req.transaction.abort(); } catch (error) {} return; }
      if (!req.result.objectStoreNames.contains(STORE)) {
        const store = req.result.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      if (settled) { db.close(); return; }
      db.onversionchange = () => db.close();
      finish(resolve, db);
    };
    req.onerror = () => finish(reject, req.error || new Error("Could not open the image library."));
    req.onblocked = () => finish(reject, new Error("Another tab is holding the image library open. Close that tab and try again."));
  });
}

function transact(mode, work) {
  return openDb().then(db => new Promise((resolve, reject) => {
    let tx, result, settled = false;
    const finish = (fn, value) => { if (settled) return; settled = true; clearTimeout(timer); db.close(); fn(value); };
    const timer = setTimeout(() => {
      try { tx?.abort(); } catch (error) {}
      finish(reject, new Error("The image library did not respond in time. Please try again."));
    }, TIMEOUT_MS);
    try {
      tx = db.transaction(STORE, mode);
      tx.oncomplete = () => finish(resolve, result);
      tx.onerror = () => finish(reject, tx.error || new Error("Image library transaction failed."));
      tx.onabort = () => finish(reject, tx.error || new Error("Image library transaction stopped."));
      work(tx.objectStore(STORE), value => { result = value; });
    } catch (error) {
      try { tx?.abort(); } catch (abortError) {}
      finish(reject, error);
    }
  }));
}

export function makeImageRecord({ src, concept, brief, imagery }) {
  return {
    id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `image-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    src,
    conceptId: concept && concept.id,
    headline: (concept && concept.headline_de) || "Untitled generated image",
    product: (brief && brief.product) || "",
    prompt: (imagery && imagery.prompt) || "",
    model: (imagery && imagery.model) || "",
    size: (imagery && imagery.returned) || (imagery && imagery.size) || "",
    reviewed: !!(imagery && imagery.reviewed),
  };
}

export async function saveStudioImage(record) {
  await transact("readwrite", store => store.put(record));
  return record;
}

export async function allStudioImages() {
  return transact("readonly", (store, done) => {
    const req = store.getAll();
    req.onsuccess = () => done((req.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
  });
}
