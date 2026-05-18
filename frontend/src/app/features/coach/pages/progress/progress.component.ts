import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent {
  clients = [
    { name: 'Amina Benali', initials: 'AB', color: '#6366f1', weight: '-4.2 kg', strength: '+18%', cardio: '+25%', sessions: 24, goal: 'Perte de poids' },
    { name: 'Lucas Martin', initials: 'LM', color: '#10b981', weight: '+3.8 kg', strength: '+32%', cardio: '+10%', sessions: 18, goal: 'Prise de masse' },
    { name: 'Sofia Reyes', initials: 'SR', color: '#f59e0b', weight: '-2.1 kg', strength: '+15%', cardio: '+40%', sessions: 31, goal: 'Endurance' },
    { name: 'Chloé Dupont', initials: 'CD', color: '#8b5cf6', weight: '-1.5 kg', strength: '+8%', cardio: '+15%', sessions: 28, goal: 'Yoga & Souplesse' },
  ];
}
