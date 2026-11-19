/**
 * Projekt / Modul: SSI App – Solar System Info App / ImageLightboxComponent (image-lightbox.ts)
 * FCPP-Referenz: P20-U20, P40-U20 (Originalgroße Bildansicht mit Galerie-Navigation & Zoom für Grundschulkinder)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 19.11.2026 / v1.1
 * Hinweis: Modale Lightbox ohne reines Schwarz (#000000) mit stufenlosem Bild-Zoom, Vor/Zurück-Galerie-Navigation, Thumbnail-Leiste und Tastatursteuerung.
 */

import { Component, HostListener, computed, effect, input, output, signal } from '@angular/core';
import type { GalleryMediaItem } from '../../../core/data/media-gallery.data';

@Component({
  selector: 'app-image-lightbox',
  template: `
    @if (isOpen()) {
      <div
        class="lightbox-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="'Großansicht: ' + activeCaption()"
        (click)="onBackdropClick($event)"
      >
        <div class="lightbox-dialog">
          <div class="lightbox-header">
            <div class="lightbox-title-group">
              <div class="lightbox-title-row">
                <h3>{{ activeCaption() }}</h3>
                @if (galleryItems().length > 1) {
                  <span class="lb-counter-badge">
                    Bild {{ currentIndex() + 1 }} von {{ galleryItems().length }}
                  </span>
                }
              </div>
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
            @if (galleryItems().length > 1) {
              <button
                type="button"
                class="lb-nav-arrow lb-nav-prev"
                (click)="prevImage()"
                aria-label="Vorheriges Bild"
                title="Vorheriges Bild (Pfeiltaste links)"
              >
                <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </button>
            }

            <img
              [src]="activeSrc()"
              [alt]="activeCaption()"
              [style.transform]="'scale(' + zoomScale() + ')'"
              (error)="onImgError()"
            />

            @if (galleryItems().length > 1) {
              <button
                type="button"
                class="lb-nav-arrow lb-nav-next"
                (click)="nextImage()"
                aria-label="Nächstes Bild"
                title="Nächstes Bild (Pfeiltaste rechts)"
              >
                <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </button>
            }
          </div>

          @if (galleryItems().length > 1) {
            <div class="lightbox-thumbs-bar" role="group" aria-label="Bilder der Galerie durchblättern">
              @for (item of galleryItems(); track item.url; let idx = $index) {
                <button
                  type="button"
                  class="lb-thumb-btn"
                  [class.active-lb-thumb]="currentIndex() === idx"
                  (click)="selectGalleryItem(item.url)"
                  [title]="item.caption"
                  [attr.aria-label]="'Bild ' + (idx + 1) + ': ' + item.caption"
                >
                  <img [src]="item.url" [alt]="item.caption" (error)="onThumbError($event)" />
                </button>
              }
            </div>
          }
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
      padding: 1rem;
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
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--card-border);
      background-color: var(--card-bg);
    }
    .lightbox-title-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .lightbox-title-group h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
    }
    .lb-counter-badge {
      padding: 0.14rem 0.5rem;
      border-radius: var(--radius-sm);
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
      border: 1px solid #93c5fd;
      font-size: 0.76rem;
      font-weight: 700;
    }
    .lightbox-credit {
      display: block;
      margin-top: 0.15rem;
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
      position: relative;
      flex: 1;
      min-height: 260px;
      max-height: 62vh;
      overflow: auto;
      background-color: #111d3b;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 3.75rem;
    }
    .lightbox-viewport img {
      max-width: 100%;
      max-height: 58vh;
      object-fit: contain;
      transform-origin: center center;
      transition: transform 0.14s ease-out;
      border-radius: var(--radius-sm);
    }
    .lb-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 4;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.65);
      background-color: rgba(11, 19, 43, 0.82);
      color: #f8fafc;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(11, 19, 43, 0.4);
    }
    .lb-nav-arrow:hover {
      background-color: #2563eb;
      border-color: #bfdbfe;
      color: #ffffff;
    }
    .lb-nav-prev {
      left: 0.75rem;
    }
    .lb-nav-next {
      right: 0.75rem;
    }
    .lightbox-thumbs-bar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.45rem;
      padding: 0.55rem 0.9rem;
      border-top: 1px solid var(--card-border);
      background-color: var(--card-bg);
    }
    .lb-thumb-btn {
      padding: 0;
      width: 56px;
      height: 42px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background-color: #111d3b;
      overflow: hidden;
      cursor: pointer;
    }
    .lb-thumb-btn.active-lb-thumb {
      border: 2px solid #2563eb;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.45);
    }
    .lb-thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  `,
})
export class ImageLightboxComponent {
  readonly isOpen = input<boolean>(false);
  readonly imageSrc = input<string>('');
  readonly fallbackSrc = input<string>('');
  readonly title = input<string>('');
  readonly credit = input<string>('');
  readonly galleryItems = input<ReadonlyArray<GalleryMediaItem>>([]);

  readonly closed = output<void>();
  readonly imageSelected = output<string>();

  readonly zoomScale = signal<number>(1);
  readonly activeSrc = signal<string>('');

  readonly currentIndex = computed<number>(() => {
    const items = this.galleryItems();
    const current = this.activeSrc() || this.imageSrc();
    const idx = items.findIndex((it) => it.url === current);
    return idx >= 0 ? idx : 0;
  });

  readonly activeCaption = computed<string>(() => {
    const items = this.galleryItems();
    if (items.length > 0) {
      return items[this.currentIndex()]?.caption || this.title();
    }
    return this.title();
  });

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

  prevImage(): void {
    const items = this.galleryItems();
    if (items.length <= 1) {
      return;
    }
    const nextIdx = (this.currentIndex() - 1 + items.length) % items.length;
    this.selectGalleryItem(items[nextIdx].url);
  }

  nextImage(): void {
    const items = this.galleryItems();
    if (items.length <= 1) {
      return;
    }
    const nextIdx = (this.currentIndex() + 1) % items.length;
    this.selectGalleryItem(items[nextIdx].url);
  }

  selectGalleryItem(url: string): void {
    this.activeSrc.set(url);
    this.zoomScale.set(1);
    this.imageSelected.emit(url);
  }

  onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    const btn = img?.closest('button') as HTMLElement | null;
    if (btn) {
      btn.style.display = 'none';
    }
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen() || this.galleryItems().length <= 1) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextImage();
    }
  }
}
