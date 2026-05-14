import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedRole: string = 'Coach';

  roles = [
    { id: 'Admin', name: 'Admin', icon: '🛡️', description: 'System management & high-level reporting.' },
    { id: 'Club', name: 'Club', icon: '🏁', description: 'Manage organizations, venues, and events.' },
    { id: 'Coach', name: 'Coach', icon: '🏋️', description: 'Create workouts and track client progress.' },
    { id: 'Client', name: 'Client', icon: '👤', description: 'Train, compete, and track your metrics.' }
  ];

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['Coach']
    });
  }

  selectRole(roleId: string): void {
    this.selectedRole = roleId;
    this.registerForm.patchValue({ role: roleId });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log('Sending data to backend...', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log('Registration Successful!', res);
          alert('Account created successfully!');
        },
        error: (err: any) => {
          console.error('Registration Failed!', err);
          alert('Error during registration. Check console.');
        }
      });
    }
  }
}