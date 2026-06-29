import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService, AdminUserStatus } from '../../../../core/services/admin-user.service';
import { User as ApiUser } from '../../../../core/models/user.model';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'club' | 'client';
  status: AdminUserStatus;
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
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  search = '';
  filterRole = 'All';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 8;
  isLoading = false;
  errorMessage = '';
  confirmDialog: ConfirmDialog | null = null;

  roles = ['All', 'coach', 'club', 'client'];
  statuses = ['All', 'active', 'pending', 'banned'];

  users: User[] = [];

  private colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#0891B2', '#F59E0B', '#0F172A'];

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminUserService.getAllUsers().subscribe({
      next: users => {
        this.users = users.map((user, index) => this.mapUser(user, index));
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les utilisateurs depuis l API.';
        this.isLoading = false;
      }
    });
  }

  get filtered(): User[] {
    return this.users.filter(u => {
      const q = this.search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = this.filterRole === 'All' || u.role === this.filterRole;
      const matchStatus = this.filterStatus === 'All' || u.status === this.filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }

  get paginated(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.max(Math.ceil(this.filtered.length / this.pageSize), 1); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  toggleStatus(user: User): void {
    const activate = user.status !== 'active';
    this.confirmDialog = {
      title: activate ? 'Activer cet utilisateur ?' : 'Desactiver cet utilisateur ?',
      message: `${user.name} sera ${activate ? 'autorise a acceder a la plateforme' : 'desactive temporairement'}.`,
      confirmLabel: activate ? 'Activer' : 'Desactiver',
      tone: activate ? 'primary' : 'warning',
      action: () => {
        const request = activate
          ? this.adminUserService.activateUser(user.id)
          : this.adminUserService.deactivateUser(user.id);

        request.subscribe({
          next: updated => this.replaceUser(updated),
          error: () => this.errorMessage = 'Action utilisateur echouee.'
        });
      }
    };
  }

  banUser(user: User): void {
    this.confirmDialog = {
      title: 'Bannir cet utilisateur ?',
      message: `${user.name} sera bloque et ne pourra plus se connecter.`,
      confirmLabel: 'Bannir',
      tone: 'danger',
      action: () => {
        this.adminUserService.lockUser(user.id).subscribe({
          next: updated => this.replaceUser(updated),
          error: () => this.errorMessage = 'Impossible de bannir cet utilisateur.'
        });
      }
    };
  }

  deleteUser(user: User): void {
    this.confirmDialog = {
      title: 'Supprimer cet utilisateur ?',
      message: `Cette action archivera ${user.name} et bloquera son acces a la plateforme.`,
      confirmLabel: 'Supprimer',
      tone: 'danger',
      action: () => {
        this.adminUserService.deleteUser(user.id).subscribe({
          next: () => this.users = this.users.filter(x => x.id !== user.id),
          error: () => this.errorMessage = 'Suppression utilisateur echouee.'
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

  getPageStart(): number {
    return this.filtered.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }

  get clientCount(): number  { return this.users.filter(u => u.role === 'client').length; }
  get coachCount(): number   { return this.users.filter(u => u.role === 'coach').length; }
  get clubCount(): number    { return this.users.filter(u => u.role === 'club').length; }
  get pendingCount(): number { return this.users.filter(u => u.status === 'pending').length; }

  private replaceUser(user: ApiUser): void {
    const index = this.users.findIndex(item => item.id === user.id);
    const mapped = this.mapUser(user, Math.max(index, 0));
    if (index >= 0) {
      this.users = this.users.map(item => item.id === mapped.id ? mapped : item);
    }
  }

  private mapUser(user: ApiUser, index: number): User {
    const name = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() || user.email;
    return {
      id: user.id,
      name,
      email: user.email,
      role: this.adminUserService.getPrimaryRole(user),
      status: this.adminUserService.getStatus(user),
      joined: this.formatDate(user.createdDate),
      initial: this.getInitials(name),
      color: this.colors[index % this.colors.length]
    };
  }

  private formatDate(value?: string): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
  }
}
