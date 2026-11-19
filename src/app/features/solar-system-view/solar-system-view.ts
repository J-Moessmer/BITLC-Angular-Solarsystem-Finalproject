/**
 * Projekt / Modul: SSI App – Solar System Info App / SolarSystemViewComponent (solar-system-view.ts)
 * FCPP-Referenz: P10 (P10-U20, P10-U30, P10-U40) & P20 (P20-U10 bis P20-U40)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v2.2
 * Hinweis: Interaktive 2D-SVG-Sonnensystem-Bühne mit stufenlosem Zoom, analytischem SVG-Orbit-Clipping, Echtzeit-Kepler-Tracking sowie strikter Fokus-Filterung & maßstabsgerechter Skalierung aller 40 Lagrange-Punkte (L1-L5) auch im Echten Maßstab.
 */

import {
  Component,
  HostListener,
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
  readonly isStageFullscreen = signal<boolean>(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private timeLapseTimerId: ReturnType<typeof setInterval> | null = null;

  /** Objekt- & Zeitfilter für die 2D-SVG-Karte */
  readonly showPlanetsAndMoons = signal<boolean>(true);
  readonly showDwarfPlanets = signal<boolean>(true);
  readonly showComets = signal<boolean>(true);
  readonly showBelts = signal<boolean>(true);
  readonly showSpacecraft = signal<boolean>(true);
  readonly lagrangeFilterMode = signal<'context' | 'all' | 'off'>('context');
  readonly filterSpacecraftByDate = signal<boolean>(true);

  readonly lagrangeFilterLabel = computed<string>(() => {
    switch (this.lagrangeFilterMode()) {
      case 'context':
        return 'Lagrange-Punkte: Fokus (Planet)';
      case 'all':
        return 'Lagrange-Punkte: Alle (40)';
      case 'off':
        return 'Lagrange-Punkte: Aus';
    }
  });

  /** Ermittelt den zugehörigen Planeten, wenn ein Planet, Mond, L-Punkt oder planetare Sonde ausgewählt ist */
  readonly focusedLagrangePlanetId = computed<string | null>(() => {
    const selected = this.dataService.selectedBody();
    if (!selected) {
      return null;
    }
    if (selected.category === 'planet') {
      return selected.id;
    }
    if (selected.id === 'jwst' || selected.id === 'gaia') {
      return 'earth';
    }
    if (selected.parentId) {
      const parent = this.dataService.getBodyById(selected.parentId);
      if (parent?.category === 'planet') {
        return parent.id;
      }
    }
    return null;
  });

  cycleLagrangeFilterMode(): void {
    this.lagrangeFilterMode.update((mode) =>
      mode === 'context' ? 'all' : mode === 'all' ? 'off' : 'context',
    );
  }

  /** Alle im SVG-Canvas berechneten Positionen & Bahn-Geometrien (P10-U30, P10-U40) */
  protected readonly svgPositions = computed<SvgBodyPosition[]>(() => {
    const all = this.dataService.bodies();
    return all.map((b) => this.viewport.computeBodyPosition(b, all));
  });

  /** Hauptbahnen um die Sonne, die aktuell im Sichtfenster liegen (ohne Oortsche Wolke, die als sphärische Wolke gezeichnet wird) */
  protected readonly primaryOrbitPositions = computed<SvgBodyPosition[]>(() => {
    const selectedId = this.dataService.selectedBodyId();
    return this.svgPositions().filter(
      (p) =>
        p.body.parentId === 'sun' &&
        p.body.id !== 'oort-cloud' &&
        (p.body.category !== 'spacecraft' ||
          p.body.id === 'parker' ||
          p.body.id === 'solar-orbiter' ||
          p.body.id === selectedId) &&
        p.isOrbitVisibleInViewport &&
        this.isBodyVisibleByFilter(p.body),
    );
  });

  /** Sphärische Hülle der Oortschen Wolke (kreist nicht auf einer einzelnen Orbit-Linie) */
  protected readonly oortCloudShell = computed<SvgBodyPosition | null>(() => {
    const oort = this.svgPositions().find((p) => p.body.id === 'oort-cloud');
    if (!oort || !this.isBodyVisibleByFilter(oort.body)) {
      return null;
    }
    return oort;
  });

  /** Echte Free-Return-Achterbahn für Apollo 13 zwischen Erde und Mondrückseite (keine Mond-Umlaufbahn!) */
  protected readonly apollo13FreeReturnPath = computed<string | null>(() => {
    const selectedId = this.dataService.selectedBodyId();
    const selectedBody = this.dataService.selectedBody();
    const showApollo13 =
      selectedId === 'apollo-13' ||
      selectedBody?.id === 'moon' ||
      selectedBody?.id === 'earth' ||
      this.viewport.zoomLevel() >= 12;

    if (!showApollo13) {
      return null;
    }
    const apollo13 = this.svgPositions().find((p) => p.body.id === 'apollo-13');
    if (!apollo13 || !this.isBodyVisibleByFilter(apollo13.body)) {
      return null;
    }
    const earth = this.svgPositions().find((p) => p.body.id === 'earth');
    const moon = this.svgPositions().find((p) => p.body.id === 'moon');
    if (!earth || !moon) {
      return null;
    }

    const dx = moon.x - earth.x;
    const dy = moon.y - earth.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 10 || dist > 6000) {
      return null;
    }
    const ux = dx / dist;
    const uy = dy / dist;
    const px = -uy;
    const py = ux;

    // Sicherer Mindestabstand rund um den Mondkörper, damit die Bahn niemals in den Mond klippt
    const moonClearance = moon.bodyRadiusPx + 18;
    const earthStartX = earth.x + ux * (earth.bodyRadiusPx + 4);
    const earthStartY = earth.y + uy * (earth.bodyRadiusPx + 4);
    const farX = moon.x + ux * moonClearance;
    const farY = moon.y + uy * moonClearance;
    const sideTopX = moon.x + px * moonClearance;
    const sideTopY = moon.y + py * moonClearance;
    const sideBotX = moon.x - px * moonClearance;
    const sideBotY = moon.y - py * moonClearance;
    const midX = earth.x + dx * 0.52;
    const midY = earth.y + dy * 0.52;
    const midSpread = Math.max(moonClearance * 0.9, dist * 0.16);

    // Saubere Free-Return-Schleife: Erde -> außen über die Mond-Nordseite -> hinter die Mondrückseite -> außen unter der Mond-Südseite -> zurück zur Erde
    return [
      `M ${earthStartX.toFixed(1)} ${earthStartY.toFixed(1)}`,
      `Q ${(midX + px * midSpread).toFixed(1)} ${(midY + py * midSpread).toFixed(1)}, ${sideTopX.toFixed(1)} ${sideTopY.toFixed(1)}`,
      `Q ${(farX + px * moonClearance).toFixed(1)} ${(farY + py * moonClearance).toFixed(1)}, ${farX.toFixed(1)} ${farY.toFixed(1)}`,
      `Q ${(farX - px * moonClearance).toFixed(1)} ${(farY - py * moonClearance).toFixed(1)}, ${sideBotX.toFixed(1)} ${sideBotY.toFixed(1)}`,
      `Q ${(midX - px * midSpread).toFixed(1)} ${(midY - py * midSpread).toFixed(1)}, ${earthStartX.toFixed(1)} ${earthStartY.toFixed(1)}`,
    ].join(' ');
  });

  /** KI-generierter Block: Berechnet die Hilfslinien für Lagrange-Punkte abhängig vom 3-Stufen-Filter (Fokus (Planet) / Alle / Aus) sowie Mindest-Bahnradius im Echten Maßstab */
  protected readonly lagrangeGuideGeometry = computed<{
    isHighlighted: boolean;
    l1ToL2Lines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number; color: string }>;
    l2HaloCircle: { cx: number; cy: number; r: number } | null;
    triangleLines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number; color: string }>;
  } | null>(() => {
    const mode = this.lagrangeFilterMode();
    if (mode === 'off') {
      return null;
    }

    const focusedPid = this.focusedLagrangePlanetId();
    if (mode === 'context' && !focusedPid) {
      return null;
    }

    const isTrueScale = this.viewport.viewMode() === 'true-scale';
    const selectedBody = this.dataService.selectedBody();
    const positions = this.svgPositions();
    const byId = (id: string) => positions.find((p) => p.body.id === id);
    const sun = byId('sun');
    if (!sun) {
      return null;
    }

    const planetIds = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const l1ToL2Lines: Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    }> = [];

    for (const pid of planetIds) {
      const prefix = pid === 'earth' ? 'lagrange' : pid;
      const pPos = byId(pid);
      if (!pPos || (isTrueScale && pPos.orbitRxPx < 36)) {
        continue;
      }
      const l1 = byId(`${prefix}-l1`);
      const l2 = byId(`${prefix}-l2`);
      if (!l1 || !l2 || Math.hypot(l1.x - l2.x, l1.y - l2.y) > 12000) {
        continue;
      }
      const includeAxis = mode === 'all' || pid === focusedPid;
      if (includeAxis) {
        l1ToL2Lines.push({
          id: `${pid}-l1-l2`,
          x1: l1.x,
          y1: l1.y,
          x2: l2.x,
          y2: l2.y,
          color: pid === 'earth' ? '#FDE047' : pPos.body.colorHex,
        });
      }
    }

    const earthPos = byId('earth');
    const earthL2 = byId('lagrange-l2');
    const showEarthL2Halo =
      earthL2 &&
      (!isTrueScale || (earthPos !== undefined && earthPos.orbitRxPx >= 36)) &&
      Math.abs(earthL2.x) <= 900 &&
      Math.abs(earthL2.y) <= 700 &&
      (mode === 'all' || focusedPid === 'earth');
    const l2HaloCircle = showEarthL2Halo ? { cx: earthL2.x, cy: earthL2.y, r: 8 } : null;

    const trianglePid = focusedPid ?? (mode === 'all' ? 'earth' : null);
    const triangleLines: Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    }> = [];

    if (trianglePid && this.viewport.viewMode() !== 'side-view') {
      const focusPrefix = trianglePid === 'earth' ? 'lagrange' : trianglePid;
      const focusedPlanet = byId(trianglePid);
      const focusColor =
        trianglePid === 'earth' ? '#FDE047' : (focusedPlanet?.body.colorHex ?? '#FDE047');

      if (focusedPlanet && (!isTrueScale || focusedPlanet.orbitRxPx >= 36)) {
        const l1 = byId(`${focusPrefix}-l1`);
        const l3 = byId(`${focusPrefix}-l3`);
        const l4 = byId(`${focusPrefix}-l4`);
        const l5 = byId(`${focusPrefix}-l5`);

        const addSegment = (
          id: string,
          a: SvgBodyPosition | undefined,
          b: SvgBodyPosition | undefined,
        ): void => {
          if (!a || !b) {
            return;
          }
          if (Math.hypot(a.x - b.x, a.y - b.y) <= 12000) {
            triangleLines.push({ id, x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: focusColor });
          }
        };

        addSegment('sun-l4', sun, l4);
        addSegment('planet-l4', focusedPlanet, l4);
        addSegment('sun-l5', sun, l5);
        addSegment('planet-l5', focusedPlanet, l5);
        addSegment('sun-l3', sun, l3);
        addSegment('sun-l1', sun, l1);
      }
    }

    const isLagrangeFocused = Boolean(
      selectedBody &&
        focusedPid &&
        (selectedBody.id === focusedPid ||
          selectedBody.parentId === focusedPid ||
          selectedBody.id === 'jwst' ||
          selectedBody.id === 'gaia'),
    );

    return {
      isHighlighted: isLagrangeFocused,
      l1ToL2Lines,
      l2HaloCircle,
      triangleLines,
    };
  });

  /** Sichtbare Mond- und Sonden-Umlaufbahnen rund um den aktuell betrachteten Planeten/Zwergplaneten (ohne Apollo-13-Kreisbahn) */
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
        p.body.id !== 'apollo-13' &&
        p.body.category !== 'lagrange' &&
        (p.body.parentId === activeParentId || p.body.id === selectedId) &&
        p.isOrbitVisibleInViewport &&
        this.isBodyVisibleByFilter(p.body),
    );
  });

  /** Sichtbare Himmelskörper in der 2D-SVG-Karte (mit Viewport-Culling & Objekt-/Historien-Filter) */
  protected readonly visibleSvgBodies = computed<SvgBodyPosition[]>(() => {
    const selectedId = this.dataService.selectedBodyId();
    const selectedBody = this.dataService.selectedBody();
    const activeParentId =
      selectedBody?.parentId && selectedBody.parentId !== 'sun'
        ? selectedBody.parentId
        : selectedId;

    const alwaysVisibleProbes = new Set(['voyager-1', 'voyager-2', 'new-horizons', 'parker']);

    return this.svgPositions().filter((pos) => {
      if (!this.isBodyVisibleByFilter(pos.body)) {
        return false;
      }

      // Viewport-Culling für Körper weit außerhalb des 1080x660 Fensters
      const r = pos.bodyRadiusPx + 40;
      if (pos.x + r < -580 || pos.x - r > 580 || pos.y + r < -370 || pos.y - r > 370) {
        return false;
      }

      if (pos.body.category === 'lagrange') {
        if (
          this.viewport.viewMode() === 'true-scale' &&
          pos.orbitRxPx < 36 &&
          pos.body.id !== selectedId
        ) {
          return false;
        }
        return true;
      }
      if (pos.body.id === 'sun') {
        return true;
      }
      if (
        (pos.body.id === 'jwst' || pos.body.id === 'gaia') &&
        (selectedId === 'lagrange-l2' || selectedId === 'earth' || this.viewport.zoomLevel() >= 3)
      ) {
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

  /** Prüft, ob ein Himmelskörper bzw. eine Raumsonde gemäß Kategorie- und Datumsfilter sichtbar ist */
  private isBodyVisibleByFilter(body: CelestialBody): boolean {
    if (body.category === 'lagrange') {
      const mode = this.lagrangeFilterMode();
      if (mode === 'off') {
        return false;
      }
      if (mode === 'all') {
        return true;
      }
      return body.parentId === this.focusedLagrangePlanetId();
    }
    if (body.id === 'sun' || body.id === this.dataService.selectedBodyId()) {
      return true;
    }
    switch (body.category) {
      case 'planet':
      case 'moon':
        return this.showPlanetsAndMoons();
      case 'dwarf-planet':
        return this.showDwarfPlanets();
      case 'comet':
        return this.showComets();
      case 'belt':
        return this.showBelts();
      case 'spacecraft':
        if (!this.showSpacecraft()) {
          return false;
        }
        return (
          !this.filterSpacecraftByDate() ||
          this.viewport.isSpacecraftActiveAtSimulationDate(body.id)
        );
      default:
        return true;
    }
  }

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
            const targetZoom = this.computeTargetZoomForBody(target);

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

  /** Startet oder pausiert den Echtzeit-Zeitraffer mit adaptiver, aliasing-freier Schrittweite (~30 FPS) */
  toggleTimeLapse(): void {
    if (this.viewport.isTimeLapsePlaying()) {
      this.stopTimeLapse();
      return;
    }
    this.viewport.isTimeLapsePlaying.set(true);
    this.timeLapseTimerId = setInterval(() => {
      this.viewport.addSimulationDays(this.computeTimeLapseStepDays());
    }, 33);
  }

  /**
   * KI-generierter Block: Berechnet eine adaptive, aliasing-freie Zeitraffer-Schrittweite (Tage pro Frame).
   * Verhindert das Stroboskop-Rückwärtslaufen schneller innerer Monde (z. B. Phobos, Enceladus, Io)
   * sowie das Einfrieren äußerer/langsamer Monde bei hohem Nahzoom (Earth/Moon, Titan, Kallisto, Hydra).
   */
  computeTimeLapseStepDays(): number {
    const selected = this.dataService.selectedBody();
    const z = this.viewport.zoomLevel();
    const leoIds = new Set(['iss', 'tiangong', 'hubble', 'sputnik-1', 'vostok-1']);

    if (selected && (leoIds.has(selected.id) || (selected.id === 'earth' && z >= 2500))) {
      return 0.004;
    }

    if (
      selected &&
      (selected.category === 'planet' ||
        selected.category === 'dwarf-planet' ||
        selected.category === 'moon')
    ) {
      const systemParentId =
        selected.category === 'moon' ? (selected.parentId ?? selected.id) : selected.id;
      const systemMoons = this.dataService
        .bodies()
        .filter(
          (b) =>
            b.parentId === systemParentId &&
            b.category === 'moon' &&
            b.orbitalPeriodDays > 0,
        );
      if (systemMoons.length > 0) {
        const minMoonPeriodDays = Math.min(...systemMoons.map((m) => m.orbitalPeriodDays));
        return Number(Math.min(0.65, Math.max(0.025, minMoonPeriodDays * 0.095)).toFixed(4));
      }
    }

    return z >= 12 ? 0.14 : 1.2;
  }

  stopTimeLapse(): void {
    this.viewport.isTimeLapsePlaying.set(false);
    if (this.timeLapseTimerId !== null) {
      clearInterval(this.timeLapseTimerId);
      this.timeLapseTimerId = null;
    }
  }

  readonly historicalMilestones = [
    { isoDate: '1957-10-04', label: '04.10.1957 · Sputnik 1 (Erster Satellit)', bodyId: 'sputnik-1' },
    { isoDate: '1961-04-12', label: '12.04.1961 · Wostok 1 (Juri Gagarin)', bodyId: 'vostok-1' },
    { isoDate: '1969-07-20', label: '20.07.1969 · Apollo 11 (Mondlandung)', bodyId: 'apollo-11' },
    { isoDate: '1970-04-14', label: '14.04.1970 · Apollo 13 (Mond-Umrundung)', bodyId: 'apollo-13' },
    { isoDate: '1986-02-09', label: '09.02.1986 · Halleyscher Komet (Sonnennähe)', bodyId: 'halley' },
    { isoDate: '1989-08-25', label: '25.08.1989 · Voyager 2 bei Neptun', bodyId: 'voyager-2' },
    { isoDate: '1997-04-01', label: '01.04.1997 · Komet Hale-Bopp', bodyId: 'hale-bopp' },
    { isoDate: '2014-11-12', label: '12.11.2014 · Rosetta & Philae auf 67P', bodyId: 'rosetta' },
    { isoDate: '2015-07-14', label: '14.07.2015 · New Horizons bei Pluto', bodyId: 'new-horizons' },
    { isoDate: '2020-07-03', label: '03.07.2020 · Komet NEOWISE (Sonnennähe)', bodyId: 'neowise' },
  ];

  resetToLiveNow(): void {
    this.stopTimeLapse();
    this.viewport.resetToRealTimeNow();
  }

  onDateInputChange(event: Event): void {
    this.stopTimeLapse();
    const isoDate = (event.target as HTMLInputElement).value;
    this.viewport.setSimulationDateIso(isoDate);
  }

  onHistoricalMilestoneSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const isoDate = select.value;
    if (!isoDate) {
      return;
    }
    this.stopTimeLapse();
    this.viewport.setSimulationDateIso(isoDate);
    const milestone = this.historicalMilestones.find((m) => m.isoDate === isoDate);
    if (milestone) {
      this.onSelectBody(milestone.bodyId);
    }
    select.value = '';
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
    const activeBody = this.dataService.selectedBody();
    const bodies = this.dataService.bodies();
    if (activeBody && bodies.length > 0) {
      const targetZoom = this.computeTargetZoomForBody(activeBody);
      this.viewport.setZoom(targetZoom);
      const pos = this.viewport.computeBodyPosition(activeBody, bodies);
      this.viewport.focusOnPosition(pos.worldX, pos.worldY, targetZoom);
    }
  }

  /** KI-Hinweis: Berechnet den passenden Ziel-Zoom für einen Himmelskörper (im Echten Maßstab entfernungsproportional zur Bahn). */
  private computeTargetZoomForBody(target: CelestialBody): number {
    const distAu = target.distanceFromSunAu;
    const isTrueScale = this.viewport.viewMode() === 'true-scale';

    if (target.id === 'iss') {
      return 12000;
    }
    if (target.id === 'jwst' || target.id === 'gaia') {
      return isTrueScale ? 45 : 6.5;
    }
    if (target.category === 'lagrange') {
      const pt = target.id.slice(-2).toLowerCase();
      if (pt === 'l1' || pt === 'l2') {
        return isTrueScale
          ? Math.max(1.5, 45 / Math.max(1, distAu))
          : distAu > 3
            ? 2.8
            : 6.5;
      }
      return isTrueScale
        ? Math.max(0.25, 9 / Math.max(0.4, distAu))
        : distAu > 10
          ? 0.9
          : 1.65;
    }
    if (target.isSurfaceLanded) {
      return 9000;
    }
    if (target.parentId && target.parentId !== 'sun') {
      return 45;
    }
    if (target.category === 'planet') {
      return isTrueScale
        ? Number(Math.min(45, Math.max(0.75, 22 / Math.max(0.38, distAu))).toFixed(2))
        : target.childrenIds.length > 0
          ? 3.2
          : 1.65;
    }
    if (target.category === 'dwarf-planet') {
      return isTrueScale ? 28 : 3.2;
    }
    if (target.category === 'comet') {
      if (isTrueScale) {
        const liveAu = this.viewport.computeLiveKeplerState(target).currentDistanceAu;
        return Number(Math.min(35, Math.max(0.35, 22 / Math.max(0.28, liveAu))).toFixed(2));
      }
      return 1.35;
    }
    if (isTrueScale) {
      if (distAu > 80) {
        return 0.22;
      }
      if (distAu > 35) {
        return 0.75;
      }
      if (distAu > 0 && distAu <= 2.0) {
        return 9.0;
      }
      return 1.8;
    }
    if (target.id === 'sun') {
      return 1.25;
    }
    return 1.65;
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

  /** Mausrad-Zoom auf die aktuelle Mauszeiger-Position innerhalb der SVG-Bühne (P10-U30) */
  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const wrapper = event.currentTarget as HTMLElement | null;
    const svgEl = wrapper?.querySelector('svg.solar-system-svg') as SVGSVGElement | null;

    let cursorSvgX = 0;
    let cursorSvgY = 0;
    if (svgEl) {
      const rect = svgEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const vbWidth = 1080;
        const vbHeight = 660;
        const scale = Math.min(rect.width / vbWidth, rect.height / vbHeight);
        const offsetX = (rect.width - vbWidth * scale) / 2;
        const offsetY = (rect.height - vbHeight * scale) / 2;
        cursorSvgX = (event.clientX - rect.left - offsetX) / scale - vbWidth / 2;
        cursorSvgY = (event.clientY - rect.top - offsetY) / scale - vbHeight / 2;
      }
    }

    this.viewport.zoomAtPoint(event.deltaY < 0, cursorSvgX, cursorSvgY);
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

  toggleStageFullscreen(stageWrapper: HTMLElement): void {
    const entering = !this.isStageFullscreen();
    this.isStageFullscreen.set(entering);

    if (typeof document !== 'undefined') {
      if (entering && typeof stageWrapper.requestFullscreen === 'function') {
        void stageWrapper.requestFullscreen().catch(() => {
          // CSS-Vollbild-Fallback bleibt aktiv
        });
      } else if (!entering && document.fullscreenElement && typeof document.exitFullscreen === 'function') {
        void document.exitFullscreen().catch(() => {
          // Ignorieren
        });
      }
    }
  }

  @HostListener('document:fullscreenchange')
  onNativeFullscreenChange(): void {
    if (typeof document !== 'undefined' && !document.fullscreenElement) {
      this.isStageFullscreen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeFullscreen(): void {
    if (this.isStageFullscreen()) {
      this.isStageFullscreen.set(false);
    }
  }

  /** Liefert das passende Font-Awesome-7-Icon-Zeichen für Raumsonden, Rover, Teleskope & Kometen in der 2D-SVG-Karte */
  protected getSvgIconGlyph(body: CelestialBody): string | null {
    if (body.category === 'comet') {
      return '\uf753'; // fa-meteor
    }
    if (body.category !== 'spacecraft') {
      return null;
    }
    const id = body.id;
    if (
      id === 'iss' ||
      id === 'tiangong' ||
      id === 'sputnik-1' ||
      id === 'solar-orbiter' ||
      id === 'dawn' ||
      id === 'juno' ||
      id === 'juice'
    ) {
      return '\uf7bf'; // fa-satellite
    }
    if (id === 'jwst' || id === 'gaia' || id === 'hubble' || id === 'voyager-1' || id === 'voyager-2') {
      return '\uf7c0'; // fa-satellite-dish
    }
    if (
      id === 'perseverance' ||
      id === 'zhurong' ||
      id === 'lunokhod-1' ||
      id === 'change-4' ||
      id === 'curiosity' ||
      id === 'opportunity' ||
      id === 'spirit' ||
      id === 'sojourner'
    ) {
      return '\uf544'; // fa-robot
    }
    if (id.startsWith('apollo') || id === 'artemis' || id === 'vostok-1') {
      return '\uf135'; // fa-rocket
    }
    return '\uf197'; // fa-shuttle-space
  }
}
