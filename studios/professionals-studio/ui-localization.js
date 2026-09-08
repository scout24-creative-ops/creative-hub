(function () {
  // A compatibility layer for the Studio's imperative UI. Only reviewed,
  // complete messages and anchored templates are translated, never free copy.
  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const attributes = ["title", "aria-label", "placeholder", "alt"];
  const excluded = 'script,style,textarea,code,pre,iframe,canvas,[data-no-translate],[translate="no"],[contenteditable]:not([contenteditable="false"])';
  const normalize = text => String(text).replace(/\s+/g, " ").trim();
  const language = () => document.documentElement.lang === "de" ? "de" : "en";

  function translate(text, target = language()) {
    const raw = String(text ?? "");
    if (target !== "de" || !raw.trim()) return raw;
    const key = normalize(raw);
    const catalogs = window.ProfessionalsLocaleCatalogs || [];
    let translated;
    // Exact entries always win over patterns from any catalogue.
    for (const catalog of catalogs) {
      if (Object.prototype.hasOwnProperty.call(catalog.messages || {}, key)) {
        translated = catalog.messages[key]; break;
      }
    }
    if (translated === undefined) {
      for (const catalog of catalogs) {
        for (const [pattern, replacement] of catalog.patterns || []) {
          pattern.lastIndex = 0;
          const match = pattern.exec(key);
          if (!match || match[0] !== key) continue;
          translated = typeof replacement === "function" ? replacement(...match.slice(1)) : replacement;
          break;
        }
        if (translated !== undefined) break;
      }
    }
    if (translated === undefined) return raw;
    return (raw.match(/^\s*/)?.[0] || "") + translated + (raw.match(/\s*$/)?.[0] || "");
  }

  function sourceAndOutput(current, previous) {
    const source = previous && current === previous.output ? previous.source : current;
    return { source, output: translate(source) };
  }

  function translateText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest(excluded) || parent.closest('[data-en][data-de]')) return;
    const record = sourceAndOutput(node.nodeValue, originals.get(node));
    originals.set(node, record);
    if (node.nodeValue !== record.output) node.nodeValue = record.output;
  }

  function translateAttributes(element) {
    if (element.closest(excluded)) return;
    // An option without value uses its label as the submitted value. Lock
    // that original value before changing the label's presentation.
    if (element.tagName === 'OPTION' && !element.hasAttribute('value')) element.setAttribute('value', sourceText(element));
    let records = attributeOriginals.get(element);
    if (!records) { records = {}; attributeOriginals.set(element, records); }
    for (const attribute of attributes) {
      if (!element.hasAttribute(attribute)) continue;
      if (attribute === 'aria-label' && element.hasAttribute('data-en-label')) continue;
      if (attribute === 'placeholder' && element.hasAttribute('data-en-placeholder')) continue;
      const record = sourceAndOutput(element.getAttribute(attribute), records[attribute]);
      records[attribute] = record;
      if (element.getAttribute(attribute) !== record.output) element.setAttribute(attribute, record.output);
    }
  }

  function refresh(root = document.body) {
    if (!root) return;
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1 && root.matches(excluded)) return;
    if (root.nodeType === 1) translateAttributes(root);
    for (const child of root.childNodes) refresh(child);
  }

  function sourceText(element) {
    if (!element) return "";
    if (element.nodeType === 3) return originals.get(element)?.source ?? element.nodeValue;
    return Array.from(element.childNodes || [], sourceText).join("");
  }

  function start() {
    refresh();
    if (!window.MutationObserver || !document.body) return;
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") translateText(record.target);
        else if (record.type === "attributes") translateAttributes(record.target);
        else for (const added of record.addedNodes) refresh(added);
      }
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true,
      attributes:true, attributeFilter:attributes});
  }

  window.ProfessionalsUI = {translate, refresh, sourceText};
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, {once:true});
  else start();
})();
