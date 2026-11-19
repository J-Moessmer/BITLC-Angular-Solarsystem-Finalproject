/**
 * Projekt / Modul: SSI App – Solar System Info App / SizeComparisonComponent (size-comparison.ts)
 * FCPP-Referenz: P30-U10 (A10), P30-U20 (A20, A30 – Maßstabs- & Größenvergleich)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v2.2
 * Hinweis: Umsetzung von Plan-Element P30 inkl. extrasolarer & alltäglicher Vergleichskörper (Fußball, Basketball, 1-Meter-Kugel), gruppiertem Auswahlmenü, Sub-Meter-Tiefenzoom, automatischer cm/m/km-Einheitenformatierung, maßstabsgetreuen SVG-Silhouetten für Berg & Land sowie geschachtelter Horizont-Staffelung mit KI-Unterstützung erstellt.
 */

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolarSystemDataService } from '../../core/services/solar-system-data.service';
import { CelestialBody } from '../../core/models/celestial-body.model';
import {
  EVERYDAY_COMPARISON_IDS,
  EXOPLANET_COMPARISON_IDS,
  EXTRA_COMPARISON_BODIES,
  GIANT_STAR_COMPARISON_IDS,
} from './extra-comparison-bodies.data';

export interface ScaledComparisonItem {
  slotIndex: number;
  body: CelestialBody;
  svgRadiusPx: number;
  truePixelRadius: number;
  centerX: number;
  labelX: number;
}

export interface ComparisonPreset {
  id: string;
  label: string;
  icon: string;
  bodyIds: string[];
}

export interface ComparableBodyGroup {
  label: string;
  bodies: CelestialBody[];
}

@Component({
  selector: 'app-size-comparison',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './size-comparison.html',
  styleUrl: './size-comparison.css',
})
export class SizeComparisonComponent implements OnInit {
  protected readonly dataService = inject(SolarSystemDataService);

  /** Ausgewählte Himmelskörper-IDs (2 oder mehr gemäß P30-A20) */
  readonly selectedIds = signal<string[]>(['sun', 'earth']);

  /** Stufenloser Zoom-Slider (0 % = Übersicht, 100 % = tiefer Nahvergleich bis auf das kleinste Objekt) */
  readonly zoomSliderPercent = signal<number>(0);

  /**
   * KI-generierter Block: Unbegrenzter Maximal-Zoom bezogen auf das kleinste gewählte Objekt,
   * damit auch winzige Körper (z. B. Komet Tschuri, Mount Everest, Phobos neben Sonne/Überriesen)
   * bei 100 % Zoom auf ca. 85 % der Bühnengröße heranwachsen.
   */
  readonly maxZoomFactor = computed<number>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length < 2) {
      return 12;
    }
    const sorted = [...bodies].sort((a, b) => b.diameterKm - a.diameterKm);
    const largest = sorted[0].diameterKm;
    const smallest = Math.max(0.0000001, sorted[sorted.length - 1].diameterKm);
    return Math.max(8, Number(((largest / smallest) * 0.85).toFixed(2)));
  });

  readonly zoomFactor = computed<number>(() => {
    const pct = this.zoomSliderPercent();
    const maxZ = this.maxZoomFactor();
    return Number(Math.pow(maxZ, pct / 100).toFixed(3));
  });

  /** Kindgerechte Schnellwahl-Presets gemäß P30-A20 inkl. extrasolarer & allgemeiner Vergleiche */
  readonly presets: readonly ComparisonPreset[] = [
    {
      id: 'sun-earth',
      label: 'Sonne vs. Erde',
      icon: '☀️🌍',
      bodyIds: ['sun', 'earth'],
    },
    {
      id: 'jupiter-earth',
      label: 'Jupiter vs. Erde',
      icon: '🟠🌍',
      bodyIds: ['jupiter', 'earth'],
    },
    {
      id: 'earth-moon-mars',
      label: 'Erde, Mars & Erdmond',
      icon: '🌍🔴🌙',
      bodyIds: ['earth', 'mars', 'moon'],
    },
    {
      id: 'gas-giants',
      label: 'Alle 4 Riesenplaneten + Erde',
      icon: '🪐🔵',
      bodyIds: ['jupiter', 'saturn', 'uranus', 'neptune', 'earth'],
    },
    {
      id: 'rocky-planets',
      label: 'Alle 4 Gesteinsplaneten',
      icon: '🪨🌍',
      bodyIds: ['mercury', 'venus', 'earth', 'mars'],
    },
    {
      id: 'balls-and-everest',
      label: 'Fußball, Basketball, 1m-Kugel & Mount Everest',
      icon: '⚽🏀',
      bodyIds: ['soccer-ball', 'basketball', 'one-meter-sphere', 'mount-everest'],
    },
    {
      id: 'comets-everest-moon',
      label: 'Komet, Mount Everest & Mond',
      icon: '☄️🏔️',
      bodyIds: ['churyumov', 'mount-everest', 'halley', 'phobos', 'moon'],
    },
    {
      id: 'exoplanets',
      label: 'Erde vs. Exoplaneten',
      icon: '🪐✨',
      bodyIds: ['trappist-1e', 'earth', '55-cancri-e', 'jupiter', 'hd-189733b'],
    },
    {
      id: 'neighbor-stars',
      label: 'Sonne vs. Nachbarsterne',
      icon: '⭐☀️',
      bodyIds: ['jupiter', 'proxima-centauri', 'sun', 'sirius-a', 'pollux'],
    },
    {
      id: 'giant-stars',
      label: 'Sonne bis Hyperriese Stephenson 2-18',
      icon: '🌟🔥',
      bodyIds: ['sun', 'rigel', 'beteigeuze', 'uy-scuti', 'stephenson-2-18'],
    },
  ];

  /** Vergleichbare Himmelskörper (Sonnensystem ohne Gürtel/Sonden/L-Punkte + Extrasolare & Alltagsobjekte) */
  readonly comparableBodies = computed<CelestialBody[]>(() => {
    const solar = this.dataService
      .bodies()
      .filter(
        (b) =>
          b.category !== 'belt' && b.category !== 'spacecraft' && b.category !== 'lagrange',
      );
    return [...solar, ...EXTRA_COMPARISON_BODIES];
  });

  /** Gruppierte Auswahloptionen für übersichtliche <optgroup>-Dropdowns */
  readonly comparableBodyGroups = computed<ComparableBodyGroup[]>(() => {
    const all = this.comparableBodies();
    return [
      {
        label: 'Sonne & Planeten (Sonnensystem)',
        bodies: all.filter(
          (b) =>
            (b.category === 'star' || b.category === 'planet') &&
            !EVERYDAY_COMPARISON_IDS.has(b.id) &&
            !EXOPLANET_COMPARISON_IDS.has(b.id) &&
            !GIANT_STAR_COMPARISON_IDS.has(b.id),
        ),
      },
      {
        label: 'Zwergplaneten, Monde & Kometen (Sonnensystem)',
        bodies: all.filter(
          (b) =>
            (b.category === 'dwarf-planet' || b.category === 'moon' || b.category === 'comet') &&
            !EVERYDAY_COMPARISON_IDS.has(b.id),
        ),
      },
      {
        label: 'Alltag & Erde (Bälle, Berge & Länder)',
        bodies: all.filter((b) => EVERYDAY_COMPARISON_IDS.has(b.id)),
      },
      {
        label: 'Exoplaneten (Fremde Welten)',
        bodies: all.filter((b) => EXOPLANET_COMPARISON_IDS.has(b.id)),
      },
      {
        label: 'Ferne Sterne, Neutronensterne & Schwarze Löcher',
        bodies: all.filter((b) => GIANT_STAR_COMPARISON_IDS.has(b.id)),
      },
    ].filter((g) => g.bodies.length > 0);
  });

  /** Aktuell gewählte CelestialBody-Objekte */
  readonly selectedBodies = computed<CelestialBody[]>(() => {
    const list = this.comparableBodies();
    return this.selectedIds()
      .map((id) => list.find((b) => b.id === id))
      .filter((b): b is CelestialBody => b !== undefined);
  });

  /**
   * KI-generierter Block: Berechnet die exakt proportionalen SVG-Radien zum größten gewählten Körper
   * sowie die kontinuierliche Horizont-Staffelung beim tiefen Reinzoomen (P30-U20), sodass auch
   * extrem große Himmelskörper als gekrümmte Horizonte sichtbar bleiben und kleine Objekte groß herauskommen.
   */
  readonly scaledItems = computed<ScaledComparisonItem[]>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length === 0) {
      return [];
    }

    const maxDiameter = Math.max(...bodies.map((b) => b.diameterKm), 0.0000001);
    const totalWidth = 1140;
    const slotWidth = totalWidth / bodies.length;
    const baseMaxRadiusPx = Math.min(205, Math.floor(slotWidth * 0.44));
    const zoom = this.zoomFactor();
    const blend = Math.min(1, Math.max(0, (zoom - 1) / 0.3));

    let focusIdx = 0;
    for (let i = 1; i < bodies.length; i++) {
      if (bodies[i].diameterKm < bodies[focusIdx].diameterKm) {
        focusIdx = i;
      }
    }

    const drawnRadii = bodies.map((b) => {
      const trueRatio = b.diameterKm / maxDiameter;
      const truePixelRadius = Number((trueRatio * baseMaxRadiusPx * zoom).toFixed(2));
      const rawSvgRadiusPx = Math.max(2.5, truePixelRadius);
      const drawnR = Math.min(8000, rawSvgRadiusPx);
      const over = rawSvgRadiusPx > 185 ? Math.min(1, (rawSvgRadiusPx - 185) / 500) : 0;
      const boxHalf = rawSvgRadiusPx <= 185 ? rawSvgRadiusPx : 185 * (1 - over) + 55 * over;
      return {
        truePixelRadius,
        rawSvgRadiusPx,
        drawnR,
        boxHalf,
      };
    });

    const gapPx = bodies.length === 2 ? 120 : 54;
    const boxCenter: number[] = [];
    for (let i = 0; i < bodies.length; i++) {
      if (i === 0) {
        boxCenter.push(0);
      } else {
        boxCenter.push(
          boxCenter[i - 1] + drawnRadii[i - 1].boxHalf + gapPx + drawnRadii[i].boxHalf,
        );
      }
    }

    const minBoxLeft = boxCenter[0] - drawnRadii[0].boxHalf;
    const maxBoxRight = boxCenter[bodies.length - 1] + drawnRadii[bodies.length - 1].boxHalf;
    const shiftX = 600 - (minBoxLeft + maxBoxRight) / 2;

    return bodies.map((body, idx) => {
      const info = drawnRadii[idx];
      const anchorX = boxCenter[idx] + shiftX;
      let zoomedCenterX = anchorX;

      /** KI-Hinweis: Berücksichtigt bei schmaleren SVG-Silhouetten (Berg/Land) die reale horizontale Flankenbreite auf Höhe y = 0. */
      const edgeFactorX = this.getHorizontalEdgeFactor(body.id);
      const effectiveReachPx = info.drawnR * edgeFactorX;
      if (effectiveReachPx > info.boxHalf) {
        const anchorLeftSide = idx < focusIdx || (idx === focusIdx && idx === 0);
        zoomedCenterX = anchorLeftSide
          ? anchorX + info.boxHalf - effectiveReachPx
          : anchorX - info.boxHalf + effectiveReachPx;
      }

      const baseCenterX = Math.round(30 + slotWidth * idx + slotWidth / 2);
      const centerX = Number((baseCenterX * (1 - blend) + zoomedCenterX * blend).toFixed(1));
      const rawLabelX = baseCenterX * (1 - blend) + anchorX * blend;
      const labelX = Math.round(Math.max(95, Math.min(1105, rawLabelX)));

      return {
        slotIndex: idx,
        body,
        svgRadiusPx: info.drawnR,
        truePixelRadius: info.truePixelRadius,
        centerX,
        labelX,
      };
    });
  });

  /** Sortiert die SVG-Kreise von innen (kleinster Körper) nach außen, damit gestaffelte Horizonte sauber übereinanderliegen */
  readonly renderOrderedItems = computed<ScaledComparisonItem[]>(() => {
    const items = this.scaledItems();
    if (items.length <= 1) {
      return items;
    }
    let focusIdx = 0;
    for (let i = 1; i < items.length; i++) {
      if (items[i].body.diameterKm < items[focusIdx].body.diameterKm) {
        focusIdx = i;
      }
    }
    return [...items].sort(
      (a, b) => Math.abs(a.slotIndex - focusIdx) - Math.abs(b.slotIndex - focusIdx),
    );
  });

  /**
   * KI-generierter Block: Automatische Berechnung des Durchmesser- und Volumenverhältnisses
   * zwischen dem größten und dem kleinsten gewählten Himmelskörper (P30-A30 / P30-U20).
   */
  readonly comparisonSummary = computed<{
    largest: CelestialBody;
    smallest: CelestialBody;
    diameterRatio: number;
    volumeRatio: number;
    childQuestion: string;
    childAnswer: string;
  } | null>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length < 2) {
      return null;
    }

    const sorted = [...bodies].sort((a, b) => b.diameterKm - a.diameterKm);
    const largest = sorted[0];
    const smallest = sorted[sorted.length - 1];

    const diameterRatio = Number(
      (largest.diameterKm / Math.max(0.0000001, smallest.diameterKm)).toFixed(1),
    );
    const rawVolumeRatio = Math.pow(
      largest.diameterKm / Math.max(0.0000001, smallest.diameterKm),
      3,
    );
    const volumeRatio =
      rawVolumeRatio >= 100
        ? Math.round(rawVolumeRatio)
        : Number(rawVolumeRatio.toFixed(1));

    const hasNonSpherical =
      largest.id === 'mount-everest' ||
      largest.id === 'germany-size' ||
      smallest.id === 'mount-everest' ||
      smallest.id === 'germany-size';

    let childAnswer: string;
    if (largest.id === smallest.id) {
      childAnswer = `Du hast zweimal ${largest.name} ausgewählt – beide sind exakt gleich groß (Verhältnis 1 : 1)!`;
    } else if (hasNonSpherical) {
      childAnswer = `${largest.name} (${this.formatBodyDimension(largest)}) ist in seiner größten Ausdehnung rund ${diameterRatio.toLocaleString('de-DE')}-mal so groß wie ${smallest.name} (${this.formatBodyDimension(smallest)}).`;
    } else {
      childAnswer = `${largest.name} (${this.formatBodyDimension(largest)}) ist vom Durchmesser her rund ${diameterRatio.toLocaleString('de-DE')}-mal so breit wie ${smallest.name} (${this.formatBodyDimension(smallest)}). Vom Volumen (Rauminhalt) her würde ${smallest.name} sogar rund ${volumeRatio.toLocaleString('de-DE')}-mal in ${largest.name} hineinpassen!`;
    }

    return {
      largest,
      smallest,
      diameterRatio,
      volumeRatio,
      childQuestion: hasNonSpherical
        ? `Wie groß ist ${smallest.name} im Vergleich zu ${largest.name}?`
        : `Wie oft passt ${smallest.name} in ${largest.name}?`,
      childAnswer,
    };
  });

  async ngOnInit(): Promise<void> {
    await this.dataService.loadSolarSystemData();
  }

  /** Ändert die Auswahl eines Dropdown-Slots (P30-A20) */
  updateSelectionAt(slotIndex: number, newBodyId: string): void {
    this.selectedIds.update((current) => {
      const next = [...current];
      next[slotIndex] = newBodyId;
      return next;
    });
  }

  /** Fügt einen weiteren Himmelskörper zum Vergleich hinzu (bis zu 5 Körper gleichzeitig) */
  addComparisonSlot(): void {
    const current = this.selectedIds();
    if (current.length >= 5) {
      return;
    }
    const candidates = ['jupiter', 'mars', 'moon', 'saturn', 'mercury', 'beteigeuze'];
    const nextId = candidates.find((id) => !current.includes(id)) ?? 'mars';
    this.selectedIds.set([...current, nextId]);
  }

  /** Entfernt einen zusätzlichen Vergleichs-Slot (mindestens 2 bleiben erhalten) */
  removeComparisonSlot(slotIndex: number): void {
    if (this.selectedIds().length <= 2) {
      return;
    }
    this.selectedIds.update((current) => current.filter((_, i) => i !== slotIndex));
  }

  /** Aktiviert eine Schnellwahl-Kombination (P30-A20) */
  applyPreset(preset: ComparisonPreset): void {
    this.selectedIds.set([...preset.bodyIds]);
    this.zoomSliderPercent.set(0);
  }

  onZoomSliderInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.zoomSliderPercent.set(Math.min(100, Math.max(0, val)));
  }

  zoomIn(): void {
    this.zoomSliderPercent.update((v) => Math.min(100, Number((v + 8).toFixed(1))));
  }

  zoomOut(): void {
    this.zoomSliderPercent.update((v) => Math.max(0, Number((v - 8).toFixed(1))));
  }

  resetZoom(): void {
    this.zoomSliderPercent.set(0);
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  /** KI-Hinweis: Formatiert Durchmesser automatisch passend in cm, m oder km für Grundschulkinder. */
  formatDiameter(diameterKm: number): string {
    if (diameterKm < 0.001) {
      const cm = Number((diameterKm * 100_000).toFixed(1));
      return `${cm.toLocaleString('de-DE', { maximumFractionDigits: 1 })} cm`;
    }
    if (diameterKm < 1) {
      const meters = Number((diameterKm * 1_000).toFixed(1));
      return `${meters.toLocaleString('de-DE', { maximumFractionDigits: 1 })} m`;
    }
    const km = Number(diameterKm.toFixed(1));
    return `${km.toLocaleString('de-DE', { maximumFractionDigits: 1 })} km`;
  }

  /** KI-Hinweis: Liefert die reale horizontale Flankenbreite (Anteil von r auf Höhe y = 0) für nicht-kugelförmige SVGs. */
  getHorizontalEdgeFactor(bodyId: string): number {
    if (bodyId === 'mount-everest') {
      return 0.62;
    }
    if (bodyId === 'germany-size') {
      return 0.72;
    }
    return 1;
  }

  /** KI-Hinweis: Wählt eine sachlich und kindgerecht passende Maß-Bezeichnung (Höhe, Nord–Süd oder Ø). */
  formatBodyDimension(body: CelestialBody): string {
    const formatted = this.formatDiameter(body.diameterKm);
    if (body.id === 'mount-everest') {
      return `Höhe ${formatted}`;
    }
    if (body.id === 'germany-size') {
      return `Nord–Süd ${formatted}`;
    }
    return `Ø ${formatted}`;
  }
}
