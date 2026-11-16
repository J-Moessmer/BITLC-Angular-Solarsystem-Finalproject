/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMissionsComponent (research-missions.ts)
 * FCPP-Referenz: P40-U10, P40-U20 (Forschungsprojekte & Raumfahrt)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Routing-Grundgerüst für das Plan-Element P40 inkl. Test-Sprunglink zu P20.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-research-missions',
  imports: [RouterLink],
  template: `
    <section class="feature-card" aria-labelledby="p40-heading">
      <span class="fcpp-tag">P40 · Forschungsprojekte & Raumfahrt</span>
      <h2 id="p40-heading">Weltraummissionen, Teleskope & Raumstationen</h2>
      <p>
        Hier entstehen die filterbaren Übersichtskarten zu Mars Rovern, James-Webb-Teleskop (JWST),
        Gaia, Raumstation ISS (mit Live-API & Fallback) und neuen Mondflügen (P40-U20).
      </p>
      <div class="jump-demo">
        <a class="jump-btn" routerLink="/solar-system/mars">
          🚀 Ziel-Himmelskörper Mars im Sonnensystem zeigen (--> P20)
        </a>
      </div>
    </section>
  `,
  styles: `
    .feature-card {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-card);
    }
    .fcpp-tag {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    h2 {
      margin: 0 0 0.5rem;
    }
    p {
      margin: 0 0 1rem;
      color: var(--card-text-secondary);
    }
    .jump-btn {
      display: inline-block;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      font-weight: 700;
      background-color: var(--accent-primary);
      color: #ffffff;
    }
    .jump-btn:hover {
      background-color: var(--accent-primary-hover);
      text-decoration: none;
    }
  `,
})
export class ResearchMissionsComponent {}
