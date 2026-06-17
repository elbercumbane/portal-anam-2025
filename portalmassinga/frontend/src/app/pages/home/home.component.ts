import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';

import { HistorySectionComponent } from './sections/history/history.component';
import { EventsSectionComponent } from './sections/events/events.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { PartnersSectionComponent } from './sections/partners/partners.component';
import { StatsSectionComponent } from './sections/stats/stats.component';
import { NewsSectionComponent } from './sections/news/news.component';

import { HERO_SLIDES, HeroSlide, SLIDER_CONFIG } from './home.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    RouterModule,
    HistorySectionComponent,
    EventsSectionComponent,
    GalleryComponent,
    PartnersSectionComponent,
    StatsSectionComponent,
    NewsSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = HERO_SLIDES;
  currentSlide = 0;
  contentKey = 0;
  isTransitioning = false;
  progressPercent = 0;

  private slideTimeout: ReturnType<typeof setTimeout> | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private slideStartTime = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiClient: ApiClientService
  ) {}

  ngOnInit() {
    this.startSlideCycle();
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToSection(fragment), 100);
      }
    });
  }

  get activeSlide(): HeroSlide {
    return this.slides[this.currentSlide] ?? this.slides[0];
  }

  get slideCounter(): string {
    const current = String(this.currentSlide + 1).padStart(2, '0');
    const total = String(this.slides.length).padStart(2, '0');
    return `${current} / ${total}`;
  }

  private startSlideCycle() {
    this.resetProgress();
    this.scheduleNextSlide();
  }

  private resetProgress() {
    this.progressPercent = 0;
    this.slideStartTime = Date.now();

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - this.slideStartTime;
      this.progressPercent = Math.min((elapsed / SLIDER_CONFIG.duracaoMs) * 100, 100);
    }, 50);
  }

  private scheduleNextSlide() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
    }, SLIDER_CONFIG.duracaoMs);
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.changeSlide(next);
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.changeSlide(prev);
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.slides.length && index !== this.currentSlide) {
      this.changeSlide(index);
    }
  }

  private changeSlide(index: number) {
    this.isTransitioning = true;

    setTimeout(() => {
      this.currentSlide = index;
      this.contentKey++;
      this.isTransitioning = false;
      this.resetProgress();
      this.scheduleNextSlide();
    }, 450);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy() {
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    if (this.progressInterval) clearInterval(this.progressInterval);
  }
}
