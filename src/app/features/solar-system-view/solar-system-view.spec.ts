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
    expect(text).toContain('SMA');
    expect(text).toContain('ECC');
    expect(text).toContain('INC');
    expect(text).toContain('LAN');
    expect(text).toContain('LPE');
    expect(text).toContain('MNA');
    expect(text).toContain('REF');
  });
});
