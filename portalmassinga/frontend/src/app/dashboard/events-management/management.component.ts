import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../services/api-client.service';

interface EventRow {
  id: string;
  title: string;
  eventDate: string;
  eventDateStart: string;
  eventDateEnd: string;
  endDate: string;
  location: string;
  timeSlot: string;
  description: string;
  imageUrl: string;
  levelAccess: string;
  registrationCount: number;
  isCancelled: boolean;
  cancelledMessage: string;
  canEdit: boolean;
  canCancel: boolean;
}

interface ParticipantRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  participantType: string;
  createdAt: string;
}

@Component({
  selector: 'app-events-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class EventsManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  events: EventRow[] = [];
  isLoading = false;
  errorMessage = '';
  showEditModal = false;
  showCreateModal = false;
  showViewModal = false;
  showCancelModal = false;
  editingEvent: EventRow | null = null;
  viewingEvent: EventRow | null = null;
  cancellingEvent: EventRow | null = null;
  participants: ParticipantRow[] = [];
  participantTypeFilter = '';
  cancelMessage = '';
  saveInProgress = false;
  saveError = '';
  createForm = {
    title: '',
    eventDateStart: '',
    eventDateEnd: '',
    endDate: '',
    location: '',
    timeSlot: '',
    description: '',
    imageUrl: '',
    levelAccess: 'publico'
  };
  editForm: {
    title: string;
    eventDateStart: string;
    eventDateEnd: string;
    endDate: string;
    timeSlot: string;
    location: string;
    description: string;
    imageUrl: string;
    levelAccess: string;
  } = { title: '', eventDateStart: '', eventDateEnd: '', endDate: '', timeSlot: '', location: '', description: '', imageUrl: '', levelAccess: 'publico' };

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiClient.getEvents().subscribe({
      next: (response: any) => {
        const list = Array.isArray(response) ? response : (response?.data ?? response?.body ?? []);
        this.events = (list || []).map((e: any) => ({
          id: e.id,
          title: e.title ?? '',
          eventDate: e.eventDate ?? e.event_date ?? '',
          eventDateStart: e.eventDateStart ?? e.event_date_start ?? '',
          eventDateEnd: e.eventDateEnd ?? e.event_date_end ?? '',
          endDate: e.endDate ?? e.end_date ?? '',
          location: e.location ?? '',
          timeSlot: e.timeSlot ?? e.time_slot ?? '',
          description: e.description ?? '',
          imageUrl: e.imageUrl ?? e.image_url ?? '',
          levelAccess: e.levelAccess ?? e.level_access ?? '',
          registrationCount: e.registrationCount ?? e.registration_count ?? 0,
          isCancelled: e.isCancelled === true,
          cancelledMessage: e.cancelledMessage ?? e.cancelled_message ?? '',
          canEdit: e.canEdit === true,
          canCancel: e.canCancel === true
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Erro ao carregar eventos.';
        this.events = [];
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.createForm = {
      title: '',
      eventDateStart: '',
      eventDateEnd: '',
      endDate: '',
      location: '',
      timeSlot: '',
      description: '',
      imageUrl: '',
      levelAccess: 'publico'
    };
    this.saveError = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.saveError = '';
  }

  openEditModal(event: EventRow): void {
    if (!event.canEdit) return;
    this.editingEvent = event;
    this.editForm = {
      title: event.title,
      eventDateStart: event.eventDateStart || '',
      eventDateEnd: event.eventDateEnd || '',
      endDate: event.endDate || '',
      timeSlot: event.timeSlot || '',
      location: event.location || '',
      description: event.description || '',
      imageUrl: event.imageUrl || '',
      levelAccess: event.levelAccess || 'publico'
    };
    this.saveError = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingEvent = null;
    this.saveError = '';
  }

  openViewModal(event: EventRow): void {
    this.viewingEvent = event;
    this.participantTypeFilter = '';
    this.loadParticipants(event.id);
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewingEvent = null;
    this.participants = [];
  }

  onParticipantTypeFilterChange(): void {
    if (this.viewingEvent) this.loadParticipants(this.viewingEvent.id);
  }

  loadParticipants(eventId: string): void {
    const participantType = this.participantTypeFilter && this.participantTypeFilter !== 'todos' ? this.participantTypeFilter : undefined;
    this.apiClient.getEventRegistrations(eventId, participantType).subscribe({
      next: (list: any[]) => {
        const arr = Array.isArray(list) ? list : [];
        this.participants = arr.map((r: any) => ({
          id: r.id,
          fullName: r.fullName ?? r.full_name ?? '',
          email: r.email ?? '',
          phone: r.phone ?? '',
          participantType: r.participantType ?? r.participant_type ?? '',
          createdAt: r.createdAt ?? ''
        }));
      },
      error: () => { this.participants = []; }
    });
  }

  openCancelModal(event: EventRow): void {
    if (!event.canCancel) return;
    this.cancellingEvent = event;
    this.cancelMessage = '';
    this.saveError = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellingEvent = null;
    this.cancelMessage = '';
  }

  saveEvent(): void {
    if (!this.editingEvent) return;
    this.saveInProgress = true;
    this.saveError = '';
    const payload: any = {
      title: this.editForm.title,
      eventDateStart: this.editForm.eventDateStart || undefined,
      eventDateEnd: this.editForm.eventDateEnd || undefined,
      timeSlot: this.editForm.timeSlot || undefined,
      location: this.editForm.location || undefined,
      description: this.editForm.description || undefined,
      imageUrl: this.editForm.imageUrl || undefined,
      levelAccess: this.editForm.levelAccess || undefined
    };
    if (this.editForm.endDate) payload.endDate = this.editForm.endDate;
    this.apiClient.updateEvent(this.editingEvent.id, payload).subscribe({
      next: () => {
        this.saveInProgress = false;
        this.closeEditModal();
        this.loadEvents();
      },
      error: (err: any) => {
        this.saveInProgress = false;
        this.saveError = err?.message || 'Erro ao guardar. Tente novamente.';
      }
    });
  }

  createEvent(): void {
    this.saveInProgress = true;
    this.saveError = '';
    const payload: any = {
      title: this.createForm.title,
      eventDateStart: this.createForm.eventDateStart || undefined,
      eventDateEnd: this.createForm.eventDateEnd || undefined,
      location: this.createForm.location || undefined,
      timeSlot: this.createForm.timeSlot || undefined,
      description: this.createForm.description || undefined,
      imageUrl: this.createForm.imageUrl || undefined,
      levelAccess: this.createForm.levelAccess || 'publico'
    };
    if (this.createForm.endDate) payload.endDate = this.createForm.endDate;
    this.apiClient.createEvent(payload).subscribe({
      next: () => {
        this.saveInProgress = false;
        this.closeCreateModal();
        this.loadEvents();
      },
      error: (err: any) => {
        this.saveInProgress = false;
        this.saveError = err?.message || 'Erro ao criar evento. Tente novamente.';
      }
    });
  }

  confirmCancel(): void {
    if (!this.cancellingEvent || !this.cancelMessage.trim()) return;
    this.saveInProgress = true;
    this.apiClient.cancelEvent(this.cancellingEvent.id, this.cancelMessage.trim()).subscribe({
      next: () => {
        this.saveInProgress = false;
        this.closeCancelModal();
        this.loadEvents();
      },
      error: (err: any) => {
        this.saveInProgress = false;
        this.saveError = err?.message || 'Erro ao cancelar.';
      }
    });
  }

  get totalInscricoes(): number {
    return this.events.reduce((sum, e) => sum + (e.registrationCount || 0), 0);
  }

  getLevelAccessLabel(value: string): string {
    const map: Record<string, string> = {
      'publico': 'Público',
      'membros': 'Membros',
      'simpatizantes': 'Simpatizantes',
      'apoiantes': 'Apoiantes'
    };
    return map[value] || value || '-';
  }

  getParticipantTypeLabel(value: string): string {
    return this.getLevelAccessLabel(value);
  }

  dateDisplay(e: EventRow): string {
    if (e.eventDateStart && e.eventDateEnd && e.eventDateStart !== e.eventDateEnd) return e.eventDateStart + ' - ' + e.eventDateEnd;
    return e.eventDateStart || e.eventDate || '-';
  }
}
