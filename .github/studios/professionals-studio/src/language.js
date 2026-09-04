(function () {
  const storageKey = "professionals_studio_language";

  function currentLanguage() {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "de" ? "de" : "en";
  }

  function applyLanguage(language) {
    const next = language === "de" ? "de" : "en";
    document.documentElement.lang = next;
    document.querySelectorAll("[data-en][data-de]").forEach((element) => {
      element.textContent = element.dataset[next];
    });
    document.querySelectorAll("[data-en-placeholder][data-de-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", element.dataset[`${next}Placeholder`]);
    });
    document.querySelectorAll("[data-en-label][data-de-label]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`${next}Label`]);
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === next;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });
    window.localStorage.setItem(storageKey, next);
    window.dispatchEvent(new CustomEvent("professionalslanguagechange", { detail: { language: next } }));
  }

  function initLanguageSwitch() {
    if (!document.querySelector("[data-language]")) {
      const style = document.createElement("style");
      style.textContent = ".global-language{position:fixed;top:16px;right:16px;z-index:1000;display:inline-flex;padding:4px;background:#fbf8f6;border:1px solid rgba(51,51,51,.14);border-radius:12px}.global-language button{font-family:'Make It Better';font-weight:700;font-size:13px;color:rgba(51,51,51,.66);border:0;border-radius:9px;background:transparent;padding:7px 11px;cursor:pointer}.global-language button.is-active{background:#fff;color:#333;box-shadow:0 1px 4px rgba(51,51,51,.1)}";
      document.head.appendChild(style);
      const control = document.createElement("div");
      control.className = "global-language";
      control.setAttribute("aria-label", "Language");
      control.innerHTML = '<button type="button" data-language="en">English</button><button type="button" data-language="de">Deutsch</button>';
      document.body.appendChild(control);
    }
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });
    applyLanguage(currentLanguage());
  }

  window.ProfessionalsLanguage = {
    get: currentLanguage,
    set: applyLanguage,
    init: initLanguageSwitch
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageSwitch);
  } else {
    initLanguageSwitch();
  }
})();
