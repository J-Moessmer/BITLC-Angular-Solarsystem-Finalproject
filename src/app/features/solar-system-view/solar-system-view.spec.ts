/**
 * Projekt / Modul: SSI App – Solar System Info App / P10 & P20 Spec (solar-system-view.spec.ts)
 * FCPP-Referenz: P10-U20, P10-U30, P10-U40, P20-U10..U40
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Prüft die SVG-Maßstabsberechnungen (Übersicht, Echter AE-Maßstab, Seitenansicht mit INC-Winkel), Pfad-Baum und P20-Infobox mit den 7 Bahnelementen.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SolarSystemViewComponent } from './solar-system-view';
import { ViewportStateService } from '../../core/services/viewport-state.service';
import { CelestialBody } from '../../core/models/celestial-body.model';

describe('SolarSystemViewComponent & InfoboxDetailComponent (P10 & P20)', () => {
  const mockBodies: CelestialBody[] = [
    {
      id: 'sun',
      name: 'Sonne',
      subtitle: 'Zentralgestirn',
      category: 'star',
      categoryLabel: 'Stern',
      childrenIds: ['earth'],
      wikimediaImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sun.jpg',
      imageUrl: 'assets/images/sun.svg',
      imageCredit: 'NASA',
      colorHex: '#F59E0B',
      accentColorHex: '#FDE68A',
      diameterKm: 1392700,
      distanceFromSunKm: 0,
      distanceFromSunAu: 0,
      distanceFromEarthKm: 149600000,
      orbitalPeriodDays: 0,
      orbitalPeriodLabel: 'Zentrum',
      inclinationToSolarEquatorDeg: 0,
      overviewOrbitRadiusSvg: 0,
      overviewBodyRadiusSvg: 28,
      orbitAngleDeg: 0,
      shortSummary: 'Die Sonne im Zentrum.',
      childFriendlyFacts: ['1,3 Mio. Erden passen hinein'],
      comparisonHint: 'Riesiger Feuerball',
      orbitalElements: {
        sma: { code: 'SMA', label: 'Große Halbachse', formattedValue: '0 AE', numericValue: 0, childExplanation: 'Zentrum' },
        ecc: { code: 'ECC', label: 'Exzentrizität', formattedValue: '0', numericValue: 0, childExplanation: 'Kreis' },
        inc: { code: 'INC', label: 'Bahnneigung', formattedValue: '0°', numericValue: 0, childExplanation: '0 Grad' },
        lan: { code: 'LAN', label: 'Aufsteigender Knoten', formattedValue: '0°', numericValue: 0, childExplanation: 'Knoten' },
        lpe: { code: 'LPE', label: 'Länge des Perihels', formattedValue: '0°', numericValue: 0, childExplanation: 'Perihel' },
        mna: { code: 'MNA', label: 'Mittlere Anomalie', formattedValue: '0°', numericValue: 0, childExplanation: 'Anomalie' },
        ref: { code: 'REF', label: 'Referenz', formattedValue: 'J2000', childExplanation: 'Epoche J2000' },
      },
    },
    {
      id: 'earth',
      name: 'Erde',
      subtitle: 'Unser blauer Heimatplanet',
      category: 'planet',
      categoryLabel: 'Gesteinsplanet',
      parentId: 'sun',
      childrenIds: [],
      wikimediaImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Earth.jpg',
      imageUrl: 'assets/images/earth.svg',
      imageCredit: 'NASA',
      colorHex: '#2563EB',
      accentColorHex: '#93C5FD',
      diameterKm: 12756,
      distanceFromSunKm: 149600000,
      distanceFromSunAu: 1.0,
      distanceFromEarthKm: 0,
      orbitalPeriodDays: 365,
      orbitalPeriodLabel: '365 Tage',
      inclinationToSolarEquatorDeg: 7.155,
      overviewOrbitRadiusSvg: 130,
      overviewBodyRadiusSvg: 10,
      orbitAngleDeg: 0,
      shortSummary: 'Die Erde ist unser Zuhause.',
      childFriendlyFacts: ['Zwei Drittel Wasser'],
      comparisonHint: '1 AE von der Sonne entfernt',
      orbitalElements: {
        sma: { code: 'SMA', label: 'Große Halbachse', formattedValue: '1.000 AE', numericValue: 1, childExplanation: 'Abstand' },
        ecc: { code: 'ECC', label: 'Exzentrizität', formattedValue: '0.0167', numericValue: 0.0167, childExplanation: 'Fast kreisrund' },
        inc: { code: 'INC', label: 'Bahnneigung', formattedValue: '7.155°', numericValue: 7.155, childExplanation: 'Neigung' },
        lan: { code: 'LAN', label: 'Aufsteigender Knoten', formattedValue: '-11.26°', numericValue: -11.26, childExplanation: 'Knoten' },
        lpe: { code: 'LPE', label: 'Länge des Perihels', formattedValue: '102.95°', numericValue: 102.95, childExplanation: 'Perihel' },
        mna: { code: 'MNA', label: 'Mittlere Anomalie', formattedValue: '357.52°', numericValue: 357.52, childExplanation: 'Anomalie' },
        ref: { code: 'REF', label: 'Referenz', formattedValue: 'J2000', childExplanation: 'Epoche J2000' },
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarSystemViewComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should render SVG solar system stage, switch scale modes (P10-U40) and open P20 Infobox with 7 orbital elements', async () => {
    const fixture = TestBed.createComponent(SolarSystemViewComponent);
    const httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const localReq = httpMock.expectOne('assets/data/solar-system-fallback.json');
    localReq.flush(mockBodies);
    await Promise.resolve();

    const apiReq = httpMock.expectOne((req) => req.url.includes('api.le-systeme-solaire.net'));
    apiReq.error(new ProgressEvent('offline'));

    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    comp.setViewMode('true-scale');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('5 AE');

    comp.setViewMode('side-view');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sonnenäquator-Ebene');

    fixture.componentRef.setInput('bodyId', 'earth');
    await fixture.whenStable();
    fixture.detectChanges();

    // Sicherstellen, dass das ausgewählte Objekt ('earth') im Zeitraffer automatisch verfolgt wird,
    // während manuelles Reinzoomen erhalten bleibt und erst ein manuelles Drag (panBy) die Verfolgung löst!
    const viewport = TestBed.inject(ViewportStateService);
    expect(viewport.isTrackingSelectedBody()).toBe(true);

    viewport.zoomIn(1.0);
    viewport.addSimulationDays(45);
    fixture.detectChanges();
    expect(viewport.isTrackingSelectedBody()).toBe(true);
    expect(viewport.zoomLevel()).toBeGreaterThan(2.0);

    viewport.panBy(120, -80);
    fixture.detectChanges();
    expect(viewport.isTrackingSelectedBody()).toBe(false);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Unser blauer Heimatplanet');
    const galleryBtns = fixture.nativeElement.querySelectorAll('.mini-gallery .gallery-thumb-btn');
    expect(galleryBtns.length).toBeGreaterThanOrEqual(5);
    expect(text).toContain('SMA');
    expect(text).toContain('ECC');
    expect(text).toContain('INC');
    expect(text).toContain('LAN');
    expect(text).toContain('AOP');
    expect(text).toContain('Argument der Periapsis');
    expect(text).toContain('Aufsteigender Knoten');
    expect(text).toContain('LPE');
    expect(text).toContain('MNA');
    expect(text).toContain('REF');
  });

  it('should strictly hide/filter Lagrange points in true-scale mode when zoomed in without planet selection', async () => {
    const baseOe = mockBodies[1].orbitalElements;
    const makeLagrange = (id: string, name: string, parentId: string, au: number): CelestialBody => ({
      ...mockBodies[1],
      id,
      name,
      category: 'lagrange',
      categoryLabel: 'Lagrange-Punkt',
      parentId,
      childrenIds: [],
      diameterKm: 1,
      distanceFromSunAu: au,
      overviewBodyRadiusSvg: 4,
      orbitalElements: baseOe,
    });
    const jupiter: CelestialBody = {
      ...mockBodies[1],
      id: 'jupiter',
      name: 'Jupiter',
      parentId: 'sun',
      childrenIds: ['jupiter-l1', 'jupiter-l4'],
      distanceFromSunAu: 5.204,
      overviewOrbitRadiusSvg: 255,
    };
    const bodiesWithLagrange: CelestialBody[] = [
      mockBodies[0],
      { ...mockBodies[1], childrenIds: ['lagrange-l1', 'lagrange-l2'] },
      jupiter,
      makeLagrange('lagrange-l1', 'Lagrange-Punkt L1 (Sonne–Erde)', 'earth', 0.99),
      makeLagrange('lagrange-l2', 'Lagrange-Punkt L2 (Sonne–Erde)', 'earth', 1.01),
      makeLagrange('jupiter-l1', 'Lagrange-Punkt L1 (Sonne–Jupiter)', 'jupiter', 4.85),
      makeLagrange('jupiter-l4', 'Lagrange-Punkt L4 (Sonne–Jupiter)', 'jupiter', 5.204),
    ];

    const fixture = TestBed.createComponent(SolarSystemViewComponent);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    httpMock.expectOne('assets/data/solar-system-fallback.json').flush(bodiesWithLagrange);
    await Promise.resolve();
    httpMock.expectOne((req) => req.url.includes('api.le-systeme-solaire.net')).error(new ProgressEvent('offline'));
    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    const viewport = TestBed.inject(ViewportStateService);

    comp.setViewMode('true-scale');
    viewport.setZoom(28);
    fixture.detectChanges();

    const svgText = (): string =>
      fixture.nativeElement.querySelector('svg.solar-system-svg')?.textContent ?? '';

    // Im Fokus-Modus ohne ausgewählten Planeten dürfen auch bei 28x Zoom im echten Maßstab keine L-Punkte im SVG erscheinen
    expect(comp.lagrangeFilterMode()).toBe('context');
    expect(fixture.nativeElement.querySelector('.lagrange-guides')).toBeNull();
    expect(svgText()).not.toContain('Lagrange-Punkt');

    // Bei Auswahl der Erde erscheinen nur Erd-L-Punkte (L1/L2), nicht Jupiters L-Punkte
    fixture.componentRef.setInput('bodyId', 'earth');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lagrange-guides')).toBeTruthy();
    expect(svgText()).toContain('Lagrange-Punkt L1 (Sonne–Erde)');
    expect(svgText()).not.toContain('Lagrange-Punkt L1 (Sonne–Jupiter)');

    // Ausblendung ('off') versteckt alle Punkte und Hilfslinien auch bei gewähltem Planeten
    comp.cycleLagrangeFilterMode(); // -> 'all'
    comp.cycleLagrangeFilterMode(); // -> 'off'
    fixture.detectChanges();
    expect(comp.lagrangeFilterMode()).toBe('off');
    expect(fixture.nativeElement.querySelector('.lagrange-guides')).toBeNull();
    expect(svgText()).not.toContain('Lagrange-Punkt L1 (Sonne–Erde)');
  });

  it('should compute alias-free adaptive time-lapse steps for fast inner moons and zoomed moon systems', async () => {
    const baseOe = mockBodies[1].orbitalElements;
    const makeMoon = (
      id: string,
      name: string,
      parentId: string,
      orbitalPeriodDays: number,
      inclinationDeg = 0.1,
    ): CelestialBody => ({
      ...mockBodies[1],
      id,
      name,
      category: 'moon',
      categoryLabel: 'Mond',
      parentId,
      childrenIds: [],
      diameterKm: 3474,
      distanceFromSunAu: 1,
      orbitalPeriodDays,
      inclinationToSolarEquatorDeg: inclinationDeg,
      overviewOrbitRadiusSvg: 20,
      overviewBodyRadiusSvg: 4,
      orbitalElements: baseOe,
    });
    const jupiter: CelestialBody = {
      ...mockBodies[1],
      id: 'jupiter',
      name: 'Jupiter',
      parentId: 'sun',
      childrenIds: ['io', 'callisto'],
      distanceFromSunAu: 5.204,
      overviewOrbitRadiusSvg: 255,
    };
    const bodiesWithMoons: CelestialBody[] = [
      mockBodies[0],
      { ...mockBodies[1], childrenIds: ['moon'] },
      makeMoon('moon', 'Erdmond', 'earth', 27.3),
      jupiter,
      makeMoon('io', 'Io', 'jupiter', 1.77),
      makeMoon('callisto', 'Kallisto', 'jupiter', 16.69),
    ];

    const fixture = TestBed.createComponent(SolarSystemViewComponent);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    httpMock.expectOne('assets/data/solar-system-fallback.json').flush(bodiesWithMoons);
    await Promise.resolve();
    httpMock.expectOne((req) => req.url.includes('api.le-systeme-solaire.net')).error(new ProgressEvent('offline'));
    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    const viewport = TestBed.inject(ViewportStateService);

    // Bei Jupiter (schnellster Mond Io = 1.77 d): Schrittweite muss klar unter 0.5 * 1.77 d liegen (kein Stroboskop-Aliasing!)
    fixture.componentRef.setInput('bodyId', 'jupiter');
    await fixture.whenStable();
    const jupiterStep = comp.computeTimeLapseStepDays();
    expect(jupiterStep).toBeLessThan(1.77 * 0.25);
    expect(jupiterStep).toBeGreaterThan(0.1);

    // Bei Erde + Erdmond (27.3 d) auch bei hohem Zoom (1200x) zügige Mondbewegung (>= 0.15 d statt 0.02 d)
    fixture.componentRef.setInput('bodyId', 'earth');
    await fixture.whenStable();
    viewport.setZoom(1200);
    const earthMoonStep = comp.computeTimeLapseStepDays();
    expect(earthMoonStep).toBeGreaterThanOrEqual(0.15);

    // Bei extremem ISS-/Erd-Oberflächenzoom (>= 2500x) feiner Nahzoom-Schritt für LEO-Satelliten
    viewport.setZoom(3000);
    expect(comp.computeTimeLapseStepDays()).toBeLessThanOrEqual(0.01);
  });
});
