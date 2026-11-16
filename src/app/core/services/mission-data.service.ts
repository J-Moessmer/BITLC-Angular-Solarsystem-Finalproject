/**
 * Projekt / Modul: SSI App – Solar System Info App / MissionDataService (mission-data.service.ts)
 * FCPP-Referenz: P40-U10, P40-U20 (Forschungsprojekte, Kategorie-Filter & ISS-Live-API mit Fallback)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Service für die Raumfahrtmissionen (Mars Rover, JWST, Gaia, ISS, Artemis) sowie den Live-Status der ISS über api.wheretheiss.at mit lokalem JSON-Fallback (assets/data/iss-fallback.json) mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import {
  IssLiveStatus,
  MissionCategory,
  ResearchMission,
} from '../models/research-mission.model';

interface WhereTheIssApiResponse {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class MissionDataService {
  private readonly http = inject(HttpClient);

  /** Relative Pfade für GitHub Pages (--base-href kompatibel) */
  private readonly missionsUrl = 'assets/data/missions.json';
  private readonly issFallbackUrl = 'assets/data/iss-fallback.json';
  private readonly issLiveApiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';

  private readonly missionsState = signal<ResearchMission[]>([]);
  private readonly selectedCategoryState = signal<MissionCategory>('all');
  private readonly selectedMissionIdState = signal<string | null>(null);
  private readonly issStatusState = signal<IssLiveStatus | null>(null);

  readonly missions = this.missionsState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();
  readonly selectedMissionId = this.selectedMissionIdState.asReadonly();
  readonly issStatus = this.issStatusState.asReadonly();

  /** Gefilterte Missionskarten nach gewählter Kategorie (P40-A20 / P40-U20) */
  readonly filteredMissions = computed<ResearchMission[]>(() => {
    const category = this.selectedCategoryState();
    const all = this.missionsState();
    if (category === 'all') {
      return all;
    }
    return all.filter((m) => m.category === category);
  });

  /** Aktuell für den Detail-Steckbrief ausgewählte Mission (P40-A30 / P40-U20) */
  readonly selectedMission = computed<ResearchMission | null>(() => {
    const id = this.selectedMissionIdState();
    const list = this.filteredMissions();
    if (id) {
      const match = list.find((m) => m.id === id) ?? this.missionsState().find((m) => m.id === id);
      if (match) {
        return match;
      }
    }
    return list[0] ?? null;
  });

  async loadMissions(): Promise<ResearchMission[]> {
    if (this.missionsState().length === 0) {
      const data = await firstValueFrom(
        this.http
          .get<ResearchMission[]>(this.missionsUrl)
          .pipe(catchError(() => of([] as ResearchMission[]))),
      );
      this.missionsState.set(data);
      if (data.length > 0 && !this.selectedMissionIdState()) {
        this.selectedMissionIdState.set(data[0].id);
      }
    }
    return this.missionsState();
  }

  /**
   * KI-generierter Block: Fragt die Live-Position der ISS über HTTPS-API ab
   * und nutzt bei Offline-Betrieb oder Fehler automatisch assets/data/iss-fallback.json (P40-U20).
   */
  async refreshIssLiveStatus(): Promise<IssLiveStatus> {
    const live = await firstValueFrom(
      this.http.get<WhereTheIssApiResponse>(this.issLiveApiUrl).pipe(
        timeout(2500),
        catchError(() => of(null)),
      ),
    );

    if (live && typeof live.latitude === 'number') {
      const status: IssLiveStatus = {
        latitude: Number(live.latitude.toFixed(4)),
        longitude: Number(live.longitude.toFixed(4)),
        altitudeKm: Number(live.altitude.toFixed(1)),
        velocityKmh: Math.round(live.velocity),
        visibility: live.visibility,
        timestamp: live.timestamp,
        locationHint: 'Live-Empfang von Satelliten-Telemetrie (WhereTheISS.at)',
        isFallbackData: false,
      };
      this.issStatusState.set(status);
      return status;
    }

    const fallback = await firstValueFrom(
      this.http.get<IssLiveStatus>(this.issFallbackUrl).pipe(
        catchError(() =>
          of({
            latitude: 51.5136,
            longitude: 7.4653,
            altitudeKm: 416.8,
            velocityKmh: 27584,
            visibility: 'daylight',
            timestamp: 1794826000,
            locationHint: 'Überflug Europa / Dortmund (Lokaler Offline-Fallback aktiv)',
            isFallbackData: true,
          } satisfies IssLiveStatus),
        ),
      ),
    );

    this.issStatusState.set(fallback);
    return fallback;
  }

  setCategory(category: MissionCategory): void {
    this.selectedCategoryState.set(category);
    const filtered = this.filteredMissions();
    if (filtered.length > 0) {
      this.selectedMissionIdState.set(filtered[0].id);
    }
  }

  selectMission(missionId: string): void {
    this.selectedMissionIdState.set(missionId);
  }
}
