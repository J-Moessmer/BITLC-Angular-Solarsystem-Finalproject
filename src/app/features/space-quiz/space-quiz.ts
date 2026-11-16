/**
 * Projekt / Modul: SSI App – Solar System Info App / SpaceQuizComponent (space-quiz.ts)
 * FCPP-Referenz: P50-U10 (A10), P50-U20 (A20, A30 – Signal-gesteuertes Quiz & Auswertung), P50-U30 (A40 – Kategoriewahl links)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.2
 * Hinweis: Vollständige Umsetzung von Plan-Element P50 inkl. Kategoriewahl links, 4 Antwortmöglichkeiten (A-D), "Lösung prüfen", "Nächste Frage" und kindgerechter Auswertungskarte mit KI-Unterstützung erstellt.
 */

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { QuizCategoryId } from '../../core/models/quiz.model';

@Component({
  selector: 'app-space-quiz',
  imports: [RouterLink],
  templateUrl: './space-quiz.html',
  styleUrl: './space-quiz.css',
})
export class SpaceQuizComponent implements OnInit {
  protected readonly quizService = inject(QuizService);

  protected readonly optionLetters = ['A', 'B', 'C', 'D'] as const;

  async ngOnInit(): Promise<void> {
    await this.quizService.loadQuestions();
  }

  onSelectCategory(categoryId: QuizCategoryId): void {
    this.quizService.selectCategory(categoryId);
  }

  onChooseOption(optionIndex: number): void {
    this.quizService.chooseOption(optionIndex);
  }

  onCheckAnswer(): void {
    this.quizService.checkCurrentAnswer();
  }

  onNextQuestion(): void {
    this.quizService.nextQuestion();
  }

  onRestartQuiz(): void {
    this.quizService.restartQuiz();
  }
}
