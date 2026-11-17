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
   * sowie die horizontale Anordnung nebeneinander auf der SVG-Vergleichsbühne (P30-U20).
   */
  readonly scaledItems = computed<ScaledComparisonItem[]>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length === 0) {
      return [];
    }

    const maxDiameter = Math.max(...bodies.map((b) => b.diameterKm), 1);
    const totalWidth = 1140;
    const slotWidth = totalWidth / bodies.length;
    const maxAllowedRadiusPx = Math.min(205, Math.floor(slotWidth * 0.44));

    return bodies.map((body, idx) => {
      const trueRatio = body.diameterKm / maxDiameter;
      const truePixelRadius = Number((trueRatio * maxAllowedRadiusPx).toFixed(2));
      // Mindestens 2.5 px für das bloße Auge + Lupenring bei extremem Größenunterschied (z. B. Sonne vs. Erde)
      const svgRadiusPx = Math.max(2.5, truePixelRadius);
      const centerX = Math.round(30 + slotWidth * idx + slotWidth / 2);

      return {
        slotIndex: idx,
        body,
        svgRadiusPx,
        truePixelRadius,
        centerX,
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
  }
}
