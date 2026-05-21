import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programs',
  imports: [CommonModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  programs = [
    { title: 'Force & Hypertrophie', client: 'Lucas Martin', weeks: 12, level: 'Intermédiaire', sessions: 4, color: '#6366f1', icon: '💪', status: 'Actif' },
    { title: 'Perte de Poids Cardio', client: 'Amina Benali', weeks: 8, level: 'Débutant', sessions: 3, color: '#10b981', icon: '🔥', status: 'Actif' },
    { title: 'Endurance & Performance', client: 'Sofia Reyes', weeks: 16, level: 'Avancé', sessions: 5, color: '#f59e0b', icon: '🏃', status: 'Actif' },
    { title: 'Yoga Thérapeutique', client: 'Chloé Dupont', weeks: 6, level: 'Débutant', sessions: 3, color: '#8b5cf6', icon: '🧘', status: 'Actif' },
    { title: 'Musculation Full Body', client: 'Thomas Bernard', weeks: 10, level: 'Débutant', sessions: 3, color: '#0ea5e9', icon: '🏋️', status: 'En cours' },
    { title: 'Réathlétisation', client: 'Karim Ouali', weeks: 6, level: 'Intermédiaire', sessions: 2, color: '#ef4444', icon: '🩺', status: 'En pause' },
  ];
}
