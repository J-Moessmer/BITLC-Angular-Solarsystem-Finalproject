/**
 * Projekt / Modul: SSI App – Solar System Info App / ViewportStateService (viewport-state.service.ts)
 * FCPP-Referenz: P10-U20, P10-U30, P10-U40, P20-U40
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Signal-basierter State- und Geometrie-Service für den 2D-SVG-Viewport (stufenloser Zoom, Drag/Pan sowie Umschaltung zwischen Übersicht, Echtem Maßstab in AE und Seitenansicht mit Bahnneigung zum Sonnenäquator) mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, signal } from '@angular/core';
import { CelestialBody } from '../models/celestial-body.model';

export type SolarViewMode = 'overview' | 'true-scale' | 'side-view';

export interface SvgBodyPosition {
  body: CelestialBody;
  x: number;
  y: number;
  orbitRadiusPx: number;
  bodyRadiusPx: number;
  inclinationYOffsetPx: number;
}

@Injectable({
  providedIn: 'root',
})
export class ViewportStateService {
  readonly minZoom = 0.4;
  readonly maxZoom = 5.0;
  readonly zoomStep = 0.25;

  /** Angular Signals gemäß P10-U30 & P10-U40 */
  readonly zoomLevel = signal<number>(1.0);
  readonly panX = signal<number>(0);
  readonly panY = signal<number>(0);
  readonly viewMode = signal<SolarViewMode>('overview');

  /** CSS/SVG Transform-String für die interaktive Bühne (P10-U30) */
  readonly svgTransform = computed<string>(() => {
    const z = this.zoomLevel();
    const x = this.panX();
    const y = this.panY();
    return `translate(${x}px, ${y}px) scale(${z})`;
  });

  readonly zoomPercentage = computed<number>(() => Math.round(this.zoomLevel() * 100));

  /** Stufenloses Hineinzoomen (+ Button / Mausrad) (P10-U30) */
  zoomIn(step = this.zoomStep): void {
    this.setZoom(this.zoomLevel() + step);
  }

  /** Stufenloses Herauszoomen (- Button / Mausrad) (P10-U30) */
  zoomOut(step = this.zoomStep): void {
    this.setZoom(this.zoomLevel() - step);
  }

  /** Setzt den Zoomfaktor innerhalb der erlaubten Grenzen [minZoom, maxZoom] */
  setZoom(targetZoom: number): void {
    const clamped = Math.min(this.maxZoom, Math.max(this.minZoom, Number(targetZoom.toFixed(2))));
    this.zoomLevel.set(clamped);
  }

  /** Verschiebt den Viewport per Drag/Pan (P10-U30) */
  panBy(deltaX: number, deltaY: number): void {
    this.panX.update((x) => Math.round(x + deltaX));
    this.panY.update((y) => Math.round(y + deltaY));
  }

  /** Setzt Kamera-Fokus und Zoom auf die Ausgangsansicht zurück (P10-U30, P20-U40) */
  resetCamera(): void {
    this.zoomLevel.set(1.0);
    this.panX.set(0);
    this.panY.set(0);
  }

  /** Wechselt zwischen 'overview', 'true-scale' und 'side-view' (P10-U40) */
  setViewMode(mode: SolarViewMode): void {
    this.viewMode.set(mode);
    this.resetCamera();
  }

  /**
   * KI-generierter Block: Berechnet die 2D-SVG-Koordinaten eines Himmelskörpers
   * abhängig vom gewählten Ansichtsmodus (Übersicht, Echter AE-Maßstab, Seitenansicht mit INC-Winkel) (P10-U40).
   */
  computeBodyPosition(body: CelestialBody, allBodies: CelestialBody[] = []): SvgBodyPosition {
    const mode = this.viewMode();

    if (body.id === 'sun') {
      return {
        body,
        x: 0,
        y: 0,
        orbitRadiusPx: 0,
        bodyRadiusPx: mode === 'true-scale' ? 14 : body.overviewBodyRadiusSvg,
        inclinationYOffsetPx: 0,
      };
    }

    // Für Monde/Raumstationen: Position relativ zum Mutterplaneten berechnen
    if (body.parentId && body.parentId !== 'sun') {
      const parent = allBodies.find((b) => b.id === body.parentId);
      const parentPos = parent
        ? this.computeBodyPosition(parent, allBodies)
        : { x: 0, y: 0, bodyRadiusPx: 10 };
      const angleRad = (body.orbitAngleDeg * Math.PI) / 180;
      const localRadius = parentPos.bodyRadiusPx + body.overviewOrbitRadiusSvg;

      if (mode === 'side-view') {
        const incRad = (body.inclinationToSolarEquatorDeg * Math.PI) / 180;
        return {
          body,
          x: Math.round(parentPos.x + Math.cos(angleRad) * localRadius),
          y: Math.round(parentPos.y - Math.sin(incRad) * localRadius * 0.45),
          orbitRadiusPx: localRadius,
          bodyRadiusPx: Math.max(3, body.overviewBodyRadiusSvg),
          inclinationYOffsetPx: Math.round(-Math.sin(incRad) * localRadius * 0.45),
        };
      }

      return {
        body,
        x: Math.round(parentPos.x + Math.cos(angleRad) * localRadius),
        y: Math.round(parentPos.y + Math.sin(angleRad) * localRadius),
        orbitRadiusPx: localRadius,
        bodyRadiusPx: Math.max(3, body.overviewBodyRadiusSvg),
        inclinationYOffsetPx: 0,
      };
    }

    // 1. Echter Abstandsmaßstab in Astronomischen Einheiten (AE) (P10-U40)
    // 1 AE = 14 px (Neptun bei 30 AE = 420 px; Gürtel am Rand begrenzt, damit im Canvas erreichbar)
    const trueScaleRadiusPx =
      body.distanceFromSunAu > 45
        ? 475
        : Math.max(20, Math.round(body.distanceFromSunAu * 13.5 + 16));

    const orbitRadiusPx =
      mode === 'true-scale' ? trueScaleRadiusPx : body.overviewOrbitRadiusSvg;

    // 2. Seitenansicht (P10-U40): 2D-Querschnitt entlang der Sonnenäquator-Ebene mit INC-Neigungswinkel
    if (mode === 'side-view') {
      const incRad = (body.inclinationToSolarEquatorDeg * Math.PI) / 180;
      // Vertikale Auslenkung über Sinus der Bahnneigung (verstärkt um Faktor 2.2 für kindgerechte Erkennbarkeit)
      const yOffset = Math.round(-Math.sin(incRad) * orbitRadiusPx * 2.2);
      const xSide = Math.round(orbitRadiusPx * (body.orbitAngleDeg > 180 ? -0.85 : 0.85));
      return {
        body,
        x: xSide,
        y: yOffset,
        orbitRadiusPx,
        bodyRadiusPx: body.overviewBodyRadiusSvg,
        inclinationYOffsetPx: yOffset,
      };
    }

    // 3. Draufsicht (Übersicht oder Echter Maßstab)
    const angleRad = (body.orbitAngleDeg * Math.PI) / 180;
    return {
      body,
      x: Math.round(Math.cos(angleRad) * orbitRadiusPx),
      y: Math.round(Math.sin(angleRad) * orbitRadiusPx),
      orbitRadiusPx,
      bodyRadiusPx: mode === 'true-scale' ? Math.max(4, Math.round(body.overviewBodyRadiusSvg * 0.7)) : body.overviewBodyRadiusSvg,
      inclinationYOffsetPx: 0,
    };
  }

  /** Zentriert die Kamera per Smooth-Transition auf einen gewählten Himmelskörper (P10-U20) */
  focusOnPosition(x: number, y: number, targetZoom = 1.65): void {
    this.zoomLevel.set(targetZoom);
    this.panX.set(Math.round(-x * targetZoom * 0.55));
    this.panY.set(Math.round(-y * targetZoom * 0.55));
  }
}
