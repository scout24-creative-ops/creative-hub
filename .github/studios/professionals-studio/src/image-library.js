/* A small, browser-local image library.  Keeping generated image data and its
   production context together makes an image reusable without sending it to a
   third party or pretending there is already a shared DAM behind the Studio. */
const DB = "professionals_studio_image_library";
const STORE = "images";

function openDb() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error("IndexedDB is unavailable in this browser."));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("createdAt", "createdAt");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Could not open the image library."));
  });
}

function transact(mode, work) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const result = work(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error("Image library transaction failed.")); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error("Image library transaction stopped.")); };
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
  return transact("readonly", store => {
    const req = store.getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve((req.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
      req.onerror = () => reject(req.error || new Error("Could not read the image library."));
    });
  });
}
