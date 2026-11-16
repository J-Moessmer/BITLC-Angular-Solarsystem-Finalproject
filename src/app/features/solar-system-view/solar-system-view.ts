/**
 * Projekt / Modul: SSI App – Solar System Info App / SolarSystemViewComponent (solar-system-view.ts)
 * FCPP-Referenz: P10 (P10-U20, P10-U30, P10-U40) & P20 (P20-U10 bis P20-U40)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Interaktive 2D-SVG-Sonnensystem-Bühne mit stufenlosem Zoom (0 % bis 100 % Slider, Mausrad & Buttons) für JEDEN Himmelskörper, analytischem SVG-Orbit-Clipping gegen VM-Ruckeln und Echtzeit-Kepler-Tracking.
 */

import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { SolarSystemDataService } from '../../core/services/solar-system-data.service';
import {
  BodyRadiusScaleMode,
  SolarViewMode,
  SvgBodyPosition,
  ViewportStateService,
} from '../../core/services/viewport-state.service';
import { PathSidebarComponent } from '../../shared/components/path-sidebar/path-sidebar';
import { BreadcrumbBarComponent } from '../../shared/components/breadcrumb-bar/breadcrumb-bar';
import { InfoboxDetailComponent } from './infobox-detail/infobox-detail';
import { CelestialBody } from '../../core/models/celestial-body.model';

@Component({
  selector: 'app-solar-system-view',
  imports: [PathSidebarComponent, BreadcrumbBarComponent, InfoboxDetailComponent],
  templateUrl: './solar-system-view.html',
  styleUrl: './solar-system-view.css',
})
export class SolarSystemViewComponent implements OnInit, OnDestroy {
  protected readonly dataService = inject(SolarSystemDataService);
  protected readonly viewport = inject(ViewportStateService);
  private readonly router = inject(Router);

  /** Route-Parameter :bodyId aus /solar-system/:bodyId (via withComponentInputBinding) */
  readonly bodyId = input<string>();

  private readonly isDragging = signal<boolean>(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private timeLapseTimerId: ReturnType<typeof setInterval> | null = null;

  /** Alle im SVG-Canvas berechneten Positionen & Bahn-Geometrien (P10-U30, P10-U40) */
  protected readonly svgPositions = computed<SvgBodyPosition[]>(() => {
    const all = this.dataService.bodies();
    return all.map((b) => this.viewport.computeBodyPosition(b, all));
  });

  /** Hauptbahnen um die Sonne, die aktuell im Sichtfenster liegen (mit analytischem Orbit-Clipping!) */
  protected readonly primaryOrbitPositions = computed<SvgBodyPosition[]>(() =>
    this.svgPositions().filter(
      (p) =>
        p.body.parentId === 'sun' &&
        p.body.category !== 'spacecraft' &&
        p.isOrbitVisibleInViewport,
    ),
  );

  /** Sichtbare Mond- und Sonden-Umlaufbahnen rund um den aktuell betrachteten Planeten/Zwergplaneten */
  protected readonly satelliteOrbitPositions = computed<SvgBodyPosition[]>(() => {
    const selectedId = this.dataService.selectedBodyId();
    const selectedBody = this.dataService.selectedBody();
    const activeParentId =
      selectedBody?.parentId && selectedBody.parentId !== 'sun'
        ? selectedBody.parentId
        : selectedId;

    return this.svgPositions().filter(
      (p) =>
        p.body.parentId &&
        p.body.parentId !== 'sun' &&
        (p.body.parentId === activeParentId || p.body.id === selectedId) &&
        p.isOrbitVisibleInViewport,
    );
  });

  /** Sichtbare Himmelskörper in der 2D-SVG-Karte (mit Viewport-Culling außerhalb des Sichtfensters) */
  protected readonly visibleSvgBodies = computed<SvgBodyPosition[]>(() => {
    const selectedId = this.dataService.selectedBodyId();
    const selectedBody = this.dataService.selectedBody();
    const activeParentId =
      selectedBody?.parentId && selectedBody.parentId !== 'sun'
        ? selectedBody.parentId
        : selectedId;

    const alwaysVisibleProbes = new Set(['voyager', 'new-horizons', 'parker']);

    return this.svgPositions().filter((pos) => {
      // Viewport-Culling für Körper weit außerhalb des 1080x660 Fensters
      const r = pos.bodyRadiusPx + 40;
      if (pos.x + r < -580 || pos.x - r > 580 || pos.y + r < -370 || pos.y - r > 370) {
        return false;
      }

      if (pos.body.id === 'sun') {
        return true;
      }
      if (
        pos.body.parentId === 'sun' &&
        (pos.body.category !== 'spacecraft' || alwaysVisibleProbes.has(pos.body.id))
      ) {
        return true;
      }
      // Ab mittlerem Zoom (>= 12x) oder bei Auswahl des Mutterplaneten werden alle Monde & Sonden automatisch sichtbar!
      if (
        this.viewport.zoomLevel() >= 12 ||
        pos.body.id === selectedId ||
        pos.body.parentId === activeParentId
      ) {
        return true;
      }
      return false;
    });
  });

  /** Mutterkörper des aktuell ausgewählten Mondes/Raumschiffs (für P20 Rücksprung) */
  protected readonly selectedParentBody = computed<CelestialBody | null>(() => {
    const current = this.dataService.selectedBody();
    if (!current?.parentId) {
      return null;
    }
    return this.dataService.getBodyById(current.parentId) ?? null;
  });

  /** AE-Gitterkreise für den Modus "Echter Maßstab" (nur Kreise mit Radius <= 1.100 px, damit die VM nie ruckelt!) */
  protected readonly auReferenceCircles = computed<Array<{ au: number; radiusPx: number }>>(() => {
    const pxPerAu = this.viewport.pixelsPerAu;
    const z = this.viewport.zoomLevel();
    const candidates = [0.1, 0.25, 0.4, 0.7, 1, 1.5, 2, 5, 10, 20, 30, 40, 60, 100, 165];
    return candidates
      .map((au) => ({
        au,
        radiusPx: Math.round(au * pxPerAu * z),
      }))
      .filter((ring) => ring.radiusPx >= 18 && ring.radiusPx <= 1100);
  });

  constructor() {
    // 1. Effekt: Synchronisiert den Route-Parameter :bodyId beim Auswählen eines Körpers und setzt einen passenden Start-Zoom + Tracking.
    effect(() => {
      const routeBodyId = this.bodyId() ?? null;
      const bodies = this.dataService.bodies();

      untracked(() => {
        this.dataService.selectBody(routeBodyId);

        if (routeBodyId && bodies.length > 0) {
          const target = bodies.find((b) => b.id === routeBodyId);
          if (target) {
            const distAu = target.distanceFromSunAu;
            let targetZoom = 1.65;

            // Für die ISS, gelandete Oberflächen-Missionen (Apollo auf dem Mond, Perseverance auf dem Mars)
            // oder kleinere Planeten-/Zwergplanetensysteme setzen wir einen großzügigen Start-Zoom:
            if (target.id === 'iss') {
              targetZoom = 12000;
            } else if (target.isSurfaceLanded) {
              targetZoom = 9000; // Direkt nah an die Oberfläche von Erdmond (Apollo) bzw. Mars (Rover)!
            } else if (target.parentId && target.parentId !== 'sun') {
              targetZoom = 45; // Großzügiger Überblick über Planet/Zwergplanet + Mond/Raumsonde
            } else if (
              target.category === 'dwarf-planet' ||
              (target.category === 'planet' && target.childrenIds.length > 0)
            ) {
              targetZoom = this.viewport.viewMode() === 'true-scale' ? 28 : 3.2;
            } else if (this.viewport.viewMode() === 'true-scale') {
              if (distAu > 80) {
                targetZoom = 0.22; // Voyager
              } else if (distAu > 35) {
                targetZoom = 0.75; // Pluto / Eris
              } else if (distAu > 0 && distAu <= 2.0) {
                targetZoom = 9.0; // Innere Planeten
              } else {
                targetZoom = 1.8;
              }
            } else if (target.id === 'sun') {
              targetZoom = 1.25;
            }

            // Einmalig mit dem Ziel-Zoomfaktor berechnen, damit auch Mond-Offsets exakt stimmen
            this.viewport.setZoom(targetZoom);
            const pos = this.viewport.computeBodyPosition(target, bodies);
            this.viewport.focusOnPosition(pos.worldX, pos.worldY, targetZoom);
          }
        }
      });
    });

    // 2. Effekt: Verfolgt den ausgewählten Himmelskörper (Planet, Zwergplanet, Mond oder ISS/Sonde)
    // im Zeitraffer sowie beim stufenlosen Rein-/Rauszoomen (0 % bis 100 %) automatisch mit!
    effect(() => {
      const isTracking = this.viewport.isTrackingSelectedBody();
      const currentSimDate = this.viewport.simulationDate();
      const currentZoom = this.viewport.zoomLevel();
      const currentMode = this.viewport.viewMode();
      const selectedId = this.dataService.selectedBodyId();

      if (!isTracking || !selectedId || !currentSimDate || !currentZoom || !currentMode) {
        return;
      }

      untracked(() => {
        const bodies = this.dataService.bodies();
        const target = bodies.find((b) => b.id === selectedId);
        if (target) {
          const pos = this.viewport.computeBodyPosition(target, bodies);
          this.viewport.syncTrackedPosition(pos.worldX, pos.worldY);
        }
      });
    });
  }

  async ngOnInit(): Promise<void> {
    await this.dataService.loadSolarSystemData();
  }

  ngOnDestroy(): void {
    this.stopTimeLapse();
  }

  /** Startet oder pausiert den Echtzeit-Zeitraffer */
  toggleTimeLapse(): void {
    if (this.viewport.isTimeLapsePlaying()) {
      this.stopTimeLapse();
      return;
    }
    this.viewport.isTimeLapsePlaying.set(true);
    this.timeLapseTimerId = setInterval(() => {
      // Bei tiefem Zoom auf ISS/Monde langsamere Zeitschritte (0.05 Tage), sonst 4 Tage pro Frame
      const stepDays = this.viewport.zoomLevel() >= 500 ? 0.02 : 4;
      this.viewport.addSimulationDays(stepDays);
    }, 80);
  }

  stopTimeLapse(): void {
    this.viewport.isTimeLapsePlaying.set(false);
    if (this.timeLapseTimerId !== null) {
      clearInterval(this.timeLapseTimerId);
      this.timeLapseTimerId = null;
    }
  }

  resetToLiveNow(): void {
    this.stopTimeLapse();
    this.viewport.resetToRealTimeNow();
  }

  /** Auswahl eines Himmelskörpers im Pfad-Baum, Breadcrumb oder SVG-Canvas (P10-U20, P20-U30) */
  onSelectBody(targetId: string | null): void {
    if (!targetId) {
      this.onCloseInfobox();
      return;
    }
    if (this.dataService.selectedBodyId() === targetId) {
      const bodies = this.dataService.bodies();
      const target = bodies.find((b) => b.id === targetId);
      if (target) {
        const pos = this.viewport.computeBodyPosition(target, bodies);
        this.viewport.isTrackingSelectedBody.set(true);
        this.viewport.syncTrackedPosition(pos.worldX, pos.worldY);
      }
      return;
    }
    void this.router.navigate(['/solar-system', targetId]);
  }

  /** Schließt die Infobox P20 und setzt den Kamera-Fokus zurück (P20-U40) */
  onCloseInfobox(): void {
    this.dataService.clearSelection();
    this.viewport.resetCamera();
    void this.router.navigate(['/solar-system']);
  }

  /** Umschalten des Ansichtsmodus (Übersicht, Echter Maßstab, Seitenansicht) (P10-U40) */
  setViewMode(mode: SolarViewMode): void {
    this.viewport.setViewMode(mode);
  }

  /** Umschalten des Körper-Radien-Maßstabs innerhalb der SVG */
  setBodyScaleMode(scaleMode: BodyRadiusScaleMode): void {
    this.viewport.setBodyScaleMode(scaleMode);
  }

  /** Stufenloser Zoom-Slider (0 % bis 100 %) rechts im SVG-Panel */
  onZoomSliderInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.viewport.setZoomFromSliderPercent(val);
  }

  /** Mausrad-Zoom auf der SVG-Bühne (P10-U30) */
  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.viewport.zoomIn(0.2);
    } else {
      this.viewport.zoomOut(0.2);
    }
  }

  /** Startet das Verschieben (Drag/Pan) der SVG-Bühne (P10-U30) */
  onPointerDown(event: PointerEvent): void {
    const target = event.target as Element | null;
    if (target?.closest('.svg-body-group') || target?.closest('.zoom-controls-panel')) {
      return;
    }
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.viewport.panBy(dx, dy);
  }

  onPointerUp(): void {
    this.isDragging.set(false);
  }
}
