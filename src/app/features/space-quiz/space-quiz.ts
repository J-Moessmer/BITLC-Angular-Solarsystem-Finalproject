/**
 * Projekt / Modul: SSI App – Solar System Info App / SpaceQuizComponent (space-quiz.ts)
 * FCPP-Referenz: P50-U10 (A10), P50-U20 (A20, A30 – Signal-gesteuertes Quiz & Auswertung), P50-U30 (A40 – Kategoriewahl links)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v2.0
 * Hinweis: Umsetzung von Plan-Element P50 inkl. 4 Kategorien, Zufalls-Wähler für „Quiz des Tages", Lösungsprüfung sowie lokal eingebettetem Bild-Steckbrief (InfoboxDetailComponent) direkt auf der Quiz-Seite mit KI-Unterstützung erstellt.
 */

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { SolarSystemDataService } from '../../core/services/solar-system-data.service';
import { QuizCategoryId } from '../../core/models/quiz.model';
import { CelestialBody } from '../../core/models/celestial-body.model';
import { InfoboxDetailComponent } from '../solar-system-view/infobox-detail/infobox-detail';

@Component({
  selector: 'app-space-quiz',
  imports: [RouterLink, InfoboxDetailComponent],
  templateUrl: './space-quiz.html',
  styleUrl: './space-quiz.css',
})
export class SpaceQuizComponent implements OnInit {
  protected readonly quizService = inject(QuizService);
  protected readonly solarDataService = inject(SolarSystemDataService);

  protected readonly optionLetters = ['A', 'B', 'C', 'D'] as const;

  readonly previewBodyId = signal<string | null>(null);
  readonly isSteckbriefOpen = signal<boolean>(true);

  /** KI-generierter Block: Löst den passenden Himmelskörper für den lokalen Quiz-Steckbrief auf */
  readonly activeSteckbriefBody = computed<CelestialBody | null>(() => {
    const targetId = this.previewBodyId() ?? this.quizService.currentQuestion()?.relatedBodyId;
    if (!targetId) {
      return null;
    }
    return this.solarDataService.bodies().find((b) => b.id === targetId) ?? null;
  });

  readonly activeSteckbriefChildren = computed<CelestialBody[]>(() => {
    const current = this.activeSteckbriefBody();
    if (!current || current.childrenIds.length === 0) {
      return [];
    }
    const all = this.solarDataService.bodies();
    return current.childrenIds
      .map((cid) => all.find((b) => b.id === cid))
      .filter((b): b is CelestialBody => b !== undefined);
  });

  readonly activeSteckbriefParent = computed<CelestialBody | null>(() => {
    const current = this.activeSteckbriefBody();
    if (!current?.parentId) {
      return null;
    }
    return this.solarDataService.bodies().find((b) => b.id === current.parentId) ?? null;
  });

  async ngOnInit(): Promise<void> {
    void this.solarDataService.loadSolarSystemData();
    await this.quizService.loadQuestions();
  }

  onSelectCategory(categoryId: QuizCategoryId): void {
    this.previewBodyId.set(null);
    this.isSteckbriefOpen.set(true);
    this.quizService.selectCategory(categoryId);
  }

  onRerollDaily(): void {
    this.previewBodyId.set(null);
    this.isSteckbriefOpen.set(true);
    this.quizService.rerollDailyQuiz();
  }

  onChooseOption(optionIndex: number): void {
    this.quizService.chooseOption(optionIndex);
  }

  onCheckAnswer(): void {
    this.previewBodyId.set(this.quizService.currentQuestion()?.relatedBodyId ?? null);
    this.isSteckbriefOpen.set(true);
    this.quizService.checkCurrentAnswer();
  }

  onNextQuestion(): void {
    this.previewBodyId.set(null);
    this.isSteckbriefOpen.set(true);
    this.quizService.nextQuestion();
  }

  onRestartQuiz(): void {
    this.previewBodyId.set(null);
    this.isSteckbriefOpen.set(true);
    this.quizService.restartQuiz();
  }

  onSelectSteckbriefBody(bodyId: string): void {
    this.previewBodyId.set(bodyId);
    this.isSteckbriefOpen.set(true);
  }

  onToggleSteckbrief(): void {
    this.isSteckbriefOpen.update((open) => !open);
  }
}
