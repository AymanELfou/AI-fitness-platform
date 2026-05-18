import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IClubProfile } from '../profile-models';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './club-profile.component.html',
  styleUrls: ['../shared-forms.scss']
})
export class ClubProfileComponent implements OnInit {
  clubForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clubForm = this.fb.group({
      clubName: ['', Validators.required],
      address: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.clubForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() {
    if (this.clubForm.valid) {
      const clubData: IClubProfile = this.clubForm.value;
      console.log('Validated Club Payload:', clubData);
    }
  }
}