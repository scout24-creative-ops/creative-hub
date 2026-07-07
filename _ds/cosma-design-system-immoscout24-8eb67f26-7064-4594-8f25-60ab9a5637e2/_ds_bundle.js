/* @ds-bundle: {"format":3,"namespace":"COSMADesignSystemImmoScout24_8eb67f","components":[],"sourceHashes":{"ui_kits/immoscout24/Dashboard.jsx":"ac98ef190589","ui_kits/immoscout24/ExposePage.jsx":"73acfb5eb663","ui_kits/immoscout24/HomePage.jsx":"a6ad004f5eaf","ui_kits/immoscout24/MobileSearchResults.jsx":"e698b4ca6148","ui_kits/immoscout24/SearchResults.jsx":"1341aae68fd8","ui_kits/immoscout24/chrome.jsx":"541796834c96","ui_kits/immoscout24/components.jsx":"ef221ee07bef","ui_kits/immoscout24/data.js":"a5bf9972807c","ui_kits/immoscout24/ios-frame.jsx":"39f3a091d97d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.COSMADesignSystemImmoScout24_8eb67f = window.COSMADesignSystemImmoScout24_8eb67f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/immoscout24/Dashboard.jsx
try { (() => {
/* Dashboard — saved searches, favorites, profile. Logged-in surface. */

function StatCard({
  icon,
  value,
  label,
  trend
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22,
    style: {
      color: "var(--gray-900)"
    }
  }), trend && /*#__PURE__*/React.createElement("span", {
    className: "chip chip--brand",
    style: {
      padding: "2px 8px",
      fontSize: 11
    }
  }, trend)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1,
      margin: "12px 0 4px"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, label));
}
function Dashboard({
  onNavigate
}) {
  const [tab, setTab] = React.useState("ueberblick");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-layout"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "dash-nav"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "8px 14px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.AVATARS.user,
    alt: "Lena Becker"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, "Lena Becker"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 11
    }
  }, "lena@beispiel.de"))), [["ueberblick", "dashboard", "Überblick"], ["suchen", "save-search", "Meine Suchen"], ["favoriten", "heart-favorite", "Favoriten"], ["nachrichten", "message", "Nachrichten"], ["anfragen", "write-message", "Anfragen"], ["inserate", "immo-ad", "Inserate"], ["finanzierung", "financing", "Finanzierung"], ["einstellungen", "settings", "Einstellungen"]].map(([id, ic, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: tab === id ? "active" : "",
    onClick: () => setTab(id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  }), " ", label))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "24px 0"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 28,
      fontWeight: 700
    }
  }, "Guten Morgen, Lena"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--default btn--md",
    onClick: () => onNavigate("results")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add",
    size: 16
  }), " Neue Suche")), /*#__PURE__*/React.createElement("div", {
    className: "stat-row",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "save-search",
    value: "4",
    label: "Aktive Suchen",
    trend: "+2 neu"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "heart-favorite",
    value: "17",
    label: "Favoriten"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "notification-alert",
    value: "9",
    label: "Neue Treffer heute",
    trend: "\u2191 38 %"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: "0 0 16px"
    }
  }, "Meine Suchen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginBottom: 32
    }
  }, [{
    city: "Berlin",
    filters: "Mieten · Wohnung · 3+ Zi · 800–1500 € · Balkon",
    count: 4,
    new: true
  }, {
    city: "Potsdam",
    filters: "Kaufen · Haus · 4+ Zi · bis 850.000 €",
    count: 1
  }, {
    city: "Leipzig",
    filters: "Mieten · 2 Zi · bis 700 €",
    count: 0
  }, {
    city: "München-Schwabing",
    filters: "Mieten · 3+ Zi · Süd-Balkon · bis 2200 €",
    count: 4,
    new: true
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "search-row"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 22,
    style: {
      color: "var(--gray-700)"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, s.city), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12,
      marginTop: 2
    }
  }, s.filters))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, s.new && /*#__PURE__*/React.createElement("span", {
    className: "chip chip--brand",
    style: {
      padding: "4px 10px"
    }
  }, s.count, " neu"), !s.new && /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      padding: "4px 10px"
    }
  }, s.count, " Treffer"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline-weak btn--sm",
    onClick: () => onNavigate("results")
  }, "Ansehen"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: 8
    },
    "aria-label": "Optionen"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  })))))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: "0 0 16px"
    }
  }, "Letzte Favoriten"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 20
    }
  }, window.LISTINGS.slice(0, 4).map(l => /*#__PURE__*/React.createElement(RealEstateCard, {
    key: l.id,
    data: {
      ...l,
      fav: true
    },
    onClick: () => onNavigate("expose")
  })))))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/ExposePage.jsx
try { (() => {
/* ExposePage — property detail. The most content-dense screen in IS24. */

function KeyFact({
  icon,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "key-fact"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22,
    className: "icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, label));
}
function ExposePage({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper",
    style: {
      padding: "16px 24px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 0",
      color: "var(--color-text-muted)"
    },
    onClick: () => onNavigate("results")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Zur\xFCck zu den Ergebnissen")), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "expose-gallery"
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.EXPOSE_GALLERY[0],
    alt: "Wohnzimmer"
  }), /*#__PURE__*/React.createElement(Photo, {
    src: window.EXPOSE_GALLERY[1],
    alt: "K\xFCche"
  }), /*#__PURE__*/React.createElement(Photo, {
    src: window.EXPOSE_GALLERY[2],
    alt: "Balkon"
  }), /*#__PURE__*/React.createElement(Photo, {
    src: window.EXPOSE_GALLERY[3],
    alt: "Schlafzimmer"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.EXPOSE_GALLERY[4],
    alt: "Bad"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: 18,
      gap: 8,
      borderRadius: "0 0 16px 0",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 22
  }), " + 19 Fotos"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip chip--brand"
  }, "Neu"), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, "Provisionsfrei"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip--outline"
  }, "3D-Rundgang")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 8px",
      fontSize: 34,
      fontWeight: 700,
      lineHeight: 1.2
    }
  }, "Helle 3,5-Zimmer-Wohnung mit S\xFCdbalkon in Prenzlauer Berg"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 14
  }), " Kollwitzstra\xDFe 78, 10437 Berlin (Prenzlauer Berg)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 24,
      padding: "20px 0",
      borderTop: "1px solid var(--color-border-weak)",
      borderBottom: "1px solid var(--color-border-weak)",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1
    }
  }, "1.250 \u20AC"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12,
      marginTop: 4
    }
  }, "Kaltmiete pro Monat")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "1.690 \u20AC"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Warmmiete")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "14,37 \u20AC/m\xB2"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "Preis pro m\xB2"))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "0 0 16px"
    }
  }, "Auf einen Blick"), /*#__PURE__*/React.createElement("div", {
    className: "key-facts",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(KeyFact, {
    icon: "number-of-rooms",
    value: "3,5",
    label: "Zimmer"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "room-size",
    value: "87 m\xB2",
    label: "Wohnfl\xE4che"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "house-attic",
    value: "3. Etage",
    label: "Etage (von 5)"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "calendar",
    value: "ab sofort",
    label: "Verf\xFCgbar"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "balcony",
    value: "S\xFCd",
    label: "Balkon"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "fitted-kitchen",
    value: "vorhanden",
    label: "Einbauk\xFCche"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "elevator",
    value: "Ja",
    label: "Aufzug"
  }), /*#__PURE__*/React.createElement(KeyFact, {
    icon: "solar-potential",
    value: "B / 79",
    label: "Energieausweis"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "0 0 12px"
    }
  }, "Objektbeschreibung"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--color-text-default)",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px"
    }
  }, "Diese stilvolle Altbauwohnung wurde 2023 hochwertig saniert und bietet auf 87\xA0m\xB2 Wohnfl\xE4che viel Raum zum Leben. Die Wohnung verf\xFCgt \xFCber drei gro\xDFz\xFCgige Zimmer, ein gem\xFCtliches Wohnzimmer mit S\xFCdbalkon und eine moderne Einbauk\xFCche mit Marken\xADger\xE4ten."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px"
    }
  }, "Hohe Decken, Stuckverzierungen und das original erhaltene Parkett verleihen dem Objekt seinen einzig\xADartigen Altbau\xADcharme. Die ruhige Hofseite garantiert einen erholsamen Schlaf."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Im Aufzug erreichst du die Wohnung im 3.\xA0Obergeschoss bequem. Im Keller steht zus\xE4tzlich ein Abstellraum zur Verf\xFCgung."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "8px 0",
      marginTop: 8
    }
  }, "Mehr anzeigen ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "24px 0 16px"
    }
  }, "Ausstattung"), /*#__PURE__*/React.createElement("div", {
    className: "feat-grid",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "balcony"
  }), " S\xFCd-Balkon mit Markise"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fitted-kitchen"
  }), " Einbauk\xFCche mit Geschirrsp\xFCler"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "elevator"
  }), " Aufzug"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock"
  }), " Sicherheitsschloss"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paint-roller-glyph"
  }), " Frisch renoviert (2023)"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "internet"
  }), " Glasfaser-Anschluss"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "house-basement"
  }), " Kellerabteil"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "car-park"
  }), " Fahrradstellplatz")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "24px 0 16px"
    }
  }, "Energie"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: "flex",
      gap: 24,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      borderRadius: 12,
      background: "var(--green-400)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 36,
      fontWeight: 800
    }
  }, "B"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "Endenergiebedarf: 79 kWh/(m\xB2\xB7a)"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13,
      margin: "4px 0"
    }
  }, "Energieeffizienzklasse B \xB7 Baujahr 1908 \xB7 Heizung: Fernw\xE4rme"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, "Energieausweis ansehen \u2192"))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "40px 0 16px"
    }
  }, "Lage"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 280,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.MAP_PHOTO,
    alt: "Karte der Umgebung"
  })), /*#__PURE__*/React.createElement("div", {
    className: "feat-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "public-transport-subway"
  }), " U-Bahn Eberswalder Str. (4 Min.)"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "grocery"
  }), " Edeka, REWE (3 Min.)"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "schools"
  }), " Grundschule (8 Min.)"), /*#__PURE__*/React.createElement("div", {
    className: "feat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "restaurant"
  }), " 47 Restaurants & Caf\xE9s in der N\xE4he"))), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    className: "card card--shadow",
    style: {
      position: "sticky",
      top: 88,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.AVATARS.agent,
    alt: "Anna Schmidt"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, "Anna Schmidt"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12
    }
  }, "M\xFCller Immobilien"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Dein Name",
    defaultValue: ""
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "E-Mail",
    type: "email"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Telefon (optional)"
  }), /*#__PURE__*/React.createElement("textarea", {
    className: "input",
    rows: "4",
    style: {
      height: "auto",
      padding: 14,
      resize: "vertical"
    },
    defaultValue: "Guten Tag, ich interessiere mich f\xFCr Ihre Wohnung und m\xF6chte gern einen Besichtigungstermin vereinbaren. Vielen Dank!"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--default btn--lg",
    style: {
      width: "100%"
    }
  }, "Anfrage senden"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--md",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "telephone",
    size: 16
  }), " Anrufen"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--md",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat",
    size: 16
  }), " Chat")), /*#__PURE__*/React.createElement("hr", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 8px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart-favorite",
    size: 16
  }), " Merken"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 8px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 16
  }), " Teilen"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 8px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "printer",
    size: 16
  }), " Drucken"))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "32px 0",
      background: "var(--color-background-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      margin: "0 0 24px"
    }
  }, "\xC4hnliche Wohnungen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 20
    }
  }, window.LISTINGS.slice(1, 5).map(l => /*#__PURE__*/React.createElement(RealEstateCard, {
    key: l.id,
    data: l,
    onClick: () => onNavigate("expose")
  }))))));
}
Object.assign(window, {
  ExposePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/ExposePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/HomePage.jsx
try { (() => {
/* HomePage — hero, search, "Tipp für dich" carousel, popular cities, services. */

function HomePage({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "linear-gradient(180deg, var(--teal-50) 0%, #fff 100%)",
      paddingTop: 56,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      textAlign: "center",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-family-headlines)",
      fontSize: 48,
      fontWeight: 800,
      lineHeight: 1.1,
      margin: "0 0 12px",
      letterSpacing: "-0.5px"
    }
  }, "Finde dein neues Zuhause"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: "var(--color-text-muted)",
      margin: 0
    }
  }, "Mit \xFCber 1 Mio. Inseraten ist ImmoScout24 die gr\xF6\xDFte Immobilien\xADplattform in Deutschland.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    onSearch: () => onNavigate("results"),
    variant: "hero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 8,
      marginTop: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12,
      alignSelf: "center",
      marginRight: 4
    }
  }, "Beliebt:"), ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf"].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "chip chip--outline",
    onClick: () => onNavigate("results")
  }, c))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "48px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 26,
      fontWeight: 700
    }
  }, "Inserate f\xFCr dich"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate("results");
    },
    style: {
      color: "var(--color-text-link)",
      fontSize: 14,
      fontWeight: 700
    }
  }, "Alle ansehen \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 24
    }
  }, window.LISTINGS.slice(0, 4).map(l => /*#__PURE__*/React.createElement(RealEstateCard, {
    key: l.id,
    data: l,
    onClick: () => onNavigate("expose")
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "32px 0",
      background: "var(--color-background-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      margin: "0 0 24px"
    }
  }, "Beliebte St\xE4dte"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16
    }
  }, [{
    name: "Berlin",
    count: "23.412"
  }, {
    name: "München",
    count: "8.940"
  }, {
    name: "Hamburg",
    count: "11.205"
  }, {
    name: "Köln",
    count: "6.728"
  }].map(c => /*#__PURE__*/React.createElement("a", {
    key: c.name,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate("results");
    },
    style: {
      position: "relative",
      display: "block",
      borderRadius: 16,
      overflow: "hidden",
      aspectRatio: "4/3",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    src: window.CITY_PHOTOS[c.name],
    alt: c.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      bottom: 14,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.9
    }
  }, c.count, " Inserate"))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "56px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      margin: "0 0 24px"
    }
  }, "So unterst\xFCtzen wir dich"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, [{
    icon: "financing",
    title: "Finanzierung",
    desc: "Berechne in 3 Minuten, wie viel Immobilie du dir leisten kannst."
  }, {
    icon: "calculator",
    title: "Mietpreis-Check",
    desc: "Erfahre, ob deine Miete im Rahmen liegt — kostenlos und anonym."
  }, {
    icon: "moving",
    title: "Umzug",
    desc: "Vergleiche Umzugsfirmen und spar bis zu 40 %."
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    className: "card"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 32,
    style: {
      color: "var(--gray-900)",
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      margin: "8px 0"
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: "0 0 12px",
      fontSize: 14
    }
  }, s.desc), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--sm"
  }, "Mehr erfahren")))))));
}
Object.assign(window, {
  HomePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/MobileSearchResults.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Mobile Suchergebnisse (SRP) — COSMA / ImmoScout24
   A clean, design-system-correct recreation of the mobile property search
   results page. Static hi-fi mock. German copy, Du-form, no emoji. */

/* ---- Icon (IcoMoon IS24 font) ---- */
function MIcon({
  name,
  size = 18,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("i", _extends({
    className: `is24-icon is24-icon-${name}`,
    style: {
      fontSize: size,
      lineHeight: 1,
      ...style
    },
    "aria-hidden": "true"
  }, rest));
}

/* ---- Sparkle (HeyImmo / AI) — simple 4-point glyph ---- */
function Sparkle({
  size = 16,
  color = "currentColor",
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    style: style,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 1.5c.45 5.2 2.8 7.55 8 8-5.2.45-7.55 2.8-8 8-.45-5.2-2.8-7.55-8-8 5.2-.45 7.55-2.8 8-8z",
    fill: color
  }));
}

/* ---- Sort glyph (up/down arrows) ---- */
function SortGlyph({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 4v16M7 4 4 7M7 4l3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 20V4M17 20l-3-3M17 20l3-3"
  }));
}

/* ---- Sample listings — real apartment photography (Unsplash CDN) ---- */
const MS_LISTINGS = [{
  type: "bauprojekt",
  agency: "PRESTIGE Living",
  badge: "Bauprojekt",
  photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format",
  avatar: "https://i.pravatar.cc/120?img=12",
  units: "8 passende Wohneinheiten",
  title: "Parkresidenz Lichtenberg — Erstbezug im Neubau",
  price: "500.000 – 2.500.000 €",
  sub: "ab 50 m²",
  address: "Kattbachstr. 16, 10449 Berlin"
}, {
  type: "listing",
  agency: "Engel Wohnbau",
  plus: true,
  photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format",
  avatar: "https://i.pravatar.cc/120?img=47",
  title: "Schön geschnittene 3,5-Zimmer-Wohnung mit Südbalkon",
  price: "2.000 €",
  stats: ["72,05 m²", "3,5 Zi."],
  address: "Friedenstr. 12, 10249 Berlin"
}, {
  type: "heyimmo"
}, {
  type: "listing",
  agency: "Stadtmakler Berlin",
  photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80&auto=format",
  avatar: "https://i.pravatar.cc/120?img=32",
  fav: true,
  title: "Sanierter Altbau-Charme mit Stuck und Parkett",
  price: "1.850 €",
  stats: ["88 m²", "3 Zi."],
  address: "Knaackstr. 9, 10435 Berlin"
}, {
  type: "listing",
  agency: "BauPro Immobilien",
  plus: true,
  photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format",
  avatar: "https://i.pravatar.cc/120?img=5",
  title: "Helle 2-Zimmer-Wohnung mit Einbauküche, Erstbezug",
  price: "1.480 €",
  stats: ["58 m²", "2 Zi."],
  address: "Greifswalder Str. 4, 10405 Berlin"
}, {
  type: "listing",
  agency: "Hanse Wohnen",
  photo: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format",
  avatar: "https://i.pravatar.cc/120?img=68",
  title: "Loft mit hohen Decken im sanierten Backsteingebäude",
  price: "2.640 €",
  stats: ["95 m²", "Loft"],
  address: "Rykestr. 21, 10405 Berlin"
}];

/* ---- Floating brand bar on the photo ---- */
function agencyInitials(name) {
  return name.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
function BrandBar({
  agency
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-brandbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-brandbar-mark"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "building-apartment-glyph",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "ms-brandbar-name"
  }, agency), /*#__PURE__*/React.createElement("span", {
    className: "ms-brandbar-avatar"
  }, agencyInitials(agency)));
}

/* ---- Pagination dots ---- */
function Dots({
  count = 5,
  active = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-dots",
    "aria-hidden": "true"
  }, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `ms-dot ${i === active ? "is-active" : ""}`
  })));
}

/* ---- New-development (Bauprojekt) card ---- */
function BauprojektCard({
  d
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "ms-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-photo"
  }, /*#__PURE__*/React.createElement("img", {
    src: d.photo,
    alt: d.title
  }), /*#__PURE__*/React.createElement(BrandBar, {
    agency: d.agency,
    avatar: d.avatar
  }), /*#__PURE__*/React.createElement("span", {
    className: "ms-badge ms-badge--project"
  }, d.badge), /*#__PURE__*/React.createElement(Dots, {
    count: 5,
    active: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-cardbody"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-units"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "building-new-building",
    size: 15
  }), " ", d.units), /*#__PURE__*/React.createElement("h3", {
    className: "ms-title ms-title--clamp"
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "ms-stats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-price"
  }, d.price), /*#__PURE__*/React.createElement("span", {
    className: "ms-stat"
  }, d.sub)), /*#__PURE__*/React.createElement("div", {
    className: "ms-address"
  }, d.address)));
}

/* ---- Standard listing card ---- */
function ListingCard({
  d
}) {
  const [fav, setFav] = React.useState(!!d.fav);
  return /*#__PURE__*/React.createElement("article", {
    className: "ms-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-photo"
  }, /*#__PURE__*/React.createElement("img", {
    src: d.photo,
    alt: d.title
  }), /*#__PURE__*/React.createElement(BrandBar, {
    agency: d.agency,
    avatar: d.avatar
  }), d.plus && /*#__PURE__*/React.createElement("span", {
    className: "ms-badge ms-badge--plus"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "time-glyph",
    size: 13
  }), " 48 Std. f\xFCr Plus"), /*#__PURE__*/React.createElement(Dots, {
    count: 5,
    active: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-cardbody"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-title-row"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ms-title"
  }, d.title), /*#__PURE__*/React.createElement("button", {
    className: `ms-fav ${fav ? "is-active" : ""}`,
    onClick: () => setFav(!fav),
    "aria-label": fav ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: fav ? "heart-Favorite-glyph" : "heart-favorite",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ms-stats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-price"
  }, d.price), d.stats.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "ms-stat"
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "ms-address"
  }, d.address)));
}

/* ---- HeyImmo AI insight card ---- */
function HeyImmoCard() {
  const questions = ["Wie haben sich die Mietpreise in Prenzlauer Berg zuletzt entwickelt?", "Wie ist die Nachbarschaft und das Umfeld?", "Wie gut ist die Anbindung an Bus und Bahn?"];
  return /*#__PURE__*/React.createElement("section", {
    className: "ms-heyimmo",
    "aria-label": "HeyImmo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-heyimmo-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-heyimmo-badge"
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 13,
    color: "#fff"
  })), "HeyImmo"), /*#__PURE__*/React.createElement("h3", {
    className: "ms-heyimmo-title"
  }, "M\xF6chtest du mehr \xFCber deine Suche erfahren?"), /*#__PURE__*/React.createElement("div", {
    className: "ms-heyimmo-list"
  }, questions.map((q, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ms-heyimmo-q"
  }, /*#__PURE__*/React.createElement(Sparkle, {
    size: 15,
    color: "var(--teal-700)",
    style: {
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, q)))));
}

/* ---- Plus-circle glyph (COSMA IconS24PlusCircle24 equivalent) ---- */
function PlusCircle({
  size = 24
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.8v8.4M7.8 12h8.4"
  }));
}

/* ---- Nav icons — inline SVG (COSMA cosma-ui-icons equivalents).
   The bundled IcoMoon WOFF is glyph-empty at these codepoints, so the nav
   draws its own currentColor icons (active/hover colour still flows through). */
function NavIcon({
  name
}) {
  const p = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };
  switch (name) {
    case "search":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "10.5",
        cy: "10.5",
        r: "6.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15.5 15.5 21 21"
      }));
    case "home":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3.5 11.5 12 4l8.5 7.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.5 10v9.5h13V10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.75 19.5V13.5h4.5v6"
      }));
    case "plus":
      return /*#__PURE__*/React.createElement(PlusCircle, {
        size: 24
      });
    case "chat":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H9.5L5 20.5V6.5Z"
      }));
    default:
      return null;
  }
}

/* ---- Bottom Nav Palm (COSMA) — Figma 39511:37046 ----
   Five equal columns, 48px icon touch targets, 24px icons, 12px labels.
   Active = bold + charcoal. Nachrichten carries an unread dot Indicator.
   HeyImmo uses the official sparkle asset with a brand glow. */
function BottomNav() {
  const items = [{
    id: "suchen",
    label: "Suchen",
    kind: "search",
    active: true
  }, {
    id: "immos",
    label: "Meine Immos",
    kind: "home"
  }, {
    id: "inserieren",
    label: "Inserieren",
    kind: "plus"
  }, {
    id: "nachrichten",
    label: "Nachrichten",
    kind: "chat",
    badge: true
  }, {
    id: "heyimmo",
    label: "HeyImmo",
    heyimmo: true
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "ms-nav",
    "aria-label": "Hauptnavigation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-nav-list"
  }, items.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `ms-nav-item ${t.active ? "is-active" : ""}`,
    "aria-current": t.active ? "page" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-iconwrap"
  }, t.heyimmo ? /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-heyimmo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-heyimmo-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "ms-nav-heyimmo-art",
    width: "48",
    height: "48",
    viewBox: "0 0 48 48",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "12",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20.4421 20L21.5518 23.2489L24.5508 24.4511L21.5518 25.6533L20.4421 28.9023L19.3323 25.6533L16.3333 24.4511L19.3323 23.2489L20.4421 20Z",
    fill: "#333333"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25.7391 17.3334L26.4789 19.5827L28.4783 20.415L26.4789 21.2473L25.7391 23.4966L24.9993 21.2473L23 20.415L24.9993 19.5827L25.7391 17.3334Z",
    fill: "#333333"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27.0725 24.6667L27.8124 26.9159L29.8117 27.7482L27.8124 28.5805L27.0725 30.8297L26.3327 28.5805L24.3333 27.7482L26.3327 26.9159L27.0725 24.6667Z",
    fill: "#333333"
  }))) : /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-icon"
  }, /*#__PURE__*/React.createElement(NavIcon, {
    name: t.kind
  })), t.badge && /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-badge",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ms-nav-label"
  }, t.label)))));
}

/* ---- Main screen ---- */
function MobileSearchResults() {
  const chips = [{
    label: "Balkon",
    active: true
  }, {
    label: "Stellplatz",
    active: true
  }, {
    label: "Modern"
  }, {
    label: "Seenähe",
    ai: true
  }, {
    label: "Aufzug"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-scroll"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ms-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-searchrow"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-iconbtn",
    "aria-label": "Zur\xFCck"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "chevron-left",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-searchfield"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "search",
    size: 18,
    style: {
      color: "var(--gray-800)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ms-searchfield-text"
  }, "Berlin-Hellersdorf")), /*#__PURE__*/React.createElement("button", {
    className: "ms-iconbtn ms-iconbtn--filter",
    "aria-label": "Filter"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "filter-glyph",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "ms-filter-badge"
  }, "2"))), /*#__PURE__*/React.createElement("div", {
    className: "ms-chips"
  }, chips.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: `ms-chip ${c.active ? "is-active" : ""} ${c.ai ? "ms-chip--ai" : ""}`
  }, c.ai && /*#__PURE__*/React.createElement(Sparkle, {
    size: 13,
    color: "var(--teal-700)"
  }), c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "ms-resulthead"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "ms-count"
  }, "1.228 Eigentumswohnungen in Berlin-Hellersdorf"), /*#__PURE__*/React.createElement("div", {
    className: "ms-sortrow"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-sort"
  }, /*#__PURE__*/React.createElement(SortGlyph, {
    size: 15
  }), " Standard"), /*#__PURE__*/React.createElement("button", {
    className: "ms-savesearch"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "save-search-heart",
    size: 16
  }), " Suche speichern"))), /*#__PURE__*/React.createElement("div", {
    className: "ms-list"
  }, MS_LISTINGS.map((d, i) => {
    if (d.type === "bauprojekt") return /*#__PURE__*/React.createElement(BauprojektCard, {
      key: i,
      d: d
    });
    if (d.type === "heyimmo") return /*#__PURE__*/React.createElement(HeyImmoCard, {
      key: i
    });
    return /*#__PURE__*/React.createElement(ListingCard, {
      key: i,
      d: d
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-foot-space"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-mapbtn"
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "map",
    size: 17
  }), " Karte"), /*#__PURE__*/React.createElement(BottomNav, null)));
}
Object.assign(window, {
  MobileSearchResults
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/MobileSearchResults.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/SearchResults.jsx
try { (() => {
/* SearchResults — left filter sidebar + grid of listings. Mirrors IS24 SRP. */

function FilterBlock({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "filter-block"
  }, /*#__PURE__*/React.createElement("h5", null, title), children);
}
function SearchResults({
  onNavigate
}) {
  const [sort, setSort] = React.useState("Standard");
  const [view, setView] = React.useState("list");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#fff",
      borderBottom: "1px solid var(--color-border-weak)",
      position: "sticky",
      top: 33,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper",
    style: {
      padding: "16px 24px"
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    onSearch: () => {},
    variant: "inline"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "results-layout"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "filters"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700
    }
  }, "Filter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 8px"
    }
  }, "Zur\xFCcksetzen")), /*#__PURE__*/React.createElement(FilterBlock, {
    title: "Preis (Kaltmiete)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "von \u20AC",
    defaultValue: "500"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "bis \u20AC",
    defaultValue: "2000"
  }))), /*#__PURE__*/React.createElement(FilterBlock, {
    title: "Zimmeranzahl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-pills"
  }, ["1+", "2+", "3+", "4+", "5+"].map((z, i) => /*#__PURE__*/React.createElement("button", {
    key: z,
    className: `chip ${i === 2 ? "is-active" : ""}`
  }, z)))), /*#__PURE__*/React.createElement(FilterBlock, {
    title: "Wohnfl\xE4che (m\xB2)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "von",
    defaultValue: "50"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "bis"
  }))), /*#__PURE__*/React.createElement(FilterBlock, {
    title: "Ausstattung"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, [["balcony", "Balkon / Terrasse"], ["garden", "Garten"], ["fitted-kitchen", "Einbauküche"], ["elevator", "Aufzug"], ["car-park", "Stellplatz / Garage"], ["lock", "Provisionsfrei"]].map(([icon, label]) => /*#__PURE__*/React.createElement("label", {
    key: icon,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 14,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: icon === "balcony",
    style: {
      width: 18,
      height: 18,
      accentColor: "var(--gray-1000)"
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    style: {
      color: "var(--gray-900)"
    }
  }), label)))), /*#__PURE__*/React.createElement(FilterBlock, {
    title: "Objekttyp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-pills"
  }, ["Wohnung", "Haus", "WG", "Loft", "Souterrain"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "chip"
  }, t))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 700
    }
  }, "Mietwohnungen in Berlin"), /*#__PURE__*/React.createElement("p", {
    className: "muted",
    style: {
      margin: "4px 0 0",
      fontSize: 14
    }
  }, "1.247 Treffer \xB7 Sortiert nach ", sort)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--sm",
    onClick: () => {}
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save-search-heart",
    size: 16
  }), " Suche speichern"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--sm",
    onClick: () => setView(view === "list" ? "map" : "list")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: view === "list" ? "map" : "list-view-compare",
    size: 16
  }), view === "list" ? "Karte" : "Liste"), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    className: "input",
    style: {
      height: 36,
      width: "auto",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("option", null, "Standard"), /*#__PURE__*/React.createElement("option", null, "Preis aufsteigend"), /*#__PURE__*/React.createElement("option", null, "Preis absteigend"), /*#__PURE__*/React.createElement("option", null, "Fl\xE4che"), /*#__PURE__*/React.createElement("option", null, "Neueste zuerst")))), /*#__PURE__*/React.createElement("div", {
    className: "filter-pills",
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip is-active"
  }, "Mieten ", /*#__PURE__*/React.createElement(Icon, {
    name: "cancel",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip is-active"
  }, "Wohnung ", /*#__PURE__*/React.createElement(Icon, {
    name: "cancel",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip is-active"
  }, "Berlin ", /*#__PURE__*/React.createElement(Icon, {
    name: "cancel",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip is-active"
  }, "3+ Zimmer ", /*#__PURE__*/React.createElement(Icon, {
    name: "cancel",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "chip is-active"
  }, "Balkon ", /*#__PURE__*/React.createElement(Icon, {
    name: "cancel",
    size: 12
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    style: {
      padding: "4px 8px"
    }
  }, "Alle entfernen")), /*#__PURE__*/React.createElement("div", {
    className: "results-grid"
  }, window.LISTINGS.map(l => /*#__PURE__*/React.createElement(RealEstateCard, {
    key: l.id,
    data: l,
    onClick: () => onNavigate("expose")
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "32px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--outline btn--md"
  }, "Weitere Ergebnisse laden"))))));
}
Object.assign(window, {
  SearchResults
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/SearchResults.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/chrome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Reusable UI primitives for the IS24 kit. */
const LOGO_URL = typeof window !== "undefined" && window.__resources && window.__resources.logo || "../../assets/logo-immoscout24-horizontal.svg";
function Icon({
  name,
  size = 16,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("i", _extends({
    className: `is24-icon is24-icon-${name}`,
    style: {
      fontSize: size,
      ...style
    },
    "aria-hidden": "true"
  }, rest));
}
function Photo({
  src,
  alt = "",
  kind,
  className = "",
  style = {}
}) {
  // New API: pass src for a real image. Legacy `kind` still produces a gradient block.
  if (src) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: alt,
      className: `photo-img ${className}`,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: "var(--gray-200)",
        ...style
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `photo photo--${kind || "int1"} ${className}`,
    style: style
  });
}

/* Header */
function Header({
  onNavigate,
  current
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-header__logo",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate("home");
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO_URL,
    alt: "ImmobilienScout24",
    style: {
      height: 28
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "site-header__nav"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("results")
  }, "Mieten"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("results")
  }, "Kaufen"), /*#__PURE__*/React.createElement("button", null, "Bauen & Wohnen"), /*#__PURE__*/React.createElement("button", null, "Umziehen"), /*#__PURE__*/React.createElement("button", null, "Finanzieren")), /*#__PURE__*/React.createElement("div", {
    className: "site-header__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "site-header__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message",
    size: 18
  }), " Nachrichten"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--text btn--sm",
    onClick: () => onNavigate("dashboard")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "profile",
    size: 18
  }), " Anmelden"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--default btn--md"
  }, "+ Inserieren")))));
}

/* Footer */
function Footer() {
  const cols = [{
    title: "Mieten & Kaufen",
    links: ["Wohnung mieten", "Wohnung kaufen", "Haus kaufen", "Haus mieten", "Grundstücke", "Neubau"]
  }, {
    title: "Vermieten & Verkaufen",
    links: ["Inserat schalten", "Mietpreis ermitteln", "Immobilienbewertung", "Makler finden", "Plus-Mitgliedschaft"]
  }, {
    title: "Service",
    links: ["Umzug", "Finanzierung", "Wohnberatung", "Energieausweis", "Versicherung", "Hilfe & Kontakt"]
  }, {
    title: "Unternehmen",
    links: ["Über uns", "Karriere", "Presse", "Investor Relations", "Nachhaltigkeit"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__inner"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title
  }, /*#__PURE__*/React.createElement("h5", null, c.title), /*#__PURE__*/React.createElement("ul", null, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__legal"
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 Scout24 \xB7 ImmobilienScout24 GmbH"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Impressum"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Datenschutz"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "AGB"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Cookie-Einstellungen")))));
}
Object.assign(window, {
  Icon,
  Photo,
  Header,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/components.jsx
try { (() => {
/* RealEstateCard — image-forward card with floating top pills, pagination
   dots overlaying the photo, and a clean stats row below. The favorite
   toggle lives next to the title rather than over the image. */

function RealEstateCard({
  data,
  onClick
}) {
  const [fav, setFav] = React.useState(!!data.fav);
  const [slide, setSlide] = React.useState(0);
  const photoCount = data.photoCount || 5;
  const dotCount = Math.min(5, photoCount);
  // Split the "3,5 Zi · 87 m²" attr string into individual stat tokens for the inline row.
  const attrParts = (data.attr || "").split(/\s*·\s*/).filter(Boolean);
  // Left pill: prefer the "live"/online duration; fall back to "Neu" / badge.
  const leftPill = data.liveLabel || (data.badge && data.badge !== "von privat" ? data.badge : null);
  // Right pill: contact type — privat vs. broker name.
  const rightPill = data.private ? "von privat" : data.brand;
  return /*#__PURE__*/React.createElement("a", {
    className: "rec",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick && onClick(data);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "rec-image-wrap"
  }, /*#__PURE__*/React.createElement(Photo, {
    src: data.photoUrl,
    alt: data.title,
    kind: data.photo
  }), /*#__PURE__*/React.createElement("div", {
    className: "rec-topbar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rec-pills"
  }, leftPill && /*#__PURE__*/React.createElement("span", {
    className: "rec-pill"
  }, leftPill), /*#__PURE__*/React.createElement("span", {
    className: "rec-pills__spacer"
  }), rightPill && /*#__PURE__*/React.createElement("span", {
    className: "rec-pill"
  }, rightPill)), /*#__PURE__*/React.createElement("div", {
    className: "rec-dots",
    role: "tablist",
    "aria-label": "Bildauswahl"
  }, Array.from({
    length: dotCount
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `rec-dot ${i === slide ? "is-active" : ""}`,
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      setSlide(i);
    },
    "aria-label": `Bild ${i + 1} von ${dotCount}`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rec-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rec-title-row"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "rec-title"
  }, data.title), /*#__PURE__*/React.createElement("button", {
    className: `rec-fav ${fav ? "is-active" : ""}`,
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      setFav(!fav);
    },
    "aria-label": fav ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
  }, fav ? /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s-7.5-4.6-9.6-9.1C1 8.7 2.6 5 6.1 5c2 0 3.4 1 4.5 2.4l1.4 1.7 1.4-1.7C14.5 6 15.9 5 17.9 5c3.5 0 5.1 3.7 3.7 6.9C19.5 16.4 12 21 12 21z",
    fill: "currentColor"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20.4s-7-4.3-9-8.4C1.4 8.9 3 5.6 6.1 5.6c1.9 0 3.5 1 4.5 2.4L12 9.7l1.4-1.7c1-1.4 2.6-2.4 4.5-2.4 3.1 0 4.7 3.3 3.1 6.4-2 4.1-9 8.4-9 8.4z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rec-stats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rec-price"
  }, data.price), attrParts.map((part, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "rec-stat"
  }, part))), /*#__PURE__*/React.createElement("div", {
    className: "rec-address"
  }, data.address)));
}

/* Search bar — IS24's iconic Mieten/Kaufen tab + location input + filters */
function SearchBar({
  onSearch,
  variant = "hero"
}) {
  const [tab, setTab] = React.useState("Mieten");
  const [type, setType] = React.useState("Wohnung");
  const [loc, setLoc] = React.useState("Berlin");
  const types = ["Wohnung", "Haus", "Grundstück", "Neubau", "Garage"];
  return /*#__PURE__*/React.createElement("div", {
    className: `search-bar search-bar--${variant}`,
    style: {
      background: "#fff",
      borderRadius: 20,
      boxShadow: variant === "hero" ? "var(--elevation-30)" : "none",
      padding: variant === "hero" ? 8 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs",
    style: {
      paddingLeft: 16
    }
  }, ["Mieten", "Kaufen"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: tab === t ? "active" : "",
    onClick: () => setTab(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "#fff",
      borderRadius: 14,
      padding: variant === "hero" ? 8 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "8px 16px",
      borderRight: "1px solid var(--color-border-weak)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--color-text-muted)",
      textTransform: "uppercase",
      letterSpacing: 0.5
    }
  }, "Objekt"), /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value),
    style: {
      border: 0,
      background: "transparent",
      font: "inherit",
      fontFamily: "var(--font-family-standard)",
      fontWeight: 700,
      fontSize: 14,
      padding: "4px 0",
      cursor: "pointer",
      appearance: "none"
    }
  }, types.map(t => /*#__PURE__*/React.createElement("option", {
    key: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: "8px 16px",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 18,
    style: {
      color: "var(--gray-800)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--color-text-muted)",
      textTransform: "uppercase",
      letterSpacing: 0.5
    }
  }, "Ort, PLZ oder Stadtteil"), /*#__PURE__*/React.createElement("input", {
    value: loc,
    onChange: e => setLoc(e.target.value),
    placeholder: "z.B. Berlin-Mitte",
    style: {
      border: 0,
      background: "transparent",
      font: "inherit",
      fontFamily: "var(--font-family-standard)",
      fontWeight: 400,
      fontSize: 16,
      padding: "2px 0",
      width: "100%",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--default btn--lg",
    onClick: () => onSearch && onSearch({
      tab,
      type,
      loc
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18
  }), " Suchen")));
}
Object.assign(window, {
  RealEstateCard,
  SearchBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/data.js
try { (() => {
/* Sample listing data used across HomePage / SearchResults.
   Photo URLs are real apartment photography hosted on Unsplash's CDN. */
window.LISTINGS = [{
  id: "l1",
  title: "Helle 3,5-Zimmer-Wohnung mit Südbalkon in Prenzlauer Berg",
  price: "1.250 €",
  attr: "3,5 Zi · 87 m²",
  address: "10437 Berlin (Prenzlauer Berg)",
  brand: "Müller Immobilien",
  brandLogo: "var(--teal-200)",
  badge: "Neu",
  photoUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format",
  photoCount: 24,
  liveLabel: "12 T live"
}, {
  id: "l2",
  title: "Stilvolle Altbauwohnung mit Stuck und Parkett, München-Schwabing",
  price: "2.180 €",
  attr: "4 Zi · 112 m²",
  address: "80798 München (Schwabing)",
  brand: "Engel & Völkers",
  photoUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80&auto=format",
  photoCount: 31,
  liveLabel: "5 T live",
  private: true
}, {
  id: "l3",
  title: "Modernes Reihenhaus mit Garten und Garage in Hamburg-Eppendorf",
  price: "895.000 €",
  attr: "5 Zi · 142 m²",
  address: "20251 Hamburg",
  brand: "Stadtmakler",
  photoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format",
  photoCount: 42,
  liveLabel: "91 T live",
  fav: true
}, {
  id: "l4",
  title: "Sanierte 2-Zimmer-Wohnung, Erstbezug nach Modernisierung",
  price: "780 €",
  attr: "2 Zi · 58 m²",
  address: "50670 Köln (Belgisches Viertel)",
  brand: "Immo Köln",
  photoUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format",
  photoCount: 16,
  liveLabel: "3 T live"
}, {
  id: "l5",
  title: "Penthouse mit Dachterrasse und Blick über die Spree",
  price: "3.450 €",
  attr: "4 Zi · 138 m²",
  address: "10117 Berlin (Mitte)",
  brand: "Skyline GmbH",
  badge: "Premium",
  photoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format",
  photoCount: 28,
  liveLabel: "21 T live"
}, {
  id: "l6",
  title: "Familienfreundliche 4-Zimmer-Wohnung mit Garten",
  price: "1.480 €",
  attr: "4 Zi · 105 m²",
  address: "60311 Frankfurt am Main",
  brand: "Hess. Immobilien",
  photoUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format",
  photoCount: 19,
  liveLabel: "42 T live",
  private: true
}, {
  id: "l7",
  title: "Charmante Altbauwohnung mit hohen Decken in Düsseldorf",
  price: "1.120 €",
  attr: "3 Zi · 92 m²",
  address: "40213 Düsseldorf (Altstadt)",
  brand: "Rheinland Immo",
  photoUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format",
  photoCount: 22,
  liveLabel: "17 T live"
}, {
  id: "l8",
  title: "Neubau-Erstbezug: 3-Zimmer-Wohnung mit Einbauküche",
  price: "1.890 €",
  attr: "3 Zi · 88 m²",
  address: "70173 Stuttgart",
  brand: "BauPro AG",
  badge: "Neubau",
  photoUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format",
  photoCount: 34,
  liveLabel: "8 T live"
}, {
  id: "l9",
  title: "Loft im ehemaligen Backsteingebäude, HafenCity",
  price: "2.250 €",
  attr: "Loft · 95 m²",
  address: "20457 Hamburg (HafenCity)",
  brand: "Hanse Immobilien",
  photoUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80&auto=format",
  photoCount: 27,
  liveLabel: "64 T live",
  private: true,
  fav: true
}];

/* City hero photos for the homepage tiles */
window.CITY_PHOTOS = {
  Berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80&auto=format",
  München: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80&auto=format",
  Hamburg: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80&auto=format",
  Köln: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&q=80&auto=format"
};

/* Exposé gallery — 5 photos of the same property */
window.EXPOSE_GALLERY = ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&auto=format"];

/* Map tile (street network shot) */
window.MAP_PHOTO = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&q=80&auto=format";

/* Avatars */
window.AVATARS = {
  agent: "https://i.pravatar.cc/160?img=47",
  user: "https://i.pravatar.cc/160?img=32"
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/data.js", error: String((e && e.message) || e) }); }

// ui_kits/immoscout24/ios-frame.jsx
try { (() => {
/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/immoscout24/ios-frame.jsx", error: String((e && e.message) || e) }); }

})();
