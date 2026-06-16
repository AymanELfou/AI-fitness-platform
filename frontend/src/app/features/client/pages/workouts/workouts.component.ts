import {
  Component, OnDestroy, OnInit, signal, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─── Types ─── */
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
  estTime: number; // minutes
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

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /* ── Program Selector ── */
  activeProgramId = signal<number>(1);

  programs: WorkoutProgram[] = [
    {
      id: 1,
      phase: 'PHASE 2: HYPERTROPHY',
      week: 3,
      name: 'Upper/Lower Hypertrophy Split',
      estTime: 65,
      exercises: [
        {
          id: 101, name: 'Barbell Bench Press',
          image: 'images/exercises/bench_press.png',
          muscles: ['Chest', 'Triceps', 'Front Delt'], muscleColor: '#2563EB',
          targetSets: 4, targetReps: '8–10', rpe: 8,
          coachNote: '"Keep your shoulder blades retracted. Control the eccentric — 3 seconds down, explode up."',
          expanded: true, restSeconds: 90, restRemaining: null,
          sets: [
            { index: 1, prev: '185 × 10', lbs: 185, reps: 10, status: 'done'    },
            { index: 2, prev: '185 × 10', lbs: 185, reps: null, status: 'active' },
            { index: 3, prev: '185 × 8',  lbs: null, reps: null, status: 'pending'},
            { index: 4, prev: '185 × 8',  lbs: null, reps: null, status: 'pending'},
          ]
        },
        {
          id: 102, name: 'Barbell Overhead Press',
          image: 'images/exercises/overhead_press.png',
          muscles: ['Shoulders', 'Triceps', 'Traps'], muscleColor: '#7C3AED',
          targetSets: 4, targetReps: '6–8', rpe: 8,
          coachNote: '"Brace your core like a plank. Do not overarch your lower back — squeeze glutes at lockout."',
          expanded: false, restSeconds: 120, restRemaining: null,
          sets: [
            { index: 1, prev: '115 × 8', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '115 × 8', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '115 × 6', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '115 × 6', lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 103, name: 'Incline Dumbbell Press',
          image: 'images/exercises/incline_press.png',
          muscles: ['Upper Chest', 'Front Delt'], muscleColor: '#0891B2',
          targetSets: 3, targetReps: '10–12', rpe: 7,
          coachNote: '"Set bench at 30–45°. Drive dumbbells up and slightly inward for maximum upper pec tension."',
          expanded: false, restSeconds: 75, restRemaining: null,
          sets: [
            { index: 1, prev: '70 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '70 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '70 × 10', lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 104, name: 'Lateral Raise',
          image: 'images/exercises/lateral_raise.png',
          muscles: ['Lateral Deltoid'], muscleColor: '#059669',
          targetSets: 4, targetReps: '15–20', rpe: 7,
          coachNote: '"Lead with your elbows, not hands. Stop at shoulder height to avoid trap engagement."',
          expanded: false, restSeconds: 60, restRemaining: null,
          sets: [
            { index: 1, prev: '20 × 18', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '20 × 17', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '20 × 15', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '20 × 15', lbs: null, reps: null, status: 'pending' },
          ]
        }
      ]
    },
    {
      id: 2,
      phase: 'PHASE 2: STRENGTH',
      week: 1,
      name: 'Lower Body Power Block',
      estTime: 70,
      exercises: [
        {
          id: 201, name: 'Barbell Back Squat',
          image: 'images/exercises/squat.png',
          muscles: ['Quadriceps', 'Glutes', 'Core'], muscleColor: '#7C3AED',
          targetSets: 5, targetReps: '5', rpe: 9,
          coachNote: '"Break at hips and knees simultaneously. Drive through the whole foot — heels especially."',
          expanded: true, restSeconds: 180, restRemaining: null,
          sets: [
            { index: 1, prev: '225 × 5', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '225 × 5', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '225 × 5', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '225 × 5', lbs: null, reps: null, status: 'pending' },
            { index: 5, prev: '225 × 5', lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 202, name: 'Romanian Deadlift',
          image: 'images/exercises/rdl.png',
          muscles: ['Hamstrings', 'Glutes', 'Lower Back'], muscleColor: '#DC2626',
          targetSets: 4, targetReps: '8–10', rpe: 8,
          coachNote: '"Push hips back as far as possible. Feel the hamstring stretch before driving forward."',
          expanded: false, restSeconds: 90, restRemaining: null,
          sets: [
            { index: 1, prev: '185 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '185 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '185 × 8',  lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '185 × 8',  lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 203, name: 'Leg Press Machine',
          image: 'images/exercises/leg_press.png',
          muscles: ['Quads', 'Glutes', 'Hamstrings'], muscleColor: '#D97706',
          targetSets: 4, targetReps: '12–15', rpe: 7,
          coachNote: '"Place feet high and wide for glute bias, or low and close for quad dominance."',
          expanded: false, restSeconds: 90, restRemaining: null,
          sets: [
            { index: 1, prev: '360 × 15', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '360 × 14', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '360 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '360 × 12', lbs: null, reps: null, status: 'pending' },
          ]
        }
      ]
    },
    {
      id: 3,
      phase: 'PHASE 1: VOLUME',
      week: 2,
      name: 'Shoulder Sculptor Protocol',
      estTime: 50,
      exercises: [
        {
          id: 301, name: 'Seated Overhead Press',
          image: 'images/exercises/overhead_press.png',
          muscles: ['All Three Delt Heads'], muscleColor: '#0891B2',
          targetSets: 4, targetReps: '8–10', rpe: 8,
          coachNote: '"Press to full lockout. Keep elbows slightly in front of body at bottom to protect the joint."',
          expanded: true, restSeconds: 90, restRemaining: null,
          sets: [
            { index: 1, prev: '95 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '95 × 9',  lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '95 × 8',  lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '95 × 8',  lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 302, name: 'Lateral Raise Superset',
          image: 'images/exercises/lateral_raise.png',
          muscles: ['Lateral Deltoid'], muscleColor: '#059669',
          targetSets: 4, targetReps: '15 + 12 + 10', rpe: 8,
          coachNote: '"Cable lateral first for constant tension, then finish with dumbbells to failure."',
          expanded: false, restSeconds: 60, restRemaining: null,
          sets: [
            { index: 1, prev: '20 × 15', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '20 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '18 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '18 × 10', lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 303, name: 'Arnold Press',
          image: 'images/exercises/overhead_press.png',
          muscles: ['Front & Lateral Delt'], muscleColor: '#7C3AED',
          targetSets: 3, targetReps: '10–12', rpe: 7,
          coachNote: '"Rotate palms outward as you press — this hits both anterior and lateral delt with wider ROM."',
          expanded: false, restSeconds: 75, restRemaining: null,
          sets: [
            { index: 1, prev: '40 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '40 × 11', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '40 × 10', lbs: null, reps: null, status: 'pending' },
          ]
        }
      ]
    },
    {
      id: 4,
      phase: 'PHASE 3: VOLUME',
      week: 4,
      name: 'Chest Blast — Volume Phase',
      estTime: 55,
      exercises: [
        {
          id: 401, name: 'Flat Barbell Bench Press',
          image: 'images/exercises/bench_press.png',
          muscles: ['Mid Chest', 'Triceps'], muscleColor: '#DC2626',
          targetSets: 5, targetReps: '8–12', rpe: 8,
          coachNote: '"3-second eccentric on every rep. Touch chest gently — no bounce. Maximum time under tension."',
          expanded: true, restSeconds: 90, restRemaining: null,
          sets: [
            { index: 1, prev: '185 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '185 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '185 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '185 × 8',  lbs: null, reps: null, status: 'pending' },
            { index: 5, prev: '185 × 8',  lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 402, name: 'Incline Dumbbell Press',
          image: 'images/exercises/incline_press.png',
          muscles: ['Upper Chest', 'Front Delt'], muscleColor: '#2563EB',
          targetSets: 4, targetReps: '10–15', rpe: 7,
          coachNote: '"Full ROM — lower until you feel a deep pec stretch, then explode upward with control."',
          expanded: false, restSeconds: 75, restRemaining: null,
          sets: [
            { index: 1, prev: '65 × 14', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '65 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '65 × 10', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '65 × 10', lbs: null, reps: null, status: 'pending' },
          ]
        },
        {
          id: 403, name: 'Cable Chest Fly',
          image: 'images/exercises/cable_fly.png',
          muscles: ['Inner Chest', 'Pec Minor'], muscleColor: '#059669',
          targetSets: 4, targetReps: '12–15', rpe: 7,
          coachNote: '"Hug a tree motion — soft bend in elbows. Squeeze hard at center for full pec contraction."',
          expanded: false, restSeconds: 60, restRemaining: null,
          sets: [
            { index: 1, prev: '40 × 15', lbs: null, reps: null, status: 'pending' },
            { index: 2, prev: '40 × 14', lbs: null, reps: null, status: 'pending' },
            { index: 3, prev: '40 × 12', lbs: null, reps: null, status: 'pending' },
            { index: 4, prev: '40 × 12', lbs: null, reps: null, status: 'pending' },
          ]
        }
      ]
    }
  ];

  /* ── Reactive state ── */
  get currentProgram(): WorkoutProgram {
    return this.programs.find(p => p.id === this.activeProgramId()) ?? this.programs[0];
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

  /* ── Session Timer ── */
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
    if (isPlatformBrowser(this.platformId)) {
      this.toggleTimer();
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    clearInterval(this.restInterval);
  }

  /* ── Interactions ── */
  selectProgram(id: number): void {
    this.activeProgramId.set(id);
    clearInterval(this.restInterval);
  }

  toggleExpand(ex: Exercise): void { ex.expanded = !ex.expanded; }

  markDone(ex: Exercise, set: ExSet): void {
    if (set.status === 'done') { set.status = 'pending'; return; }
    if (set.lbs === null) set.lbs = parseInt(set.prev) || 0;
    if (set.reps === null) set.reps = parseInt(set.prev.split('×')[1]) || 0;
    set.status = 'done';

    // Activate next set
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
}
