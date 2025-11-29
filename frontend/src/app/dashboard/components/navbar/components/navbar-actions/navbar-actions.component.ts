import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar-actions',
  
  template: `
    <div class="navbar-actions">
      <!-- Additional actions can be added here -->
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./navbar-actions.component.scss']
})
export class NavbarActionsComponent {
  // Removed refresh functionality
}
