/**
 * Projekt / Modul: SSI App – Solar System Info App / CelestialBody & OrbitalElements Models (celestial-body.model.ts)
 * FCPP-Referenz: P10 (P10-U20, P10-U40), P20 (P20-U20, P20-U30), P30 (P30-U20)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.1
 * Hinweis: TypeScript-Interfaces für Himmelskörper, Gürtel, Raumstationen sowie die 7 Bahnelemente (SMA, ECC, INC, LAN, LPE, MNA, REF) inkl. Wikimedia-Commons-Bild-URL, lokalem Bild-Fallback und Quellen-Links (officialUrl, wikipediaUrl) mit KI-Unterstützung erstellt.
 */

export type BodyCategory =
  | 'star'
  | 'planet'
  | 'dwarf-planet'
  | 'moon'
  | 'comet'
  | 'belt'
  | 'spacecraft'
  | 'lagrange';

export interface OrbitalElementDetail {
  code: 'SMA' | 'ECC' | 'INC' | 'LAN' | 'LPE' | 'MNA' | 'REF';
  label: string;
  formattedValue: string;
  numericValue?: number;
  unit?: string;
  childExplanation: string;
}

/**
 * Die 7 Bahnelemente (Kepler-Elemente + Referenzsystem) gemäß P20-A30 / P20-U20
 */
export interface OrbitalElements {
  /** Semi-Major Axis (Große Halbachse) */
  sma: OrbitalElementDetail;
  /** Eccentricity (Numerische Exzentrizität) */
  ecc: OrbitalElementDetail;
  /** Inclination (Bahnneigung zum Sonnenäquator / Referenzebene) */
  inc: OrbitalElementDetail;
  /** Longitude of the Ascending Node (Länge des aufsteigenden Knotens) */
  lan: OrbitalElementDetail;
  /** Longitude of Perihelion (Länge des Perihels) */
  lpe: OrbitalElementDetail;
  /** Mean Anomaly (Mittlere Anomalie) */
  mna: OrbitalElementDetail;
  /** Reference System & Epoch (Referenzsystem / Epoche) */
  ref: OrbitalElementDetail;
}

export interface CelestialBody {
  id: string;
  name: string;
  englishApiId?: string;
  subtitle: string;
  category: BodyCategory;
  categoryLabel: string;
  parentId?: string;
  /** true bei gelandeten Oberflächen-Missionen (z. B. Apollo 11-17 auf dem Erdmond, Rover Perseverance & Curiosity auf dem Mars) */
  isSurfaceLanded?: boolean;
  childrenIds: string[];
  /** Echte Foto-URL von Wikimedia Commons (NASA/ESA Public Domain / CC) */
  wikimediaImageUrl: string;
  /** Lokaler relativer Fallback-Pfad unter assets/images/... für 100% Offline-Sicherheit */
  imageUrl: string;
  imageCredit: string;
  colorHex: string;
  accentColorHex: string;
  diameterKm: number;
  distanceFromSunKm: number;
  distanceFromSunAu: number;
  distanceFromEarthKm: number;
  orbitalPeriodDays: number;
  orbitalPeriodLabel: string;
  /** Bahnneigung zur Ebene des Sonnenäquators in Grad (für P10-U40 Seitenansicht) */
  inclinationToSolarEquatorDeg: number;
  /** Optimierter SVG-Bahnradius für die Übersichtsansicht (P10-U40) */
  overviewOrbitRadiusSvg: number;
  /** Optimierter SVG-Körperradius für die Übersichtsansicht (P10-U30) */
  overviewBodyRadiusSvg: number;
  /** Startwinkel in Grad für die 2D-Draufsicht im Sonnensystem */
  orbitAngleDeg: number;
  shortSummary: string;
  childFriendlyFacts: string[];
  comparisonHint: string;
  /** Verifizierter Link zur offiziellen NASA / ESA / Agentur-Infoseite (optional) */
  officialUrl?: string;
  /** Verifizierter Link zum deutschsprachigen Wikipedia-Artikel (optional) */
  wikipediaUrl?: string;
  orbitalElements: OrbitalElements;
}
