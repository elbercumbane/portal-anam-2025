import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'fae' | 'economic-agent' | 'user-evaluation' | 'training';
  province: string;
  timestamp: Date;
  read: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private notifications: Notification[] = [];

  constructor() {
    // Carregar notificações do localStorage se existirem
    this.loadNotificationsFromStorage();
  }

  /**
   * Adiciona uma nova notificação
   */
  addNotification(type: Notification['type'], province: string): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      province,
      timestamp: new Date(),
      read: false,
      message: this.generateMessage(type, province)
    };

    this.notifications.unshift(notification); // Adiciona no início
    this.notifications = this.notifications.slice(0, 50); // Mantém apenas as últimas 50
    this.saveNotificationsToStorage();
    this.notificationsSubject.next([...this.notifications]);
  }

  /**
   * Retorna todas as notificações
   */
  getAllNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Retorna as últimas N notificações
   */
  getLatestNotifications(count: number = 5): Notification[] {
    return this.notifications.slice(0, count);
  }

  /**
   * Retorna o número de notificações não lidas
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Marca uma notificação como lida
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotificationsToStorage();
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotificationsToStorage();
    this.notificationsSubject.next([...this.notifications]);
  }

  /**
   * Remove todas as notificações
   */
  clearAll(): void {
    this.notifications = [];
    this.saveNotificationsToStorage();
    this.notificationsSubject.next([]);
  }

  /**
   * Gera uma mensagem formatada para a notificação
   */
  private generateMessage(type: Notification['type'], province: string): string {
    const typeNames = {
      'fae': 'FAE',
      'economic-agent': 'Agente Económico',
      'user-evaluation': 'Utilizador',
      'training': 'Formação'
    };

    // Se a província for "Central", não incluir a palavra "província"
    if (province.toLowerCase() === 'central') {
      return `Nova avaliação ${typeNames[type]} ${province}`;
    }

    return `Nova avaliação ${typeNames[type]} província ${province}`;
  }

  /**
   * Gera um ID único para a notificação
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Salva notificações no localStorage
   */
  private saveNotificationsToStorage(): void {
    try {
      const notificationsToSave = this.notifications.map(n => ({
        ...n,
        timestamp: n.timestamp.toISOString()
      }));
      localStorage.setItem('dashboard_notifications', JSON.stringify(notificationsToSave));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  /**
   * Carrega notificações do localStorage
   */
  private loadNotificationsFromStorage(): void {
    try {
      const saved = localStorage.getItem('dashboard_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.notificationsSubject.next([...this.notifications]);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }
}

