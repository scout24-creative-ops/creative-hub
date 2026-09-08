(function () {
  (window.ProfessionalsLocaleCatalogs ||= []).push({messages:{
    "Language":"Sprache",
    "Back to the dashboard":"Zurück zur Übersicht",
    "Back to dashboard":"Zurück zur Übersicht",
    "Dashboard":"Übersicht",
    "Example page":"Beispielseite",
    "Preheader":"Vorschautext",
    "Email":"E Mail",
    "Arrow 03":"Pfeil 03",
    "Arrow 04":"Pfeil 04",
    "Arrow uprising 03":"Aufwärtspfeil 03",
    "Arrow uprising 01":"Aufwärtspfeil 01",
    "Check 03":"Häkchen 03",
    "Straight highlighter 01":"Gerade Hervorhebung 01",
    "Underline 01":"Unterstreichung 01",
    "Underline 02":"Unterstreichung 02",
    "Underline 04":"Unterstreichung 04",
    "Underline 05":"Unterstreichung 05",
    "Professionals collaborating":"Zusammenarbeit unter Immobilienprofis",
    "Professionals collaborating at a table":"Immobilienprofis arbeiten an einem Tisch zusammen",
    "Professionals in conversation":"Immobilienprofis im Gespräch",
    "Remove every entry from history? The files you already downloaded are not affected.":"Alle Einträge aus dem Verlauf entfernen? Bereits heruntergeladene Dateien bleiben erhalten."
  },patterns:[
    [/^(\d+) to (\d+) px · Bold$/, (min,max)=>`${min} bis ${max} px · Fett`],
    [/^(\d+) px · Regular$/, size=>`${size} px · Normal`]
  ]});
})();
