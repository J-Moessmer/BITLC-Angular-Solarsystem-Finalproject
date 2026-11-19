/**
 * Projekt / Modul: SSI App – Solar System Info App / Core Services Unit Tests (core-services.spec.ts)
 * FCPP-Referenz: P10-U30, P10-U40, P20-U20, P40-U20, P50-U20, P50-U30
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Unit-Tests für ViewportStateService, SolarSystemDataService, MissionDataService und QuizService mit KI-Unterstützung erstellt.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ViewportStateService } from './viewport-state.service';
import { SolarSystemDataService } from './solar-system-data.service';
import { MissionDataService } from './mission-data.service';
import { QuizService } from './quiz.service';
import { CelestialBody } from '../models/celestial-body.model';
import { QuizQuestion } from '../models/quiz.model';

describe('Core Services (P10–P50)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('ViewportStateService should manage zoom, pan, and viewMode signals (P10-U30, P10-U40)', () => {
    const viewport = TestBed.inject(ViewportStateService);
    expect(viewport.zoomLevel()).toBe(1);
    expect(viewport.viewMode()).toBe('overview');

    viewport.zoomIn(0.5);
    expect(viewport.zoomLevel()).toBe(1.5);

    viewport.panBy(40, -25);
    expect(viewport.panX()).toBe(40);
    expect(viewport.panY()).toBe(-25);

    viewport.setViewMode('side-view');
    expect(viewport.viewMode()).toBe('side-view');
    expect(viewport.zoomLevel()).toBe(1);
    expect(viewport.panX()).toBe(0);
  });

  it('ViewportStateService should place L1/L2 collinear with Sun-Earth and L4/L5 at 60° on Earth orbit', () => {
    const viewport = TestBed.inject(ViewportStateService);
    const baseOe = {
      sma: { code: 'SMA' as const, label: 'SMA', formattedValue: '1 AE', numericValue: 1, childExplanation: '' },
      ecc: { code: 'ECC' as const, label: 'ECC', formattedValue: '0.0167', numericValue: 0.0167, childExplanation: '' },
      inc: { code: 'INC' as const, label: 'INC', formattedValue: '0°', numericValue: 0, childExplanation: '' },
      lan: { code: 'LAN' as const, label: 'LAN', formattedValue: '0°', numericValue: 0, childExplanation: '' },
      lpe: { code: 'LPE' as const, label: 'LPE', formattedValue: '102.95°', numericValue: 102.95, childExplanation: '' },
      mna: { code: 'MNA' as const, label: 'MNA', formattedValue: '357.52°', numericValue: 357.52, childExplanation: '' },
      ref: { code: 'REF' as const, label: 'REF', formattedValue: 'J2000', childExplanation: '' },
    };
    const makeBody = (id: string, category: CelestialBody['category'], overviewOrbitRadiusSvg: number): CelestialBody => ({
      id,
      name: id,
      subtitle: '',
      category,
      categoryLabel: category,
      parentId: id === 'sun' ? undefined : 'earth',
      childrenIds: [],
      wikimediaImageUrl: '',
      imageUrl: '',
      imageCredit: '',
      colorHex: '#FDE047',
      accentColorHex: '#FEF08A',
      diameterKm: id === 'earth' ? 12756 : 1,
      distanceFromSunKm: 149600000,
      distanceFromSunAu: 1,
      distanceFromEarthKm: 0,
      orbitalPeriodDays: 365.25,
      orbitalPeriodLabel: '365 Tage',
      inclinationToSolarEquatorDeg: 0,
      overviewOrbitRadiusSvg,
      overviewBodyRadiusSvg: 8.5,
      orbitAngleDeg: 0,
      shortSummary: '',
      childFriendlyFacts: [],
      comparisonHint: '',
      orbitalElements: baseOe,
    });
    const bodies: CelestialBody[] = [
      makeBody('sun', 'star', 0),
      { ...makeBody('earth', 'planet', 130), parentId: 'sun' },
      makeBody('lagrange-l1', 'lagrange', 108),
      makeBody('lagrange-l2', 'lagrange', 152),
      makeBody('lagrange-l4', 'lagrange', 130),
      makeBody('lagrange-l5', 'lagrange', 130),
    ];

    const earthPos = viewport.computeBodyPosition(bodies[1], bodies);
    const l1Pos = viewport.computeBodyPosition(bodies[2], bodies);
    const l2Pos = viewport.computeBodyPosition(bodies[3], bodies);
    const l4Pos = viewport.computeBodyPosition(bodies[4], bodies);
    const l5Pos = viewport.computeBodyPosition(bodies[5], bodies);

    const crossL1 = earthPos.worldX * l1Pos.worldY - earthPos.worldY * l1Pos.worldX;
    const crossL2 = earthPos.worldX * l2Pos.worldY - earthPos.worldY * l2Pos.worldX;
    expect(Math.abs(crossL1)).toBeLessThan(0.05);
    expect(Math.abs(crossL2)).toBeLessThan(0.05);

    const rE = Math.hypot(earthPos.worldX, earthPos.worldY);
    const rL1 = Math.hypot(l1Pos.worldX, l1Pos.worldY);
    const rL2 = Math.hypot(l2Pos.worldX, l2Pos.worldY);
    expect(rL1).toBeLessThan(rE);
    expect(rL2).toBeGreaterThan(rE);

    const cosL4 =
      (earthPos.worldX * l4Pos.worldX + earthPos.worldY * l4Pos.worldY) /
      (rE * Math.hypot(l4Pos.worldX, l4Pos.worldY));
    const cosL5 =
      (earthPos.worldX * l5Pos.worldX + earthPos.worldY * l5Pos.worldY) /
      (rE * Math.hypot(l5Pos.worldX, l5Pos.worldY));
    expect(cosL4).toBeCloseTo(0.5, 2);
    expect(cosL5).toBeCloseTo(0.5, 2);

    const jupiter = { ...makeBody('jupiter', 'planet', 255), parentId: 'sun', distanceFromSunAu: 5.204 };
    const jupL1 = { ...makeBody('jupiter-l1', 'lagrange', 243), parentId: 'jupiter', distanceFromSunAu: 4.849 };
    const jupL2 = { ...makeBody('jupiter-l2', 'lagrange', 267), parentId: 'jupiter', distanceFromSunAu: 5.559 };
    const jupL4 = { ...makeBody('jupiter-l4', 'lagrange', 255), parentId: 'jupiter', distanceFromSunAu: 5.204 };
    const allWithJup = [...bodies, jupiter, jupL1, jupL2, jupL4];
    const jupPos = viewport.computeBodyPosition(jupiter, allWithJup);
    const jL1Pos = viewport.computeBodyPosition(jupL1, allWithJup);
    const jL2Pos = viewport.computeBodyPosition(jupL2, allWithJup);
    const jL4Pos = viewport.computeBodyPosition(jupL4, allWithJup);
    expect(Math.abs(jupPos.worldX * jL1Pos.worldY - jupPos.worldY * jL1Pos.worldX)).toBeLessThan(0.1);
    expect(Math.abs(jupPos.worldX * jL2Pos.worldY - jupPos.worldY * jL2Pos.worldX)).toBeLessThan(0.1);
    expect(Math.hypot(jL1Pos.worldX, jL1Pos.worldY)).toBeLessThan(Math.hypot(jupPos.worldX, jupPos.worldY));
    expect(Math.hypot(jL2Pos.worldX, jL2Pos.worldY)).toBeGreaterThan(Math.hypot(jupPos.worldX, jupPos.worldY));
    const cosJupL4 =
      (jupPos.worldX * jL4Pos.worldX + jupPos.worldY * jL4Pos.worldY) /
      (Math.hypot(jupPos.worldX, jupPos.worldY) * Math.hypot(jL4Pos.worldX, jL4Pos.worldY));
    expect(cosJupL4).toBeCloseTo(0.5, 2);
  });

  it('SolarSystemDataService should load fallback bodies with Wikimedia Commons URLs and 7 orbital elements (P20-U20)', async () => {
    const service = TestBed.inject(SolarSystemDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const mockEarth = {
      id: 'earth',
      name: 'Erde',
      subtitle: 'Unser blauer Heimatplanet',
      category: 'planet',
      categoryLabel: 'Gesteinsplanet',
      parentId: 'sun',
      childrenIds: ['moon'],
      wikimediaImageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/The_Earth_seen_from_Apollo_17.jpg?width=640',
      imageUrl: 'assets/images/earth.svg',
      imageCredit: 'NASA / Wikimedia Commons',
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
      orbitAngleDeg: 195,
      shortSummary: 'Kurzbeschreibung Erde',
      childFriendlyFacts: ['Fakt 1'],
      comparisonHint: 'Vergleich',
      orbitalElements: {
        sma: { code: 'SMA', label: 'SMA', formattedValue: '1 AE', childExplanation: 'Erklärung' },
        ecc: { code: 'ECC', label: 'ECC', formattedValue: '0.0167', childExplanation: 'Erklärung' },
        inc: { code: 'INC', label: 'INC', formattedValue: '7.155°', childExplanation: 'Erklärung' },
        lan: { code: 'LAN', label: 'LAN', formattedValue: '-11.26°', childExplanation: 'Erklärung' },
        lpe: { code: 'LPE', label: 'LPE', formattedValue: '102.95°', childExplanation: 'Erklärung' },
        mna: { code: 'MNA', label: 'MNA', formattedValue: '357.52°', childExplanation: 'Erklärung' },
        ref: { code: 'REF', label: 'REF', formattedValue: 'J2000', childExplanation: 'Erklärung' },
      },
    } satisfies CelestialBody;

    const loadPromise = service.loadSolarSystemData();

    const localReq = httpMock.expectOne('assets/data/solar-system-fallback.json');
    localReq.flush([mockEarth]);
    await Promise.resolve();

    const apiReq = httpMock.expectOne((req) => req.url.includes('api.le-systeme-solaire.net'));
    apiReq.error(new ProgressEvent('offline'));

    const bodies = await loadPromise;
    expect(bodies.length).toBe(1);
    expect(bodies[0].wikimediaImageUrl).toContain('commons.wikimedia.org');
    expect(bodies[0].orbitalElements.sma.code).toBe('SMA');

    service.selectBody('earth');
    expect(service.selectedBody()?.name).toBe('Erde');
  });

  it('MissionDataService should fall back to local ISS status when API fails (P40-U20)', async () => {
    const missionService = TestBed.inject(MissionDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const statusPromise = missionService.refreshIssLiveStatus();

    const liveReq = httpMock.expectOne('https://api.wheretheiss.at/v1/satellites/25544');
    liveReq.error(new ProgressEvent('offline'));
    await Promise.resolve();

    const fallbackReq = httpMock.expectOne('assets/data/iss-fallback.json');
    fallbackReq.flush({
      latitude: 51.51,
      longitude: 7.46,
      altitudeKm: 416.8,
      velocityKmh: 27584,
      visibility: 'daylight',
      timestamp: 1794826000,
      locationHint: 'Offline-Fallback',
      isFallbackData: true,
    });

    const status = await statusPromise;
    expect(status.isFallbackData).toBe(true);
    expect(status.altitudeKm).toBe(416.8);
  });

  it('QuizService should evaluate answers and compute child-friendly score (P50-U20, P50-U30)', async () => {
    const quizService = TestBed.inject(QuizService);
    const httpMock = TestBed.inject(HttpTestingController);

    const mockQuestions: QuizQuestion[] = [
      {
        id: 'q1',
        category: 'celestial',
        questionText: 'Welcher Planet ist der größte?',
        options: ['Mars', 'Jupiter', 'Merkur', 'Venus'],
        correctOptionIndex: 1,
        childExplanation: 'Jupiter ist der größte Planet!',
      },
    ];

    const loadPromise = quizService.loadQuestions();
    const qReq = httpMock.expectOne('assets/data/quiz-questions.json');
    qReq.flush(mockQuestions);
    await loadPromise;

    quizService.selectCategory('celestial');
    expect(quizService.currentQuestion()?.id).toBe('q1');

    quizService.chooseOption(1);
    quizService.checkCurrentAnswer();
    expect(quizService.isAnswerChecked()).toBe(true);
    expect(quizService.scoreCorrect()).toBe(1);

    quizService.nextQuestion();
    expect(quizService.isQuizFinished()).toBe(true);
    expect(quizService.childPraiseSummary().badge).toContain('Sternen-Kapitän');
  });
});
