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
  searchQuery = signal<string>('');

  filters = ['All Exercises', 'LEGS', 'CHEST', 'BACK', 'ARMS', 'SHOULDERS', 'CORE', 'CARDIO', 'FULL_BODY'];

  exercises = signal<Exercise[]>([]);

  filteredExercises = computed(() => {
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase();
    return this.exercises().filter(ex => {
      const matchesFilter = filter === 'All Exercises' || ex.musclesGroup === filter;
      const matchesSearch = !query || ex.name.toLowerCase().includes(query) || (ex.musclesGroup && ex.musclesGroup.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  });

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.exerciseService.getAllExercises().subscribe({
      next: (data) => {
        this.exercises.set(data);
      },
      error: (err) => {
        console.error('Failed to load exercises', err);
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);
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
