import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CoachService, CoachProfileResponse } from '../../../../core/services/coach.service';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {
  
  coaches: CoachProfileResponse[] = [];
  clubId?: number;
  
  // Navigation & View States
  viewMode: 'list' | 'add' = 'list';
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Forms
  coachForm!: FormGroup;
  editForm!: FormGroup;

  // Modals & Action states
  isEditModalOpen = false;
  isDeleteConfirmOpen = false;
  coachToEdit: CoachProfileResponse | null = null;
  coachToDelete: CoachProfileResponse | null = null;

  constructor(
    private coachService: CoachService,
    private clubService: ClubService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club) => {
          if (club && club.id) {
            this.clubId = club.id;
            this.loadCoaches();
          }
        },
        error: (err) => {
          this.showNotification('Error loading club profile details.', 'error');
        }
      });
    }
  }

  initForms() {
    // Add Coach form (User account + Coach Profile details)
    this.coachForm = this.fb.group({
      // Account Details
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // Profile Details
      speciality: ['Bodybuilding', Validators.required],
      experience: [1, [Validators.required, Validators.min(0)]],
      certifications: ['', Validators.required],
      tariff: [100, [Validators.required, Validators.min(0)]]
    });

    // Edit Coach Profile form
    this.editForm = this.fb.group({
      speciality: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      certifications: ['', Validators.required],
      tariff: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadCoaches() {
    if (this.clubId) {
      this.isLoading = true;
      this.coachService.getCoachesByClubId(this.clubId).subscribe({
        next: (data) => {
          this.coaches = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.showNotification('Failed to fetch coaches list.', 'error');
        }
      });
    }
  }

  setViewMode(mode: 'list' | 'add') {
    this.viewMode = mode;
    if (mode === 'add') {
      this.coachForm.reset({
        speciality: 'Bodybuilding',
        experience: 1,
        tariff: 100
      });
    }
  }

  // CREATE COACH ACCOUNT AND PROFILE
  onAddCoachSubmit() {
    if (this.coachForm.invalid) {
      this.coachForm.markAllAsTouched();
      return;
    }

    if (!this.clubId) {
      this.showNotification('Club ID not identified. Action cancelled.', 'error');
      return;
    }

    this.isLoading = true;
    const formVal = this.coachForm.value;

    // 1. Register user first (role ROLE_COACH)
    const registerPayload = {
      firstname: formVal.firstname,
      lastname: formVal.lastname,
      email: formVal.email,
      password: formVal.password,
      role: 'ROLE_COACH'
    };

    this.authService.register(registerPayload).subscribe({
      next: (createdUser: any) => {
        const userId = createdUser?.id;
        if (!userId) {
          this.isLoading = false;
          this.showNotification('Failed to retrieve coach user ID.', 'error');
          return;
        }

        // 2. Create Coach Profile associated with this Club
        const profilePayload = {
          experience: formVal.experience,
          certifications: formVal.certifications,
          speciality: formVal.speciality,
          tariff: formVal.tariff,
          clubId: this.clubId
        };

        this.coachService.createCoachProfile(userId, profilePayload).subscribe({
          next: () => {
            this.isLoading = false;
            this.showNotification('Coach account and profile created successfully!', 'success');
            this.setViewMode('list');
            this.loadCoaches();
          },
          error: (profileErr) => {
            this.isLoading = false;
            this.showNotification('User created, but coach profile setup failed: ' + (profileErr.error?.message || profileErr.message), 'error');
          }
        });
      },
      error: (registerErr) => {
        this.isLoading = false;
        this.showNotification('Registration failed: ' + (registerErr.error?.message || registerErr.message), 'error');
      }
    });
  }

  // EDIT ACTIONS
  openEditModal(coach: CoachProfileResponse) {
    this.coachToEdit = coach;
    this.editForm.patchValue({
      speciality: coach.speciality,
      experience: coach.experience,
      certifications: coach.certifications,
      tariff: coach.tariff
    });
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.coachToEdit = null;
  }

  onEditCoachSubmit() {
    if (this.editForm.invalid || !this.coachToEdit) {
      return;
    }

    this.isLoading = true;
    const formVal = this.editForm.value;
    const updatePayload = {
      experience: formVal.experience,
      certifications: formVal.certifications,
      speciality: formVal.speciality,
      tariff: formVal.tariff,
      clubId: this.clubId
    };

    this.coachService.updateCoachProfile(this.coachToEdit.id, updatePayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeEditModal();
        this.showNotification('Coach profile updated successfully!', 'success');
        this.loadCoaches();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Update failed: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  // DELETE ACTIONS
  confirmDeleteCoach(coach: CoachProfileResponse) {
    this.coachToDelete = coach;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm() {
    this.isDeleteConfirmOpen = false;
    this.coachToDelete = null;
  }

  executeDeleteCoach() {
    if (!this.coachToDelete) return;

    this.isLoading = true;
    this.coachService.deleteCoachProfile(this.coachToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeDeleteConfirm();
        this.showNotification('Coach profile removed successfully!', 'success');
        this.loadCoaches();
      },
      error: (err) => {
        this.isLoading = false;
        this.showNotification('Deletion failed: ' + (err.error?.message || err.message), 'error');
      }
    });
  }

  // HELPERS
  showNotification(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 4000);
    } else {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }

  isFieldInvalid(fieldName: string, form: FormGroup = this.coachForm): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}