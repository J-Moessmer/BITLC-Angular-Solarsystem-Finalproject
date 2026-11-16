/**
 * Projekt / Modul: SSI App – Solar System Info App / SpaceQuizComponent (space-quiz.ts)
 * FCPP-Referenz: P50-U10, P50-U20, P50-U30 (Weltraum-Quiz & Auswertung)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Routing-Grundgerüst für das Plan-Element P50 mit KI-Unterstützung erstellt.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-space-quiz',
  imports: [RouterLink],
  template: `
    <section class="feature-card" aria-labelledby="p50-heading">
      <span class="fcpp-tag">P50 · Weltraum-Quiz & Auswertung</span>
      <h2 id="p50-heading">Teste dein Weltraum-Wissen!</h2>
      <p>
        Hier entsteht das interaktive Quiz mit Kategoriewahl links (Quiz des Tages, Missionsquiz,
        Raumkörperquiz), 4 Antwortmöglichkeiten (A–D) und kindgerechter Endauswertung (P50-U20,
        P50-U30).
      </p>
      <div class="quiz-actions">
        <a class="back-btn" routerLink="/solar-system">⬅️ Zurück zum Sonnensystem (--> P10)</a>
      </div>
    </section>
  `,
  styles: `
    .feature-card {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 2px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-card);
    }
    .fcpp-tag {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
    h2 {
      margin: 0 0 0.5rem;
    }
    p {
      margin: 0 0 1rem;
      color: var(--card-text-secondary);
    }
    .back-btn {
      display: inline-block;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      font-weight: 700;
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--card-text-primary);
    }
    .back-btn:hover {
      background-color: var(--card-bg-subtle);
      text-decoration: none;
    }
  `,
})
export class SpaceQuizComponent {}
