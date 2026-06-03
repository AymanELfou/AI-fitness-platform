import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName: string = 'Ayman';
  
  stats = [
    { title: 'Workouts Completed', value: '24', icon: '🔥', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Active Programs', value: '2', icon: '📅', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Current Streak', value: '5 Days', icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Calories Burned', value: '12,450', icon: '💪', color: 'text-green-500', bg: 'bg-green-500/10' }
  ];

  nextWorkout = {
    title: 'Hybrid Explosion - Day 3',
    duration: '45 Min',
    intensity: 'High',
    type: 'Strength & Conditioning',
    time: 'Today, 18:00',
    coach: 'Marjorie Touzins'
  };

  recentActivities = [
    { name: 'Precision Core', type: 'Completed', date: 'Yesterday', duration: '30 Min' },
    { name: 'Pure Strength', type: 'Completed', date: 'Mon, 12th', duration: '60 Min' },
    { name: 'Recovery Flow', type: 'Completed', date: 'Sun, 11th', duration: '20 Min' }
  ];
}
