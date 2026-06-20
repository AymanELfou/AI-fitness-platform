import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { club } from '../../../../core/models/club.model';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './club-profile.component.html',
  styleUrls: ['../shared-forms.scss']
})
export class ClubProfileComponent implements OnInit {
  clubForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clubForm = this.fb.group({
      clubName: ['', Validators.required],
      localisation: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subscriptionPlan: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.clubForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() {
    if (this.clubForm.valid) {
      const formValue = this.clubForm.value;
      const clubData: Partial<club> = {
        clubName: formValue.clubName,
        localisation: formValue.localisation,
        capacity: formValue.capacity,
        contactEmail: formValue.contactEmail,
        phone: formValue.phone,
        subscriptionPlan: formValue.subscriptionPlan
      };
      const user = this.authService.currentUser();
      
      if (!user || !user.id) {
        alert('User not authenticated properly.');
        return;
      }

      this.clubService.createClub(user.id, clubData).subscribe({
        next: (createdClub) => {
          console.log('Club created successfully:', createdClub);
          alert('Club profile created successfully!');
          this.router.navigate(['/club/dashboard']);
        },
        error: (err) => {
          console.error('Error creating club:', err);
          alert('An error occurred while creating the club profile.');
        }
      });
    }
  }
}