import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

@Component({
  selector: 'app-message-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-popup.component.html',
  styleUrl: './message-popup.component.scss'
})
export class MessagePopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('popup', { static: false }) popupRef?: ElementRef;
  
  lastScroll = 0;
  showPopup = false;
  mensagemEnviada = false;
  nome = '';
  email = '';
  mensagem = '';
  private scrollListener?: () => void;
  private intersectionObserver?: IntersectionObserver;
  private popupTimeline?: gsap.core.Timeline;

  ngAfterViewInit() {
    // Detectar quando o usuário chega à última seção (footer)
    this.setupIntersectionObserver();
    
    // Detectar scroll para cima para esconder o popup
    this.scrollListener = () => {
      const cur = window.scrollY;
      
      // Esconder quando faz scroll para cima
      if (cur < this.lastScroll && this.showPopup) {
        this.showPopup = false;
      }
      
      this.lastScroll = cur;
    };

    window.addEventListener('scroll', this.scrollListener);
  }

  private setupIntersectionObserver() {
    // Observar o footer para detectar quando o usuário chega à última seção
    const footer = document.querySelector('footer');
    if (footer) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.showPopup) {
              // Usuário chegou ao footer, mostrar popup
              setTimeout(() => {
                this.showPopup = true;
                this.animatePopupIn();
              }, 500); // Pequeno delay para melhor UX
            }
          });
        },
        { threshold: 0.1 } // Disparar quando 10% do footer estiver visível
      );
      
      this.intersectionObserver.observe(footer);
    }
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  fecharPopup() {
    this.animatePopupOut(() => {
      this.showPopup = false;
      this.mensagemEnviada = false;
      // Limpar campos quando fechar
      this.nome = '';
      this.email = '';
      this.mensagem = '';
    });
  }

  isFormValid(): boolean {
    return !!(this.nome.trim() && this.email.trim() && this.mensagem.trim());
  }

  enviarMensagem() {
    if (this.isFormValid()) {
      // Simular envio da mensagem
      console.log('Mensagem enviada:', {
        nome: this.nome,
        email: this.email,
        mensagem: this.mensagem
      });
      
      // Aqui você pode chamar sua API existente
      // Simular delay de envio
      setTimeout(() => {
        this.mensagemEnviada = true;
        this.animateSuccessState();
      }, 500);
    }
  }

  private animatePopupIn() {
    if (!this.popupRef?.nativeElement) return;
    
    const popup = this.popupRef.nativeElement;
    
    // Reset inicial - vindo da direita
    gsap.set(popup, {
      x: 300, // Reduzido para ser mais suave
      opacity: 0,
      scale: 0.95, // Mais próximo do tamanho final
      rotationY: 8 // Rotação mais sutil
    });

    // Criar timeline de entrada
    this.popupTimeline = gsap.timeline();
    
    this.popupTimeline
      .to(popup, {
        x: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2, // Mais tempo para suavidade
        ease: "power2.out" // Easing mais suave
      })
      .from(popup.querySelectorAll('.form-input, .popup-textarea'), {
        x: 20, // Movimento mais sutil
        opacity: 0,
        duration: 0.6,
        stagger: 0.1, // Stagger mais rápido
        ease: "power1.out" // Easing mais linear
      }, "-=0.6") // Sobreposição maior
      .from(popup.querySelector('.btn'), {
        x: 15,
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        ease: "power1.out" // Easing mais suave
      }, "-=0.4");
  }

  private animatePopupOut(callback: () => void) {
    if (!this.popupRef?.nativeElement) {
      callback();
      return;
    }
    
    const popup = this.popupRef.nativeElement;
    
    gsap.to(popup, {
      x: 300, // Distância reduzida
      opacity: 0,
      scale: 0.95, // Scale mais suave
      rotationY: -8, // Rotação mais sutil
      duration: 0.8, // Mais tempo para suavidade
      ease: "power1.inOut", // Easing mais suave
      onComplete: callback
    });
  }

  private animateSuccessState() {
    if (!this.popupRef?.nativeElement) return;
    
    const popup = this.popupRef.nativeElement;
    const successIcon = popup.querySelector('.success-icon i');
    const successMessage = popup.querySelector('.success-message');
    const successButton = popup.querySelector('.btn-secondary');
    
    // Animar mudança de estado com efeito mais suave
    gsap.timeline()
      .to(popup.querySelector('.popup-header'), {
        backgroundColor: '#10B981',
        duration: 0.8, // Mais tempo
        ease: "power1.out" // Mais suave
      })
      .from(successIcon, {
        x: 25, // Movimento mais sutil
        scale: 0.8, // Scale mais suave
        rotation: -90, // Rotação reduzida
        duration: 1.0, // Mais tempo
        ease: "power1.out" // Mais suave
      }, "-=0.5") // Sobreposição maior
      .from(successMessage, {
        x: 15, // Movimento mais sutil
        opacity: 0,
        duration: 0.7,
        ease: "power1.out" // Mais suave
      }, "-=0.6")
      .from(successButton, {
        x: 10, // Movimento mais sutil
        scale: 0.95, // Scale mais suave
        opacity: 0,
        duration: 0.6,
        ease: "power1.out" // Mais suave
      }, "-=0.4");
  }
}
