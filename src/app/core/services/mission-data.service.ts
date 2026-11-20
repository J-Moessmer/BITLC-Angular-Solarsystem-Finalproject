/**
 * Projekt / Modul: SSI App – Solar System Info App / MissionDataService (mission-data.service.ts)
 * FCPP-Referenz: P40-U10, P40-U20 (Forschungsprojekte, Kategorie-Filter & ISS-Live-API mit Fallback)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v1.1
 * Hinweis: Service für die Raumfahrtmissionen inkl. Textsuche, Kategoriefilter, chronologischer Zeitstrahl-Sortierung (1957 -> heute) sowie Live-Status der ISS über api.wheretheiss.at mit lokalem JSON-Fallback (assets/data/iss-fallback.json).
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import {
  IssLiveStatus,
  MissionCategory,
  ResearchMission,
} from '../models/research-mission.model';

export type MissionSortMode = 'category' | 'timeline';

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
  private readonly searchQueryState = signal<string>('');
  private readonly sortModeState = signal<MissionSortMode>('category');
  private readonly selectedMissionIdState = signal<string | null>(null);
  private readonly issStatusState = signal<IssLiveStatus | null>(null);

  readonly missions = this.missionsState.asReadonly();
  readonly selectedCategory = this.selectedCategoryState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();
  readonly sortMode = this.sortModeState.asReadonly();
  readonly selectedMissionId = this.selectedMissionIdState.asReadonly();
  readonly issStatus = this.issStatusState.asReadonly();

  /** Extrahiert das früheste vierstellige Startjahr (1957..heute) für die chronologische Zeitstrahl-Sortierung */
  extractLaunchYear(launchYear: string): number {
    const match = /(19|20)\d{2}/.exec(launchYear ?? '');
    return match ? Number(match[0]) : 9999;
  }

  /** Gefilterte und sortierte Missionskarten nach Kategorie, Textsuche und Sortiermodus (P40-A20 / P40-U20) */
  readonly filteredMissions = computed<ResearchMission[]>(() => {
    const category = this.selectedCategoryState();
    const query = this.searchQueryState().trim().toLowerCase();
    const sortMode = this.sortModeState();
    const all = this.missionsState();

    const normalize = (cat: string): string => {
      if (cat === 'rover') {
        return 'mars-rover';
      }
      if (cat === 'solar-probe' || cat === 'deep-space') {
        return 'probe';
      }
      return cat;
    };

    const normalizedTarget = normalize(category);
    let matches =
      category === 'all'
        ? all
        : all.filter((m) => {
            const primary = normalize(m.category);
            const extras = (m.categories ?? []).map((c) => normalize(c));
            return (
              primary === normalizedTarget ||
              m.category === category ||
              extras.includes(normalizedTarget) ||
              (m.categories ?? []).includes(category)
            );
          });

    if (query.length > 0) {
      matches = matches.filter((m) => {
        const haystack = [
          m.title,
          m.subtitle,
          m.agency,
          m.targetBodyName,
          m.launchYear,
          m.categoryLabel,
          m.statusLabel,
          m.childSummary,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (sortMode === 'timeline') {
      return [...matches].sort(
        (a, b) => this.extractLaunchYear(a.launchYear) - this.extractLaunchYear(b.launchYear),
      );
    }

    if (category === 'all') {
      return matches;
    }

    return [...matches].sort((a, b) => {
      const aPrimary = normalize(a.category) === normalizedTarget ? 0 : 1;
      const bPrimary = normalize(b.category) === normalizedTarget ? 0 : 1;
      return aPrimary - bPrimary;
    });
  });

  /** Aktuell für den Detail-Steckbrief ausgewählte Mission (P40-A30 / P40-U20) */
  readonly selectedMission = computed<ResearchMission | null>(() => {
    const id = this.selectedMissionIdState();
    const list = this.filteredMissions();
    if (list.length === 0) {
      return null;
    }
    if (id) {
      const match = list.find((m) => m.id === id);
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
    this.selectedMissionIdState.set(filtered.length > 0 ? filtered[0].id : null);
  }

  setSearchQuery(query: string): void {
    this.searchQueryState.set(query);
    const filtered = this.filteredMissions();
    const currentId = this.selectedMissionIdState();
    if (filtered.length === 0) {
      this.selectedMissionIdState.set(null);
    } else if (!currentId || !filtered.some((m) => m.id === currentId)) {
      this.selectedMissionIdState.set(filtered[0].id);
    }
  }

  setSortMode(mode: MissionSortMode): void {
    this.sortModeState.set(mode);
    const filtered = this.filteredMissions();
    const currentId = this.selectedMissionIdState();
    if (filtered.length > 0 && (!currentId || !filtered.some((m) => m.id === currentId))) {
      this.selectedMissionIdState.set(filtered[0].id);
    }
  }

  resetFilters(): void {
    this.selectedCategoryState.set('all');
    this.searchQueryState.set('');
    this.sortModeState.set('category');
    const filtered = this.filteredMissions();
    this.selectedMissionIdState.set(filtered.length > 0 ? filtered[0].id : null);
  }

  selectMission(missionId: string): void {
    this.selectedMissionIdState.set(missionId);
  }
}
