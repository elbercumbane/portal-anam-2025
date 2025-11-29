import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PARTNERS, Partner } from './parceiros.data';

type Tab = 'Todos' | 'Governo' | 'Associação' | 'ONG' | 'Empresa' | 'Internacional';

@Component({
  selector: 'app-parceiros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './parceiros.component.html',
  styleUrl: './parceiros.component.scss'
})
export class ParceirosComponent {
  tabs: Tab[] = ['Todos', 'Governo', 'Associação', 'ONG', 'Empresa', 'Internacional'];
  activeTab = signal<Tab>('Todos');
  partners = signal<Partner[]>(PARTNERS);

  // Estatísticas
  stats = [
    { icon: '🤝', valor: '8+', label: 'Parceiros Ativos', cor: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)' },
    { icon: '🌍', valor: '5', label: 'Países Representados', cor: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' },
    { icon: '📅', valor: '6+', label: 'Anos de Parcerias', cor: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' },
    { icon: '🚀', valor: '20+', label: 'Projetos Conjuntos', cor: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)' },
  ];

  filtered = computed(() => {
    const t = this.activeTab();
    return t === 'Todos' ? this.partners() : this.partners().filter(p => p.categoria === t);
  });

  setTab(t: Tab) { 
    this.activeTab.set(t); 
  }

  getTabIcon(tab: string): string {
    const icons: { [key: string]: string } = {
      'Todos': '🌐',
      'Governo': '🏛️',
      'Associação': '🤝',
      'ONG': '💚',
      'Empresa': '🏢',
      'Internacional': '🌍'
    };
    return icons[tab] || '📋';
  }

  // Ajustar cor para criar gradiente (escurecer)
  adjustColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const factor = 0.7;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  }
}
