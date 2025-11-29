import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PARTNERS, Partner } from './parceiros.data';

type Tab = 'Todos' | 'Tecnologia' | 'Serviços' | 'Comércio' | 'Governo' | 'Associação';

@Component({
  selector: 'app-parceiros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parceiros.component.html',
  styleUrl: './parceiros.component.scss'
})
export class ParceirosComponent {
  tabs: Tab[] = ['Todos', 'Tecnologia', 'Serviços', 'Comércio', 'Governo', 'Associação'];
  activeTab = signal<Tab>('Todos');
  partners = signal<Partner[]>(PARTNERS);

  filtered = computed(() => {
    const t = this.activeTab();
    return t === 'Todos' ? this.partners() : this.partners().filter(p => p.categoria === t);
  });

  setTab(t: Tab) { this.activeTab.set(t); }

  // util p/ avatar background variar sutilmente
  bgFor(initials: string) {
    const hues = [220, 230, 210, 200, 240, 225];
    const h = hues[initials.charCodeAt(0) % hues.length];
    return `hsl(${h} 100% 95%)`;
  }
  fgFor() { return '#8A7D65'; } // castanho

  // método para lidar com erros de carregamento de imagem
  onImageError(event: any) {
    console.warn('Erro ao carregar logo:', event.target.src);
    // Pode adicionar lógica adicional aqui se necessário
  }
}
