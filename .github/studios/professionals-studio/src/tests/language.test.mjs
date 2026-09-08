import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../language.js", import.meta.url), "utf8");

function element(dataset) {
  return {
    dataset, textContent: "", attributes: {}, listeners: [],
    classList: { toggle() {} },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.listeners.push({ name, callback }); },
    click() { this.listeners.filter(item => item.name === "click").forEach(item => item.callback()); },
  };
}

function boot(storage) {
  const copy = element({ en: "Open Studio", de: "Studio öffnen" });
  const field = element({ enPlaceholder: "Brief", dePlaceholder: "Briefing", enLabel: "Your brief", deLabel: "Ihr Briefing" });
  const buttons = [element({ language: "en" }), element({ language: "de" })];
  const events = [];
  const document = {
    readyState: "complete", documentElement: { lang: "en" },
    querySelector: () => buttons[0],
    querySelectorAll(selector) {
      if (selector === "[data-language]") return buttons;
      if (selector === "[data-en][data-de]") return [copy];
      return [field];
    },
  };
  const window = { dispatchEvent: event => events.push(event) };
  Object.defineProperty(window, "localStorage", { get: () => {
    if (storage instanceof Error) throw storage;
    return storage;
  } });
  vm.runInNewContext(source, { document, window, WeakSet, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } } });
  return { api: window.ProfessionalsLanguage, document, copy, field, buttons, events };
}

test("restores German and translates text, placeholders and accessible labels", () => {
  const values = new Map([["professionals_studio_language", "de"]]);
  const app = boot({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) });
  assert.equal(app.copy.textContent, "Studio öffnen");
  assert.equal(app.field.attributes.placeholder, "Briefing");
  assert.equal(app.field.attributes["aria-label"], "Ihr Briefing");
  assert.equal(app.buttons[1].attributes["aria-pressed"], "true");
  app.buttons[0].click();
  assert.equal(app.document.documentElement.lang, "en");
  assert.equal(values.get("professionals_studio_language"), "en");
});

test("blocked localStorage property does not stop page initialization or switching", () => {
  const app = boot(new Error("SecurityError: storage blocked"));
  app.buttons[1].click();
  assert.equal(app.copy.textContent, "Studio öffnen");
  assert.equal(app.api.get(), "de");
  assert.equal(app.events.at(-1).detail.language, "de");
});

test("blocked storage methods preserve the choice for this page", () => {
  const app = boot({ getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("QuotaExceededError"); } });
  app.api.set("de");
  app.api.init();
  assert.equal(app.api.get(), "de");
  assert.equal(app.copy.textContent, "Studio öffnen");
});

test("failed write cannot revert the current choice to an older stored value", () => {
  const app = boot({ getItem: () => "en", setItem() { throw new Error("QuotaExceededError"); } });
  app.api.set("de");
  assert.equal(app.api.get(), "de");
  app.api.init();
  assert.equal(app.document.documentElement.lang, "de");
});

test("reinitializing does not duplicate click listeners and binds new controls", () => {
  const app = boot({ getItem: () => null, setItem() {} });
  app.api.init();
  app.api.init();
  assert.equal(app.buttons[0].listeners.length, 1);
  const count = app.events.length;
  app.buttons[1].click();
  assert.equal(app.events.length, count + 1);
  const added = element({ language: "en" });
  app.buttons.push(added);
  app.api.init();
  added.click();
  assert.equal(app.api.get(), "en");
});

test("unsupported stored or requested languages fall back to English", () => {
  const app = boot({ getItem: () => "not a language", setItem() {} });
  assert.equal(app.api.get(), "en");
  app.api.set("de");
  app.api.set("fr");
  assert.equal(app.api.get(), "en");
});
