/**
 * Projekt / Modul: SSI App – Solar System Info App / SizeComparisonComponent Spec (size-comparison.spec.ts)
 * FCPP-Referenz: P30-U10, P30-U20 (Unit-Test für Maßstabs- & Größenvergleich)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Prüft die proportionale SVG-Radien-Skalierung sowie die Durchmesser- und Volumenverhältnis-Berechnung (P30-U20).
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SizeComparisonComponent } from './size-comparison';
import { CelestialBody } from '../../core/models/celestial-body.model';

describe('SizeComparisonComponent (P30)', () => {
  const mockBodies: CelestialBody[] = [
    {
      id: 'sun',
      name: 'Sonne',
      subtitle: 'Stern',
      category: 'star',
      categoryLabel: 'Stern',
      childrenIds: [],
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
      shortSummary: 'Sonne',
      childFriendlyFacts: [],
      comparisonHint: '',
      orbitalElements: {
        sma: { code: 'SMA', label: 'SMA', formattedValue: '0', childExplanation: '' },
        ecc: { code: 'ECC', label: 'ECC', formattedValue: '0', childExplanation: '' },
        inc: { code: 'INC', label: 'INC', formattedValue: '0', childExplanation: '' },
        lan: { code: 'LAN', label: 'LAN', formattedValue: '0', childExplanation: '' },
        lpe: { code: 'LPE', label: 'LPE', formattedValue: '0', childExplanation: '' },
        mna: { code: 'MNA', label: 'MNA', formattedValue: '0', childExplanation: '' },
        ref: { code: 'REF', label: 'REF', formattedValue: 'J2000', childExplanation: '' },
      },
    },
    {
      id: 'earth',
      name: 'Erde',
      subtitle: 'Heimatplanet',
      category: 'planet',
      categoryLabel: 'Planet',
      childrenIds: [],
      wikimediaImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Earth.jpg',
      imageUrl: 'assets/images/earth.svg',
      imageCredit: 'NASA',
      colorHex: '#2563EB',
      accentColorHex: '#93C5FD',
      diameterKm: 12756,
      distanceFromSunKm: 149600000,
      distanceFromSunAu: 1,
      distanceFromEarthKm: 0,
      orbitalPeriodDays: 365,
      orbitalPeriodLabel: '365 Tage',
      inclinationToSolarEquatorDeg: 7.155,
      overviewOrbitRadiusSvg: 130,
      overviewBodyRadiusSvg: 10,
      orbitAngleDeg: 0,
      shortSummary: 'Erde',
      childFriendlyFacts: [],
      comparisonHint: '',
      orbitalElements: {
        sma: { code: 'SMA', label: 'SMA', formattedValue: '1', childExplanation: '' },
        ecc: { code: 'ECC', label: 'ECC', formattedValue: '0.0167', childExplanation: '' },
        inc: { code: 'INC', label: 'INC', formattedValue: '7.155', childExplanation: '' },
        lan: { code: 'LAN', label: 'LAN', formattedValue: '0', childExplanation: '' },
        lpe: { code: 'LPE', label: 'LPE', formattedValue: '0', childExplanation: '' },
        mna: { code: 'MNA', label: 'MNA', formattedValue: '0', childExplanation: '' },
        ref: { code: 'REF', label: 'REF', formattedValue: 'J2000', childExplanation: '' },
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeComparisonComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should compute proportional SVG radii and diameter/volume ratio for Sun vs. Earth (P30-U20)', async () => {
    const fixture = TestBed.createComponent(SizeComparisonComponent);
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
    const summary = comp.comparisonSummary();
    expect(summary).toBeTruthy();
    expect(summary?.diameterRatio).toBeCloseTo(109.2, 1);
    expect(fixture.nativeElement.textContent).toContain('Wie oft passt Erde in Sonne?');

    comp.selectedIds.set(['stephenson-2-18', 'mount-everest']);
    comp.zoomSliderPercent.set(100);
    fixture.detectChanges();

    expect(comp.maxZoomFactor()).toBeGreaterThan(1000000);
    const items = comp.scaledItems();
    expect(items[1].svgRadiusPx).toBeGreaterThan(150);
    expect(fixture.nativeElement.textContent).toContain('Stephenson 2-18');
    expect(fixture.nativeElement.querySelector('.svg-shape-everest')).toBeTruthy();

    comp.selectedIds.set(['germany-size', 'mount-everest']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.svg-shape-germany')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.svg-shape-everest')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Nord–Süd 876 km');
    expect(fixture.nativeElement.textContent).toContain('Höhe 9 km');

    // Auch beim tiefen Reinzoomen mit mehreren Objekten (z. B. Sonne, Stephenson 2-18 & Erde) dürfen Beschriftungen nicht überlappen
    comp.selectedIds.set(['sun', 'stephenson-2-18', 'earth']);
    comp.zoomSliderPercent.set(76);
    fixture.detectChanges();
    const zoomedItems = comp.scaledItems();
    for (let i = 0; i < zoomedItems.length - 1; i++) {
      const minGap = (zoomedItems[i].labelWidthPx + zoomedItems[i + 1].labelWidthPx) / 2 + 12;
      expect(zoomedItems[i + 1].labelX - zoomedItems[i].labelX).toBeGreaterThanOrEqual(minGap);
    }
    expect(zoomedItems[1].svgLabelName).toBe('Stephenson 2-18');
  });
});
