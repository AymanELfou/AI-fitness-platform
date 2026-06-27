import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ClientService } from '../../../../core/services/client.service';
import { ProgrammeService } from '../../../../core/services/programme.service';
import { Client } from '../../../../core/models/client.model';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class CoachDashboardComponent implements OnInit {
  authService = inject(AuthService);
  coachService = inject(CoachService);
  clientService = inject(ClientService);
  programmeService = inject(ProgrammeService);

  currentDate = new Date();
  isLoading = true;

  stats: any[] = [];
  clients: Client[] = [];
  programCount = 0;
  coachRating = 5.0;
  coachTariff = 0;
  coachExperience = 0;
  coachSpeciality = '';

  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

  sessionsMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  sessionsData = [32, 38, 41, 36, 52, 58, 44, 61, 49, 56, 62, 64];
  maxSessions = Math.max(...this.sessionsData);

  alerts = [
    { message: 'Nouvelle demande de coaching reçue', type: 'info', icon: 'user' },
    { message: 'Un nouveau programme a été généré avec succès', type: 'success', icon: 'check' }
  ];

  ngOnInit() {
    this.loadCoachDashboardData();
  }

  loadCoachDashboardData() {
    const user = this.authService.currentUser();
    if (!user || !user.id) {
      this.isLoading = false;
      return;
    }

    this.coachService.getCoachByUserId(user.id).subscribe({
      next: (coachProfile) => {
        if (coachProfile && coachProfile.id) {
          this.coachRating = coachProfile.rating || 5.0;
          this.coachTariff = coachProfile.tariff || 0;
          this.coachExperience = coachProfile.experience || 0;
          this.coachSpeciality = coachProfile.speciality || 'N/A';

          // Fetch Clients
          this.clientService.getClientsByCoachId(coachProfile.id).subscribe({
            next: (clients) => {
              this.clients = clients;
              
              // Fetch Programs
              this.programmeService.getByCoachId(coachProfile.id).subscribe({
                next: (programmes) => {
                  this.programCount = programmes.length;
                  this.updateStats();
                  this.isLoading = false;
                },
                error: (err) => {
                  console.error('Failed to load programmes', err);
                  this.updateStats();
                  this.isLoading = false;
                }
              });
            },
            error: (err) => {
              console.error('Failed to load clients', err);
              this.updateStats();
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load coach profile', err);
        this.isLoading = false;
      }
    });
  }

  updateStats() {
    this.stats = [
      {
        label: 'Clients Actifs',
        value: this.clients.length.toString(),
        change: '+1',
        positive: true,
        icon: 'clients',
        color: '#6366f1',
        bg: '#eef2ff'
      },
      {
        label: 'Spécialité',
        value: this.coachSpeciality,
        change: 'Coach',
        positive: true,
        icon: 'sessions',
        color: '#10b981',
        bg: '#ecfdf5'
      },
      {
        label: 'Programmes Créés',
        value: this.programCount.toString(),
        change: `+${this.programCount}`,
        positive: true,
        icon: 'programs',
        color: '#f59e0b',
        bg: '#fffbeb'
      },
      {
        label: 'Tarif / Session',
        value: `${this.coachTariff} DH`,
        change: `${this.coachExperience} ans exp`,
        positive: true,
        icon: 'rating',
        color: '#8b5cf6',
        bg: '#f5f3ff'
      }
    ];
  }

  getBarHeight(value: number): number {
    return (value / this.maxSessions) * 100;
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
}
