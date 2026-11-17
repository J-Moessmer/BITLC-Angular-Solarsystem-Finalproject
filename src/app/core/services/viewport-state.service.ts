/**
 * Projekt / Modul: SSI App – Solar System Info App / ViewportStateService (viewport-state.service.ts)
 * FCPP-Referenz: P10-U20, P10-U30, P10-U40, P20-U20, P20-U40
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Stufenloser logarithmischer Zoom (0 % bis 100 % Slider / 0.08x bis 18.000x) für JEDEN Himmelskörper mit analytischem SVG-Orbit-Clipping (verhindert VM-Stottern bei extremem Zoom) und nahtlosem Übergang bis auf echte Planetenradien & ISS-Flughöhe (408 km) mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, signal } from '@angular/core';
import { CelestialBody } from '../models/celestial-body.model';

export type SolarViewMode = 'overview' | 'true-scale' | 'side-view';
export type BodyRadiusScaleMode = 'didactic' | 'strict-distance-scale';

export interface SvgBodyPosition {
  body: CelestialBody;
  /** Bildschirm-/SVG-Koordinate X (inkl. Zoom & Pan) */
  x: number;
  /** Bildschirm-/SVG-Koordinate Y (inkl. Zoom & Pan) */
  y: number;
  /** Unskalierte Weltkoordinate X (in Basis-SVG-Einheiten, 1 AE = 10 Einheiten im AE-Maßstab) */
  worldX: number;
  /** Unskalierte Weltkoordinate Y */
  worldY: number;
  /** Große Halbachse a in SVG-Pixeln (inkl. Zoom) */
  orbitRxPx: number;
  /** Kleine Halbachse b = a * sqrt(1 - e^2) in SVG-Pixeln (inkl. Zoom) */
  orbitRyPx: number;
  /** Brennpunkt-Verschiebung c = a * e inkl. Pan & Zoom */
  orbitCenterX: number;
  orbitCenterY: number;
  /** Ob die Umlaufbahn im aktuellen Sichtfenster [-600..+600] überhaupt sichtbar ist (Viewport-Culling!) */
  isOrbitVisibleInViewport: boolean;
  /**
   * Falls der Bahnradius > 1.200 px ist (starker Zoom!), wird statt einer riesigen <ellipse>
   * nur das kurze sichtbare Kurvenstück im Viewport als SVG-Pfad ('M ... L ...') berechnet -> 60 FPS in VMs!
   */
  clippedOrbitPath: string | null;
  /** Exakt berechneter Körperradius in Bildschirm-Pixeln (kombiniert Mindest-Pin + wahren physischen Zoom-Radius!) */
  bodyRadiusPx: number;
  /** Wahrer physikalischer Radius in SVG-Pixeln bei aktuellem Zoomfaktor */
  strictTrueRadiusPx: number;
  /** Vertikale Auslenkung in der Seitenansicht (INC-Winkel) */
  inclinationYOffsetPx: number;
  /** Live berechneter ekliptikaler Positionswinkel in Grad (0°–360°) zum gewählten Datum */
  liveLongitudeDeg: number;
  /** Live berechneter aktueller Sonnenabstand r(t) in AE zum gewählten Datum */
  liveDistanceAu: number;
  /** Endpunkte der geneigten Bahnebene für die Seitenansicht (geclippt auf den Viewport!) */
  sideOrbitLine?: { x1: number; y1: number; x2: number; y2: number };
}

@Injectable({
  providedIn: 'root',
})
export class ViewportStateService {
  /**
   * Stufenloser Zoom-Bereich von 0.08x (Gesamtsystem bis Voyager/Oortsche Wolke)
   * bis 36.000x (doppelter Maximalzoom = neues 100 % auf dem Slider, damit auch kleine Systeme wie Mars/Phobos oder Pluto/Charon groß und detailreich sichtbar sind!).
   */
  readonly minZoom = 0.08;
  readonly maxZoom = 36000.0;
  readonly zoomStep = 0.45;

  /** 1 AE = 10 Welt-Einheiten im echten Abstandsmaßstab */
  readonly pixelsPerAu = 10;
  readonly astronomicalUnitKm = 149597870.7;

  /** Offizielle astronomische Epoche J2000.0: 01.01.2000, 12:00:00 UTC */
  private readonly j2000EpochMs = Date.UTC(2000, 0, 1, 12, 0, 0);
  private readonly msPerDay = 86400000;

  /** Angular Signals gemäß P10-U30 & P10-U40 + Echtzeit-Simulationsdatum */
  readonly zoomLevel = signal<number>(1.0);
  readonly panX = signal<number>(0);
  readonly panY = signal<number>(0);
  readonly viewMode = signal<SolarViewMode>('overview');
  readonly bodyScaleMode = signal<BodyRadiusScaleMode>('didactic');

  /** Aktuelles IRL-/Simulationsdatum für die Kepler-Ephemeridenberechnung */
  readonly simulationDate = signal<Date>(new Date());
  readonly isTimeLapsePlaying = signal<boolean>(false);

  /** Wenn true, folgt die Kamera im Zeitraffer sowie beim Rein-/Rauszoomen automatisch dem ausgewählten Himmelskörper */
  readonly isTrackingSelectedBody = signal<boolean>(true);

  /** Vergangene Tage seit Epoche J2000.0 (01.01.2000, 12:00 UTC) */
  readonly daysSinceJ2000 = computed<number>(() => {
    return (this.simulationDate().getTime() - this.j2000EpochMs) / this.msPerDay;
  });

  /** Formatiertes deutsches Datum für die UI-Anzeige */
  readonly formattedSimulationDate = computed<string>(() => {
    return this.simulationDate().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  });

  /** Kompatibilitäts-Signal für Tests & Debug-Anzeige */
  readonly svgTransform = computed<string>(() => {
    const z = this.zoomLevel();
    const x = this.panX();
    const y = this.panY();
    return `translate(${x}, ${y}) scale(${z})`;
  });

  /**
   * Logarithmischer Slider-Prozentwert von 0 % (minZoom = 0.08) bis 100 % (maxZoom = 18.000),
   * damit man mit dem Schieberegler oder Mausrad butterweich von der Milchstraßen-Grenze bis zur ISS zoomen kann!
   */
  readonly zoomSliderPercent = computed<number>(() => {
    const z = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel()));
    const ratio = Math.log(z / this.minZoom) / Math.log(this.maxZoom / this.minZoom);
    return Number((ratio * 100).toFixed(1));
  });

  readonly zoomPercentage = computed<number>(() => Math.round(this.zoomLevel() * 100));

  /** Maßstabsleiste (dynamisches Lineal von 25 AE bis hinunter zu 5.000 km!) unten links in der SVG-Bühne */
  readonly scaleRulerInfo = computed<{ widthPx: number; labelAu: string; labelKm: string }>(() => {
    const z = this.zoomLevel();
    const pxPerAuCurrent = this.pixelsPerAu * z;

    if (pxPerAuCurrent >= 15000) {
      const refKm = pxPerAuCurrent >= 60000 ? 2000 : pxPerAuCurrent >= 25000 ? 5000 : 10000;
      const widthPx = Math.min(
        180,
        Math.max(45, Math.round((refKm / this.astronomicalUnitKm) * pxPerAuCurrent)),
      );
      return {
        widthPx,
        labelAu: `${refKm.toLocaleString('de-DE')} km`,
        labelKm: 'Nahbereichs-Maßstab',
      };
    }

    const refAu =
      z >= 250
        ? 0.005
        : z >= 60
          ? 0.02
          : z >= 18
            ? 0.1
            : z >= 6
              ? 0.5
              : z >= 2.5
                ? 1
                : z >= 0.6
                  ? 5
                  : 25;
    const widthPx = Math.min(180, Math.max(45, Math.round(refAu * pxPerAuCurrent)));
    const kmVal = Number((refAu * 149.6).toFixed(2));
    return {
      widthPx,
      labelAu: `${refAu.toLocaleString('de-DE')} AE`,
      labelKm: `≈ ${kmVal.toLocaleString('de-DE')} Mio. km`,
    };
  });

  /** Setzt den Zoom über den stufenlosen 0 % – 100 % Slider (logarithmische Skala) */
  setZoomFromSliderPercent(percent: number): void {
    const clampedPct = Math.min(100, Math.max(0, percent));
    const targetZ =
      this.minZoom * Math.pow(this.maxZoom / this.minZoom, clampedPct / 100);
    this.setZoom(targetZ);
  }

  /** Stufenloses, multiplikatives Hineinzoomen (+ Button) (P10-U30) */
  zoomIn(step = this.zoomStep): void {
    const current = this.zoomLevel();
    const next = current < 1.5 ? current + step : current * 1.38;
    this.setZoom(next);
  }

  /** Stufenloses, multiplikatives Herauszoomen (- Button) (P10-U30) */
  zoomOut(step = this.zoomStep): void {
    const current = this.zoomLevel();
    const next = current <= 1.5 ? current - step : current / 1.38;
    this.setZoom(next);
  }

  /**
   * Zoomt mit dem Mausrad exakt auf die aktuelle Mauszeiger-Position (cursorSvgX, cursorSvgY)
   * innerhalb der SVG-ViewBox (-540..540, -330..330), sodass das anvisierte Objekt unter dem
   * Cursor fixiert bleibt und nicht zur Fenstermitte abdriftet.
   */
  zoomAtPoint(zoomInDirection: boolean, cursorSvgX: number, cursorSvgY: number, factor = 1.22): void {
    this.isTrackingSelectedBody.set(false);
    const zOld = this.zoomLevel();
    const rawNext = zoomInDirection ? zOld * factor : zOld / factor;
    const zNew = Math.min(this.maxZoom, Math.max(this.minZoom, Number(rawNext.toFixed(4))));
    if (zNew === zOld) {
      return;
    }

    const ratio = zNew / zOld;
    this.panX.update((px) => Number((cursorSvgX - (cursorSvgX - px) * ratio).toFixed(2)));
    this.panY.update((py) => Number((cursorSvgY - (cursorSvgY - py) * ratio).toFixed(2)));
    this.zoomLevel.set(zNew);
  }

  /** Setzt den Zoomfaktor innerhalb der erlaubten Grenzen [minZoom, maxZoom] */
  setZoom(targetZoom: number): void {
    const clamped = Math.min(this.maxZoom, Math.max(this.minZoom, Number(targetZoom.toFixed(3))));
    this.zoomLevel.set(clamped);
  }

  /** Verschiebt den Viewport per Drag/Pan und löst die automatische Kamera-Verfolgung (P10-U30) */
  panBy(deltaX: number, deltaY: number): void {
    this.isTrackingSelectedBody.set(false);
    this.panX.update((x) => Math.round(x + deltaX));
    this.panY.update((y) => Math.round(y + deltaY));
  }

  /** Setzt Kamera-Fokus und Zoom auf die Ausgangsansicht zurück (P10-U30, P20-U40) */
  resetCamera(): void {
    this.isTrackingSelectedBody.set(false);
    this.zoomLevel.set(1.0);
    this.panX.set(0);
    this.panY.set(0);
  }

  /** Setzt das Simulationsdatum zurück auf die aktuelle IRL-Echtzeit (Heute / Jetzt) */
  resetToRealTimeNow(): void {
    this.simulationDate.set(new Date());
  }

  /** Verschiebt das Simulationsdatum um eine bestimmte Anzahl von Erdtagen (für Zeitreise & Zeitraffer) */
  addSimulationDays(days: number): void {
    this.simulationDate.update((curr) => new Date(curr.getTime() + days * this.msPerDay));
  }

  /** Wechselt zwischen 'overview', 'true-scale' und 'side-view' (P10-U40) */
  setViewMode(mode: SolarViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'true-scale') {
      this.bodyScaleMode.set('strict-distance-scale');
    } else if (mode === 'overview') {
      this.bodyScaleMode.set('didactic');
    }
    this.resetCamera();
  }

  /** Wechselt die Körpergrößen-Skalierung innerhalb der SVG */
  setBodyScaleMode(scaleMode: BodyRadiusScaleMode): void {
    this.bodyScaleMode.set(scaleMode);
  }

  /**
   * KI-generierter Block: Echtzeit-Kepler-Ephemeriden-Solver!
   * Berechnet aus den 7 Bahnelementen (SMA, ECC, LPE, MNA zur Epoche J2000.0) sowie der Umlaufdauer
   * die aktuelle Exzentrische Anomalie E, die Wahre Anomalie nu, die aktuelle heliozentrische Länge lambda(t)
   * und den aktuellen Abstand r(t) in AE.
   */
  computeLiveKeplerState(body: CelestialBody): {
    longitudeDeg: number;
    eccentricAnomalyRad: number;
    trueAnomalyRad: number;
    currentDistanceAu: number;
  } {
    const days = this.daysSinceJ2000();
    const yearsSinceJ2000 = days / 365.25;

    if (body.id === 'voyager-1') {
      const liveDistAu = Math.max(30, Number((76.0 + 3.57 * yearsSinceJ2000).toFixed(2)));
      const lonRad = (255.4 * Math.PI) / 180;
      return {
        longitudeDeg: 255.4,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: liveDistAu,
      };
    }

    if (body.id === 'voyager-2') {
      const liveDistAu = Math.max(30, Number((61.0 + 3.13 * yearsSinceJ2000).toFixed(2)));
      const lonRad = (289.4 * Math.PI) / 180;
      return {
        longitudeDeg: 289.4,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: liveDistAu,
      };
    }

    if (body.id === 'new-horizons') {
      const yearsSince2006 = (days - 2209) / 365.25;
      const liveDistAu = Math.max(1.0, Number((1.0 + 2.92 * yearsSince2006).toFixed(2)));
      const lonRad = (293.5 * Math.PI) / 180;
      return {
        longitudeDeg: 293.5,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: liveDistAu,
      };
    }

    if (body.id === 'jwst' || body.id === 'gaia') {
      const earthMeanLonDeg = (102.95 + 357.52 + (360 / 365.256) * days) % 360;
      const normalizedEarthLon = (earthMeanLonDeg + 360) % 360;
      const offsetDeg = body.id === 'jwst' ? 2.5 : -2.5;
      const l2LonDeg = (normalizedEarthLon + offsetDeg + 360) % 360;
      const l2Rad = (l2LonDeg * Math.PI) / 180;
      return {
        longitudeDeg: Number(l2LonDeg.toFixed(1)),
        eccentricAnomalyRad: l2Rad,
        trueAnomalyRad: l2Rad,
        currentDistanceAu: 1.01,
      };
    }

    if (body.id === 'sun' || body.category === 'belt' || body.orbitalPeriodDays <= 0) {
      const staticRad = (body.orbitAngleDeg * Math.PI) / 180;
      return {
        longitudeDeg: body.orbitAngleDeg,
        eccentricAnomalyRad: staticRad,
        trueAnomalyRad: staticRad,
        currentDistanceAu: body.distanceFromSunAu,
      };
    }

    const m0Deg = body.orbitalElements.mna.numericValue ?? body.orbitAngleDeg;
    const lpeDeg = body.orbitalElements.lpe.numericValue ?? 0;
    const ecc = Math.min(0.88, Math.max(0, body.orbitalElements.ecc.numericValue ?? 0));
    const smaAu = body.orbitalElements.sma.numericValue ?? body.distanceFromSunAu;

    const meanMotionDegPerDay = 360.0 / body.orbitalPeriodDays;
    const currentMeanAnomalyDeg = (((m0Deg + meanMotionDegPerDay * days) % 360) + 360) % 360;
    const M = (currentMeanAnomalyDeg * Math.PI) / 180;

    let E = M + ecc * Math.sin(M);
    for (let i = 0; i < 5; i++) {
      const deltaE = (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
      E -= deltaE;
    }

    const sinHalfE = Math.sin(E / 2);
    const cosHalfE = Math.cos(E / 2);
    const nu =
      2 * Math.atan2(Math.sqrt(1 + ecc) * sinHalfE, Math.sqrt(1 - ecc) * cosHalfE);

    const rAu = Number((smaAu * (1 - ecc * Math.cos(E))).toFixed(3));
    const nuDeg = (nu * 180) / Math.PI;
    const longitudeDeg = Number(((((nuDeg + lpeDeg) % 360) + 360) % 360).toFixed(1));

    return {
      longitudeDeg,
      eccentricAnomalyRad: E,
      trueAnomalyRad: nu,
      currentDistanceAu: rAu,
    };
  }

  /**
   * KI-generierter Block: Berechnet den Körperradius stufenlos von der Übersicht bis zum tiefen Nahzoom!
   * - Bei kleinem/mittlerem Zoom bleibt der Körper ein feiner, gut klickbarer Punkt/Scheibe (ohne andere Bahnen zu verdecken).
   * - Sobald man tief an einen Himmelskörper heranzoomt, wächst die Kugel exakt mit ihrem wahren physikalischen Durchmesser
   *   mit, sodass bei vollem Zoom die echte Planetenoberfläche + ISS-Orbithöhe (408 km) + Mondbahnen sichtbar werden!
   */
  private computeScaledBodyRadius(body: CelestialBody): {
    displayRadiusPx: number;
    strictTrueRadiusPx: number;
  } {
    const z = this.zoomLevel();
    const radiusKm = body.diameterKm / 2;

    // Wahrer physikalischer Radius in Pixeln (mit verdoppelter lokaler Planeten-Skalierung:
    // 1 Erdradius = 0.0085 Welt-Einheiten + Mindestradien für kleinere Systeme wie Mars, Erdmond & Zwergplaneten,
    // sodass beim Reinzoomen auf 100 % Slider (36.000x) auch kleine Systeme groß und klar dargestellt werden!)
    const earthRadiusKm = 6378;
    const rawRatioToEarth = radiusKm / earthRadiusKm;
    // Sanfte Anhebung für kleinere Planeten/Monde/Zwergplaneten (Math.pow(..., 0.72)), damit Mars, Merkur, Pluto & Monde bei vollem Zoom nicht zu winzig bleiben
    const effectiveRatio =
      rawRatioToEarth < 1 ? Math.pow(rawRatioToEarth, 0.68) : Math.pow(rawRatioToEarth, 0.85);
    const physicalWorldRadius =
      body.id === 'sun'
        ? 0.065
        : Math.max(0.0008, effectiveRatio * 0.0065);

    const strictTrueRadiusPx = Number((physicalWorldRadius * z).toFixed(3));
    const scaleMode = this.bodyScaleMode();

    let minScreenPinPx = 2.6;
    if (scaleMode === 'strict-distance-scale') {
      minScreenPinPx = body.id === 'sun' ? 3.8 : 2.4;
    } else {
      minScreenPinPx =
        body.id === 'sun'
          ? 13.0
          : Number(Math.max(2.6, Math.min(9.0, body.overviewBodyRadiusSvg * 0.62)).toFixed(1));
    }

    // Für Gürtel (Asteroidengürtel, Oortscher Gürtel) oder Raumsonden: immer der feine Symbol-Punkt
    if (body.category === 'spacecraft' || body.category === 'belt') {
      return {
        displayRadiusPx: minScreenPinPx,
        strictTrueRadiusPx: minScreenPinPx,
      };
    }

    // Nahtloser Übergang: Maximum aus dem feinen Übersichts-Pin und der wahren physischen Kugelgröße beim Reinzoomen!
    const displayRadiusPx = Math.min(280, Math.max(minScreenPinPx, strictTrueRadiusPx));
    return {
      displayRadiusPx: Number(displayRadiusPx.toFixed(1)),
      strictTrueRadiusPx,
    };
  }

  /**
   * KI-generierter Block: Analytisches SVG-Orbit-Clipping!
   * Verhindert das Stottern in Windows-VMs bei hohem Zoom (> 1.000 % bis 1.800.000 %):
   * - Prüft zuerst, ob der Ellipsenring überhaupt durch das 1080x660 Sichtfenster läuft.
   * - Falls rx > 1.100 px ist, wird statt einer gigantischen <ellipse> nur das kurze sichtbare
   *   Kurvensegment (24 Stützpunkte im Sichtfenster) als SVG-<path> berechnet!
   */
  private computeOrbitClipping(
    centerX: number,
    centerY: number,
    rx: number,
    ry: number,
  ): { isVisible: boolean; clippedPath: string | null } {
    if (rx <= 0 || ry <= 0) {
      return { isVisible: false, clippedPath: null };
    }

    // Bei kleinen/mittleren Radien (< 1.100 px) zeichnet der Browser die normale <ellipse> ohne Probleme
    if (rx <= 1100 && ry <= 1100) {
      const inBounds =
        centerX + rx >= -600 &&
        centerX - rx <= 600 &&
        centerY + ry >= -400 &&
        centerY - ry <= 400;
      return { isVisible: inBounds, clippedPath: null };
    }

    // Bei riesigem Zoom (rx > 1.100 px): Richtung vom Ellipsenzentrum zur Bildschirmmitte (0, 0) bestimmen
    const distCenterToOrigin = Math.hypot(centerX, centerY);
    const meanR = (rx + ry) * 0.5;
    // Wenn der kürzeste Abstand der Bahnlinie zur Bildschirmmitte > 700 px ist, liegt die Bahn komplett außerhalb des Bildes!
    if (Math.abs(distCenterToOrigin - meanR) > 750) {
      return { isVisible: false, clippedPath: null };
    }

    // Winkel von (centerX, centerY) zum Ursprung (0, 0)
    const baseAngle = Math.atan2(-centerY, -centerX);
    // Öffnungswinkel, der maximal ~900 px Bogenlänge im Sichtfenster abdeckt
    const halfSpanRad = Math.min(Math.PI, Math.max(0.0002, 750 / Math.max(1, rx)));
    const steps = 24;
    const points: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = baseAngle - halfSpanRad + (2 * halfSpanRad * i) / steps;
      const x = (centerX + rx * Math.cos(t)).toFixed(1);
      const y = (centerY + ry * Math.sin(t)).toFixed(1);
      points.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
    }

    return {
      isVisible: true,
      clippedPath: points.join(' '),
    };
  }

  /**
   * KI-generierter Block: Berechnet die unskalierten Welt-Koordinaten und Bildschirmkoordinaten
   * jedes Himmelskörpers, Mondes und jeder Raumsonde für den stufenlosen Zoom (0 % bis 100 %).
   */
  computeBodyPosition(body: CelestialBody, allBodies: CelestialBody[] = []): SvgBodyPosition {
    const mode = this.viewMode();
    const z = this.zoomLevel();
    const px = this.panX();
    const py = this.panY();
    const { displayRadiusPx, strictTrueRadiusPx } = this.computeScaledBodyRadius(body);
    const kepler = this.computeLiveKeplerState(body);

    if (body.id === 'sun') {
      return {
        body,
        x: px,
        y: py,
        worldX: 0,
        worldY: 0,
        orbitRxPx: 0,
        orbitRyPx: 0,
        orbitCenterX: px,
        orbitCenterY: py,
        isOrbitVisibleInViewport: false,
        clippedOrbitPath: null,
        bodyRadiusPx: displayRadiusPx,
        strictTrueRadiusPx,
        inclinationYOffsetPx: 0,
        liveLongitudeDeg: 0,
        liveDistanceAu: 0,
      };
    }

    // Für Monde, planetare Raumstationen (ISS) sowie gelandete Oberflächen-Missionen (Apollo auf dem Mond, Perseverance auf dem Mars):
    if (body.parentId && body.parentId !== 'sun') {
      const parent = allBodies.find((b) => b.id === body.parentId);
      const parentPos = parent
        ? this.computeBodyPosition(parent, allBodies)
        : {
            x: px,
            y: py,
            worldX: 0,
            worldY: 0,
            bodyRadiusPx: 6,
            strictTrueRadiusPx: 1,
            liveDistanceAu: body.distanceFromSunAu,
          };

      // Spezialfall: Gelandete Oberflächen-Missionen (isSurfaceLanded === true, z. B. Apollo 11-17 auf dem Erdmond, Rover Perseverance & Curiosity auf dem Mars)
      // Sitzen direkt auf der Oberfläche ihres Zielkörpers und haben KEINE eigene Umlaufbahn im All!
      if (body.isSurfaceLanded) {
        const landAngleRad = (-body.orbitAngleDeg * Math.PI) / 180;
        const surfaceDistancePx = Math.max(1.5, parentPos.bodyRadiusPx * 0.68);
        const worldSurfaceRadius = surfaceDistancePx / Math.max(0.001, z);
        const landWorldX = Number(
          (parentPos.worldX + Math.cos(landAngleRad) * worldSurfaceRadius).toFixed(5),
        );
        const landWorldY = Number(
          (parentPos.worldY + Math.sin(landAngleRad) * worldSurfaceRadius).toFixed(5),
        );

        return {
          body,
          x: Number((parentPos.x + Math.cos(landAngleRad) * surfaceDistancePx).toFixed(1)),
          y: Number((parentPos.y + Math.sin(landAngleRad) * surfaceDistancePx).toFixed(1)),
          worldX: landWorldX,
          worldY: landWorldY,
          orbitRxPx: 0,
          orbitRyPx: 0,
          orbitCenterX: parentPos.x,
          orbitCenterY: parentPos.y,
          isOrbitVisibleInViewport: false,
          clippedOrbitPath: null,
          bodyRadiusPx: 2.6,
          strictTrueRadiusPx: 2.6,
          inclinationYOffsetPx: 0,
          liveLongitudeDeg: body.orbitAngleDeg,
          liveDistanceAu: parentPos.liveDistanceAu,
        };
      }

      const angleRad = (-kepler.longitudeDeg * Math.PI) / 180;
      const parentTrueR = parentPos.strictTrueRadiusPx;

      // Physikalische Bahnhöhe relativ zum wahren Radius des Mutterplaneten beim Reinzoomen:
      let physicalOrbitPx = parentTrueR * 1.5;
      if (body.id === 'iss') {
        // ISS kreist in 408 km Höhe über dem 6.378 km Erdradius (r = 1.064 * R_Erde; +18% optischer Mindestspalt für die gestrichelte Linie)
        physicalOrbitPx = parentTrueR * 1.16;
      } else if (body.id === 'apollo' || body.id === 'artemis') {
        physicalOrbitPx = parentTrueR * 2.2;
      } else if (body.id === 'moon') {
        physicalOrbitPx = parentTrueR * 4.2;
      } else {
        physicalOrbitPx = parentTrueR * (1.45 + (body.overviewOrbitRadiusSvg - 10) * 0.14);
      }

      const minOverviewOrbitPx =
        parentPos.bodyRadiusPx + Math.max(9, body.overviewOrbitRadiusSvg * 0.72);
      const screenOrbitRadius = Number(
        Math.max(minOverviewOrbitPx, physicalOrbitPx).toFixed(1),
      );

      // Welt-Koordinaten des Mondes/Satelliten (damit Kamera-Tracking auch direkt auf die ISS oder einen Mond zoomen kann!)
      const worldOffsetRadius = screenOrbitRadius / Math.max(0.001, z);
      const childWorldX = Number((parentPos.worldX + Math.cos(angleRad) * worldOffsetRadius).toFixed(5));
      const childWorldY = Number((parentPos.worldY + Math.sin(angleRad) * worldOffsetRadius).toFixed(5));

      const orbitClip = this.computeOrbitClipping(
        parentPos.x,
        parentPos.y,
        screenOrbitRadius,
        screenOrbitRadius,
      );

      if (mode === 'side-view') {
        const incDeg = Math.min(60, body.inclinationToSolarEquatorDeg);
        const incRad = (incDeg * Math.PI) / 180;
        const yOff = Number((-Math.sin(incRad) * screenOrbitRadius * 0.5).toFixed(1));
        return {
          body,
          x: Number((parentPos.x + Math.cos(angleRad) * screenOrbitRadius).toFixed(1)),
          y: Number((parentPos.y + yOff).toFixed(1)),
          worldX: childWorldX,
          worldY: Number((parentPos.worldY + yOff / Math.max(0.001, z)).toFixed(5)),
          orbitRxPx: screenOrbitRadius,
          orbitRyPx: screenOrbitRadius,
          orbitCenterX: parentPos.x,
          orbitCenterY: parentPos.y,
          isOrbitVisibleInViewport: orbitClip.isVisible,
          clippedOrbitPath: orbitClip.clippedPath,
          bodyRadiusPx: Math.max(2.2, displayRadiusPx),
          strictTrueRadiusPx,
          inclinationYOffsetPx: yOff,
          liveLongitudeDeg: kepler.longitudeDeg,
          liveDistanceAu: parentPos.liveDistanceAu,
        };
      }

      return {
        body,
        x: Number((parentPos.x + Math.cos(angleRad) * screenOrbitRadius).toFixed(1)),
        y: Number((parentPos.y + Math.sin(angleRad) * screenOrbitRadius).toFixed(1)),
        worldX: childWorldX,
        worldY: childWorldY,
        orbitRxPx: screenOrbitRadius,
        orbitRyPx: screenOrbitRadius,
        orbitCenterX: parentPos.x,
        orbitCenterY: parentPos.y,
        isOrbitVisibleInViewport: orbitClip.isVisible,
        clippedOrbitPath: orbitClip.clippedPath,
        bodyRadiusPx: Math.max(2.2, displayRadiusPx),
        strictTrueRadiusPx,
        inclinationYOffsetPx: 0,
        liveLongitudeDeg: kepler.longitudeDeg,
        liveDistanceAu: parentPos.liveDistanceAu,
      };
    }

    // Große Halbachse a (SMA) und Exzentrizität e (ECC) für Hauptkörper um die Sonne
    const ecc = Math.min(0.75, Math.max(0, body.orbitalElements.ecc.numericValue ?? 0));
    const effectiveAu =
      body.id === 'voyager-1' || body.id === 'voyager-2' || body.id === 'new-horizons'
        ? kepler.currentDistanceAu
        : body.distanceFromSunAu;

    let worldSemiMajorPx = body.overviewOrbitRadiusSvg;
    if (mode === 'true-scale') {
      if (body.id === 'oort-cloud') {
        worldSemiMajorPx = 220 * this.pixelsPerAu;
      } else {
        worldSemiMajorPx = Number((effectiveAu * this.pixelsPerAu).toFixed(3));
      }
    }

    const worldSemiMinorPx = Number((worldSemiMajorPx * Math.sqrt(1 - ecc * ecc)).toFixed(3));
    const worldFocusOffsetX =
      mode === 'true-scale' ? Number((-worldSemiMajorPx * ecc).toFixed(3)) : 0;

    const scaledRx = Number((worldSemiMajorPx * z).toFixed(1));
    const scaledRy = Number((worldSemiMinorPx * z).toFixed(1));
    const scaledCenterX = Number((px + worldFocusOffsetX * z).toFixed(1));
    const scaledCenterY = py;

    // 2. Seitenansicht (P10-U40): 2D-Querschnitt entlang der Sonnenäquator-Ebene mit echtem INC-Neigungswinkel
    if (mode === 'side-view') {
      const incRad = (body.inclinationToSolarEquatorDeg * Math.PI) / 180;
      const lonRad = (kepler.longitudeDeg * Math.PI) / 180;
      const sideProjection = Math.cos(lonRad) >= 0 ? 1 : -1;
      const worldX = Number((sideProjection * Math.cos(incRad) * worldSemiMajorPx).toFixed(3));
      const worldY = Number((-sideProjection * Math.sin(incRad) * worldSemiMajorPx).toFixed(3));

      const screenX = Number((px + worldX * z).toFixed(1));
      const screenY = Number((py + worldY * z).toFixed(1));
      const clampedLineLen = Math.min(2000, scaledRx);
      const dxLine = Math.round(Math.cos(incRad) * clampedLineLen);
      const dyLine = Math.round(Math.sin(incRad) * clampedLineLen);

      return {
        body,
        x: screenX,
        y: screenY,
        worldX,
        worldY,
        orbitRxPx: scaledRx,
        orbitRyPx: scaledRy,
        orbitCenterX: px,
        orbitCenterY: py,
        isOrbitVisibleInViewport: true,
        clippedOrbitPath: null,
        bodyRadiusPx: displayRadiusPx,
        strictTrueRadiusPx,
        inclinationYOffsetPx: Number((worldY * z).toFixed(1)),
        liveLongitudeDeg: kepler.longitudeDeg,
        liveDistanceAu: kepler.currentDistanceAu,
        sideOrbitLine: {
          x1: px - dxLine,
          y1: py + dyLine,
          x2: px + dxLine,
          y2: py - dyLine,
        },
      };
    }

    // 3. Draufsicht auf die elliptische Bahn mit analytischem SVG-Orbit-Clipping gegen VM-Stottern!
    const angleRad = (-kepler.longitudeDeg * Math.PI) / 180;
    const worldX = Number((worldFocusOffsetX + Math.cos(angleRad) * worldSemiMajorPx).toFixed(4));
    const worldY = Number((Math.sin(angleRad) * worldSemiMinorPx).toFixed(4));
    const orbitClip = this.computeOrbitClipping(
      scaledCenterX,
      scaledCenterY,
      scaledRx,
      scaledRy,
    );

    return {
      body,
      x: Number((px + worldX * z).toFixed(1)),
      y: Number((py + worldY * z).toFixed(1)),
      worldX,
      worldY,
      orbitRxPx: scaledRx,
      orbitRyPx: scaledRy,
      orbitCenterX: scaledCenterX,
      orbitCenterY: scaledCenterY,
      isOrbitVisibleInViewport: orbitClip.isVisible,
      clippedOrbitPath: orbitClip.clippedPath,
      bodyRadiusPx: displayRadiusPx,
      strictTrueRadiusPx,
      inclinationYOffsetPx: 0,
      liveLongitudeDeg: kepler.longitudeDeg,
      liveDistanceAu: kepler.currentDistanceAu,
    };
  }

  /** Zentriert die Kamera auf die Weltkoordinaten (worldX, worldY) eines gewählten Himmelskörpers und aktiviert Kamera-Tracking (P10-U20) */
  focusOnPosition(worldX: number, worldY: number, targetZoom = 1.65): void {
    this.isTrackingSelectedBody.set(true);
    this.setZoom(targetZoom);
    const z = this.zoomLevel();
    this.panX.set(Math.round(-worldX * z));
    this.panY.set(Math.round(-worldY * z));
  }

  /** Hält das verfolgte Objekt (worldX, worldY) im Zentrum, während der aktuelle Zoomfaktor (auch beim stufenlosen Rein-/Rauszoomen!) erhalten bleibt */
  syncTrackedPosition(worldX: number, worldY: number): void {
    const z = this.zoomLevel();
    this.panX.set(Math.round(-worldX * z));
    this.panY.set(Math.round(-worldY * z));
  }
}
