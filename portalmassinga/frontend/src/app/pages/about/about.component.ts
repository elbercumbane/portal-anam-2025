import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PageTransitionService } from '../../services/page-transition.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  @ViewChild('sobreContent', { static: true }) sobreContent!: ElementRef;
  @ViewChild('quemSomos', { static: true }) quemSomos!: ElementRef;
  @ViewChild('futuro', { static: true }) futuro!: ElementRef;
  @ViewChild('valores', { static: true }) valores!: ElementRef;

  constructor(private pageTransitionService: PageTransitionService) {}

  ngOnInit() {
    this.initAnimations();
  }

  private initAnimations() {
    // Configurar posições iniciais
    gsap.set(this.sobreContent.nativeElement, { opacity: 0, y: 50 });
    gsap.set(this.quemSomos.nativeElement, { opacity: 0, x: -50 });
    gsap.set(this.futuro.nativeElement, { opacity: 0, x: 50 });
    gsap.set(this.valores.nativeElement, { opacity: 0, y: 30 });

    // Timeline de entrada
    const tl = gsap.timeline();
    
    tl.to(this.sobreContent.nativeElement, { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: "power3.out" 
    })
    .to(this.quemSomos.nativeElement, { 
      opacity: 1, 
      x: 0, 
      duration: 1, 
      ease: "power3.out" 
    }, "-=0.7")
    .to(this.futuro.nativeElement, { 
      opacity: 1, 
      x: 0, 
      duration: 1, 
      ease: "power3.out" 
    }, "-=0.7")
    .to(this.valores.nativeElement, { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: "power3.out" 
    }, "-=0.7");
  }
}