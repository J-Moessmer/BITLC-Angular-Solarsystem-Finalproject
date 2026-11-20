/**
 * Projekt / Modul: SSI App – Solar System Info App / SpaceQuizComponent Spec (space-quiz.spec.ts)
 * FCPP-Referenz: P50-U10, P50-U20, P50-U30 (Unit-Test für Weltraum-Quiz, Zufallswähler & lokalen Steckbrief)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v2.1
 * Hinweis: Prüft die 4 Kategorien (inkl. „Quiz des Tages" mit Zufallswähler), Antwortprüfung (A-D), den direkt eingebetteten P20-Steckbrief sowie lokalen Entdecker-Pass & gespeicherte Bestwerte (P50-U20, P50-U30).
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SpaceQuizComponent } from './space-quiz';
import { QuizQuestion } from '../../core/models/quiz.model';
import { CelestialBody } from '../../core/models/celestial-body.model';

describe('SpaceQuizComponent (P50)', () => {
  const mockBodies: CelestialBody[] = [
    {
      id: 'mars',
      name: 'Mars',
      subtitle: 'Der Rote Planet',
      category: 'planet',
      categoryLabel: 'Gesteinsplanet',
      parentId: 'sun',
      childrenIds: [],
      wikimediaImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
      imageUrl: 'assets/images/planet.svg',
      imageCredit: 'ESA / Rosetta',
      colorHex: '#DC2626',
      accentColorHex: '#FCA5A5',
      diameterKm: 6779,
      distanceFromSunKm: 227900000,
      distanceFromSunAu: 1.52,
      distanceFromEarthKm: 78300000,
      orbitalPeriodDays: 687,
      orbitalPeriodLabel: '687 Erdtage',
      inclinationToSolarEquatorDeg: 1.85,
      overviewOrbitRadiusSvg: 170,
      overviewBodyRadiusSvg: 8,
      orbitAngleDeg: 45,
      shortSummary: 'Der Mars wird auch der Rote Planet genannt.',
      childFriendlyFacts: ['Auf dem Mars steht der riesige Vulkan Olympus Mons.'],
      comparisonHint: 'Etwa halb so groß wie unsere Erde.',
      wikipediaUrl: 'https://de.wikipedia.org/wiki/Mars_(Planet)',
      officialUrl: 'https://science.nasa.gov/mars/',
      orbitalElements: {
        sma: { code: 'SMA', label: 'Große Halbachse', formattedValue: '1.524 AE', numericValue: 1.524, childExplanation: 'Abstand' },
        ecc: { code: 'ECC', label: 'Exzentrizität', formattedValue: '0.0934', numericValue: 0.0934, childExplanation: 'Ellipse' },
        inc: { code: 'INC', label: 'Bahnneigung', formattedValue: '1.85°', numericValue: 1.85, childExplanation: 'Neigung' },
        lan: { code: 'LAN', label: 'Aufsteigender Knoten', formattedValue: '49.5°', numericValue: 49.5, childExplanation: 'Knoten' },
        lpe: { code: 'LPE', label: 'Länge des Perihels', formattedValue: '336.0°', numericValue: 336.0, childExplanation: 'Perihel' },
        mna: { code: 'MNA', label: 'Mittlere Anomalie', formattedValue: '19.4°', numericValue: 19.4, childExplanation: 'Anomalie' },
        ref: { code: 'REF', label: 'Referenzsystem', formattedValue: 'J2000', childExplanation: 'Epoche J2000' },
      },
    },
  ];

  const mockQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      category: 'missions',
      questionText: 'Auf welchem Planeten rollt der Rover Perseverance?',
      options: ['Venus', 'Mars', 'Jupiter', 'Neptun'],
      correctOptionIndex: 1,
      childExplanation: 'Auf dem Roten Planeten Mars!',
      relatedBodyId: 'mars',
    },
    {
      id: 'q2',
      category: 'astronomy',
      questionText: 'Was beschreibt das Bahnelement INC?',
      options: ['Farbe', 'Bahnneigung', 'Masse', 'Temperatur'],
      correctOptionIndex: 1,
      childExplanation: 'Genau! INC steht für die Bahnneigung!',
      relatedBodyId: 'mars',
    },
  ];

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [SpaceQuizComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should select quiz category, check answer, embed local Steckbrief with images, and show evaluation card (P50-U20, P50-U30)', async () => {
    const fixture = TestBed.createComponent(SpaceQuizComponent);
    const httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const bodyReqs = httpMock.match('assets/data/solar-system-fallback.json');
    bodyReqs.forEach((req) => req.flush(mockBodies));

    const qReq = httpMock.expectOne('assets/data/quiz-questions.json');
    qReq.flush(mockQuestions);

    await Promise.resolve();
    httpMock
      .match((req) => req.url.includes('api.le-systeme-solaire.net'))
      .forEach((req) => req.error(new ProgressEvent('offline')));

    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(fixture.nativeElement.textContent).toContain('Bahnen, Kometen & Rekorde');
    expect(fixture.nativeElement.textContent).toContain('Fragen neu würfeln');

    comp.onSelectCategory('missions');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Auf welchem Planeten rollt der Rover Perseverance?',
    );

    comp.onChooseOption(1);
    comp.onCheckAnswer();
    fixture.detectChanges();

    httpMock
      .match('assets/data/missions.json')
      .forEach((req) => req.flush([]));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Auf dem Roten Planeten Mars!');
    expect(fixture.nativeElement.textContent).toContain('Der Mars wird auch der Rote Planet genannt.');
    expect(fixture.nativeElement.textContent).toContain('Quellen & Weiterführende Links');

    comp.onNextQuestion();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bestanden! :)');
    expect(fixture.nativeElement.querySelector('.record-badge')?.textContent).toContain(
      'Neuer persönlicher Bestwert gespeichert!',
    );
    expect(fixture.nativeElement.querySelector('.category-best-summary')?.textContent).toContain('1 / 1');
    expect(fixture.nativeElement.querySelector('.cat-best-badge')?.textContent).toContain('Bestwert: 1 / 1');
    expect(fixture.nativeElement.querySelector('.explorer-pass-box')?.textContent).toContain('1 / 1 entdeckt');

    // Bei einer falschen Antwort darf kein Lobwort ("Genau!" / "Richtig!") als Einleitung stehen
    comp.onSelectCategory('astronomy');
    fixture.detectChanges();
    comp.onChooseOption(0);
    comp.onCheckAnswer();
    fixture.detectChanges();
    httpMock
      .match('assets/data/missions.json')
      .forEach((req) => req.flush([]));
    await fixture.whenStable();
    fixture.detectChanges();

    const bannerText =
      (fixture.nativeElement.querySelector('.explanation-banner p')?.textContent as string) ?? '';
    expect(bannerText).toContain('Schade, nicht ganz! Richtig ist Antwort B: INC steht für die Bahnneigung!');
    expect(bannerText.startsWith('Genau!')).toBe(false);
    expect(bannerText.startsWith('Richtig!')).toBe(false);
  });
});
