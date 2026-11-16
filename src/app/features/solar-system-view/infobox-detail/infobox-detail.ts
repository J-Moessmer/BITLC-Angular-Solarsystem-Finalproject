/**
 * Projekt / Modul: SSI App – Solar System Info App / InfoboxDetailComponent (infobox-detail.ts)
 * FCPP-Referenz: P20-U10, P20-U20, P20-U30, P20-U40 (Detailansicht & 7 Bahnelemente)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Routing-fähiges Grundgerüst für P20 mit Input-Signal bodyId und Rückkehr nach P10.
 */

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-infobox-detail',
  imports: [RouterLink],
  template: `
    <aside class="infobox-card" aria-labelledby="infobox-title">
      <div class="infobox-header">
        <span class="fcpp-badge">P20 · Detailansicht</span>
        <a
          class="close-btn"
          routerLink="/solar-system"
          aria-label="Infobox schließen und zurück zum Sonnensystem"
        >
          ✕ Schließen
        </a>
      </div>
      <h3 id="infobox-title">Himmelskörper: {{ bodyId() }}</h3>
      <p>
        Hier werden Bild, kindgerechte Beschreibung, Entfernungen (Sonne/Erde), Monde sowie die
        ausklappbare Astronomen-Box mit den 7 Bahnelementen (SMA, ECC, INC, LAN, LPE, MNA, REF)
        geladen.
      </p>
    </aside>
  `,
  styles: `
    .infobox-card {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-card);
    }
    .infobox-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .fcpp-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      background-color: var(--accent-astronomy-box);
      color: var(--accent-primary);
    }
    .close-btn {
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--card-text-primary);
    }
    h3 {
      margin: 0 0 0.5rem;
    }
    p {
      margin: 0;
      color: var(--card-text-secondary);
    }
  `,
})
export class InfoboxDetailComponent {
  readonly bodyId = input.required<string>();
}
