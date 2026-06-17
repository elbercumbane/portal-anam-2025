import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-search',
  template: `
    <div class="search-container">
      <mat-icon class="search-icon">search</mat-icon>
      <input
        type="text"
        placeholder="Pesquisar membros, eventos, relatórios..."
        class="search-input"
        (input)="onSearch($event)">
      <kbd class="search-shortcut" *ngIf="showShortcut">Ctrl+K</kbd>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      width: 100%;
      background: #ffffff;
      border: 1px solid rgba(5, 150, 105, 0.2);
      border-radius: 12px;
      padding: 0.55rem 0.875rem;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus-within {
        border-color: #059669;
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
      }

      .search-icon {
        color: #059669;
        margin-right: 0.5rem;
        font-size: 1.15rem;
        width: 1.15rem;
        height: 1.15rem;
        flex-shrink: 0;
      }

      .search-input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.875rem;
        color: #0f172a;
        width: 100%;
        min-width: 0;

        &::placeholder {
          color: #94a3b8;
        }
      }

      .search-shortcut {
        display: inline-flex;
        align-items: center;
        padding: 0.15rem 0.45rem;
        font-size: 0.65rem;
        font-family: inherit;
        color: #64748b;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        flex-shrink: 0;
        margin-left: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .search-container {
        padding: 0.45rem 0.75rem;

        .search-input {
          font-size: 0.8rem;
        }

        .search-shortcut {
          display: none;
        }
      }
    }
  `]
})
export class NavbarSearchComponent {
  @Output() search = new EventEmitter<string>();
  showShortcut = typeof window !== 'undefined' && window.innerWidth > 768;

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.search.emit(query);
  }
}
