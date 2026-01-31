import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail: string = '';
  privacyAccepted: boolean = false;

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.privacyAccepted) {
      // Aqui você pode adicionar a lógica para enviar o email para o backend
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Obrigado por se inscrever na nossa newsletter!');
      this.newsletterEmail = '';
      this.privacyAccepted = false;
    }
  }
}
