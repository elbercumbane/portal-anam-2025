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
        placeholder="Pesquisar..." 
        class="search-input">
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 25px;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      transition: all 0.3s ease;
      min-width: 250px;
      
      &:focus-within {
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
        transform: translateY(-1px);
      }
      
      .search-icon {
        color: #666;
        margin-right: 0.5rem;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        
        &:hover {
          color: #333;
          transform: scale(1.1);
        }
      }
      
      .search-input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.9rem;
        color: #2c3e50;
        width: 100%;
        
        &::placeholder {
          color: #999;
        }
      }
    }
    
    @media (max-width: 1024px) {
      .search-container {
        min-width: 200px;
        margin-right: 0.75rem;
        
        .search-input {
          font-size: 0.85rem;
        }
      }
    }
    
    @media (max-width: 768px) {
      .search-container {
        min-width: 150px;
        margin-right: 0.5rem;
        padding: 0.4rem 0.75rem;
        
        .search-input {
          font-size: 0.8rem;
        }
        
        .search-icon {
          font-size: 1.1rem;
        }
      }
    }
    
    @media (max-width: 600px) {
      .search-container {
        min-width: 120px;
        margin-right: 0.25rem;
        padding: 0.3rem 0.5rem;
        
        .search-input {
          font-size: 0.75rem;
        }
        
        .search-icon {
          font-size: 1rem;
          margin-right: 0.25rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .search-container {
        display: none;
      }
    }
  `]
})
export class NavbarSearchComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: any): void {
    const query = event.target.value;
    this.search.emit(query);
  }
}
