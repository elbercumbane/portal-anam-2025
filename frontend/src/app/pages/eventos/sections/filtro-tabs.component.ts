import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtro-tabs',
  standalone: false,
  templateUrl: './filtro-tabs.component.html',
  styleUrl: './filtro-tabs.component.scss'
})
export class FiltroTabsComponent {
  @Input() tabs: string[] = [];
  @Output() change = new EventEmitter<string>();
  
  activeTab: string = '';
  
  ngOnInit() {
    if (this.tabs.length > 0) {
      this.activeTab = this.tabs[0];
    }
  }
  
  selectTab(tab: string) {
    this.activeTab = tab;
    this.change.emit(tab);
  }
}
