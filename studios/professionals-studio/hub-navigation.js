(function () {
  "use strict";

  const script = document.currentScript;
  const scriptUrl = new URL(script?.src || "hub-navigation.js", window.location.href);
  const sourcePreview = window.location.pathname.includes("/.github/studios/");
  const hubRoot = new URL(sourcePreview ? "../../../../" : "../../", scriptUrl);
  const studioRoot = new URL("./", scriptUrl);
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("hub-navigation.css", scriptUrl).href;
  document.head.appendChild(stylesheet);

  const createLink = ({ label, labelDe, href, className, current }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.dataset.en = label;
    link.dataset.de = labelDe;
    if (className) link.className = className;
    if (current) link.setAttribute("aria-current", "page");
    return link;
  };

  const header = document.createElement("header");
  header.className = "creative-hub-nav";

  const brand = createLink({
    label: "Creative Hub",
    labelDe: "Creative Hub",
    href: hubRoot.href,
    className: "creative-hub-nav__brand",
  });
  brand.setAttribute("aria-label", "Back to the Creative Hub homepage");
  delete brand.dataset.en;
  delete brand.dataset.de;
  brand.textContent = "";
  brand.dataset.enLabel = "Back to the Creative Hub homepage";
  brand.dataset.deLabel = "Zurück zur Creative Hub Startseite";
  const logo = document.createElement("img");
  logo.src = new URL("assets/logos/immoscout24-horizontal-inverse.svg", studioRoot).href;
  logo.alt = "";
  const brandText = document.createElement("span");
  brandText.textContent = "Creative Hub";
  brand.append(logo, brandText);

  const navigation = document.createElement("nav");
  navigation.className = "creative-hub-nav__links";
  navigation.setAttribute("aria-label", "Professionals Studio navigation");
  navigation.append(
    createLink({
      label: "All agents",
      labelDe: "Alle Agents",
      href: new URL("?studio=agents", hubRoot).href,
    }),
    createLink({
      label: "Studio home",
      labelDe: "Studio-Start",
      href: new URL("index.html", studioRoot).href,
      current: currentPage === "index.html",
    }),
    createLink({
      label: "Concept Studio",
      labelDe: "Konzeptstudio",
      href: new URL("concept-studio.html", studioRoot).href,
      current: ["concept-studio.html", "conceptstudio.html", "assets.html", "formats.html"].includes(currentPage),
    }),
    createLink({
      label: "Brand guidelines",
      labelDe: "Markenrichtlinien",
      href: new URL("brand.html", studioRoot).href,
      current: currentPage === "brand.html",
    })
  );

  const back = createLink({
    label: "Back to Hub",
    labelDe: "Zurück zum Hub",
    href: hubRoot.href,
    className: "creative-hub-nav__back",
  });

  header.append(brand, navigation, back);
  document.body.classList.add("has-creative-hub-nav");
  document.body.prepend(header);

  const activeLanguage = document.documentElement.lang === "de" ? "de" : "en";
  header.querySelectorAll("[data-en][data-de]").forEach((element) => {
    element.textContent = element.dataset[activeLanguage];
  });
})();
