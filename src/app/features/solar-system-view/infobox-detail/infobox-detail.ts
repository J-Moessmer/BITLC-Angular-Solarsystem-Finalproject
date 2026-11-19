/**
 * Projekt / Modul: SSI App – Solar System Info App / InfoboxDetailComponent (infobox-detail.ts)
 * FCPP-Referenz: P20-U10, P20-U20, P20-U30, P20-U40 (Detailansicht, Wikimedia-Foto mit Offline-Fallback, Mond-Auswahl & 7 Bahnelemente)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v2.1
 * Hinweis: Bereinigtes P20-Steckbrief-Layout ohne redundante Klammer-Zusätze, mit 1px Rahmen, dezenten Kurvenradien und Quellen-Links (officialUrl, wikipediaUrl, Wikimedia Commons).
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

        <div class="infobox-hero" [class.no-hero-image]="isImageHidden()">
          @if (!isImageHidden()) {
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
                  (error)="onImageError()"
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
                      <img [src]="item.url" [alt]="item.caption" (error)="onThumbError($event)" />
                    </button>
                  }
                </div>
              }
              <span class="image-credit">Quelle: {{ current.imageCredit }}</span>
            </div>
          }

          <div class="hero-content">
            <h3 id="infobox-title">{{ current.name }}</h3>
            <p class="hero-subtitle">{{ current.subtitle }}</p>
            <p class="hero-summary">{{ current.shortSummary }}</p>

            <div class="comparison-banner">
              <strong>Größenvergleich:</strong> {{ current.comparisonHint }}
            </div>
          </div>
        </div>

        <!-- 1. Kindgerechte Fun Facts & Entdecker-Sprünge direkt unter dem Bild -->
        <div class="facts-section">
          <h4>Fun Facts & Wissenswertes</h4>
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

        <!-- 2. Messwerte & Kennzahlen (Übergang zu detaillierteren Fakten) -->
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
            <span class="metric-label">Geschwindigkeit</span>
            <strong class="metric-val">{{ orbitalSpeedLabel() }}</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label"><app-term term="Bahnneigung" /></span>
            <strong class="metric-val">{{ current.inclinationToSolarEquatorDeg }}°</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label"><app-term term="Aufsteigender Knoten" /> (LAN)</span>
            <strong class="metric-val">{{ current.orbitalElements.lan.formattedValue }}</strong>
          </div>
          <div class="metric-box">
            <span class="metric-label"><app-term term="Argument der Periapsis" /> (AOP)</span>
            <strong class="metric-val">{{ aopElement().formattedValue }}</strong>
          </div>
        </div>

        @if (current.category === 'lagrange' || current.id === 'jwst' || current.id === 'gaia') {
          <div class="lagrange-banner">
            <strong>Profi-Info – Was sind <app-term term="Lagrange-Punkte" />?</strong>
            Zwischen Sonne und Erde gibt es 5 besondere Gleichgewichts-Orte (L1 bis L5), an denen
            sich Schwerkraft und Fliehkraft genau ausgleichen. Am
            <app-term term="Lagrange-Punkt L2" /> (1,5 Mio. km hinter der Erde, immer im
            Schatten-Schutz vor der heißen Sonne) kreisen Teleskope wie JWST und Gaia stabil
            mit unserer Erde mit!
          </div>
        }

        <!-- 3. Profi-Bereich ganz unten: Ausklappbare Astronomen-Box mit den 7 Bahnelementen -->
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
                        <td class="code-cell" data-label="Kürzel">
                          <span class="code-pill">{{ el.code }}</span>
                        </td>
                        <td class="name-cell" data-label="Bahnelement">
                          @if (hasGlossaryTerm(el.label)) {
                            <app-term [term]="el.label" />
                          } @else {
                            <strong>{{ el.label }}</strong>
                          }
                        </td>
                        <td class="val-cell" data-label="Messwert">{{ el.formattedValue }}</td>
                        <td class="desc-cell" data-label="Erklärung">{{ el.childExplanation }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>

        <!-- 4. Quellen & Weiterführende Links -->
        @if (current.officialUrl || current.wikipediaUrl || current.wikimediaImageUrl) {
          <div class="sources-section" aria-label="Quellen und weiterführende Links">
            <h4>Quellen & Weiterführende Links</h4>
            <div class="source-links-bar">
              @if (current.officialUrl) {
                <a
                  class="source-external-btn"
                  [href]="current.officialUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  Offizielle NASA / ESA Infoseite
                </a>
              }
              @if (current.wikipediaUrl) {
                <a
                  class="source-external-btn"
                  [href]="current.wikipediaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="fa-brands fa-wikipedia-w" aria-hidden="true"></i>
                  Wikipedia-Artikel ({{ current.name }})
                </a>
              }
              @if (current.wikimediaImageUrl) {
                <a
                  class="source-external-btn"
                  [href]="current.wikimediaImageUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="fa-regular fa-image" aria-hidden="true"></i>
                  Bildquelle (Wikimedia Commons)
                </a>
              }
            </div>
          </div>
        }
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
    .infobox-hero.no-hero-image {
      grid-template-columns: 1fr;
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
    .lagrange-banner {
      margin-top: 0.5rem;
      background-color: var(--accent-astronomy-box);
      border: 1px solid var(--card-border);
      color: var(--card-text-primary);
      padding: 0.55rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.86rem;
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
      white-space: normal;
      overflow-wrap: anywhere;
      color: var(--accent-primary);
    }
    .sources-section h4 {
      margin: 0 0 0.45rem;
      font-size: 0.95rem;
    }
    .source-links-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .source-external-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.42rem;
      padding: 0.42rem 0.85rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background-color: var(--card-bg);
      color: var(--card-text-primary);
      font-weight: 600;
      font-size: 0.84rem;
      text-decoration: none;
      transition:
        background-color 0.12s ease,
        border-color 0.12s ease,
        color 0.12s ease;
    }
    .source-external-btn:hover {
      background-color: var(--card-bg-subtle);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      text-decoration: none;
    }
    @media (max-width: 720px) {
      .infobox-panel {
        padding: 0.85rem;
      }
      .infobox-hero {
        grid-template-columns: 1fr;
      }
      .orbital-table thead {
        display: none;
      }
      .orbital-table,
      .orbital-table tbody,
      .orbital-table tr,
      .orbital-table td {
        display: block;
        width: 100%;
      }
      .orbital-table {
        border: none;
        background: transparent;
      }
      .orbital-table tr {
        margin-bottom: 0.65rem;
        border: 1px solid var(--card-border);
        border-radius: var(--radius-md);
        background-color: var(--card-bg-elevated);
        padding: 0.45rem 0.6rem;
      }
      .orbital-table td {
        border-bottom: none;
        padding: 0.2rem 0;
        white-space: normal;
        word-break: break-word;
      }
      .orbital-table td.code-cell {
        display: inline-block;
        width: auto;
        margin-right: 0.45rem;
      }
      .orbital-table td.name-cell {
        display: inline-block;
        width: auto;
      }
      .orbital-table td.val-cell {
        margin-top: 0.2rem;
        font-size: 0.85rem;
      }
      .orbital-table td.desc-cell {
        font-size: 0.82rem;
        color: var(--card-text-secondary);
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
  readonly isImageHidden = signal<boolean>(false);
  readonly activeImageSrc = signal<string>('');

  /** KI-generierter Block: Baut die umschaltbare Mini-Galerie aus Hauptfoto, Extras sowie verknüpften Missionen/Monden (max. 6, dedupliziert) */
  readonly galleryItems = computed<Array<{ url: string; caption: string }>>(() => {
    const b = this.body();
    if (!b) {
      return [];
    }
    const items: Array<{ url: string; caption: string }> = [];
    const seen = new Set<string>();
    const addItem = (url: string | undefined, caption: string): void => {
      if (!url || seen.has(url) || items.length >= 6) {
        return;
      }
      seen.add(url);
      items.push({ url, caption });
    };

    addItem(b.wikimediaImageUrl || b.imageUrl, b.name);
    for (const extra of EXTRA_BODY_GALLERY[b.id] ?? []) {
      addItem(extra.url, extra.caption);
    }
    for (const m of this.matchingMissions()) {
      addItem(m.wikimediaImageUrl, m.title);
    }
    for (const child of this.childBodies()) {
      addItem(child.wikimediaImageUrl, child.name);
    }
    return items;
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

  /** KI-Hinweis: Liefert das Argument der Periapsis (AOP / ω), ggf. berechnet aus (LPE − LAN) mod 360°. */
  readonly aopElement = computed<OrbitalElementDetail>(() => {
    const b = this.body();
    if (!b) {
      return {
        code: 'AOP',
        label: 'Argument der Periapsis',
        formattedValue: '–',
        childExplanation: '',
      };
    }
    if (b.orbitalElements.aop) {
      return b.orbitalElements.aop;
    }
    const lpe = b.orbitalElements.lpe.numericValue;
    const lan = b.orbitalElements.lan.numericValue;
    if (lpe !== undefined && lan !== undefined) {
      const isRetro = b.inclinationToSolarEquatorDeg > 90;
      const rawOmega = isRetro ? lan - lpe : lpe - lan;
      const omega = Number((((rawOmega % 360) + 360) % 360).toFixed(2));
      return {
        code: 'AOP',
        label: 'Argument der Periapsis',
        formattedValue: `${omega}°`,
        numericValue: omega,
        unit: '°',
        childExplanation:
          'Der Winkel vom aufsteigenden Knoten (LAN) entlang der Bahn bis zum sonnennächsten Punkt (Periapsis).',
      };
    }
    return {
      code: 'AOP',
      label: 'Argument der Periapsis',
      formattedValue: '0.0°',
      numericValue: 0,
      unit: '°',
      childExplanation:
        'Der Winkel vom aufsteigenden Knoten (LAN) entlang der Bahn bis zum sonnennächsten Punkt (Periapsis).',
    };
  });

  readonly orbitalElementsList = computed<OrbitalElementDetail[]>(() => {
    const b = this.body();
    if (!b) {
      return [];
    }
    const oe = b.orbitalElements;
    return [oe.sma, oe.ecc, oe.inc, oe.lan, this.aopElement(), oe.lpe, oe.mna, oe.ref];
  });

  /** Berechnet die durchschnittliche Bahngeschwindigkeit (km/h & km/s) für jedes Objekt */
  readonly orbitalSpeedLabel = computed<string>(() => {
    const b = this.body();
    if (!b) {
      return '–';
    }
    if (b.id === 'sun') {
      return 'ca. 828.000 km/h (durch die Milchstraße)';
    }
    if (b.id === 'voyager-1') {
      return 'ca. 61.200 km/h (17,0 km/s)';
    }
    if (b.id === 'voyager-2') {
      return 'ca. 55.400 km/h (15,4 km/s)';
    }
    if (b.id === 'new-horizons') {
      return 'ca. 49.500 km/h (13,8 km/s)';
    }
    if (b.id === 'parker') {
      return 'bis zu 692.000 km/h (192 km/s)';
    }
    if (b.isSurfaceLanded) {
      return '0 km/h (auf der Oberfläche gelandet)';
    }
    if (b.id === 'iss') {
      return 'ca. 27.600 km/h (7,66 km/s)';
    }
    if (b.id === 'hubble') {
      return 'ca. 27.300 km/h (7,59 km/s)';
    }
    const smaAu = b.orbitalElements.sma.numericValue ?? b.distanceFromSunAu;
    if (smaAu > 0 && b.orbitalPeriodDays > 0) {
      const kmPerAu = 149597870.7;
      const circumferenceKm = 2 * Math.PI * smaAu * kmPerAu;
      const kmPerHour = circumferenceKm / (b.orbitalPeriodDays * 24);
      const kmPerSec = kmPerHour / 3600;
      const formattedKmh =
        kmPerHour >= 100
          ? Math.round(kmPerHour).toLocaleString('de-DE')
          : kmPerHour.toFixed(1).replace('.', ',');
      const formattedKms =
        kmPerSec >= 10
          ? kmPerSec.toFixed(1).replace('.', ',')
          : kmPerSec.toFixed(2).replace('.', ',');
      return `ca. ${formattedKmh} km/h (${formattedKms} km/s)`;
    }
    return '–';
  });

  constructor() {
    effect(() => {
      const current = this.body();
      if (current) {
        const hasRealPhoto = Boolean(current.wikimediaImageUrl);
        this.isImageHidden.set(!hasRealPhoto);
        this.activeImageSrc.set(current.wikimediaImageUrl || '');
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.missionService.loadMissions();
  }

  selectGalleryPhoto(url: string): void {
    this.isImageHidden.set(false);
    this.activeImageSrc.set(url);
  }

  onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    const btn = img?.closest('button') as HTMLElement | null;
    if (btn) {
      btn.style.display = 'none';
    }
  }

  hasGlossaryTerm(label: string): boolean {
    return Object.prototype.hasOwnProperty.call(GLOSSARY_DEFINITIONS, label);
  }

  onImageError(): void {
    this.isImageHidden.set(true);
  }

  toggleOrbitalBox(): void {
    this.isOrbitalBoxOpen.update((open) => !open);
  }
}
