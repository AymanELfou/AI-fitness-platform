import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ClubService } from '../../../core/services/club.service';
import { Club } from '../../../core/models/club.model';

@Component({
  selector: 'app-club-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule],
  templateUrl: './club-layout.component.html',
  styleUrl: './club-layout.component.scss'
})
export class ClubLayoutComponent implements OnInit {

  authService = inject(AuthService);
  clubService = inject(ClubService);
  fb = inject(FormBuilder);
  
  sidebarOpen = true;

  isProfileModalOpen = false;
  clubProfileForm!: FormGroup;
  currentClub: Club | null = null;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.clubProfileForm = this.fb.group({
      clubName: ['', Validators.required],
      localisation: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(0)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.loadClubProfile();
  }

  loadClubProfile() {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club) => {
          this.currentClub = club;
          this.clubProfileForm.patchValue({
            clubName: club.clubName,
            localisation: club.localisation,
            capacity: club.capacity,
            contactEmail: club.contactEmail,
            phone: club.phone
          });
        },
        error: (err) => console.error('Failed to load club profile', err)
      });
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
  }

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  saveProfile() {
    if (this.clubProfileForm.invalid || !this.currentClub?.id) return;
    
    this.isLoading = true;
    this.clubService.updateClub(this.currentClub.id, this.clubProfileForm.value).subscribe({
      next: (updatedClub) => {
        this.isLoading = false;
        this.currentClub = updatedClub;
        this.closeProfileModal();
        this.showNotification('Club profile updated successfully!', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Failed to update club profile.', 'error');
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 4000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }
}
