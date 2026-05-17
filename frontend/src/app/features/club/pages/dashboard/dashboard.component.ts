import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  currentDate = new Date();

  stats = [
    {
      label: 'Membres Actifs',
      value: '1 248',
      change: '+12%',
      positive: true,
      icon: 'members',
      color: '#6366f1',
      bg: '#eef2ff'
    },
    {
      label: 'Coachs',
      value: '24',
      change: '+2',
      positive: true,
      icon: 'coaches',
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      label: 'Abonnements Actifs',
      value: '986',
      change: '+8%',
      positive: true,
      icon: 'subscriptions',
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    {
      label: 'Revenus du Mois',
      value: '24 500 €',
      change: '+18%',
      positive: true,
      icon: 'revenue',
      color: '#ef4444',
      bg: '#fef2f2'
    }
  ];

  recentMembers = [
    { name: 'Amina Benali', plan: 'Premium', joined: 'Il y a 1 jour', initials: 'AB', color: '#6366f1', status: 'Actif' },
    { name: 'Lucas Martin', plan: 'Standard', joined: 'Il y a 2 jours', initials: 'LM', color: '#10b981', status: 'Actif' },
    { name: 'Sofia Reyes', plan: 'Premium', joined: 'Il y a 3 jours', initials: 'SR', color: '#f59e0b', status: 'En attente' },
    { name: 'Karim Ouali', plan: 'Basic', joined: 'Il y a 5 jours', initials: 'KO', color: '#ef4444', status: 'Actif' },
    { name: 'Chloé Dupont', plan: 'Standard', joined: 'Il y a 6 jours', initials: 'CD', color: '#8b5cf6', status: 'Actif' },
  ];

  topCoaches = [
    { name: 'Thomas Leroy', specialty: 'Musculation', members: 52, rating: 4.9, initials: 'TL', color: '#6366f1' },
    { name: 'Nadia Kaci', specialty: 'Yoga & Pilates', members: 48, rating: 4.8, initials: 'NK', color: '#10b981' },
    { name: 'Mehdi Bougra', specialty: 'Cardio & HIIT', members: 41, rating: 4.7, initials: 'MB', color: '#f59e0b' },
    { name: 'Julie Petit', specialty: 'Nutrition', members: 37, rating: 4.9, initials: 'JP', color: '#ef4444' },
  ];

  revenueMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  revenueData = [14200, 16800, 18500, 17200, 21000, 22300, 19800, 23100, 20500, 22900, 24100, 24500];

  maxRevenue = Math.max(...this.revenueData);

  getBarHeight(value: number): number {
    return (value / this.maxRevenue) * 100;
  }

  planDistribution = [
    { label: 'Premium', value: 45, color: '#6366f1' },
    { label: 'Standard', value: 35, color: '#10b981' },
    { label: 'Basic', value: 20, color: '#f59e0b' },
  ];

  alerts = [
    { message: '3 abonnements expirent cette semaine', type: 'warning', icon: 'alert' },
    { message: 'Nouveau membre inscrit : Amina Benali', type: 'info', icon: 'user' },
    { message: 'Objectif mensuel atteint à 92%', type: 'success', icon: 'check' },
  ];
}
