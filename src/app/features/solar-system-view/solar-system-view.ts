/**
 * Projekt / Modul: SSI App – Solar System Info App / SolarSystemViewComponent (solar-system-view.ts)
 * FCPP-Referenz: P10-U20, P10-U30, P10-U40 & P20-Integration
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Routing-Grundgerüst für P10 (Startseite Sonnensystem) mit Unterstützung für den optionalen Routenparameter :bodyId (--> P20).
 */

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfoboxDetailComponent } from './infobox-detail/infobox-detail';

@Component({
  selector: 'app-solar-system-view',
  imports: [RouterLink, InfoboxDetailComponent],
  template: `
    <section class="p10-layout" aria-labelledby="p10-heading">
      <aside class="sidebar-card">
        <span class="fcpp-tag">P10-U20 · Pfad-Baum</span>
        <h2 id="p10-heading">Sonnensystem-Pfad</h2>
        <p class="hint">Schnellsprung zum Testen der Route nach P20:</p>
        <ul class="quick-tree">
          <li><a routerLink="/solar-system/sun">☀️ Sonne</a></li>
          <li><a routerLink="/solar-system/earth">🌍 Erde</a></li>
          <li><a routerLink="/solar-system/moon">🌙 Erdmond</a></li>
          <li><a routerLink="/solar-system/mars">🔴 Mars</a></li>
          <li><a routerLink="/solar-system/jupiter">🟠 Jupiter</a></li>
        </ul>
      </aside>

      <div class="stage-container">
        <div class="stage-header-card">
          <div>
            <span class="fcpp-tag">P10-U30 / P10-U40 · 2D-SVG-Bühne</span>
            <h3>Interaktives 2D-Sonnensystem</h3>
          </div>
          <p class="stage-sub">
            Übersicht · Echter Maßstab (AE) · Seitenansicht (Bahnneigung zum Sonnenäquator)
          </p>
        </div>

        @if (bodyId(); as selectedId) {
          <app-infobox-detail [bodyId]="selectedId" />
        }
      </div>
    </section>
  `,
  styles: `
    .p10-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.25rem;
      align-items: start;
    }
    .sidebar-card,
    .stage-header-card {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-card);
    }
    .stage-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .fcpp-tag {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    h2,
    h3 {
      margin: 0 0 0.4rem;
    }
    .hint,
    .stage-sub {
      margin: 0 0 0.75rem;
      color: var(--card-text-secondary);
      font-size: 0.92rem;
    }
    .quick-tree {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .quick-tree a {
      display: block;
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      background-color: var(--card-bg);
      font-weight: 600;
      color: var(--card-text-primary);
    }
    .quick-tree a:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      text-decoration: none;
    }
    @media (max-width: 768px) {
      .p10-layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class SolarSystemViewComponent {
  /** Automatisch gebunden über withComponentInputBinding() bei /solar-system/:bodyId */
  readonly bodyId = input<string>();
}
