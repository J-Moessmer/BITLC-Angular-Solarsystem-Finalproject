/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMissionsComponent (research-missions.ts)
 * FCPP-Referenz: P40-U10 (A10), P40-U20 (A20, A30 – Forschungsprojekte, ISS-Live-API mit Fallback & Sprung nach P20)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Bereinigte Kategorien-Bezeichnungen ohne redundante Klammer-Aufzählungen.
 */

import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MissionDataService } from '../../core/services/mission-data.service';
import { MissionCategory } from '../../core/models/research-mission.model';
import { ImageLightboxComponent } from '../../shared/components/image-lightbox/image-lightbox';
import { GlossaryTermComponent } from '../../shared/components/glossary-term/glossary-term';
import { IssWorldMapComponent } from './iss-world-map/iss-world-map';

const EXTRA_MISSION_GALLERY: Readonly<Record<string, Array<{ url: string; caption: string }>>> = {
  iss: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/ISS-40_Cupola_view_of_the_Earth.jpg/960px-ISS-40_Cupola_view_of_the_Earth.jpg',
      caption: 'Blick aus der ISS-Kuppel auf die Erde',
    },
  ],
  'apollo-11': [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Apollo_11_bootprint.jpg/960px-Apollo_11_bootprint.jpg',
      caption: 'Berühmter Fußabdruck im Mondstaub',
    },
  ],
  perseverance: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/PIA24647-MarsIngenuityHelicopter-PerseveranceRover-Selfie-20210406.jpg/960px-PIA24647-MarsIngenuityHelicopter-PerseveranceRover-Selfie-20210406.jpg',
      caption: 'Perseverance zusammen mit Mars-Hubschrauber Ingenuity',
    },
  ],
  jwst: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Webb%27s_First_Deep_Field.jpg/960px-Webb%27s_First_Deep_Field.jpg',
      caption: 'Erstes Deep-Field-Foto des James-Webb-Teleskops',
    },
  ],
  hubble: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/960px-HST-SM4.jpeg',
      caption: 'Hubble im Erdorbit (Space Shuttle SM4)',
    },
  ],
};

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
export class ResearchMissionsComponent implements OnInit {
  protected readonly missionService = inject(MissionDataService);
  private readonly route = inject(ActivatedRoute);

  readonly activeImageSrc = signal<string>('');
  readonly isRefreshingIss = signal<boolean>(false);
  readonly isLightboxOpen = signal<boolean>(false);

  readonly missionGalleryItems = computed<Array<{ url: string; caption: string }>>(() => {
    const m = this.missionService.selectedMission();
    if (!m) {
      return [];
    }
    const items: Array<{ url: string; caption: string }> = [
      { url: m.wikimediaImageUrl || m.imageUrl, caption: m.title },
    ];
    return [...items, ...(EXTRA_MISSION_GALLERY[m.id] ?? [])];
  });

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
    const targetMissionId = this.route.snapshot.queryParamMap.get('mission');
    if (targetMissionId) {
      this.missionService.setCategory('all');
      this.missionService.selectMission(targetMissionId);
    }
    await this.refreshIssTelemetry();
  }

  onThumbnailError(event: Event, fallbackUrl: string): void {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.src.endsWith(fallbackUrl)) {
      img.src = fallbackUrl;
    }
  }

  selectGalleryPhoto(url: string): void {
    this.activeImageSrc.set(url);
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
