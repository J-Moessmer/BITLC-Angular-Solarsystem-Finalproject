/**
 * Projekt / Modul: SSI App – Solar System Info App / ImageLightboxComponent (image-lightbox.ts)
 * FCPP-Referenz: P20-U20, P40-U20 (Originalgroße Bildansicht mit Zoom für Grundschulkinder)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v1.0
 * Hinweis: Modale Lightbox ohne reines Schwarz (#000000) mit stufenlosem Bild-Zoom und ESC-Steuerung.
 */

import { Component, HostListener, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-lightbox',
  template: `
    @if (isOpen()) {
      <div
        class="lightbox-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="'Großansicht: ' + title()"
        (click)="onBackdropClick($event)"
      >
        <div class="lightbox-dialog">
          <div class="lightbox-header">
            <div class="lightbox-title-group">
              <h3>{{ title() }}</h3>
              @if (credit()) {
                <span class="lightbox-credit">{{ credit() }}</span>
              }
            </div>

            <div class="lightbox-controls">
              <button
                type="button"
                class="lb-btn"
                (click)="zoomOut()"
                aria-label="Bild verkleinern"
              >
                <i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i>
              </button>
              <span class="lb-zoom-label">{{ zoomPercent() }}%</span>
              <button
                type="button"
                class="lb-btn"
                (click)="zoomIn()"
                aria-label="Bild vergrößern"
              >
                <i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                class="lb-btn"
                (click)="resetZoom()"
                aria-label="Zoom zurücksetzen"
              >
                100%
              </button>
              <button
                type="button"
                class="lb-close-btn"
                (click)="closed.emit()"
                aria-label="Großansicht schließen"
              >
                <i class="fa-solid fa-xmark" aria-hidden="true"></i> Schließen
              </button>
            </div>
          </div>

          <div class="lightbox-viewport" (wheel)="onWheel($event)">
            <img
              [src]="activeSrc()"
              [alt]="title()"
              [style.transform]="'scale(' + zoomScale() + ')'"
              (error)="onImgError()"
            />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 999;
      background-color: rgba(11, 19, 43, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }
    .lightbox-dialog {
      width: min(1040px, 96vw);
      max-height: 92vh;
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(11, 19, 43, 0.45);
    }
    .lightbox-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--card-border);
      background-color: var(--card-bg);
    }
    .lightbox-title-group h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
    }
    .lightbox-credit {
      font-size: 0.75rem;
      color: var(--card-text-muted);
    }
    .lightbox-controls {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .lb-btn,
    .lb-close-btn {
      padding: 0.32rem 0.65rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .lb-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      border-color: #93c5fd;
    }
    .lb-close-btn:hover {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }
    .lb-zoom-label {
      min-width: 44px;
      text-align: center;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-primary);
    }
    .lightbox-viewport {
      flex: 1;
      min-height: 360px;
      max-height: 76vh;
      overflow: auto;
      background-color: #111d3b;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .lightbox-viewport img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      transform-origin: center center;
      transition: transform 0.14s ease-out;
      border-radius: var(--radius-sm);
    }
  `,
})
export class ImageLightboxComponent {
  readonly isOpen = input<boolean>(false);
  readonly imageSrc = input<string>('');
  readonly fallbackSrc = input<string>('');
  readonly title = input<string>('');
  readonly credit = input<string>('');

  readonly closed = output<void>();

  readonly zoomScale = signal<number>(1);
  readonly activeSrc = signal<string>('');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.activeSrc.set(this.imageSrc() || this.fallbackSrc());
        this.zoomScale.set(1);
      }
    });
  }

  zoomPercent(): number {
    return Math.round(this.zoomScale() * 100);
  }

  zoomIn(): void {
    this.zoomScale.update((z) => Math.min(3.5, Number((z + 0.25).toFixed(2))));
  }

  zoomOut(): void {
    this.zoomScale.update((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))));
  }

  resetZoom(): void {
    this.zoomScale.set(1);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  onImgError(): void {
    const fb = this.fallbackSrc();
    if (fb && this.activeSrc() !== fb) {
      this.activeSrc.set(fb);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }
}
