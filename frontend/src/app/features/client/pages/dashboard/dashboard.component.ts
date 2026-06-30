import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { ProgressService } from '../../../../core/services/progress.service';
import { ProgrammeService } from '../../../../core/services/programme.service';
import { CoachService } from '../../../../core/services/coach.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userName: string = 'Client';
  firstName: string = 'Client';

  stats = [
    { title: 'Workouts Completed', value: '0', icon: '🔥', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Active Programs', value: '0', icon: '📅', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Current Streak', value: '0 Days', icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Calories Burned', value: '0', icon: '💪', color: 'text-green-500', bg: 'bg-green-500/10' }
  ];

  nextWorkout = {
    title: 'Hybrid Explosion - Day 3',
    duration: '45 Min',
    intensity: 'High',
    type: 'Strength & Conditioning',
    time: 'Today, 18:00',
    coach: 'Unassigned Coach',
    coachSpecialty: 'Fitness'
  };

  recentActivities: any[] = [];
  
  showNewGoalModal = false;
  showLogWeightModal = false;
  isSavingGoal = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private progressService: ProgressService,
    private programmeService: ProgrammeService,
    private coachService: CoachService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.firstName = user.firstname?.trim() || user.email?.split('@')[0] || 'Client';
      let nameStr = '';
      if (user.firstname) nameStr += user.firstname;
      if (user.lastname) nameStr += (nameStr ? ' ' : '') + user.lastname;
      this.userName = nameStr.trim() || user.email || 'Client';
      if (user.id) {
        this.loadDashboardData(user.id);
      }
    }
  }

  loadDashboardData(userId: number): void {
    this.clientService.getClientByUserId(userId).pipe(
      switchMap(client => {
        const clientId = client.id ?? 0;
        
        // Fetch coach info if client has a coach
        if (client.coachID) {
          this.coachService.getCoachById(client.coachID).subscribe({
            next: coach => {
              const coachName = coach.userName || 'Your Coach';
              this.nextWorkout.coach = coachName;
              this.nextWorkout.coachSpecialty = coach.speciality || 'Fitness';
              this.nextWorkout.type = coach.speciality || 'Strength & Conditioning';
            }
          });
        }

        // Fetch programs
        this.programmeService.getAll().subscribe(programs => {
          const clientPrograms = programs.filter(p => p.clientIds?.includes(clientId));
          this.stats[1].value = clientPrograms.length.toString();
        });

        // Fetch progress entries
        return this.progressService.getByClientId(clientId);
      })
    ).subscribe({
      next: progress => {
        const records = progress || [];
        this.stats[0].value = records.length.toString();
        
        // Mocking streak and calories based on progress length since we don't have these explicitly
        this.stats[2].value = records.length > 0 ? '1 Days' : '0 Days';
        this.stats[3].value = (records.length * 300).toLocaleString();

        this.recentActivities = records.slice(-3).reverse().map(p => {
          const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
          return {
            name: 'Progress Update',
            type: 'Recorded',
            date: dateStr,
            duration: p.performance ? `Perf: ${p.performance}` : '-'
          };
        });
      },
      error: () => {
        console.error('Failed to load dashboard data');
      }
    });
  }

  closeModals(): void {
    this.showNewGoalModal = false;
    this.showLogWeightModal = false;
  }

  saveGoal(): void {
    this.isSavingGoal = true;
    const user = this.authService.currentUser();
    if (!user || !user.id) {
       this.isSavingGoal = false;
       return;
    }
    
    // Simulate an API call to save a goal
    setTimeout(() => {
      this.isSavingGoal = false;
      this.closeModals();
      // Optimistically push a recent activity
      this.recentActivities.unshift({
        name: 'New Goal Set',
        type: 'Goal',
        date: 'Just now',
        duration: '-'
      });
      if (this.recentActivities.length > 3) this.recentActivities.pop();
    }, 800);
  }

  saveWeight(): void {
    this.closeModals();
    this.recentActivities.unshift({
        name: 'Weight Logged',
        type: 'Tracking',
        date: 'Just now',
        duration: '-'
    });
    if (this.recentActivities.length > 3) this.recentActivities.pop();
  }

  logout(): void {
    this.authService.logout();
  }
}
