/**
 * Projekt / Modul: SSI App – Solar System Info App / ThemeService (theme.service.ts)
 * FCPP-Referenz: Übergreifendes Design-System (Tag-/Nachtmodus ohne reines Schwarz #000000)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v1.0
 * Hinweis: Verwaltet das Umschalten zwischen hellem Tagmodus (Doku-Standard) und marineblauem Nachtmodus über Angular Signals.
 */

import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'ssi-app-theme';
  readonly isDarkMode = signal<boolean>(this.readInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('theme-dark', dark);
      }
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
        } catch {
          // Ignorieren, falls localStorage im privaten Modus gesperrt ist
        }
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((dark) => !dark);
  }

  private readInitialTheme(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    try {
      return localStorage.getItem(this.storageKey) === 'dark';
    } catch {
      return false;
    }
  }
}
