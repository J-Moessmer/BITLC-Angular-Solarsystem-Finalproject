/**
 * Projekt / Modul: SSI App – Solar System Info App / Root Component (app.ts)
 * FCPP-Referenz: P10-U10 (Fixierte Top-Navigation & Router-Outlet)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.1
 * Hinweis: Einbindung der TopNavComponent (P10-U10) und des RouterOutlet in der Root-Shell.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/components/top-nav/top-nav';

@Component({
  selector: 'app-root',
  imports: [TopNavComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
