/**
 * Projekt / Modul: SSI App – Solar System Info App / QuizService (quiz.service.ts)
 * FCPP-Referenz: P50-U10, P50-U20, P50-U30 (Weltraum-Quiz, Kategoriewahl & kindgerechte Auswertung)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v1.3
 * Hinweis: Signal-basierter Quiz-Service für 4 Kategorien, Zufalls-Wähler im „Quiz des Tages" (Fisher-Yates), Antwortprüfung, Punktestand, Bestwert-Speicherung über ExplorerProgressService und kindgerechtes Lob mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of } from 'rxjs';
import { QuizCategoryId, QuizCategoryInfo, QuizQuestion } from '../models/quiz.model';
import { ExplorerProgressService, QuizBestScore } from './explorer-progress.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly explorerProgress = inject(ExplorerProgressService);
  private readonly questionsUrl = 'assets/data/quiz-questions.json';

  readonly categories: readonly QuizCategoryInfo[] = [
    {
      id: 'daily',
      label: 'Quiz des Tages',
      icon: '🌟',
      description: '7 zufällig ausgewählte Weltraum-Fragen aus allen Kategorien – jede Runde neu gemischt!',
    },
    {
      id: 'missions',
      label: 'Missionsquiz',
      icon: '🛰️',
      description: 'Fragen zu Rovern, Teleskopen, Raumstationen, Sonden & Raumfahrt-Pionieren.',
    },
    {
      id: 'celestial',
      label: 'Raumkörperquiz',
      icon: '🪐',
      description: 'Fragen zu Sonne, Planeten, Monden & Zwergplaneten.',
    },
    {
      id: 'astronomy',
      label: 'Bahnen, Kometen & Rekorde',
      icon: '☄️',
      description: 'Fragen zu den 7 Bahnelementen, Größenvergleichen, Kometen, Gürteln & Weltraum-Rekorden.',
    },
  ];

  readonly dailyQuestionCount = 7;

  private readonly allQuestionsState = signal<QuizQuestion[]>([]);
  private readonly dailyQuestionsState = signal<QuizQuestion[]>([]);

  /** Signals gemäß FCPP P50-U20 & P50-U30 */
  readonly selectedCategory = signal<QuizCategoryId>('daily');
  readonly currentQuestionIndex = signal<number>(0);
  readonly selectedOptionIndex = signal<number | null>(null);
  readonly isAnswerChecked = signal<boolean>(false);
  readonly scoreCorrect = signal<number>(0);
  readonly scoreWrong = signal<number>(0);
  readonly isQuizFinished = signal<boolean>(false);
  readonly isNewPersonalRecord = signal<boolean>(false);

  getCategoryBestScore(category: QuizCategoryId): QuizBestScore | null {
    return this.explorerProgress.getBestScore(category);
  }

  /** Fragenliste der aktuell gewählten Kategorie (P50-U30) */
  readonly activeQuestions = computed<QuizQuestion[]>(() => {
    const all = this.allQuestionsState();
    const cat = this.selectedCategory();
    if (cat === 'daily') {
      const daily = this.dailyQuestionsState();
      return daily.length > 0 ? daily : all.slice(0, this.dailyQuestionCount);
    }
    return all.filter((q) => q.category === cat);
  });

  readonly currentQuestion = computed<QuizQuestion | null>(() => {
    const list = this.activeQuestions();
    const idx = this.currentQuestionIndex();
    return list[idx] ?? null;
  });

  readonly totalQuestions = computed<number>(() => this.activeQuestions().length);

  readonly isLastQuestion = computed<boolean>(
    () => this.currentQuestionIndex() >= this.totalQuestions() - 1,
  );

  /** Kindgerechtes, motivierendes Lob für die Endauswertung (P50-A30 / P50-U20) */
  readonly childPraiseSummary = computed<{ badge: string; title: string; message: string }>(() => {
    const correct = this.scoreCorrect();
    const total = Math.max(1, this.totalQuestions());
    const ratio = correct / total;

    if (ratio === 1) {
      return {
        badge: '🏆 Goldener Sternen-Kapitän!',
        title: 'Fantastisch! Du hast alle Fragen richtig beantwortet!',
        message:
          'Du kennst dich im Sonnensystem und bei den Weltraummissionen schon wie ein echter Profi-Astronom aus!',
      };
    }
    if (ratio >= 0.6) {
      return {
        badge: '🚀 Mutiger Planeten-Entdecker!',
        title: 'Super gemacht! Du hast das Weltraum-Quiz toll gemeistert!',
        message:
          'Du weißt schon richtig viel über unsere Planeten, Monde und Raumsonden. Weiter so!',
      };
    }
    return {
      badge: '🌟 Neugieriger Raumfahrt-Kadett!',
      title: 'Toll mitgemacht! Jede Forschungsreise beginnt mit dem ersten Flug!',
      message:
        'Du hast das Quiz erfolgreich abgeschlossen und viele spannende Weltraum-Geheimnisse entdeckt!',
    };
  });

  async loadQuestions(): Promise<QuizQuestion[]> {
    if (this.allQuestionsState().length === 0) {
      const data = await firstValueFrom(
        this.http
          .get<QuizQuestion[]>(this.questionsUrl)
          .pipe(catchError(() => of([] as QuizQuestion[]))),
      );
      this.allQuestionsState.set(data);
      this.shuffleDailyQuestions();
    } else if (this.dailyQuestionsState().length === 0) {
      this.shuffleDailyQuestions();
    }
    return this.allQuestionsState();
  }

  /** KI-generierter Block: Mischt den gesamten Fragenpool per Fisher-Yates für das „Quiz des Tages" */
  shuffleDailyQuestions(): void {
    const pool = [...this.allQuestionsState()];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.dailyQuestionsState.set(pool.slice(0, Math.min(this.dailyQuestionCount, pool.length)));
  }

  /** Würfelt eine neue Zufallsrunde für das „Quiz des Tages" (P50-U30) */
  rerollDailyQuiz(): void {
    this.selectedCategory.set('daily');
    this.restartQuiz();
  }

  /** Wählt eine Quiz-Kategorie links im Menü aus und startet die Runde neu (P50-U30) */
  selectCategory(category: QuizCategoryId): void {
    this.selectedCategory.set(category);
    this.restartQuiz();
  }

  /** Merkt die gewählte Antwort A, B, C oder D vor (vor dem Klick auf "Lösung prüfen") */
  chooseOption(optionIndex: number): void {
    if (this.isAnswerChecked()) {
      return;
    }
    this.selectedOptionIndex.set(optionIndex);
  }

  /** Prüft die gewählte Antwort und aktualisiert den Signal-Punktestand (P50-U20) */
  checkCurrentAnswer(): void {
    const question = this.currentQuestion();
    const chosen = this.selectedOptionIndex();
    if (!question || chosen === null || this.isAnswerChecked()) {
      return;
    }

    this.isAnswerChecked.set(true);
    if (chosen === question.correctOptionIndex) {
      this.scoreCorrect.update((c) => c + 1);
    } else {
      this.scoreWrong.update((w) => w + 1);
    }
  }

  /** Springt zur nächsten Frage oder blendet nach der letzten Frage die Auswertungskarte ein (P50-U20) */
  nextQuestion(): void {
    if (!this.isAnswerChecked()) {
      return;
    }
    if (this.isLastQuestion()) {
      const isRecord = this.explorerProgress.recordQuizScore(
        this.selectedCategory(),
        this.scoreCorrect(),
        this.totalQuestions(),
      );
      this.isNewPersonalRecord.set(isRecord);
      this.isQuizFinished.set(true);
      return;
    }
    this.currentQuestionIndex.update((i) => i + 1);
    this.selectedOptionIndex.set(null);
    this.isAnswerChecked.set(false);
  }

  /** Setzt das aktuelle Quiz zurück (--> P50) und mischt das „Quiz des Tages" bei Bedarf neu (P50-A30 / P50-U20) */
  restartQuiz(): void {
    if (this.selectedCategory() === 'daily') {
      this.shuffleDailyQuestions();
    }
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
    this.isAnswerChecked.set(false);
    this.scoreCorrect.set(0);
    this.scoreWrong.set(0);
    this.isQuizFinished.set(false);
    this.isNewPersonalRecord.set(false);
  }
}
