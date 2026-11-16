/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMissionsComponent (research-missions.ts)
 * FCPP-Referenz: P40-U10 (A10), P40-U20 (A20, A30 – Forschungsprojekte, ISS-Live-API mit Fallback & Sprung nach P20)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Bereinigte Kategorien-Bezeichnungen ohne redundante Klammer-Aufzählungen.
 */

import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MissionDataService } from '../../core/services/mission-data.service';
import { MissionCategory } from '../../core/models/research-mission.model';

export interface CategoryFilterChip {
  id: MissionCategory;
  label: string;
}

@Component({
  selector: 'app-research-missions',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './research-missions.html',
  styleUrl: './research-missions.css',
})
export class ResearchMissionsComponent implements OnInit {
  protected readonly missionService = inject(MissionDataService);

  readonly activeImageSrc = signal<string>('');
  readonly isRefreshingIss = signal<boolean>(false);

  readonly categoryFilters: readonly CategoryFilterChip[] = [
    { id: 'all', label: 'Alle Projekte' },
    { id: 'solar-probe', label: 'Sonnensonden' },
    { id: 'mars-rover', label: 'Mars Rover' },
    { id: 'deep-space', label: 'Äußere Raumsonden' },
    { id: 'telescope', label: 'Weltraumteleskope' },
    { id: 'space-station', label: 'Raumstationen' },
    { id: 'moon-mission', label: 'Mondflüge' },
  ];

  constructor() {
    effect(() => {
      const current = this.missionService.selectedMission();
      if (current) {
        this.activeImageSrc.set(current.wikimediaImageUrl || current.imageUrl);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.missionService.loadMissions();
    await this.refreshIssTelemetry();
  }

  onSelectCategory(category: MissionCategory): void {
    this.missionService.setCategory(category);
  }

  onSelectMission(missionId: string): void {
    this.missionService.selectMission(missionId);
  }

  onImageError(localFallbackUrl: string): void {
    if (this.activeImageSrc() !== localFallbackUrl) {
      this.activeImageSrc.set(localFallbackUrl);
    }
  }

  async refreshIssTelemetry(): Promise<void> {
    this.isRefreshingIss.set(true);
    try {
      await this.missionService.refreshIssLiveStatus();
    } finally {
      this.isRefreshingIss.set(false);
    }
  }
}
