import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ClubService } from '../../../../core/services/club.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ClientService } from '../../../../core/services/client.service';
import { AdminUserService, AdminUserStatus } from '../../../../core/services/admin-user.service';
import { Club as ApiClub } from '../../../../core/models/club.model';
import { User as ApiUser } from '../../../../core/models/user.model';

interface Club {
  id: number;
  userId?: number;
  name: string;
  city: string;
  country: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: AdminUserStatus;
  members: number;
  coaches: number;
  revenue: string;
  joined: string;
  initial: string;
  color: string;
}

interface ConfirmDialog {
  title: string;
  message: string;
  confirmLabel: string;
  tone: 'primary' | 'warning' | 'danger';
  action: () => void;
}

@Component({
  selector: 'app-admin-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss'
})
export class AdminClubsComponent implements OnInit {
  search = '';
  filterPlan = 'All';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 6;
  isLoading = false;
  errorMessage = '';
  confirmDialog: ConfirmDialog | null = null;

  plans = ['All', 'Basic', 'Pro', 'Enterprise'];
  statuses = ['All', 'active', 'pending', 'inactive', 'banned'];

  clubs: Club[] = [];

  private colors = ['#2563EB', '#7C3AED', '#059669', '#F59E0B', '#DC2626', '#0891B2'];

  constructor(
    private clubService: ClubService,
    private coachService: CoachService,
    private clientService: ClientService,
    private adminUserService: AdminUserService
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      clubs: this.clubService.getAllClubs(),
      coaches: this.coachService.getAllCoaches(),
      clients: this.clientService.getAllClients(),
      users: this.adminUserService.getAllUsers()
    }).subscribe({
      next: ({ clubs, coaches, clients, users }) => {
        this.clubs = clubs.map((club, index) => {
          const user = users.find(item => item.id === club.userId);
          const coachCount = coaches.filter(coach => coach.clubId === club.id).length;
          const memberCount = clients.filter(client => client.clubId === club.id).length;
          return this.mapClub(club, user, coachCount, memberCount, index);
        });
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clubs depuis l API.';
        this.isLoading = false;
      }
    });
  }

  get filtered(): Club[] {
    return this.clubs.filter(c => {
      const q = this.search.toLowerCase();
      const ms = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      const mp = this.filterPlan === 'All' || c.plan === this.filterPlan;
      const mst = this.filterStatus === 'All' || c.status === this.filterStatus;
      return ms && mp && mst;
    });
  }

  get paginated(): Club[] {
    const s = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(s, s + this.pageSize);
  }

  get totalPages(): number { return Math.max(Math.ceil(this.filtered.length / this.pageSize), 1); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  getPageStart(): number { return this.filtered.length ? (this.currentPage - 1) * this.pageSize + 1 : 0; }
  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  get activeCount(): number { return this.clubs.filter(c => c.status === 'active').length; }
  get pendingCount(): number { return this.clubs.filter(c => c.status === 'pending').length; }
  get totalMembers(): number { return this.clubs.reduce((s, c) => s + c.members, 0); }

  approveClub(club: Club): void {
    this.changeClubStatus(club, 'active', 'Approuver ce club ?', `${club.name} sera active sur la plateforme.`, 'Approuver');
  }

  toggleStatus(club: Club): void {
    const activate = club.status !== 'active';
    this.changeClubStatus(
      club,
      activate ? 'active' : 'inactive',
      activate ? 'Activer ce club ?' : 'Suspendre ce club ?',
      `${club.name} sera ${activate ? 'active' : 'suspendu'} apres confirmation.`,
      activate ? 'Activer' : 'Suspendre'
    );
  }

  deleteClub(club: Club): void {
    this.confirmDialog = {
      title: 'Supprimer ce club ?',
      message: `Le profil club ${club.name} sera supprime definitivement.`,
      confirmLabel: 'Supprimer',
      tone: 'danger',
      action: () => {
        this.clubService.deleteClub(club.id).subscribe({
          next: () => this.clubs = this.clubs.filter(item => item.id !== club.id),
          error: () => this.errorMessage = 'Suppression du club echouee.'
        });
      }
    };
  }

  confirmAction(): void {
    const dialog = this.confirmDialog;
    this.confirmDialog = null;
    dialog?.action();
  }

  cancelConfirm(): void {
    this.confirmDialog = null;
  }

  private changeClubStatus(club: Club, status: AdminUserStatus, title: string, message: string, confirmLabel: string): void {
    if (!club.userId) {
      this.errorMessage = 'Ce club n a pas de userId pour appliquer cette action.';
      return;
    }

    this.confirmDialog = {
      title,
      message,
      confirmLabel,
      tone: status === 'active' ? 'primary' : 'warning',
      action: () => {
        const request = status === 'active'
          ? this.adminUserService.activateUser(club.userId!)
          : this.adminUserService.deactivateUser(club.userId!);

        request.subscribe({
          next: updated => this.patchClubStatus(updated),
          error: () => this.errorMessage = 'Action club echouee.'
        });
      }
    };
  }

  private patchClubStatus(user: ApiUser): void {
    this.clubs = this.clubs.map(club => club.userId === user.id
      ? { ...club, status: this.adminUserService.getStatus(user) }
      : club
    );
  }

  private mapClub(club: ApiClub, user: ApiUser | undefined, coaches: number, members: number, index: number): Club {
    const location = this.parseLocation(club.localisation);
    return {
      id: club.id,
      userId: club.userId,
      name: club.clubName,
      city: location.city,
      country: location.country,
      plan: this.mapPlan(club.subscriptionPlan),
      status: user ? this.adminUserService.getStatus(user) : 'active',
      members,
      coaches,
      revenue: '-',
      joined: this.formatDate(club.createdAt),
      initial: this.getInitials(club.clubName),
      color: this.colors[index % this.colors.length]
    };
  }

  private parseLocation(value?: string): { city: string; country: string } {
    if (!value) return { city: '-', country: '-' };
    const parts = value.split(',').map(part => part.trim()).filter(Boolean);
    return { city: parts[0] ?? value, country: parts[1] ?? 'MA' };
  }

  private mapPlan(plan?: string): 'Basic' | 'Pro' | 'Enterprise' {
    if (plan === 'PREMIUM') return 'Pro';
    if (plan === 'ENTERPRISE') return 'Enterprise';
    return 'Basic';
  }

  private formatDate(value?: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
  }

  private getInitials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
  }
}
