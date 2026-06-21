import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { client } from '../../../../core/models/client.model';
import { ClientService } from '../../../../core/services/client.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss', '../shared-forms.scss']
})
export class ClientProfileComponent implements OnInit {
  clientForm!: FormGroup;
  showSuccessAlert = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(12)]],
      poids: ['', [Validators.required, Validators.min(30)]],
      taille: ['', [Validators.required, Validators.min(100)]],
      but: ['', Validators.required],
      niveau: ['', Validators.required],
      subscriptionPlan: [{ value: 'FREEMIUM', disabled: true }, Validators.required],
      imc: [{ value: '', disabled: true }]
    });

    this.clientForm.valueChanges.subscribe(() => this.calculateImc());
  }

  calculateImc(): void {
    const poids = this.clientForm.get('poids')?.value;
    const taille = this.clientForm.get('taille')?.value;

    if (poids && taille && taille > 0) {
      const imcVal = poids / ((taille / 100) * (taille / 100));
      this.clientForm.get('imc')?.setValue(imcVal.toFixed(2), { emitEvent: false });
    } else {
      this.clientForm.get('imc')?.setValue('', { emitEvent: false });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.getRawValue();
      const clientData: Partial<client> = {
        age: formValue.age,
        poids: formValue.poids,
        taille: formValue.taille,
        but: formValue.but,
        niveau: formValue.niveau,
        subscriptionPlan: formValue.subscriptionPlan
      };

      const user = this.authService.currentUser();

      if (!user || !user.id) {
        alert('User not authenticated properly.');
        return;
      }

      this.clientService.createClient(user.id, clientData).subscribe({
        next: (createdClient) => {
          console.log('Client profile created successfully:', createdClient);
          this.showSuccessAlert = true;
        },
        error: (err) => {
          console.error('Error creating client profile:', err);
          alert('An error occurred while completing the client profile.');
        }
      });
    }
  }

  closeAlertAndNavigate() {
    this.showSuccessAlert = false;
    this.router.navigate(['/dashboard']);
  }
}