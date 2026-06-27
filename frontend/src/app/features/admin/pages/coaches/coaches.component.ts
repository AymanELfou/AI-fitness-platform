import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminUserService, AdminUserStatus } from '../../../../core/services/admin-user.service';
import { CoachProfileResponse, CoachService } from '../../../../core/services/coach.service';
import { ClientService } from '../../../../core/services/client.service';
import { User as ApiUser } from '../../../../core/models/user.model';

interface Coach {
  id: number;
  userId?: number;
  name: string;
  email: string;
  specialty: string;
  club: string;
  status: AdminUserStatus;
  clients: number;
  rating: number;
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
  selector: 'app-admin-coaches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.scss'
})
export class AdminCoachesComponent implements OnInit {
  search = '';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 8;
  isLoading = false;
  errorMessage = '';
  confirmDialog: ConfirmDialog | null = null;

  statuses = ['All', 'active', 'pending', 'inactive', 'banned'];
  coaches: Coach[] = [];

  private colors = ['#2563EB', '#059669', '#7C3AED', '#F59E0B', '#DC2626', '#0891B2', '#EC4899'];

  constructor(
    private adminUserService: AdminUserService,
    private coachService: CoachService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadCoaches();
  }

  loadCoaches(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      coaches: this.coachService.getAllCoaches(),
      clients: this.clientService.getAllClients(),
      users: this.adminUserService.getAllUsers()
    }).subscribe({
      next: ({ coaches, clients, users }) => {
        this.coaches = coaches.map((coach, index) => {
          const user = users.find(item => item.id === coach.userId);
          const clientsCount = clients.filter(client => client.coachID === coach.id).length;
          return this.mapCoach(coach, user, clientsCount, index);
        });
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les coaches depuis l API.';
        this.isLoading = false;
      }
    });
  }

  get filtered(): Coach[] {
    return this.coaches.filter(c => {
      const q = this.search.toLowerCase();
      const ms = !q || c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q) || c.club.toLowerCase().includes(q);
      const mst = this.filterStatus === 'All' || c.status === this.filterStatus;
      return ms && mst;
    });
  }

  get paginated(): Coach[] {
    const s = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(s, s + this.pageSize);
  }

  get totalPages(): number { return Math.max(Math.ceil(this.filtered.length / this.pageSize), 1); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  getPageStart(): number { return this.filtered.length ? (this.currentPage - 1) * this.pageSize + 1 : 0; }
  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  get activeCount(): number { return this.coaches.filter(c => c.status === 'active').length; }
  get pendingCount(): number { return this.coaches.filter(c => c.status === 'pending').length; }
  get totalClients(): number { return this.coaches.reduce((s, c) => s + c.clients, 0); }
  get avgRating(): string {
    const rated = this.coaches.filter(c => c.rating > 0);
    return rated.length ? (rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(1) : '-';
  }

  stars(n: number): number[] { return n > 0 ? Array.from({ length: Math.round(n) }, (_, i) => i) : []; }

  approveCoach(coach: Coach): void {
    this.changeCoachStatus(coach, 'active', 'Approuver ce coach ?', `${coach.name} sera active sur la plateforme.`, 'Approuver');
  }

  toggleStatus(coach: Coach): void {
    const activate = coach.status !== 'active';
    this.changeCoachStatus(
      coach,
      activate ? 'active' : 'inactive',
      activate ? 'Activer ce coach ?' : 'Suspendre ce coach ?',
      `${coach.name} sera ${activate ? 'active' : 'suspendu'} apres confirmation.`,
      activate ? 'Activer' : 'Suspendre'
    );
  }

  deleteCoach(coach: Coach): void {
    this.confirmDialog = {
      title: 'Supprimer ce coach ?',
      message: `Le profil coach ${coach.name} sera supprime definitivement.`,
      confirmLabel: 'Supprimer',
      tone: 'danger',
      action: () => {
        this.coachService.deleteCoachProfile(coach.id).subscribe({
          next: () => this.coaches = this.coaches.filter(item => item.id !== coach.id),
          error: () => this.errorMessage = 'Suppression du coach echouee.'
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

  private changeCoachStatus(coach: Coach, status: AdminUserStatus, title: string, message: string, confirmLabel: string): void {
    if (!coach.userId) {
      this.errorMessage = 'Ce coach n a pas de userId pour appliquer cette action.';
      return;
    }

    this.confirmDialog = {
      title,
      message,
      confirmLabel,
      tone: status === 'active' ? 'primary' : 'warning',
      action: () => {
        const request = status === 'active'
          ? this.adminUserService.activateUser(coach.userId!)
          : this.adminUserService.deactivateUser(coach.userId!);

        request.subscribe({
          next: updated => this.patchCoachStatus(updated),
          error: () => this.errorMessage = 'Action coach echouee.'
        });
      }
    };
  }

  private patchCoachStatus(user: ApiUser): void {
    this.coaches = this.coaches.map(coach => coach.userId === user.id
      ? { ...coach, status: this.adminUserService.getStatus(user) }
      : coach
    );
  }

  private mapCoach(coach: CoachProfileResponse, user: ApiUser | undefined, clients: number, index: number): Coach {
    const userName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
    const name = coach.userName || userName || 'Coach';
    return {
      id: coach.id,
      userId: coach.userId,
      name: name || 'Coach',
      email: coach.email || user?.email || '-',
      specialty: coach.speciality || '-',
      club: coach.clubName || 'Independent',
      status: user ? this.adminUserService.getStatus(user) : 'active',
      clients,
      rating: coach.rating ?? 0,
      revenue: '-',
      joined: this.formatDate(coach.createdAt),
      initial: this.getInitials(name || 'Coach'),
      color: this.colors[index % this.colors.length]
    };
  }

  private formatDate(value?: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
  }

  private getInitials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
  }
}
