import {
  Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { Exercise as ApiExercise } from '../../../../core/models/exercise.model';
import { ProgrammeResponse, ProgrammeService } from '../../../../core/services/programme.service';

export type SetStatus = 'pending' | 'active' | 'done';

export interface ExSet {
  index: number;
  prev: string;
  lbs: number | null;
  reps: number | null;
  status: SetStatus;
}

export interface Exercise {
  id: number;
  name: string;
  image: string;
  muscles: string[];
  muscleColor: string;
  targetSets: number;
  targetReps: string;
  rpe: number;
  sets: ExSet[];
  coachNote: string;
  expanded: boolean;
  restSeconds: number;
  restRemaining: number | null;
}

export interface WorkoutProgram {
  id: number;
  phase: string;
  week: number;
  name: string;
  estTime: number;
  exercises: Exercise[];
}

@Component({
  selector: 'app-client-workouts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss'
})
export class WorkoutsComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthService,
    private clientService: ClientService,
    private programmeService: ProgrammeService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute
  ) {}

  activeProgramId = signal<number>(0);
  isLoading = false;
  errorMessage = '';

  programs: WorkoutProgram[] = [];

  get currentProgram(): WorkoutProgram {
    return this.programs.find(p => p.id === this.activeProgramId()) ?? this.programs[0] ?? {
      id: 0,
      phase: 'PROGRAMME',
      week: 1,
      name: 'Aucun programme',
      estTime: 0,
      exercises: []
    };
  }

  get completedSets(): number {
    return this.currentProgram.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter(s => s.status === 'done').length, 0);
  }

  get totalSets(): number {
    return this.currentProgram.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  }

  get completedExercises(): number {
    return this.currentProgram.exercises.filter(ex => ex.sets.every(s => s.status === 'done')).length;
  }

  get remainingExercises(): number {
    return this.currentProgram.exercises.length - this.completedExercises;
  }

  get completedVolume(): number {
    let vol = 0;
    this.currentProgram.exercises.forEach(ex => {
      ex.sets.filter(s => s.status === 'done').forEach(s => {
        vol += (s.lbs ?? 0) * (s.reps ?? 0);
      });
    });
    return vol;
  }

  get progressPercent(): number {
    return this.totalSets === 0 ? 0 : Math.round((this.completedSets / this.totalSets) * 100);
  }

  sessionSeconds = 0;
  timerRunning = false;
  private timerInterval: any = null;
  private restInterval: any = null;

  get timerDisplay(): string {
    const m = Math.floor(this.sessionSeconds / 60).toString().padStart(2, '0');
    const s = (this.sessionSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  toggleTimer(): void {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
    } else {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => this.sessionSeconds++, 1000);
    }
  }

  ngOnInit(): void {
    this.loadWorkouts();
    if (isPlatformBrowser(this.platformId)) {
      this.toggleTimer();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    clearInterval(this.restInterval);
  }

  loadWorkouts(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.errorMessage = 'Client connecte introuvable.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClientByUserId(user.id).pipe(
      switchMap(client => forkJoin({
        programmes: this.programmeService.getAll(),
        exercises: this.exerciseService.getAllExercises()
      }).pipe(
        switchMap(result => of({ clientId: client.id, ...result }))
      ))
    ).subscribe({
      next: ({ clientId, programmes, exercises }) => {
        const assignedProgrammes = programmes
          .filter(programme => programme.clientIds?.includes(clientId ?? -1));
        this.programs = assignedProgrammes.map((programme, index) => this.mapProgramme(programme, exercises, index));
        
        const queryProgramId = this.route.snapshot.queryParamMap.get('programId');
        if (queryProgramId) {
          const id = Number(queryProgramId);
          if (this.programs.some(p => p.id === id)) {
            this.activeProgramId.set(id);
          } else {
            this.activeProgramId.set(this.programs[0]?.id ?? 0);
          }
        } else {
          this.activeProgramId.set(this.programs[0]?.id ?? 0);
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos workouts depuis l API.';
        this.isLoading = false;
      }
    });
  }

  selectProgram(id: number): void {
    this.activeProgramId.set(id);
    clearInterval(this.restInterval);
  }

  toggleExpand(ex: Exercise): void { ex.expanded = !ex.expanded; }

  markDone(ex: Exercise, set: ExSet): void {
    if (set.status === 'done') { set.status = 'pending'; return; }
    if (set.lbs === null) set.lbs = parseInt(set.prev, 10) || 0;
    if (set.reps === null) set.reps = parseInt(set.prev.split('x')[1], 10) || 0;
    set.status = 'done';

    const next = ex.sets.find(s => s.status === 'pending');
    if (next) {
      next.status = 'active';
      this.startRest(ex);
    }
  }

  startRest(ex: Exercise): void {
    clearInterval(this.restInterval);
    ex.restRemaining = ex.restSeconds;
    this.restInterval = setInterval(() => {
      if (ex.restRemaining !== null && ex.restRemaining > 0) {
        ex.restRemaining--;
      } else {
        clearInterval(this.restInterval);
        ex.restRemaining = null;
      }
    }, 1000);
  }

  restDisplay(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  getRestFraction(ex: Exercise): number {
    if (ex.restRemaining === null) return 0;
    return ex.restRemaining / ex.restSeconds;
  }

  trackBySet(_: number, s: ExSet): number { return s.index; }
  trackByEx(_: number, e: Exercise): number { return e.id; }

  isExerciseDone(ex: Exercise): boolean {
    return ex.sets.length > 0 && ex.sets.every(s => s.status === 'done');
  }

  getPhaseName(): string {
    return this.currentProgram.phase.split(':')[0].trim();
  }

  private mapProgramme(programme: ProgrammeResponse, allExercises: ApiExercise[], index: number): WorkoutProgram {
    const exerciseIds = programme.exerciseIds ?? [];
    const exercises = exerciseIds
      .map(id => allExercises.find(ex => ex.id === id))
      .filter((ex): ex is ApiExercise => Boolean(ex))
      .map((exercise, exerciseIndex) => this.mapExercise(exercise, exerciseIndex));

    return {
      id: programme.id,
      phase: `PHASE ${index + 1}: ${programme.objective || 'TRAINING'}`.toUpperCase(),
      week: this.getCurrentWeek(programme),
      name: programme.title,
      estTime: Math.round(exercises.reduce((sum, ex) => sum + Math.max(ex.restSeconds / 60, 1) * ex.targetSets, 0) || (programme.duration * 30)),
      exercises
    };
  }

  private mapExercise(exercise: ApiExercise, index: number): Exercise {
    const targetSets = Math.max(exercise.series || 1, 1);
    return {
      id: exercise.id,
      name: exercise.name,
      image: exercise.imageUrl || 'images/exercises/bench_press.png',
      muscles: this.splitMuscles(exercise.musclesGroup),
      muscleColor: this.getMuscleColor(index),
      targetSets,
      targetReps: `${exercise.repetition || 10}`,
      rpe: this.getRpe(exercise.difficulty),
      coachNote: exercise.description || 'Respectez la technique et gardez un tempo controle.',
      expanded: index === 0,
      restSeconds: this.getRestSeconds(exercise.difficulty),
      restRemaining: null,
      sets: Array.from({ length: targetSets }, (_, setIndex) => ({
        index: setIndex + 1,
        prev: '-',
        lbs: null,
        reps: null,
        status: setIndex === 0 ? 'active' : 'pending'
      }))
    };
  }

  private getCurrentWeek(programme: ProgrammeResponse): number {
    if (!programme.createdAt || !programme.duration) return 1;
    const days = Math.max(0, Date.now() - new Date(programme.createdAt).getTime()) / 86400000;
    return Math.max(1, Math.min(programme.duration, Math.ceil(days / 7)));
  }

  private splitMuscles(value?: string): string[] {
    if (!value) return ['General'];
    return value.split(/[,&/]/).map(part => part.trim()).filter(Boolean);
  }

  private getRpe(difficulty: ApiExercise['difficulty']): number {
    return { EASY: 6, MEDIUM: 7, HARD: 9 }[difficulty] ?? 7;
  }

  private getRestSeconds(difficulty: ApiExercise['difficulty']): number {
    return { EASY: 60, MEDIUM: 90, HARD: 150 }[difficulty] ?? 90;
  }

  private getMuscleColor(index: number): string {
    return ['#2563EB', '#7C3AED', '#0891B2', '#059669', '#DC2626', '#D97706'][index % 6];
  }
}
