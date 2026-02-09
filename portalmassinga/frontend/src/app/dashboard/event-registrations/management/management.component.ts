import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';

interface EventRegistrationRow {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  fullName: string;
  email: string;
  phone: string;
  participantType: string;
  receiveWhatsApp: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-event-registrations-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class EventRegistrationsManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  registrations: EventRegistrationRow[] = [];
  filteredRegistrations: EventRegistrationRow[] = [];
  searchTerm = '';
  filterEventId = '';
  eventIds: string[] = [];
  eventOptions: { id: string; title: string }[] = [];
  isLoading = false;
  errorMessage = '';
  selectedRegistration: EventRegistrationRow | null = null;
  showDetailsModal = false;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiClient.getEventRegistrations().subscribe({
      next: (response: any) => {
        const list = Array.isArray(response) ? response : (response?.data ?? response?.body ?? []);
        this.registrations = (list || []).map((r: any) => ({
          id: r.id,
          eventId: r.eventId ?? r.event_id ?? '',
          eventTitle: r.eventTitle ?? r.event_title ?? '',
          eventDate: r.eventDate ?? r.event_date ?? '',
          eventLocation: r.eventLocation ?? r.event_location ?? '',
          fullName: r.fullName ?? r.full_name ?? '',
          email: r.email ?? '',
          phone: r.phone ?? '',
          participantType: r.participantType ?? r.participant_type ?? '',
          receiveWhatsApp: r.receiveWhatsApp === true,
          createdAt: r.createdAt ?? ''
        }));
        const byId = new Map<string, string>();
        this.registrations.forEach(r => {
          if (r.eventId && !byId.has(r.eventId)) byId.set(r.eventId, r.eventTitle || r.eventId);
        });
        this.eventIds = [...byId.keys()].sort((a, b) => a.localeCompare(b));
        this.eventOptions = this.eventIds.map(id => ({ id, title: byId.get(id) || id }));
        this.filterRegistrations();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Erro ao carregar inscrições em eventos.';
        this.registrations = [];
        this.filteredRegistrations = [];
        this.isLoading = false;
      }
    });
  }

  filterRegistrations(): void {
    const term = (this.searchTerm || '').toLowerCase();
    const eventId = (this.filterEventId || '').trim();
    this.filteredRegistrations = this.registrations.filter(r => {
      const matchEvent = !eventId || r.eventId === eventId;
      const matchSearch = !term ||
        (r.fullName || '').toLowerCase().includes(term) ||
        (r.email || '').toLowerCase().includes(term) ||
        (r.phone || '').includes(term) ||
        (r.eventTitle || '').toLowerCase().includes(term) ||
        (r.participantType || '').toLowerCase().includes(term);
      return matchEvent && matchSearch;
    });
  }

  onSearchChange(): void {
    this.filterRegistrations();
  }

  onFilterEventChange(): void {
    this.filterRegistrations();
  }

  viewDetails(r: EventRegistrationRow): void {
    this.selectedRegistration = r;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRegistration = null;
  }

  getParticipantTypeLabel(value: string): string {
    const map: Record<string, string> = {
      'membro': 'Membro',
      'simpatizante': 'Simpatizante',
      'apoiante': 'Apoiante',
      'publico': 'Público Geral'
    };
    return map[value] || value || '-';
  }
}
