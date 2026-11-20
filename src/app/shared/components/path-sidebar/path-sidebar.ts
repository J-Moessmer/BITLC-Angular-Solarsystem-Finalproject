/**
 * Projekt / Modul: SSI App – Solar System Info App / PathSidebarComponent (path-sidebar.ts)
 * FCPP-Referenz: P10-U20 (A20, A50), P20-U10 (A10)
 * Erstellt mit: KI-Assistent (Antigravity AI / Pair-Programming Agent)
 * Erstellt für / Autor: Joshua Mößmer (J-Moessmer)
 * Datum / Version: 20.11.2026 / v2.2
 * Hinweis: Rekursive Tree-Komponente mit Schnellsuche über alle 117 Einträge, Entdecker-Pass-Fortschritt, Font Awesome 7.3 Vektor-Icons, 1px Rahmen und klaren 6px/8px Radien.
 */

import { Component, computed, input, output, signal } from '@angular/core';
import { PathTreeNode } from '../../../core/services/solar-system-data.service';

/** KI-generierter Block: Filtert den Pfad-Baum rekursiv nach Suchbegriff und erhält alle passenden Äste samt Eltern-Pfaden */
function filterTreeNodes(nodes: PathTreeNode[], queryLower: string): PathTreeNode[] {
  const result: PathTreeNode[] = [];
  for (const node of nodes) {
    const labelMatch = node.label.toLowerCase().includes(queryLower);
    const idMatch = node.bodyId?.toLowerCase().includes(queryLower) ?? false;
    const directMatch = labelMatch || idMatch;
    const filteredChildren = node.children ? filterTreeNodes(node.children, queryLower) : [];

    if (directMatch) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    } else if (filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren,
      });
    }
  }
  return result;
}

/** Zählt eindeutige auswählbare Himmelskörper (bodyId) in den gefilterten Knoten */
function collectUniqueBodyIds(nodes: PathTreeNode[], collector: Set<string>): void {
  for (const node of nodes) {
    if (node.bodyId) {
      collector.add(node.bodyId);
    }
    if (node.children) {
      collectUniqueBodyIds(node.children, collector);
    }
  }
}

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

        @if (totalBodiesCount() > 0) {
          <div class="explorer-pass-mini" aria-label="Entdecker-Pass Fortschritt">
            <div class="explorer-mini-top">
              <span class="explorer-mini-title">
                <i class="fa-solid fa-passport" aria-hidden="true"></i>
                Entdecker-Pass:
              </span>
              <strong>{{ discoveredCount() }} / {{ totalBodiesCount() }} entdeckt</strong>
            </div>
            <div
              class="explorer-mini-bar"
              role="progressbar"
              [attr.aria-valuenow]="discoveredCount()"
              aria-valuemin="0"
              [attr.aria-valuemax]="totalBodiesCount()"
            >
              <div class="explorer-mini-fill" [style.width.%]="discoveredPercent()"></div>
            </div>
          </div>
        }

        <div class="tree-search-box">
          <i class="fa-solid fa-magnifying-glass tree-search-icon" aria-hidden="true"></i>
          <input
            type="search"
            class="tree-search-input"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            placeholder="Planet, Mond, Komet oder Sonde suchen…"
            aria-label="Planet, Mond, Komet oder Sonde im Entdecker-Pfad suchen"
          />
          @if (searchQuery().length > 0) {
            <button
              type="button"
              class="tree-search-clear-btn"
              (click)="clearSearch()"
              aria-label="Suche im Entdecker-Pfad zurücksetzen"
              title="Suche zurücksetzen"
            >
              ×
            </button>
          }
        </div>

        @if (isSearchActive()) {
          <div class="tree-search-status" aria-live="polite">
            <span>{{ searchMatchCount() }} Treffer</span>
          </div>
        }

        @if (isSearchActive() && displayedNodes().length === 0) {
          <p class="tree-empty-hint" role="status">
            Kein Objekt für „{{ searchQuery().trim() }}“ gefunden.
          </p>
        } @else {
          <ul class="tree-list root-list">
            @for (node of displayedNodes(); track node.id) {
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
                    @if (node.bodyId && discoveredBodyIds().has(node.bodyId)) {
                      <i
                        class="fa-solid fa-circle-check discovered-check-icon"
                        title="Bereits entdeckt"
                        aria-hidden="true"
                      ></i>
                    }
                  </button>
                </div>

                @if (node.children && node.children.length > 0 && isExpanded(node.id)) {
                  <app-path-sidebar
                    [nodes]="node.children"
                    [activeBodyId]="activeBodyId()"
                    [discoveredBodyIds]="discoveredBodyIds()"
                    [forceExpandAll]="effectiveForceExpand()"
                    [isRoot]="false"
                    (bodySelected)="bodySelected.emit($event)"
                  />
                }
              </li>
            }
          </ul>
        }
      </nav>
    } @else {
      <ul class="tree-list nested-list">
        @for (node of displayedNodes(); track node.id) {
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
                @if (node.bodyId && discoveredBodyIds().has(node.bodyId)) {
                  <i
                    class="fa-solid fa-circle-check discovered-check-icon"
                    title="Bereits entdeckt"
                    aria-hidden="true"
                  ></i>
                }
              </button>
            </div>

            @if (node.children && node.children.length > 0 && isExpanded(node.id)) {
              <app-path-sidebar
                [nodes]="node.children"
                [activeBodyId]="activeBodyId()"
                [discoveredBodyIds]="discoveredBodyIds()"
                [forceExpandAll]="effectiveForceExpand()"
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
      margin-bottom: 0.55rem;
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
    .explorer-pass-mini {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      padding: 0.45rem 0.55rem;
      margin-bottom: 0.55rem;
      display: flex;
      flex-direction: column;
      gap: 0.32rem;
    }
    .explorer-mini-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.76rem;
      color: var(--card-text-secondary);
    }
    .explorer-mini-title {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 600;
    }
    .explorer-mini-title i {
      color: var(--accent-primary);
    }
    .explorer-mini-top strong {
      color: var(--card-text-primary);
      font-weight: 700;
    }
    .explorer-mini-bar {
      height: 6px;
      border-radius: 999px;
      background-color: var(--card-bg-subtle);
      overflow: hidden;
      border: 1px solid var(--card-border);
    }
    .explorer-mini-fill {
      height: 100%;
      background-color: var(--accent-primary);
      transition: width 0.2s ease;
    }
    .tree-search-box {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .tree-search-icon {
      position: absolute;
      left: 0.55rem;
      color: var(--card-text-muted);
      font-size: 0.78rem;
      pointer-events: none;
    }
    .tree-search-input {
      width: 100%;
      padding: 0.38rem 1.75rem 0.38rem 1.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background-color: var(--card-bg);
      color: var(--card-text-primary);
      font-size: 0.82rem;
      font-family: inherit;
    }
    .tree-search-input:focus {
      outline: 2px solid var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .tree-search-clear-btn {
      position: absolute;
      right: 0.3rem;
      width: 22px;
      height: 22px;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--card-text-secondary);
      font-size: 1rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .tree-search-clear-btn:hover {
      background-color: var(--card-bg-subtle);
      color: var(--accent-primary);
    }
    .tree-search-status {
      font-size: 0.74rem;
      font-weight: 700;
      color: var(--accent-primary);
      margin: 0 0 0.35rem 0.15rem;
    }
    .tree-empty-hint {
      margin: 0.35rem 0;
      padding: 0.55rem 0.65rem;
      border-radius: var(--radius-sm);
      border: 1px dashed var(--card-border);
      background-color: var(--card-bg);
      color: var(--card-text-secondary);
      font-size: 0.82rem;
      text-align: center;
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
    .node-label {
      flex: 1;
    }
    .node-fa-icon {
      width: 14px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--card-text-muted);
    }
    .discovered-check-icon {
      margin-left: auto;
      font-size: 0.72rem;
      color: #16a34a;
      flex-shrink: 0;
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
    .node-select-btn.active-node .node-fa-icon,
    .node-select-btn.active-node .discovered-check-icon {
      color: #ffffff;
    }
  `,
})
export class PathSidebarComponent {
  readonly nodes = input.required<PathTreeNode[]>();
  readonly activeBodyId = input<string | null>(null);
  readonly isRoot = input<boolean>(true);
  readonly discoveredBodyIds = input<ReadonlySet<string>>(new Set());
  readonly discoveredCount = input<number>(0);
  readonly totalBodiesCount = input<number>(0);
  readonly forceExpandAll = input<boolean>(false);

  readonly bodySelected = output<string | null>();

  readonly searchQuery = signal<string>('');

  readonly isSearchActive = computed<boolean>(
    () => this.isRoot() && this.searchQuery().trim().length > 0,
  );

  readonly effectiveForceExpand = computed<boolean>(
    () => this.forceExpandAll() || this.isSearchActive(),
  );

  readonly displayedNodes = computed<PathTreeNode[]>(() => {
    const raw = this.nodes();
    if (!this.isSearchActive()) {
      return raw;
    }
    return filterTreeNodes(raw, this.searchQuery().trim().toLowerCase());
  });

  readonly searchMatchCount = computed<number>(() => {
    if (!this.isSearchActive()) {
      return 0;
    }
    const collector = new Set<string>();
    collectUniqueBodyIds(this.displayedNodes(), collector);
    return collector.size;
  });

  readonly discoveredPercent = computed<number>(() => {
    const total = this.totalBodiesCount();
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.discoveredCount() / total) * 100));
  });

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
    return this.effectiveForceExpand() || this.expandedIds().has(id);
  }

  onSearchInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement | null;
    this.searchQuery.set(inputEl?.value ?? '');
  }

  clearSearch(): void {
    this.searchQuery.set('');
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
