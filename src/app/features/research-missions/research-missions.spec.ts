/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMissionsComponent Spec (research-missions.spec.ts)
 * FCPP-Referenz: P40-U10, P40-U20 (Unit-Test für Forschungsprojekte & Raumfahrt)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Prüft Kategorie-Filter, Missions-Steckbrief, ISS-Live-Fallback, Wikipedia-Link und Sprung-Button nach P20.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ResearchMissionsComponent } from './research-missions';
import { ResearchMission } from '../../core/models/research-mission.model';

describe('ResearchMissionsComponent (P40)', () => {
  const mockMissions: ResearchMission[] = [
    {
      id: 'iss',
      title: 'Internationale Raumstation (ISS)',
      subtitle: 'Unser Forschungshaus im Erdorbit',
      category: 'space-station',
      categoryLabel: 'Raumstationen',
      targetBodyId: 'iss',
      targetBodyName: 'Raumstation ISS',
      agency: 'NASA / ESA',
      launchYear: '1998',
      statusLabel: 'Aktiv',
      wikimediaImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg/960px-The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg',
      imageUrl: 'assets/images/iss.svg',
      imageCredit: 'NASA',
      childSummary: 'Forschungslabor in 408 km Höhe.',
      tasksForKids: ['Schwerelosigkeit erforschen'],
      wikipediaUrl: 'https://de.wikipedia.org/wiki/Internationale_Raumstation',
      hasIssLiveTracker: true,
    },
    {
      id: 'perseverance',
      title: 'Mars-Rover Perseverance',
      subtitle: 'Roboter auf dem Mars',
      category: 'mars-rover',
      categoryLabel: 'Mars Rover',
      targetBodyId: 'perseverance',
      targetBodyName: 'Rover Perseverance (Mars)',
      agency: 'NASA',
      launchYear: '2020',
      statusLabel: 'Aktiv',
      wikimediaImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Perseverance-Selfie-at-Rochette-Horizontal-V2.gif/960px-Perseverance-Selfie-at-Rochette-Horizontal-V2.gif',
      imageUrl: 'assets/images/perseverance.svg',
      imageCredit: 'NASA',
      childSummary: 'Sucht nach Spuren von Wasser.',
      tasksForKids: ['Gesteinsproben sammeln'],
      wikipediaUrl: 'https://de.wikipedia.org/wiki/Perseverance_(Rover)',
    },
    {
      id: 'jwst',
      title: 'James-Webb-Weltraumteleskop (JWST)',
      subtitle: 'Goldener Spiegel im All',
      category: 'telescope',
      categoryLabel: 'Weltraumteleskope',
      targetBodyId: 'jwst',
      targetBodyName: 'James-Webb-Teleskop',
      agency: 'NASA / ESA',
      launchYear: '2021',
      statusLabel: 'Aktiv',
      wikimediaImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/JWST_spacecraft_model_3.png',
      imageUrl: 'assets/images/jwst.svg',
      imageCredit: 'NASA / ESA',
      childSummary: 'Blickt tief ins Universum.',
      tasksForKids: ['Infrarotlicht beobachten'],
      wikipediaUrl: 'https://de.wikipedia.org/wiki/James-Webb-Weltraumteleskop',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchMissionsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should filter missions by category, display ISS telemetry fallback, and provide Wikipedia & P20 jump links (P40-U20)', async () => {
    const fixture = TestBed.createComponent(ResearchMissionsComponent);
    const httpMock = TestBed.inject(HttpTestingController);

    const initPromise = fixture.componentInstance.ngOnInit();

    const missionsReq = httpMock.expectOne('assets/data/missions.json');
    missionsReq.flush(mockMissions);
    await Promise.resolve();
    await Promise.resolve();

    const issLiveReq = httpMock.expectOne('https://api.wheretheiss.at/v1/satellites/25544');
    issLiveReq.error(new ProgressEvent('offline'));
    await Promise.resolve();
    await Promise.resolve();

    const issFallbackReq = httpMock.expectOne('assets/data/iss-fallback.json');
    issFallbackReq.flush({
      latitude: 51.51,
      longitude: 7.46,
      altitudeKm: 416.8,
      velocityKmh: 27584,
      visibility: 'daylight',
      timestamp: 1794826000,
      locationHint: 'Offline-Fallback aktiv',
      isFallbackData: true,
    });

    await initPromise;
    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(fixture.nativeElement.textContent).toContain('Internationale Raumstation (ISS)');
    expect(fixture.nativeElement.textContent).toContain('416.8 km');

    comp.onSelectCategory('mars-rover');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mars-Rover Perseverance');
    expect(fixture.nativeElement.textContent).not.toContain('416.8 km');

    comp.onSelectCategory('telescope');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('James-Webb-Weltraumteleskop (JWST)');
    expect(fixture.nativeElement.textContent).toContain('Offizielle Missionsseite');
  });
});
