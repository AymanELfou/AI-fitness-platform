import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CoachService, CoachProfileResponse } from '../../../../core/services/coach.service';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AvailabilityService } from '../../../../core/services/availability.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Weekday structure for availability UI
export interface WeekDay {
  key: string;
  label: string;
  selected: boolean;
  startTime: string;
  endTime: string;
}

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
  
  searchTerm: string = '';

  get filteredCoaches(): CoachProfileResponse[] {
    if (!this.searchTerm.trim()) {
      return this.coaches;
    }
    const lowerSearch = this.searchTerm.toLowerCase();
    return this.coaches.filter(c => 
      (c.userName && c.userName.toLowerCase().includes(lowerSearch)) ||
      (c.speciality && c.speciality.toLowerCase().includes(lowerSearch))
    );
  }
  
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

  // Availability days
  weekDays: WeekDay[] = [
    { key: 'MON', label: 'Monday',    selected: false, startTime: '08:00', endTime: '17:00' },
    { key: 'TUE', label: 'Tuesday',   selected: false, startTime: '08:00', endTime: '17:00' },
    { key: 'WED', label: 'Wednesday', selected: false, startTime: '08:00', endTime: '17:00' },
    { key: 'THU', label: 'Thursday',  selected: false, startTime: '08:00', endTime: '17:00' },
    { key: 'FRI', label: 'Friday',    selected: false, startTime: '08:00', endTime: '17:00' },
    { key: 'SAT', label: 'Saturday',  selected: false, startTime: '09:00', endTime: '14:00' },
    { key: 'SUN', label: 'Sunday',    selected: false, startTime: '09:00', endTime: '14:00' },
  ];

  constructor(
    private coachService: CoachService,
    private clubService: ClubService,
    private authService: AuthService,
    private availabilityService: AvailabilityService,
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
        error: () => {
          this.showNotification('Error loading club profile details.', 'error');
        }
      });
    }
  }

  initForms() {
    this.coachForm = this.fb.group({
      firstname:      ['', [Validators.required, Validators.minLength(2)]],
      lastname:       ['', [Validators.required, Validators.minLength(2)]],
      email:          ['', [Validators.required, Validators.email]],
      password:       ['', [Validators.required, Validators.minLength(8)]],
      speciality:     ['Bodybuilding', Validators.required],
      experience:     [1, [Validators.required, Validators.min(0)]],
      certifications: ['', Validators.required],
      tariff:         [100, [Validators.required, Validators.min(0)]]
    });

    this.editForm = this.fb.group({
      speciality:     ['', Validators.required],
      experience:     [0, [Validators.required, Validators.min(0)]],
      certifications: ['', Validators.required],
      tariff:         [0, [Validators.required, Validators.min(0)]]
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
        error: () => {
          this.isLoading = false;
          this.showNotification('Failed to fetch coaches list.', 'error');
        }
      });
    }
  }

  setViewMode(mode: 'list' | 'add') {
    this.viewMode = mode;
    if (mode === 'add') {
      this.coachForm.reset({ speciality: 'Bodybuilding', experience: 1, tariff: 100 });
      this.weekDays.forEach(d => {
        d.selected = false;
        d.startTime = (d.key === 'SAT' || d.key === 'SUN') ? '09:00' : '08:00';
        d.endTime   = (d.key === 'SAT' || d.key === 'SUN') ? '14:00' : '17:00';
      });
    }
  }

  toggleDay(day: WeekDay) {
    day.selected = !day.selected;
  }

  get selectedDays(): WeekDay[] {
    return this.weekDays.filter(d => d.selected);
  }

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

    const registerPayload = {
      firstname: formVal.firstname,
      lastname:  formVal.lastname,
      email:     formVal.email,
      password:  formVal.password,
      role:      'ROLE_COACH'
    };

    this.authService.register(registerPayload).subscribe({
      next: (createdUser: any) => {
        const userId = createdUser?.id;
        if (!userId) {
          this.isLoading = false;
          this.showNotification('Failed to retrieve coach user ID.', 'error');
          return;
        }

        const profilePayload = {
          experience:     formVal.experience,
          certifications: formVal.certifications,
          speciality:     formVal.speciality,
          tariff:         formVal.tariff,
          clubId:         this.clubId
        };

        this.coachService.createCoachProfile(userId, profilePayload).subscribe({
          next: (createdCoach: any) => {
            const coachId: number = createdCoach?.id;

            if (coachId && this.selectedDays.length > 0) {
              this.createAvailabilities(coachId);
            } else {
              this.isLoading = false;
              this.showNotification('Coach account and profile created successfully!', 'success');
              this.setViewMode('list');
              this.loadCoaches();
            }
          },
          error: (profileErr) => {
            this.isLoading = false;
            this.showNotification(
              'User created, but coach profile setup failed: ' +
              (profileErr.error?.message || profileErr.message),
              'error'
            );
          }
        });
      },
      error: (registerErr) => {
        this.isLoading = false;
        this.showNotification(
          'Registration failed: ' + (registerErr.error?.message || registerErr.message),
          'error'
        );
      }
    });
  }

  private createAvailabilities(coachId: number) {
    const today  = new Date();
    const monday = new Date(today);
    // Next Monday
    const daysUntilMonday = (1 + 7 - today.getDay()) % 7 || 7;
    monday.setDate(today.getDate() + daysUntilMonday);

    const dayOffsets: Record<string, number> = {
      MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6
    };

    const requests = this.selectedDays.map(day => {
      const offset  = dayOffsets[day.key] ?? 0;
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + offset);

      const [sh, sm] = day.startTime.split(':').map(Number);
      const [eh, em] = day.endTime.split(':').map(Number);

      const startDt = new Date(dayDate);
      startDt.setHours(sh, sm, 0, 0);
      const endDt = new Date(dayDate);
      endDt.setHours(eh, em, 0, 0);

      return this.availabilityService.create({
        coachId,
        startTime: startDt.toISOString().slice(0, 19),
        endTime:   endDt.toISOString().slice(0, 19)
      }).pipe(catchError(() => of(null)));
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.isLoading = false;
        this.showNotification('Coach account, profile and availability created successfully! 🎉', 'success');
        this.setViewMode('list');
        this.loadCoaches();
      },
      error: () => {
        this.isLoading = false;
        this.showNotification('Coach created but some availability slots failed.', 'error');
        this.setViewMode('list');
        this.loadCoaches();
      }
    });
  }

  openEditModal(coach: CoachProfileResponse) {
    this.coachToEdit = coach;
    this.editForm.patchValue({
      speciality:     coach.speciality,
      experience:     coach.experience,
      certifications: coach.certifications,
      tariff:         coach.tariff
    });
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.coachToEdit = null;
  }

  onEditCoachSubmit() {
    if (this.editForm.invalid || !this.coachToEdit) return;

    this.isLoading = true;
    const formVal = this.editForm.value;

    this.coachService.updateCoachProfile(this.coachToEdit.id, {
      experience:     formVal.experience,
      certifications: formVal.certifications,
      speciality:     formVal.speciality,
      tariff:         formVal.tariff,
      clubId:         this.clubId
    }).subscribe({
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