/**
 * Projekt / Modul: SSI App – Solar System Info App / Core Services Unit Tests (core-services.spec.ts)
 * FCPP-Referenz: P10-U30, P10-U40, P20-U20, P40-U20, P50-U20, P50-U30
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v1.2
 * Hinweis: Unit-Tests für ViewportStateService, SolarSystemDataService, MissionDataService, ExplorerProgressService und QuizService mit KI-Unterstützung erstellt.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ViewportStateService } from './viewport-state.service';
import { SolarSystemDataService } from './solar-system-data.service';
import { MissionDataService } from './mission-data.service';
import { QuizService } from './quiz.service';
import { ExplorerProgressService } from './explorer-progress.service';
import { CelestialBody } from '../models/celestial-body.model';
import { QuizQuestion } from '../models/quiz.model';
import { ResearchMission } from '../models/research-mission.model';

describe('Core Services (P10–P50)', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
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

    // Historischer Startdatum-Filter für Vanguard 1 (17. März 1958)
    viewport.setSimulationDateIso('1958-03-16');
    expect(viewport.isSpacecraftActiveAtSimulationDate('vanguard-1')).toBe(false);
    viewport.setSimulationDateIso('1958-03-17');
    expect(viewport.isSpacecraftActiveAtSimulationDate('vanguard-1')).toBe(true);
    viewport.resetToRealTimeNow();
    expect(viewport.isSpacecraftActiveAtSimulationDate('vanguard-1')).toBe(true);
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
    const earthMoon: CelestialBody = {
      ...makeBody('moon', 'moon', 17),
      diameterKm: 3474,
      orbitalPeriodDays: 27.3,
      orbitalElements: {
        ...baseOe,
        sma: { ...baseOe.sma, numericValue: 0.00257 },
      },
    };
    const bodies: CelestialBody[] = [
      makeBody('sun', 'star', 0),
      { ...makeBody('earth', 'planet', 130), parentId: 'sun' },
      earthMoon,
      makeBody('lagrange-l1', 'lagrange', 108),
      makeBody('lagrange-l2', 'lagrange', 152),
      makeBody('lagrange-l4', 'lagrange', 130),
      makeBody('lagrange-l5', 'lagrange', 130),
    ];

    const earthPos = viewport.computeBodyPosition(bodies[1], bodies);
    const moonPos = viewport.computeBodyPosition(earthMoon, bodies);
    const l1Pos = viewport.computeBodyPosition(bodies[3], bodies);
    const l2Pos = viewport.computeBodyPosition(bodies[4], bodies);
    const l4Pos = viewport.computeBodyPosition(bodies[5], bodies);
    const l5Pos = viewport.computeBodyPosition(bodies[6], bodies);

    // Erd-L1 und Erd-L2 müssen sowohl in Übersicht (Zoom 1x & 3.2x) als auch im Echten Maßstab (22x & 250x) klar außerhalb der Mondbahn liegen
    const moonDist1x = Math.hypot(moonPos.x - earthPos.x, moonPos.y - earthPos.y);
    expect(Math.hypot(l1Pos.x - earthPos.x, l1Pos.y - earthPos.y)).toBeGreaterThan(moonDist1x + 5);
    expect(Math.hypot(l2Pos.x - earthPos.x, l2Pos.y - earthPos.y)).toBeGreaterThan(moonDist1x + 5);

    for (const check of [
      { mode: 'overview' as const, zoom: 3.2 },
      { mode: 'true-scale' as const, zoom: 22 },
      { mode: 'true-scale' as const, zoom: 250 },
    ]) {
      viewport.setViewMode(check.mode);
      viewport.setZoom(check.zoom);
      const eP = viewport.computeBodyPosition(bodies[1], bodies);
      const mP = viewport.computeBodyPosition(earthMoon, bodies);
      const l1P = viewport.computeBodyPosition(bodies[3], bodies);
      const l2P = viewport.computeBodyPosition(bodies[4], bodies);
      const moonR = Math.hypot(mP.x - eP.x, mP.y - eP.y);
      expect(Math.hypot(l1P.x - eP.x, l1P.y - eP.y)).toBeGreaterThan(moonR * 1.5);
      expect(Math.hypot(l2P.x - eP.x, l2P.y - eP.y)).toBeGreaterThan(moonR * 1.5);
    }
    viewport.setViewMode('overview');
    viewport.setZoom(1.0);

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
    const callisto: CelestialBody = {
      ...makeBody('callisto', 'moon', 31),
      parentId: 'jupiter',
      diameterKm: 4821,
      orbitalPeriodDays: 16.69,
      orbitalElements: { ...baseOe, sma: { ...baseOe.sma, numericValue: 0.01259 } },
    };
    const jupL1 = { ...makeBody('jupiter-l1', 'lagrange', 243), parentId: 'jupiter', distanceFromSunAu: 4.849 };
    const jupL2 = { ...makeBody('jupiter-l2', 'lagrange', 267), parentId: 'jupiter', distanceFromSunAu: 5.559 };
    const jupL4 = { ...makeBody('jupiter-l4', 'lagrange', 255), parentId: 'jupiter', distanceFromSunAu: 5.204 };
    const mercury = { ...makeBody('mercury', 'planet', 62), parentId: 'sun', distanceFromSunAu: 0.387 };
    const mercL1 = { ...makeBody('mercury-l1', 'lagrange', 52), parentId: 'mercury', distanceFromSunAu: 0.385 };
    const mercL2 = { ...makeBody('mercury-l2', 'lagrange', 72), parentId: 'mercury', distanceFromSunAu: 0.389 };

    const allWithJup = [...bodies, jupiter, callisto, jupL1, jupL2, jupL4, mercury, mercL1, mercL2];
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

    // Großzügiger Abstand auch bei Jupiter (Kallisto) & mondlosem Planeten Merkur bei 3.2x Zoom in Übersicht
    viewport.setViewMode('overview');
    viewport.setZoom(3.2);
    const jup3 = viewport.computeBodyPosition(jupiter, allWithJup);
    const cal3 = viewport.computeBodyPosition(callisto, allWithJup);
    const jL1_3 = viewport.computeBodyPosition(jupL1, allWithJup);
    const jL2_3 = viewport.computeBodyPosition(jupL2, allWithJup);
    const calDist = Math.hypot(cal3.x - jup3.x, cal3.y - jup3.y);
    expect(Math.hypot(jL1_3.x - jup3.x, jL1_3.y - jup3.y)).toBeGreaterThan(calDist * 1.8);
    expect(Math.hypot(jL2_3.x - jup3.x, jL2_3.y - jup3.y)).toBeGreaterThan(calDist * 1.8);

    const merc3 = viewport.computeBodyPosition(mercury, allWithJup);
    const mL1_3 = viewport.computeBodyPosition(mercL1, allWithJup);
    const mL2_3 = viewport.computeBodyPosition(mercL2, allWithJup);
    expect(Math.hypot(mL1_3.x - merc3.x, mL1_3.y - merc3.y)).toBeGreaterThanOrEqual(35);
    expect(Math.hypot(mL2_3.x - merc3.x, mL2_3.y - merc3.y)).toBeGreaterThanOrEqual(35);

    // Kometen-Ellipsen müssen anhand LPE (aus LAN & AOP) in unterschiedliche Richtungen gedreht sein
    const makeComet = (id: string, lpe: number, ecc = 0.7): CelestialBody => ({
      ...makeBody(id, 'comet', 210),
      parentId: 'sun',
      distanceFromSunAu: 18,
      orbitalElements: {
        ...baseOe,
        ecc: { ...baseOe.ecc, numericValue: ecc },
        lpe: { ...baseOe.lpe, numericValue: lpe },
      },
    });
    const halley = makeComet('halley', 307.09, 0.967);
    const churyumov = makeComet('churyumov', 62.92, 0.641);
    const haleBopp = makeComet('hale-bopp', 149.3, 0.995);
    const halleyPos = viewport.computeBodyPosition(halley, [bodies[0], halley]);
    const churyPos = viewport.computeBodyPosition(churyumov, [bodies[0], churyumov]);
    const halePos = viewport.computeBodyPosition(haleBopp, [bodies[0], haleBopp]);
    expect(halleyPos.orbitRotationDeg).toBeCloseTo(-307.09, 1);
    expect(churyPos.orbitRotationDeg).toBeCloseTo(-62.92, 1);
    expect(halePos.orbitRotationDeg).toBeCloseTo(-149.3, 1);
    expect(churyPos.orbitCenterX).not.toBeCloseTo(halePos.orbitCenterX, 1);

    // Komet NEOWISE (C/2020 F3): hohe Exzentrizität (0.999176), 2020-07-03 im Perihel (0.295 AE) und 2026-11-19 zwischen Saturn & Uranus (~18.95 AE)
    const neowise: CelestialBody = {
      ...makeComet('neowise', 23.73, 0.999176),
      distanceFromSunAu: 358,
      orbitalPeriodDays: 2471280,
      inclinationToSolarEquatorDeg: 128.94,
      overviewOrbitRadiusSvg: 415,
      orbitalElements: {
        ...baseOe,
        sma: { ...baseOe.sma, numericValue: 358 },
        ecc: { ...baseOe.ecc, numericValue: 0.999176 },
        inc: { ...baseOe.inc, numericValue: 128.94 },
        lan: { ...baseOe.lan, numericValue: 61.01 },
        aop: { code: 'AOP' as const, label: 'AOP', formattedValue: '37.28°', numericValue: 37.28, childExplanation: '' },
        lpe: { ...baseOe.lpe, numericValue: 23.73 },
        mna: { ...baseOe.mna, numericValue: 358.909 },
      },
    };
    const sunOnly = [bodies[0], neowise];
    const sunOv = viewport.computeBodyPosition(bodies[0], sunOnly);

    viewport.setSimulationDateIso('2020-07-03');
    viewport.setViewMode('overview');
    const neoPeriOv = viewport.computeBodyPosition(neowise, sunOnly);
    expect(neoPeriOv.liveDistanceAu).toBeLessThan(0.4);
    expect(Math.hypot(neoPeriOv.x, neoPeriOv.y)).toBeGreaterThan(sunOv.bodyRadiusPx + 3);

    viewport.setViewMode('true-scale');
    const sunTs = viewport.computeBodyPosition(bodies[0], sunOnly);
    const neoPeriTs = viewport.computeBodyPosition(neowise, sunOnly);
    expect(neoPeriTs.liveDistanceAu).toBeLessThan(0.4);
    expect(Math.hypot(neoPeriTs.x, neoPeriTs.y)).toBeGreaterThan(sunTs.bodyRadiusPx + 3);

    viewport.setSimulationDateIso('2026-11-19');
    const neoNowTs = viewport.computeBodyPosition(neowise, sunOnly);
    expect(neoNowTs.liveDistanceAu).toBeGreaterThan(9.58);
    expect(neoNowTs.liveDistanceAu).toBeLessThan(19.2);
    expect(Math.hypot(neoNowTs.worldX, neoNowTs.worldY)).toBeGreaterThan(170);

    viewport.setViewMode('overview');
    const neoNowOv = viewport.computeBodyPosition(neowise, sunOnly);
    const ovDistSun = Math.hypot(neoNowOv.x, neoNowOv.y);
    expect(ovDistSun).toBeGreaterThan(330);
    expect(ovDistSun).toBeLessThan(355);

    viewport.resetToRealTimeNow();
    viewport.setViewMode('overview');
    viewport.setZoom(1.0);
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
    expect(quizService.isNewPersonalRecord()).toBe(true);
    expect(quizService.childPraiseSummary().badge).toContain('Sternen-Kapitän');
  });

  it('ExplorerProgressService should persist discovered bodies and best quiz scores in localStorage', () => {
    const progress = TestBed.inject(ExplorerProgressService);

    expect(progress.discoveredCount()).toBe(0);
    progress.markBodyDiscovered('earth');
    progress.markBodyDiscovered('earth');
    progress.markBodyDiscovered('mars');
    expect(progress.discoveredCount()).toBe(2);
    expect(progress.isBodyDiscovered('earth')).toBe(true);

    expect(progress.recordQuizScore('missions', 3, 5)).toBe(true);
    expect(progress.getBestScore('missions')?.correct).toBe(3);

    // Niedrigeres Ergebnis überschreibt den Bestwert nicht
    expect(progress.recordQuizScore('missions', 2, 5)).toBe(false);
    expect(progress.getBestScore('missions')?.correct).toBe(3);

    // Höheres Ergebnis wird als neuer Rekord gespeichert
    expect(progress.recordQuizScore('missions', 4, 5)).toBe(true);
    expect(progress.getBestScore('missions')?.correct).toBe(4);

    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('ssi_app_discovered_bodies_v1')).toContain('mars');
      expect(localStorage.getItem('ssi_app_quiz_best_scores_v1')).toContain('"correct":4');
    }

    progress.resetProgress();
    expect(progress.discoveredCount()).toBe(0);
    expect(progress.getBestScore('missions')).toBeNull();
  });

  it('MissionDataService should support text search and chronological timeline sorting (1957 -> heute)', async () => {
    const missionService = TestBed.inject(MissionDataService);
    const httpMock = TestBed.inject(HttpTestingController);

    const sampleMissions: ResearchMission[] = [
      {
        id: 'tiangong',
        title: 'Chinesische Raumstation Tiangong',
        subtitle: 'Himmelspalast',
        category: 'space-station',
        categoryLabel: 'Raumstationen',
        targetBodyId: 'tiangong',
        targetBodyName: 'Tiangong',
        agency: 'CNSA',
        launchYear: 'Seit April 2021 im Bau',
        statusLabel: 'Aktiv',
        wikimediaImageUrl: '',
        imageUrl: 'assets/images/iss.svg',
        imageCredit: 'CMSA',
        childSummary: 'Moderne Raumstation im Erdorbit.',
        tasksForKids: ['Forschung'],
        wikipediaUrl: 'https://de.wikipedia.org/wiki/Tiangong',
      },
      {
        id: 'gemini-4',
        title: 'Gemini 4',
        subtitle: 'Erster US-EVA',
        category: 'crewed-mission',
        categoryLabel: 'Bemannte Missionen',
        targetBodyId: 'earth',
        targetBodyName: 'Erde',
        agency: 'NASA',
        launchYear: '1965',
        statusLabel: 'Abgeschlossen',
        wikimediaImageUrl: '',
        imageUrl: 'assets/images/probe.svg',
        imageCredit: 'NASA',
        childSummary: 'Vorbereitung für Apollo.',
        tasksForKids: ['Weltraumspaziergang'],
        wikipediaUrl: 'https://de.wikipedia.org/wiki/Gemini_4',
      },
      {
        id: 'spacelab-columbus',
        title: 'Spacelab & Columbus',
        subtitle: 'Europas Weltraumlabore',
        category: 'space-station',
        categoryLabel: 'Raumstationen',
        targetBodyId: 'iss',
        targetBodyName: 'ISS',
        agency: 'ESA / DLR',
        launchYear: '1983 (Spacelab) & 2008 (Columbus)',
        statusLabel: 'Aktiv',
        wikimediaImageUrl: '',
        imageUrl: 'assets/images/iss.svg',
        imageCredit: 'ESA',
        childSummary: 'Europäische Forschung im Orbit.',
        tasksForKids: ['Experimente'],
        wikipediaUrl: 'https://de.wikipedia.org/wiki/Columbus_(Raumlabor)',
      },
    ];

    const loadPromise = missionService.loadMissions();
    httpMock.expectOne('assets/data/missions.json').flush(sampleMissions);
    await loadPromise;

    expect(missionService.extractLaunchYear('1983 (Spacelab) & 2008 (Columbus)')).toBe(1983);
    expect(missionService.extractLaunchYear('Seit April 2021 im Bau')).toBe(2021);

    missionService.setSortMode('timeline');
    expect(missionService.filteredMissions().map((m) => m.id)).toEqual([
      'gemini-4',
      'spacelab-columbus',
      'tiangong',
    ]);

    missionService.setSearchQuery('DLR');
    expect(missionService.filteredMissions().map((m) => m.id)).toEqual(['spacelab-columbus']);

    missionService.resetFilters();
    expect(missionService.filteredMissions().length).toBe(3);
    expect(missionService.sortMode()).toBe('category');
  });
});
