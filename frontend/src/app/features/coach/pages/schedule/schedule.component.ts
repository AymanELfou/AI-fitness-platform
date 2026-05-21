import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  weekSessions = [
    [
      { time: '09:00', client: 'Amina Benali', type: 'HIIT', color: '#6366f1' },
      { time: '11:00', client: 'Lucas Martin', type: 'Muscu', color: '#10b981' },
    ],
    [
      { time: '10:00', client: 'Sofia Reyes', type: 'Cardio', color: '#f59e0b' },
    ],
    [
      { time: '14:00', client: 'Chloé Dupont', type: 'Yoga', color: '#8b5cf6' },
      { time: '16:30', client: 'Thomas Bernard', type: 'Cardio', color: '#0ea5e9' },
    ],
    [
      { time: '09:00', client: 'Amina Benali', type: 'Force', color: '#6366f1' },
    ],
    [
      { time: '11:00', client: 'Chloé Dupont', type: 'Flow', color: '#8b5cf6' },
      { time: '15:00', client: 'Lucas Martin', type: 'Muscu', color: '#10b981' },
    ],
    [], []
  ];
}
