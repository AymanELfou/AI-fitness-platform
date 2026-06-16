import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StatCard {
  label: string; value: string; sub: string; trend: string; up: boolean; icon: string; color: string;
}

interface ActivityItem {
  type: string; message: string; time: string; icon: string; color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stats: StatCard[] = [
    { label: 'Total Users',    value: '1,240', sub: 'Clients, Coaches, Clubs', trend: '+8.2%',  up: true,  icon: '👥', color: '#2563EB' },
    { label: 'Active Clubs',   value: '48',    sub: '3 pending approval',      trend: '+12%',   up: true,  icon: '🏠', color: '#7C3AED' },
    { label: 'Total Coaches',  value: '186',   sub: '22 new this month',       trend: '+5.4%',  up: true,  icon: '⭐', color: '#059669' },
    { label: 'Monthly Revenue',value: '$24.8K',sub: 'Subscription income',     trend: '+18.3%', up: true,  icon: '💰', color: '#F59E0B' },
    { label: 'Active Sessions',value: '394',   sub: 'Live workouts now',       trend: '-2.1%',  up: false, icon: '⚡', color: '#EF4444' },
    { label: 'Avg. Retention', value: '87%',   sub: 'Monthly churn: 13%',      trend: '+3.1%',  up: true,  icon: '📊', color: '#0891B2' },
  ];

  recentActivity: ActivityItem[] = [
    { type: 'signup',   message: 'New club registered: FitZone Casablanca', time: '2 min ago',  icon: '🏠', color: '#7C3AED' },
    { type: 'payment',  message: 'Subscription renewed — Premium Plan',      time: '15 min ago', icon: '💳', color: '#059669' },
    { type: 'coach',    message: 'Coach Marcus Chen approved',               time: '1 hour ago', icon: '⭐', color: '#2563EB' },
    { type: 'flag',     message: 'Community post flagged for review',        time: '2 hours ago',icon: '🚩', color: '#EF4444' },
    { type: 'signup',   message: 'New user registered: Alex Johnson',        time: '3 hours ago',icon: '👤', color: '#0891B2' },
    { type: 'payment',  message: 'Club Pro Plan payment received — $299',    time: '5 hours ago',icon: '💰', color: '#F59E0B' },
    { type: 'alert',    message: 'Server CPU spike detected — 92%',          time: '6 hours ago',icon: '⚠️', color: '#EF4444' },
  ];

  topClubs = [
    { name: 'FitZone Casablanca', members: 312, revenue: '$4,200', growth: '+12%', up: true  },
    { name: 'PowerHouse Rabat',   members: 287, revenue: '$3,800', growth: '+8%',  up: true  },
    { name: 'EliteFit Marrakech', members: 241, revenue: '$3,100', growth: '+5%',  up: true  },
    { name: 'GymPro Agadir',      members: 198, revenue: '$2,700', growth: '-2%',  up: false },
  ];

  planDistribution = [
    { plan: 'Enterprise', count: 8,  pct: 65, color: '#2563EB' },
    { plan: 'Pro',        count: 22, pct: 45, color: '#7C3AED' },
    { plan: 'Basic',      count: 18, pct: 30, color: '#059669' },
  ];
}
