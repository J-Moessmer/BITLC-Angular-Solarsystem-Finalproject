/**
 * Projekt / Modul: SSI App – Solar System Info App / TopNavComponent Spec (top-nav.spec.ts)
 * FCPP-Referenz: P10-U10 (Unit-Test für Hauptnavigation)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Prüft die Darstellung aller 4 Hauptnavigationspunkte (P10, P30, P40, P50).
 */

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TopNavComponent } from './top-nav';

describe('TopNavComponent (P10-U10)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the top navigation component', () => {
    const fixture = TestBed.createComponent(TopNavComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all four main navigation links (Sonnensystem, Größenvergleich, Forschungsprojekte, Weltraum-Quiz)', async () => {
    const fixture = TestBed.createComponent(TopNavComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.nav-link')).map((el) =>
      el.textContent?.trim(),
    );

    expect(links.length).toBe(4);
    expect(links[0]).toContain('Sonnensystem');
    expect(links[1]).toContain('Größenvergleich');
    expect(links[2]).toContain('Forschungsprojekte');
    expect(links[3]).toContain('Weltraum-Quiz');
  });
});
