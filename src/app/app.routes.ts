/**
 * Projekt / Modul: SSI App – Solar System Info App / Routing Configuration (app.routes.ts)
 * FCPP-Referenz: P10 (P10-U10), P20 (P20-U10..U40), P30 (P30-U10), P40 (P40-U10, P40-U20), P50 (P50-U10)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.2
 * Hinweis: Vollständiges FCPP-Routing-Gerüst (P10 bis P50) inkl. Landing Page mit Tutorial auf Startroute '' sowie Parameter-Route :bodyId für P20 mit KI-Unterstützung erstellt.
 */

import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page';
import { SolarSystemViewComponent } from './features/solar-system-view/solar-system-view';
import { SizeComparisonComponent } from './features/size-comparison/size-comparison';
import { ResearchMissionsComponent } from './features/research-missions/research-missions';
import { SpaceQuizComponent } from './features/space-quiz/space-quiz';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
    title: 'Startseite & Tutorial – SSI App',
  },
  {
    path: 'solar-system',
    component: SolarSystemViewComponent,
    title: 'Sonnensystem (P10) – SSI App',
  },
  {
    path: 'solar-system/:bodyId',
    component: SolarSystemViewComponent,
    title: 'Himmelskörper-Details (P20) – SSI App',
  },
  {
    path: 'size-comparison',
    component: SizeComparisonComponent,
    title: 'Größenvergleich (P30) – SSI App',
  },
  {
    path: 'research',
    component: ResearchMissionsComponent,
    title: 'Forschungsprojekte (P40) – SSI App',
  },
  {
    path: 'quiz',
    component: SpaceQuizComponent,
    title: 'Weltraum-Quiz (P50) – SSI App',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
