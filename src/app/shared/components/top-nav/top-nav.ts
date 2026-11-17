/**
 * Projekt / Modul: SSI App – Solar System Info App / TopNavComponent (top-nav.ts)
 * FCPP-Referenz: P10-U10 (A10), P20-U10, P30-U10, P40-U10, P50-U10
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v2.1
 * Hinweis: Fixierte Top-Navigation mit Font Awesome 7.3 Vektor-Icons eingerichtet.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  faIcon: string;
  fcppRef: string;
}

@Component({
  selector: 'app-top-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNavComponent {
  protected readonly navItems: readonly NavItem[] = [
    {
      label: 'Sonnensystem',
      route: '/solar-system',
      faIcon: 'fa-solid fa-earth-europe',
      fcppRef: 'P10 / P20',
    },
    {
      label: 'Größenvergleich',
      route: '/size-comparison',
      faIcon: 'fa-solid fa-ruler-combined',
      fcppRef: 'P30',
    },
    {
      label: 'Forschungsprojekte',
      route: '/research',
      faIcon: 'fa-solid fa-satellite',
      fcppRef: 'P40',
    },
    {
      label: 'Weltraum-Quiz',
      route: '/quiz',
      faIcon: 'fa-solid fa-rocket',
      fcppRef: 'P50',
    },
  ];
}
