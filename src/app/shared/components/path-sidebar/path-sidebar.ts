/**
 * Projekt / Modul: SSI App – Solar System Info App / PathSidebarComponent (path-sidebar.ts)
 * FCPP-Referenz: P10-U20 (A20, A50), P20-U10 (A10)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 16.11.2026 / v2.0
 * Hinweis: Rekursive Tree-Komponente ohne überflüssige Deko-Tags, mit 1px Rahmen und klaren 6px/8px Radien.
 */

import { Component, input, output, signal } from '@angular/core';
import { PathTreeNode } from '../../../core/services/solar-system-data.service';

@Component({
  selector: 'app-path-sidebar',
  imports: [PathSidebarComponent],
  template: `
    @if (isRoot()) {
      <nav class="path-tree-card" aria-label="Pfad-Navigation im Sonnensystem">
        <div class="tree-header">
          <h2>Entdecker-Pfad</h2>
        </div>

        <ul class="tree-list root-list">
          @for (node of nodes(); track node.id) {
            <li class="tree-item">
              <div class="tree-row">
                @if (node.children && node.children.length > 0) {
                  <button
                    type="button"
                    class="toggle-branch-btn"
                    (click)="toggleExpand(node.id)"
                    [attr.aria-expanded]="isExpanded(node.id)"
                    [attr.aria-label]="node.label + ' ein- oder ausklappen'"
                  >
                    {{ isExpanded(node.id) ? '▾' : '▸' }}
                  </button>
                } @else {
                  <span class="branch-spacer" aria-hidden="true">•</span>
                }

                <button
                  type="button"
                  class="node-select-btn"
                  [class.active-node]="node.bodyId && node.bodyId === activeBodyId()"
                  [class.group-node]="!node.bodyId"
                  (click)="onNodeActivate(node)"
                >
                  <span class="node-label">{{ node.label }}</span>
                </button>
              </div>

              @if (node.children && node.children.length > 0 && isExpanded(node.id)) {
                <app-path-sidebar
                  [nodes]="node.children"
                  [activeBodyId]="activeBodyId()"
                  [isRoot]="false"
                  (bodySelected)="bodySelected.emit($event)"
                />
              }
            </li>
          }
        </ul>
      </nav>
    } @else {
      <ul class="tree-list nested-list">
        @for (node of nodes(); track node.id) {
          <li class="tree-item">
            <div class="tree-row">
              @if (node.children && node.children.length > 0) {
                <button
                  type="button"
                  class="toggle-branch-btn"
                  (click)="toggleExpand(node.id)"
                  [attr.aria-expanded]="isExpanded(node.id)"
                  [attr.aria-label]="node.label + ' ein- oder ausklappen'"
                >
                  {{ isExpanded(node.id) ? '▾' : '▸' }}
                </button>
              } @else {
                <span class="branch-spacer" aria-hidden="true">└</span>
              }

              <button
                type="button"
                class="node-select-btn"
                [class.active-node]="node.bodyId && node.bodyId === activeBodyId()"
                [class.group-node]="!node.bodyId"
                (click)="onNodeActivate(node)"
              >
                <span class="node-label">{{ node.label }}</span>
              </button>
            </div>

            @if (node.children && node.children.length > 0 && isExpanded(node.id)) {
              <app-path-sidebar
                [nodes]="node.children"
                [activeBodyId]="activeBodyId()"
                [isRoot]="false"
                (bodySelected)="bodySelected.emit($event)"
              />
            }
          </li>
        }
      </ul>
    }
  `,
  styles: `
    .path-tree-card {
      background-color: var(--card-bg-elevated);
      color: var(--card-text-primary);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      box-shadow: var(--shadow-card);
    }
    .tree-header {
      margin-bottom: 0.6rem;
      padding-bottom: 0.45rem;
      border-bottom: 1px solid var(--card-border);
    }
    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }
    .tree-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nested-list {
      padding-left: 0.75rem;
      margin-left: 0.4rem;
      border-left: 1px solid #cbd5e1;
    }
    .tree-item {
      margin: 0.1rem 0;
    }
    .tree-row {
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }
    .toggle-branch-btn {
      width: 20px;
      height: 20px;
      padding: 0;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--card-text-secondary);
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
    }
    .toggle-branch-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
    }
    .branch-spacer {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      font-size: 0.75rem;
      color: var(--card-text-muted);
    }
    .node-select-btn {
      flex: 1;
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0.28rem 0.5rem;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      background-color: transparent;
      color: var(--card-text-primary);
      font-size: 0.86rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.12s ease, color 0.12s ease;
    }
    .node-select-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
    }
    .node-select-btn.group-node {
      font-weight: 700;
      color: var(--card-text-secondary);
    }
    .node-select-btn.active-node {
      background-color: var(--accent-primary);
      color: #ffffff;
      font-weight: 600;
    }
  `,
})
export class PathSidebarComponent {
  readonly nodes = input.required<PathTreeNode[]>();
  readonly activeBodyId = input<string | null>(null);
  readonly isRoot = input<boolean>(true);

  readonly bodySelected = output<string | null>();

  private readonly expandedIds = signal<Set<string>>(
    new Set([
      'solar-system-root',
      'planets-group',
      'earth',
      'mars',
      'jupiter',
      'saturn',
      'dwarf-planets-group',
      'pluto',
      'haumea',
      'makemake',
      'eris',
      'ceres',
      'probes-group',
    ]),
  );

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggleExpand(id: string): void {
    this.expandedIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onNodeActivate(node: PathTreeNode): void {
    if (node.bodyId) {
      if (node.children && node.children.length > 0 && !this.isExpanded(node.id)) {
        this.toggleExpand(node.id);
      }
      this.bodySelected.emit(node.bodyId);
      return;
    }
    if (node.id === 'solar-system-root') {
      this.bodySelected.emit(null);
      return;
    }
    this.toggleExpand(node.id);
  }
}
