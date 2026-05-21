import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  authService = inject(AuthService);
  isEditing = false;
  saved = false;

  profile = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '+212 6 12 34 56 78',
    speciality: 'Musculation & HIIT',
    experience: '8 ans',
    bio: 'Coach certifié passionné par la transformation physique et mentale. Spécialisé en musculation, HIIT et nutrition sportive.',
    certifications: 'BPJEPS APT, Certified Personal Trainer (NSCA), Nutrition Sportive Level 2',
    city: 'Casablanca',
    availability: 'Lun-Ven : 08h-18h | Sam : 09h-13h'
  };

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      this.profile.firstname = user.firstname || '';
      this.profile.lastname = user.lastname || '';
      this.profile.email = user.email || '';
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.saved = false;
  }

  saveProfile() {
    this.isEditing = false;
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  cancelEdit() {
    this.isEditing = false;
  }
}
