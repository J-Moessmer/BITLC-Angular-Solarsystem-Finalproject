/**
 * Projekt / Modul: SSI App – Solar System Info App / Root & Routing Spec (app.spec.ts)
 * FCPP-Referenz: P10-U10, P20, P30, P40, P50 (Unit- & Routing-Test der App-Shell)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.2
 * Hinweis: Prüft die Root-Shell, Top-Navigation (P10-U10) und die Routen-Navigation zwischen P10, P20, P30, P40 und P50.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App & FCPP Routing Shell (P10–P50)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create the app shell with TopNavComponent', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-top-nav')).toBeTruthy();
    expect(compiled.querySelector('.brand-main')?.textContent).toContain('SSI App');
    expect(compiled.querySelector('.brand-link')?.getAttribute('href')).toBe('/');
  });

  it('should render the Landing Page with interactive 5-step tutorial on root route /', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Willkommen in der SSI App');
    expect(text).toContain('So funktioniert die SSI App');
    expect(text).toContain('Schritt 1 von 5');
    expect(text).not.toContain('P10');
    expect(text).not.toContain('P20');
    expect(text).not.toContain('P30');
    expect(text).not.toContain('P40');
    expect(text).not.toContain('P50');

    const tabButtons = fixture.nativeElement.querySelectorAll(
      '.tutorial-tab-btn',
    ) as NodeListOf<HTMLButtonElement>;
    expect(tabButtons.length).toBe(5);
    tabButtons[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Schritt 2 von 5');
    expect(fixture.nativeElement.textContent).toContain('Steckbriefe, 7 Bahnelemente');
  });

  it('should navigate across all FCPP routes (P10, P20, P30, P40, P50)', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/solar-system');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Entdecker-Pfad');

    await router.navigateByUrl('/size-comparison');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Wie groß sind Sonne, Planeten und Monde wirklich?');

    await router.navigateByUrl('/research');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain(
      'Weltraummissionen, Teleskope & Raumstationen',
    );

    await router.navigateByUrl('/quiz');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Teste dein Weltraum-Wissen!');
  });
});
