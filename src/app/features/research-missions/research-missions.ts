/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMissionsComponent (research-missions.ts)
 * FCPP-Referenz: P40-U10 (A10), P40-U20 (A20, A30 – Forschungsprojekte, ISS-Live-API mit Fallback & Sprung nach P20)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Bereinigte Kategorien-Bezeichnungen ohne redundante Klammer-Aufzählungen.
 */

import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MissionDataService } from '../../core/services/mission-data.service';
import { MissionCategory } from '../../core/models/research-mission.model';
import { ImageLightboxComponent } from '../../shared/components/image-lightbox/image-lightbox';
import { GlossaryTermComponent } from '../../shared/components/glossary-term/glossary-term';
import { IssWorldMapComponent } from './iss-world-map/iss-world-map';
import { buildMissionGallery, GalleryMediaItem } from '../../core/data/media-gallery.data';

export interface CategoryFilterChip {
  id: MissionCategory;
  label: string;
}

@Component({
  selector: 'app-research-missions',
  imports: [
    DecimalPipe,
    RouterLink,
    ImageLightboxComponent,
    GlossaryTermComponent,
    IssWorldMapComponent,
  ],
  templateUrl: './research-missions.html',
  styleUrl: './research-missions.css',
})
export class ResearchMissionsComponent implements OnInit, OnDestroy {
  protected readonly missionService = inject(MissionDataService);
  private readonly route = inject(ActivatedRoute);

  readonly activeImageSrc = signal<string>('');
  readonly isRefreshingIss = signal<boolean>(false);
  readonly isLightboxOpen = signal<boolean>(false);
  readonly isHeroImageHidden = signal<boolean>(false);
  readonly issAutoRefreshEnabled = signal<boolean>(true);
  private issPollTimerId: ReturnType<typeof setInterval> | null = null;

  readonly missionGalleryItems = computed<GalleryMediaItem[]>(() => {
    const m = this.missionService.selectedMission();
    if (!m) {
      return [];
    }
    return buildMissionGallery(m);
  });

  readonly activeImageCaption = computed<string>(() => {
    const src = this.activeImageSrc();
    const match = this.missionGalleryItems().find((item) => item.url === src);
    return match?.caption ?? this.missionService.selectedMission()?.title ?? '';
  });

  readonly categoryFilters: readonly CategoryFilterChip[] = [
    { id: 'all', label: 'Alle Projekte' },
    { id: 'probe', label: 'Sonden' },
    { id: 'mars-rover', label: 'Rover' },
    { id: 'telescope', label: 'Teleskope' },
    { id: 'space-station', label: 'Raumstationen' },
    { id: 'moon-mission', label: 'Mondflüge' },
    { id: 'crewed-mission', label: 'Bemannte Missionen' },
  ];

  constructor() {
    effect(() => {
      const current = this.missionService.selectedMission();
      if (current) {
        const hasRealPhoto = Boolean(current.wikimediaImageUrl);
        this.isHeroImageHidden.set(!hasRealPhoto);
        this.activeImageSrc.set(current.wikimediaImageUrl || '');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.missionService.loadMissions();
    const targetMissionId = this.route.snapshot.queryParamMap.get('mission');
    if (targetMissionId) {
      this.missionService.setCategory('all');
      this.missionService.selectMission(targetMissionId);
    }
    await this.refreshIssTelemetry();
    this.startIssAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopIssAutoRefresh();
  }

  toggleIssAutoRefresh(): void {
    const next = !this.issAutoRefreshEnabled();
    this.issAutoRefreshEnabled.set(next);
    if (next) {
      this.startIssAutoRefresh();
    } else {
      this.stopIssAutoRefresh();
    }
  }

  private startIssAutoRefresh(): void {
    this.stopIssAutoRefresh();
    this.issPollTimerId = setInterval(() => {
      if (
        this.issAutoRefreshEnabled() &&
        this.missionService.selectedMission()?.hasIssLiveTracker &&
        !this.isRefreshingIss()
      ) {
        void this.refreshIssTelemetry();
      }
    }, 5000);
  }

  private stopIssAutoRefresh(): void {
    if (this.issPollTimerId !== null) {
      clearInterval(this.issPollTimerId);
      this.issPollTimerId = null;
    }
  }

  onThumbnailError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.style.display = 'none';
    }
  }

  onGalleryThumbError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    const btn = img?.closest('button') as HTMLElement | null;
    if (btn) {
      btn.style.display = 'none';
    }
  }

  selectGalleryPhoto(url: string): void {
    this.isHeroImageHidden.set(false);
    this.activeImageSrc.set(url);
  }

  onSelectCategory(category: MissionCategory): void {
    this.missionService.setCategory(category);
  }

  onSelectMission(missionId: string): void {
    this.missionService.selectMission(missionId);
  }

  onImageError(): void {
    this.isHeroImageHidden.set(true);
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
