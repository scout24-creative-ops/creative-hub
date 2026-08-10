/* Migrated brand-content bridge ---------------------------------------------
   The local data snapshot is generated in js/frontify-import.js. This file
   turns those pages into Hub navigation and renders their blocks in the Hub
   shell without linking back to the retired source platform. */
const { Icon: FIcon } = window;

const F_PAGES = window.FRONTIFY_PAGES || [];
const F_LIBRARIES = window.FRONTIFY_LIBRARIES || {};
const F_LAYOUTS = window.FRONTIFY_LAYOUTS || {};
const FNavigateContext = React.createContext(null);
const F_TERMS_TEXT = "These are the terms of use for the brand portal operated by Immobilien Scout GmbH, Invalidenstraße 65, 10557 Berlin (hereinafter “ImmoScout24”). Please read these terms of use carefully before using the brand portal. By using the ImmoScout24 brand portal, you agree to these terms of use and undertake to comply with them.\n\nStatus: 04.09.2025\n\n﻿\n\n1. Scope of Application\n\n﻿\n\n1.1. The ImmoScout24 brand portal is exclusively intended for employees of ImmoScout24 or companies affiliated with it within the meaning of sections 15 et seq. of the German Stock Corporation Act (AktG) of the Scout24 Group, third parties acting on behalf of ImmoScout24 (hereinafter “contractors”), as well as representatives of the press or similar persons. Private use of the ImmoScout24 brand portal by consumers within the meaning of section 13 of the German Civil Code (BGB) is not permitted.\n\n﻿\n\n1.2. Any separate licence agreements between ImmoScout24 and a contractor (particularly regarding the use of trademarks and corporate identifiers as well as image material and fonts) are supplemented by these terms of use. In the event of a conflict between these terms of use and separate licence agreements, the latter shall take precedence.\n\n﻿\n\n2. Intellectual Property\n\nThe images, logos, audio and video recordings, presentations as well as other content of this brand portal (hereinafter “content”) depicted on the ImmoScout24 brand portal are subject to copyright, trademark or design rights or other intellectual property rights. ImmoScout24 is the owner of these rights or has the corresponding usage rights. Without the prior consent of ImmoScout24, the user may not copy, modify, distribute, make publicly available or otherwise use or reproduce the content in whole or in part.\n\n﻿\n\n3. Usage Rights\n\n﻿\n\n3.1. The respective authorisation to use the content of the ImmoScout24 brand portal, including content and scope, generally results from licence agreements to be separately agreed with ImmoScout24 or a company affiliated with it within the meaning of sections 15 et seq. AktG, for employees from the respective employment contract, or, insofar as no contractual regulations exist, from the applicable statutory provisions.\n\n﻿\n\n3.2. Downloadable Content: \n\nDownloadable content is that for which the ImmoScout24 brand portal provides download functionality. ImmoScout24 grants the user of the brand portal a simple (non-exclusive), revocable usage right exclusively to this content. The usage right may be revoked by ImmoScout24 at any time, including in relation to individual content. The user may only edit the downloadable content made available on the brand portal in whole or in part if this has been approved in advance by ImmoScout24. This also includes changes to the “look and feel” and the proportions of logos, images, etc. The downloadable content of the brand portal may not be altered, used in a context that changes its meaning or in an inappropriate context or environment. In particular, the content may not be used for defamatory purposes. Furthermore, any use of the content that violates statutory provisions and/or good morals, i.e. in particular glorifies violence or is sexually suggestive, discriminatory, insulting or defamatory, is strictly prohibited.\n\n﻿\n\n3.3. Otherwise, these terms of use do not grant the user any usage rights to the content of the ImmoScout24 brand portal.\n\n﻿\n\n4. Liability\n\n﻿\n\n4.1. ImmoScout24 shall be liable without limitation for intent and gross negligence, within the framework of statutory mandatory liability provisions, in particular the Product Liability Act, as well as for damages arising from injury to life, body and health of persons.\n\n﻿\n\n4.2. Otherwise, ImmoScout24 shall only be liable for simple negligence in the event of a breach of essential contractual obligations (cardinal obligations), the fulfilment of which makes the proper performance of the contract possible in the first place and on the observance of which the user regularly relies. In this case, liability is limited to the contractually typical, foreseeable damage.\n\n﻿\n\n4.3. Liability for indirect damages, consequential damages and lost profits is excluded insofar as legally permissible.\n\n﻿\n\n4.4. The aforementioned liability limitations also apply in favour of ImmoScout24’s vicarious agents.\n\n﻿\n\n5. Text and Data Mining\n\nImmoScout24 hereby exercises the right pursuant to section 44b para. 3 of the German Copyright Act to object to text and data mining. This includes in particular – but not exclusively – the prohibition of conducting data collection and extraction for training artificial intelligence or for developing software or products. The reservation refers to all content and data of the ImmoScout24 brand portal.\n\n﻿\n\n6. Final Provisions\n\n﻿\n\n6.1. The user has no entitlement to availability of the brand portal and/or the provision or maintenance of information, services and functionalities.\n\n﻿\n\n6.2. ImmoScout24 reserves the right to make changes to the brand portal at any time and without notice or to cease operation in whole or in part. ImmoScout24 further reserves the right to amend these terms of use at any time. Such an amendment shall become effective upon posting the amended terms of use on the ImmoScout24 brand portal. Continued access to the brand portal by the user shall be deemed consent to the amended terms of use.\n\n﻿\n\n6.3. The law of the Federal Republic of Germany shall apply, excluding the UN Convention on Contracts for the International Sale of Goods. The exclusive place of jurisdiction is Berlin.\n\n\nLast modified on Tue Oct 14 2025 5:16:44 PM";
const F_PRIVACY_TEXT = "1. Ansprechpartner\n\nAnsprechpartner und sogenannter Verantwortlicher für die Verarbeitung Ihrer personenbezogenen Daten bei Besuch dieser Website im Sinne der EU-Datenschutz-Grundverordnung (DSGVO) ist die\n\n﻿\n\nImmobilien Scout GmbH, Invalidenstraße 65, 10557 Berlin\n\nE-Mail: service@immobilienscout24.de﻿\n\n﻿\n\nFür alle Fragen zum Thema Datenschutz in Zusammenhang mit unseren Produkten und Dienstleistungen oder der Nutzung unserer Website können Sie sich jederzeit auch an unseren Datenschutzbeauftragten wenden.\n\n﻿\n\nDieser ist unter obiger postalischer Adresse sowie unter der angegeben E-Mail-Adresse:\n\n﻿\n\n﻿is24-datenschutz@scout24.com﻿\n\n﻿\n\n(Stichwort: „z. Hd. Datenschutzbeauftragter“) erreichbar. Wir weisen ausdrücklich darauf hin, dass bei Nutzung dieser E-Mail-Adresse die Inhalte nicht ausschließlich von unserem Datenschutzbeauftragten zur Kenntnis genommen werden. Wenn Sie vertrauliche Informationen austauschen möchten, bitten Sie daher zunächst über diese E-Mail-Adresse um direkte Kontaktaufnahme.\n\n﻿\n\n2. Datenverarbeitung auf unserer Website\n\n﻿\n\n2.1. Aufruf unserer Website / Verbindungsdaten\n\nBei jeder Nutzung unserer Website erheben wir Verbindungsdaten, die Ihr Browser automatisch übermittelt, um Ihnen den Besuch der Website zu ermöglichen. Diese Verbindungsdaten umfassen die sog. HTTP-Header-Informationen, einschließlich des User-Agents, und beinhalten insbesondere:\n\n﻿\n\nIP-Adresse des anfragenden Geräts;\n\nMethode (z. B. GET, POST), Datum und Uhrzeit der Anfrage;\n\nAdresse der aufgerufenen Website und Pfad der angefragten Datei;\n\nggf. die zuvor aufgerufene bzw. anfragende Website/Datei (HTTP-Referer);\n\nAngaben über den verwendeten Browser und das Betriebssystem;\n\nVersion des HTTP-Protokolls, HTTP-Statuscode, Größe der ausgelieferten Datei;\n\nAnfrageninformationen wie Sprache, Art des Inhalts, Kodierung des Inhalts, Zeichensätze.\n\n﻿\n\nDarüber hinaus speichern wir das Sicherheitscookie „csrf_https-contao_csrf_token“ für die Dauer der Sitzung auf Ihrem Endgerät, um Cyberattacken im Rahmen sogenannter Cross-Site-Request-Forgery (CSRF) zu verhindern.\n\n﻿\n\nDie Datenverarbeitung dieser Verbindungsdaten ist unbedingt erforderlich, um den Besuch der Website zu ermöglichen, um die dauerhafte Funktionsfähigkeit und Sicherheit unserer Systeme zu gewährleisten und um unsere Website allgemein administrativ zu pflegen. Die Verbindungsdaten werden zudem zu den zuvor beschriebenen Zwecken zeitweise und inhaltlich auf das Notwendige beschränkt in internen Logfiles gespeichert.\n\n﻿\n\nRechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern der Seitenaufruf im Zuge der Anbahnung oder der Durchführung eines Vertrages geschieht, und im Übrigen Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der Ermöglichung des Websiteaufrufes sowie dauerhaften Funktionsfähigkeit und Sicherheit unserer Systeme. Der Zugriff auf und die Speicherung von Informationen im Endgerät ist in diesem Fall unbedingt erforderlich und erfolgt auf Grundlage der Umsetzungsgesetze der ePrivacy-Richtlinie der EU-Mitgliedsländer, in Deutschland nach § 25 Abs. 2 Nr. 2 TDDDG.\n\n﻿\n\nAus Datenschutzgründen werden Logfiles bei uns nicht dauerhaft gespeichert oder analysiert.\n\n﻿\n\n2.2. Kontaktaufnahme\n\nSie haben verschiedene Möglichkeiten, um mit uns in Kontakt zu treten. Hierzu gehört insbesondere eine E-Mail mittels der im Imprint genannten Kontaktadresse. In diesem Zusammenhang verarbeiten wir Daten ausschließlich zum Zwecke der Kommunikation mit Ihnen.\n\n﻿\n\nDie Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Angaben zur Beantwortung Ihrer Anfrage oder zur Anbahnung bzw. Durchführung eines Vertrages benötigt werden, und im Übrigen Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses, dass Sie mit uns Kontakt aufnehmen und wir Ihre Anfrage beantworten können.\n\n﻿\n\nDie bei der Kontaktaufnahme von uns erhobenen Daten werden nach vollständiger Bearbeitung Ihrer Anfrage automatisch gelöscht, es sei denn, wir benötigen Ihre Anfrage noch zur Erfüllung vertraglicher oder gesetzlicher Pflichten (vgl. Abschnitt „Speicherdauer“).\n\n﻿\n\n2.3. Frontify Cookie-Tracking\n\nDiese Website wurde mit den Tools erstellt, die Frontify zur Verfügung stellt. Frontify ist für das Cookie-Tracking verantwortlich und erhebt die diesbezüglichen Tracking-Daten gemäß deren Cookie-Banner und Datenschutzerklärung.\n\n﻿\n\nDie von Frontify erhobenen Daten und deren Verarbeitung erfolgen ausschließlich nach den Bestimmungen und unter der Verantwortung von Frontify. Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Frontify.\n\n﻿\n\n3. Speicherdauer\n\nPersonenbezogene Daten werden grundsätzlich nur solange gespeichert, wie dies für die vorgenannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.\n\n﻿\n\n4. Weitergabe von Daten\n\nEine Weitergabe der von uns erhobenen Daten erfolgt grundsätzlich nur, wenn:\n\n﻿\n\nSie Ihre nach Art. 6 Abs. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben,\n\ndie Weitergabe nach Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unserer Interessen oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse am Unterbleiben der Weitergabe Ihrer Daten haben,\n\nwir nach Art. 6 Abs. 1 lit. c DSGVO zur Weitergabe gesetzlich verpflichtet sind oder\n\ndies gesetzlich zulässig und nach Art. 6 Abs. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen oder für die Durchführung vorvertraglicher Maßnahmen erforderlich ist, die auf Ihre Anfrage hin erfolgen.\n\n﻿\n\nEin Teil der Datenverarbeitung kann durch unsere Dienstleister erfolgen. Neben den in dieser Datenschutzerklärung erwähnten Dienstleistern können hierzu insbesondere Rechenzentren, die unsere Website und Datenbanken speichern, IT-Dienstleister, die unsere Systeme warten, sowie Beratungsunternehmen gehören. Sofern wir Daten an unsere Dienstleister weitergeben, dürfen diese die Daten ausschließlich zur Erfüllung ihrer Aufgaben verwenden. Die Dienstleister wurden von uns sorgfältig ausgewählt und beauftragt. Sie sind vertraglich an unsere Weisungen gebunden, verfügen über geeignete technische und organisatorische Maßnahmen zum Schutz der Rechte der betroffenen Personen und werden von uns regelmäßig kontrolliert.\n\n﻿\n\n5. Datenübermittlung in Drittländer\n\nWir setzen gegebenenfalls Dienste ein, deren Anbieter teilweise in sogenannten Drittländern (wie den USA) sitzen oder dorthin personenbezogene Daten übermitteln, also Ländern, deren Datenschutzniveau nicht dem der Europäischen Union entspricht.\n\n﻿\n\nSofern ein Angemessenheitsbeschluss der Europäischen Kommission (Art. 45 DSGVO) für diese Länder vorliegt, stützen wir die Datenübermittlung auf diesen. Andernfalls erfolgt die Übermittlung nur bei Vorliegen von geeigneten Garantien gemäß Art. 46 DSGVO, insbesondere Standarddatenschutzklauseln der Europäischen Kommission.\n\n﻿\n\n6. Ihre Rechte\n\nSie haben gegenüber uns die folgenden Rechte hinsichtlich Ihrer personenbezogenen Daten:\n\n﻿\n\nRecht auf Auskunft gemäß Art. 15 DSGVO\n\nRecht auf Berichtigung gemäß Art. 16 DSGVO\n\nRecht auf Löschung gemäß Art. 17 DSGVO\n\nRecht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO\n\nRecht auf Datenübertragbarkeit gemäß Art. 20 DSGVO\n\nRecht auf Widerspruch gemäß Art. 21 DSGVO\n\nRecht auf Widerruf einer erteilten Einwilligung gemäß Art. 7 Abs. 3 DSGVO\n\n﻿\n\nSie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:\n\n﻿\n\nBerliner Beauftragte für Datenschutz und Informationsfreiheit\n\nAlt-Moabit 59–61\n\n10555 Berlin\n\nTel.: +49 30 13889-0\n\nE-Mail: mailbox@datenschutz-berlin.de﻿\n\n﻿\n\n7. Widerrufs- und Widerspruchsrecht\n\nSie haben das Recht, eine einmal erteilte Einwilligung jederzeit uns gegenüber zu widerrufen. Dies hat zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.\n\n﻿\n\nSoweit wir Ihre Daten auf Grundlage von berechtigten Interessen verarbeiten, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen aus Gründen, die sich aus ihrer besonderen Situation ergeben.\n\n﻿\n\nMöchten Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen, genügt eine formlose Mitteilung an die oben genannten Kontaktdaten.\n\n﻿\n\n8. Pflicht zur Bereitstellung Ihrer Daten\n\nDie Bereitstellung personenbezogener Daten ist grundsätzlich weder gesetzlich noch vertraglich vorgeschrieben. Soweit bestimmte Daten für die Kontaktaufnahme erforderlich sind, sind entsprechende Eingabefelder als Pflichtangaben markiert (in der Regel durch einen Stern (*)). Ohne diese Daten kann die konkrete Dienstleistung nicht erbracht bzw. die Funktion nicht genutzt werden.\n\n﻿\n\n9. Automatisierte Entscheidungsfindung\n\nEine automatisierte Entscheidungsfindung einschließlich Profiling gemäß Art. 22 DSGVO mit rechtlicher oder ähnlicher Weise erheblich beeinträchtigender Wirkung findet nicht statt.\n\n﻿\n\n10. Änderungen der Datenschutzerklärung\n\nGelegentlich aktualisieren wir diese Datenschutzerklärung, beispielsweise wenn wir unsere Website anpassen oder sich die gesetzlichen oder behördlichen Vorgaben ändern.\n\n﻿\n\nStand: 14. Oktober 2025\n\n\nLast modified on Tue Oct 14 2025 5:16:44 PM";
const F_IMPRINT_TEXT = "The operator and publisher of https://brand.immoscout24.de is:\n\nImmobilien Scout GmbH\nInvalidenstraße 65\n10557 Berlin\n\nManagement: Dr. Gesa Crockford, Daniel Hendel\nChairman of the Supervisory Board: Ralf Weitz\nCommercial Register: Charlottenburg District Court, HRB 69108\nVAT ID No. DE 200269419\nRegistered Office: Berlin\n\nContact Options\n\nPostal Address: Immobilien Scout GmbH, Invalidenstr. 65, 10557 Berlin\n\nBy email: service@immobilienscout24.de\n\nBy fax: +49 30 24301 - 0120\n\nFor Whistleblowers\n\nFor individuals who wish to report violations of legal provisions or compliance breaches, Scout24’s central whistleblowing system is available. Relevant information and contact points can be found here.\n\nLast modified on Tue Oct 14 2025 5:16:44 PM";

function fPage(portal, title, label = title) {
  return { label, key: `${portal}::${title}`, source: "frontify" };
}

function fPlaceholder(label) {
  return { label, key: `placeholder::${label}`, source: "placeholder" };
}

function fLibrary(key, label) {
  return { label, key: `library::${key}`, source: "frontify-library" };
}

function fHub(id, label) {
  return { label, key: `hub::${id}`, source: "hub" };
}

function fMediaLibrary(id, label) {
  return { label, key: `media-library::${id}`, source: "frontify-media-library" };
}

function fGroup(label) {
  return { label, type: "group" };
}

function fFindPage(portal, title) {
  return F_PAGES.find((page) => page.portal === portal && page.title === title) || null;
}

function fExisting(portal, title, label) {
  return fFindPage(portal, title) ? fPage(portal, title, label || title) : fPlaceholder(label || title);
}

function buildHubNavigation() {
  return {
    create: [
      fGroup("AI Studio"),
      ...["All Agents", "Campaign Studio", "Presentation Studio", "Brand Studio", "Content Studio", "Publishing Studio", "Automation Studio"].map(fPlaceholder),
    ],
    brand: [
      fGroup("Brand"),
      fExisting("look", "Typo und Farben", "Look & Feel"),
      fGroup("Brand strategy"),
      fHub("68", "Overview"),
      fExisting("strategy", "Claim"),
      fExisting("strategy", "Message Framework"),
      fExisting("strategy", "Brand Family"),
      fGroup("Guidelines"),
      fHub("66", "Guidelines Overview"),
      fExisting("guidelines", "Design Principles", "Principles"),
      fExisting("guidelines", "Logo"),
      fExisting("guidelines", "Colour", "Colours"),
      fExisting("guidelines", "Typography"),
      fExisting("guidelines", "Icons", "Iconography"),
      fExisting("guidelines", "Illustrations", "Illustration"),
      fExisting("guidelines", "Photography"),
      fPlaceholder("Motion"),
      fExisting("guidelines", "Video"),
      fExisting("guidelines", "Sound"),
      fPlaceholder("Accessibility"),
      fExisting("guidelines", "Digital", "Components"),
      fExisting("guidelines", "Data Visualisation"),
      fExisting("guidelines", "Highlighter"),
      fExisting("guidelines", "Tone of Voice (DE)"),
      fExisting("guidelines", "Tone of Voice (EN)"),
    ],
    assets: [
      fGroup("Media Library"),
      fHub("69", "Overview"),
      fMediaLibrary("images", "Images"),
      fMediaLibrary("immopics", "ImmoPics"),
      fMediaLibrary("highlighter", "Highlighter"),
      fMediaLibrary("icons", "Icons"),
      fMediaLibrary("logos", "Logos"),
      fGroup("Templates & documents"),
      fMediaLibrary("templates", "Templates"),
    ],
    knowledge: [
      fGroup("Industry Intelligence"),
      { label: "AI & Marketing Updates", key: "knowledge::updates", source: "local" },
      fGroup("Learning library"),
      ...["Playbooks", "Best Practices", "Tutorials", "Marketing Academy", "AI Academy", "Case Studies", "FAQs", "Research"].map(fPlaceholder),
    ],
    community: [
      fGroup("Community"),
      ...["Request Assets", "Feedback", "Release Notes", "Teams Directory"].map(fPlaceholder),
      fGroup("Contact & legal"),
      fExisting("home", "Contact us"),
      fExisting("home", "Terms of Use"),
      fExisting("home", "Datenschutzerklärung"),
      fExisting("home", "Imprint"),
    ],
  };
}

function fResolve(key) {
  if (!key) return { page: null, library: null, special: null };
  const [type, ...rest] = key.split("::");
  const name = rest.join("::");
  if (type === "hub" && name === "56") return { page: null, library: null, special: "brand-home" };
  if (type === "hub" && name === "66") return { page: null, library: null, special: "guidelines-home" };
  if (type === "hub" && name === "68") return { page: null, library: null, special: "strategy-home" };
  if (type === "hub" && name === "69") return { page: null, library: null, special: "media-library-home", mediaLibraryKey: null };
  if (type === "look" && name === "Typo und Farben") return { page: null, library: null, special: "look-feel" };
  if (type === "library") return { page: null, library: F_LIBRARIES[name] || { title: name, assets: [] }, special: null };
  if (type === "media-library") return { page: null, library: F_LIBRARIES[name] || { title: name, assets: [] }, special: name === "templates" ? "media-library-templates" : "media-library-section", mediaLibraryKey: name };
  if (type === "placeholder") return { page: null, library: null, special: null };
  if (key === "home::Terms of Use") {
    const blocks = F_TERMS_TEXT.split(/\n+/).map((line) => line.replace(/[﻿]/g, "").trim()).filter(Boolean).map((line) => /^\d+(?:\.\d+)?\.\s/.test(line) ? { type: "heading", title: line } : { type: "Text", content: line });
    return { page: { portal: "home", title: "Terms of Use", modifiedAt: "2025-10-14T15:16:44.000+00:00", blocks }, library: null, special: null };
  }
  if (key === "home::Datenschutzerklärung") {
    const blocks = F_PRIVACY_TEXT.split(/\n+/).map((line) => line.replace(/[﻿]/g, "").trim()).filter(Boolean).map((line) => /^\d+(?:\.\d+)?\.\s/.test(line) ? { type: "heading", title: line } : { type: "Text", content: line });
    return { page: { portal: "home", title: "Datenschutz", modifiedAt: "2025-10-14T15:16:44.000+00:00", blocks }, library: null, special: null };
  }
  if (key === "home::Imprint") {
    const blocks = F_IMPRINT_TEXT.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => /^(Contact Options|For Whistleblowers)$/.test(line) ? { type: "heading", title: line } : { type: "Text", content: line });
    return { page: { portal: "home", title: "Imprint", modifiedAt: "2025-10-14T15:16:44.000+00:00", blocks }, library: null, special: null };
  }
  return { page: fFindPage(type, name), library: null, special: null };
}

const F_MEDIA_LIBRARY_ROOT = "assets/media-library/";
const F_MEDIA_LIBRARY_VERSION = "20260804-icons-1";
const F_MEDIA_LIBRARY_SECTIONS = [
  {
    id: "images",
    kind: "library",
    label: "Images",
    recordedCount: 1776,
    tile: "tiles/05-media-library_01_UitdK9PxHub8kVpUwQar.svg",
    tint: "var(--is24-teal)",
    blurb: "Photography for the Seeker, Homeowner, Professional and Real Estate journeys.",
    facets: ["Journeys", "File types", "Collections"],
    bundleLibraries: ["images"],
    collections: [
      { key: "seeker", label: "01_SEEKER", count: 142 },
      { key: "homeowner", label: "02_HOMEOWNER", count: 128 },
      { key: "professional", label: "03_AGENTS", count: 109 },
      { key: "real-estate", label: "04_REAL ESTATE", count: 716 },
      { key: "ai", label: "AI-IMAGERY", count: 9 },
    ],
  },
  {
    id: "immopics",
    kind: "library",
    label: "ImmoPics",
    recordedCount: 329,
    tile: "tiles/05-media-library_02_xdwQd45BjQ3aSAo8Rd2W.svg",
    tint: "var(--is24-purple)",
    blurb: "Basic and advanced illustrations with the distinctive ImmoScout24 brush stroke.",
    facets: ["Types", "Collections"],
    bundleLibraries: ["immopics", "illustrations"],
    collections: [
      { key: "maps", label: "Maps", count: 28 },
      { key: "real-estate", label: "Real Estate", count: 103 },
      { key: "people", label: "People", count: 143 },
    ],
  },
  {
    id: "highlighter",
    kind: "library",
    label: "Highlighter",
    recordedCount: 42,
    tile: "tiles/05-media-library_03_5yCLwmHAaNGKpv3eogmc.svg",
    tint: "var(--is24-yellow)",
    blurb: "Marker-stroke shapes in the documented variants and customer-journey colours.",
    facets: ["Journeys", "Collections"],
    bundleLibraries: ["highlighter", "highlighters"],
    collections: [
      { key: "agents", label: "AGENTS", count: 10 },
      { key: "homeowner", label: "HOMEOWNER", count: 13 },
      { key: "seeker", label: "SEEKER", count: 15 },
    ],
  },
  {
    id: "icons",
    kind: "library",
    label: "Icons",
    recordedCount: 823,
    tile: "tiles/05-media-library_04_ZwZzVfHw1ez2WXdW5CWW.png",
    tint: "var(--is24-blue)",
    blurb: "The complete icon family for interfaces, communication and product experiences.",
    facets: ["Size"],
    bundleLibraries: ["icons"],
    collections: [],
  },
  {
    id: "logos",
    kind: "library",
    label: "Logos",
    recordedCount: 718,
    tile: "tiles/05-media-library_05_jtaiJtk6VK5rfZyMF7UG.svg",
    tint: "var(--is24-orange)",
    blurb: "Approved brand, product and partner marks across every available variant.",
    facets: ["Variants", "Usage"],
    bundleLibraries: ["logos"],
    collections: [
      { key: "badges", label: "badges", count: 9 },
      { key: "soundlogos", label: "SoundLogos", count: 6 },
      { key: "immoscout24", label: "ImmoScout24", count: 45 },
    ],
  },
  {
    id: "templates",
    kind: "resource",
    label: "Templates",
    recordedCount: null,
    tile: "tiles/05-media-library_06_ojvMGEGgH6VkSR1hpzoo.svg",
    tint: "var(--is24-purple)",
    blurb: "Ready-to-use templates for presentations, email signatures and stationery.",
    facets: [],
    bundleLibraries: [],
    collections: [],
  },
];

const F_MEDIA_LIBRARY_COPY = {
  blocks: [
    { title: "How to use it?", columns: [
      { title: "You know what you’re looking for?", body: "Use the search function with English tags." },
      { title: "Need inspiration?", body: "Browse our curated collections." },
    ] },
    { title: "What’s inside?", body: "Alongside our core brand elements, images, and videos, you’ll find templates for:", list: ["PowerPoint presentations", "Email signatures", "Word stationery"] },
    { title: "Who can use the assets?", body: "All content in the Media Library comes with unlimited usage rights in time and geography for:", list: ["ImmoScout24 DE & AT", "Scout24"] },
    { title: "Who manages the library?", columns: [
      { title: "The Media Library is maintained by the Creative Studio.", body: "" },
      { title: "Need new content?", body: "Just reach out. We’ll handle image research, purchasing, and licensing." },
    ] },
  ],
  note: "Please note: Brands related to ImmoScout24 or Scout24 (like subsidiaries or satellites) are not permitted to use these assets.",
};

let fMediaBundlePromise = null;
let fIconCatalogPromise = null;

function fLoadMediaBundle() {
  if (!fMediaBundlePromise) {
    fMediaBundlePromise = Promise.all([
      fetch(`${F_MEDIA_LIBRARY_ROOT}media-manifest.json?v=${F_MEDIA_LIBRARY_VERSION}`).then((response) => {
        if (!response.ok) throw new Error(`Media manifest returned ${response.status}`);
        return response.json();
      }),
      fetch(`${F_MEDIA_LIBRARY_ROOT}media-thumbs.json?v=${F_MEDIA_LIBRARY_VERSION}`).then((response) => {
        if (!response.ok) throw new Error(`Media previews returned ${response.status}`);
        return response.json();
      }),
    ]).then(([manifest, thumbs]) => ({ manifest, thumbs }));
  }
  return fMediaBundlePromise;
}

function fUseMediaBundle() {
  const [state, setState] = React.useState({ data: null, error: null, loading: true });
  React.useEffect(() => {
    let active = true;
    fLoadMediaBundle().then((data) => active && setState({ data, error: null, loading: false })).catch((error) => active && setState({ data: null, error, loading: false }));
    return () => { active = false; };
  }, []);
  return state;
}

function fLoadIconCatalog() {
  if (!fIconCatalogPromise) {
    fIconCatalogPromise = fetch(`${F_MEDIA_LIBRARY_ROOT}icon-catalog.json?v=${F_MEDIA_LIBRARY_VERSION}`).then((response) => {
      if (!response.ok) throw new Error(`Icon catalogue returned ${response.status}`);
      return response.json();
    });
  }
  return fIconCatalogPromise;
}

function fUseIconCatalog() {
  const [state, setState] = React.useState({ data: null, error: null, loading: true });
  React.useEffect(() => {
    let active = true;
    fLoadIconCatalog().then((data) => active && setState({ data, error: null, loading: false })).catch((error) => active && setState({ data: null, error, loading: false }));
    return () => { active = false; };
  }, []);
  return state;
}

function fMediaSection(id) {
  return F_MEDIA_LIBRARY_SECTIONS.find((section) => section.id === id) || F_MEDIA_LIBRARY_SECTIONS[0];
}

function fMediaCollectionLabel(value) {
  const clean = String(value || "").replace(/[_-]+/g, " ").trim();
  return clean ? clean.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Unsorted";
}

function fMediaPreview(asset, thumbs) {
  if (asset.previewUrl) return asset.previewUrl;
  const thumb = thumbs?.[asset.previewId || asset.id];
  if (!thumb) return null;
  if (typeof thumb === "string") return thumb;
  if (thumb.url || thumb.path) return thumb.url || `${F_MEDIA_LIBRARY_ROOT}${thumb.path}`;
  return thumb.d ? `data:${thumb.m || "image/webp"};base64,${thumb.d}` : null;
}

function fMediaType(extension) {
  const ext = String(extension || "").toLowerCase();
  if (["mp4", "mov", "webm", "m4v"].includes(ext)) return "Video";
  if (["svg", "eps", "ai"].includes(ext)) return "Vector";
  if (["jpg", "jpeg", "png", "webp", "gif", "tif", "tiff"].includes(ext)) return "Image";
  return "File";
}

function fMediaSize(kb) {
  const size = Number(kb || 0);
  if (!size) return "Size unavailable";
  if (size >= 1024) return `${(size / 1024).toFixed(size >= 10240 ? 0 : 1)} MB`;
  return `${Math.round(size)} KB`;
}

function fMediaIconSize(asset) {
  const name = String(asset?.title || "");
  const match = name.match(/(?:^|[_\s-])(24|48)(?:px|v\d+)?(?=[_\s.\-x]|$)/i);
  return match ? match[1] : "other";
}

function fTextLines(value) {
  return String(value || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

const F_LOCAL_GUIDELINE_PAGES = new Set(["Logo", "Colour", "Typography", "Icons", "Illustrations", "Data Visualisation", "Highlighter", "Photography", "Video", "Sound", "Digital", "Tone of Voice (DE)", "Tone of Voice (EN)"]);

function fLocalGuidelineAsset(url, pageTitle) {
  const value = String(url || "");
  const isApprovedGuidelineAsset = /^https:\/\/media\.ffycdn\.net\/eu\/scout24\//.test(value)
    || /^https:\/\/s3\.eu-central-1\.amazonaws\.com\/frontify-enterprise-files-eu\/scout24\/file\//.test(value);
  if (!F_LOCAL_GUIDELINE_PAGES.has(pageTitle) || !isApprovedGuidelineAsset) return value;
  const filename = value.split("?")[0].split("/").pop();
  return filename ? `assets/guidelines-documents/${filename}` : value;
}

function FMedia({ url, alt, kind, pageTitle, media = {} }) {
  const localUrl = fLocalGuidelineAsset(media.src || url, pageTitle);
  const clean = String(localUrl || "").split("?")[0].toLowerCase();
  const isVideo = media.kind === "video" || kind === "Video" && /\.(mp4|webm|mov|m4v)$/.test(clean);
  const frameHeight = /^\d+(?:\.\d+)?px$/.test(media.frameHeight || "") ? media.frameHeight : undefined;
  const style = {
    objectFit: media.fit || undefined,
    objectPosition: media.position || undefined,
    height: frameHeight,
    background: media.background || undefined,
    border: media.border && !/\bnone\b/.test(media.border) ? media.border : undefined,
    borderRadius: media.radius && media.radius !== "0px" ? media.radius : undefined,
    padding: media.framePadding && media.framePadding !== "0px" ? media.framePadding : undefined,
    boxSizing: media.framePadding && media.framePadding !== "0px" ? "border-box" : undefined,
  };
  const mediaClass = `hf-media${media.fit === "contain" ? " is-contain" : ""}${media.fit === "cover" ? " is-cover" : ""}`;
  const reduceMotion = Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const poster = media.poster || undefined;
  if (isVideo) return <video className={mediaClass} controls={media.controls !== false} controlsList="nodownload" muted={media.muted !== false} loop={media.loop !== false} autoPlay={!reduceMotion && media.autoPlay !== false} playsInline preload="metadata" poster={poster} src={localUrl} aria-label={alt || media.alt || "Brand guideline video"} style={style} />;
  return <img className={mediaClass} src={localUrl} alt={alt || media.alt || "Brand guideline visual"} loading="lazy" decoding="async" style={style} />;
}

function FRich({ values, className = "" }) {
  const parts = (Array.isArray(values) ? values : [values]).filter(Boolean);
  const onNavigate = React.useContext(FNavigateContext);
  if (!parts.length) return null;
  const followLocalLink = (event) => {
    const trigger = event.target.closest?.("[data-hub-link]");
    if (!trigger || !onNavigate) return;
    const [kind, value] = String(trigger.dataset.hubLink || "").split("::");
    if (!kind || !value) return;
    event.preventDefault();
    if (kind === "guidelines") onNavigate("brand", fExisting("guidelines", value, value));
    if (kind === "section") onNavigate(value);
    if (kind === "special" && value === "look-feel") onNavigate("brand", fExisting("look", "Typo und Farben", "Look & Feel"));
    if (kind === "hub") onNavigate("brand", fHub(value, value === "56" ? "Brand Overview" : "Guidelines Overview"));
    if (kind === "contact") onNavigate("community", fExisting("home", "Contact us", "Contact us"));
    if (kind === "resource") onNavigate("resources", { label: value, key: `home::${value === "Datenschutz" ? "Datenschutzerklärung" : value}`, source: "frontify" });
  };
  return <div className={`hf-rich ${className}`} onClick={followLocalLink}>{parts.map((value, index) => <div className="hf-rich__part" key={index} dangerouslySetInnerHTML={{ __html: value }} />)}</div>;
}

function FFigureGrid({ figures, columns, pageTitle }) {
  return <div className="hf-figure-grid" style={{ "--hf-columns": Math.max(1, columns || figures.length || 1) }}>
    {figures.map((figure, index) => <figure className="hf-figure" key={`${figure.media?.src || index}-${index}`}>
      {figure.media && <FMedia media={figure.media} pageTitle={pageTitle} alt={figure.title || figure.caption} />}
      {(figure.title || figure.caption) && <figcaption>{figure.title && <strong>{figure.title}</strong>}{figure.caption && <span>{figure.caption}</span>}</figcaption>}
    </figure>)}
  </div>;
}

function FCardsGrid({ cards, columns, pageTitle }) {
  const mobileColumns = pageTitle === "Illustrations" || pageTitle === "Photography" ? 2 : 1;
  return <div className="hf-source-cards" style={{ "--hf-columns": Math.max(1, columns || 2), "--hf-mobile-columns": mobileColumns }}>
    {cards.map((card, index) => <article className="hf-source-card" key={`${card.media?.[0]?.src || index}-${index}`}>
      {card.media?.map((media, mediaIndex) => <FMedia key={`${media.src}-${mediaIndex}`} media={media} pageTitle={pageTitle} />)}
      <FRich values={card.rich} />
    </article>)}
  </div>;
}

function FAccordionBlock({ items }) {
  const [openIndex, setOpenIndex] = React.useState(-1);
  return <div className="hf-accordion">
    {items.map((item, index) => {
      const open = index === openIndex;
      return <section className={open ? "is-open" : ""} key={`${item.title}-${index}`}>
        <button type="button" aria-expanded={open} onClick={() => setOpenIndex(open ? -1 : index)}>
          <span>{item.title}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <div className="hf-accordion__panel" hidden={!open}><FRich values={item.body} /></div>
      </section>;
    })}
  </div>;
}

function FScrollingCards({ cards }) {
  return <div className="hf-scrolling-cards" role="list">
    {cards.map((card, index) => <article role="listitem" key={index} style={{ background: card.background, borderRadius: card.radius }}><FRich values={card.rich} /></article>)}
  </div>;
}

function FSliderBlock({ media, pageTitle, settings = {}, blockIndex }) {
  const [active, setActive] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const viewportRef = React.useRef(null);
  const pointerStart = React.useRef(null);
  const dragOffsetRef = React.useRef(0);
  const gap = Number.parseFloat(settings.gap) || 20;
  const perPage = settings.perPage === 2 && viewportWidth > 0 && viewportWidth < 700 ? 1 : Math.max(1, settings.perPage || 1);
  const lastIndex = Math.max(0, media.length - perPage);
  const slideWidth = viewportWidth ? Math.max(0, (viewportWidth - gap * (perPage - 1)) / perPage) : 0;
  const offset = slideWidth ? active * (slideWidth + gap) : 0;
  const sourceHeight = pageTitle === "Photography" ? blockIndex === 31 ? "500px" : "600px" : undefined;

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const sync = () => setViewportWidth(viewport.clientWidth);
    sync();
    const observer = "ResizeObserver" in window ? new ResizeObserver(sync) : null;
    observer?.observe(viewport);
    window.addEventListener("resize", sync);
    return () => { observer?.disconnect(); window.removeEventListener("resize", sync); };
  }, []);
  React.useEffect(() => { setActive((value) => Math.min(value, lastIndex)); }, [lastIndex]);
  if (!media.length) return null;

  const go = (nextIndex) => setActive(Math.max(0, Math.min(lastIndex, nextIndex)));
  const onPointerDown = (event) => {
    if (lastIndex === 0) return;
    pointerStart.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (pointerStart.current == null) return;
    const nextOffset = event.clientX - pointerStart.current;
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };
  const finishDrag = () => {
    if (Math.abs(dragOffsetRef.current) > 42) go(active + (dragOffsetRef.current < 0 ? 1 : -1));
    pointerStart.current = null;
    dragOffsetRef.current = 0;
    setDragging(false);
    setDragOffset(0);
  };
  const sliderClass = `hf-source-slider${perPage === 2 ? " is-two-up" : ""} hf-source-slider--${pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${pageTitle === "Data Visualisation" && blockIndex === 15 ? " is-bordered" : ""}`;
  return <div className={sliderClass} style={{ "--hf-slider-gap": `${gap}px`, "--hf-slider-height": sourceHeight }} aria-roledescription="carousel" aria-label="Brand examples">
    <div
      className="hf-source-slider__viewport"
      ref={viewportRef}
      tabIndex="0"
      onKeyDown={(event) => { if (event.key === "ArrowLeft") go(active - 1); if (event.key === "ArrowRight") go(active + 1); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div className={`hf-source-slider__track${dragging ? " is-dragging" : ""}`} style={{ transform: `translate3d(${dragOffset - offset}px, 0, 0)`, gap: `${gap}px` }}>
        {media.map((item, index) => <div className="hf-source-slider__slide" key={`${item.src}-${index}`} style={{ width: slideWidth ? `${slideWidth}px` : perPage === 2 ? `calc(50% - ${gap / 2}px)` : "100%" }} aria-roledescription="slide" aria-label={`Slide ${index + 1} of ${media.length}`} aria-hidden={index < active || index >= active + perPage}>
          <div className="hf-source-slider__frame"><FMedia media={item} pageTitle={pageTitle} /></div>
        </div>)}
      </div>
    </div>
    <div className="hf-source-slider__controls">
      <button className="hf-source-slider__arrow is-previous" type="button" onClick={() => go(active - 1)} aria-label="Previous slide" disabled={active === 0}><FIcon name="arrow-left" size={22} /></button>
      <div>{Array.from({ length: lastIndex + 1 }, (_, index) => <button type="button" className={index === active ? "is-active" : ""} key={index} onClick={() => go(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === active ? "true" : undefined} />)}</div>
      <button className="hf-source-slider__arrow is-next" type="button" onClick={() => go(active + 1)} aria-label="Next slide" disabled={active === lastIndex}><FIcon name="arrow-right" size={22} /></button>
    </div>
  </div>;
}

function FFlipCards({ cards, pageTitle }) {
  const [flipped, setFlipped] = React.useState(-1);
  return <div className="hf-flip-cards">
    {cards.map((card, index) => <button type="button" className={flipped === index ? "is-flipped" : ""} onClick={() => setFlipped(flipped === index ? -1 : index)} key={`${card.src}-${index}`} aria-pressed={flipped === index}>
      <span className="hf-flip-card__inner" style={{ transitionDuration: card.duration }}>
        <span className="hf-flip-card__front" style={{ background: card.front }}><FRich values={card.label} /></span>
        <span className="hf-flip-card__back" style={{ background: card.back }}><img src={fLocalGuidelineAsset(card.src, pageTitle)} alt="" loading="lazy" decoding="async" /></span>
      </span>
    </button>)}
  </div>;
}

function FSourceColours({ colours, title }) {
  return <section className="hf-source-colour-palette">
    {title && <h3>{title}</h3>}
    <div className="hf-source-colours">{colours.map((colour) => <article key={colour.name || colour.hex}>
      <span style={{ background: colour.value }} />
      <div><strong>{colour.name}</strong><dl><div><dt>HEX</dt><dd>{colour.hex}</dd></div><div><dt>RGB</dt><dd>{colour.rgb}</dd></div><div><dt>CMYK</dt><dd>{colour.cmyk}</dd></div><div><dt>PMS</dt><dd>{colour.pantone || "\u2014"}</dd></div></dl></div>
    </article>)}</div>
  </section>;
}

function FAssetKit({ block, meta, pageTitle }) {
  const assets = meta.media || (block.assets || []).map((src) => ({ src, kind: "image" }));
  const packageUrl = pageTitle === "Logo"
    ? "assets/guidelines-documents/Logo-ImmoScout24-RGB.zip"
    : fLocalGuidelineAsset(assets[0]?.src, pageTitle);
  return <section className="hf-asset-kit">
    <div className="hf-asset-kit__head"><FRich values={meta.rich?.slice(0, 2)} /><a href={packageUrl} download>Download package</a></div>
    <div className="hf-asset-kit__body"><span>{assets.length} assets</span><div className="hf-asset-kit__previews">{assets.map((media, index) => <FMedia key={`${media.src}-${index}`} media={media} pageTitle={pageTitle} />)}</div></div>
  </section>;
}

function FHighlighterGuidance({ meta, pageTitle, reversed = false }) {
  const copy = <FRich values={meta.rich} />;
  const media = <div className="hf-media-grid">{(meta.media || []).map((item, mediaIndex) => <FMedia key={`${item.src}-${mediaIndex}`} media={item} pageTitle={pageTitle} />)}</div>;
  return <section className="hf-highlighter-guidance">
    {reversed ? media : copy}
    {reversed ? copy : media}
  </section>;
}

function fGuidelineHeadingId(pageTitle, heading) {
  return `hf-${String(pageTitle || "page").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(heading || "section").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function FColourBlock({ content }) {
  const colours = fTextLines(content).map((line) => {
    const match = line.match(/^(.*?)[,:]\s*(#[0-9a-f]{3,8})$/i);
    return match ? { name: match[1].trim(), value: match[2] } : null;
  }).filter(Boolean);
  if (!colours.length) return <p className="hf-copy">{content}</p>;
  return <div className="hf-colours">{colours.map((colour) => <div className="hf-colour" key={`${colour.name}-${colour.value}`}>
    <span style={{ background: colour.value }} />
    <strong>{colour.name}</strong>
    <code>{colour.value}</code>
  </div>)}</div>;
}

function FGuidelineBlock({ block, pageTitle, index, meta = {} }) {
  const type = block.type || "Text";
  const content = block.content == null ? "" : String(block.content).trim();
  const assets = block.assets || [];
  if (type === "Divider") return <hr className="hf-divider" />;
  if (type === "heading") {
    const heading = meta.heading || block.title;
    const HeadingTag = meta.level === "h3" ? "h3" : meta.level === "h4" ? "h4" : "h2";
    return <HeadingTag id={fGuidelineHeadingId(pageTitle, heading)} className={`hf-heading${HeadingTag !== "h2" ? " hf-heading--sub" : ""}`}>{heading}</HeadingTag>;
  }
  if (index === 0 && F_LOCAL_GUIDELINE_PAGES.has(pageTitle) && !assets.length) return null;
  if (type === "Colors") return <section className="hf-block hf-block--colours">{meta.colours?.length ? <FSourceColours colours={meta.colours} title={meta.paletteTitle} /> : <FColourBlock content={content} />}</section>;
  if (type === "Callout") return <aside className={`hf-callout${pageTitle.startsWith("Tone of Voice") ? " is-full" : ""}`}>{meta.media?.[0] ? <FMedia media={meta.media[0]} pageTitle={pageTitle} /> : null}<div>{meta.rich?.length ? <FRich values={meta.rich} /> : <p>{content}</p>}</div></aside>;
  if (/attachment|asset kit/i.test(type)) return <FAssetKit block={block} meta={meta} pageTitle={pageTitle} />;
  if (type === "Fonts") return <section className="hf-fonts">{meta.rich?.length ? <FRich values={meta.rich} /> : fTextLines(content).map((line) => <span key={line}>{line}</span>)}</section>;
  if (type === "Tab & Accordion" && meta.accordion?.length) return <FAccordionBlock items={meta.accordion} />;
  if (type === "Scrolling Cards" && meta.scrollingCards?.length) return <FScrollingCards cards={meta.scrollingCards} />;
  if (type === "Flip Card" && meta.flipCards?.length) return <FFlipCards cards={meta.flipCards} pageTitle={pageTitle} />;
  if (type === "Slider" && meta.media?.length) return <FSliderBlock media={meta.media} pageTitle={pageTitle} settings={meta.slider} blockIndex={index} />;
  if (type === "Cards Grid" && meta.cards?.length) return <FCardsGrid cards={meta.cards} columns={meta.columns} pageTitle={pageTitle} />;
  if (type === "Image grid" && meta.figures?.length) return <FFigureGrid figures={meta.figures} columns={meta.columns} pageTitle={pageTitle} />;
  if (pageTitle === "Highlighter" && type === "Image" && index >= 11 && index <= 13 && meta.media?.length) return <FHighlighterGuidance meta={meta} pageTitle={pageTitle} reversed={index === 12} />;
  if (type === "Text" && meta.rich?.length) return <section className={`hf-block hf-block--copy hf-block--text${index === 1 ? " is-intro" : ""}`}><FRich values={meta.rich} /></section>;
  if (type === "Animated Text & Image" && (meta.rich?.length || meta.media?.length)) return <section className="hf-animated-text-image"><FRich values={meta.rich} />{meta.media?.map((media, mediaIndex) => <FMedia key={`${media.src}-${mediaIndex}`} media={media} pageTitle={pageTitle} />)}</section>;

  const sourceMedia = meta.media?.length ? meta.media : assets.map((src) => ({ src, kind: type === "Video" ? "video" : "image" }));
  const isGallery = sourceMedia.length > 1 || /grid|cards|slider|scrolling/i.test(type);
  if (sourceMedia.length) return <section className={`hf-block hf-block--media hf-block--${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")} ${isGallery ? "is-gallery" : ""}`}>
    {content && !meta.rich?.length && type !== "Video" && <p className="hf-caption">{content}</p>}
    <div className="hf-media-grid">{sourceMedia.map((media, assetIndex) => <FMedia key={`${media.src}-${assetIndex}`} media={media} alt={content || `${pageTitle} visual ${assetIndex + 1}`} kind={type} pageTitle={pageTitle} />)}</div>
    {meta.rich?.length ? <FRich values={meta.rich} className="hf-media-caption" /> : content && type === "Video" ? <p className="hf-caption hf-caption--after">{content}</p> : null}
  </section>;
  if (!content) return null;
  return <section className={`hf-block hf-block--copy hf-block--${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}${index === 1 ? " is-intro" : ""}`}><p className="hf-copy">{content}</p></section>;
}

function FGuidelineDocument({ page }) {
  const layout = F_LAYOUTS[page.title];
  if (!layout) return <div className="hf-blocks">{page.blocks.map((block, index) => <FGuidelineBlock key={`${page.title}-${index}`} block={block} pageTitle={page.title} index={index} />)}</div>;
  return <div className="hf-blocks hf-source-document">
    {layout.sections.filter((section) => !(section.start === 0 && section.count === 1)).map((section, sectionIndex) => <section className={`hf-source-section${section.inset ? " is-inset" : " is-edge"}`} key={`${page.title}-section-${sectionIndex}`}>
      <div className="hf-source-section__region">
        <div className="hf-source-section__content" style={{ maxWidth: section.width === "inherit" ? "100%" : section.width, padding: section.padding }}>
          <div className="hf-source-grid" style={{ gridTemplateColumns: section.columns, gap: section.gap }}>
            {page.blocks.slice(section.start, section.start + section.count).map((block, itemIndex) => {
              const index = section.start + itemIndex;
              return <div className="hf-source-grid__item" style={{ gridColumn: section.items?.[itemIndex]?.span ? "1 / -1" : undefined }} key={`${page.title}-${index}`}><FGuidelineBlock block={block} pageTitle={page.title} index={index} meta={layout.blocks?.[String(index)] || {}} /></div>;
            })}
          </div>
        </div>
      </div>
    </section>)}
  </div>;
}

function FLibraryPage({ library }) {
  const [query, setQuery] = React.useState("");
  const assets = library.assets || [];
  const visible = assets.filter((asset) => `${asset.title || ""} ${asset.description || ""}`.toLowerCase().includes(query.toLowerCase()));
  return <React.Fragment>
    <div className="hf-library-toolbar">
      <label><FIcon name="search" size={18} /><span className="sr-only">Search this library</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${library.title.toLowerCase()}`} /></label>
      <span>{visible.length} preview{visible.length === 1 ? "" : "s"}</span>
    </div>
    {visible.length ? <div className="hf-library-grid">{visible.map((asset) => <figure className="hf-asset" key={asset.id || asset.previewUrl}>
      <div>{asset.previewUrl ? <img src={asset.previewUrl} alt={asset.alternativeText || asset.title || "Brand asset"} loading="lazy" /> : <FIcon name="document-empty" size={30} />}</div>
      <figcaption><strong>{asset.title || "Untitled asset"}</strong>{asset.extension && <span>{asset.extension.toUpperCase()}</span>}</figcaption>
    </figure>)}</div> : <div className="hf-no-results"><strong>No previews found</strong><p>This library has no previewable assets in the current Hub snapshot.</p></div>}
  </React.Fragment>;
}

function FMediaLibraryNav({ active, onNavigate }) {
  const overview = fHub("69", "Overview");
  return <nav className="ml-section-nav" aria-label="Media Library sections">
    <div className="wrap ml-section-nav__track">
      <button type="button" className={!active ? "is-active" : ""} aria-current={!active ? "page" : undefined} onClick={() => onNavigate("assets", overview)}>Overview</button>
      {F_MEDIA_LIBRARY_SECTIONS.map((section) => {
        const target = fMediaLibrary(section.id, section.label);
        const isActive = section.id === active;
        return <button type="button" className={isActive ? "is-active" : ""} aria-current={isActive ? "page" : undefined} onClick={() => onNavigate("assets", target)} key={section.id}>{section.label}</button>;
      })}
    </div>
  </nav>;
}

function FMediaLibraryOverview({ onNavigate }) {
  const total = F_MEDIA_LIBRARY_SECTIONS.reduce((sum, section) => sum + (section.recordedCount || 0), 0);
  return <main className="ml-page ml-page--overview">
    <FMediaLibraryNav active={null} onNavigate={onNavigate} />
    <header className="ml-overview-hero">
      <div className="wrap ml-overview-hero__inner">
        <div className="ml-overview-hero__copy">
          <span className="ml-eyebrow">ImmoScout24 brand assets</span>
          <h1>Media Library.</h1>
          <p>Everything you need to create unmistakably ImmoScout24 work—organised, searchable and ready to explore.</p>
          <span className="ml-overview-hero__stat">{total.toLocaleString("en-GB")} assets recorded across the live library</span>
        </div>
        <img src={`${F_MEDIA_LIBRARY_ROOT}tiles/05-media-library_07_3F1Qfvn6d5NF3QLLKQgQ.svg`} alt="" aria-hidden="true" />
      </div>
    </header>

    <section className="wrap ml-overview-categories" aria-labelledby="ml-categories-title">
      <div className="ml-section-heading">
        <span>Browse by category</span>
        <h2 id="ml-categories-title">Find the right asset.</h2>
      </div>
      <div className="ml-category-grid">
        {F_MEDIA_LIBRARY_SECTIONS.map((section) => <button type="button" className="ml-category-card" style={{ "--ml-tint": section.tint }} key={section.id} onClick={() => onNavigate("assets", fMediaLibrary(section.id, section.label))}>
          <span className="ml-category-card__visual"><img src={`${F_MEDIA_LIBRARY_ROOT}${section.tile}`} alt="" loading="lazy" decoding="async" /></span>
          <span className="ml-category-card__copy">
            <strong>{section.label}</strong>
            <span>{section.recordedCount ? `${section.recordedCount.toLocaleString("en-GB")} assets` : "Templates and downloads"}</span>
          </span>
          <FIcon name="arrow-right" size={18} />
        </button>)}
      </div>
    </section>

    <div className="ml-overview-information">
      {F_MEDIA_LIBRARY_COPY.blocks.map((block, index) => <section className={`ml-info-band${index % 2 ? " is-warm" : ""}`} key={block.title}>
        <div className="wrap ml-info-band__inner">
          <h2>{block.title}</h2>
          <div className="ml-info-band__body">
            {block.body && <p>{block.body}</p>}
            {block.list && <ul>{block.list.map((item) => <li key={item}><FIcon name="accept" size={16} />{item}</li>)}</ul>}
            {block.columns && <div className="ml-info-columns">{block.columns.map((column) => <article key={column.title}><h3>{column.title}</h3>{column.body && <p>{column.body}</p>}</article>)}</div>}
          </div>
        </div>
      </section>)}
    </div>

    <section className="wrap ml-rights-note">
      <FIcon name="caution-glyph" size={18} />
      <div><strong>Usage rights</strong><p>{F_MEDIA_LIBRARY_COPY.note}</p></div>
    </section>
  </main>;
}

function fNormaliseMediaAssets(section, bundle, fallbackLibrary) {
  const files = bundle?.manifest ? [...(bundle.manifest.files || []), ...(bundle.manifest.videos || [])] : [];
  const local = files.filter((asset) => section.bundleLibraries.includes(String(asset.lib || "").toLowerCase())).map((asset) => ({
    ...asset,
    title: asset.title || asset.name || asset.n || "Untitled asset",
    extension: asset.extension || asset.ext || "",
    collection: asset.collection || asset.col || "",
    collectionKey: String(asset.col || asset.collection || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    width: asset.width || asset.w || null,
    height: asset.height || asset.h || null,
    previewUrl: fMediaPreview(asset, bundle.thumbs),
    downloadUrl: asset.downloadUrl || asset.originalUrl || null,
    sourceKind: "archive",
  }));
  if (local.length) return local;
  return (fallbackLibrary?.assets || []).map((asset) => ({
    ...asset,
    title: asset.title || "Untitled asset",
    extension: asset.extension || "",
    collection: asset.collection || "",
    collectionKey: String(asset.collection || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    sourceKind: "snapshot",
  }));
}

function FMediaAssetVisual({ asset, className = "" }) {
  const type = fMediaType(asset.extension);
  if (asset.previewUrl) return <img className={className} src={asset.previewUrl} alt={asset.alternativeText || asset.title || "Brand asset"} loading="lazy" decoding="async" />;
  return <span className={`ml-asset-placeholder ${className}`} aria-hidden="true"><FIcon name={type === "Video" ? "video" : type === "Image" ? "picture" : "document-empty"} size={32} /><small>{String(asset.extension || type).toUpperCase()}</small></span>;
}

function FMediaAssetModal({ asset, position, total, onClose, onPrevious, onNext }) {
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const prior = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
      prior?.focus?.();
    };
  }, [onClose, onPrevious, onNext]);
  if (!asset) return null;
  const type = fMediaType(asset.extension);
  const downloadUrl = asset.downloadUrl || asset.previewUrl;
  const downloadName = asset.downloadUrl ? asset.title : `${String(asset.title || "asset").replace(/\.[^.]+$/, "")}-preview.webp`;
  const copyName = () => navigator.clipboard?.writeText(asset.title || "");
  return <div className="ml-modal" role="dialog" aria-modal="true" aria-labelledby="ml-modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="ml-modal__panel">
      <header className="ml-modal__head">
        <span>{position + 1} / {total}</span>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close asset preview"><FIcon name="cancel" size={18} /></button>
      </header>
      <div className="ml-modal__visual"><FMediaAssetVisual asset={asset} /></div>
      <div className="ml-modal__details">
        <div><span>{type}</span><h2 id="ml-modal-title">{asset.title}</h2></div>
        <dl>
          <div><dt>File type</dt><dd>{String(asset.extension || "Unknown").toUpperCase()}</dd></div>
          <div><dt>Dimensions</dt><dd>{asset.width && asset.height ? `${asset.width} × ${asset.height} px` : "Not available"}</dd></div>
          <div><dt>File size</dt><dd>{fMediaSize(asset.kb)}</dd></div>
          <div><dt>Collection</dt><dd>{fMediaCollectionLabel(asset.collection)}</dd></div>
        </dl>
        <div className="ml-modal__actions">
          {downloadUrl && <a className="ml-button ml-button--primary" href={downloadUrl} download={downloadName}>{asset.downloadUrl ? "Download asset" : "Download preview"}</a>}
          <button className="ml-button" type="button" onClick={copyName}>Copy filename</button>
        </div>
        {!asset.downloadUrl && <p className="ml-modal__notice">This Hub copy contains an optimised preview. Production originals need approved external asset storage before they can be offered here.</p>}
      </div>
      <div className="ml-modal__pager">
        <button type="button" onClick={onPrevious} aria-label="Previous asset">Previous</button>
        <button type="button" onClick={onNext} aria-label="Next asset">Next</button>
      </div>
    </div>
  </div>;
}

function FMediaLibrarySection({ sectionId, library, onNavigate }) {
  const section = fMediaSection(sectionId);
  const bundleState = fUseMediaBundle();
  const assets = React.useMemo(() => fNormaliseMediaAssets(section, bundleState.data, library), [sectionId, bundleState.data, library]);
  const [query, setQuery] = React.useState("");
  const [collection, setCollection] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [orientation, setOrientation] = React.useState("all");
  const [iconSize, setIconSize] = React.useState("all");
  const [sort, setSort] = React.useState("name");
  const [view, setView] = React.useState("grid");
  const [limit, setLimit] = React.useState(48);
  const [selected, setSelected] = React.useState(() => new Set());
  const [modalIndex, setModalIndex] = React.useState(null);

  React.useEffect(() => {
    setQuery(""); setCollection("all"); setType("all"); setOrientation("all"); setIconSize("all"); setSort("name"); setLimit(48); setSelected(new Set()); setModalIndex(null);
  }, [sectionId]);

  const collectionOptions = React.useMemo(() => {
    const counts = new Map();
    assets.forEach((asset) => {
      const key = String(asset.collectionKey || "").toLowerCase();
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [assets]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = assets.filter((asset) => {
      const haystack = `${asset.title || ""} ${asset.description || ""} ${asset.alternativeText || ""} ${asset.collection || ""} ${asset.extension || ""}`.toLowerCase().replace(/[_-]+/g, " ");
      const collectionMatch = collection === "all" || String(asset.collectionKey || "").toLowerCase() === collection;
      const typeMatch = type === "all" || fMediaType(asset.extension).toLowerCase() === type;
      const assetOrientation = asset.width && asset.height ? asset.width === asset.height ? "square" : asset.width > asset.height ? "landscape" : "portrait" : "unknown";
      const orientationMatch = orientation === "all" || assetOrientation === orientation;
      const sizeMatch = iconSize === "all" || fMediaIconSize(asset) === iconSize;
      return (!needle || needle.split(/\s+/).every((token) => haystack.includes(token))) && collectionMatch && typeMatch && orientationMatch && sizeMatch;
    });
    return result.sort((a, b) => {
      if (sort === "size-desc") return Number(b.kb || 0) - Number(a.kb || 0);
      if (sort === "dimensions-desc") return Number((b.width || 0) * (b.height || 0)) - Number((a.width || 0) * (a.height || 0));
      return String(a.title || "").localeCompare(String(b.title || ""), undefined, { numeric: true, sensitivity: "base" });
    });
  }, [assets, query, collection, type, orientation, iconSize, sort]);

  React.useEffect(() => { setLimit(48); setModalIndex(null); }, [query, collection, type, orientation, iconSize, sort]);
  const visible = filtered.slice(0, limit);
  const selectedCount = selected.size;
  const toggleSelected = (id) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const selectVisible = () => setSelected((current) => { const next = new Set(current); visible.forEach((asset) => next.add(asset.id || asset.title)); return next; });
  const clearFilters = () => { setQuery(""); setCollection("all"); setType("all"); setOrientation("all"); setIconSize("all"); };
  const closeModal = React.useCallback(() => setModalIndex(null), []);
  const previousModal = React.useCallback(() => setModalIndex((index) => index == null ? null : (index - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextModal = React.useCallback(() => setModalIndex((index) => index == null ? null : (index + 1) % filtered.length), [filtered.length]);
  const modalAsset = modalIndex == null ? null : filtered[modalIndex];

  return <main className="ml-page ml-page--library">
    <FMediaLibraryNav active={section.id} onNavigate={onNavigate} />
    <header className="ml-library-hero" style={{ "--ml-tint": section.tint }}>
      <div className="wrap ml-library-hero__inner">
        <div><span className="ml-eyebrow">Media Library</span><h1>{section.label}</h1><p>{section.blurb}</p></div>
        <div className="ml-library-hero__meta"><strong>{section.recordedCount.toLocaleString("en-GB")}</strong><span>assets recorded in Frontify</span></div>
      </div>
    </header>

    <div className="wrap ml-library-workspace">
      {section.collections.length > 0 && <section className="ml-collections" aria-labelledby="ml-collections-title">
        <div className="ml-collections__head"><h2 id="ml-collections-title">Collections</h2><span>{section.facets.join(" · ")}</span></div>
        <div className="ml-collection-list">
          <button type="button" className={collection === "all" ? "is-active" : ""} onClick={() => setCollection("all")}><strong>{assets.length}</strong><span>All imported</span></button>
          {section.collections.map((item) => {
            const available = collectionOptions.some(([key]) => key === item.key);
            return <button type="button" className={collection === item.key ? "is-active" : ""} disabled={!available} title={available ? `Filter by ${item.label}` : "Collection membership was not included in the supplied archive"} onClick={() => available && setCollection(item.key)} key={item.key}><strong>{item.count}</strong><span>{item.label}</span></button>;
          })}
        </div>
      </section>}

      <section className="ml-browser" aria-labelledby="ml-assets-title">
        <div className="ml-browser__heading">
          <div><h2 id="ml-assets-title">Assets</h2><p>{bundleState.loading ? "Preparing the local preview index…" : `${filtered.length.toLocaleString("en-GB")} of ${assets.length.toLocaleString("en-GB")} imported records`}</p></div>
          <div className="ml-view-toggle" role="group" aria-label="Asset view"><button type="button" className={view === "grid" ? "is-active" : ""} aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</button><button type="button" className={view === "list" ? "is-active" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>List</button></div>
        </div>

        <div className="ml-toolbar">
          <label className="ml-search"><FIcon name="search" size={18} /><span className="sr-only">Search {section.label}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search filenames and English terms" /></label>
          {collectionOptions.length > 0 && <label><span>Collection</span><select value={collection} onChange={(event) => setCollection(event.target.value)}><option value="all">All collections</option>{collectionOptions.map(([key, count]) => <option value={key} key={key}>{fMediaCollectionLabel(key)} ({count})</option>)}</select></label>}
          <label><span>File type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option><option value="image">Images</option><option value="vector">Vectors</option><option value="video">Videos</option><option value="file">Other files</option></select></label>
          {section.id === "icons"
            ? <label><span>Size</span><select value={iconSize} onChange={(event) => setIconSize(event.target.value)}><option value="all">All sizes</option><option value="24">24 px</option><option value="48">48 px</option><option value="other">Other / unspecified</option></select></label>
            : <label><span>Orientation</span><select value={orientation} onChange={(event) => setOrientation(event.target.value)}><option value="all">Any orientation</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option><option value="square">Square</option><option value="unknown">Unspecified</option></select></label>}
          <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Filename A–Z</option><option value="size-desc">Largest file first</option><option value="dimensions-desc">Largest dimensions first</option></select></label>
        </div>

        {selectedCount > 0 && <div className="ml-selection-bar" role="status"><strong>{selectedCount} selected</strong><span><button type="button" onClick={selectVisible}>Select visible</button><button type="button" onClick={() => setSelected(new Set())}>Clear selection</button></span></div>}

        {bundleState.error && assets.length === 0 && <div className="ml-empty"><strong>The local preview bundle is not available yet.</strong><p>The library structure is ready, but its optimised preview index could not be loaded.</p></div>}
        {!bundleState.loading && filtered.length === 0 && <div className="ml-empty"><strong>No assets match these filters.</strong><p>Try a broader English term or clear the active filters.</p><button type="button" className="ml-button" onClick={clearFilters}>Clear filters</button></div>}
        {visible.length > 0 && <div className={`ml-asset-grid${view === "list" ? " is-list" : ""}`}>{visible.map((asset) => {
          const id = asset.id || asset.title;
          const resultIndex = filtered.indexOf(asset);
          return <article className={`ml-asset-card${selected.has(id) ? " is-selected" : ""}`} key={id}>
            <button type="button" className="ml-asset-card__select" aria-label={`${selected.has(id) ? "Deselect" : "Select"} ${asset.title}`} aria-pressed={selected.has(id)} onClick={() => toggleSelected(id)}><span aria-hidden="true">{selected.has(id) ? "✓" : ""}</span></button>
            <button type="button" className="ml-asset-card__preview" onClick={() => setModalIndex(resultIndex)} aria-label={`Preview ${asset.title}`}><FMediaAssetVisual asset={asset} /></button>
            <div className="ml-asset-card__meta"><strong title={asset.title}>{asset.title}</strong><span>{String(asset.extension || fMediaType(asset.extension)).toUpperCase()} · {fMediaSize(asset.kb)}</span></div>
          </article>;
        })}</div>}
        {visible.length < filtered.length && <div className="ml-load-more"><button className="ml-button ml-button--primary" type="button" onClick={() => setLimit((current) => current + 48)}>Show 48 more</button><span>{visible.length.toLocaleString("en-GB")} of {filtered.length.toLocaleString("en-GB")}</span></div>}
      </section>

      <aside className="ml-import-note"><FIcon name="caution-glyph" size={18} /><div><strong>Imported previews and live records are shown separately.</strong><p>The local archive does not contain Frontify’s tags, rights metadata, approval status, or every live record. This prevents missing data from being presented as complete.</p></div></aside>
    </div>
    {modalAsset && <FMediaAssetModal asset={modalAsset} position={modalIndex} total={filtered.length} onClose={closeModal} onPrevious={previousModal} onNext={nextModal} />}
  </main>;
}

/* Source-shaped Media Library ------------------------------------------------
   The original export contains the binary previews, but not Frontify's runtime
   taxonomy or authenticated download service. This view mirrors the source
   browsing model while ensuring every rendered control works on local data. */
const MF_SOURCE_COLLECTIONS = {
  "immopics": [
    {
      "key": "people",
      "label": "People",
      "titles": [
        "IS24_WheelchairUser",
        "IS24_Webinar",
        "IS24_VerkaufsProfi",
        "IS24_Vacationing",
        "IS24_United",
        "IS24_Team",
        "IS24_Tenant",
        "IS24_SuitUp",
        "IS24_Studierender_W",
        "IS24_Studierender_M",
        "IS24_SuccessfulSearch",
        "IS24_Stretching",
        "IS24_Step2FindProfessionalHelpers",
        "IS24_StartYourSearch",
        "IS24_SittingWoman",
        "IS24_Shopping",
        "IS24_Rentner_W",
        "IS24_Rentner_M",
        "IS24_Renovating",
        "IS24_Religion",
        "IS24_Relocation_03",
        "IS24_RegionalOrigin",
        "IS24_Recommender",
        "IS24_Pregnant",
        "IS24_ProfileFill_1",
        "IS24_PlusSize",
        "IS24_Person",
        "IS24_Performer",
        "IS24_Parent",
        "IS24_OldWoman",
        "IS24_OldCouple",
        "IS24_NeutralAgentB",
        "IS24_NeutralAgent",
        "IS24_Neukunde",
        "IS24_MovingBoxes",
        "IS24_Moderator",
        "IS24_MaklerVergleich",
        "IS24_Maklersuche",
        "IS24_KennenlernZeit",
        "IS24_InputProvider",
        "IS24_HulaHoop",
        "IS24_Gender",
        "IS24_EstateAgent",
        "IS24_Employees",
        "IS24_Erwachsener_Single_M",
        "IS24_Erwachsener_Single_W",
        "IS24_Eigentümerabfrage",
        "IS24_Duo",
        "IS24_DiscriminationHelp",
        "IS24_DiverseCouple",
        "IS24_DiverseDuo",
        "IS24_Decider",
        "IS24_ConstructionChild",
        "IS24_ConstructionWorker",
        "IS24_Child",
        "IS24_CarRepair",
        "IS24_Character",
        "IS24_BusinessDuo",
        "IS24_Broker",
        "IS24_BuildingMan",
        "IS24_Anbieterbewertung",
        "IS24_Alleinerziehend_W",
        "IS24_Alleinerziehend_M",
        "IS24_Agreer"
      ]
    },
    {
      "key": "real-estate",
      "label": "Real Estate",
      "titles": [
        "IS24_Village",
        "IS24_ViennaOpera",
        "IS24_ViennaCathedralFerriswheel",
        "IS24_Tower",
        "IS24_Tenant",
        "IS24_Storage",
        "IS24_SolarEnergy",
        "IS24_Souterrain",
        "IS24_SmallCity",
        "IS24_Skyline",
        "IS24_Skyline_C",
        "IS24_Skyline_B",
        "IS24_SemiDetachedHouseEnquiry",
        "IS24_SellingProperty",
        "IS24_RoofConstruction",
        "IS24_RentingHouseSign",
        "IS24_RentingHouseClock",
        "IS24_ReichstagsBuilding",
        "IS24_RaisedGroundFloor-",
        "IS24_NewBuildings",
        "IS24_ModernHouse",
        "IS24_ModernHouse_3",
        "IS24_ModernHouse_2",
        "IS24_MiddleCity",
        "IS24_MiddleCity_B",
        "IS24_LeaseCosts",
        "IS24_LaptopHouse",
        "IS24_Laptop",
        "IS24_Laptop_objectData",
        "IS24_ImmobilienBewertung",
        "IS24_HousingIndustry",
        "IS24_HousingConstruction_2",
        "IS24_HousingConstruction_1",
        "IS24_Houses",
        "IS24_Houses_2",
        "IS24_HouseOfTheMonth",
        "IS24_HouseCoins",
        "IS24_House_2",
        "IS24_House_1",
        "IS24_GroundFloorApartment",
        "IS24_FamilyHome",
        "IS24_Fachwerkhaus",
        "IS24_DuplexApartment",
        "IS24_CommercialBuilding",
        "IS24_Castle",
        "IS24_Campus",
        "IS24_BigCity",
        "IS24_AtticFlat",
        "IS24_ApartmentHouse",
        "IS24_Altbau",
        "IS4_Church"
      ]
    },
    {
      "key": "maps",
      "label": "Maps",
      "titles": [
        "Berlin_Districts",
        "Stuttgart_District",
        "Munich_Districts",
        "Leipzig_Districts",
        "Hamburg_Districts",
        "Frankfurt_Districts",
        "Dusseldorf_Districts",
        "Dresden_Districts",
        "Cologne_Districts",
        "Bremen_Districts",
        "Thüringen",
        "Schleswig-Holstein",
        "Sachsen",
        "Sachsen-Anhalt",
        "Saarland",
        "Rheinland-Pfalz",
        "NRW",
        "Niedersachsen",
        "Mecklenburg-Vorpommern",
        "IS24_Vienna",
        "IS24_Austria",
        "Hessen",
        "Hamburg",
        "Bremen",
        "Brandenburg",
        "Berlin",
        "Bayern",
        "Baden-Württemberg"
      ]
    }
  ],
  "highlighter": [
    {
      "key": "seeker",
      "label": "SEEKER",
      "titles": [
        "IS24_Arrow_01",
        "IS24_Arrow_02",
        "IS24_Arrow_Uprising_02",
        "IS24_Circle_01",
        "IS24_Scribble_01",
        "IS24_Scribble_02",
        "IS24_Scribble_03",
        "IS24_Scribble_04",
        "IS24_Upper_Curve_Highlighter_02-1",
        "IS24_Upper_Curve_Highlighter_02",
        "IS24_Upper_Curve_Highlighter_03-1",
        "IS24_Upper_Curve_Highlighter_04-1",
        "IS24_Upper_Curve_Highlighter_03",
        "IS24_Upper_Curve_Highlighter_04",
        "IS24_heart_Seeker"
      ]
    },
    {
      "key": "homeowner",
      "label": "HOMEOWNER",
      "titles": [
        "IS24_Arrow_01",
        "IS24_Arrow_uprising_01",
        "IS24_Arrow_Uprising_02",
        "IS24_Arrow_Uprising_03",
        "IS24_Arrow_Uprising_04",
        "IS24_Check_02",
        "IS24_Check_03",
        "IS24_Circle_01",
        "IS24_Heart_01",
        "IS24_Straight_Highlighter_02",
        "IS24_Straight_Highlighter_03",
        "IS24_pill_filled",
        "IS24_pill_outline"
      ]
    },
    {
      "key": "agents",
      "label": "AGENTS",
      "titles": [
        "IS24_Arrow_04",
        "IS24_Arrow_03",
        "IS24_Arrow_uprising_01",
        "IS24_Arrow_Uprising_03",
        "IS24_Check_03",
        "IS24_Straight_Highlighter_01",
        "IS24_Underline_01",
        "IS24_Underline_02",
        "IS24_Underline_05",
        "IS24_Underline_04"
      ]
    }
  ],
  "logos": [
    {
      "key": "immoscout24",
      "label": "ImmoScout24",
      "titles": [
        "ImmoScout24_logo_horizontal_invers",
        "ImmoScout24_logo_horizontal_white",
        "ImmoScout24_logo_vertical_invers",
        "ImmoScout24_logo_horizontal",
        "ImmoScout24_logo_vertical_white",
        "ImmoScout24_logo_vertical"
      ]
    },
    {
      "key": "soundlogos",
      "label": "SoundLogos",
      "titles": [
        "IS24_logo_primay_teal_charcoal",
        "IS24_logo_primay_teal_white",
        "IS24_logo_primay_white_charcoal"
      ]
    },
    {
      "key": "badges",
      "label": "badges",
      "titles": []
    },
    {
      "key": "scout24",
      "label": "Scout24",
      "titles": []
    }
  ]
};

const MF_ASSET_SECTIONS = F_MEDIA_LIBRARY_SECTIONS.filter((section) => section.id !== "templates");

function MFMediaLibraryNav({ active, onNavigate }) {
  return <nav className="mf-nav" aria-label="Media Library sections">
    <div className="wrap mf-nav__track">
      <button type="button" className={!active ? "is-active" : ""} aria-current={!active ? "page" : undefined} onClick={() => onNavigate("assets", fHub("69", "Overview"))}>Overview</button>
      {F_MEDIA_LIBRARY_SECTIONS.map((section) => <button type="button" className={active === section.id ? "is-active" : ""} aria-current={active === section.id ? "page" : undefined} onClick={() => onNavigate("assets", fMediaLibrary(section.id, section.label))} key={section.id}>{section.label}</button>)}
    </div>
  </nav>;
}

function MFMediaLibraryOverview({ onNavigate }) {
  return <main className="mf-page mf-overview">
    <MFMediaLibraryNav active={null} onNavigate={onNavigate} />
    <header className="wrap mf-overview__head">
      <h1>Media Library</h1>
    </header>
    <section className="wrap mf-overview__categories" aria-label="Asset categories">
      <div className="mf-category-grid">
        {F_MEDIA_LIBRARY_SECTIONS.map((section) => <button type="button" className="mf-category" onClick={() => onNavigate("assets", fMediaLibrary(section.id, section.label))} key={section.id}>
          <span className="mf-category__art"><img src={F_MEDIA_LIBRARY_ROOT + section.tile} alt="" loading="lazy" decoding="async" /></span>
          <span className="mf-category__label"><strong>{section.label}</strong><small>{section.recordedCount ? section.recordedCount.toLocaleString("en-GB") + " assets" : "Templates"}</small></span>
        </button>)}
      </div>
    </section>
    <div className="mf-overview__information">
      {F_MEDIA_LIBRARY_COPY.blocks.map((block, index) => <section className={"mf-info" + (index % 2 ? " is-sand" : "")} key={block.title}>
        <div className="wrap mf-info__inner">
          <h2>{block.title}</h2>
          <div className="mf-info__content">
            {block.body && <p>{block.body}</p>}
            {block.list && <ul>{block.list.map((item) => <li key={item}><FIcon name="accept" size={16} /><span>{item}</span></li>)}</ul>}
            {block.columns && <div className="mf-info__columns">{block.columns.map((column) => <article key={column.title}><h3>{column.title}</h3>{column.body && <p>{column.body}</p>}</article>)}</div>}
          </div>
        </div>
      </section>)}
    </div>
    <aside className="wrap mf-rights">
      <FIcon name="caution-glyph" size={17} />
      <div><strong>Please note</strong><p>{F_MEDIA_LIBRARY_COPY.note}</p></div>
    </aside>
  </main>;
}

function mfAssetKey(value) {
  return String(value || "").toLowerCase().replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[^a-z0-9]+/g, "");
}

function mfSourceMembership(sectionId, title) {
  if (!["immopics", "highlighter"].includes(sectionId)) return [];
  const key = mfAssetKey(title);
  return (MF_SOURCE_COLLECTIONS[sectionId] || []).filter((collection) => collection.titles.some((candidate) => mfAssetKey(candidate) === key));
}

function mfNormaliseAssets(section, bundle, fallbackLibrary) {
  const files = bundle?.manifest ? [].concat(bundle.manifest.files || [], bundle.manifest.videos || []) : [];
  const archive = files.filter((asset) => section.bundleLibraries.includes(String(asset.lib || "").toLowerCase())).map((asset, index) => ({
    ...asset,
    title: asset.title || asset.name || asset.n || "Untitled asset",
    extension: asset.extension || asset.ext || "",
    collection: asset.collection || asset.col || "",
    collectionKey: String(asset.col || asset.collection || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    width: asset.width || asset.w || null,
    height: asset.height || asset.h || null,
    previewUrl: fMediaPreview(asset, bundle.thumbs),
    downloadUrl: asset.downloadUrl || asset.originalUrl || null,
    sourceKind: "archive",
    sourceOrder: index,
  }));
  const byTitle = new Map();
  archive.forEach((asset) => {
    const key = mfAssetKey(asset.title);
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key).push(asset);
  });
  const used = new Set();
  const ordered = [];
  (fallbackLibrary?.assets || []).forEach((snapshot, index) => {
    const match = (byTitle.get(mfAssetKey(snapshot.title)) || []).find((asset) => !used.has(asset.id));
    if (match) {
      used.add(match.id);
      ordered.push({ ...snapshot, ...match, sourceOrder: index });
    } else if (snapshot.previewUrl) {
      ordered.push({
        ...snapshot,
        title: snapshot.title || "Untitled asset",
        extension: snapshot.extension || "",
        collection: snapshot.collection || "",
        collectionKey: String(snapshot.collection || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        sourceKind: "snapshot",
        sourceOrder: index,
      });
    }
  });
  archive.forEach((asset) => {
    if (!used.has(asset.id)) ordered.push({ ...asset, sourceOrder: ordered.length });
  });
  return ordered.map((asset) => {
    const sourceMembership = mfSourceMembership(section.id, asset.title);
    const localKeys = asset.collectionKey ? [asset.collectionKey] : [];
    return {
      ...asset,
      collectionKeys: sourceMembership.length ? sourceMembership.map((item) => item.key) : (["immopics", "highlighter"].includes(section.id) ? [] : localKeys),
      collection: sourceMembership.length ? sourceMembership.map((item) => item.label).join(" · ") : asset.collection,
    };
  });
}

function mfPreviewExtension(asset) {
  if (String(asset.previewUrl || "").startsWith("data:image/svg+xml")) return "svg";
  return "webp";
}

function mfDownloadPreview(asset) {
  const url = asset.downloadUrl || asset.previewUrl;
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = asset.downloadUrl ? asset.title : String(asset.title || "asset").replace(/\.[^.]+$/, "") + "-preview." + mfPreviewExtension(asset);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const MF_ICON_COLOURS = {
  charcoal: { label: "Charcoal", hex: "#333333" },
  white: { label: "White", hex: "#FFFFFF" },
};

function mfIconAssetUrl(path) {
  const encoded = String(path || "").split("/").map((part) => encodeURIComponent(part)).join("/");
  return new URL(`${F_MEDIA_LIBRARY_ROOT}${encoded}`, document.baseURI).href;
}

function mfIconVariant(design, size) {
  const exact = design?.variants?.find((variant) => Number(variant.size) === Number(size));
  if (exact) return exact;
  const preferred = design?.variants?.find((variant) => Number(variant.size) === Number(design.defaultSize));
  return preferred || design?.variants?.[0] || null;
}

function mfIconSizeSummary(design) {
  const standard = (design?.sizes || []).filter((size) => [24, 48].includes(Number(size)));
  if (standard.length) return standard.map((size) => `${size}px`).join(" + ");
  return "Special format";
}

function mfIconStyleLabel(value) {
  return value === "glyph" ? "Glyph" : value === "energy" ? "Energy label" : "Standard";
}

function mfExactFileSize(bytes) {
  const value = Number(bytes || 0);
  if (!value) return "Unknown";
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(value < 10240 ? 1 : 0)} KB`;
}

function mfIconDownloadName(design, variant, colour, extension) {
  const name = String(design?.name || "icon").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const size = variant?.size ? `-${variant.size}` : "";
  const colourName = design?.colourable ? `-${colour}` : "-original";
  return `${name || "icon"}${size}${colourName}.${extension}`;
}

function mfTriggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function mfRecolourSvg(source, colour) {
  const documentNode = new DOMParser().parseFromString(source, "image/svg+xml");
  if (documentNode.querySelector("parsererror")) throw new Error("This SVG could not be read.");
  const paintTags = new Set(["path", "circle", "ellipse", "rect", "polygon", "polyline", "line", "text", "use"]);
  documentNode.querySelectorAll("*").forEach((element) => {
    const fill = element.getAttribute("fill");
    const stroke = element.getAttribute("stroke");
    if (fill && !/^(none|transparent)$/i.test(fill)) element.setAttribute("fill", colour);
    if (stroke && !/^(none|transparent)$/i.test(stroke)) element.setAttribute("stroke", colour);
    if (!fill && !stroke && paintTags.has(element.localName)) element.setAttribute("fill", colour);
    const style = element.getAttribute("style");
    if (style) {
      const recoloured = style.split(";").map((rule) => {
        const split = rule.indexOf(":");
        if (split < 0) return rule;
        const property = rule.slice(0, split).trim().toLowerCase();
        const value = rule.slice(split + 1).trim();
        if (["fill", "stroke"].includes(property) && !/^(none|transparent)$/i.test(value)) return `${property}:${colour}`;
        return rule;
      }).join(";");
      element.setAttribute("style", recoloured);
    }
  });
  const root = documentNode.documentElement;
  if (!root.getAttribute("xmlns")) root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(root);
}

function mfIconCanvasSize(variant) {
  if (variant?.size) return { width: Number(variant.size), height: Number(variant.size) };
  const values = String(variant?.viewBox || "").split(/\s+/).map(Number);
  if (values.length === 4 && values.every(Number.isFinite)) return { width: Math.max(1, Math.round(values[2])), height: Math.max(1, Math.round(values[3])) };
  return { width: 48, height: 48 };
}

async function mfDownloadIcon(design, variant, format, colourKey) {
  if (!variant) throw new Error("No source file is available for this size.");
  const response = await fetch(mfIconAssetUrl(variant.path));
  if (!response.ok) throw new Error(`The original SVG returned ${response.status}.`);
  const original = await response.text();
  const colour = MF_ICON_COLOURS[colourKey]?.hex || MF_ICON_COLOURS.charcoal.hex;
  const svg = design.colourable ? mfRecolourSvg(original, colour) : original;
  if (format === "svg") {
    mfTriggerBlobDownload(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), mfIconDownloadName(design, variant, colourKey, "svg"));
    return;
  }
  const sourceBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const sourceUrl = URL.createObjectURL(sourceBlob);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("The SVG could not be converted to PNG."));
      image.src = sourceUrl;
    });
    const dimensions = mfIconCanvasSize(variant);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!png) throw new Error("The PNG file could not be created.");
    mfTriggerBlobDownload(png, mfIconDownloadName(design, variant, colourKey, "png"));
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function MFIconGlyph({ design, variant, colour = "charcoal", large = false }) {
  if (!variant) return <span className="mi-glyph mi-glyph--missing"><FIcon name="caution-glyph" size={18} /></span>;
  const url = mfIconAssetUrl(variant.path);
  if (!design.colourable) return <img className={`mi-glyph mi-glyph--original${large ? " is-large" : ""}`} src={url} alt="" aria-hidden="true" />;
  return <span className={`mi-glyph${large ? " is-large" : ""}`} style={{ "--mi-icon-url": `url("${url.replace(/\"/g, "%22")}")`, "--mi-icon-colour": MF_ICON_COLOURS[colour]?.hex || MF_ICON_COLOURS.charcoal.hex }} aria-hidden="true" />;
}

function MFIconCard({ design, previewSize, colour, onOpen }) {
  const variant = mfIconVariant(design, previewSize);
  const usesFallback = Number(variant?.size) !== Number(previewSize);
  return <article className={`mi-card${colour === "white" && design.colourable ? " is-dark" : ""}`}>
    <button type="button" className="mi-card__button" onClick={onOpen} aria-label={`Open ${design.name} icon details`}>
      <span className="mi-card__canvas">
        <MFIconGlyph design={design} variant={variant} colour={colour} />
        <span className="mi-card__size">{variant?.size ? `${variant.size}px` : "Special"}{usesFallback ? " available" : ""}</span>
      </span>
      <span className="mi-card__body">
        <strong>{design.name}</strong>
        <span>{mfIconStyleLabel(design.style)} · {mfIconSizeSummary(design)}</span>
        <em>View metadata &amp; download <FIcon name="arrow-right" size={12} /></em>
      </span>
    </button>
  </article>;
}

function MFIconDetail({ design, relatedStyles = [], position, total, onDesignChange, onClose, onPrevious, onNext }) {
  const panelRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const availableStandardSizes = (design.sizes || []).filter((size) => [24, 48].includes(Number(size)));
  const [size, setSize] = React.useState(availableStandardSizes.includes(24) ? 24 : availableStandardSizes.includes(48) ? 48 : design.defaultSize);
  const [format, setFormat] = React.useState("svg");
  const [colour, setColour] = React.useState("charcoal");
  const [status, setStatus] = React.useState("");
  const [downloading, setDownloading] = React.useState(false);
  React.useEffect(() => {
    const standard = (design.sizes || []).filter((item) => [24, 48].includes(Number(item)));
    setSize(standard.includes(24) ? 24 : standard.includes(48) ? 48 : design.defaultSize);
    setFormat("svg");
    setColour("charcoal");
    setStatus("");
  }, [design.id]);
  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      const isControl = /^(INPUT|SELECT|BUTTON)$/.test(event.target?.tagName || "");
      if (!isControl && event.key === "ArrowLeft") onPrevious();
      if (!isControl && event.key === "ArrowRight") onNext();
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose, onPrevious, onNext]);
  const variant = mfIconVariant(design, size);
  const displayedColour = design.colourable ? colour : "original";
  const download = async () => {
    setDownloading(true);
    setStatus("");
    try {
      await mfDownloadIcon(design, variant, format, colour);
      setStatus(`${format.toUpperCase()} download created from the original SVG.`);
    } catch (error) {
      setStatus(error.message || "The download could not be created.");
    } finally {
      setDownloading(false);
    }
  };
  return <div className="mi-detail" role="dialog" aria-modal="true" aria-labelledby="mi-detail-title">
    <div className="mi-detail__panel" ref={panelRef}>
      <section className={`mi-detail__preview${colour === "white" && design.colourable ? " is-dark" : ""}`}>
        <button type="button" className="mi-detail__back" ref={closeRef} onClick={onClose}><FIcon name="arrow-left" size={16} /> Back to icons</button>
        <MFIconGlyph design={design} variant={variant} colour={colour} large />
        <span className="mi-detail__preview-label">{variant?.size ? `${variant.size} px source` : variant?.viewBox || "Original format"}</span>
        <div className="mi-detail__pager">
          <button type="button" onClick={onPrevious} aria-label="Previous icon"><FIcon name="arrow-left" size={16} /></button>
          <span>{position + 1} / {total}</span>
          <button type="button" onClick={onNext} aria-label="Next icon"><FIcon name="arrow-right" size={16} /></button>
        </div>
      </section>
      <aside className="mi-detail__controls">
        <button type="button" className="mi-detail__close" onClick={onClose} aria-label="Close icon details"><FIcon name="cancel" size={16} /></button>
        <span className="mi-detail__eyebrow">Icon design</span>
        <h2 id="mi-detail-title">{design.name}</h2>

        {relatedStyles.length > 1 && <fieldset className="mi-segment">
          <legend>Glyph variant</legend>
          <div>{relatedStyles.map((item) => <label key={item.id}><input type="radio" name="mi-detail-style" value={item.id} checked={design.id === item.id} onChange={() => onDesignChange?.(item.id)} /><span>{mfIconStyleLabel(item.style)}</span></label>)}</div>
        </fieldset>}

        <fieldset className="mi-segment" disabled={!availableStandardSizes.length}>
          <legend>Size</legend>
          <div>{[24, 48].map((value) => <label className={!availableStandardSizes.includes(value) ? "is-disabled" : ""} key={value}><input type="radio" name="mi-detail-size" value={value} checked={Number(size) === value} disabled={!availableStandardSizes.includes(value)} onChange={() => setSize(value)} /><span>{value} px</span></label>)}</div>
          {!availableStandardSizes.length && <small>Special source size: {variant?.viewBox || "original"}</small>}
        </fieldset>

        <fieldset className="mi-segment">
          <legend>Colour</legend>
          {design.colourable ? <div>{Object.entries(MF_ICON_COLOURS).map(([key, item]) => <label key={key}><input type="radio" name="mi-detail-colour" value={key} checked={colour === key} onChange={() => setColour(key)} /><span><i style={{ background: item.hex }} />{item.label}</span></label>)}</div> : <p>Original multicolour artwork</p>}
        </fieldset>

        <fieldset className="mi-segment">
          <legend>Download format</legend>
          <div>{["svg", "png"].map((value) => <label key={value}><input type="radio" name="mi-detail-format" value={value} checked={format === value} onChange={() => setFormat(value)} /><span>{value.toUpperCase()}</span></label>)}</div>
        </fieldset>

        <section className="mi-detail__metadata" aria-labelledby="mi-metadata-title">
          <h3 id="mi-metadata-title">Metadata</h3>
          <dl>
            <div><dt>Style</dt><dd>{mfIconStyleLabel(design.style)}</dd></div>
            <div><dt>Available sizes</dt><dd>{mfIconSizeSummary(design)}</dd></div>
            <div><dt>Selected source</dt><dd>{variant?.file || "Not available"}</dd></div>
            <div><dt>Vector artboard</dt><dd>{variant?.viewBox || "Not specified"}</dd></div>
            <div><dt>Original format</dt><dd>SVG</dd></div>
            <div><dt>Original size</dt><dd>{mfExactFileSize(variant?.bytes)}</dd></div>
            <div><dt>Colour</dt><dd>{displayedColour === "original" ? "Original multicolour" : MF_ICON_COLOURS[displayedColour].label}</dd></div>
            <div><dt>Source files</dt><dd>{design.variants.length}</dd></div>
          </dl>
          {design.variants.length > 1 && <details><summary>All source filenames</summary><ul>{design.variants.map((item) => <li key={item.file}>{item.file}</li>)}</ul></details>}
        </section>

        <button type="button" className="mi-download" onClick={download} disabled={downloading || !variant}>{downloading ? "Creating download…" : `Download ${format.toUpperCase()}`}<FIcon name="download" size={16} /></button>
        <p className="mi-detail__status" aria-live="polite">{status}</p>
      </aside>
    </div>
  </div>;
}

function MFIconLibrary({ onNavigate }) {
  const section = fMediaSection("icons");
  const catalogState = fUseIconCatalog();
  const designs = catalogState.data?.designs || [];
  const [query, setQuery] = React.useState("");
  const [limit, setLimit] = React.useState(80);
  const [activeId, setActiveId] = React.useState(null);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = designs.filter((design) => {
      return !needle || String(design.keywords || design.name).toLowerCase().includes(needle);
    });
    return result;
  }, [designs, query]);

  React.useEffect(() => { setLimit(80); setActiveId(null); }, [query]);
  const visible = filtered.slice(0, limit);
  const activeIndex = activeId ? filtered.findIndex((design) => design.id === activeId) : -1;
  const activeDesign = activeIndex >= 0 ? filtered[activeIndex] : null;
  const closeDetail = React.useCallback(() => setActiveId(null), []);
  const previousDetail = React.useCallback(() => setActiveId((current) => {
    const index = filtered.findIndex((design) => design.id === current);
    return filtered.length ? filtered[(index - 1 + filtered.length) % filtered.length].id : null;
  }), [filtered]);
  const nextDetail = React.useCallback(() => setActiveId((current) => {
    const index = filtered.findIndex((design) => design.id === current);
    return filtered.length ? filtered[(index + 1) % filtered.length].id : null;
  }), [filtered]);
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (activeDesign) url.searchParams.set("asset", activeDesign.id);
    else url.searchParams.delete("asset");
    window.history.replaceState({}, "", url);
  }, [activeDesign]);
  const hasFilters = Boolean(query);
  const clearFilters = () => setQuery("");
  const relatedStylesFor = (design) => {
    const family = String(design.id || "").replace(/^icon-/, "").replace(/-glyph$/, "");
    return designs.filter((item) => item.id === `icon-${family}` || item.id === `icon-${family}-glyph`);
  };

  return <main className="mf-page mf-library mf-library--icons mi-page">
    <MFMediaLibraryNav active="icons" onNavigate={onNavigate} />
    <header className="wrap mf-library__head mi-head">
      <div><span>Media Library</span><h1>Icons</h1><p>Browse one design per card. Icons preview at the 24px standard; open a design to choose another source and download the original SVG or a transparent PNG.</p></div>
      <div className="mf-library__count"><strong>{(catalogState.data?.fileCount || section.recordedCount).toLocaleString("en-GB")}</strong><span>full SVG originals</span><small>{designs.length.toLocaleString("en-GB")} icon designs</small></div>
    </header>

    <section className="wrap mi-workspace" aria-labelledby="mi-results-title">
      <div className="mi-toolbar">
        <label className="mi-search"><span>Search icons</span><span className="mi-search__field"><FIcon name="search" size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search design names or filenames" /></span></label>
        {hasFilters && <button type="button" className="mi-clear" onClick={clearFilters}>Clear search</button>}
      </div>

      <div className="mi-results-head">
        <div><h2 id="mi-results-title">Icon designs</h2><span aria-live="polite">{catalogState.loading ? "Loading…" : `${filtered.length.toLocaleString("en-GB")} results`}</span></div>
        <p>24 px is always the standard preview. Open an icon to switch to a real 48 px source when available.</p>
      </div>

      {catalogState.error && <div className="mf-empty"><strong>The icon catalogue could not be loaded.</strong><p>Refresh the page or check the local server.</p></div>}
      {!catalogState.loading && !filtered.length && <div className="mf-empty"><strong>No icon designs found</strong><p>Try another search term or clear the active filters.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
      {visible.length > 0 && <div className="mi-grid">{visible.map((design) => <MFIconCard design={design} previewSize={24} colour="charcoal" onOpen={() => setActiveId(design.id)} key={design.id} />)}</div>}
      {visible.length < filtered.length && <div className="mf-more"><button type="button" onClick={() => setLimit((value) => value + 80)}>Show 80 more</button><span>{visible.length.toLocaleString("en-GB")} of {filtered.length.toLocaleString("en-GB")}</span></div>}
    </section>

    {activeDesign && <MFIconDetail design={activeDesign} relatedStyles={relatedStylesFor(activeDesign)} position={activeIndex} total={filtered.length} onDesignChange={setActiveId} onClose={closeDetail} onPrevious={previousDetail} onNext={nextDetail} />}
  </main>;
}

function MFAssetVisual({ asset, sectionId, detail = false }) {
  const type = fMediaType(asset.extension);
  const url = asset.previewUrl;
  const className = "mf-asset-visual mf-asset-visual--" + sectionId + " mf-asset-visual--" + type.toLowerCase();
  const isVideoUrl = type === "Video" && /\.(?:mp4|webm|m4v)(?:[?#]|$)/i.test(String(url || ""));
  if (url && isVideoUrl) return <video className={className} src={url} controls={detail} muted={!detail} playsInline preload="metadata" />;
  if (url) return <img className={className} src={url} alt={asset.alternativeText || asset.title || "Brand asset"} loading={detail ? "eager" : "lazy"} decoding="async" />;
  return <span className={className + " mf-asset-placeholder"} aria-hidden="true"><FIcon name={type === "Image" ? "picture" : "document-empty"} size={30} /><small>{String(asset.extension || type).toUpperCase()}</small></span>;
}

function MFAssetDetail({ asset, sectionId, position, total, onClose, onPrevious, onNext }) {
  const panelRef = React.useRef(null);
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose, onPrevious, onNext]);
  const type = fMediaType(asset.extension);
  return <div className="mf-detail" role="dialog" aria-modal="true" aria-labelledby="mf-detail-title">
    <div className="mf-detail__panel" ref={panelRef}>
      <div className={"mf-detail__stage mf-detail__stage--" + sectionId}>
        <button type="button" className="mf-detail__back" ref={closeRef} onClick={onClose} aria-label="Close asset detail"><FIcon name="arrow-left" size={17} /><span>Back</span></button>
        <MFAssetVisual asset={asset} sectionId={sectionId} detail />
        <div className="mf-detail__pager">
          <button type="button" onClick={onPrevious} aria-label="Previous asset"><FIcon name="arrow-left" size={17} /></button>
          <span>{position + 1} / {total}</span>
          <button type="button" onClick={onNext} aria-label="Next asset"><FIcon name="arrow-right" size={17} /></button>
        </div>
      </div>
      <aside className="mf-detail__meta">
        <button type="button" className="mf-detail__close" onClick={onClose} aria-label="Close asset detail"><FIcon name="cancel" size={17} /></button>
        <span className="mf-detail__type">{type}</span>
        <h2 id="mf-detail-title">{asset.title}</h2>
        <div className="mf-detail__section">
          <h3>File info</h3>
          <dl>
            <div><dt>Format</dt><dd>{String(asset.extension || "Unknown").toUpperCase()}</dd></div>
            <div><dt>File size</dt><dd>{fMediaSize(asset.kb)}</dd></div>
            <div><dt>Resolution</dt><dd>{asset.width && asset.height ? asset.width + " × " + asset.height + " px" : "Not available"}</dd></div>
            <div><dt>Collection</dt><dd>{fMediaCollectionLabel(asset.collection)}</dd></div>
          </dl>
        </div>
        <div className="mf-detail__section">
          <h3>Usage rights</h3>
          <p>Rights metadata was not included in the supplied archive. Confirm intended use with Creative Studio.</p>
        </div>
        <div className="mf-detail__actions">
          {(asset.downloadUrl || asset.previewUrl) && <button type="button" onClick={() => mfDownloadPreview(asset)}>{asset.downloadUrl ? "Download asset" : "Download preview"}</button>}
        </div>
      </aside>
    </div>
  </div>;
}

function MFMediaLibrarySection({ sectionId, library, onNavigate }) {
  const section = fMediaSection(sectionId);
  const bundleState = fUseMediaBundle();
  const assets = React.useMemo(() => mfNormaliseAssets(section, bundleState.data, library), [sectionId, bundleState.data, library]);
  const [query, setQuery] = React.useState("");
  const [collection, setCollection] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [orientation, setOrientation] = React.useState("all");
  const [iconSize, setIconSize] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [limit, setLimit] = React.useState(64);
  const [selected, setSelected] = React.useState(() => new Set());
  const [detailIndex, setDetailIndex] = React.useState(null);

  React.useEffect(() => {
    setQuery(""); setCollection("all"); setType("all"); setOrientation("all"); setIconSize("all"); setSort("newest");
    setFilterOpen(false); setLimit(64); setSelected(new Set()); setDetailIndex(null);
  }, [sectionId]);

  const collections = React.useMemo(() => {
    if (section.id === "icons") return [];
    const map = new Map();
    assets.forEach((asset) => {
      (asset.collectionKeys || []).forEach((rawKey) => {
        const key = String(rawKey || "").toLowerCase();
        if (!key) return;
        const source = (MF_SOURCE_COLLECTIONS[section.id] || []).find((item) => item.key === key);
        const current = map.get(key) || { key, label: source?.label || fMediaCollectionLabel(asset.collection || key), count: 0, cover: null };
        current.count += 1;
        if (!current.cover && asset.previewUrl) current.cover = asset;
        map.set(key, current);
      });
    });
    if (section.id === "images") {
      return section.collections.map((source) => {
        const local = map.get(source.key);
        return local ? { ...local, label: source.label } : null;
      }).filter(Boolean);
    }
    if (["immopics", "highlighter"].includes(section.id)) {
      return (MF_SOURCE_COLLECTIONS[section.id] || []).map((source) => map.get(source.key)).filter(Boolean);
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" }));
  }, [assets, section.id]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = assets.filter((asset) => {
      const haystack = [asset.title, asset.collection, asset.extension].filter(Boolean).join(" ").toLowerCase().replace(/[_-]+/g, " ");
      const assetType = fMediaType(asset.extension).toLowerCase();
      const assetOrientation = asset.width && asset.height ? (asset.width === asset.height ? "square" : asset.width > asset.height ? "landscape" : "portrait") : "unknown";
      return (!needle || needle.split(/\s+/).every((token) => haystack.includes(token)))
        && (collection === "all" || (asset.collectionKeys || []).includes(collection))
        && (type === "all" || assetType === type)
        && (orientation === "all" || assetOrientation === orientation)
        && (iconSize === "all" || fMediaIconSize(asset) === iconSize);
    });
    return result.sort((a, b) => {
      if (sort === "oldest") return Number(b.sourceOrder || 0) - Number(a.sourceOrder || 0);
      if (sort === "title-asc") return String(a.title || "").localeCompare(String(b.title || ""), undefined, { numeric: true, sensitivity: "base" });
      if (sort === "title-desc") return String(b.title || "").localeCompare(String(a.title || ""), undefined, { numeric: true, sensitivity: "base" });
      return Number(a.sourceOrder || 0) - Number(b.sourceOrder || 0);
    });
  }, [assets, query, collection, type, orientation, iconSize, sort]);

  React.useEffect(() => { setLimit(64); setDetailIndex(null); }, [query, collection, type, orientation, iconSize, sort]);
  const visible = filtered.slice(0, limit);
  const selectedAssets = assets.filter((asset) => selected.has(asset.id || asset.title));
  const activeFilterCount = [type, orientation, iconSize].filter((value) => value !== "all").length;
  const toggleSelected = (id) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const clearFilters = () => { setType("all"); setOrientation("all"); setIconSize("all"); };
  const closeDetail = React.useCallback(() => setDetailIndex(null), []);
  const previousDetail = React.useCallback(() => setDetailIndex((index) => index == null || !filtered.length ? null : (index - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextDetail = React.useCallback(() => setDetailIndex((index) => index == null || !filtered.length ? null : (index + 1) % filtered.length), [filtered.length]);
  const detailAsset = detailIndex == null ? null : filtered[detailIndex];

  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (detailAsset) url.searchParams.set("asset", detailAsset.id || detailAsset.title);
    else url.searchParams.delete("asset");
    window.history.replaceState({}, "", url);
  }, [detailAsset]);

  const downloadSelected = () => selectedAssets.filter((asset) => asset.downloadUrl || asset.previewUrl).forEach((asset, index) => window.setTimeout(() => mfDownloadPreview(asset), index * 120));

  return <main className="mf-page mf-library">
    <MFMediaLibraryNav active={section.id} onNavigate={onNavigate} />
    <header className="wrap mf-library__head">
      <div>
        <span>Media Library</span>
        <h1>{section.label}</h1>
        <p>{section.blurb}</p>
      </div>
      <div className="mf-library__count"><strong>{section.recordedCount.toLocaleString("en-GB")}</strong><span>assets in the source library</span><small>{assets.length.toLocaleString("en-GB")} previews available here</small></div>
    </header>

    <section className="wrap mf-library__workspace" aria-labelledby="mf-assets-title">
      <form className="mf-searchbar" onSubmit={(event) => event.preventDefault()}>
        <div className="mf-filter-control">
          <button type="button" className={filterOpen ? "is-open" : ""} aria-expanded={filterOpen} onClick={() => setFilterOpen((value) => !value)}>Filter{activeFilterCount ? " (" + activeFilterCount + ")" : ""}</button>
          {filterOpen && <div className="mf-filter-panel">
            <label><span>File type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option><option value="image">Images</option><option value="vector">Vectors</option><option value="video">Videos</option><option value="file">Other files</option></select></label>
            {section.id === "icons"
              ? <label><span>Size</span><select value={iconSize} onChange={(event) => setIconSize(event.target.value)}><option value="all">All sizes</option><option value="24">24 px</option><option value="48">48 px</option><option value="other">Other</option></select></label>
              : <label><span>Orientation</span><select value={orientation} onChange={(event) => setOrientation(event.target.value)}><option value="all">Any orientation</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option><option value="square">Square</option><option value="unknown">Unspecified</option></select></label>}
            <button type="button" className="mf-filter-panel__clear" onClick={clearFilters}>Clear filters</button>
          </div>}
        </div>
        <label className="mf-search"><span className="sr-only">Search {section.label}</span><FIcon name="search" size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search filenames and collections" /></label>
        <button type="submit" className="mf-searchbar__submit">Search</button>
      </form>

      {collections.length > 0 && <section className="mf-collections" aria-labelledby="mf-collections-title">
        <div className="mf-row-head"><h2 id="mf-collections-title">Collections</h2><span>{collections.length}</span></div>
        <div className="mf-collections__track">
          <button type="button" className={"mf-collection" + (collection === "all" ? " is-active" : "")} onClick={() => setCollection("all")}><span className="mf-collection__cover mf-collection__cover--all">All</span><strong>All assets</strong></button>
          {collections.map((item) => <button type="button" className={"mf-collection mf-collection--" + section.id + (collection === item.key ? " is-active" : "")} onClick={() => setCollection(item.key)} key={item.key}>
            <span className="mf-collection__cover">{item.cover ? <MFAssetVisual asset={item.cover} sectionId={section.id} /> : <span>{item.count}</span>}</span>
            <strong>{item.label}</strong>
          </button>)}
        </div>
      </section>}

      <section className="mf-assets">
        <div className="mf-row-head mf-assets__head">
          <div><h2 id="mf-assets-title">Assets</h2><span>{bundleState.loading ? "Preparing previews…" : filtered.length.toLocaleString("en-GB")}</span></div>
          <label><span className="sr-only">Sort assets</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title-asc">Title A–Z</option><option value="title-desc">Title Z–A</option></select></label>
        </div>
        {bundleState.error && !assets.length && <div className="mf-empty"><strong>The local preview bundle could not be loaded.</strong><p>Refresh the page or check the local server.</p></div>}
        {!bundleState.loading && !filtered.length && <div className="mf-empty"><strong>No assets found</strong><p>Try another filename or clear the active filters.</p><button type="button" onClick={() => { setQuery(""); setCollection("all"); clearFilters(); }}>Clear search and filters</button></div>}
        {visible.length > 0 && <div className="mf-grid">{visible.map((asset) => {
          const id = asset.id || asset.title;
          const resultIndex = filtered.indexOf(asset);
          return <article className={"mf-card mf-card--" + section.id + (selected.has(id) ? " is-selected" : "")} key={id}>
            <button type="button" className="mf-card__select" aria-label={(selected.has(id) ? "Deselect " : "Select ") + asset.title} aria-pressed={selected.has(id)} onClick={() => toggleSelected(id)}><span>{selected.has(id) ? "✓" : ""}</span></button>
            <button type="button" className="mf-card__preview" aria-label={"Open details for " + asset.title} onClick={() => setDetailIndex(resultIndex)}><MFAssetVisual asset={asset} sectionId={section.id} /></button>
            <div className="mf-card__meta"><strong title={asset.title}>{asset.title}</strong><span>{String(asset.extension || fMediaType(asset.extension)).toUpperCase()}</span></div>
          </article>;
        })}</div>}
        {visible.length < filtered.length && <div className="mf-more"><button type="button" onClick={() => setLimit((value) => value + 64)}>Show 64 more</button><span>{visible.length.toLocaleString("en-GB")} of {filtered.length.toLocaleString("en-GB")}</span></div>}
      </section>
    </section>

    {selected.size > 0 && <div className="mf-bulk" role="region" aria-label="Selected assets">
      <div><strong>{selected.size} asset{selected.size === 1 ? "" : "s"} selected</strong><button type="button" onClick={() => setSelected(new Set())}>Clear selection</button></div>
      <button type="button" className="mf-bulk__download" onClick={downloadSelected} disabled={!selectedAssets.some((asset) => asset.downloadUrl || asset.previewUrl)}>Download previews</button>
    </div>}
    {detailAsset && <MFAssetDetail asset={detailAsset} sectionId={section.id} position={detailIndex} total={filtered.length} onClose={closeDetail} onPrevious={previousDetail} onNext={nextDetail} />}
  </main>;
}

function fTemplateAttachments(content) {
  return String(content || "").match(/[^\s]+\.(?:pptx|docx|zip|html|png|jpe?g|pdf)/gi) || [];
}

function FMediaTemplateBlock({ block, pageTitle, index }) {
  const type = block.type || "Text";
  const content = String(block.content || "").trim();
  if (type === "heading") return <h2 className="ml-template-heading">{block.title}</h2>;
  if (type === "Divider") return <hr className="hf-divider" />;
  if (/Attachments/i.test(type)) {
    const files = fTemplateAttachments(content);
    return <div className="ml-template-files">{files.map((file) => <div className="ml-template-file" key={file}><span>{file.split(".").pop().toUpperCase()}</span><strong>{file}</strong><small>Original file not included in this export</small></div>)}</div>;
  }
  if (block.assets?.length) return <section className={`hf-block hf-block--media${block.assets.length > 1 ? " is-gallery" : ""}`}><div className="hf-media-grid">{block.assets.map((src, assetIndex) => <FMedia key={`${src}-${assetIndex}`} url={src} alt={`${pageTitle} preview ${assetIndex + 1}`} kind={type} pageTitle={pageTitle} />)}</div>{content && <p className="hf-caption hf-caption--after">{content}</p>}</section>;
  if (type === "Callout") return <aside className="hf-callout"><FIcon name="caution-glyph" size={18} /><p>{content}</p></aside>;
  if (!content) return null;
  return <section className={`hf-block hf-block--copy${index === 0 ? " is-intro" : ""}`}><p className="hf-copy">{content}</p></section>;
}

function FMediaLibraryTemplates({ onNavigate }) {
  const pages = F_PAGES.filter((page) => page.portal === "media");
  const [activeTitle, setActiveTitle] = React.useState(pages[0]?.title || "PPT Master");
  const page = pages.find((item) => item.title === activeTitle) || pages[0];
  return <main className="ml-page ml-page--templates">
    <MFMediaLibraryNav active="templates" onNavigate={onNavigate} />
    <header className="wrap mf-library__head mf-library__head--templates"><div><span>Media Library</span><h1>Templates</h1><p>Ready-to-use templates for presentations, email signatures, stationery and social channels.</p></div><div className="mf-library__count"><strong>{pages.length}</strong><span>published template pages</span></div></header>
    <div className="wrap ml-template-layout">
      <aside className="ml-template-nav" aria-label="Template pages">{pages.map((item) => <button type="button" className={item.title === page?.title ? "is-active" : ""} aria-current={item.title === page?.title ? "page" : undefined} onClick={() => setActiveTitle(item.title)} key={item.title}>{item.title}</button>)}</aside>
      <article className="ml-template-document">
        <header><span className="ml-eyebrow">Templates</span><h2>{page?.title}</h2></header>
        {page?.blocks?.map((block, index) => <FMediaTemplateBlock block={block} pageTitle={page.title} index={index} key={`${page.title}-${index}`} />)}
        <aside className="ml-import-note"><FIcon name="caution-glyph" size={18} /><div><strong>Template source files need a new download home.</strong><p>The page content and previews are present. The archive did not include the downloadable Office files, so unavailable downloads are labelled instead of silently linking back to Frontify.</p></div></aside>
      </article>
    </div>
  </main>;
}

function FSectionDirectory({ section, items, onNavigate }) {
  const groups = [];
  let current = null;
  items.forEach((item) => {
    if (item.type === "group") { current = { label: item.label, items: [] }; groups.push(current); }
    else { if (!current) { current = { label: section, items: [] }; groups.push(current); } current.items.push(item); }
  });
  return <div className="hf-directory">{groups.map((group) => <section key={group.label}>
    <span>{group.label}</span>
    <div>{group.items.map((item) => <button key={item.key} type="button" onClick={() => onNavigate(section, item)}>{item.label}<FIcon name="arrow-right" size={15} /></button>)}</div>
  </section>)}</div>;
}

const F_LOOK_FEEL_ASSETS = "assets/look-feel/";

function FLookFeelVideo({ file, label, className = "", eager = false }) {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduceMotion = Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduceMotion) { video.pause(); return undefined; }
    const play = () => video.play().catch(() => undefined);
    if (!("IntersectionObserver" in window)) { play(); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) play(); else video.pause(); }, { rootMargin: "180px 0px", threshold: .08 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <figure className={`lf-visual lf-video-frame ${className}`}>
    <video ref={videoRef} muted loop playsInline preload={eager ? "auto" : "metadata"} src={`${F_LOOK_FEEL_ASSETS}${file}`} />
    <figcaption className="sr-only">{label}</figcaption>
  </figure>;
}

function FLookFeelImage({ file, alt, className = "" }) {
  return <figure className={`lf-visual ${className}`}>
    <img src={`${F_LOOK_FEEL_ASSETS}${file}`} alt={alt} loading="lazy" decoding="async" />
  </figure>;
}

function FLookFeelPage({ onNavigate }) {
  const guidelinesOverview = fHub("66", "Guidelines Overview");
  const customerJourneys = fExisting("guidelines", "Design Principles", "Design Principles");

  return <main className="lf-page">
    <section className="lf-hero" aria-label="ImmoScout24 — Einfach Zuhause">
      <FLookFeelVideo file="look-hero-foreground.mp4" label="Aerial city view with the ImmoScout24 promise: Einfach Zuhause" eager />
    </section>

    <section className="lf-intro">
      <div className="lf-copy lf-copy--display">
        <h1>A brand that feels<br />like home.</h1>
      </div>
      <div className="lf-copy lf-copy--body">
        <p>At ImmoScout24, we believe that a brand should feel as authentic and welcoming as the homes we help people find. Our visual identity is more than just design – it’s an invitation: to explore, to trust, and to feel at home.</p>
      </div>
      <div className="lf-wide-media lf-wide-media--intro">
        <FLookFeelImage file="look-intro-home.jpg" alt="ImmoScout24 outdoor campaign on a Berlin residential building" />
        <span aria-hidden="true">…</span>
      </div>
      <div className="lf-copy lf-copy--statement">
        <p>Every element, from colour to typography, is crafted to make our brand experience intuitive, inspiring, and unmistakably ImmoScout24.</p>
        <button className="lf-button" type="button" onClick={() => onNavigate("brand", guidelinesOverview)}>Explore our guidelines <FIcon name="arrow-right" size={17} /></button>
      </div>
    </section>

    <section className="lf-targets">
      <div className="lf-copy lf-copy--chapter"><h2>Our target groups</h2></div>
      <FLookFeelImage file="look-target-groups.png" alt="The three ImmoScout24 target groups: seekers, homeowners and agents" className="lf-targets__image" />
      <div className="lf-targets__action"><button className="lf-button" type="button" onClick={() => onNavigate("brand", customerJourneys)}>Explore our customer journeys <FIcon name="arrow-right" size={17} /></button></div>
    </section>

    <section className="lf-chapter lf-chapter--blue">
      <div className="lf-copy lf-copy--chapter">
        <h2>Authentic &amp;<br />approachable</h2>
        <p>Our brand is built on real-life moments. We avoid artificial perfection and instead embrace a look and feel that reflects the genuine, warm, and diverse world of home seekers, homeowners, and real estate professionals. Our imagery captures real spaces, real people, and real stories – never staged, always relatable.</p>
      </div>
      <div className="lf-media-grid lf-media-grid--four-eight">
        <FLookFeelImage file="look-authentic-space.jpg" alt="A person playfully leaning over the banister in an authentic home" />
        <FLookFeelImage file="look-authentic-device.gif" alt="ImmoScout24 brand experience shown in motion" />
      </div>
      <div className="lf-media-grid lf-media-grid--halves">
        <FLookFeelImage file="look-authentic-collage.png" alt="An authentic conversation between an agent and customer" />
        <FLookFeelImage file="look-authentic-motion.gif" alt="Authentic ImmoScout24 imagery in motion" />
      </div>
    </section>

    <section className="lf-chapter lf-chapter--yellow">
      <div className="lf-copy lf-copy--chapter">
        <h2>Clear &amp; intuitive</h2>
        <p>Navigating a home search should be effortless. The same applies to our brand. We use a clear, structured design language that prioritizes ease of use and immediate recognition. Our typography is modern yet timeless, our color palette is warm yet professional, and our layouts create a sense of openness and clarity.</p>
      </div>
      <div className="lf-media-grid lf-media-grid--halves lf-media-grid--portrait">
        <FLookFeelImage file="look-clear-left.png" alt="A clear map interface using ImmoScout24 teal" />
        <FLookFeelImage file="look-clear-right.png" alt="A clear ImmoScout24 property experience on a phone" />
      </div>
    </section>

    <section className="lf-chapter lf-chapter--orange">
      <div className="lf-copy lf-copy--chapter">
        <h2>Confident<br />&amp; distinctive</h2>
        <p>We stand for expertise, trust, and innovation in real estate. Our brand identity reflects this confidence – not through excess, but through precision. Every design element has a purpose. Every choice, from spacing to contrast, is made to enhance clarity and engagement. Our brand is bold yet inviting, strong yet flexible – just like the ecosystem we’ve built around the concept of home.</p>
      </div>
      <FLookFeelVideo file="look-confident-motion.mp4" label="A confident ImmoScout24 mobile notification experience" className="lf-chapter__video" />
      <div className="lf-media-grid lf-media-grid--halves">
        <FLookFeelImage file="look-confident-campaign.gif" alt="Distinctive ImmoScout24 campaign motion" />
        <FLookFeelImage file="look-confident-ui.png" alt="A precise, purposeful ImmoScout24 interface composition" className="lf-visual--contain" />
      </div>
    </section>

    <section className="lf-chapter lf-chapter--purple">
      <div className="lf-copy lf-copy--chapter">
        <h2>A seamless experience across every touchpoint</h2>
        <p>Whether online or offline, in an app or on a billboard, our brand remains unmistakable. We’ve refined our design to create a seamless, user-centered experience, ensuring that no matter where someone encounters ImmoScout24, they feel the same clarity, trust, and connection.</p>
      </div>
      <FLookFeelImage file="look-touchpoints.png" alt="ImmoScout24 across merchandise, outdoor media and real-world touchpoints" className="lf-touchpoints" />
      <div className="lf-video-stack">
        <FLookFeelVideo file="look-touchpoint-one.mp4" label="ImmoScout24 AI assistant experience on a tablet" />
        <FLookFeelVideo file="look-touchpoint-three.mp4" label="ImmoScout24 campaign experience in the home" />
      </div>
    </section>
  </main>;
}

const F_BRAND_HOME_ASSETS = "assets/brand-overview/";

function FBrandHomeVideo({ file, label }) {
  const videoRef = React.useRef(null);
  const userControlledRef = React.useRef(false);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduceMotion = Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduceMotion) { video.pause(); return undefined; }
    const play = () => { if (!userControlledRef.current) video.play().catch(() => undefined); };
    if (!("IntersectionObserver" in window)) { play(); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) play(); else video.pause(); }, { rootMargin: "160px 0px", threshold: .12 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <figure className="bh-video">
    <video ref={videoRef} muted loop controls playsInline preload="metadata" aria-label={label} onPointerDown={() => { userControlledRef.current = true; }} onKeyDown={() => { userControlledRef.current = true; }} src={`${F_BRAND_HOME_ASSETS}${file}`} />
    <figcaption className="sr-only">{label}</figcaption>
  </figure>;
}

function FBrandHomeTopic({ file, stillFile, label, onClick }) {
  return <button className="bh-topic" type="button" onClick={onClick}>
    <span className="bh-topic__visual">
      {stillFile && <img className="bh-topic__still" src={`${F_BRAND_HOME_ASSETS}${stillFile}`} alt="" loading="lazy" decoding="async" />}
      <img className={stillFile ? "bh-topic__motion" : ""} src={`${F_BRAND_HOME_ASSETS}${file}`} alt="" loading="lazy" decoding="async" />
    </span>
    <span>{label}</span>
  </button>;
}

function FBrandHomePortal({ file, title, onClick }) {
  return <button className="bh-portal" type="button" onClick={onClick}>
    <img src={`${F_BRAND_HOME_ASSETS}${file}`} alt="" loading="lazy" decoding="async" />
    <span className="bh-portal__title">{title}</span>
  </button>;
}

function FBrandOverview({ onNavigate }) {
  const lookAndFeel = fExisting("look", "Typo und Farben", "Look & Feel");
  const strategyOverview = fHub("68", "Overview");
  const guidelinesOverview = fHub("66", "Guidelines Overview");
  const logo = fExisting("guidelines", "Logo");
  const colour = fExisting("guidelines", "Colour", "Colours");
  const digital = fExisting("guidelines", "Digital");
  const contact = fExisting("home", "Contact us", "Contact");

  return <main className="bh-page">
    <section className="bh-hero" aria-label="Welcome home">
      <img src={`${F_BRAND_HOME_ASSETS}brand-home-hero.jpg`} alt="A child and parent arriving home" decoding="sync" />
      <p>Welcome home.</p>
    </section>

    <section className="bh-intro">
      <h1>The home of our brand.</h1>
      <p>A home is more than just four walls – it’s a journey. Whether buying, selling, renting, or owning, ImmoScout24 is the trusted partner that guides people through every step on their way to finding home. And just as we make this experience seamless and intuitive for our users, this platform provides everything you need to activate and express our brand.</p>
    </section>

    <section className="bh-popular" aria-labelledby="brand-popular-title">
      <h2 id="brand-popular-title">Popular topics</h2>
      <div className="bh-popular__grid">
        <FBrandHomeTopic file="brand-home-media-library.png" label="Media Library" onClick={() => onNavigate("assets")} />
        <FBrandHomeTopic file="brand-home-logo.gif" stillFile="brand-home-logo-static.png" label="Our Logo" onClick={() => onNavigate("brand", logo)} />
        <FBrandHomeTopic file="brand-home-colours.png" label="Colours" onClick={() => onNavigate("brand", colour)} />
        <FBrandHomeTopic file="brand-home-digital.png" label="Digital" onClick={() => onNavigate("brand", digital)} />
      </div>
    </section>

    <section className="bh-showreel" aria-label="ImmoScout24 brand film">
      <FBrandHomeVideo file="brand-home-showreel.mp4" label="The ImmoScout24 brand film" />
    </section>

    <nav className="bh-portals" aria-label="Brand portal sections">
      <div>
        <FBrandHomePortal file="brand-home-strategy.jpg" title="Brand Strategy" onClick={() => onNavigate("brand", strategyOverview)} />
        <FBrandHomePortal file="brand-home-guidelines.png" title="Guidelines" onClick={() => onNavigate("brand", guidelinesOverview)} />
      </div>
    </nav>

    <section className="bh-inspiration-media" aria-label="ImmoScout24 brand inspiration">
      <div>
        <figure><img src={`${F_BRAND_HOME_ASSETS}brand-home-inspiration.png`} alt="People using ImmoScout24 outside a home" loading="lazy" decoding="async" /></figure>
        <FBrandHomeVideo file="brand-home-inspiration-motion.mp4" label="An ImmoScout24 home story" />
      </div>
    </section>

    <section className="bh-inspiration-copy">
      <h2>Need some inspiration?</h2>
      <p>Learn more about the <button type="button" onClick={() => onNavigate("brand", lookAndFeel)}>Look &amp; Feel of our brand</button>.</p>
    </section>

    <figure className="bh-inspiration-wide">
      <img src={`${F_BRAND_HOME_ASSETS}brand-home-inspiration-wide.png`} alt="ImmoScout24 across digital and outdoor brand touchpoints" loading="lazy" decoding="async" />
    </figure>

    <section className="bh-support">
      <h2>Your CI support</h2>
      <p>May we help you?</p>
      <button type="button" onClick={() => onNavigate("community", contact)}>Contact us</button>
    </section>
  </main>;
}

const F_STRATEGY_COVER_CARDS = [
  { title: "Claim", image: "https://media.ffycdn.net/eu/scout24/5enj2ProZUiPheFds5WP.jpg?width=1200&rect=34.305317324185,0,731.38936535163,533&reference_width=800", target: "Claim" },
  { title: "Message Framework", image: "https://media.ffycdn.net/eu/scout24/AhWb8CfE9HuLBZJr8Weo.jpg?width=1200&rect=34.5,0,731,533&reference_width=800", target: "Message Framework" },
  { title: "Brand Family", image: "https://media.ffycdn.net/eu/scout24/cMJDMKrHY6vSeiK5bLj9.jpg?width=1200", target: "Brand Family" },
];

function FBrandStrategyOverview({ onNavigate }) {
  const contact = fExisting("home", "Contact us", "Contact us");
  return <main className="bs-page">
    <section className="bs-video" aria-label="Brand Strategy film">
      <video autoPlay={!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)} loop muted playsInline preload="auto" aria-label="Brand Strategy film" src="https://media.ffycdn.net/eu/scout24/HLQ1oEg3qdgMvmNX8tHB.mp4?format=mp4" />
    </section>
    <section className="bs-hero">
      <div className="bs-wrap">
        <h1>Brand Strategy</h1>
        <p>ImmoScout24 is the all-in-one platform that simplifies the real estate journey for all. We centralize services for seekers, owners, and agents, making the process simple and convenient.</p>
      </div>
    </section>
    <section className="bs-directory" aria-labelledby="bs-directory-heading">
      <div className="bs-wrap">
        <h2 id="bs-directory-heading">Discover the key elements of our brand strategy and learn how to represent ImmoScout24 consistently across all channels.</h2>
        <div className="bs-directory__grid">{F_STRATEGY_COVER_CARDS.map((card) => <button type="button" key={card.title} onClick={() => onNavigate("brand", fExisting("strategy", card.target))}>
          <span className="bs-directory__image"><img src={card.image} alt="" loading="lazy" decoding="async" /></span>
          <span className="bs-directory__title">{card.title}</span>
        </button>)}</div>
      </div>
    </section>
    <section className="bs-contact">
      <div className="bs-wrap">
        <h2>Any questions?</h2>
        <p>For any questions about the ImmoScout24 brand strategy, feel free to contact us.</p>
        <button type="button" onClick={() => onNavigate("community", contact)}>Contact us</button>
      </div>
    </section>
  </main>;
}

const F_GUIDELINES_HOME_ASSETS = "assets/guidelines-overview/";

function FGuidelinesHomeVideo({ file, posterFile, label, className = "", eager = false }) {
  const videoRef = React.useRef(null);
  const userControlledRef = React.useRef(false);
  const inViewRef = React.useRef(false);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const syncPlayback = () => {
      if (motionQuery?.matches || !inViewRef.current) video.pause();
      else if (!userControlledRef.current) video.play().catch(() => undefined);
    };
    let observer = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        inViewRef.current = entry.isIntersecting;
        syncPlayback();
      }, { rootMargin: "160px 0px", threshold: .12 });
      observer.observe(video);
    } else {
      inViewRef.current = true;
      syncPlayback();
    }
    motionQuery?.addEventListener?.("change", syncPlayback);
    return () => {
      observer?.disconnect();
      motionQuery?.removeEventListener?.("change", syncPlayback);
    };
  }, []);
  return <figure className={`gh-media gh-media--video ${className}`}>
    <video
      ref={videoRef}
      muted
      loop
      controls
      controlsList="nodownload"
      playsInline
      preload={eager ? "auto" : "metadata"}
      poster={posterFile ? `${F_GUIDELINES_HOME_ASSETS}${posterFile}` : undefined}
      aria-label={label}
      onPointerDown={() => { userControlledRef.current = true; }}
      onKeyDown={() => { userControlledRef.current = true; }}
      src={`${F_GUIDELINES_HOME_ASSETS}${file}`}
    />
    <figcaption className="sr-only">{label}</figcaption>
  </figure>;
}

function FGuidelinesHomeImage({ file, stillFile, alt, className = "" }) {
  return <figure className={`gh-media ${className}`}>
    {stillFile && <img className="gh-media__still" src={`${F_GUIDELINES_HOME_ASSETS}${stillFile}`} alt={alt} loading="lazy" decoding="async" />}
    <img className={stillFile ? "gh-media__motion" : ""} src={`${F_GUIDELINES_HOME_ASSETS}${file}`} alt={alt} loading="lazy" decoding="async" />
  </figure>;
}

function FGuidelinesAction({ onClick, subject, light = false }) {
  return <button className={`gh-action${light ? " gh-action--light" : ""}`} type="button" aria-label={`Learn more about ${subject}`} onClick={onClick}>
    Learn more
  </button>;
}

function FGuidelinesChapter({ heading, copy, target, onNavigate, media, mediaFirst = false, theme = "white", variant = "default" }) {
  const headingId = `guidelines-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const mediaNode = media.kind === "video"
    ? <FGuidelinesHomeVideo file={media.file} posterFile={media.posterFile} label={media.alt} />
    : <FGuidelinesHomeImage file={media.file} stillFile={media.stillFile} alt={media.alt} />;
  const copyNode = <div className="gh-chapter__copy">
    <h2 id={headingId}>{heading}</h2>
    <p>{copy}</p>
    <FGuidelinesAction subject={heading} light={theme === "charcoal"} onClick={() => onNavigate("brand", target)} />
  </div>;
  return <section className={`gh-chapter gh-chapter--${theme} gh-chapter--${variant}${mediaFirst ? " gh-chapter--media-first" : ""}`} aria-labelledby={headingId}>
    <div className="gh-chapter__inner">
      {mediaFirst ? mediaNode : copyNode}
      {mediaFirst ? copyNode : mediaNode}
    </div>
  </section>;
}

function FGuidelinesOverview({ onNavigate }) {
  const designPrinciples = fExisting("guidelines", "Design Principles");
  const logo = fExisting("guidelines", "Logo");
  const colour = fExisting("guidelines", "Colour", "Colours");
  const typography = fExisting("guidelines", "Typography");
  const icons = fExisting("guidelines", "Icons", "Graphics & Icons");
  const photography = fExisting("guidelines", "Photography");
  const video = fExisting("guidelines", "Video");
  const sound = fExisting("guidelines", "Sound");
  const digital = fExisting("guidelines", "Digital");
  const toneOfVoice = fExisting("guidelines", "Tone of Voice (DE)", "Tone of Voice");

  return <main className="gh-page">
    <h1 className="sr-only">Guidelines</h1>
    <section className="gh-hero" aria-label="ImmoScout24 Guidelines">
      <FGuidelinesHomeVideo file="guidelines-hero.mp4" posterFile="guidelines-hero-poster.png" label="ImmoScout24 Guidelines introduction" className="gh-hero__video" eager />
    </section>

    <section className="gh-principles" aria-labelledby="guidelines-design-principles">
      <div>
        <h2 id="guidelines-design-principles">Design Principles</h2>
        <p>How to combine our brand elements into flexible layouts – adaptable across content types and touchpoints.</p>
        <FGuidelinesAction subject="Design Principles" onClick={() => onNavigate("brand", designPrinciples)} />
      </div>
    </section>

    <FGuidelinesChapter
      heading="Our Logo"
      copy="Discover all our logo variations and get inspired by how to use them across formats, channels, and media."
      target={logo}
      onNavigate={onNavigate}
      media={{ file: "guidelines-logo.gif", stillFile: "guidelines-logo-static.png", alt: "The ImmoScout24 logo in motion" }}
    />
    <FGuidelinesChapter
      heading="Colours"
      copy="Our distinctive and accessible colour palette – built for recognition and flexibility across a wide range of use cases."
      target={colour}
      onNavigate={onNavigate}
      mediaFirst
      theme="soft"
      media={{ file: "guidelines-colours.png", alt: "The ImmoScout24 colour palette" }}
    />
    <FGuidelinesChapter
      heading="Typography"
      copy="Explore our exclusive typefaces and discover how to use them for maximum impact and legibility."
      target={typography}
      onNavigate={onNavigate}
      theme="charcoal"
      variant="portrait"
      media={{ file: "guidelines-typography.gif", stillFile: "guidelines-typography-static.png", alt: "Make It Better typography styles in motion" }}
    />
    <FGuidelinesChapter
      heading="Graphics & Icons"
      copy="From functional to emotional, from simple to detailed – our graphics and icons scale effortlessly across all contexts."
      target={icons}
      onNavigate={onNavigate}
      mediaFirst
      media={{ file: "guidelines-graphics.gif", stillFile: "guidelines-graphics-static.png", alt: "An ImmoScout24 home illustration in motion" }}
    />

    <section className="gh-photography" aria-labelledby="guidelines-photography">
      <img src={`${F_GUIDELINES_HOME_ASSETS}guidelines-photography.jpg`} alt="A home seeker holding keys and a phone outside an apartment building" loading="lazy" decoding="async" />
      <div className="gh-photography__copy">
        <h2 id="guidelines-photography">Photography</h2>
        <p>From real spaces to real faces, our photography captures genuine moments from the perspective of seekers, owners, and professionals.</p>
        <FGuidelinesAction subject="Photography" light onClick={() => onNavigate("brand", photography)} />
      </div>
    </section>

    <FGuidelinesChapter
      heading="Video"
      copy="From product demos to campaigns, our videos tell stories that connect – designed to engage audiences across channels and use cases."
      target={video}
      onNavigate={onNavigate}
      mediaFirst
      variant="square"
      media={{ kind: "video", file: "guidelines-video.mp4", posterFile: "guidelines-video-poster.png", alt: "ImmoScout24 video guidance in motion" }}
    />
    <FGuidelinesChapter
      heading="Sound"
      copy="From our sonic logo to music and voice, our sound creates connection and fosters a deeper emotional engagement with our brand."
      target={sound}
      onNavigate={onNavigate}
      theme="purple"
      variant="square"
      media={{ file: "guidelines-sound.png", alt: "An ImmoScout24 sound wave" }}
    />
    <FGuidelinesChapter
      heading="Digital"
      copy="Our brand lives online – with UX and UI at its core, delivering seamless experiences across website, app, email, and marketing channels."
      target={digital}
      onNavigate={onNavigate}
      mediaFirst
      media={{ file: "guidelines-digital.jpg", alt: "The ImmoScout24 app on a phone" }}
    />
    <FGuidelinesChapter
      heading="Tone of Voice"
      copy="Clear guidelines to make every message sound like ImmoScout24, simple, consistent, and tailored to channels and target groups."
      target={toneOfVoice}
      onNavigate={onNavigate}
      theme="sand"
      media={{ file: "guidelines-tone-of-voice.png", alt: "The ImmoScout24 voice principles: confident, personable, optimistic and authentic" }}
    />
  </main>;
}

const F_GUIDELINE_PAGE_ORDER = ["Design Principles", "Logo", "Colour", "Typography", "Icons", "Illustrations", "Data Visualisation", "Highlighter", "Photography", "Video", "Sound", "Digital", "Tone of Voice (DE)", "Tone of Voice (EN)"];
const F_LOCAL_STRATEGY_PAGES = new Set(["Claim", "Message Framework", "Brand Family"]);

function FStrategyMedia({ block, pageTitle, kind = "Image", alt }) {
  const assets = block?.assets || [];
  if (!assets.length) return null;
  return <div className="hf-strategy-media">{assets.map((src, index) => <FMedia key={`${src}-${index}`} url={src} kind={kind} pageTitle={pageTitle} alt={alt} />)}</div>;
}

function FStrategyPrinciple({ title, content }) {
  const body = String(content || "").replace(title, "").trim();
  return <article className="hf-strategy-principle"><h3>{title}</h3><p>{body}</p></article>;
}

function FStrategyDocument({ page, onNavigate }) {
  const blocks = page.blocks || [];
  const clean = (value) => String(value || "").replace(/simplifie s/g, "simplifies").replace(/\s+([,.])/g, "$1").replace(/\s{2,}/g, " ").trim();
  const modified = page.modifiedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(page.modifiedAt)) : null;
  let content = null;

  if (page.title === "Claim") content = <React.Fragment>
    <section className="hf-strategy-section hf-strategy-section--lead"><p>{clean(blocks[1]?.content)}</p></section>
    <section className="hf-strategy-section hf-strategy-section--media"><FStrategyMedia block={blocks[3]} pageTitle={page.title} alt="Einfach Zuhause campaign platform" /></section>
    <section className="hf-strategy-section hf-strategy-section--copy">
      <h2>{blocks[5]?.title}</h2>
      <div className="hf-strategy-principles">
        <FStrategyPrinciple title="Strength: we make it simple" content={clean(blocks[7]?.content)} />
        <FStrategyPrinciple title="How: by being the interconnecting matchmaker" content={clean(blocks[8]?.content)} />
      </div>
    </section>
    <section className="hf-strategy-section hf-strategy-section--media"><FStrategyMedia block={blocks[10]} pageTitle={page.title} kind="Video" alt="Einfach Zuhause campaign film" /></section>
    <section className="hf-strategy-section hf-strategy-section--copy">
      <h2>{blocks[12]?.title}</h2>
      <p>{clean(blocks[14]?.content)}</p>
    </section>
    <section className="hf-strategy-section hf-strategy-section--media"><FStrategyMedia block={blocks[15]} pageTitle={page.title} kind="Video" alt="ImmoScout24 brand campaign" /></section>
  </React.Fragment>;

  if (page.title === "Message Framework") content = <React.Fragment>
    <section className="hf-strategy-section hf-strategy-section--lead"><p>{clean(blocks[1]?.content)}</p></section>
    <section className="hf-strategy-section hf-strategy-section--media hf-strategy-section--diagram"><FStrategyMedia block={blocks[3]} pageTitle={page.title} alt="ImmoScout24 message framework" /></section>
  </React.Fragment>;

  if (page.title === "Brand Family") content = <React.Fragment>
    <section className="hf-strategy-section hf-strategy-section--lead"><p>{clean(blocks[1]?.content)}</p></section>
    <section className="hf-strategy-section hf-strategy-section--copy"><h2>{blocks[3]?.title}</h2></section>
    <section className="hf-strategy-section hf-strategy-section--media hf-strategy-section--diagram"><FStrategyMedia block={blocks[5]} pageTitle={page.title} alt="ImmoScout24 brand family" /></section>
    <section className="hf-strategy-section hf-strategy-section--copy hf-strategy-section--downloads">
      <h2>{blocks[7]?.title}</h2>
      <p>{clean(blocks[9]?.content)}</p>
      <button type="button" onClick={() => onNavigate("assets")}>Media Library <FIcon name="arrow-right" size={17} /></button>
    </section>
  </React.Fragment>;

  return <div className="hf-strategy-document">{content}{modified && <p className="hf-strategy-modified">Last modified on {modified}</p>}</div>;
}

function FGuidelineSideNavigation({ page, pageKey, onNavigate }) {
  const headings = (page.blocks || []).filter((block) => block.type === "heading");
  return <aside className="hf-side hf-side--source" aria-label="Guidelines pages">
    <div className="hf-side__links">
      {F_GUIDELINE_PAGE_ORDER.map((title) => {
        const target = fExisting("guidelines", title, title);
        const active = title === page.title;
        return <React.Fragment key={title}>
          <button type="button" className={active ? "is-active" : ""} onClick={() => onNavigate("brand", target)}>{title}</button>
          {active && headings.length > 0 && <div className="hf-side__anchors">{headings.map((heading) => <button type="button" key={heading.title} onClick={() => document.getElementById(fGuidelineHeadingId(page.title, heading.title))?.scrollIntoView({ behavior: "smooth", block: "start" })}>{heading.title}</button>)}</div>}
        </React.Fragment>;
      })}
    </div>
  </aside>;
}

function HubFrontifyPage({ section, pageKey, title, onNavigate }) {
  const nav = buildHubNavigation();
  const sectionItems = nav[section] || [];
  const { page, library, special, mediaLibraryKey } = fResolve(pageKey);
  if (special === "brand-home") return <FBrandOverview onNavigate={onNavigate} />;
  if (special === "guidelines-home") return <FGuidelinesOverview onNavigate={onNavigate} />;
  if (special === "strategy-home") return <FBrandStrategyOverview onNavigate={onNavigate} />;
  if (special === "look-feel") return <FLookFeelPage onNavigate={onNavigate} />;
  if (special === "media-library-home") return <MFMediaLibraryOverview onNavigate={onNavigate} />;
  if (special === "media-library-section" && mediaLibraryKey === "icons") return <MFIconLibrary onNavigate={onNavigate} />;
  if (special === "media-library-section") return <MFMediaLibrarySection sectionId={mediaLibraryKey} library={library} onNavigate={onNavigate} />;
  if (special === "media-library-templates") return <FMediaLibraryTemplates onNavigate={onNavigate} />;
  const hasSource = Boolean(page || library);
  const isLocalGuideline = Boolean(page?.portal === "guidelines" && F_LOCAL_GUIDELINE_PAGES.has(page.title));
  const isLocalStrategy = Boolean(page?.portal === "strategy" && F_LOCAL_STRATEGY_PAGES.has(page.title));
  const isSourceDocument = isLocalGuideline || isLocalStrategy;
  const showContentNavigation = section !== "brand";
  const resolvedTitle = title || page?.title || library?.title || section;
  const displayTitle = isLocalGuideline && page.title.startsWith("Tone of Voice (") ? "Tone of Voice" : resolvedTitle;
  const updated = page?.modifiedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(page.modifiedAt)) : null;

  return <FNavigateContext.Provider value={onNavigate}><main className={`hf-page${isLocalGuideline ? " hf-page--guideline-document" : ""}${isLocalStrategy ? " hf-page--strategy-document" : ""}${showContentNavigation ? "" : " hf-page--no-side"}`}>
    <div className="wrap hf-page__layout">
      {showContentNavigation && (isLocalGuideline ? <FGuidelineSideNavigation page={page} pageKey={pageKey} onNavigate={onNavigate} /> : <aside className="hf-side" aria-label={`${section} pages`}>
        <button type="button" className="hf-side__home" onClick={() => onNavigate(section)}><FIcon name="arrow-left" size={14} /> {section}</button>
        <div className="hf-side__links">{sectionItems.map((item, index) => item.type === "group" ? <span key={`${item.label}-${index}`}>{item.label}</span> : <button type="button" key={item.key} className={item.key === pageKey ? "is-active" : ""} onClick={() => onNavigate(section, item)}>{item.label}</button>)}</div>
      </aside>)}
      <article className="hf-content">
        <header className="hf-content__head">
          {!isSourceDocument && <span className="hf-kicker">{hasSource ? "Hub resource" : "Hub structure"}</span>}
          <h1>{pageKey ? displayTitle : section}</h1>
          {!isSourceDocument && pageKey && hasSource && updated && <div className="hf-meta"><span>Updated {updated}</span></div>}
        </header>

        {!pageKey && <React.Fragment><p className="hf-lead">Choose a page to explore the imported brand guidance and source assets.</p><FSectionDirectory section={section} items={sectionItems} onNavigate={onNavigate} /></React.Fragment>}
        {page && (isLocalStrategy ? <FStrategyDocument page={page} onNavigate={onNavigate} /> : <FGuidelineDocument page={page} />)}
        {library && <FLibraryPage library={library} />}
        {pageKey && !hasSource && <div className="hf-placeholder"><span aria-hidden="true">✦</span><h2>This page is intentionally empty.</h2><p>Its place in the new Hub navigation is ready for content when the source becomes available.</p></div>}
      </article>
    </div>
  </main></FNavigateContext.Provider>;
}

window.HUB_FRONTIFY = {
  buildHubNavigation,
  resolve: fResolve,
  downloadIcon: mfDownloadIcon,
  iconVariant: mfIconVariant,
};
window.HubFrontifyPage = HubFrontifyPage;
