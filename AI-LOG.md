# KI-/AI-Nutzungsprotokoll (`AI-LOG.md`)

**Projekt:** SSI App – Solar System Info App (`BITLC NE5 FIAE WS26` – Modul Angular)  
**Autor / Prüfling:** Joshua Mößmer (`J-Moessmer`)  
**Vorgabe laut Aufgabenstellung:**

> *"Wichtig! Wird KI/AI wie ChatGPT oder andere Systeme verwendet, ist die Verwendung jeweils in ihrem Umfang anzugeben. Das betrifft die Programmierung und auch die Dokumentation!"*

Dieses Dokument protokolliert fortlaufend nach jeder Arbeits-Session den Einsatz von KI-Werkzeugen (insb. *Antigravity AI / Pair-Programming Agent*) sowohl in der **Projektplanung & Programmierung** als auch bei der **Erstellung der IHK-Projektdokumentation**, um den vollen Umfang im Anhang der Projektdokumentation transparent auszuweisen.

---

## 1. Chronologisches Protokoll der Arbeits-Sessions

| Datum | Phase / FCPP-Bezug | Eingesetztes KI-System | Art & Umfang der KI-Unterstützung | Eigenleistung / Prüfung durch Autor |
| :--- | :--- | :--- | :--- | :--- |
| **16.11.2026** | Phase 0: Projekt-Initialisierung & FCPP-Architekturplanung (`P10`–`P50`) | Antigravity AI (Pair-Programming Agent) | Strukturierung der internen Planungsdateien (`.agents/`), Ableitung der TypeScript-Datenmodelle (`CelestialBody`, `OrbitalElements` für `SMA`–`REF`, `ResearchMission`, `QuizQuestion`) aus dem eigenen FCPPG-Plan sowie Gliederungsentwurf für die IHK-Dokumentation. | FCPPG-Plan (`P10`–`P50`), StorySheets, Anforderungen (`A10`–`A50`) und Umsetzungen (`P10-U10` bis `P50-U30`) selbst konzipiert und geprüft. |
| **16.11.2026** | Phase 1: Angular-22-Setup & Design-Grundgerüst (`P10-U10`) | Antigravity AI (Pair-Programming Agent) | Initialisierung des Angular-22.2.7-Workspaces (`ssi-app`), Einrichtung von `app.config.ts` (`withHashLocation()`, `withComponentInputBinding()`, `provideHttpClient()`), Erstellung des globalen CSS-Designsystems (`styles.css` mit Marineblau `#0B132B` statt `#000000` und hellen UI-Karten) sowie Anpassung des Basis-Unit-Tests (`app.spec.ts`). | Architekturvorgaben, Farbkonzept gegen schwarze Doku-Screenshots und Build-/Test-Verifikation geprüft. |
| **16.11.2026** | Phase 1: Top-Navigation (`P10-U10`) & FCPP-Routing-Gerüst (`P10`–`P50`) | Antigravity AI (Pair-Programming Agent) | Erstellung der `TopNavComponent` (`P10-U10` bis `P50-U10`), der Feature-Shell-Komponenten (`SolarSystemViewComponent`, `InfoboxDetailComponent`, `SizeComparisonComponent`, `ResearchMissionsComponent`, `SpaceQuizComponent`) sowie der zentralen `app.routes.ts` inkl. Routen-Unit-Tests. | Routenstruktur, Parameter-Binding (`:bodyId` für `P20`) und Navigationstests geprüft. |
| **16.11.2026** | Phase 2: Datenmodelle, JSON-Fallback-Daten (inkl. Wikimedia Commons Fotos) & Core-Services (`P10`–`P50`) | Antigravity AI (Pair-Programming Agent) | Erstellung der TypeScript-Interfaces (`celestial-body.model.ts`, `research-mission.model.ts`, `quiz.model.ts`), der lokalen JSON-Datensätze (`solar-system-fallback.json` mit 27 Körpern & 7 Bahnelementen `SMA`–`REF`, `missions.json`, `iss-fallback.json`, `quiz-questions.json`) inkl. Wikimedia-Commons-Foto-URLs und 31 lokalen SVG-Fallback-Grafiken sowie der 4 Services (`SolarSystemDataService`, `ViewportStateService`, `MissionDataService`, `QuizService`) mit Unit-Tests (`core-services.spec.ts`). | Auswahl von Wikimedia Commons als Bildquelle vorgegeben; astronomische Kennzahlen, kindgerechte Texte und Service-Tests geprüft. |

---

## 2. Zusammenfassung nach Bereichen (Vorlage für Anhang D.2 der IHK-Doku)

### 2.1 Programmierung & Softwarearchitektur

- **Architektur & Datenmodelle (`P10`–`P50`):** *(wird während Sprint 1 vom 16.11.–22.11.2026 laufend ergänzt)*
- **SVG-Berechnungen & Signals (`ViewportStateService`, `P10-U30`, `P10-U40`, `P30-U20`):** *(wird laufend ergänzt)*
- **Services & Fallback-Daten (`SolarSystemDataService`, `MissionDataService`, `QuizService`):** *(wird laufend ergänzt)*
- **UI-Komponenten & Styling (`#0B132B` / `#111D3B` Marineblau-Theme + helle UI-Karten):** *(wird laufend ergänzt)*
- **Unit-Tests (Vitest `*.spec.ts`):** *(wird laufend ergänzt)*

### 2.2 Projektdokumentation & Fachtexte

- **Kindgerechte Beschreibungstexte & Quizfragen (Grundschul-Didaktik):** *(wird laufend ergänzt)*
- **Strukturierung, Formulierungshilfen & Lektorat der IHK-Hauptdokumentation (20–30 Seiten) & des Anhangs (10–20 Seiten):** *(wird während Sprint 2 vom 23.11.–26.11.2026 laufend ergänzt)*
