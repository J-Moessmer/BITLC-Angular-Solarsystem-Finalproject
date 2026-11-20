/**
 * Projekt / Modul: SSI App – Solar System Info App / ViewportStateService (viewport-state.service.ts)
 * FCPP-Referenz: P10-U20, P10-U30, P10-U40, P20-U20, P20-U40
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v2.2
 * Hinweis: Stufenloser logarithmischer Zoom (0 % bis 100 % Slider / 0.08x bis 36.000x) für JEDEN Himmelskörper, analytisches SVG-Orbit-Clipping, Vanguard-1-Startdatum-Filter (1958) und präzise Geometrie für alle 40 Lagrange-Punkte (L1-L5) sowie JWST & Gaia mit KI-Unterstützung erstellt.
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
  /** Rotationswinkel der Bahnellipse in der 2D-Draufsicht (in Grad, aus LPE/AOP/LAN) */
  orbitRotationDeg?: number;
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

  /** Offizielle Start- bzw. Landedaten (ISO) für die historische Sichtbarkeitsfilterung von Raumsonden & Missionen */
  readonly spacecraftActiveFromIso: Readonly<Record<string, string>> = {
    'sputnik-1': '1957-10-04',
    'vanguard-1': '1958-03-17',
    'vostok-1': '1961-04-12',
    'apollo-11': '1969-07-20',
    'apollo-12': '1969-11-19',
    'apollo-13': '1970-04-11',
    'lunokhod-1': '1970-11-17',
    'apollo-14': '1971-02-05',
    'apollo-15': '1971-07-30',
    'apollo-16': '1972-04-21',
    'apollo-17': '1972-12-11',
    'voyager-2': '1977-08-20',
    'voyager-1': '1977-09-05',
    'venera-13': '1982-03-01',
    hubble: '1990-04-24',
    sojourner: '1997-07-04',
    cassini: '1997-10-15',
    iss: '1998-11-20',
    spirit: '2004-01-04',
    opportunity: '2004-01-25',
    rosetta: '2004-03-02',
    'new-horizons': '2006-01-19',
    dawn: '2007-09-27',
    juno: '2011-08-05',
    curiosity: '2012-08-06',
    gaia: '2013-12-19',
    'hayabusa-2': '2014-12-03',
    parker: '2018-08-12',
    bepicolombo: '2018-10-20',
    'change-4': '2019-01-03',
    'solar-orbiter': '2020-02-10',
    perseverance: '2021-02-18',
    tiangong: '2021-04-29',
    zhurong: '2021-05-14',
    jwst: '2021-12-25',
    artemis: '2022-11-16',
    juice: '2023-04-14',
    'chandrayaan-3': '2023-08-23',
    slim: '2024-01-19',
  };

  /** Prüft, ob eine Raumsonde / Mission zum aktuellen Simulationsdatum bereits gestartet war */
  isSpacecraftActiveAtSimulationDate(bodyId: string): boolean {
    const launchIso = this.spacecraftActiveFromIso[bodyId];
    if (!launchIso) {
      return true;
    }
    return this.isoSimulationDate() >= launchIso;
  }

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

  /** ISO-Datum (YYYY-MM-DD) für das Zeitauswahl-Feld (<input type="date">) */
  readonly isoSimulationDate = computed<string>(() => {
    const d = this.simulationDate();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  /** Setzt das Simulationsdatum über ein ISO-Datum (YYYY-MM-DD) aus dem Datums-Picker */
  setSimulationDateIso(isoDate: string): void {
    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      return;
    }
    const [y, m, d] = isoDate.split('-').map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    if (!Number.isNaN(parsed.getTime())) {
      this.simulationDate.set(parsed);
    }
  }

  /** Wechselt zwischen 'overview', 'true-scale' und 'side-view' inkl. passendem Körpergrößen-Maßstab (P10-U40) */
  setViewMode(mode: SolarViewMode): void {
    this.viewMode.set(mode);
    this.bodyScaleMode.set(mode === 'true-scale' ? 'strict-distance-scale' : 'didactic');
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
      const year = 2000 + yearsSinceJ2000;
      let liveDistAu = 1.0;
      if (year >= 1980.86) {
        liveDistAu = 9.54 + 3.57 * (year - 1980.86);
      } else if (year >= 1979.18) {
        liveDistAu = 5.2 + 2.58 * (year - 1979.18);
      } else if (year >= 1977.68) {
        liveDistAu = 1.0 + 2.8 * (year - 1977.68);
      }
      const lonRad = (255.4 * Math.PI) / 180;
      return {
        longitudeDeg: 255.4,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: Number(liveDistAu.toFixed(2)),
      };
    }

    if (body.id === 'voyager-2') {
      const year = 2000 + yearsSinceJ2000;
      let liveDistAu = 1.0;
      if (year >= 1989.65) {
        liveDistAu = 30.07 + 3.13 * (year - 1989.65);
      } else if (year >= 1986.06) {
        liveDistAu = 19.19 + 3.03 * (year - 1986.06);
      } else if (year >= 1981.65) {
        liveDistAu = 9.54 + 2.19 * (year - 1981.65);
      } else if (year >= 1979.52) {
        liveDistAu = 5.2 + 2.04 * (year - 1979.52);
      } else if (year >= 1977.63) {
        liveDistAu = 1.0 + 2.22 * (year - 1977.63);
      }
      const lonRad = (289.4 * Math.PI) / 180;
      return {
        longitudeDeg: 289.4,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: Number(liveDistAu.toFixed(2)),
      };
    }

    if (body.id === 'new-horizons') {
      const year = 2000 + yearsSinceJ2000;
      let liveDistAu = 1.0;
      if (year >= 2015.53) {
        liveDistAu = 32.9 + 2.92 * (year - 2015.53);
      } else if (year >= 2007.16) {
        liveDistAu = 5.2 + 3.31 * (year - 2007.16);
      } else if (year >= 2006.05) {
        liveDistAu = 1.0 + 3.78 * (year - 2006.05);
      }
      const lonRad = (293.5 * Math.PI) / 180;
      return {
        longitudeDeg: 293.5,
        eccentricAnomalyRad: lonRad,
        trueAnomalyRad: lonRad,
        currentDistanceAu: Number(liveDistAu.toFixed(2)),
      };
    }

    if (body.id === 'jwst' || body.id === 'gaia') {
      const earthPos = this.computeLiveKeplerState({
        ...body,
        id: 'earth',
        orbitalPeriodDays: 365.256,
        orbitalElements: {
          ...body.orbitalElements,
          sma: { ...body.orbitalElements.sma, numericValue: 1.0 },
          ecc: { ...body.orbitalElements.ecc, numericValue: 0.0167 },
          lpe: { ...body.orbitalElements.lpe, numericValue: 102.95 },
          mna: { ...body.orbitalElements.mna, numericValue: 357.52 },
        },
      });
      return {
        longitudeDeg: earthPos.longitudeDeg,
        eccentricAnomalyRad: earthPos.eccentricAnomalyRad,
        trueAnomalyRad: earthPos.trueAnomalyRad,
        currentDistanceAu: Number((earthPos.currentDistanceAu * 1.01).toFixed(3)),
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
    const ecc = Math.min(0.9995, Math.max(0, body.orbitalElements.ecc.numericValue ?? 0));
    const smaAu = body.orbitalElements.sma.numericValue ?? body.distanceFromSunAu;

    const meanMotionDegPerDay = 360.0 / body.orbitalPeriodDays;
    const currentMeanAnomalyDeg = (((m0Deg + meanMotionDegPerDay * days) % 360) + 360) % 360;
    const M = (currentMeanAnomalyDeg * Math.PI) / 180;

    let E =
      ecc > 0.85
        ? M < Math.PI
          ? Math.min(Math.PI, Math.max(M, Math.cbrt((6 * M) / ecc)))
          : Math.max(Math.PI, 2 * Math.PI - Math.cbrt((6 * (2 * Math.PI - M)) / ecc))
        : M + ecc * Math.sin(M);
    for (let i = 0; i < 15; i++) {
      const f = E - ecc * Math.sin(E) - M;
      const fp = Math.max(1e-7, 1 - ecc * Math.cos(E));
      const deltaE = f / fp;
      E -= deltaE;
      if (Math.abs(deltaE) < 1e-9) {
        break;
      }
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
    const scaleMode = this.bodyScaleMode();
    // Im 1:1-Modus (strict-distance-scale) exaktes lineares Durchmesserverhältnis (z. B. Erdmond = 27,2 % der Erde);
    // in der Übersicht sanfte Anhebung für kleine Körper, damit sie gut sichtbar bleiben.
    const effectiveRatio =
      scaleMode === 'strict-distance-scale'
        ? rawRatioToEarth
        : rawRatioToEarth < 1
          ? Math.pow(rawRatioToEarth, 0.68)
          : Math.pow(rawRatioToEarth, 0.85);
    const physicalWorldRadius =
      body.id === 'sun' && scaleMode !== 'strict-distance-scale'
        ? 0.065
        : Math.max(scaleMode === 'strict-distance-scale' ? 0.0002 : 0.0008, effectiveRatio * 0.0065);

    const strictTrueRadiusPx = Number((physicalWorldRadius * z).toFixed(3));

    let minScreenPinPx = 2.6;
    if (scaleMode === 'strict-distance-scale') {
      minScreenPinPx = body.id === 'sun' ? 3.8 : 2.4;
    } else {
      minScreenPinPx =
        body.id === 'sun'
          ? 13.0
          : Number(Math.max(2.6, Math.min(9.0, body.overviewBodyRadiusSvg * 0.62)).toFixed(1));
    }

    // Für Gürtel (Asteroidengürtel, Oortscher Gürtel), Lagrange-Punkte oder Raumsonden: immer der feine Symbol-Punkt
    if (body.category === 'spacecraft' || body.category === 'belt' || body.category === 'lagrange') {
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
   *   Kurvensegment (24 Stützpunkte im Sichtfenster) als SVG-<path> berechnet und mit rotationRad gedreht!
   */
  private computeOrbitClipping(
    centerX: number,
    centerY: number,
    rx: number,
    ry: number,
    rotationRad = 0,
  ): { isVisible: boolean; clippedPath: string | null } {
    if (rx <= 0 || ry <= 0) {
      return { isVisible: false, clippedPath: null };
    }

    const cosPhi = Math.cos(rotationRad);
    const sinPhi = Math.sin(rotationRad);
    const relX = -centerX * cosPhi - centerY * sinPhi;
    const relY = centerX * sinPhi - centerY * cosPhi;

    // Bei kleinen/mittleren Radien (<= 4.500 px) zeichnet der Browser die native <ellipse> flüssig und vollständig
    if (rx <= 4500 && ry <= 4500) {
      const inBounds = Math.abs(relX) <= rx + 650 && Math.abs(relY) <= ry + 450;
      return { isVisible: inBounds, clippedPath: null };
    }

    // Nächstgelegener Parameter t0 auf der gedrehten Ellipse zum Viewport-Mittelpunkt (0, 0)
    const t0 = Math.atan2(relY / Math.max(1, ry), relX / Math.max(1, rx));
    const dMin = Math.hypot(rx * Math.cos(t0) - relX, ry * Math.sin(t0) - relY);
    if (dMin > 850) {
      return { isVisible: false, clippedPath: null };
    }

    const localSpeed = Math.max(20, Math.hypot(rx * Math.sin(t0), ry * Math.cos(t0)));
    const halfSpanRad = Math.min(
      Math.PI,
      Math.max(0.0002, 850 / localSpeed, Math.sqrt(1700 / Math.max(1, rx))),
    );
    const steps = 48;
    const points: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = t0 - halfSpanRad + (2 * halfSpanRad * i) / steps;
      const lx = rx * Math.cos(t);
      const ly = ry * Math.sin(t);
      const x = (centerX + lx * cosPhi - ly * sinPhi).toFixed(1);
      const y = (centerY + lx * sinPhi + ly * cosPhi).toFixed(1);
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

    // KI-generierter Block: Exakte Positionierung aller 5 Lagrange-Punkte (L1-L5) für alle 8 Planeten sowie JWST & Gaia im Halo-Orbit um Erde-L2!
    if (body.category === 'lagrange' || body.id === 'jwst' || body.id === 'gaia') {
      const planetId = body.id === 'jwst' || body.id === 'gaia' ? 'earth' : (body.parentId ?? 'earth');
      const pointType =
        body.id === 'jwst' || body.id === 'gaia' ? 'l2' : body.id.slice(-2).toLowerCase();
      const planet = allBodies.find((b) => b.id === planetId);
      const planetPos = planet ? this.computeBodyPosition(planet, allBodies) : null;

      if (planetPos && planet) {
        const rPlanetWorld = Math.hypot(planetPos.worldX, planetPos.worldY) || 1;
        const ux = planetPos.worldX / rPlanetWorld;
        const uy = planetPos.worldY / rPlanetWorld;
        const tx = -uy;
        const ty = ux;

        const hillRatioByPlanet: Readonly<Record<string, number>> = {
          mercury: 0.0038,
          venus: 0.0093,
          earth: 0.01,
          mars: 0.0047,
          jupiter: 0.0682,
          saturn: 0.0455,
          uranus: 0.0244,
          neptune: 0.0258,
        };
        const maxOverviewGapByPlanet: Readonly<Record<string, number>> = {
          mercury: 21,
          venus: 23,
          earth: 27,
          mars: 29,
          jupiter: 38,
          saturn: 37,
          uranus: 33,
          neptune: 34,
        };

        /** KI-Hinweis: Berechnet den tatsächlichen äußersten Mondbahn-Radius inkl. physikalischer Skalierung bei Nahzoom. */
        const planetMoons = allBodies.filter(
          (m) => m.parentId === planet.id && m.category === 'moon',
        );
        const parentRadiusKm = Math.max(1, planet.diameterKm / 2);
        const maxMoonScreenOrbitPx = planetMoons.reduce((maxR, m) => {
          const minOverviewR =
            planetPos.bodyRadiusPx + Math.max(9, m.overviewOrbitRadiusSvg * 0.72);
          let physicalR = planetPos.strictTrueRadiusPx * 1.5;
          if (mode === 'true-scale' && m.orbitalElements.sma.numericValue) {
            const moonDistKm = m.orbitalElements.sma.numericValue * this.astronomicalUnitKm;
            physicalR =
              planetPos.strictTrueRadiusPx * Math.max(1.35, moonDistKm / parentRadiusKm);
          } else if (m.id === 'moon') {
            physicalR = planetPos.strictTrueRadiusPx * 6.5;
          } else {
            physicalR =
              planetPos.strictTrueRadiusPx * (1.45 + (m.overviewOrbitRadiusSvg - 10) * 0.14);
          }
          return Math.max(maxR, Math.max(minOverviewR, physicalR));
        }, 0);

        const hillRatio = hillRatioByPlanet[planet.id] ?? 0.01;
        const maxOverviewGapWorld = maxOverviewGapByPlanet[planet.id] ?? 24;
        const minClearanceOutsideMoonsPx =
          maxMoonScreenOrbitPx > 0 ? maxMoonScreenOrbitPx + 6.5 : planetPos.bodyRadiusPx + 14;
        const desiredOutsideMoonsPx =
          maxMoonScreenOrbitPx > 0
            ? Math.max(maxMoonScreenOrbitPx * 2.2, maxMoonScreenOrbitPx + 26)
            : Math.max(planetPos.bodyRadiusPx * 2.8 + 30, 40);

        const rawL12Px =
          mode === 'true-scale'
            ? Math.max(
                minClearanceOutsideMoonsPx,
                Math.min(
                  Math.max(rPlanetWorld * 0.24 * z, minClearanceOutsideMoonsPx),
                  Math.max(rPlanetWorld * hillRatio * z, desiredOutsideMoonsPx),
                ),
              )
            : Math.max(
                minClearanceOutsideMoonsPx,
                Math.min(
                  Math.max(maxOverviewGapWorld * z, minClearanceOutsideMoonsPx),
                  desiredOutsideMoonsPx,
                ),
              );
        const l12WorldOffset = rawL12Px / Math.max(0.001, z);

        let worldX = planetPos.worldX;
        let worldY = planetPos.worldY;
        let liveLongitudeDeg = planetPos.liveLongitudeDeg;
        let liveDistanceAu = planetPos.liveDistanceAu;

        if (pointType === 'l1') {
          worldX = Number((planetPos.worldX - ux * l12WorldOffset).toFixed(4));
          worldY = Number((planetPos.worldY - uy * l12WorldOffset).toFixed(4));
          liveDistanceAu = Number((planetPos.liveDistanceAu * (1 - hillRatio)).toFixed(3));
        } else if (body.id === 'jwst' || body.id === 'gaia') {
          // Kleiner Halo-Orbit direkt um Erde-L2 (8 px Radius auf dem Bildschirm)
          const l2WorldX = planetPos.worldX + ux * l12WorldOffset;
          const l2WorldY = planetPos.worldY + uy * l12WorldOffset;
          const haloWorld = 8 / Math.max(0.001, z);
          const sign = body.id === 'jwst' ? 1 : -1;
          worldX = Number((l2WorldX + sign * tx * haloWorld + ux * (haloWorld * 0.35)).toFixed(4));
          worldY =
            mode === 'side-view'
              ? planetPos.worldY
              : Number((l2WorldY + sign * ty * haloWorld + uy * (haloWorld * 0.35)).toFixed(4));
          liveDistanceAu = Number((planetPos.liveDistanceAu * (1 + hillRatio)).toFixed(3));
        } else if (pointType === 'l2') {
          // Exakt kollinear auf der Achse Sonne -> Planet -> L2
          worldX = Number((planetPos.worldX + ux * l12WorldOffset).toFixed(4));
          worldY = Number((planetPos.worldY + uy * l12WorldOffset).toFixed(4));
          liveDistanceAu = Number((planetPos.liveDistanceAu * (1 + hillRatio)).toFixed(3));
        } else {
          // L3 (180°), L4 (+60° voraus) und L5 (-60° dahinter) liegen exakt auf der Planetenbahn-Ellipse!
          const planetKepler = this.computeLiveKeplerState(planet);
          const planetEcc = Math.min(
            mode === 'true-scale' ? 0.97 : 0.75,
            Math.max(0, planet.orbitalElements.ecc.numericValue ?? 0),
          );
          const planetSemiMajorWorld =
            mode === 'true-scale'
              ? Number((planet.distanceFromSunAu * this.pixelsPerAu).toFixed(3))
              : planet.overviewOrbitRadiusSvg;
          const planetSemiMinorWorld = Number(
            (planetSemiMajorWorld * Math.sqrt(1 - planetEcc * planetEcc)).toFixed(3),
          );
          const planetFocusOffsetX =
            mode === 'true-scale' ? Number((-planetSemiMajorWorld * planetEcc).toFixed(3)) : 0;

          const angleDelta =
            pointType === 'l3' ? Math.PI : pointType === 'l4' ? -Math.PI / 3 : Math.PI / 3;
          const shiftDeg = pointType === 'l3' ? 180 : pointType === 'l4' ? 60 : 300;
          liveLongitudeDeg = Number(((planetKepler.longitudeDeg + shiftDeg) % 360).toFixed(1));

          if (mode === 'side-view') {
            const incRad = (planet.inclinationToSolarEquatorDeg * Math.PI) / 180;
            const lonRad = (liveLongitudeDeg * Math.PI) / 180;
            const sideProj = Math.cos(lonRad) >= 0 ? 1 : -1;
            worldX = Number((sideProj * Math.cos(incRad) * planetSemiMajorWorld).toFixed(3));
            worldY = Number((-sideProj * Math.sin(incRad) * planetSemiMajorWorld).toFixed(3));
          } else {
            const targetAngle = -planetKepler.eccentricAnomalyRad + angleDelta;
            const localX = planetFocusOffsetX + Math.cos(targetAngle) * planetSemiMajorWorld;
            const localY = Math.sin(targetAngle) * planetSemiMinorWorld;
            const perihelionRad = (-this.getPerihelionOrientationDeg(planet) * Math.PI) / 180;
            const cosP = Math.cos(perihelionRad);
            const sinP = Math.sin(perihelionRad);
            worldX = Number((localX * cosP - localY * sinP).toFixed(4));
            worldY = Number((localX * sinP + localY * cosP).toFixed(4));
          }
        }

        return {
          body,
          x: Number((px + worldX * z).toFixed(1)),
          y: Number((py + worldY * z).toFixed(1)),
          worldX,
          worldY,
          orbitRxPx: planetPos.orbitRxPx,
          orbitRyPx: planetPos.orbitRyPx,
          orbitCenterX: planetPos.orbitCenterX,
          orbitCenterY: planetPos.orbitCenterY,
          isOrbitVisibleInViewport: false,
          clippedOrbitPath: null,
          bodyRadiusPx: displayRadiusPx,
          strictTrueRadiusPx,
          inclinationYOffsetPx: planetPos.inclinationYOffsetPx,
          liveLongitudeDeg,
          liveDistanceAu,
        };
      }
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

      const isRetrogradeMoon = body.inclinationToSolarEquatorDeg > 90;
      const angleRad = ((isRetrogradeMoon ? 1 : -1) * kepler.longitudeDeg * Math.PI) / 180;
      const parentTrueR = parentPos.strictTrueRadiusPx;

      // Physikalische Bahnhöhe relativ zum wahren Radius des Mutterplaneten beim Reinzoomen:
      let physicalOrbitPx = parentTrueR * 1.5;
      if (body.id === 'iss') {
        // ISS kreist in 408 km Höhe über dem 6.378 km Erdradius (r = 1.064 * R_Erde)
        physicalOrbitPx = parentTrueR * 1.12;
      } else if (body.id === 'hubble') {
        // Hubble kreist in 540 km Höhe über der Erde (r = 1.085 * R_Erde)
        physicalOrbitPx = parentTrueR * 1.2;
      } else if (body.id === 'vanguard-1') {
        // Vanguard 1 kreist im mittleren Erdorbit (654–3.840 km Höhe, im Mittel ca. 2.250 km über der Oberfläche)
        physicalOrbitPx = parentTrueR * 1.38;
      } else if (body.id === 'apollo-13') {
        // Apollo 13 umrundet den Mond mit Sicherheitsabstand auf der Free-Return-Bahn (kein Clipping in den Mond)
        physicalOrbitPx = Math.max(parentTrueR * 0.2724 + 22, parentTrueR * 2.4);
      } else if (body.id === 'artemis') {
        physicalOrbitPx = parentTrueR * 2.6;
      } else if (mode === 'true-scale' && body.category === 'moon' && body.orbitalElements.sma.numericValue) {
        // Im 1:1-Modus (Echter Maßstab): reale Bahnhöhe jedes Mondes aus seiner Großen Halbachse (SMA)
        // relativ zum wahren Radius seines Mutterkörpers (z. B. Erdmond 60,27×, Phobos 2,76×, Io 5,90×, Titan 20,27×, Charon 16,49×)!
        const moonDistKm = body.orbitalElements.sma.numericValue * this.astronomicalUnitKm;
        const parentRadiusKm = Math.max(1, (parent?.diameterKm ?? 12756) / 2);
        const realRatioToParent = moonDistKm / parentRadiusKm;
        physicalOrbitPx = parentTrueR * Math.max(1.35, realRatioToParent);
      } else if (body.id === 'moon') {
        // In der Übersicht kompakter (6,5 Erdradien), damit Erde und Mond gemeinsam ins Bild passen.
        physicalOrbitPx = parentTrueR * 6.5;
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
    const rawEcc = body.orbitalElements.ecc.numericValue ?? 0;
    const isEllipticalSpotlight =
      mode === 'true-scale' ||
      body.id === 'parker' ||
      body.id === 'solar-orbiter' ||
      body.category === 'comet';
    let ecc = Math.min(isEllipticalSpotlight ? 0.9995 : 0.75, Math.max(0, rawEcc));
    const effectiveAu =
      body.id === 'voyager-1' || body.id === 'voyager-2' || body.id === 'new-horizons'
        ? kepler.currentDistanceAu
        : body.id === 'parker' || body.id === 'solar-orbiter' || body.category === 'comet'
          ? (body.orbitalElements.sma.numericValue ?? body.distanceFromSunAu)
          : body.distanceFromSunAu;

    let worldSemiMajorPx =
      body.id === 'parker'
        ? 78
        : body.id === 'solar-orbiter'
          ? 74
          : body.overviewOrbitRadiusSvg;
    if (mode === 'true-scale') {
      if (body.id === 'oort-cloud') {
        worldSemiMajorPx = 220 * this.pixelsPerAu;
      } else {
        worldSemiMajorPx = Number((effectiveAu * this.pixelsPerAu).toFixed(3));
      }
    }

    let overviewCometE: number | null = null;
    if (mode === 'overview' && body.category === 'comet') {
      const smaAu = body.orbitalElements.sma.numericValue ?? body.distanceFromSunAu;
      if (smaAu > 0) {
        const qTrue = smaAu * (1 - ecc);
        const QTrue = smaAu * (1 + ecc);
        const qOv = this.mapAuToOverviewRadius(qTrue);
        const QOv = Math.max(qOv + 25, this.mapAuToOverviewRadius(QTrue));
        worldSemiMajorPx = Number(((QOv + qOv) / 2).toFixed(3));
        ecc = Number(((QOv - qOv) / (QOv + qOv)).toFixed(6));
        const rOv = Math.min(QOv, Math.max(qOv, this.mapAuToOverviewRadius(kepler.currentDistanceAu)));
        const cosEov =
          ecc > 1e-5
            ? Math.min(1, Math.max(-1, (worldSemiMajorPx - rOv) / (worldSemiMajorPx * ecc)))
            : 1;
        const absEov = Math.acos(cosEov);
        overviewCometE =
          Math.sin(kepler.eccentricAnomalyRad) >= 0 ? absEov : 2 * Math.PI - absEov;
      }
    }

    // Sicherheitsabstand zur Sonne für Sonnensonden & Kometen im Perihel,
    // damit das Perihel a*(1-e) niemals innerhalb der gezeichneten Sonnenscheibe liegt!
    if (body.id === 'parker' || body.id === 'solar-orbiter' || body.category === 'comet') {
      const sun = allBodies.find((b) => b.id === 'sun');
      const sunScreenR = sun ? this.computeScaledBodyRadius(sun).displayRadiusPx : 13;
      const minPerihelWorld = (sunScreenR + 4) / Math.max(0.001, z);
      if (worldSemiMajorPx * (1 - ecc) < minPerihelWorld && worldSemiMajorPx > minPerihelWorld) {
        ecc = Math.max(0.1, Number((1 - minPerihelWorld / worldSemiMajorPx).toFixed(6)));
      }
    }

    const isDirectLongitudeBody =
      body.id === 'voyager-1' ||
      body.id === 'voyager-2' ||
      body.id === 'new-horizons' ||
      body.category === 'belt';
    const perihelionDeg = isDirectLongitudeBody ? 0 : this.getPerihelionOrientationDeg(body);
    const perihelionRad = (-perihelionDeg * Math.PI) / 180;
    const orbitRotationDeg = Number((-perihelionDeg).toFixed(2));
    const cosPhi = Math.cos(perihelionRad);
    const sinPhi = Math.sin(perihelionRad);

    const worldSemiMinorPx = Number((worldSemiMajorPx * Math.sqrt(1 - ecc * ecc)).toFixed(3));
    const worldFocusOffsetX = isEllipticalSpotlight
      ? Number((-worldSemiMajorPx * ecc).toFixed(3))
      : 0;
    const rotatedFocusX = worldFocusOffsetX * cosPhi;
    const rotatedFocusY = worldFocusOffsetX * sinPhi;

    const scaledRx = Number((worldSemiMajorPx * z).toFixed(1));
    const scaledRy = Number((worldSemiMinorPx * z).toFixed(1));
    const scaledCenterX = Number((px + rotatedFocusX * z).toFixed(1));
    const scaledCenterY = Number((py + rotatedFocusY * z).toFixed(1));

    // 2. Seitenansicht (P10-U40): 2D-Querschnitt entlang der Sonnenäquator-Ebene mit echtem INC-Neigungswinkel
    if (mode === 'side-view') {
      const incRad = (body.inclinationToSolarEquatorDeg * Math.PI) / 180;
      const lonRad = (kepler.longitudeDeg * Math.PI) / 180;
      const sideProjection = Math.cos(lonRad) >= 0 ? 1 : -1;
      const sideOrbitR =
        body.category === 'comet'
          ? this.mapAuToOverviewRadius(kepler.currentDistanceAu)
          : worldSemiMajorPx;
      const worldX = Number((sideProjection * Math.cos(incRad) * sideOrbitR).toFixed(3));
      const worldY = Number((-sideProjection * Math.sin(incRad) * sideOrbitR).toFixed(3));

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

    // 3. Draufsicht auf die gedrehte elliptische Bahn mit analytischem SVG-Orbit-Clipping gegen VM-Stottern!
    // Exzentrische Anomalie E bestimmt den Punkt in der ungedrehten Ellipse, der anschließend um ϖ (LPE) um die Sonne rotiert wird.
    const isRetrograde = body.inclinationToSolarEquatorDeg > 90;
    const orbitE = overviewCometE ?? kepler.eccentricAnomalyRad;
    const angleRad = isDirectLongitudeBody
      ? (-kepler.longitudeDeg * Math.PI) / 180
      : isRetrograde
        ? orbitE
        : -orbitE;
    const localX = worldFocusOffsetX + Math.cos(angleRad) * worldSemiMajorPx;
    const localY = Math.sin(angleRad) * worldSemiMinorPx;
    const worldX = Number((localX * cosPhi - localY * sinPhi).toFixed(4));
    const worldY = Number((localX * sinPhi + localY * cosPhi).toFixed(4));
    const orbitClip = this.computeOrbitClipping(
      scaledCenterX,
      scaledCenterY,
      scaledRx,
      scaledRy,
      perihelionRad,
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
      orbitRotationDeg,
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

  /** KI-Hinweis: Überträgt reale AE-Abstände (Perihel/Aphel/r(t)) stückweise linear in die Übersichtsbahn-Radien. */
  private mapAuToOverviewRadius(au: number): number {
    if (au <= 0) {
      return 0;
    }
    const anchors: ReadonlyArray<readonly [number, number]> = [
      [0, 0],
      [0.2, 38],
      [0.387, 62],
      [0.723, 94],
      [1.0, 130],
      [1.524, 170],
      [2.77, 210],
      [5.204, 255],
      [9.582, 305],
      [19.191, 350],
      [30.069, 390],
      [39.482, 425],
      [67.781, 470],
      [750, 492],
    ];
    for (let i = 1; i < anchors.length; i++) {
      const [au0, r0] = anchors[i - 1];
      const [au1, r1] = anchors[i];
      if (au <= au1) {
        return r0 + ((au - au0) / (au1 - au0)) * (r1 - r0);
      }
    }
    return 492;
  }

  /** KI-Hinweis: Ermittelt den Perihel-Drehwinkel (ϖ in Grad) einer elliptischen Bahn für die 2D-Draufsicht. */
  private getPerihelionOrientationDeg(body: CelestialBody): number {
    if (body.orbitalElements.lpe.numericValue !== undefined) {
      return body.orbitalElements.lpe.numericValue;
    }
    const lan = body.orbitalElements.lan.numericValue ?? 0;
    const aop = body.orbitalElements.aop?.numericValue ?? 0;
    return body.inclinationToSolarEquatorDeg > 90
      ? (((lan - aop) % 360) + 360) % 360
      : (lan + aop) % 360;
  }
}
