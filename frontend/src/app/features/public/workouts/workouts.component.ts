import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Exercise } from '../../../core/models/exercise.model';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss'
})
export class WorkoutsComponent implements OnInit {

  activeFilter = signal<string>('All Exercises');
  activeDifficulty = signal<string>('ALL');
  searchQuery = signal<string>('');

  filters = ['All Exercises', 'LEGS', 'CHEST', 'BACK', 'ARMS', 'SHOULDERS', 'CORE', 'CARDIO', 'FULL_BODY'];
  difficulties = ['EASY', 'MEDIUM', 'HARD'];

  exercises = signal<Exercise[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');

  filteredExercises = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.exercises().filter(ex => {
      const matchesSearch = !query || 
        ex.name.toLowerCase().includes(query) || 
        (ex.musclesGroup && ex.musclesGroup.toLowerCase().includes(query));
      return matchesSearch;
    });
  });

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.loadAdminExercises();
  }

  loadAdminExercises(): void {
    this.loading.set(true);
    this.error.set('');
    this.exerciseService.getAdminExercises().subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load admin exercises. Please try again.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadExercisesByMuscleGroup(muscleGroup: string): void {
    this.loading.set(true);
    this.error.set('');
    this.exerciseService.getByMusclesGroup(muscleGroup).subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load exercises for ${muscleGroup}. Please try again.`);
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadExercisesByDifficulty(difficulty: string): void {
    this.loading.set(true);
    this.error.set('');
    this.exerciseService.getByDifficulty(difficulty).subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load exercises for difficulty ${difficulty}. Please try again.`);
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
    this.activeDifficulty.set('ALL'); // Reset difficulty filter when changing muscle group
    if (filter === 'All Exercises') {
      this.loadAdminExercises();
    } else {
      this.loadExercisesByMuscleGroup(filter);
    }
  }

  onDifficultyChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.activeDifficulty.set(value);
    if (value === 'ALL') {
      const muscleFilter = this.activeFilter();
      if (muscleFilter === 'All Exercises') {
        this.loadAdminExercises();
      } else {
        this.loadExercisesByMuscleGroup(muscleFilter);
      }
    } else {
      this.activeFilter.set('All Exercises'); // Reset muscle group tab when selecting difficulty
      this.loadExercisesByDifficulty(value);
    }
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  getCategoryColor(category: string): string {
    if (!category) return '#6366f1';
    const colors: Record<string, string> = {
      'LEGS': '#7c3aed',
      'CHEST': '#0891b2',
      'BACK': '#059669',
      'ARMS': '#d97706',
      'SHOULDERS': '#dc2626',
      'CORE': '#4f46e5',
      'CARDIO': '#f43f5e',
      'FULL_BODY': '#10b981'
    };
    return colors[category.toUpperCase()] || '#6366f1';
  }
}
