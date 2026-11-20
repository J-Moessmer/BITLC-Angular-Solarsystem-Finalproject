/**
 * Projekt / Modul: SSI App – Solar System Info App / Extra Comparison Bodies (extra-comparison-bodies.data.ts)
 * FCPP-Referenz: P30-U10, P30-U20 (Maßstabs- & Größenvergleich – Extrasolare & allgemeine Vergleichskörper)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v1.1
 * Hinweis: Kindgerechter Zusatzkatalog für Alltagsgrößen (inkl. Satellit Vanguard 1 in P30), Exoplaneten, ferne Sterne, Überriesen und Schwarze Löcher im Größenvergleich mit KI-Unterstützung erstellt.
 */

import { CelestialBody, OrbitalElements } from '../../core/models/celestial-body.model';

const DEFAULT_COMPARE_ORBITAL: OrbitalElements = {
  sma: { code: 'SMA', label: 'Große Halbachse', formattedValue: '–', childExplanation: 'Objekt außerhalb unseres Sonnensystems bzw. Vergleichsmaßstab.' },
  ecc: { code: 'ECC', label: 'Exzentrizität', formattedValue: '–', childExplanation: 'Für diesen Größenvergleich wird nur der Durchmesser benötigt.' },
  inc: { code: 'INC', label: 'Bahnneigung', formattedValue: '–', childExplanation: '–' },
  lan: { code: 'LAN', label: 'Aufsteigender Knoten', formattedValue: '–', childExplanation: '–' },
  lpe: { code: 'LPE', label: 'Länge des Perihels', formattedValue: '–', childExplanation: '–' },
  mna: { code: 'MNA', label: 'Mittlere Anomalie', formattedValue: '–', childExplanation: '–' },
  ref: { code: 'REF', label: 'Referenzsystem', formattedValue: 'Größenvergleich', childExplanation: 'Reiner Durchmesser- und Volumenvergleich.' },
};

function makeExtraBody(config: {
  id: string;
  name: string;
  subtitle: string;
  category: CelestialBody['category'];
  categoryLabel: string;
  colorHex: string;
  accentColorHex: string;
  diameterKm: number;
  distanceFromEarthKm: number;
  shortSummary: string;
  comparisonHint: string;
  wikipediaUrl: string;
}): CelestialBody {
  return {
    id: config.id,
    name: config.name,
    subtitle: config.subtitle,
    category: config.category,
    categoryLabel: config.categoryLabel,
    childrenIds: [],
    wikimediaImageUrl: '',
    imageUrl: 'assets/images/star.svg',
    imageCredit: 'Astronomische Messdaten (Größenvergleich)',
    colorHex: config.colorHex,
    accentColorHex: config.accentColorHex,
    diameterKm: config.diameterKm,
    distanceFromSunKm: config.distanceFromEarthKm,
    distanceFromSunAu: 0,
    distanceFromEarthKm: config.distanceFromEarthKm,
    orbitalPeriodDays: 0,
    orbitalPeriodLabel: 'Außerhalb des Sonnensystems',
    inclinationToSolarEquatorDeg: 0,
    overviewOrbitRadiusSvg: 0,
    overviewBodyRadiusSvg: 10,
    orbitAngleDeg: 0,
    shortSummary: config.shortSummary,
    childFriendlyFacts: [],
    comparisonHint: config.comparisonHint,
    wikipediaUrl: config.wikipediaUrl,
    orbitalElements: DEFAULT_COMPARE_ORBITAL,
  };
}

export const EVERYDAY_COMPARISON_IDS = new Set([
  'vanguard-1',
  'soccer-ball',
  'basketball',
  'one-meter-sphere',
  'mount-everest',
  'germany-size',
]);
export const EXOPLANET_COMPARISON_IDS = new Set(['trappist-1e', '55-cancri-e', 'hd-189733b']);
export const GIANT_STAR_COMPARISON_IDS = new Set([
  'neutron-star',
  'proxima-centauri',
  'sirius-a',
  'pollux',
  'sagittarius-a',
  'arcturus',
  'rigel',
  'antares',
  'beteigeuze',
  'uy-scuti',
  'stephenson-2-18',
]);

export const EXTRA_COMPARISON_BODIES: readonly CelestialBody[] = [
  makeExtraBody({
    id: 'soccer-ball',
    name: 'Fußball (Größe 5)',
    subtitle: 'Ca. 22 cm Durchmesser – so groß wie ein echter Spielball',
    category: 'dwarf-planet',
    categoryLabel: 'Alltag & Sport (22 cm)',
    colorHex: '#38BDF8',
    accentColorHex: '#E0F2FE',
    diameterKm: 0.00022,
    distanceFromEarthKm: 0,
    shortSummary:
      'Ein normaler Fußball der Größe 5 misst etwa 22 Zentimeter im Durchmesser. Damit kannst du direkt vergleichen, wie winzig unser Alltag neben einem 1-Meter-Ball, einem Berg oder sogar einem Planeten ist!',
    comparisonHint: 'Etwa 22 cm groß – passt locker in deine Hände.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Fu%C3%9Fball_(Sportger%C3%A4t)',
  }),
  makeExtraBody({
    id: 'basketball',
    name: 'Basketball',
    subtitle: 'Ca. 24 cm Durchmesser – knapp breiter als ein Fußball',
    category: 'dwarf-planet',
    categoryLabel: 'Alltag & Sport (24 cm)',
    colorHex: '#EA580C',
    accentColorHex: '#FED7AA',
    diameterKm: 0.00024,
    distanceFromEarthKm: 0,
    shortSummary:
      'Ein Basketball (Größe 7) hat einen Durchmesser von rund 24 Zentimetern und ist damit ein kleines Stück breiter als ein Fußball. Neben einer 1-Meter-Kugel erkennst du den Unterschied sofort!',
    comparisonHint: 'Etwa 24 cm groß – ein kleines Stück größer als ein Fußball.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Basketball',
  }),
  makeExtraBody({
    id: 'one-meter-sphere',
    name: '1-Meter-Kugel (Gymnastikball)',
    subtitle: 'Genau 1 Meter (100 cm) Durchmesser – perfekter Alltags-Maßstab',
    category: 'dwarf-planet',
    categoryLabel: 'Alltag & Maßstab (1 m)',
    colorHex: '#A855F7',
    accentColorHex: '#E9D5FF',
    diameterKm: 0.001,
    distanceFromEarthKm: 0,
    shortSummary:
      'Eine Kugel mit genau 1 Meter (100 cm) Durchmesser ist etwa so hoch wie ein sehr großer Gymnastikball oder ein Tisch. Ungefähr 4,5 Fußbälle passen nebeneinander quer durch sie hindurch!',
    comparisonHint: 'Genau 1 Meter (100 cm) breit – rund 4-mal so breit wie ein Basketball.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Meter',
  }),
  makeExtraBody({
    id: 'mount-everest',
    name: 'Mount Everest (Höchster Berg der Erde)',
    subtitle: '8.848 m hoch – fast 9 km vom Meeresspiegel bis zum Gipfel',
    category: 'dwarf-planet',
    categoryLabel: 'Alltag & Erde (Vergleich)',
    colorHex: '#94A3B8',
    accentColorHex: '#E2E8F0',
    diameterKm: 9,
    distanceFromEarthKm: 0,
    shortSummary:
      'Der Mount Everest ist mit knapp 9 Kilometern Höhe (8.848 m) der höchste Berg auf unserer Erde. Im Vergleich mit dem Kometen Tschuri oder dem Marsmond Phobos siehst du sofort, wie klein selbst ein ganzer Riesenberg gegen Planeten ist!',
    comparisonHint: 'So hoch wie der höchste Berg der Erde (ca. 9 km).',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Mount_Everest',
  }),
  makeExtraBody({
    id: 'neutron-star',
    name: 'Neutronenstern / Pulsar',
    subtitle: 'Schwerer als unsere Sonne – gepresst in eine 20-km-Stadt-Kugel!',
    category: 'star',
    categoryLabel: 'Exotisches Objekt (All)',
    colorHex: '#38BDF8',
    accentColorHex: '#BAE6FD',
    diameterKm: 20,
    distanceFromEarthKm: 4000000000000000,
    shortSummary:
      'Wenn ein riesiger Stern explodiert, bleibt manchmal ein winziger, ultraschwerer Neutronenstern übrig. Er ist nur rund 20 Kilometer breit (so groß wie eine Stadt!), wiegt aber mehr als unsere ganze riesige Sonne!',
    comparisonHint: 'Nur so breit wie eine Großstadt (20 km), aber schwerer als die Sonne.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Neutronenstern',
  }),
  makeExtraBody({
    id: 'germany-size',
    name: 'Deutschland (Nord–Süd-Ausdehnung)',
    subtitle: 'Rund 876 km von der Nordsee bis zu den Alpen',
    category: 'dwarf-planet',
    categoryLabel: 'Alltag & Erde (Vergleich)',
    colorHex: '#10B981',
    accentColorHex: '#A7F3D0',
    diameterKm: 876,
    distanceFromEarthKm: 0,
    shortSummary:
      'Von ganz oben im Norden bis ganz unten in den Süden misst Deutschland etwa 876 Kilometer. Das ist fast genauso breit wie der Zwergplanet Ceres (939 km)!',
    comparisonHint: 'Fast genau so breit wie der Zwergplanet Ceres im Asteroidengürtel.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Deutschland',
  }),
  makeExtraBody({
    id: 'trappist-1e',
    name: 'TRAPPIST-1 e (Erdähnlicher Exoplanet)',
    subtitle: 'Ein Felsplanet in der lebensfreundlichen Zone eines fremden Sterns',
    category: 'planet',
    categoryLabel: 'Exoplanet (40 Lichtjahre)',
    colorHex: '#0EA5E9',
    accentColorHex: '#BAE6FD',
    diameterKm: 11735,
    distanceFromEarthKm: 380000000000000,
    shortSummary:
      'TRAPPIST-1 e ist ein fremder Planet außerhalb unseres Sonnensystems (Exoplanet). Er ist fast genauso groß wie unsere Erde (ca. 92 % Erddurchmesser) und könnte flüssiges Wasser auf seiner Oberfläche haben!',
    comparisonHint: 'Fast ein Zwilling unserer Erde in 40 Lichtjahren Entfernung.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/TRAPPIST-1',
  }),
  makeExtraBody({
    id: '55-cancri-e',
    name: '55 Cancri e (Heiße Super-Erde)',
    subtitle: 'Doppelt so breit wie die Erde – ein glühender Gesteinsplanet',
    category: 'planet',
    categoryLabel: 'Exoplanet (Super-Erde)',
    colorHex: '#F43F5E',
    accentColorHex: '#FECDD3',
    diameterKm: 23900,
    distanceFromEarthKm: 388000000000000,
    shortSummary:
      '55 Cancri e ist eine sogenannte „Super-Erde“ – fast doppelt so groß wie unsere Erde! Weil er seinem Stern extrem nah ist, herrschen dort über 2.000 °C und ein ganzes Jahr dauert nur 18 Stunden.',
    comparisonHint: 'Fast doppelt so groß im Durchmesser wie unsere Erde.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/55_Cancri_e',
  }),
  makeExtraBody({
    id: 'hd-189733b',
    name: 'HD 189733 b (Blauer „Heißer Jupiter“)',
    subtitle: 'Ein stürmischer, tiefblauer Gasriese größer als Jupiter',
    category: 'planet',
    categoryLabel: 'Exoplanet (Gasriese)',
    colorHex: '#2563EB',
    accentColorHex: '#93C5FD',
    diameterKm: 162700,
    distanceFromEarthKm: 610000000000000,
    shortSummary:
      'Dieser ferne Exoplanet sieht von außen wunderschön kobaltblau aus wie eine Murmel – doch auf ihm rasen über 8.000 km/h schnelle Stürme mit flüssigen Glaströpfchen!',
    comparisonHint: 'Sogar noch ein Stück größer als unser Riesenplanet Jupiter.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/HD_189733_b',
  }),
  makeExtraBody({
    id: 'proxima-centauri',
    name: 'Proxima Centauri (Roter Zwerg · Nächster Nachbarstern)',
    subtitle: 'Nur 1,5-mal so groß wie Jupiter – der uns nächste Stern nach der Sonne',
    category: 'star',
    categoryLabel: 'Nachbarstern (4,24 Lichtjahre)',
    colorHex: '#EF4444',
    accentColorHex: '#FCA5A5',
    diameterKm: 214500,
    distanceFromEarthKm: 40100000000000,
    shortSummary:
      'Proxima Centauri ist der nächste Stern hinter unserer Sonne – und ein kleiner Roter Zwerg! Er ist zwar ein echter leuchtender Stern, aber nur rund anderthalb Mal so groß wie unser Planet Jupiter.',
    comparisonHint: 'Nur etwa 15 % so groß wie unsere Sonne!',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Proxima_Centauri',
  }),
  makeExtraBody({
    id: 'sirius-a',
    name: 'Sirius A (Hellster Stern am Nachthimmel)',
    subtitle: 'Fast doppelt so groß und 25-mal so hell wie unsere Sonne',
    category: 'star',
    categoryLabel: 'Stern (8,6 Lichtjahre)',
    colorHex: '#BAE6FD',
    accentColorHex: '#E0F2FE',
    diameterKm: 2380000,
    distanceFromEarthKm: 81400000000000,
    shortSummary:
      'Sirius A im Sternbild Großer Hund ist der hellste Stern an unserem gesamten Nachthimmel. Er strahlt blau-weiß und hat fast den doppelten Durchmesser unserer Sonne.',
    comparisonHint: 'Rund 1,7-mal so breit wie unsere Sonne.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Sirius',
  }),
  makeExtraBody({
    id: 'pollux',
    name: 'Pollux (Oranger Riesenstern)',
    subtitle: 'Fast 9-mal so groß wie unsere Sonne – ein Riese im Sternbild Zwillinge',
    category: 'star',
    categoryLabel: 'Riesenstern (34 Lichtjahre)',
    colorHex: '#FB923C',
    accentColorHex: '#FED7AA',
    diameterKm: 12240000,
    distanceFromEarthKm: 320000000000000,
    shortSummary:
      'Pollux ist ein leuchtender oranger Riesenstern im Sternbild Zwillinge. Unsere Sonne ist im Vergleich zu ihm schon ziemlich klein!',
    comparisonHint: 'Etwa 8,8-mal so breit wie unsere Sonne.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Pollux_(Stern)',
  }),
  makeExtraBody({
    id: 'sagittarius-a',
    name: 'Sagittarius A* (Schwarzes Loch im Milchstraßen-Zentrum)',
    subtitle: 'Der Ereignishorizont unseres supermassereichen Schwarzen Lochs',
    category: 'star',
    categoryLabel: 'Schwarzes Loch (26.670 Lichtjahre)',
    colorHex: '#312E81',
    accentColorHex: '#A5B4FC',
    diameterKm: 23600000,
    distanceFromEarthKm: 252000000000000000,
    shortSummary:
      'Im Zentrum unserer Galaxie Milchstraße sitzt das riesige Schwarze Loch Sagittarius A*. Es enthält die Masse von über 4 Millionen Sonnen, und sein dunkler Ereignishorizont ist rund 17-mal so breit wie unsere Sonne!',
    comparisonHint: 'Der Schatten des Ereignishorizonts misst rund 23,6 Millionen km.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Sagittarius_A*',
  }),
  makeExtraBody({
    id: 'arcturus',
    name: 'Arktur (Roter Riese)',
    subtitle: 'Rund 25-mal so groß wie die Sonne – hellster Stern am Nordhimmel',
    category: 'star',
    categoryLabel: 'Roter Riese (37 Lichtjahre)',
    colorHex: '#F97316',
    accentColorHex: '#FED7AA',
    diameterKm: 35300000,
    distanceFromEarthKm: 347000000000000,
    shortSummary:
      'Arktur (im Sternbild Bärenhüter) hat sich im Alter zu einem gigantischen Roten Riesen aufgebläht – etwa 25-mal größer im Durchmesser als unsere Sonne!',
    comparisonHint: 'Ungefähr 25 Sonnen passen nebeneinander durch Arktur.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Arktur',
  }),
  makeExtraBody({
    id: 'rigel',
    name: 'Rigel (Blauer Überriese im Orion)',
    subtitle: 'Fast 79-mal so groß wie unsere Sonne und zehntausende Male heller',
    category: 'star',
    categoryLabel: 'Blauer Überriese (860 Lichtjahre)',
    colorHex: '#60A5FA',
    accentColorHex: '#DBEAFE',
    diameterKm: 109800000,
    distanceFromEarthKm: 8100000000000000,
    shortSummary:
      'Rigel ist ein extrem heißer, blendend blauer Überriese im Sternbild Orion. Er ist so groß, dass er bis fast zur Umlaufbahn des Planeten Merkur reichen würde!',
    comparisonHint: 'Rund 79-mal so breit wie unsere Sonne.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Rigel',
  }),
  makeExtraBody({
    id: 'antares',
    name: 'Antares (Roter Überriese im Skorpion)',
    subtitle: 'Rund 680-mal so groß wie unsere Sonne – größer als die Marsbahn!',
    category: 'star',
    categoryLabel: 'Roter Überriese (550 Lichtjahre)',
    colorHex: '#DC2626',
    accentColorHex: '#FCA5A5',
    diameterKm: 946000000,
    distanceFromEarthKm: 5200000000000000,
    shortSummary:
      'Antares leuchtet tiefrot im Sternbild Skorpion. Wenn Antares an Stelle unserer Sonne stünde, würde er Merkur, Venus, unsere Erde und sogar den Mars komplett verschlucken!',
    comparisonHint: 'Fast 680-mal so groß im Durchmesser wie unsere Sonne.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Antares',
  }),
  makeExtraBody({
    id: 'beteigeuze',
    name: 'Beteigeuze (Roter Überriese im Orion)',
    subtitle: 'Rund 886-mal so groß wie die Sonne – eine riesige rote Glaskugel im Orion',
    category: 'star',
    categoryLabel: 'Roter Überriese (550 Lichtjahre)',
    colorHex: '#EA580C',
    accentColorHex: '#FED7AA',
    diameterKm: 1234000000,
    distanceFromEarthKm: 5200000000000000,
    shortSummary:
      'Beteigeuze bildet die linke Schulter des Sternbilds Orion. Dieser rote Überriese ist fast tausendmal so breit wie unsere Sonne – darin würden rund 700 Millionen Sonnen Platz finden!',
    comparisonHint: 'Fast 890-mal so breit wie unsere Sonne!',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Beteigeuze',
  }),
  makeExtraBody({
    id: 'uy-scuti',
    name: 'UY Scuti (Roter Hyperriese)',
    subtitle: 'Über 1.700-mal so groß wie unsere Sonne – größer als die Jupiterbahn!',
    category: 'star',
    categoryLabel: 'Roter Hyperriese',
    colorHex: '#B91C1C',
    accentColorHex: '#FCA5A5',
    diameterKm: 2376000000,
    distanceFromEarthKm: 50000000000000000,
    shortSummary:
      'UY Scuti ist ein gigantischer Roter Hyperriese. Ein Flugzeug bräuchte für eine einzige Umrundung von UY Scuti mehr als tausend Jahre ohne Pause!',
    comparisonHint: 'Rund 1.700 Sonnen passen nebeneinander quer durch UY Scuti.',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/UY_Scuti',
  }),
  makeExtraBody({
    id: 'stephenson-2-18',
    name: 'Stephenson 2-18 (Größter bekannter Stern)',
    subtitle: 'Rund 2.150-mal so groß wie die Sonne – reicht fast bis zur Saturnbahn!',
    category: 'star',
    categoryLabel: 'Roter Hyperriese (Rekord)',
    colorHex: '#991B1B',
    accentColorHex: '#FECACA',
    diameterKm: 2991000000,
    distanceFromEarthKm: 180000000000000000,
    shortSummary:
      'Stephenson 2-18 gilt als der größte bisher bekannte Stern im Universum! Stünde er im Zentrum unseres Sonnensystems, würde seine glühende Oberfläche bis hinter die Jupiterbahn fast bis zum Saturn reichen!',
    comparisonHint: 'Etwa 2.150-mal so breit wie unsere Sonne – rund 10 Milliarden Sonnen würden in ihn hineinpassen!',
    wikipediaUrl: 'https://de.wikipedia.org/wiki/Stephenson_2-18',
  }),
];
