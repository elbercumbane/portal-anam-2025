import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();


  // Informações de contacto
  contactInfo = {
    address: 'Av. Principal, Massinga, Inhambane, Moçambique',
    phone: '+258 84 000 0000',
    email: 'geral@anam.org',
    hours: 'Segunda - Sexta: 08:00 - 17:00'
  };

  // Redes sociais
  socialLinks = [
    { 
      name: 'Facebook', 
      iconClass: 'fab fa-facebook-f', 
      url: 'https://facebook.com/anam.massinga',
      color: '#1877F2'
    },
    { 
      name: 'Instagram', 
      iconClass: 'fab fa-instagram', 
      url: 'https://instagram.com/anam.massinga',
      color: '#E4405F'
    },
    { 
      name: 'X (Twitter)', 
      iconClass: 'fas fa-times', 
      url: 'https://x.com/anam_massinga',
      color: '#000000'
    },
    { 
      name: 'WhatsApp', 
      iconClass: 'fab fa-whatsapp', 
      url: 'https://wa.me/258840000000',
      color: '#25D366'
    }
  ];

  ngOnInit(): void {
    // Inicialização do componente
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

