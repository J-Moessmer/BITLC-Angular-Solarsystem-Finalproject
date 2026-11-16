/**
 * Projekt / Modul: SSI App – Solar System Info App / Root & Routing Spec (app.spec.ts)
 * FCPP-Referenz: P10-U10, P20, P30, P40, P50 (Unit- & Routing-Test der App-Shell)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.1
 * Hinweis: Prüft die Root-Shell, Top-Navigation (P10-U10) und die Routen-Navigation zwischen P10, P20, P30, P40 und P50.
 */

import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App & FCPP Routing Shell (P10–P50)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes, withComponentInputBinding())],
    }).compileComponents();
  });

  it('should create the app shell with TopNavComponent', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-top-nav')).toBeTruthy();
    expect(compiled.querySelector('.brand-main')?.textContent).toContain('SSI App');
  });

  it('should navigate across all FCPP routes (P10, P20, P30, P40, P50)', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/solar-system');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Interaktives 2D-Sonnensystem');

    await router.navigateByUrl('/solar-system/mars');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Himmelskörper: mars');

    await router.navigateByUrl('/size-comparison');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Größenvergleich der Himmelskörper');

    await router.navigateByUrl('/research');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Weltraummissionen, Teleskope & Raumstationen');

    await router.navigateByUrl('/quiz');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Teste dein Weltraum-Wissen!');
  });
});
