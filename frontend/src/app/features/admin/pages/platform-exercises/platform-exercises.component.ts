import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { Exercise } from '../../../../core/models/exercise.model';

@Component({
  selector: 'app-platform-exercises',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platform-exercises.component.html',
  styleUrl: './platform-exercises.component.scss'
})
export class PlatformExercisesComponent implements OnInit {
  exercises: Exercise[] = [];
  isLoading = false;
  errorMessage = '';

  modalOpen = false;
  isEditing = false;
  currentExercise: Partial<Exercise> = this.getEmptyExercise();
  selectedFile: File | null = null;

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.loadExercises();
  }

  loadExercises() {
    this.isLoading = true;
    this.exerciseService.getAdminExercises().subscribe({
      next: (res) => {
        this.exercises = res;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des exercices de la plateforme';
        this.isLoading = false;
      }
    });
  }

  getEmptyExercise(): Partial<Exercise> {
    return { name: '', description: '', musclesGroup: '', difficulty: 'EASY', series: 3, repetition: 10, duration: 15, calories: 100, createdByRole: 'ADMIN' };
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentExercise = this.getEmptyExercise();
    this.selectedFile = null;
    this.modalOpen = true;
  }

  openEditModal(ex: Exercise) {
    this.isEditing = true;
    this.currentExercise = { ...ex };
    this.selectedFile = null;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentExercise.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveExercise() {
    if (this.isEditing && this.currentExercise.id) {
      this.exerciseService.updateExercise(this.currentExercise.id, this.currentExercise).subscribe({
        next: (updated) => {
          const idx = this.exercises.findIndex(e => e.id === updated.id);
          if (idx !== -1) this.exercises[idx] = updated;
          this.closeModal();
        },
        error: () => this.errorMessage = 'Erreur de modification'
      });
    } else {
      this.exerciseService.createExercise(this.currentExercise).subscribe({
        next: (created) => {
          this.exercises.unshift(created);
          this.closeModal();
        },
        error: () => this.errorMessage = 'Erreur de création'
      });
    }
  }

  deleteExercise(ex: Exercise) {
    if (!ex.id) return;
    if (confirm(`Voulez-vous supprimer l'exercice ${ex.name} ?`)) {
      this.exerciseService.deleteExercise(ex.id).subscribe({
        next: () => {
          this.exercises = this.exercises.filter(e => e.id !== ex.id);
        },
        error: () => this.errorMessage = 'Erreur de suppression'
      });
    }
  }
}
