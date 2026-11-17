/**
 * Projekt / Modul: SSI App – Solar System Info App / SolarSystemDataService (solar-system-data.service.ts)
 * FCPP-Referenz: P10-U20, P20-U20, P20-U30, P20-U40, P30-U20
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Datenservice für alle 27 Himmelskörper, Monde, Gürtel und Raumstationen inkl. HTTPS-API-Abruf, lokalem JSON-Fallback (assets/data/solar-system-fallback.json) sowie Wikimedia-Commons-Bild-URLs mit lokalem SVG-Fallback mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import { CelestialBody } from '../models/celestial-body.model';

export interface PathTreeNode {
  id: string;
  label: string;
  icon: string;
  bodyId?: string;
  children?: PathTreeNode[];
}

interface OpenSolarSystemApiResponse {
  bodies?: Array<{
    id?: string;
    meanRadius?: number;
    semimajorAxis?: number;
    eccentricity?: number;
    inclination?: number;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class SolarSystemDataService {
  private readonly http = inject(HttpClient);

  /** Relativer Pfad für GitHub Pages (--base-href kompatibel) */
  private readonly localFallbackUrl = 'assets/data/solar-system-fallback.json';
  private readonly externalApiUrl =
    'https://api.le-systeme-solaire.net/rest/bodies?data=id,meanRadius,semimajorAxis,eccentricity,inclination';

  private readonly bodiesState = signal<CelestialBody[]>([]);
  private readonly selectedBodyIdState = signal<string | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly usingFallbackState = signal<boolean>(true);

  readonly bodies = this.bodiesState.asReadonly();
  readonly selectedBodyId = this.selectedBodyIdState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly isUsingFallback = this.usingFallbackState.asReadonly();

  /** Aktuell in P20 ausgewählter Himmelskörper (P20-U20, P20-U30) */
  readonly selectedBody = computed<CelestialBody | null>(() => {
    const id = this.selectedBodyIdState();
    if (!id) {
      return null;
    }
    return this.bodiesState().find((b) => b.id === id) ?? null;
  });

  /** Zugehörige Monde / Raumstationen des aktuell ausgewählten Körpers (P20-A40 / P20-U30) */
  readonly selectedBodyChildren = computed<CelestialBody[]>(() => {
    const current = this.selectedBody();
    if (!current || current.childrenIds.length === 0) {
      return [];
    }
    const all = this.bodiesState();
    return current.childrenIds
      .map((childId) => all.find((b) => b.id === childId))
      .filter((b): b is CelestialBody => b !== undefined);
  });

  /** Breadcrumb-Pfad vom Sonnensystem bis zum ausgewählten Körper (P10-A20 / P10-U20) */
  readonly breadcrumbTrail = computed<Array<{ id: string; label: string; bodyId?: string }>>(() => {
    const trail: Array<{ id: string; label: string; bodyId?: string }> = [
      { id: 'root', label: 'Sonnensystem' },
    ];
    const current = this.selectedBody();
    if (!current) {
      return trail;
    }

    const all = this.bodiesState();
    const chain: CelestialBody[] = [current];
    let pointer = current;
    while (pointer.parentId && pointer.parentId !== 'sun') {
      const parent = all.find((b) => b.id === pointer.parentId);
      if (!parent) {
        break;
      }
      chain.unshift(parent);
      pointer = parent;
    }

    if (current.category === 'planet') {
      trail.push({ id: 'group-planets', label: 'Planeten' });
    } else if (current.category === 'dwarf-planet' && current.parentId !== 'asteroid-belt') {
      trail.push({ id: 'group-dwarfs', label: 'Zwergplaneten' });
    } else if (current.category === 'comet') {
      trail.push({ id: 'group-comets', label: 'Kometen' });
    }

    for (const item of chain) {
      trail.push({ id: item.id, label: item.name, bodyId: item.id });
    }
    return trail;
  });

  /** Hierarchischer Pfad-Baum für die linke Seitenleiste (P10-A20 / P10-U20) */
  readonly navigationTree = computed<PathTreeNode[]>(() => {
    const all = this.bodiesState();
    const byId = (id: string) => all.find((b) => b.id === id);

    const buildBodyNode = (id: string, icon: string): PathTreeNode => {
      const body = byId(id);
      const label = body?.name ?? id;
      const children = (body?.childrenIds ?? []).map((cid) => {
        const childBody = byId(cid);
        const childIcon =
          childBody?.category === 'spacecraft'
            ? cid === 'iss'
              ? 'fa-solid fa-satellite'
              : cid === 'jwst' || cid === 'gaia'
                ? 'fa-solid fa-satellite-dish'
                : 'fa-solid fa-shuttle-space'
            : 'fa-regular fa-moon';
        return buildBodyNode(cid, childIcon);
      });
      return {
        id,
        label,
        icon,
        bodyId: id,
        children: children.length > 0 ? children : undefined,
      };
    };

    return [
      {
        id: 'solar-system-root',
        label: 'Sonnensystem',
        icon: 'fa-solid fa-compass',
        children: [
          buildBodyNode('sun', 'fa-solid fa-sun'),
          {
            id: 'planets-group',
            label: 'Planeten',
            icon: 'fa-solid fa-globe',
            children: [
              'mercury',
              'venus',
              'earth',
              'mars',
              'jupiter',
              'saturn',
              'uranus',
              'neptune',
            ].map((pid) =>
              buildBodyNode(
                pid,
                pid === 'earth' ? 'fa-solid fa-earth-europe' : 'fa-solid fa-circle-dot',
              ),
            ),
          },
          {
            id: 'dwarf-planets-group',
            label: 'Zwergplaneten & Monde',
            icon: 'fa-regular fa-snowflake',
            children: [
              buildBodyNode('ceres', 'fa-regular fa-circle-dot'),
              buildBodyNode('pluto', 'fa-regular fa-circle-dot'),
              buildBodyNode('haumea', 'fa-regular fa-circle-dot'),
              buildBodyNode('makemake', 'fa-regular fa-circle-dot'),
              buildBodyNode('eris', 'fa-regular fa-circle-dot'),
            ],
          },
          {
            id: 'comets-group',
            label: 'Kometen',
            icon: 'fa-solid fa-meteor',
            children: [
              buildBodyNode('halley', 'fa-solid fa-meteor'),
              buildBodyNode('churyumov', 'fa-solid fa-meteor'),
              buildBodyNode('hale-bopp', 'fa-solid fa-meteor'),
            ],
          },
          {
            id: 'probes-group',
            label: 'Raumsonden & Teleskope',
            icon: 'fa-solid fa-satellite',
            children: [
              buildBodyNode('parker', 'fa-solid fa-shuttle-space'),
              buildBodyNode('solar-orbiter', 'fa-solid fa-satellite'),
              buildBodyNode('bepicolombo', 'fa-solid fa-shuttle-space'),
              buildBodyNode('iss', 'fa-solid fa-satellite'),
              buildBodyNode('hubble', 'fa-solid fa-satellite-dish'),
              buildBodyNode('artemis', 'fa-solid fa-rocket'),
              buildBodyNode('jwst', 'fa-solid fa-satellite-dish'),
              buildBodyNode('gaia', 'fa-solid fa-satellite-dish'),
              buildBodyNode('dawn', 'fa-solid fa-satellite'),
              buildBodyNode('juno', 'fa-solid fa-satellite'),
              buildBodyNode('juice', 'fa-solid fa-satellite'),
              buildBodyNode('cassini', 'fa-solid fa-shuttle-space'),
              buildBodyNode('rosetta', 'fa-solid fa-shuttle-space'),
              buildBodyNode('new-horizons', 'fa-solid fa-shuttle-space'),
              buildBodyNode('voyager-1', 'fa-solid fa-satellite-dish'),
              buildBodyNode('voyager-2', 'fa-solid fa-satellite-dish'),
              {
                id: 'apollo-group',
                label: 'Apollo-Mondflüge',
                icon: 'fa-solid fa-rocket',
                children: [
                  buildBodyNode('apollo-11', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-12', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-13', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-14', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-15', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-16', 'fa-solid fa-rocket'),
                  buildBodyNode('apollo-17', 'fa-solid fa-rocket'),
                ],
              },
              {
                id: 'mars-rovers-group',
                label: 'Mars-Rover',
                icon: 'fa-solid fa-robot',
                children: [
                  buildBodyNode('perseverance', 'fa-solid fa-robot'),
                  buildBodyNode('curiosity', 'fa-solid fa-robot'),
                  buildBodyNode('opportunity', 'fa-solid fa-robot'),
                  buildBodyNode('spirit', 'fa-solid fa-robot'),
                  buildBodyNode('sojourner', 'fa-solid fa-robot'),
                ],
              },
            ],
          },
          buildBodyNode('asteroid-belt', 'fa-solid fa-braille'),
          buildBodyNode('oort-cloud', 'fa-solid fa-circle-nodes'),
        ],
      },
    ];
  });

  /**
   * KI-generierter Block: Lädt den lokalen JSON-Katalog (inkl. Wikimedia-Fotos & 7 Bahnelementen)
   * und reichert ihn optional mit Live-Werten der Solar System OpenData API an (P20-U20).
   */
  async loadSolarSystemData(): Promise<CelestialBody[]> {
    if (this.bodiesState().length > 0) {
      return this.bodiesState();
    }

    this.loadingState.set(true);
    try {
      const localBodies = await firstValueFrom(
        this.http
          .get<CelestialBody[]>(this.localFallbackUrl)
          .pipe(catchError(() => of([] as CelestialBody[]))),
      );

      this.bodiesState.set(localBodies);
      this.usingFallbackState.set(true);

      const apiData = await firstValueFrom(
        this.http.get<OpenSolarSystemApiResponse>(this.externalApiUrl).pipe(
          timeout(2500),
          catchError(() => of(null)),
        ),
      );

      if (apiData?.bodies && apiData.bodies.length > 0) {
        const apiMap = new Map(
          apiData.bodies
            .filter((b): b is Required<Pick<typeof b, 'id'>> & typeof b => Boolean(b.id))
            .map((b) => [b.id, b]),
        );

        const merged = localBodies.map((body) => {
          const live = body.englishApiId ? apiMap.get(body.englishApiId) : undefined;
          if (!live) {
            return body;
          }
          return {
            ...body,
            diameterKm:
              live.meanRadius && live.meanRadius > 0
                ? Math.round(live.meanRadius * 2)
                : body.diameterKm,
          };
        });

        this.bodiesState.set(merged);
        this.usingFallbackState.set(false);
      }

      return this.bodiesState();
    } finally {
      this.loadingState.set(false);
    }
  }

  /** Setzt den ausgewählten Himmelskörper für P20 (P10-U20, P20-U30) */
  selectBody(bodyId: string | null): void {
    this.selectedBodyIdState.set(bodyId);
  }

  /** Schließt die Infobox und kehrt zur Sonnensystem-Ansicht zurück (P20-U40) */
  clearSelection(): void {
    this.selectedBodyIdState.set(null);
  }

  /** Hilfsmethode für Einzelabfrage per ID */
  getBodyById(bodyId: string): CelestialBody | undefined {
    return this.bodiesState().find((b) => b.id === bodyId);
  }
}
