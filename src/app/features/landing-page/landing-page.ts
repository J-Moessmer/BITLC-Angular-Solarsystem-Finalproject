/**
 * Projekt / Modul: SSI App – Solar System Info App / LandingPageComponent (landing-page.ts)
 * FCPP-Referenz: P10 (Start- & Orientierungspunkt) sowie Schnellzugriff auf P20, P30, P40 und P50
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.0
 * Hinweis: Startseite (Landing Page) mit kindgerechter Modul-Übersicht und interaktivem 5-Schritt-Entdecker-Tutorial per Angular Signals erstellt.
 */

import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TutorialStep {
  stepNumber: number;
  shortLabel: string;
  title: string;
  icon: string;
  summary: string;
  tips: readonly string[];
  tryLabel: string;
  tryRoute: string;
}

export interface ModuleQuickCard {
  title: string;
  metricLabel: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPageComponent {
  /** KI-generierter Block: 5-schrittiges Entdecker-Tutorial für Grundschulkinder über alle App-Bereiche */
  readonly tutorialSteps: readonly TutorialStep[] = [
    {
      stepNumber: 1,
      shortLabel: 'Sternenkarte',
      title: 'Sternenkarte, Entdecker-Pfad & Zeitreise',
      icon: 'fa-solid fa-earth-europe',
      summary:
        'Auf der interaktiven Sternenkarte siehst du alle Planeten, Monde, Zwergplaneten, Kometen und berühmte Raumsonden auf ihren echten Umlaufbahnen rund um die Sonne.',
      tips: [
        'Klicke links im Entdecker-Pfad oder direkt auf der Karte auf einen Planeten – die Kamera fliegt sofort dorthin.',
        'Schalte oben zwischen Übersicht, Echt-Maßstab und Seitenansicht um oder blende mit „Lagrange-Punkte“ spannende Gleichgewichtsorte ein.',
        'Starte den Zeitraffer oder wähle einen historischen Meilenstein, um Bewegungen der Planeten live zu beobachten. Mit dem Mausrad zoomst du stufenlos.',
      ],
      tryLabel: 'Sternenkarte öffnen',
      tryRoute: '/solar-system',
    },
    {
      stepNumber: 2,
      shortLabel: 'Steckbriefe',
      title: 'Steckbriefe, 7 Bahnelemente & echte Quellen',
      icon: 'fa-solid fa-book-open',
      summary:
        'Zu jedem ausgewählten Himmelskörper öffnet sich rechts ein kindgerechter Steckbrief mit Fotos, spannenden Fakten und einfach erklärten Bahndaten.',
      tips: [
        'Schau dir im Bereich „Die 7 Bahnelemente (SMA bis REF)“ an, wie groß, schief oder eierförmig eine Umlaufbahn wirklich ist.',
        'Wechsle unter den Bildern und Fakten per Klick auf untergeordnete Monde, Raumstationen oder Lagrange-Punkte.',
        'Ganz unten findest du echte Links zu Wikipedia sowie offiziellen NASA- und ESA-Seiten zum Weiterlesen.',
      ],
      tryLabel: 'Steckbrief der Erde ansehen',
      tryRoute: '/solar-system/earth',
    },
    {
      stepNumber: 3,
      shortLabel: 'Größenvergleich',
      title: 'Größenvergleich – Vom Fußball bis zum Riesenstern',
      icon: 'fa-solid fa-ruler-combined',
      summary:
        'Wie riesig ist die Sonne gegen die Erde – oder der Riesenstern Stephenson 2-18 gegen einen 22-cm-Fußball? Hier legst du bis zu 5 Objekte direkt nebeneinander.',
      tips: [
        'Wähle oben ein Preset (z. B. „Fußball, Basketball, 1m-Kugel & Mount Everest“) oder stelle in den Dropdowns eigene Vergleiche zusammen.',
        'Mount Everest und Deutschland erscheinen als maßstabsgetreue Silhouetten statt als Kugeln, damit Höhen und Nord-Süd-Abstände sofort einleuchten.',
        'Ziehe den Zoom-Regler nach rechts bis 100 %, um Winzlinge groß zu machen – selbst Riesensterne bleiben als gekrümmter Horizont sichtbar.',
      ],
      tryLabel: 'Größenvergleich starten',
      tryRoute: '/size-comparison',
    },
    {
      stepNumber: 4,
      shortLabel: 'Missionen & ISS',
      title: '37 Raumfahrt-Missionen & Live-Position der ISS',
      icon: 'fa-solid fa-satellite',
      summary:
        'Entdecke echte Raumsonden, Mond-Rover und Weltraumteleskope der Vergangenheit und Gegenwart – inklusive Live-Position der Internationalen Raumstation ISS.',
      tips: [
        'Filtere die Forschungsprojekte nach Raumstationen, Teleskopen, Rovern, Raumsonden oder historischen Meilensteinen.',
        'Im ISS-Tracker siehst du Flughöhe, Geschwindigkeit und geografische Position – mit automatischem Offline-Fallback.',
        'Springe von jeder Mission direkt zum passenden Ziel-Planeten auf der Sternenkarte oder öffne den offiziellen NASA-/ESA-Link.',
      ],
      tryLabel: 'Missionen entdecken',
      tryRoute: '/research',
    },
    {
      stepNumber: 5,
      shortLabel: 'Weltraum-Quiz',
      title: 'Weltraum-Quiz mit Zufallswähler & Sofort-Steckbrief',
      icon: 'fa-solid fa-rocket',
      summary:
        'Teste dein Wissen im Quiz des Tages oder in vier Themen-Kategorien und schau dir nach jeder Antwort sofort den passenden Bild-Steckbrief an.',
      tips: [
        'Klicke im „Quiz des Tages“ auf „Fragen neu würfeln“, um aus 36 Fragen ein frisches 7-Fragen-Set auszuwürfeln.',
        'Nach „Lösung prüfen“ erscheint direkt auf der Quiz-Seite eine kindgerechte Erklärung plus Steckbrief mit Bildern.',
        'Zum Schluss erhältst du deinen Astronauten-Rang, alle Punkte und bei Wunsch den Tag- oder Nachtmodus oben rechts.',
      ],
      tryLabel: 'Weltraum-Quiz spielen',
      tryRoute: '/quiz',
    },
  ];

  readonly moduleCards: readonly ModuleQuickCard[] = [
    {
      title: 'Sonnensystem & Steckbriefe',
      metricLabel: '116 Objekte & L-Punkte',
      description: 'Interaktive 2D-Sternenkarte mit Zeitreise, Entdecker-Pfad, 7 Bahnelementen und echten Quellen.',
      icon: 'fa-solid fa-earth-europe',
      route: '/solar-system',
    },
    {
      title: 'Größenvergleich',
      metricLabel: '19 Zusatz-Objekte & Tiefenzoom',
      description: 'Planeten, Riesensterne, Exoplaneten, Bälle und SVG-Silhouetten von Mount Everest & Deutschland.',
      icon: 'fa-solid fa-ruler-combined',
      route: '/size-comparison',
    },
    {
      title: 'Forschungsprojekte',
      metricLabel: '37 Missionen & ISS-Live',
      description: 'Raumstationen, Teleskope, Mars-Rover und Sonden aus aller Welt mit Live-Telemetrie.',
      icon: 'fa-solid fa-satellite',
      route: '/research',
    },
    {
      title: 'Weltraum-Quiz',
      metricLabel: '36 Fragen in 4 Kategorien',
      description: 'Tages-Zufallswähler, sofortige Bild-Steckbriefe zur Lösung und Astronauten-Auswertung.',
      icon: 'fa-solid fa-rocket',
      route: '/quiz',
    },
  ];

  readonly activeStepIndex = signal<number>(0);

  readonly activeStep = computed<TutorialStep>(() => this.tutorialSteps[this.activeStepIndex()]);

  selectStep(index: number): void {
    if (index >= 0 && index < this.tutorialSteps.length) {
      this.activeStepIndex.set(index);
    }
  }

  prevStep(): void {
    this.activeStepIndex.update((i) => Math.max(0, i - 1));
  }

  nextStep(): void {
    this.activeStepIndex.update((i) => Math.min(this.tutorialSteps.length - 1, i + 1));
  }
}
