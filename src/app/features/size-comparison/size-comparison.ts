/**
 * Projekt / Modul: SSI App – Solar System Info App / SizeComparisonComponent (size-comparison.ts)
 * FCPP-Referenz: P30-U10 (A10), P30-U20 (A20, A30 – Maßstabs- & Größenvergleich)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.2
 * Hinweis: Vollständige Umsetzung von Plan-Element P30 mit Dropdown-Auswahl, Schnellwahl-Presets, proportionaler SVG-Vergleichsbühne sowie automatischer Durchmesser- und Volumenverhältnis-Berechnung mit KI-Unterstützung erstellt.
 */

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolarSystemDataService } from '../../core/services/solar-system-data.service';
import { CelestialBody } from '../../core/models/celestial-body.model';

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

  /** Stufenloser Zoom-Slider (0 % = Übersicht, 100 % = tiefer Nahvergleich am Rand des größten Körpers) */
  readonly zoomSliderPercent = signal<number>(0);

  /** Dynamischer Maximal-Zoom passend zum Größenverhältnis der gewählten Körper */
  readonly maxZoomFactor = computed<number>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length < 2) {
      return 12;
    }
    const sorted = [...bodies].sort((a, b) => b.diameterKm - a.diameterKm);
    const largest = sorted[0].diameterKm;
    const second = Math.max(1, sorted[1].diameterKm);
    return Math.min(80, Math.max(8, Math.round((largest / second) * 0.25)));
  });

  readonly zoomFactor = computed<number>(() => {
    const pct = this.zoomSliderPercent();
    const maxZ = this.maxZoomFactor();
    return Number(Math.pow(maxZ, pct / 100).toFixed(3));
  });

  /** Kindgerechte Schnellwahl-Presets gemäß P30-A20 */
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
  ];

  /** Vergleichbare Himmelskörper (Sonne, Planeten, Zwergplaneten, Monde – ohne Gürtel) */
  readonly comparableBodies = computed<CelestialBody[]>(() =>
    this.dataService
      .bodies()
      .filter((b) => b.category !== 'belt' && b.category !== 'spacecraft'),
  );

  /** Aktuell gewählte CelestialBody-Objekte */
  readonly selectedBodies = computed<CelestialBody[]>(() => {
    const list = this.comparableBodies();
    return this.selectedIds()
      .map((id) => list.find((b) => b.id === id))
      .filter((b): b is CelestialBody => b !== undefined);
  });

  /**
   * KI-generierter Block: Berechnet die exakt proportionalen SVG-Radien zum größten gewählten Körper
   * sowie die dynamische Rand-zu-Rand-Verschiebung beim Reinzoomen (P30-U20), sodass alle Körper
   * im Bild bleiben und der gekrümmte Rand des Riesenobjekts neben den kleinen Objekten erscheint.
   */
  readonly scaledItems = computed<ScaledComparisonItem[]>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length === 0) {
      return [];
    }

    const maxDiameter = Math.max(...bodies.map((b) => b.diameterKm), 1);
    const totalWidth = 1140;
    const slotWidth = totalWidth / bodies.length;
    const baseMaxRadiusPx = Math.min(205, Math.floor(slotWidth * 0.44));
    const zoom = this.zoomFactor();
    const blend = Math.min(1, Math.max(0, (zoom - 1) / 0.8));

    const zoomedRadii = bodies.map((b) => {
      const trueRatio = b.diameterKm / maxDiameter;
      const truePixelRadius = Number((trueRatio * baseMaxRadiusPx * zoom).toFixed(2));
      return {
        truePixelRadius,
        svgRadiusPx: Math.max(2.5, truePixelRadius),
      };
    });

    // 1. Kompaktes Rand-zu-Rand-Layout für den Zoom-Modus (hält alle Objekte mittig im 1200px Sichtfeld!)
    const gapPx = bodies.length === 2 ? 160 : 72;
    const edgeCenters: number[] = [];
    for (let i = 0; i < bodies.length; i++) {
      if (i === 0) {
        edgeCenters.push(0);
      } else {
        edgeCenters.push(
          edgeCenters[i - 1] + zoomedRadii[i - 1].svgRadiusPx + gapPx + zoomedRadii[i].svgRadiusPx,
        );
      }
    }

    // Finde das größte Objekt und zentriere die sichtbare Komposition symmetrisch um x = 600
    let largestIdx = 0;
    for (let i = 1; i < bodies.length; i++) {
      if (bodies[i].diameterKm > bodies[largestIdx].diameterKm) {
        largestIdx = i;
      }
    }

    const largestR = zoomedRadii[largestIdx].svgRadiusPx;
    const minX = edgeCenters[0] - zoomedRadii[0].svgRadiusPx;
    const maxX = edgeCenters[bodies.length - 1] + zoomedRadii[bodies.length - 1].svgRadiusPx;
    const fullSpan = maxX - minX;

    // Wenn ein Riesenobjekt am Rand über die Bühne hinauswächst, blenden wir den Ankerpunkt
    // fließend von der Außenkante auf den sichtbaren Innenrand, sodass der Abstand zur Mitte (x = 600) gleich bleibt.
    const overflowBlend = Math.min(1, Math.max(0, (fullSpan - 760) / 360));
    let anchorLeft = minX;
    let anchorRight = maxX;

    if (largestIdx === 0) {
      const visibleLimbLeft = edgeCenters[0] + largestR;
      anchorLeft = minX * (1 - overflowBlend) + visibleLimbLeft * overflowBlend;
    } else if (largestIdx === bodies.length - 1) {
      const visibleLimbRight = edgeCenters[largestIdx] - largestR;
      anchorRight = maxX * (1 - overflowBlend) + visibleLimbRight * overflowBlend;
    }

    let shiftX = 600 - (anchorLeft + anchorRight) / 2;
    if (largestIdx === 0) {
      const lastRight = maxX + shiftX;
      if (lastRight > 1130) {
        shiftX -= lastRight - 1130;
      }
    } else if (largestIdx === bodies.length - 1) {
      const firstLeft = minX + shiftX;
      if (firstLeft < 70) {
        shiftX += 70 - firstLeft;
      }
    }

    return bodies.map((body, idx) => {
      const baseCenterX = Math.round(30 + slotWidth * idx + slotWidth / 2);
      const zoomedCenterX = edgeCenters[idx] + shiftX;
      const centerX = Number((baseCenterX * (1 - blend) + zoomedCenterX * blend).toFixed(1));
      const labelX = Math.max(110, Math.min(1090, centerX));

      return {
        slotIndex: idx,
        body,
        svgRadiusPx: zoomedRadii[idx].svgRadiusPx,
        truePixelRadius: zoomedRadii[idx].truePixelRadius,
        centerX,
        labelX,
      };
    });
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

    const diameterRatio = Number((largest.diameterKm / Math.max(1, smallest.diameterKm)).toFixed(1));
    const rawVolumeRatio = Math.pow(largest.diameterKm / Math.max(1, smallest.diameterKm), 3);
    const volumeRatio =
      rawVolumeRatio >= 100
        ? Math.round(rawVolumeRatio)
        : Number(rawVolumeRatio.toFixed(1));

    return {
      largest,
      smallest,
      diameterRatio,
      volumeRatio,
      childQuestion: `Wie oft passt ${smallest.name} in ${largest.name}?`,
      childAnswer:
        largest.id === smallest.id
          ? `Du hast zweimal ${largest.name} ausgewählt – beide sind exakt gleich groß (Verhältnis 1 : 1)!`
          : `${largest.name} (${largest.diameterKm.toLocaleString('de-DE')} km) ist vom Durchmesser her rund ${diameterRatio.toLocaleString('de-DE')}-mal so breit wie ${smallest.name} (${smallest.diameterKm.toLocaleString('de-DE')} km). Vom Volumen (Rauminhalt) her würde ${smallest.name} sogar rund ${volumeRatio.toLocaleString('de-DE')}-mal in ${largest.name} hineinpassen!`,
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
    const candidates = ['jupiter', 'mars', 'moon', 'saturn', 'mercury'];
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
    this.zoomSliderPercent.update((v) => Math.min(100, v + 10));
  }

  zoomOut(): void {
    this.zoomSliderPercent.update((v) => Math.max(0, v - 10));
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
}
