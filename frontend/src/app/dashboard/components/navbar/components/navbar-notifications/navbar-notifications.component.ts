import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService, Notification } from '../../../../services/notification.service';

@Component({
  selector: 'app-navbar-notifications',
  template: `
    <button 
      mat-icon-button 
      class="action-btn notifications-btn" 
      matTooltip="Notificações" 
      [matBadge]="unreadCount" 
      [matBadgeHidden]="unreadCount === 0"
      matBadgeColor="warn"
      [matMenuTriggerFor]="notificationsMenu">
      <mat-icon class="notification-icon">notifications</mat-icon>
    </button>
    
    <mat-menu #notificationsMenu="matMenu" class="notifications-menu" xPosition="before">
      <div class="notifications-header">
        <h3>Notificações</h3>
        <button 
          mat-icon-button 
          (click)="markAllAsRead()" 
          *ngIf="unreadCount > 0" 
          class="mark-all-read-btn"
          matTooltip="Marcar todas como lidas">
          <mat-icon>done_all</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="notifications-list">
        <div *ngIf="latestNotifications.length === 0" class="no-notifications">
          <mat-icon>notifications_off</mat-icon>
          <p>Nenhuma notificação</p>
        </div>
        
        <div 
          *ngFor="let notification of latestNotifications" 
          class="notification-item"
          [class.unread]="!notification.read"
          (click)="markAsRead(notification.id)">
          <div class="notification-icon-wrapper" [style.background-color]="getNotificationColor(notification.type)">
            <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
          </div>
          <div class="notification-content">
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>
          <div class="notification-indicator" *ngIf="!notification.read"></div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="notifications-footer">
        <button mat-button (click)="clearAll()" class="clear-all-btn">
          <mat-icon>delete_sweep</mat-icon>
          <span>Limpar todas</span>
        </button>
      </div>
    </mat-menu>
  `,
  styleUrls: ['./navbar-notifications.component.scss']
})
export class NavbarNotificationsComponent implements OnInit, OnDestroy {
  @Input() notificationCount: number = 0;
  @Output() notificationsClick = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();
  unreadCount = 0;
  latestNotifications: Notification[] = [];
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // Subscrever a atualizações de notificações
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications: Notification[]) => {
        this.updateNotifications();
      });
    
    // Carregar notificações iniciais
    this.updateNotifications();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateNotifications(): void {
    this.unreadCount = this.notificationService.getUnreadCount();
    this.latestNotifications = this.notificationService.getLatestNotifications(5);
  }
  
  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
    this.notificationsClick.emit();
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
  
  clearAll(): void {
    this.notificationService.clearAll();
  }
  
  getNotificationIcon(type: Notification['type']): string {
    const icons = {
      'fae': 'assignment',
      'economic-agent': 'business',
      'user-evaluation': 'person',
      'training': 'school'
    };
    return icons[type] || 'notifications';
  }
  
  getNotificationColor(type: Notification['type']): string {
    const colors = {
      'fae': '#3b82f6',
      'economic-agent': '#8b5cf6',
      'user-evaluation': '#10b981',
      'training': '#f59e0b'
    };
    return colors[type] || '#666';
  }
  
  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
      return 'Agora';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days < 7) {
      return `${days} dias atrás`;
    } else {
      return timestamp.toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
