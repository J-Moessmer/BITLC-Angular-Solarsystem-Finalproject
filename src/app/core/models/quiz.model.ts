/**
 * Projekt / Modul: SSI App – Solar System Info App / QuizQuestion & QuizCategory Models (quiz.model.ts)
 * FCPP-Referenz: P50-U10, P50-U20, P50-U30 (Weltraum-Quiz & Auswertung)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.1
 * Hinweis: TypeScript-Interfaces für 4 Quiz-Kategorien (inkl. Bahnen/Kometen/Rekorde), Fragen und kindgerechte Auswertung mit KI-Unterstützung erstellt.
 */

export type QuizCategoryId = 'daily' | 'missions' | 'celestial' | 'astronomy';

export interface QuizCategoryInfo {
  id: QuizCategoryId;
  label: string;
  icon: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  category: Exclude<QuizCategoryId, 'daily'>;
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  childExplanation: string;
  relatedBodyId?: string;
}
