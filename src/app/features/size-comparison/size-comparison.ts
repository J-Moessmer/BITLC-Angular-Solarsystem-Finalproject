/**
 * Projekt / Modul: SSI App – Solar System Info App / SizeComparisonComponent (size-comparison.ts)
 * FCPP-Referenz: P30-U10, P30-U20 (Maßstabs- & Größenvergleich)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Routing-Grundgerüst für das Plan-Element P30 mit KI-Unterstützung erstellt.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-size-comparison',
  template: `
    <section class="feature-card" aria-labelledby="p30-heading">
      <span class="fcpp-tag">P30 · Maßstabs- & Größenvergleich</span>
      <h2 id="p30-heading">Größenvergleich der Himmelskörper</h2>
      <p>
        Hier entsteht die SVG-Vergleichsbühne (P30-U20) zur proportionalen Gegenüberstellung von
        zwei oder mehr Himmelskörpern inklusive kindgerechtem Durchmesser- und Volumenverhältnis
        („Wie oft passt die Erde in die Sonne?").
      </p>
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
      margin: 0;
      color: var(--card-text-secondary);
    }
  `,
})
export class SizeComparisonComponent {}
