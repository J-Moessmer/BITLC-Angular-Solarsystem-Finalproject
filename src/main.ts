/**
 * Projekt / Modul: SSI App – Solar System Info App / Bootstrap Entry Point (main.ts)
 * FCPP-Referenz: P10 (Startseite & Anwendungs-Bootstrap)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Standard-Bootstrap-Datei aus Angular CLI 22 mit Header-Dokumentation versehen.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
