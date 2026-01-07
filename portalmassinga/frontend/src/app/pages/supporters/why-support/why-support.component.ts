import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-why-support',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './why-support.component.html',
  styleUrl: './why-support.component.scss'
})
export class WhySupportComponent {
  supportWays = [
    {
      iconType: 'volunteer',
      title: 'Voluntariado',
      description: 'Dedica o teu tempo e conhecimento para apoiar os nossos projectos e actividades comunitárias.'
    },
    {
      iconType: 'knowledge',
      title: 'Partilha de Conhecimento',
      description: 'Compartilha as tuas competências profissionais através de formações, mentorias ou workshops.'
    },
    {
      iconType: 'resources',
      title: 'Recursos e Materiais',
      description: 'Contribui com materiais, equipamentos ou recursos que possam fortalecer os nossos projectos.'
    },
    {
      iconType: 'share',
      title: 'Divulgação',
      description: 'Ajuda-nos a chegar a mais pessoas partilhando a nossa missão e os nossos projectos.'
    },
    {
      iconType: 'financial',
      title: 'Apoio Financeiro',
      description: 'Contribui financeiramente para o desenvolvimento dos nossos projectos e programas.'
    },
    {
      iconType: 'partnership',
      title: 'Parcerias',
      description: 'Estabelece parcerias estratégicas que possam amplificar o impacto da nossa acção.'
    }
  ];

  supportLevels = [
    {
      name: 'Platina',
      levelClass: 'platinum',
      color: '#E5E4E2',
      gradient: 'linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)',
      description: 'Apoio excepcional e compromisso de longo prazo',
      benefits: [
        'Reconhecimento público em todos os eventos',
        'Acesso exclusivo a relatórios detalhados',
        'Participação em eventos VIP',
        'Mentoria personalizada dos projectos'
      ]
    },
    {
      name: 'Gold',
      levelClass: 'gold',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      description: 'Apoio significativo e impacto duradouro',
      benefits: [
        'Reconhecimento em eventos principais',
        'Acesso a relatórios trimestrais',
        'Participação em workshops exclusivos',
        'Certificado de reconhecimento'
      ]
    },
    {
      name: 'Diamante',
      levelClass: 'diamond',
      color: '#B9F2FF',
      gradient: 'linear-gradient(135deg, #B9F2FF 0%, #87CEEB 50%, #E0F6FF 100%)',
      description: 'Apoio máximo e transformação profunda',
      benefits: [
        'Reconhecimento permanente no site e eventos',
        'Relatórios mensais personalizados',
        'Acesso a todos os eventos e formações',
        'Homenagem especial anual',
        'Parceria estratégica com a ANAM'
      ]
    }
  ];

  getMedalIcon(levelClass: string): SafeHtml {
    const uniqueId = `medal-${levelClass}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const icons: { [key: string]: string } = {
      'platinum': `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="platinumGrad${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E5E4E2" stop-opacity="1" />
            <stop offset="100%" stop-color="#C0C0C0" stop-opacity="1" />
          </linearGradient>
        </defs>
        <path d="M20 10 L50 5 L80 10 L80 25 L50 20 L20 25 Z" fill="#E5E4E2" stroke="#C0C0C0" stroke-width="1"/>
        <circle cx="50" cy="60" r="35" fill="url(#platinumGrad${uniqueId})" stroke="#C0C0C0" stroke-width="2"/>
        <circle cx="50" cy="60" r="28" fill="none" stroke="#C0C0C0" stroke-width="1.5"/>
        <path d="M50 40 L52 48 L60 48 L53 53 L55 61 L50 56 L45 61 L47 53 L40 48 L48 48 Z" fill="#C0C0C0"/>
        <text x="50" y="75" font-family="serif" font-size="24" font-weight="bold" fill="#8B8B8B" text-anchor="middle">P</text>
        <path d="M20 95 L50 100 L80 95 L80 110 L50 115 L20 110 Z" fill="#E5E4E2" stroke="#C0C0C0" stroke-width="1"/>
      </svg>`,
      'gold': `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFD700" stop-opacity="1" />
            <stop offset="100%" stop-color="#FFA500" stop-opacity="1" />
          </linearGradient>
        </defs>
        <path d="M20 10 L50 5 L80 10 L80 25 L50 20 L20 25 Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
        <circle cx="50" cy="60" r="35" fill="url(#goldGrad${uniqueId})" stroke="#FFA500" stroke-width="2"/>
        <circle cx="50" cy="60" r="28" fill="none" stroke="#FFA500" stroke-width="1.5"/>
        <path d="M50 40 L52 48 L60 48 L53 53 L55 61 L50 56 L45 61 L47 53 L40 48 L48 48 Z" fill="#FFA500"/>
        <text x="50" y="75" font-family="serif" font-size="24" font-weight="bold" fill="#B8860B" text-anchor="middle">G</text>
        <path d="M20 95 L50 100 L80 95 L80 110 L50 115 L20 110 Z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
      </svg>`,
      'diamond': `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="diamondGrad${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#B9F2FF" stop-opacity="1" />
            <stop offset="50%" stop-color="#87CEEB" stop-opacity="1" />
            <stop offset="100%" stop-color="#E0F6FF" stop-opacity="1" />
          </linearGradient>
        </defs>
        <path d="M20 10 L50 5 L80 10 L80 25 L50 20 L20 25 Z" fill="#B9F2FF" stroke="#87CEEB" stroke-width="1"/>
        <circle cx="50" cy="60" r="35" fill="url(#diamondGrad${uniqueId})" stroke="#87CEEB" stroke-width="2"/>
        <circle cx="50" cy="60" r="28" fill="none" stroke="#87CEEB" stroke-width="1.5"/>
        <path d="M50 35 L60 50 L50 65 L40 50 Z" fill="#87CEEB"/>
        <path d="M50 35 L45 45 L50 50 L55 45 Z" fill="#E0F6FF"/>
        <path d="M50 50 L45 55 L50 65 L55 55 Z" fill="#B9F2FF"/>
        <text x="50" y="80" font-family="serif" font-size="20" font-weight="bold" fill="#4682B4" text-anchor="middle">D</text>
        <path d="M20 95 L50 100 L80 95 L80 110 L50 115 L20 110 Z" fill="#B9F2FF" stroke="#87CEEB" stroke-width="1"/>
      </svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[levelClass] || '');
  }

  getIconSvg(iconType: string, color?: string): SafeHtml {
    const iconColor = color || 'currentColor';
    const icons: { [key: string]: string } = {
      'search': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>`,
      'heart': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`,
      'handshake': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"></path>
        <path d="M7 18h1a2 2 0 0 0 0-4H5c-.6 0-1.1.2-1.4.6L1 18"></path>
        <path d="M22 12h-2a2 2 0 1 1 0-4h3c.6 0 1.1.2 1.4.6L21 14"></path>
        <path d="M17 18h-1a2 2 0 0 1 0-4h3c.6 0 1.1.2 1.4.6L23 18"></path>
      </svg>`,
      'volunteer': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      'knowledge': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`,
      'resources': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>`,
      'share': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>`,
      'financial': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`,
      'partnership': `<svg viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[iconType] || '');
  }

  getIconColor(index: number): string {
    const colors = ['#4CAF50', '#0B2F41', '#FFD700', '#4CAF50', '#EF4444', '#0B2F41'];
    return colors[index % colors.length];
  }

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  scrollToSupport(): void {
    this.router.navigate(['/apoio/torne-se-apoiante']);
  }
}

