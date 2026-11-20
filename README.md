# SSI App --- Solar System Info APP

> **Live-Demo (GitHub Pages):** **[https://j-moessmer.github.io/BITLC-Angular-Solarsystem-Finalproject/](https://j-moessmer.github.io/BITLC-Angular-Solarsystem-Finalproject/)**

Interaktive, kindgerechte Single-Page-Application (SPA) mit **Angular 22** zur spielerischen Erkundung unseres Sonnensystems, der 7 astronomischen Bahnelemente, maßstabsgetreuer Größenvergleiche, großer Raumfahrtmissionen und eines Weltraum-Quiz.

Entwickelt als Abschlussprojekt im **Modul Angular** (`BITLC NE5 FIAE WS26` – Fachinformatiker für Anwendungsentwicklung) bei der **BITLC GmbH Dortmund** (Dozent: Antonius Ehlen) nach dem **FCPP-Verfahren (Fast Compact Project Plan v1.5)**.

---

## Inhaltsverzeichnis

1. [Projekt-Überblick & FCPP-Architektur](#1-projekt-überblick--fcpp-architektur)
2. [Funktionsumfang nach Modulen (`P10` bis `P50`)](#2-funktionsumfang-nach-modulen-p10-bis-p50)
3. [Technischer Stack & Besonderheiten](#3-technischer-stack--besonderheiten)
4. [Installation, Entwicklung, Tests & GitHub Pages Deployment](#4-installation-entwicklung-tests--github-pages-deployment)
5. [KI-Transparenz & Kennzeichnung](#5-ki-transparenz--kennzeichnung)

---

## 1. Projekt-Überblick & FCPP-Architektur

```mermaid
flowchart TD
    App["App Shell + TopNavComponent (P10-U10)"]
    Home["LandingPageComponent (Startseite & 5-Schritt-Tutorial)"]
    P10["P10: SolarSystemViewComponent (2D-SVG-Karte, Suche, Kometenschweif, Zeitraffer)"]
    P20["P20: InfoboxDetailComponent (Steckbrief, Fotos, Reisezeiten, 7 Bahnelemente, Quellen)"]
    P30["P30: SizeComparisonComponent (SVG-Vergleich, Bälle/Berge/Riesensterne)"]
    P40["P40: ResearchMissionsComponent (50 Missionen, Suche, Zeitstrahl & ISS-Weltkarte)"]
    P50["P50: SpaceQuizComponent (4 Kategorien, Bestwerte, Entdecker-Pass & Sofort-Steckbrief)"]

    App -->|"Logo: SSI App (/)"| Home
    App --> P10
    App --> P30
    App --> P40
    App --> P50
    Home --> P10
    Home --> P30
    Home --> P40
    Home --> P50
    P10 --> P20
    P40 -->|"Im Sonnensystem zeigen"| P20
    P50 -->|"Lösung prüfen (Steckbrief)"| P20
```

---

## 2. Funktionsumfang nach Modulen (`P10` bis `P50`)

- **Startseite & Entdecker-Tutorial (`LandingPageComponent`, Route `/`)**
  - Aufruf über den Brand-Link **„SSI App“** oben links oder beim Start der App.
  - Kindgerechte Hero-Begrüßung, **interaktives 5-Schritt-Entdecker-Tutorial** mit Direktlinks in alle Bereiche, Schnellstart-Karten und Projekt-/Quellen-Fußzeile.
- **`P10` – Interaktives Sonnensystem & Pfad-Navigation (`P10-U10` bis `P10-U40`)**
  - Fixierte Hauptnavigation (`TopNavComponent`) mit **Tag-/Nachtmodus-Umschalter** (`ThemeService` ohne `#000000`) und Hash-Routing (`withHashLocation()`).
  - Rekursive Pfad-Seitenleiste (`PathSidebarComponent`) mit **Schnellsuche** (*„Planet, Mond, Komet oder Sonde suchen…“*), **lokalem Entdecker-Pass** (`X / 118 entdeckt` inkl. Fortschrittsbalken über `ExplorerProgressService`) und Breadcrumb-Leiste (`BreadcrumbBarComponent`) für **118 Einträge** (Sonne, 8 Planeten, 19 Monde, 5 Zwergplaneten, 4 Kometen inkl. *NEOWISE (C/2020 F3)*, 2 Gürtel, 39 Raumsonden/Rover/Satelliten inkl. *Vanguard 1* und **40 Lagrange-Punkte `L1`–`L5` für alle 8 Planeten**).
  - Interaktive **2D-SVG-Bühne** mit **stufenlosem logarithmischem Zoom (`0 %`–`100 %`, `0.08x`–`36.000x`**, Mausrad-cursorzentriert & Vollbildmodus), analytischem SVG-Orbit-Clipping, Echtzeit-Kepler-Positionen (`J2000`, inkl. retrograder Bahnen für *1P/Halley*, *NEOWISE* und *Triton*), **dynamischen Anti-Solar-Kometenschweifen** (Staub- & Ionenschweif für alle 4 Kometen, im Perihel verstärkt), Datums-Zeitreise (`1950`–`2100`, inkl. *17.03.1958 Vanguard 1* & *03.07.2020 Komet NEOWISE*), historischem Sonden-Filter und **adaptiver, aliasing-freier 30-FPS-Zeitraffer-Steuerung** für alle Mondsysteme.
  - Umschalter zwischen **Übersicht**, **Echtem Maßstab (AE & Ellipsen)** und **Seitenansicht (`INC`)** sowie **3-Stufen-Lagrange-Filter** (*Fokus (Planet) / Alle (40) / Aus*) mit kalibriertem `L1`/`L2`-Abstand außerhalb der Mondbahnen.
- **`P20` – Infobox / Detailansicht (`P20-U10` bis `P20-U40`)**
  - Verifizierte Wikimedia-/NASA-Fotos mit Foto-Galerie, **Originalgröße-Lightbox (`ImageLightboxComponent`)** und automatischem lokalem Fallback auf **11 Kategorie-SVGs (`assets/images/*.svg`)**.
  - Kindgerechte Steckbriefe, berechnete Bahngeschwindigkeit (`km/h` & `km/s`), **kindgerechter Reisezeit-Vergleich** (*„Wie lange bräuchtest du von der Erde bis hierher?“* für Auto `100 km/h`, Flugzeug `900 km/h`, Raumsonde `60.000 km/h` und Lichtstrahl `300.000 km/s`), anklickbare Mond-/Sonden-/Lagrange-Chips, **Fachbegriff-Tooltips (`GlossaryTermComponent`)**, responsive **7-Bahnelemente-Box (`SMA`, `ECC`, `INC`, `LAN`, `LPE`, `MNA`, `REF` + `AOP`-Anzeige)** sowie **Wikipedia- und offizielle NASA-/ESA-Quellenlinks (`wikipediaUrl`, `officialUrl`)** für alle 118 Einträge.
- **`P30` – Maßstabs- & Größenvergleich (`P30-U10`, `P30-U20`)**
  - Vergleich von 2 bis 5 Objekten über **gruppierte Dropdowns** und Schnellwahl-Presets.
  - Zusätzlich zu allen Körpern des Sonnensystems stehen **Vanguard 1 (16,5 cm)** sowie **19 Vergleichsobjekte** (`extra-comparison-bodies.data.ts`) bereit – von Alltagsmaßen (**Fußball 22 cm**, **Basketball 24 cm**, **1-Meter-Kugel**), maßstabsgetreuen **SVG-Silhouetten** (**Mount Everest 9 km Höhe**, **Deutschland 876 km Nord–Süd**), Exoplaneten (*TRAPPIST-1 e*, *55 Cancri e*, *HD 189733 b*) bis zu Neutronenstern, *Sagittarius A\** und Riesensternen (*Beteigeuze*, *Stephenson 2-18*).
  - Sub-Meter-Tiefenzoom mit Horizont-Staffelung, automatische `cm`/`m`/`km`-Einheitenformatierung (`formatDiameter`, `formatBodyDimension`), Durchmesser- ($D_1 / D_2$) und Volumenverhältnis ($(D_1 / D_2)^3$) sowie Kurzinfos mit Wikipedia-Quellen.
- **`P40` – Forschungsprojekte & Raumfahrt (`P40-U10`, `P40-U20`)**
  - Filterbare Kartenübersicht (*Alle Projekte, Sonden, Rover, Teleskope, Raumstationen, Mondflüge, Bemannte Missionen*) mit **Textsuche** (*Name, Ziel, Agentur, Startjahr*), **Umschalter „Nach Kategorie“ ↔ „Zeitstrahl (1957 → heute)“** und Detailsteckbriefen (inkl. **mindestens 5 verifizierter Fotos pro Objekt/Mission**) zu **50 internationalen Missionen** (NASA/US Navy inkl. *Vanguard 1 (1958)*, *Gemini 4/8* & *Apollo 7–17*, ESA inkl. *Spacelab/Columbus*, *ATV*, *Mars Express* & *Giotto*, Sowjetunion/Roskosmos, CNSA inkl. *Shenzhou 5* & *Tiangong*, JAXA inkl. *Kibō/Akatsuki* & *Hayabusa2*, ISRO inkl. *Mangalyaan/Gaganyaan* & *Chandrayaan-3*).
  - Live-Telemetrie der **ISS** (`https://api.wheretheiss.at/v1/satellites/25544`, 5s-Auto-Polling & lokaler JSON-Fallback `assets/data/iss-fallback.json`) inkl. **2D-Weltkarte (`IssWorldMapComponent`)** mit Tag-/Nacht-Schatten und Bahnspur, doppelte Quellenbuttons (`officialUrl` + `wikipediaUrl`) und Sprung direkt ins Sonnensystem (`--> P20`).
- **`P50` – Weltraum-Quiz & Auswertung (`P50-U10` bis `P50-U30`)**
  - **42 Fragen in 4 Kategorien** (*Quiz des Tages* mit **Fisher-Yates-Zufallswähler „Fragen neu würfeln“**, *Planeten & Monde*, *Raumfahrt & Missionen* inkl. *Vanguard 1*, *Gemini*, *Apollo 8*, *Giotto* & *Mars Express*, *Bahnen, Kometen & Rekorde*).
  - Multiple-Choice-Fragen (`A`–`D`), farbliche Antwortprüfung, kindgerechte Erklärung, **direkt eingebetteter Bild-Steckbrief (`InfoboxDetailComponent`)** nach Klick auf *„Lösung prüfen“*, offline-fähige `localStorage`-Speicherung der **Kategorie-Bestwerte** und des **Entdecker-Passes** (`ExplorerProgressService`) sowie motivierende Endauswertung im hellen und dunklen Design.

---

## 3. Technischer Stack & Besonderheiten

- **Framework:** Angular `22.2.0` (`@angular/cli` `22.2.7`), TypeScript `~6.0.2`, Standalone Components, Angular Signals (`signal`, `computed`, `effect`, `untracked`), `@angular/router` (`withHashLocation()`, `withComponentInputBinding()`).
- **Icons & Visualisierung:** `@fortawesome/fontawesome-free` `7.3.1`, interaktive 2D-SVGs mit analytischem Orbit-Clipping.
- **Design-Regel für die Projektdokumentation:** Weltraum-Hintergrund in tiefem Marine-/Nachtblau (`#0B132B` / `#111D3B` – kein `#000000`) kombiniert mit Tag-/Nachtmodus (`ThemeService`) und kontraststarken UI-Karten für prüfungskonforme Screenshots ohne schwarze Bilder.
- **Unit-Tests:** Vitest `5` (`7` Test-Dateien, `19` Unit-Tests).

---

## 4. Installation, Entwicklung, Tests & GitHub Pages Deployment

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (http://localhost:4200/)
npm start

# Production-Build erstellen (dist/ssi-app)
npm run build

# Build speziell für GitHub Pages (mit relativem Base-Href)
npm run build:gh-pages

# Unit-Tests (Vitest) einmalig ausführen
npm test -- --watch=false
```

> **Hinweis für GitHub Pages:** Die Anwendung nutzt `withHashLocation()` in `src/app/app.config.ts`, `<base href="./" />` in `src/index.html` sowie ausschließlich relative Asset-Pfade (`assets/data/...` und `assets/images/...`). Die Bereitstellung erfolgt automatisch über `.github/workflows/deploy-pages.yml` aus `dist/ssi-app/browser`.

---

## 5. KI-Transparenz & Kennzeichnung

Gemäß Aufgabenstellung ist jegliche KI-Unterstützung in Programmierung und Dokumentation ausgewiesen:

- Alle Quellcodedateien enthalten einen strukturierten Datei-Header mit Modulname, `FCPP`-Referenz und Angabe des KI-Umfangs.
- Das fortlaufende Sitzungsprotokoll befindet sich in [`AI-LOG.md`](./AI-LOG.md).
