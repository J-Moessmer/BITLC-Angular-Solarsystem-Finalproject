/**
 * Projekt / Modul: SSI App – Solar System Info App / ResearchMission & IssLiveStatus Models (research-mission.model.ts)
 * FCPP-Referenz: P40-U10, P40-U20 (Forschungsprojekte, Raumstationen & ISS-Live-API mit Fallback)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: TypeScript-Interfaces für Raumfahrtmissionen, Wikimedia-Commons-Fotos und ISS-Live-Telemetrie mit KI-Unterstützung erstellt.
 */

export type MissionCategory =
  | 'all'
  | 'probe'
  | 'rover'
  | 'mars-rover'
  | 'telescope'
  | 'space-station'
  | 'moon-mission'
  | 'crewed-mission'
  | 'solar-probe'
  | 'deep-space';

export interface ResearchMission {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<MissionCategory, 'all'>;
  /** Zusätzliche Kategorien für Mehrfachzuordnung (z. B. Mondflüge & bemannte Missionen) */
  categories?: Array<Exclude<MissionCategory, 'all'>>;
  categoryLabel: string;
  /** Ziel-Himmelskörper für den Sprung-Button "Im Sonnensystem zeigen" (--> P20) */
  targetBodyId: string;
  targetBodyName: string;
  agency: string;
  launchYear: string;
  statusLabel: string;
  /** Echte Foto-URL von Wikimedia Commons */
  wikimediaImageUrl: string;
  /** Lokaler relativer Fallback-Pfad unter assets/images/... */
  imageUrl: string;
  imageCredit: string;
  childSummary: string;
  tasksForKids: string[];
  /** Verifizierter Link zur offiziellen Raumfahrtagentur-/Missionsseite (optional) */
  officialUrl?: string;
  /** Verifizierter Link zum deutschsprachigen Wikipedia-Artikel */
  wikipediaUrl: string;
  hasIssLiveTracker?: boolean;
}

export interface IssLiveStatus {
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmh: number;
  visibility: string;
  timestamp: number;
  locationHint: string;
  isFallbackData: boolean;
}
