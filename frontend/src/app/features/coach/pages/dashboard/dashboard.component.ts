import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class CoachDashboardComponent {

  currentDate = new Date();

  stats = [
    {
      label: 'Clients Actifs',
      value: '18',
      change: '+3',
      positive: true,
      icon: 'clients',
      color: '#6366f1',
      bg: '#eef2ff'
    },
    {
      label: 'Séances ce Mois',
      value: '64',
      change: '+12%',
      positive: true,
      icon: 'sessions',
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      label: 'Programmes Actifs',
      value: '7',
      change: '+2',
      positive: true,
      icon: 'programs',
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      label: 'Note Moyenne',
      value: '4.9 ⭐',
      change: '+0.1',
      positive: true,
      icon: 'rating',
      color: '#8b5cf6',
      bg: '#f5f3ff'
    }
  ];

  clients = [
    { name: 'Amina Benali', goal: 'Perte de poids', progress: 75, initials: 'AB', color: '#6366f1', status: 'Actif', nextSession: 'Demain 09h' },
    { name: 'Lucas Martin', goal: 'Prise de masse', progress: 60, initials: 'LM', color: '#10b981', status: 'Actif', nextSession: 'Lun 14h' },
    { name: 'Sofia Reyes', goal: 'Endurance', progress: 88, initials: 'SR', color: '#f59e0b', status: 'Actif', nextSession: 'Mer 10h' },
    { name: 'Karim Ouali', goal: 'Musculation', progress: 45, initials: 'KO', color: '#ef4444', status: 'En pause', nextSession: '-' },
    { name: 'Chloé Dupont', goal: 'Yoga & Souplesse', progress: 92, initials: 'CD', color: '#8b5cf6', status: 'Actif', nextSession: 'Ven 11h' },
  ];

  sessionsMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  sessionsData = [32, 38, 41, 36, 52, 58, 44, 61, 49, 56, 62, 64];
  maxSessions = Math.max(...this.sessionsData);

  getBarHeight(value: number): number {
    return (value / this.maxSessions) * 100;
  }

  todaySessions = [
    { time: '09:00', client: 'Amina Benali', type: 'Cardio HIIT', duration: '60 min', status: 'upcoming' },
    { time: '11:00', client: 'Lucas Martin', type: 'Musculation', duration: '90 min', status: 'upcoming' },
    { time: '14:00', client: 'Sofia Reyes', type: 'Endurance', duration: '60 min', status: 'done' },
    { time: '16:30', client: 'Chloé Dupont', type: 'Yoga Flow', duration: '60 min', status: 'upcoming' },
  ];

  alerts = [
    { message: 'Karim Ouali n\'a pas réalisé sa séance depuis 7 jours', type: 'warning', icon: 'alert' },
    { message: 'Nouvelle demande de coaching reçue', type: 'info', icon: 'user' },
    { message: 'Sofia Reyes a atteint son objectif hebdomadaire !', type: 'success', icon: 'check' },
  ];
}
