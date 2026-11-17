/**
 * Projekt / Modul: SSI App – Solar System Info App / PathSidebarComponent (path-sidebar.ts)
 * FCPP-Referenz: P10-U20 (A20, A50), P20-U10 (A10)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 17.11.2026 / v2.1
 * Hinweis: Rekursive Tree-Komponente mit Font Awesome 7.3 Vektor-Icons, 1px Rahmen und klaren 6px/8px Radien.
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
          <i class="fa-solid fa-sitemap tree-header-icon" aria-hidden="true"></i>
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
                    <i
                      class="fa-solid"
                      [class.fa-chevron-down]="isExpanded(node.id)"
                      [class.fa-chevron-right]="!isExpanded(node.id)"
                      aria-hidden="true"
                    ></i>
                  </button>
                } @else {
                  <span class="branch-spacer" aria-hidden="true"></span>
                }

                <button
                  type="button"
                  class="node-select-btn"
                  [class.active-node]="node.bodyId && node.bodyId === activeBodyId()"
                  [class.group-node]="!node.bodyId"
                  (click)="onNodeActivate(node)"
                >
                  <i [class]="node.icon + ' node-fa-icon'" aria-hidden="true"></i>
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
                  <i
                    class="fa-solid"
                    [class.fa-chevron-down]="isExpanded(node.id)"
                    [class.fa-chevron-right]="!isExpanded(node.id)"
                    aria-hidden="true"
                  ></i>
                </button>
              } @else {
                <span class="branch-spacer" aria-hidden="true"></span>
              }

              <button
                type="button"
                class="node-select-btn"
                [class.active-node]="node.bodyId && node.bodyId === activeBodyId()"
                [class.group-node]="!node.bodyId"
                (click)="onNodeActivate(node)"
              >
                <i [class]="node.icon + ' node-fa-icon'" aria-hidden="true"></i>
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
      position: sticky;
      top: 4.5rem;
      max-height: calc(100vh - 5.5rem);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }
    @media (max-width: 960px) {
      .path-tree-card {
        position: static;
        max-height: none;
        overflow-y: visible;
      }
    }
    .tree-header {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.6rem;
      padding-bottom: 0.45rem;
      border-bottom: 1px solid var(--card-border);
    }
    .tree-header-icon {
      color: var(--accent-primary);
      font-size: 0.9rem;
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
      font-size: 0.68rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-branch-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
    }
    .branch-spacer {
      display: inline-block;
      width: 20px;
    }
    .node-select-btn {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.45rem;
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
    .node-fa-icon {
      width: 14px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--card-text-muted);
    }
    .node-select-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
    }
    .node-select-btn:hover .node-fa-icon {
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
    .node-select-btn.active-node .node-fa-icon {
      color: #ffffff;
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
