/**
 * Projekt / Modul: SSI App – Solar System Info App / IssWorldMapComponent (iss-world-map.ts)
 * FCPP-Referenz: P40-U20 (Visuelle ISS-Weltkarte mit Tag-/Nacht-Schatten & Umlaufbahn-Spur wie wheretheiss.at)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v1.0
 * Hinweis: 100 % offline-sichere SVG-Weltkarte (Equirectangular-Projektion) mit berechneter Tag-/Nacht-Grenze, 51,64°-Orbitalspur und ISS-Position.
 */

import { Component, computed, input } from '@angular/core';
import { IssLiveStatus } from '../../../core/models/research-mission.model';

@Component({
  selector: 'app-iss-world-map',
  template: `
    <div class="iss-map-card" role="img" aria-label="Weltkarte mit aktueller Position der Raumstation ISS">
      <svg class="iss-world-svg" viewBox="0 0 720 360" preserveAspectRatio="xMidYMid meet">
        <!-- Ozean-Hintergrund (Marineblau ohne #000000) -->
        <rect x="0" y="0" width="720" height="360" fill="#0f2347" />

        <!-- Dezentes Gradnetz (Äquator & Nullmeridian) -->
        <g stroke="#29487d" stroke-width="0.7" stroke-dasharray="4 4" opacity="0.65">
          <line x1="0" y1="180" x2="720" y2="180" />
          <line x1="360" y1="0" x2="360" y2="360" />
          <line x1="0" y1="90" x2="720" y2="90" />
          <line x1="0" y1="270" x2="720" y2="270" />
          <line x1="180" y1="0" x2="180" y2="360" />
          <line x1="540" y1="0" x2="540" y2="360" />
        </g>

        <!-- Kontinente (Equirectangular: x = (lon + 180) * 2, y = (90 - lat) * 2) -->
        <g fill="#2e5945" stroke="#52826b" stroke-width="1">
          <!-- Nordamerika -->
          <path d="M 40,48 L 110,36 L 195,45 L 245,75 L 210,115 L 175,130 L 160,152 L 135,148 L 110,122 L 85,105 L 48,72 Z" />
          <!-- Grönland -->
          <path d="M 255,18 L 312,14 L 325,38 L 285,56 L 258,42 Z" />
          <!-- Südamerika -->
          <path d="M 192,158 L 235,162 L 288,195 L 270,248 L 238,288 L 222,282 L 215,235 L 195,195 Z" />
          <!-- Europa -->
          <path d="M 336,56 L 378,44 L 422,48 L 430,82 L 392,98 L 352,96 L 336,80 Z" />
          <!-- Afrika -->
          <path d="M 340,108 L 395,106 L 442,135 L 456,178 L 424,242 L 396,246 L 378,192 L 342,162 L 328,132 Z" />
          <!-- Asien -->
          <path d="M 426,46 L 520,34 L 642,44 L 675,68 L 635,112 L 585,148 L 535,152 L 505,135 L 468,138 L 435,104 Z" />
          <!-- Japan / Südostasien-Inseln -->
          <path d="M 632,102 L 648,96 L 652,118 L 635,122 Z" />
          <path d="M 565,168 L 608,166 L 620,185 L 575,188 Z" />
          <!-- Australien -->
          <path d="M 588,208 L 655,204 L 668,242 L 628,258 L 586,242 Z" />
          <!-- Antarktis -->
          <path d="M 0,322 L 180,316 L 360,324 L 540,318 L 720,322 L 720,360 L 0,360 Z" fill="#cbd5e1" stroke="#94a3b8" />
        </g>

        <!-- Berechneter Nachtschatten (Day/Night Terminator) -->
        <path [attr.d]="nightShadowPath()" fill="#0b132b" fill-opacity="0.48" />

        <!-- Sinusförmige ISS-Umlaufbahn (Bahnneigung 51,64°) -->
        @for (seg of orbitTrackSegments(); track $index) {
          <path
            [attr.d]="seg"
            fill="none"
            stroke="#facc15"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.92"
          />
        }

        <!-- ISS-Sichtbarkeitskreis & aktueller Standort -->
        <g [attr.transform]="'translate(' + issPoint().x + ',' + issPoint().y + ')'">
          <circle
            cx="0"
            cy="0"
            r="24"
            fill="#f8fafc"
            fill-opacity="0.16"
            stroke="#facc15"
            stroke-width="1.4"
          />
          <circle cx="0" cy="0" r="9" fill="#111d3b" stroke="#38bdf8" stroke-width="1.5" />
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            class="map-fa-icon"
            font-size="11"
            fill="#facc15"
          >
            &#xf7bf;
          </text>
          <text
            x="0"
            y="-14"
            text-anchor="middle"
            fill="#fef08a"
            font-size="10"
            font-weight="700"
          >
            ISS
          </text>
        </g>
      </svg>

      <div class="map-legend">
        <span><span class="legend-dot yellow"></span> ISS-Flugbahn (51,6° Neigung)</span>
        <span><span class="legend-dot shadow"></span> Aktuelle Nachtseite der Erde</span>
      </div>
    </div>
  `,
  styles: `
    .iss-map-card {
      border-radius: var(--radius-md);
      border: 1px solid var(--card-border);
      overflow: hidden;
      background-color: #0f2347;
    }
    .iss-world-svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: 300px;
    }
    .map-fa-icon {
      font-family: 'Font Awesome 7 Free';
      font-weight: 900;
      pointer-events: none;
    }
    .map-legend {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0.4rem 0.7rem;
      background-color: #111d3b;
      color: #cbd5e1;
      font-size: 0.74rem;
      font-weight: 600;
    }
    .legend-dot {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      margin-right: 0.3rem;
      vertical-align: middle;
    }
    .legend-dot.yellow {
      background-color: #facc15;
    }
    .legend-dot.shadow {
      background-color: #0b132b;
      border: 1px solid #64748b;
    }
  `,
})
export class IssWorldMapComponent {
  readonly status = input.required<IssLiveStatus>();

  readonly issPoint = computed<{ x: number; y: number }>(() => {
    const s = this.status();
    return {
      x: Number(((s.longitude + 180) * 2).toFixed(1)),
      y: Number(((90 - s.latitude) * 2).toFixed(1)),
    };
  });

  /** Berechnet die ISS-Umlaufbahn (Sinuswelle um den Globus, am Datumsgrenze-Sprung getrennt) */
  readonly orbitTrackSegments = computed<string[]>(() => {
    const s = this.status();
    const incRad = (51.64 * Math.PI) / 180;
    const clampedLat = Math.max(-51.5, Math.min(51.5, s.latitude));
    const phase = Math.asin(Math.sin((clampedLat * Math.PI) / 180) / Math.sin(incRad));

    const segments: string[] = [];
    let currentPath: string[] = [];
    let prevX: number | null = null;

    // 1 volle Erdumrundung (~360° Länge, leicht nach Westen versetzt durch Erdrotation)
    for (let step = -70; step <= 70; step++) {
      const u = phase + (step * Math.PI) / 50;
      const lat = (Math.asin(Math.sin(incRad) * Math.sin(u)) * 180) / Math.PI;
      const rawLon = s.longitude + step * 2.4;
      const wrappedLon = ((((rawLon + 180) % 360) + 360) % 360) - 180;

      const x = Number(((wrappedLon + 180) * 2).toFixed(1));
      const y = Number(((90 - lat) * 2).toFixed(1));

      if (prevX !== null && Math.abs(x - prevX) > 250) {
        if (currentPath.length > 1) {
          segments.push(currentPath.join(' '));
        }
        currentPath = [`M${x} ${y}`];
      } else {
        currentPath.push(`${currentPath.length === 0 ? 'M' : 'L'}${x} ${y}`);
      }
      prevX = x;
    }

    if (currentPath.length > 1) {
      segments.push(currentPath.join(' '));
    }
    return segments;
  });

  /** Berechnet den aktuellen Tag-/Nacht-Schatten aus UTC-Zeit und Sonnen-Deklination */
  readonly nightShadowPath = computed<string>(() => {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const subsolarLon = (12 - utcHours) * 15;
    const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86400000);
    const declRad = (-23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10)) * Math.PI) / 180;

    const pts: string[] = [];
    const tanDecl = Math.tan(declRad);
    const safeTan = Math.abs(tanDecl) < 0.01 ? 0.01 : tanDecl;

    for (let lon = -180; lon <= 180; lon += 6) {
      const dLonRad = ((lon - subsolarLon) * Math.PI) / 180;
      const latRad = Math.atan(-Math.cos(dLonRad) / safeTan);
      const latDeg = (latRad * 180) / Math.PI;
      const x = (lon + 180) * 2;
      const y = (90 - latDeg) * 2;
      pts.push(`${lon === -180 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    // Schließt die Nachthälfte entweder zum Südpol (y=360) oder Nordpol (y=0)
    const closeY = declRad >= 0 ? 360 : 0;
    pts.push(`L720 ${closeY} L0 ${closeY} Z`);
    return pts.join(' ');
  });
}
