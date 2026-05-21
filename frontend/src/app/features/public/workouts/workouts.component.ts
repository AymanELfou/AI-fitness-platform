import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Exercise {
  id: number;
  title: string;
  category: 'Strength' | 'Cardio' | 'Mobility' | 'Yoga';
  duration: string;
  level: string;
  image: string;
  featured?: boolean;
}

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss'
})
export class WorkoutsComponent {

  activeFilter = signal<string>('All Exercises');
  searchQuery = signal<string>('');

  filters = ['All Exercises', 'Strength', 'Cardio', 'Mobility', 'Yoga'];

  exercises: Exercise[] = [
    { id: 1, title: 'Explosive Back Squats', category: 'Strength', duration: '45 MIN', level: 'Advanced', image: '/images/exercise_squats.png' },
    { id: 2, title: 'HIIT Sprints', category: 'Cardio', duration: '30 MIN', level: 'Intermediate', image: '/images/exercise_hiit.png' },
    { id: 3, title: 'Dynamic Hip Flow & Spine Decompression', category: 'Mobility', duration: '12 MIN', level: 'Beginner', image: '/images/exercise_hip_flow.png', featured: true },
    { id: 4, title: 'Vinyasa Peak Pose', category: 'Yoga', duration: '60 MIN', level: 'Intermediate', image: '/images/exercise_yoga.png' },
    { id: 5, title: 'Upper Body Hypertrophy', category: 'Strength', duration: '50 MIN', level: 'Intermediate', image: '/images/exercise_dumbbell.png' },
    { id: 6, title: 'Post-Run Release', category: 'Mobility', duration: '20 MIN', level: 'Beginner', image: '/images/exercise_foam_roll.png' },
  ];

  filteredExercises = computed(() => {
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase();
    return this.exercises.filter(ex => {
      const matchesFilter = filter === 'All Exercises' || ex.category === filter;
      const matchesSearch = !query || ex.title.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  });

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Strength': '#7c3aed',
      'Cardio': '#0891b2',
      'Mobility': '#059669',
      'Yoga': '#d97706',
    };
    return colors[category] || '#6366f1';
  }
}
