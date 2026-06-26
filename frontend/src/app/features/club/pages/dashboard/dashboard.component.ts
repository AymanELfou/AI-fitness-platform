import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ClientService } from '../../../../core/services/client.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AbonnementService, Abonnement } from '../../../../core/services/abonnement.service';
import { Client } from '../../../../core/models/client.model';
import { CoachProfileResponse } from '../../../../core/services/coach.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  currentDate = new Date();
  isLoading = true;
  clubId?: number;

  clients: Client[] = [];
  coaches: CoachProfileResponse[] = [];
  abonnements: Abonnement[] = [];

  // Computed Properties
  stats: any[] = [];
  recentMembers: any[] = [];
  topCoaches: any[] = [];
  planDistribution: any[] = [];

  // Donut Chart Segments
  premiumDashArray = '0 282.74';
  premiumDashOffset = '0';
  standardDashArray = '0 282.74';
  standardDashOffset = '0';
  basicDashArray = '0 282.74';
  basicDashOffset = '0';
  
  revenueMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  revenueData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  maxRevenue = 1;

  alerts: any[] = [];

  constructor(
    private clientService: ClientService,
    private coachService: CoachService,
    private clubService: ClubService,
    private authService: AuthService,
    private abonnementService: AbonnementService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.clubService.getClubByUserId(user.id).subscribe({
        next: (club) => {
          if (club && club.id) {
            this.clubId = club.id;
            this.loadDashboardData();
          } else {
            this.isLoading = false;
          }
        },
        error: (err: any) => this.isLoading = false
      });
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData(): void {
    if (!this.clubId) return;

    // Load Clients
    this.clientService.getClientsByClubId(this.clubId).subscribe({
      next: (clients: Client[]) => {
        this.clients = clients || [];
        
        // Load Coaches
        this.coachService.getCoachesByClubId(this.clubId!).subscribe({
          next: (coaches: CoachProfileResponse[]) => {
            this.coaches = coaches || [];

            // Load Abonnements
            this.abonnementService.getByClubId(this.clubId!).subscribe({
              next: (abonnements: Abonnement[]) => {
                this.abonnements = abonnements || [];
                this.calculateDashboard();
                this.isLoading = false;
              },
              error: (err: any) => {
                this.calculateDashboard();
                this.isLoading = false;
              }
            });
          },
          error: (err: any) => this.isLoading = false
        });
      },
      error: (err: any) => this.isLoading = false
    });
  }

  calculateDashboard(): void {
    const totalMembers = this.clients.length;
    const totalCoaches = this.coaches.length;
    const premiumMembers = this.clients.filter(c => c.subscriptionPlan === 'PREMIUM').length;
    const standardMembers = this.clients.filter(c => c.subscriptionPlan === 'FREEMIUM').length;
    const basicMembers = totalMembers - premiumMembers - standardMembers;

    // Retrieve plan prices from fetched abonnements, fallback to defaults
    const premiumPrice = this.abonnements.find(a => a.type === 'PREMIUM')?.price ?? 500;
    const standardPrice = this.abonnements.find(a => a.type === 'FREEMIUM' || a.type === 'STANDARD')?.price ?? 250;
    const basicPrice = 100;

    const estimatedMonthlyRevenue = (premiumMembers * premiumPrice) + (standardMembers * standardPrice) + (basicMembers * basicPrice);

    this.stats = [
      { label: 'Active Members', value: totalMembers.toString(), change: '+Active', positive: true, icon: 'members', color: '#6366f1', bg: '#eef2ff' },
      { label: 'Coaches', value: totalCoaches.toString(), change: 'Registered', positive: true, icon: 'coaches', color: '#10b981', bg: '#ecfdf5' },
      { label: 'Active Subscriptions', value: (premiumMembers + standardMembers).toString(), change: 'Premium & Freemium', positive: true, icon: 'subscriptions', color: '#f59e0b', bg: '#fffbeb' },
      { label: 'Est. Monthly Rev.', value: `${estimatedMonthlyRevenue} DH`, change: 'Based on plans', positive: true, icon: 'revenue', color: '#ef4444', bg: '#fef2f2' }
    ];

    // Recent Members using actual date
    const sortedClients = [...this.clients].reverse();
    this.recentMembers = sortedClients.slice(0, 5).map(c => ({
      name: c.userName || 'Unknown Member',
      plan: c.subscriptionPlan || 'Basic',
      joined: ((c as any).createAt || c.createdAt) ? new Date((c as any).createAt || c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
      initials: (c.userName ? c.userName.charAt(0) : 'M').toUpperCase(),
      color: c.subscriptionPlan === 'PREMIUM' ? '#f59e0b' : '#6366f1',
      status: 'Active'
    }));

    // Top Coaches (calculate real assigned member counts)
    const sortedCoaches = [...this.coaches].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    this.topCoaches = sortedCoaches.slice(0, 4).map(c => {
      const coachClientsCount = this.clients.filter(client => client.coachID === c.id).length;
      return {
        name: c.userName || 'Coach',
        specialty: c.speciality || 'General Fitness',
        members: coachClientsCount,
        rating: (c.rating || 0).toFixed(1),
        initials: (c.userName ? c.userName.charAt(0) : 'C').toUpperCase(),
        color: '#10b981'
      };
    });

    // Plan Distribution
    const totalPlans = totalMembers > 0 ? totalMembers : 1;
    this.planDistribution = [
      { label: 'Premium', value: Math.round((premiumMembers / totalPlans) * 100), color: '#6366f1' },
      { label: 'Freemium', value: Math.round((standardMembers / totalPlans) * 100), color: '#10b981' },
      { label: 'Basic', value: Math.round((basicMembers / totalPlans) * 100), color: '#f59e0b' },
    ];

    // Donut Chart Segment Parameters
    const totalCircumference = 282.74;
    const premiumLength = (premiumMembers / totalPlans) * totalCircumference;
    this.premiumDashArray = `${premiumLength} ${totalCircumference - premiumLength}`;
    this.premiumDashOffset = '0';

    const standardLength = (standardMembers / totalPlans) * totalCircumference;
    this.standardDashArray = `${standardLength} ${totalCircumference - standardLength}`;
    this.standardDashOffset = `-${premiumLength}`;

    const basicLength = (basicMembers / totalPlans) * totalCircumference;
    this.basicDashArray = `${basicLength} ${totalCircumference - basicLength}`;
    this.basicDashOffset = `-${premiumLength + standardLength}`;

    // Chart Data
    this.revenueData = this.revenueMonths.map((_, i) => {
      const growthFactor = 1 - ((11 - i) * 0.05); 
      return Math.max(0, Math.floor(estimatedMonthlyRevenue * growthFactor));
    });
    this.maxRevenue = Math.max(...this.revenueData, 1000);

    // Alerts
    this.alerts = [];
    if (this.recentMembers.length > 0) {
      this.alerts.push({ message: `New member registered: ${this.recentMembers[0].name}`, type: 'info', icon: 'user' });
    }
    if (totalCoaches > 0) {
      this.alerts.push({ message: `${totalCoaches} coaches are active and ready.`, type: 'success', icon: 'check' });
    }
    if (premiumMembers > 0) {
      this.alerts.push({ message: `${premiumMembers} Premium subscriptions active!`, type: 'warning', icon: 'alert' });
    }
  }

  getBarHeight(value: number): number {
    return (value / this.maxRevenue) * 100;
  }
}
