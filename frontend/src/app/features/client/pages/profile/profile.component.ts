import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ClientProfileComponent implements OnInit {

  isEditing = signal<boolean>(false);
  isSaving = false;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  user: any = null;
  client: Client | null = null;
  clientId: number | null = null;

  // Editable form data
  form: Partial<Client> = {
    age: 0,
    poids: 0,
    taille: 0,
    but: '',
    niveau: '',
  };

  goals = [
    { value: 'PERTE_DE_POIDS', label: 'Weight Loss', icon: '🔥' },
    { value: 'PRISE_DE_MASSE', label: 'Muscle Gain', icon: '💪' },
    { value: 'MAINTIEN', label: 'Maintain', icon: '⚖️' },
    { value: 'ENDURANCE', label: 'Endurance', icon: '🏃' },
    { value: 'FORCE', label: 'Strength', icon: '🏋️' },
  ];

  levels = [
    { value: 'DEBUTANT', label: 'Beginner' },
    { value: 'INTERMEDIAIRE', label: 'Intermediate' },
    { value: 'AVANCE', label: 'Advanced' },
  ];

  stats: { label: string; value: string; icon: string; color: string }[] = [];

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    if (this.user?.id) {
      this.loadClientProfile(this.user.id);
    } else {
      this.isLoading = false;
    }
  }

  loadClientProfile(userId: number): void {
    this.isLoading = true;
    this.clientService.getClientByUserId(userId).subscribe({
      next: (client) => {
        this.client = client;
        this.clientId = client.id ?? null;
        this.form = {
          age: client.age,
          poids: client.poids,
          taille: client.taille,
          but: client.but,
          niveau: client.niveau,
        };
        this.buildStats(client);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load your profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  buildStats(client: Client): void {
    const imc = client.imc ?? this.computeIMC(client.poids, client.taille);
    const imcCategory = this.getIMCCategory(imc);
    this.stats = [
      { label: 'BMI (IMC)', value: imc.toFixed(1), icon: '📊', color: '#2563EB' },
      { label: 'Weight', value: `${client.poids} kg`, icon: '⚖️', color: '#7C3AED' },
      { label: 'Height', value: `${client.taille} cm`, icon: '📏', color: '#059669' },
      { label: 'Status', value: imcCategory, icon: '🏷️', color: '#F59E0B' },
    ];
  }

  computeIMC(poids: number, taille: number): number {
    if (!taille || !poids) return 0;
    const tailleM = taille / 100;
    return poids / (tailleM * tailleM);
  }

  getIMCCategory(imc: number): string {
    if (imc < 18.5) return 'Underweight';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Overweight';
    return 'Obese';
  }

  startEditing(): void {
    this.isEditing.set(true);
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    if (this.client) {
      this.form = {
        age: this.client.age,
        poids: this.client.poids,
        taille: this.client.taille,
        but: this.client.but,
        niveau: this.client.niveau,
      };
    }
  }

  saveProfile(): void {
    if (!this.clientId) return;
    this.isSaving = true;
    this.errorMessage = '';

    this.clientService.updateClient(this.clientId, this.form).subscribe({
      next: (updated) => {
        this.client = updated;
        this.buildStats(updated);
        this.isEditing.set(false);
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully! 🎉';
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: () => {
        this.errorMessage = 'Failed to save. Please try again.';
        this.isSaving = false;
      }
    });
  }

  getGoalLabel(value: string): string {
    return this.goals.find(g => g.value === value)?.label ?? value;
  }

  getGoalIcon(value: string): string {
    return this.goals.find(g => g.value === value)?.icon ?? '🎯';
  }

  getLevelLabel(value: string): string {
    return this.levels.find(l => l.value === value)?.label ?? value;
  }

  getUserInitials(): string {
    const fn = this.user?.firstname ?? '';
    const ln = this.user?.lastname ?? '';
    return ((fn.charAt(0) || '') + (ln.charAt(0) || '')).toUpperCase() || 'U';
  }

  getFullName(): string {
    const fn = this.user?.firstname?.trim() ?? '';
    const ln = this.user?.lastname?.trim() ?? '';
    return [fn, ln].filter(Boolean).join(' ') || this.user?.email || 'User';
  }
}
