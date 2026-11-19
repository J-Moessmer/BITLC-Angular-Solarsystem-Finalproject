/**
 * Projekt / Modul: SSI App – Solar System Info App / GlossaryTermComponent (glossary-term.ts)
 * FCPP-Referenz: P10, P20, P40 (Kindgerechte Fachbegriff-Erklärung per Hover/Fokus-Infobox)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v1.0
 * Hinweis: Inline-Tooltip-Komponente, die Astronomie-Fachbegriffe für 7–10-Jährige direkt beim Zeigen mit der Maus erklärt.
 */

import { Component, computed, input } from '@angular/core';

export const GLOSSARY_DEFINITIONS: Readonly<Record<string, string>> = {
  AE: 'Astronomische Einheit: Der genaue Abstand zwischen unserer Erde und der Sonne (rund 150 Millionen Kilometer).',
  'Astronomische Einheit':
    'Das Weltraum-Lineal: 1 AE entspricht der Entfernung von der Erde zur Sonne (149,6 Mio. km).',
  Perihel:
    'Der sonnennächste Punkt einer Umlaufbahn – dort flitzt ein Planet oder Komet am schnellsten!',
  Aphel: 'Der sonnenfernste Punkt einer Umlaufbahn, an dem es besonders kalt ist.',
  Exzentrizität:
    'Zeigt, wie rund oder eierförmig eine Umlaufbahn ist. 0 bedeutet perfekter Kreis, nahe 1 eine sehr langgezogene Ellipse.',
  Bahnneigung:
    'Der Winkel, um den eine Umlaufbahn im Vergleich zur Hauptebene unseres Sonnensystems gekippt ist.',
  'Aufsteigender Knoten':
    'Longitude of the Ascending Node (LAN, Ω): Die Himmelsrichtung, an der die gekippte Umlaufbahn von Süden nach Norden durch die Hauptebene unseres Sonnensystems schneidet.',
  'Argument der Periapsis':
    'Argument of Periapsis (AOP, ω): Der Winkel vom aufsteigenden Bahnknoten entlang der Bahn bis zum sonnennächsten Punkt (Perihel / Periapsis).',
  'Länge des Perihels':
    'Longitude of Perihelion (LPE, ϖ): Gibt zusammengerechnet aus Aufsteigendem Knoten und Argument der Periapsis die genaue Himmelsrichtung an, in die der sonnennächste Punkt zeigt.',
  'Große Halbachse':
    'Semi-Major Axis (SMA, a): Der mittlere Abstand zwischen einem Himmelskörper und dem Zentralgestirn (halbe Länge der Bahnellipse).',
  Gasriese:
    'Ein riesiger Planet (wie Jupiter oder Saturn), der fast nur aus Gas besteht und keinen festen Boden zum Landen hat.',
  Eisriese:
    'Ein kalter Riesenplanet (wie Uranus oder Neptun) mit viel gefrorenem Wasser, Ammoniak und Methan im Inneren.',
  Zwergplanet:
    'Ein kleiner, kugelrunder Himmelskörper (wie Pluto oder Ceres), der sich seine Umlaufbahn mit vielen anderen Eis- oder Felsbrocken teilt.',
  Komet:
    'Ein ‚schmutziger Schneeball‘ aus Eis und Staub. In Sonnennähe taut er auf und bekommt einen langen leuchtenden Schweif!',
  Retrograd:
    'Rückwärts laufend: Der Himmelskörper kreist oder dreht sich genau entgegen der Richtung der meisten Planeten.',
  Schwerelosigkeit:
    'Im freien Fall um die Erde (z. B. auf der ISS) spürt man sein eigenes Gewicht nicht – alles schwebt!',
  Erdorbit: 'Die Umlaufbahn rund um unsere Erde, auf der Satelliten, die ISS und das Hubble-Teleskop fliegen.',
  'Lagrange-Punkt L2':
    'Ein besonderer Gleichgewichtspunkt 1,5 Millionen Kilometer hinter der Erde (auf der Linie Sonne → Erde → L2), an dem Teleskope wie JWST und Gaia stabil mit der Erde mitfliegen.',
  'Lagrange-Punkte':
    '5 besondere „Parkplätze“ im Weltall (L1 bis L5), an denen sich die Anziehungskraft von Sonne und Erde sowie die Fliehkraft genau die Waage halten – dort braucht ein Raumfahrzeug kaum Treibstoff!',
  'Interstellarer Raum':
    'Der riesige Raum zwischen den Sternen außerhalb der schützenden Blase unseres Sonnenwindes.',
  Korona:
    'Die äußerste, über eine Million Grad heiße Gashülle der Sonne, die man bei einer Sonnenfinsternis als Strahlenkranz sieht.',
};

@Component({
  selector: 'app-term',
  template: `
    <span class="glossary-wrapper" tabindex="0">
      <span class="glossary-label">{{ displayText() }}</span>
      <span class="glossary-tooltip" role="tooltip">
        <strong>{{ term() }}:</strong> {{ explanation() }}
      </span>
    </span>
  `,
  styles: `
    .glossary-wrapper {
      position: relative;
      display: inline-block;
      cursor: help;
      border-bottom: 1.5px dotted var(--accent-primary);
      color: inherit;
      font-weight: 600;
    }
    .glossary-tooltip {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
      width: min(260px, 75vw);
      padding: 0.5rem 0.65rem;
      border-radius: var(--radius-md);
      background-color: #111d3b;
      color: #f8fafc;
      border: 1px solid #60a5fa;
      font-size: 0.78rem;
      font-weight: 400;
      line-height: 1.38;
      text-align: left;
      white-space: normal;
      z-index: 250;
      pointer-events: none;
      box-shadow: 0 6px 16px rgba(11, 19, 43, 0.35);
      transition: opacity 0.14s ease;
    }
    .glossary-wrapper:hover .glossary-tooltip,
    .glossary-wrapper:focus .glossary-tooltip {
      visibility: visible;
      opacity: 1;
    }
  `,
})
export class GlossaryTermComponent {
  readonly term = input.required<string>();
  readonly label = input<string>();

  protected readonly displayText = computed(() => this.label() || this.term());
  protected readonly explanation = computed(
    () =>
      GLOSSARY_DEFINITIONS[this.term()] ??
      'Ein Fachbegriff aus der Astronomie und Raumfahrt.',
  );
}
