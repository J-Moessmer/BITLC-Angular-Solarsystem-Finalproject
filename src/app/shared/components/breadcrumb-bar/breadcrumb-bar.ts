/**
 * Projekt / Modul: SSI App – Solar System Info App / BreadcrumbBarComponent (breadcrumb-bar.ts)
 * FCPP-Referenz: P10-U20 (A20 – Breadcrumb-Leiste für direkten Sprung im Pfad)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Reduzierte Breadcrumb-Leiste mit 1px Rahmen und dezenten Radien.
 */

import { Component, input, output } from '@angular/core';

export interface BreadcrumbItem {
  id: string;
  label: string;
  bodyId?: string;
}

@Component({
  selector: 'app-breadcrumb-bar',
  template: `
    <nav class="breadcrumb-card" aria-label="Aktueller Pfad im Sonnensystem">
      <span class="crumb-prefix"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Pfad:</span>
      <ol class="crumb-list">
        @for (crumb of items(); track crumb.id; let isLast = $last) {
          <li class="crumb-item">
            @if (crumb.bodyId && !isLast) {
              <button
                type="button"
                class="crumb-btn"
                (click)="crumbSelected.emit(crumb.bodyId)"
              >
                {{ crumb.label }}
              </button>
            } @else if (crumb.id === 'root' && items().length > 1) {
              <button type="button" class="crumb-btn" (click)="crumbSelected.emit(null)">
                {{ crumb.label }}
              </button>
            } @else {
              <span class="crumb-current" [attr.aria-current]="isLast ? 'page' : null">
                {{ crumb.label }}
              </span>
            }

            @if (!isLast) {
              <span class="crumb-sep" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .breadcrumb-card {
      background-color: var(--card-bg-elevated);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 0.45rem 0.85rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.45rem;
      box-shadow: var(--shadow-card);
    }
    .crumb-prefix {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--card-text-muted);
    }
    .crumb-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .crumb-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .crumb-btn {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--accent-primary);
      font-weight: 600;
      font-size: 0.83rem;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .crumb-btn:hover {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #ffffff;
    }
    .crumb-current {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--card-text-primary);
      padding: 0.1rem 0.25rem;
    }
    .crumb-sep {
      color: var(--card-text-muted);
      font-size: 0.8rem;
    }
  `,
})
export class BreadcrumbBarComponent {
  readonly items = input.required<BreadcrumbItem[]>();
  readonly crumbSelected = output<string | null>();
}
