/**
 * Projekt / Modul: SSI App – Solar System Info App / ExplorerProgressService (explorer-progress.service.ts)
 * FCPP-Referenz: P10-U20, P20-U10, P50-U20, P50-U30 (Lokaler Entdecker-Pass & Quiz-Bestwerte im localStorage)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v1.0
 * Hinweis: Offline-fähige localStorage-Persistenz für bereits entdeckte Himmelskörper und persönliche Quiz-Bestwerte pro Kategorie mit KI-Unterstützung erstellt.
 */

import { Injectable, computed, signal } from '@angular/core';
import { QuizCategoryId } from '../models/quiz.model';

export interface QuizBestScore {
  correct: number;
  total: number;
  ratio: number;
}

const DISCOVERED_STORAGE_KEY = 'ssi_app_discovered_bodies_v1';
const QUIZ_SCORES_STORAGE_KEY = 'ssi_app_quiz_best_scores_v1';
const VALID_QUIZ_CATEGORIES: readonly QuizCategoryId[] = [
  'daily',
  'missions',
  'celestial',
  'astronomy',
];

@Injectable({
  providedIn: 'root',
})
export class ExplorerProgressService {
  private readonly discoveredBodyIdsState = signal<string[]>(this.loadDiscoveredBodies());
  private readonly quizBestScoresState = signal<Partial<Record<QuizCategoryId, QuizBestScore>>>(
    this.loadQuizBestScores(),
  );

  readonly discoveredBodyIds = this.discoveredBodyIdsState.asReadonly();
  readonly discoveredBodyIdSet = computed<ReadonlySet<string>>(
    () => new Set(this.discoveredBodyIdsState()),
  );
  readonly discoveredCount = computed<number>(() => this.discoveredBodyIdsState().length);
  readonly quizBestScores = this.quizBestScoresState.asReadonly();

  /** Markiert einen Himmelskörper oder eine Mission im lokalen Entdecker-Pass als entdeckt */
  markBodyDiscovered(bodyId: string | null | undefined): void {
    const normalized = bodyId?.trim();
    if (!normalized || this.discoveredBodyIdSet().has(normalized)) {
      return;
    }
    const next = [...this.discoveredBodyIdsState(), normalized];
    this.discoveredBodyIdsState.set(next);
    this.saveToStorage(DISCOVERED_STORAGE_KEY, next);
  }

  isBodyDiscovered(bodyId: string | null | undefined): boolean {
    const normalized = bodyId?.trim();
    return Boolean(normalized && this.discoveredBodyIdSet().has(normalized));
  }

  /**
   * Speichert das Ergebnis einer Quiz-Runde, sofern noch kein Wert vorliegt oder der bisherige Rekord übertroffen wurde.
   * Gibt true zurück, wenn ein neuer persönlicher Bestwert mit mindestens 1 richtigen Antwort erreicht wurde.
   */
  recordQuizScore(category: QuizCategoryId, correct: number, total: number): boolean {
    const safeTotal = Math.max(1, total);
    const safeCorrect = Math.max(0, Math.min(correct, safeTotal));
    const ratio = safeCorrect / safeTotal;
    const prev = this.quizBestScoresState()[category];

    const shouldUpdate =
      !prev || ratio > prev.ratio || (ratio === prev.ratio && safeCorrect > prev.correct);

    if (!shouldUpdate) {
      return false;
    }

    const nextScores: Partial<Record<QuizCategoryId, QuizBestScore>> = {
      ...this.quizBestScoresState(),
      [category]: {
        correct: safeCorrect,
        total: safeTotal,
        ratio,
      },
    };
    this.quizBestScoresState.set(nextScores);
    this.saveToStorage(QUIZ_SCORES_STORAGE_KEY, nextScores);
    return safeCorrect > 0;
  }

  getBestScore(category: QuizCategoryId): QuizBestScore | null {
    return this.quizBestScoresState()[category] ?? null;
  }

  /** Setzt Entdecker-Pass und Quiz-Bestwerte zurück (z. B. für Tests oder Neustart) */
  resetProgress(): void {
    this.discoveredBodyIdsState.set([]);
    this.quizBestScoresState.set({});
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(DISCOVERED_STORAGE_KEY);
        localStorage.removeItem(QUIZ_SCORES_STORAGE_KEY);
      }
    } catch {
      // Speicherzugriff im eingeschränkten Browser-Kontext still ignorieren
    }
  }

  private loadDiscoveredBodies(): string[] {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }
      const raw = localStorage.getItem(DISCOVERED_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      const seen = new Set<string>();
      const valid: string[] = [];
      for (const item of parsed) {
        if (typeof item === 'string') {
          const trimmed = item.trim();
          if (trimmed && !seen.has(trimmed)) {
            seen.add(trimmed);
            valid.push(trimmed);
          }
        }
      }
      return valid;
    } catch {
      return [];
    }
  }

  private loadQuizBestScores(): Partial<Record<QuizCategoryId, QuizBestScore>> {
    try {
      if (typeof localStorage === 'undefined') {
        return {};
      }
      const raw = localStorage.getItem(QUIZ_SCORES_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {};
      }
      const record = parsed as Record<string, unknown>;
      const result: Partial<Record<QuizCategoryId, QuizBestScore>> = {};
      for (const cat of VALID_QUIZ_CATEGORIES) {
        const entry = record[cat];
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          const candidate = entry as Record<string, unknown>;
          const correct = candidate['correct'];
          const total = candidate['total'];
          if (
            typeof correct === 'number' &&
            Number.isFinite(correct) &&
            correct >= 0 &&
            typeof total === 'number' &&
            Number.isFinite(total) &&
            total > 0
          ) {
            const safeTotal = Math.max(1, total);
            const safeCorrect = Math.max(0, Math.min(correct, safeTotal));
            result[cat] = {
              correct: safeCorrect,
              total: safeTotal,
              ratio: safeCorrect / safeTotal,
            };
          }
        }
      }
      return result;
    } catch {
      return {};
    }
  }

  private saveToStorage(key: string, value: unknown): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Speicherzugriff im privaten Modus oder bei vollem Quota still ignorieren
    }
  }
}
