/**
 * Projekt / Modul: SSI App – Solar System Info App / InfoboxDetailComponent (infobox-detail.ts)
 * FCPP-Referenz: P20-U10, P20-U20, P20-U30, P20-U40 (Detailansicht, Wikimedia-Foto mit Offline-Fallback, Mond-Auswahl & 7 Bahnelemente)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Bereinigtes P20-Steckbrief-Layout ohne redundante Klammer-Zusätze, mit 1px Rahmen und dezenten Kurvenradien.
 */

import { Component, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CelestialBody, OrbitalElementDetail } from '../../../core/models/celestial-body.model';
import { MissionDataService } from '../../../core/services/mission-data.service';
import { ResearchMission } from '../../../core/models/research-mission.model';
import { ImageLightboxComponent } from '../../../shared/components/image-lightbox/image-lightbox';
import { GLOSSARY_DEFINITIONS, GlossaryTermComponent } from '../../../shared/components/glossary-term/glossary-term';

const EXTRA_BODY_GALLERY: Readonly<Record<string, Array<{ url: string; caption: string }>>> = {
  sun: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/960px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
      caption: 'Sonne im UV-Licht (NASA SDO)',
    },
  ],
  earth: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Meteosat-12-fci-march-equinox-2025-noon.jpg/960px-Meteosat-12-fci-march-equinox-2025-noon.jpg',
      caption: 'Europa & Afrika vom Wettersatelliten',
    },
  ],
  mars: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Perseverance-Selfie-at-Rochette-Horizontal-V2.gif/960px-Perseverance-Selfie-at-Rochette-Horizontal-V2.gif',
      caption: 'Mars-Rover Perseverance auf dem Mars',
    },
  ],
  jupiter: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/960px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
      caption: 'Der Große Rote Fleck (Hubble)',
    },
  ],
  saturn: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/960px-Saturn_during_Equinox.jpg',
      caption: 'Saturns Schatten auf den Ringen (Cassini)',
    },
  ],
  pluto: [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/960px-Pluto_in_True_Color_-_High-Res.jpg',
      caption: 'Plutos Eisherz Tombaugh Regio',
    },
  ],
};

@Component({
  selector: 'app-infobox-detail',
  imports: [DecimalPipe, RouterLink, ImageLightboxComponent, GlossaryTermComponent],
  template: `
    @if (body(); as current) {
      <aside class="infobox-panel" aria-labelledby="infobox-title">
        <div class="infobox-topbar">
          <div class="badge-group">
            <span class="category-badge">{{ current.categoryLabel }}</span>
          </div>
          <button
            type="button"
            class="close-btn"
            (click)="closed.emit()"
            aria-label="Infobox schließen"
          >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i> Schließen
          </button>
        </div>

        <div class="infobox-hero">
          <div class="image-frame">
            <button
              type="button"
              class="img-zoom-btn"
              (click)="isLightboxOpen.set(true)"
              aria-label="Bild in Originalgröße vergrößern"
            >
              <img
                [src]="activeImageSrc()"
                [alt]="'Bild von ' + current.name"
                (error)="onImageError(current.imageUrl)"
              />
              <span class="zoom-badge">
                <i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i> Originalgröße
              </span>
            </button>
            @if (galleryItems().length > 1) {
              <div class="mini-gallery" role="group" aria-label="Weitere Fotos auswählen">
                @for (item of galleryItems(); track item.url) {
                  <button
                    type="button"
                    class="gallery-thumb-btn"
                    [class.active-thumb]="activeImageSrc() === item.url"
                    (click)="selectGalleryPhoto(item.url)"
                    [title]="item.caption"
                  >
                    <img [src]="item.url" [alt]="item.caption" (error)="onThumbError($event, current.imageUrl)" />
                  </button>
                }
              </div>
            }
            <span class="image-credit">Quelle: {{ current.imageCredit }}</span>
          </div>

          <div class="hero-content">
            <h3 id="infobox-title">{{ current.name }}</h3>
            <p class="hero-subtitle">{{ current.subtitle }}</p>
            <p class="hero-summary">{{ current.shortSummary }}</p>

            <div class="comparison-banner">
              <strong>Größenvergleich:</strong> {{ current.comparisonHint }}
            </div>
          </div>
        </div>

        <!-- Tabellarische Kennzahlen gemäß P20-A20 -->
        <div class="metrics-grid" role="region" aria-label="Wichtige Kennzahlen">
          <div class="metric-box">
            <span class="metric-label">Durchmesser</span>
            <strong class="metric-val">{{ current.diameterKm | number: '1.0-2' }} km</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">
              Entfernung zur Sonne (<app-term term="AE" />)
            </span>
            <strong class="metric-val">
              @if (current.id === 'sun') {
                0 km
              } @else {
                {{ current.distanceFromSunAu }} AE ·
                {{ current.distanceFromSunKm / 1000000 | number: '1.1-1' }} Mio. km
              }
            </strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">Entfernung zur Erde</span>
            <strong class="metric-val">
              @if (current.id === 'earth') {
                0 km
              } @else if (current.distanceFromEarthKm < 1000000) {
                {{ current.distanceFromEarthKm | number: '1.0-0' }} km
              } @else {
                {{ current.distanceFromEarthKm / 1000000 | number: '1.1-1' }} Mio. km
              }
            </strong>
          </div>
          <div class="metric-box">
            <span class="metric-label">Umlaufdauer</span>
            <strong class="metric-val">{{ current.orbitalPeriodLabel }}</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label"><app-term term="Bahnneigung" /></span>
            <strong class="metric-val">{{ current.inclinationToSolarEquatorDeg }}°</strong>
          </div>
        </div>

        <!-- Spannende Fakten für Grundschulkinder -->
        <div class="facts-section">
          <h4>Wissenswertes</h4>
          <ul class="facts-list">
            @for (fact of current.childFriendlyFacts; track fact) {
              <li>{{ fact }}</li>
            }
          </ul>
        </div>

        <!-- Zugehörige Monde / Stationen gemäß P20-A40 / P20-U30 -->
        @if (childBodies().length > 0) {
          <div class="moons-section">
            <h4>Zugehörige Monde & Raumsonden</h4>
            <div class="moon-chips">
              @for (child of childBodies(); track child.id) {
                <button
                  type="button"
                  class="moon-chip-btn"
                  (click)="bodySelected.emit(child.id)"
                >
                  {{ child.name }}
                </button>
              }
            </div>
          </div>
        }

        @if (parentBody(); as parent) {
          <div class="parent-jump">
            <span>Zentralkörper:</span>
            <button type="button" class="parent-btn" (click)="bodySelected.emit(parent.id)">
              Zurück zu {{ parent.name }}
            </button>
          </div>
        }

        @if (matchingMissions().length > 0) {
          <div class="missions-jump-section">
            <h4>Passende Forschungsprojekte</h4>
            <div class="moon-chips">
              @for (m of matchingMissions(); track m.id) {
                <a
                  class="mission-jump-link"
                  [routerLink]="['/research']"
                  [queryParams]="{ mission: m.id }"
                >
                  <i class="fa-solid fa-satellite" aria-hidden="true"></i>
                  {{ m.title }}
                </a>
              }
            </div>
          </div>
        }

        <!-- Ausklappbare Astronomen-Box mit den 7 Bahnelementen (P20-A30 / P20-U20) -->
        <div class="astronomy-box">
          <button
            type="button"
            class="astronomy-toggle-btn"
            (click)="toggleOrbitalBox()"
            [attr.aria-expanded]="isOrbitalBoxOpen()"
          >
            <span><i class="fa-solid fa-compass-drafting" aria-hidden="true"></i> Astronomen-Box: Die 7 Bahnelemente</span>
            <span class="toggle-arrow">
              <i
                class="fa-solid"
                [class.fa-chevron-up]="isOrbitalBoxOpen()"
                [class.fa-chevron-down]="!isOrbitalBoxOpen()"
                aria-hidden="true"
              ></i>
              {{ isOrbitalBoxOpen() ? 'Einklappen' : 'Ausklappen' }}
            </span>
          </button>

          @if (isOrbitalBoxOpen()) {
            <div class="orbital-elements-content">
              <p class="orbital-intro">
                Mit diesen 7 Bahnelementen lässt sich die Umlaufbahn im Raum exakt bestimmen:
              </p>
              <div class="orbital-table-wrapper">
                <table class="orbital-table">
                  <thead>
                    <tr>
                      <th>Kürzel</th>
                      <th>Bahnelement</th>
                      <th>Messwert</th>
                      <th>Erklärung</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (el of orbitalElementsList(); track el.code) {
                      <tr>
                        <td><span class="code-pill">{{ el.code }}</span></td>
                        <td>
                          @if (hasGlossaryTerm(el.label)) {
                            <app-term [term]="el.label" />
                          } @else {
                            <strong>{{ el.label }}</strong>
                          }
                        </td>
                        <td class="val-cell">{{ el.formattedValue }}</td>
                        <td>{{ el.childExplanation }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </aside>

      <app-image-lightbox
        [isOpen]="isLightboxOpen()"
        [imageSrc]="activeImageSrc()"
        [fallbackSrc]="current.imageUrl"
        [title]="current.name"
        [credit]="current.imageCredit"
        (closed)="isLightboxOpen.set(false)"
      />
    }
  `,
  styles: `
    .infobox-panel {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.15rem;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }
    .infobox-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-bottom: 0.55rem;
      border-bottom: 1px solid var(--card-border);
    }
    .badge-group {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .category-badge {
      padding: 0.18rem 0.55rem;
      border-radius: var(--radius-sm);
      font-size: 0.76rem;
      font-weight: 700;
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      border: 1px solid #bfdbfe;
    }
    .close-btn {
      padding: 0.32rem 0.75rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.82rem;
      background-color: var(--card-bg);
      color: var(--card-text-primary);
      border: 1px solid var(--card-border);
      cursor: pointer;
    }
    .close-btn:hover {
      background-color: #fee2e2;
      border-color: #fca5a5;
      color: #991b1b;
    }
    .infobox-hero {
      display: grid;
      grid-template-columns: 230px 1fr;
      gap: 1.15rem;
      align-items: start;
    }
    .image-frame {
      background-color: var(--space-bg-secondary);
      border-radius: var(--radius-md);
      padding: 0.45rem;
      border: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .image-frame img {
      width: 100%;
      height: 165px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      display: block;
      background-color: #111d3b;
    }
    .img-zoom-btn {
      position: relative;
      display: block;
      width: 100%;
      padding: 0;
      border: none;
      background: transparent;
      cursor: zoom-in;
    }
    .zoom-badge {
      position: absolute;
      right: 0.4rem;
      bottom: 0.4rem;
      padding: 0.18rem 0.48rem;
      border-radius: var(--radius-sm);
      background-color: rgba(11, 19, 43, 0.85);
      color: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.5);
      font-size: 0.7rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.28rem;
    }
    .mini-gallery {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }
    .gallery-thumb-btn {
      padding: 0;
      width: 44px;
      height: 34px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      overflow: hidden;
      cursor: pointer;
      background-color: #111d3b;
    }
    .gallery-thumb-btn.active-thumb {
      border: 2px solid #60a5fa;
    }
    .gallery-thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .missions-jump-section h4 {
      margin: 0 0 0.4rem;
      font-size: 0.95rem;
    }
    .mission-jump-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--accent-primary);
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      font-weight: 600;
      font-size: 0.84rem;
      text-decoration: none;
    }
    .mission-jump-link:hover {
      background-color: var(--accent-primary);
      color: #ffffff;
      text-decoration: none;
    }
    .image-credit {
      font-size: 0.7rem;
      color: #cbd5e1;
      line-height: 1.3;
    }
    .hero-content h3 {
      margin: 0 0 0.2rem;
      font-size: 1.35rem;
      font-weight: 800;
    }
    .hero-subtitle {
      margin: 0 0 0.5rem;
      font-weight: 600;
      color: var(--accent-primary);
      font-size: 0.92rem;
    }
    .hero-summary {
      margin: 0 0 0.65rem;
      color: var(--card-text-secondary);
      font-size: 0.92rem;
    }
    .comparison-banner {
      background-color: #fefce8;
      border: 1px solid #fde047;
      color: #713f12;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.88rem;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0.55rem;
    }
    .metric-box {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 0.55rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .metric-label {
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--card-text-muted);
    }
    .metric-val {
      font-size: 0.9rem;
      color: var(--card-text-primary);
    }
    .facts-section h4,
    .moons-section h4 {
      margin: 0 0 0.4rem;
      font-size: 0.95rem;
    }
    .facts-list {
      margin: 0;
      padding-left: 1.2rem;
      color: var(--card-text-secondary);
      font-size: 0.9rem;
    }
    .facts-list li {
      margin-bottom: 0.25rem;
    }
    .moon-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .moon-chip-btn,
    .parent-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background-color: var(--card-bg);
      color: var(--accent-primary);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .moon-chip-btn:hover,
    .parent-btn:hover {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #ffffff;
    }
    .parent-jump {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.88rem;
      font-weight: 600;
    }
    .astronomy-box {
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      background-color: var(--card-bg);
      overflow: hidden;
    }
    .astronomy-toggle-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.9rem;
      border: none;
      background-color: var(--accent-astronomy-box);
      color: var(--accent-primary);
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      text-align: left;
    }
    .astronomy-toggle-btn:hover {
      background-color: var(--card-bg-subtle);
    }
    .toggle-arrow {
      font-size: 0.8rem;
      white-space: nowrap;
    }
    .orbital-elements-content {
      padding: 0.75rem 0.9rem;
    }
    .orbital-intro {
      margin: 0 0 0.55rem;
      font-size: 0.85rem;
      color: var(--card-text-secondary);
    }
    .orbital-table-wrapper {
      overflow-x: auto;
    }
    .orbital-table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--card-bg-elevated);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      font-size: 0.83rem;
    }
    .orbital-table th,
    .orbital-table td {
      padding: 0.45rem 0.6rem;
      border-bottom: 1px solid var(--card-border);
      text-align: left;
      vertical-align: top;
    }
    .orbital-table th {
      background-color: var(--card-bg);
      font-weight: 700;
      color: var(--card-text-primary);
    }
    .code-pill {
      display: inline-block;
      padding: 0.12rem 0.4rem;
      border-radius: var(--radius-sm);
      background-color: var(--accent-primary);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.74rem;
    }
    .val-cell {
      font-weight: 600;
      white-space: nowrap;
      color: #0369a1;
    }
    @media (max-width: 720px) {
      .infobox-hero {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class InfoboxDetailComponent implements OnInit {
  private readonly missionService = inject(MissionDataService);

  readonly body = input<CelestialBody | null>(null);
  readonly childBodies = input<CelestialBody[]>([]);
  readonly parentBody = input<CelestialBody | null>(null);

  readonly bodySelected = output<string>();
  readonly closed = output<void>();

  readonly isOrbitalBoxOpen = signal<boolean>(true);
  readonly isLightboxOpen = signal<boolean>(false);
  readonly activeImageSrc = signal<string>('');

  readonly galleryItems = computed<Array<{ url: string; caption: string }>>(() => {
    const b = this.body();
    if (!b) {
      return [];
    }
    const items: Array<{ url: string; caption: string }> = [
      { url: b.wikimediaImageUrl || b.imageUrl, caption: b.name },
    ];
    const extras = EXTRA_BODY_GALLERY[b.id] ?? [];
    return [...items, ...extras];
  });

  readonly matchingMissions = computed<ResearchMission[]>(() => {
    const b = this.body();
    const allMissions = this.missionService.missions();
    if (!b || allMissions.length === 0) {
      return [];
    }
    return allMissions
      .filter(
        (m) =>
          m.targetBodyId === b.id ||
          b.childrenIds.includes(m.targetBodyId) ||
          (b.parentId && m.targetBodyId === b.parentId && b.category === 'spacecraft'),
      )
      .slice(0, 4);
  });

  readonly orbitalElementsList = computed<OrbitalElementDetail[]>(() => {
    const b = this.body();
    if (!b) {
      return [];
    }
    const oe = b.orbitalElements;
    return [oe.sma, oe.ecc, oe.inc, oe.lan, oe.lpe, oe.mna, oe.ref];
  });

  constructor() {
    effect(() => {
      const current = this.body();
      if (current) {
        this.activeImageSrc.set(current.wikimediaImageUrl || current.imageUrl);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.missionService.loadMissions();
  }

  selectGalleryPhoto(url: string): void {
    this.activeImageSrc.set(url);
  }

  onThumbError(event: Event, fallbackUrl: string): void {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.src.endsWith(fallbackUrl)) {
      img.src = fallbackUrl;
    }
  }

  hasGlossaryTerm(label: string): boolean {
    return Object.prototype.hasOwnProperty.call(GLOSSARY_DEFINITIONS, label);
  }

  onImageError(localFallbackUrl: string): void {
    if (this.activeImageSrc() !== localFallbackUrl) {
      this.activeImageSrc.set(localFallbackUrl);
    }
  }

  toggleOrbitalBox(): void {
    this.isOrbitalBoxOpen.update((open) => !open);
  }
}
