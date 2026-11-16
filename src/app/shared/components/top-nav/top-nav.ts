/**
 * Projekt / Modul: SSI App – Solar System Info App / TopNavComponent (top-nav.ts)
 * FCPP-Referenz: P10-U10 (A10), P20-U10, P30-U10, P40-U10, P50-U10
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Fixierte Top-Navigation mit RouterLink und RouterLinkActive gemäß FCPP P10-U10 mit KI-Unterstützung erstellt.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
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
      icon: '🪐',
      fcppRef: 'P10 / P20',
    },
    {
      label: 'Größenvergleich',
      route: '/size-comparison',
      icon: '📏',
      fcppRef: 'P30',
    },
    {
      label: 'Forschungsprojekte',
      route: '/research',
      icon: '🛰️',
      fcppRef: 'P40',
    },
    {
      label: 'Weltraum-Quiz',
      route: '/quiz',
      icon: '🚀',
      fcppRef: 'P50',
    },
  ];
}
