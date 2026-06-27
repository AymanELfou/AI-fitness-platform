import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  authService = inject(AuthService);
  coachService = inject(CoachService);
  clientService = inject(ClientService);

  searchQuery = '';
  
  clients: Client[] = [];
  isLoading = true;
  
  selectedClient: Client | null = null;
  isModalOpen = false;

  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    const user = this.authService.currentUser();
    if (!user || !user.id) return;

    this.coachService.getCoachByUserId(user.id).subscribe({
      next: (coachProfile) => {
        if (coachProfile && coachProfile.id) {
          this.clientService.getClientsByCoachId(coachProfile.id).subscribe({
            next: (clients) => {
              this.clients = clients;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Failed to load clients', err);
              this.isLoading = false;
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to load coach profile', err);
        this.isLoading = false;
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return 'C';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  }

  getColor(id?: number): string {
    if (!id) return this.colors[0];
    return this.colors[id % this.colors.length];
  }

  openClientModal(client: Client) {
    this.selectedClient = client;
    this.isModalOpen = true;
  }

  closeClientModal() {
    this.selectedClient = null;
    this.isModalOpen = false;
  }

  get filtered() {
    return this.clients.filter(c => {
      return (c.userName || '').toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }
}
