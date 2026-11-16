/**
 * Projekt / Modul: SSI App – Solar System Info App / SpaceQuizComponent Spec (space-quiz.spec.ts)
 * FCPP-Referenz: P50-U10, P50-U20, P50-U30 (Unit-Test für Weltraum-Quiz & Auswertung)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v1.0
 * Hinweis: Prüft Kategoriewahl links (P50-U30), Antwortprüfung (A-D) und die kindgerechte Auswertungskarte (P50-U20).
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SpaceQuizComponent } from './space-quiz';
import { QuizQuestion } from '../../core/models/quiz.model';

describe('SpaceQuizComponent (P50)', () => {
  const mockQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      category: 'missions',
      questionText: 'Auf welchem Planeten rollt der Rover Perseverance?',
      options: ['Venus', 'Mars', 'Jupiter', 'Neptun'],
      correctOptionIndex: 1,
      childExplanation: 'Auf dem Roten Planeten Mars!',
      relatedBodyId: 'mars',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceQuizComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should select quiz category, check answer, and show child-friendly evaluation card (P50-U20, P50-U30)', async () => {
    const fixture = TestBed.createComponent(SpaceQuizComponent);
    const httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const qReq = httpMock.expectOne('assets/data/quiz-questions.json');
    qReq.flush(mockQuestions);

    await fixture.whenStable();
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    comp.onSelectCategory('missions');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Auf welchem Planeten rollt der Rover Perseverance?',
    );

    comp.onChooseOption(1);
    comp.onCheckAnswer();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Auf dem Roten Planeten Mars!');

    comp.onNextQuestion();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bestanden! :)');
  });
});
