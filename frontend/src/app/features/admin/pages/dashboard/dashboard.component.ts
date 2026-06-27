import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { ClubService } from '../../../../core/services/club.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ClientService } from '../../../../core/services/client.service';

interface StatCard {
  label: string; value: string; sub: string; trend: string; up: boolean; icon: string; color: string;
}

interface ActivityItem {
  type: string; message: string; time: string; icon: string; color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  stats: StatCard[] = [];
  recentActivity: ActivityItem[] = [];
  topClubs: Array<{ name: string; members: number; revenue: string; growth: string; up: boolean }> = [];
  planDistribution: Array<{ plan: string; count: number; pct: number; color: string }> = [];

  constructor(
    private adminUserService: AdminUserService,
    private clubService: ClubService,
    private coachService: CoachService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      users: this.adminUserService.getAllUsers(),
      clubs: this.clubService.getAllClubs(),
      coaches: this.coachService.getAllCoaches(),
      clients: this.clientService.getAllClients()
    }).subscribe({
      next: ({ users, clubs, coaches, clients }) => {
        const activeUsers = users.filter(user => this.adminUserService.getStatus(user) === 'active').length;
        const pendingUsers = users.filter(user => this.adminUserService.getStatus(user) === 'pending').length;
        const activeClubs = clubs.filter(club => {
          const user = users.find(item => item.id === club.userId);
          return !user || this.adminUserService.getStatus(user) === 'active';
        }).length;

        this.stats = [
          { label: 'Total Users', value: users.length.toString(), sub: 'Clients, Coaches, Clubs', trend: `${activeUsers} active`, up: true, icon: 'U', color: '#2563EB' },
          { label: 'Active Clubs', value: activeClubs.toString(), sub: `${clubs.length} registered clubs`, trend: `${pendingUsers} pending users`, up: true, icon: 'C', color: '#7C3AED' },
          { label: 'Total Coaches', value: coaches.length.toString(), sub: 'Coach profiles from API', trend: `${this.averageRating(coaches)} avg rating`, up: true, icon: 'T', color: '#059669' },
          { label: 'Total Clients', value: clients.length.toString(), sub: 'Client profiles from API', trend: `${clients.filter(c => c.subscriptionPlan === 'PREMIUM').length} premium`, up: true, icon: 'M', color: '#F59E0B' },
          { label: 'Inactive Users', value: users.filter(user => this.adminUserService.getStatus(user) === 'inactive').length.toString(), sub: 'Disabled accounts', trend: 'API live', up: false, icon: 'I', color: '#EF4444' },
          { label: 'Banned Users', value: users.filter(user => this.adminUserService.getStatus(user) === 'banned').length.toString(), sub: 'Locked accounts', trend: 'Security', up: false, icon: 'B', color: '#0891B2' }
        ];

        this.topClubs = clubs
          .map(club => ({
            name: club.clubName,
            members: clients.filter(client => client.clubId === club.id).length,
            revenue: '-',
            growth: 'API',
            up: true
          }))
          .sort((a, b) => b.members - a.members)
          .slice(0, 4);

        const planCounts = clubs.reduce<Record<string, number>>((acc, club) => {
          const plan = club.subscriptionPlan === 'PREMIUM' ? 'Pro' : 'Basic';
          acc[plan] = (acc[plan] ?? 0) + 1;
          return acc;
        }, {});

        const totalClubs = Math.max(clubs.length, 1);
        this.planDistribution = [
          { plan: 'Pro', count: planCounts['Pro'] ?? 0, pct: ((planCounts['Pro'] ?? 0) / totalClubs) * 100, color: '#2563EB' },
          { plan: 'Basic', count: planCounts['Basic'] ?? 0, pct: ((planCounts['Basic'] ?? 0) / totalClubs) * 100, color: '#059669' }
        ];

        this.recentActivity = users
          .slice()
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
          .slice(0, 6)
          .map(user => ({
            type: 'signup',
            message: `User registered: ${user.firstname ?? ''} ${user.lastname ?? ''}`.trim(),
            time: this.formatDate(user.createdDate),
            icon: 'U',
            color: '#2563EB'
          }));

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les donnees du dashboard depuis l API.';
        this.isLoading = false;
      }
    });
  }

  private averageRating(coaches: Array<{ rating?: number }>): string {
    const rated = coaches.filter(coach => (coach.rating ?? 0) > 0);
    return rated.length
      ? (rated.reduce((sum, coach) => sum + (coach.rating ?? 0), 0) / rated.length).toFixed(1)
      : '-';
  }

  private formatDate(value?: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  }
}
