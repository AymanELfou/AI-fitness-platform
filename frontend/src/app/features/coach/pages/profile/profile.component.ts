import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CoachService, CoachProfileResponse } from '../../../../core/services/coach.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  coachService = inject(CoachService);
  isEditing = false;
  saved = false;

  profile: CoachProfileResponse | null = null;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.coachService.getCoachByUserId(user.id).subscribe({
        next: (coach) => {
          this.profile = coach;
        },
        error: (err) => console.error('Failed to load coach profile', err)
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.saved = false;
  }

  saveProfile() {
    if (this.profile && this.profile.id) {
      const request = {
        experience: Number(this.profile.experience) || 0,
        certifications: this.profile.certifications,
        speciality: this.profile.speciality,
        tariff: this.profile.tariff,
        clubId: this.profile.clubId
      };

      this.coachService.updateCoachProfile(this.profile.id, request).subscribe({
        next: (updated) => {
          this.profile = updated;
          this.isEditing = false;
          this.saved = true;
          setTimeout(() => this.saved = false, 3000);
        },
        error: (err) => console.error('Failed to update coach profile', err)
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.ngOnInit(); // reload to discard changes
  }
}
