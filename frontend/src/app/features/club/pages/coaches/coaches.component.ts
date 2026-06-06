import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Coach {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  activeMembers: number;
  rating: number;
  isBanned: boolean;
}

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {
  
  coaches: Coach[] = [
    { id: 1, name: 'Thomas Leroy', specialty: 'Bodybuilding & Strength', avatar: '', activeMembers: 52, rating: 4.9, isBanned: false },
    { id: 2, name: 'Nadia Kaci', specialty: 'Yoga & Pilates', avatar: '', activeMembers: 48, rating: 4.8, isBanned: false },
    { id: 3, name: 'Mehdi Bougra', specialty: 'Cardio & HIIT Expert', avatar: '', activeMembers: 41, rating: 4.7, isBanned: false },
    { id: 4, name: 'Julie Petit', specialty: 'Nutrition Specialist', avatar: '', activeMembers: 37, rating: 4.9, isBanned: false }
  ];

  isModalOpen = false;
  isEditMode = false;
  currentCoach: Coach = this.getEmptyCoach();

  constructor() {}
  ngOnInit(): void {}

  getEmptyCoach(): Coach {
    return { id: 0, name: '', specialty: '', avatar: '', activeMembers: 0, rating: 5.0, isBanned: false };
  }

  openModal(coach?: Coach) {
    if (coach) {
      this.isEditMode = true;
      this.currentCoach = Object.assign({}, coach);
    } else {
      this.isEditMode = false;
      this.currentCoach = this.getEmptyCoach();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveCoach() {
    if (!this.currentCoach.name || !this.currentCoach.specialty) return;

    if (this.isEditMode) {
      const index = this.coaches.findIndex(c => c.id === this.currentCoach.id);
      if (index !== -1) this.coaches[index] = this.currentCoach;
    } else {
      this.currentCoach.id = Date.now();
      this.coaches.unshift(this.currentCoach);
    }
    this.closeModal();
  }

  toggleBanCoach(coach: Coach) {
    coach.isBanned = !coach.isBanned;
  }

  deleteCoach(id: number) {
    this.coaches = this.coaches.filter(c => c.id !== id);
  }
}