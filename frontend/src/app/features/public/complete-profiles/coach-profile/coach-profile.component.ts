import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { coach } from '../../../../core/models/coach.model';

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.component.html',
  styleUrls: ['../shared-forms.scss']
})
export class CoachProfileComponent implements OnInit {
  coachForm!: FormGroup;
  fileName: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.coachForm = this.fb.group({
      experience: ['', [Validators.required, Validators.min(0)]],
      speciality: ['', Validators.required],
      tariff: ['', [Validators.required, Validators.min(0)]],
      availability: ['', Validators.required],
      rating: [5],
      certification: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.fileName = file.name;
      this.coachForm.patchValue({ certification: file });
      this.coachForm.get('certification')?.markAsTouched();
    } else if (file) {
      alert('Only PDF files are supported.');
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.coachForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() {
    if (this.coachForm.valid) {
      const coachData: coach = this.coachForm.value;
      console.log('Validated Coach Payload:', coachData);
    }
  }
}