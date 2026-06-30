import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { switchMap, of, forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { ProgrammeResponse, ProgrammeService } from '../../../../core/services/programme.service';
import { ProgressService } from '../../../../core/services/progress.service';

export type ProgramStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export interface Program {
  id: number;
  name: string;
  description: string;
  image: string;
  status: ProgramStatus;
  statusMeta: string;
  progress: number;
  level: string;
  tags: string[];
  daysPerWeek: number;
  duration: string;
  muscleGroup: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent implements OnInit {
  activeFilter = signal<string>('All');
  filters = ['All'];
  isLoading = false;
  errorMessage = '';

  programs: Program[] = [];

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private programmeService: ProgrammeService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrograms();
  }

  viewProgram(id: number): void {
    this.router.navigate(['/client/workouts'], { queryParams: { programId: id } });
  }

  loadPrograms(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.errorMessage = 'Client connecte introuvable.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClientByUserId(user.id).pipe(
      switchMap(client => {
        return forkJoin({
          clientId: of(client.id),
          programmes: this.programmeService.getAll(),
          progressRecords: this.progressService.getByClientId(client.id ?? 0)
        });
      })
    ).subscribe({
      next: ({ clientId, programmes, progressRecords }) => {
        const recordsCount = progressRecords?.length || 0;
        this.programs = programmes
          .filter(programme => programme.clientIds?.includes(clientId ?? -1))
          .map((programme, index) => this.mapProgramme(programme, index, recordsCount));
        this.filters = ['All', ...Array.from(new Set(this.programs.map(p => p.muscleGroup).filter(Boolean)))];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos programmes depuis l API.';
        this.isLoading = false;
      }
    });
  }

  get filteredPrograms(): Program[] {
    const f = this.activeFilter();
    return f === 'All' ? this.programs : this.programs.filter(p => p.muscleGroup === f);
  }

  get totalCount() { return this.programs.length; }
  get activeCount() { return this.programs.filter(p => p.status === 'ACTIVE').length; }
  get completedCount() { return this.programs.filter(p => p.status === 'COMPLETED').length; }
  get upcomingCount() { return this.programs.filter(p => p.status === 'UPCOMING').length; }

  setFilter(f: string): void { this.activeFilter.set(f); }

  getStatusClass(s: ProgramStatus): string {
    return { ACTIVE: 'badge-active', UPCOMING: 'badge-upcoming', COMPLETED: 'badge-completed' }[s];
  }

  getProgressColor(s: ProgramStatus): string {
    return { ACTIVE: '#2563EB', UPCOMING: '#94A3B8', COMPLETED: '#22C55E' }[s];
  }

  getActionIcon(s: ProgramStatus): string {
    return { ACTIVE: 'play', UPCOMING: 'eye', COMPLETED: 'refresh' }[s];
  }

  private mapProgramme(programme: ProgrammeResponse, index: number, recordsCount: number = 0): Program {
    const muscleGroup = this.toTitleCase(programme.objective || 'General');
    const status = this.resolveStatus(programme, index);
    
    const expectedWorkouts = (programme.duration || 4) * Math.max(Math.min(programme.exerciseIds?.length ?? 3, 6), 1);
    let calculatedProgress = Math.round((recordsCount / expectedWorkouts) * 100);
    calculatedProgress = Math.min(Math.max(calculatedProgress, 0), 100);
    
    const progress = status === 'COMPLETED' ? 100 : status === 'UPCOMING' ? 0 : calculatedProgress;

    return {
      id: programme.id,
      name: programme.title,
      description: programme.description || 'Programme assigne par votre coach.',
      image: this.getProgramImage(muscleGroup),
      status,
      statusMeta: this.getStatusMeta(status, programme.duration, progress),
      progress,
      level: programme.level || 'All levels',
      tags: [muscleGroup, programme.isGeneratedByAI ? 'AI Generated' : 'Coach Plan'],
      daysPerWeek: Math.max(Math.min(programme.exerciseIds?.length ?? 3, 6), 1),
      duration: `${programme.duration || 1} Weeks`,
      muscleGroup
    };
  }

  private resolveStatus(programme: ProgrammeResponse, index: number): ProgramStatus {
    if (!programme.isValidatedByCoach) return 'UPCOMING';
    if (index === 0) return 'ACTIVE';
    return 'UPCOMING';
  }

  private getStatusMeta(status: ProgramStatus, duration: number, progress: number): string {
    if (status === 'COMPLETED') return 'Completed';
    if (status === 'UPCOMING') return 'Assigned';
    const currentWeek = Math.max(1, Math.ceil((progress / 100) * (duration || 1)));
    return `Week ${currentWeek} of ${duration || 1}`;
  }

  private getProgramImage(muscleGroup: string): string {
    const group = muscleGroup.toLowerCase();
    if (group.includes('lower') || group.includes('leg')) return 'images/program_lower_body.png';
    if (group.includes('shoulder')) return 'images/program_shoulders.png';
    if (group.includes('chest')) return 'images/program_chest.png';
    return 'images/program_upper_body.png';
  }

  private toTitleCase(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
