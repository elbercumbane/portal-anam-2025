import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  PROJECTOS_HERO_SLIDES,
  PROJECTOS_SLIDER_INTERVAL_MS,
  ProjectosHeroSlide
} from './projects-home.data';

@Component({
  selector: 'app-projects-home',
  standalone: false,
  templateUrl: './projects-home.component.html',
  styleUrl: './projects-home.component.scss'
})
export class ProjectsHomeComponent implements OnInit, OnDestroy {
  slides: ProjectosHeroSlide[] = PROJECTOS_HERO_SLIDES;
  currentSlide = 0;
  progressPercent = 0;

  private slideTimeout: ReturnType<typeof setTimeout> | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private slideStartTime = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    document.body.classList.add('navbar-solid');
    this.startSlideCycle();
  }

  ngOnDestroy() {
    document.body.classList.remove('navbar-solid');
    this.clearTimers();
  }

  navigateTo(route: 'ativos' | 'realizados' | 'candidaturas', event: Event) {
    event.preventDefault();
    const targetRoute = route === 'ativos' ? ['/projectos', 'ativos'] : ['/projectos', route];
    this.router.navigate(targetRoute).then(() => {
      const contentSection = document.querySelector('.projectos-container');
      contentSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  goToSlide(index: number): void {
    if (index === this.currentSlide) return;
    this.currentSlide = index;
    this.restartSlideCycle();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.restartSlideCycle();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.restartSlideCycle();
  }

  private startSlideCycle(): void {
    this.resetProgress();
    this.scheduleNextSlide();
  }

  private restartSlideCycle(): void {
    this.clearTimers();
    this.startSlideCycle();
  }

  private scheduleNextSlide(): void {
    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
    }, PROJECTOS_SLIDER_INTERVAL_MS);
  }

  private resetProgress(): void {
    this.progressPercent = 0;
    this.slideStartTime = Date.now();

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - this.slideStartTime;
      this.progressPercent = Math.min((elapsed / PROJECTOS_SLIDER_INTERVAL_MS) * 100, 100);
    }, 50);
  }

  private clearTimers(): void {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
      this.slideTimeout = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}
