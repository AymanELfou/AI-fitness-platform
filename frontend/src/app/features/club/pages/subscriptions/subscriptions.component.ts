import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonnementService, Abonnement } from '../../../../core/services/abonnement.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ClubService } from '../../../../core/services/club.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  abonnements: Abonnement[] = [];
  clubId?: number;

  isModalOpen = false;
  currentAbonnement: Partial<Abonnement> = {};

  constructor(
    private abonnementService: AbonnementService,
    private authService: AuthService,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club) => {
          if (club && club.id) {
            this.clubId = club.id;
            this.loadAbonnements();
          }
        }
      });
    }
  }

  loadAbonnements() {
    if (this.clubId) {
      this.abonnementService.getByClubId(this.clubId).subscribe({
        next: (data) => this.abonnements = data
      });
    }
  }

  openEditModal(abonnement: Abonnement) {
    this.currentAbonnement = { ...abonnement };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveAbonnement() {
    if (this.currentAbonnement.id) {
      this.abonnementService.update(this.currentAbonnement.id, this.currentAbonnement as any).subscribe({
        next: (updated) => {
          const idx = this.abonnements.findIndex(a => a.id === updated.id);
          if (idx !== -1) {
            this.abonnements[idx] = updated;
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update abonnement', err);
          alert('Error updating subscription');
        }
      });
    }
  }
}