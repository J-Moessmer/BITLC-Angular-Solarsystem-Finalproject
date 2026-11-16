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
