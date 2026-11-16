/**
 * Projekt / Modul: SSI App – Solar System Info App / Application Configuration (app.config.ts)
 * FCPP-Referenz: P10-U10 (Routing mit HashLocation für GitHub Pages), P20-U20 & P40-U20 (HTTP-Client für API & JSON-Fallbacks)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Grundkonfiguration für Angular 22 Router (withHashLocation, withComponentInputBinding) und HttpClient mit KI-Unterstützung eingerichtet.
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(),
  ],
};
