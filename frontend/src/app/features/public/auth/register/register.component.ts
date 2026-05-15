import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/user.model';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, public authService: AuthService,private router:Router) {
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
      const formValue = this.registerForm.value;
      
      // Split fullName to firstname and lastname
      const nameParts = formValue.fullName.trim().split(' ');
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(' ') || ' ';

      // Map UI role to backend Role enum
      const roleMapping: { [key: string]: string } = {
        'Admin': 'ROLE_ADMIN',
        'Club': 'ROLE_CLUB',
        'Coach': 'ROLE_COACH',
        'Client': 'ROLE_CLIENT'
      };

      const payload = {
        firstname,
        lastname,
        email: formValue.email,
        password: formValue.password,
        role: roleMapping[formValue.role] || 'ROLE_CLIENT'
      };

      console.log('Sending data to backend...', payload);
      this.authService.register(payload).subscribe({
        next: () => {
          console.log('Registration Successful!');
          // After successful registration, auto-login to get the token
          this.authService.login({ email: payload.email, password: payload.password }).subscribe({
            next: () => {
              alert('Compte créé et connecté avec succès !');
              //this.authService.redirectByRole();
              this.router.navigate(['/']);

            },
            error: (err: any) => {
              console.error('Auto-login Failed!', err);
              alert('Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter.');
            }
          });
        },
        error: (err: any) => {
          console.error('Registration Failed!', err);
          alert('Erreur lors de la création du compte. Vérifiez la console.');
        }
      });
    }
  }
}