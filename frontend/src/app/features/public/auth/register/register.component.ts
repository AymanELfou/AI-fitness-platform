import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User, Role } from '../../../../core/models/user.model';

export function fullNameValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  const parts = value.split(/\s+/);
  if (parts.length < 2 || parts[0].length === 0 || parts[1].length === 0) {
    return { invalidFullName: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedRole: string = 'Club';
  showPaymentPage: boolean = false;
  showSuccessModal: boolean = false;
  showClientSuccessAlert: boolean = false;
  showPassword: boolean = false;
  tempLoginCredentials: any = null;

  roles = [
    { id: 'Club', name: 'Club', icon: '🏁', description: 'Manage organizations, venues, and events.' },
    { id: 'Client', name: 'Client', icon: '👤', description: 'Train, compete, and track your metrics.' }
  ];

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, fullNameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['Club']
    });
  }

  selectRole(roleId: string): void {
    this.selectedRole = roleId;
    this.registerForm.patchValue({ role: roleId });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const nameParts = formValue.fullName.trim().split(' ');
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(' ') || ' ';

      const roleMapping: { [key: string]: string } = {
        'Club': 'ROLE_CLUB',
        'Client': 'ROLE_CLIENT'
      };

      const payload = {
        firstname,
        lastname,
        email: formValue.email,
        password: formValue.password,
        role: roleMapping[formValue.role] || 'ROLE_CLIENT'
      };

      this.authService.register(payload).subscribe({
        next: () => {
          this.tempLoginCredentials = { email: payload.email, password: payload.password, role: payload.role };

          if (payload.role === 'ROLE_CLUB') {
            this.showPaymentPage = true;
          } else {
            this.showClientSuccessAlert = true;
          }
        },
        error: (err: any) => {
          console.error('Registration Failed!', err);
          const detail = err.error?.message || err.error || err.message || '';
          const isDuplicate = detail.toLowerCase().includes('duplicate') || detail.toLowerCase().includes('already exist') || (err.status === 500);
          if (isDuplicate) {
            alert('Erreur lors de la création du compte : Cet e-mail est déjà utilisé ou une erreur interne est survenue.');
          } else {
            alert('Erreur lors de la création du compte : ' + detail);
          }
        }
      });
    }
  }

  completePayment(): void {
    this.showPaymentPage = false;
    this.showSuccessModal = true;
  }

  completeProfile(): void {
    this.showSuccessModal = false;
    this.executeLogin(this.tempLoginCredentials?.role);
  }

  completeClientProfile(): void {
    this.showClientSuccessAlert = false;
    this.executeLogin(this.tempLoginCredentials?.role);
  }

  private executeLogin(role: string): void {
    if (!this.tempLoginCredentials) return;
    this.authService.login({ email: this.tempLoginCredentials.email, password: this.tempLoginCredentials.password }).subscribe({
      next: () => {
        if (role === 'ROLE_CLUB') {
          this.router.navigate(['/complete-profile'], { queryParams: { role: 'club' } });
        } else if (role === 'ROLE_CLIENT') {
          this.router.navigate(['/complete-profile'], { queryParams: { role: 'client' } });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.error('Auto-login Failed!', err);
        alert('Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter.');
      }
    });
  }
}