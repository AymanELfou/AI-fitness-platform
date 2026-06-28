import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import { CoachService } from '../../../../core/services/coach.service';
import { ProgrammeService, ProgrammeResponse, ProgrammeRequest } from '../../../../core/services/programme.service';
import { SeanceService, SeanceResponse, SeanceRequest } from '../../../../core/services/seance.service';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ClientService } from '../../../../core/services/client.service';
import { Exercise } from '../../../../core/models/exercise.model';
import { Client } from '../../../../core/models/client.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ── Couleurs & icônes selon le niveau ─────────────────────────────────────────

const LEVEL_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  BEGINNER:        { color: '#10b981', icon: '🏋️', label: 'Débutant' },
  INTERMEDIATE:    { color: '#6366f1', icon: '💪', label: 'Intermédiaire' },
  ADVANCED:        { color: '#ef4444', icon: '🏆', label: 'Avancé' },
  'Débutant':      { color: '#10b981', icon: '🏋️', label: 'Débutant' },
  'Intermédiaire': { color: '#6366f1', icon: '💪', label: 'Intermédiaire' },
  'Avancé':        { color: '#ef4444', icon: '🏆', label: 'Avancé' },
};

// ── Formulaires internes ──────────────────────────────────────────────────────

interface SeanceForm {
  status: string;
  duration: number;
  notes: string;
}

interface ProgrammeForm {
  title: string;
  description: string;
  duration: number;
  level: string;
  objective: string;
  isGeneratedByAI: boolean;
  exerciseIds: number[];
  clientIds: number[];
  seances: SeanceForm[];
}

// ── Composant ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent implements OnInit {

  // services
  authService      = inject(AuthService);
  coachService     = inject(CoachService);
  programmeService = inject(ProgrammeService);
  seanceService    = inject(SeanceService);
  exerciseService  = inject(ExerciseService);
  clientService    = inject(ClientService);

  // état
  programmes: ProgrammeResponse[] = [];
  allExercises: Exercise[] = [];
  coachClients: Client[] = [];
  isLoading = true;
  errorMsg = '';

  deleteConfirmModalOpen = false;
  programmeToDelete: ProgrammeResponse | null = null;

  coachProfileId: number | null = null;

  // ── Modal Voir ────────────────────────────────────────────────────────────
  viewModalOpen = false;
  viewProgramme: ProgrammeResponse | null = null;
  viewExercises: Exercise[] = [];
  viewSeances: SeanceResponse[] = [];
  viewClients: Client[] = [];
  viewLoading = false;

  // ── Modal Créer / Modifier ────────────────────────────────────────────────
  formModalOpen = false;
  formMode: 'create' | 'edit' = 'create';
  editingId: number | null = null;
  formSaving = false;
  formSuccess = false;
  formError = '';

  form: ProgrammeForm = this.emptyForm();

  // ── Séance inline ─────────────────────────────────────────────────────────
  addingSeance = false;
  seanceForm: SeanceForm = { status: 'PLANIFIEE', duration: 60, notes: '' };

  // ── Onglet actif dans le modal formulaire ─────────────────────────────────
  activeTab: 'info' | 'exercises' | 'clients' | 'seances' = 'info';

  // ── Exercice inline ───────────────────────────────────────────────────────
  addingExercise = false;
  exerciseForm: Partial<Exercise> = { name: '', musclesGroup: '', difficulty: 'EASY', series: 3, repetition: 10, duration: 15, calories: 100, createdByRole: 'COACH' };


  readonly LEVELS = [
    { value: 'BEGINNER',     label: 'Débutant' },
    { value: 'INTERMEDIATE', label: 'Intermédiaire' },
    { value: 'ADVANCED',     label: 'Avancé' },
  ];

  readonly SEANCE_STATUSES = ['PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'];

  // ─────────────────────────────────────────────────────────────────────────────

  ngOnInit() {
    this.loadData();
  }

  // ── Chargement initial ────────────────────────────────────────────────────

  loadData() {
    const user = this.authService.currentUser();
    if (!user?.id) { this.isLoading = false; return; }

    this.coachService.getCoachByUserId(user.id).subscribe({
      next: (coach) => {
        this.coachProfileId = coach.id;
        forkJoin({
          programmes: this.programmeService.getByCoachId(coach.id).pipe(catchError(() => of([]))),
          exercises:  this.exerciseService.getExercisesByCoach(coach.id).pipe(catchError(() => of([]))),
          clients:    this.clientService.getClientsByCoachId(coach.id).pipe(catchError(() => of([]))),
        }).subscribe({
          next: ({ programmes, exercises, clients }) => {
            this.programmes    = programmes;
            this.allExercises  = exercises;
            this.coachClients  = clients;
            this.isLoading     = false;
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMsg = '⚠️ Le serveur backend est inaccessible. Veuillez démarrer le backend sur le port 8082.';
        } else if (err.status === 404) {
          this.errorMsg = 'Profil coach introuvable. Créez d\'abord votre profil coach.';
        } else {
          this.errorMsg = 'Impossible de charger votre profil coach.';
        }
      }
    });
  }

  // ── Suppression ─────────────────────────────────────────────────────────────

  openDeleteConfirmModal(prog: ProgrammeResponse) {
    this.programmeToDelete = prog;
    this.deleteConfirmModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeDeleteConfirmModal() {
    this.deleteConfirmModalOpen = false;
    this.programmeToDelete = null;
    document.body.style.overflow = '';
  }

  confirmDeleteProgramme() {
    if (!this.programmeToDelete) return;

    this.programmeService.delete(this.programmeToDelete.id).subscribe({
      next: () => {
        this.programmes = this.programmes.filter(p => p.id !== this.programmeToDelete!.id);
        this.closeDeleteConfirmModal();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.closeDeleteConfirmModal();
      }
    });
  }

  // ── Helpers Formulaire ───────────────────────────────────────────────────────

  getLevelConfig(level: string) {
    return LEVEL_CONFIG[level] ?? { color: '#64748b', icon: '⚡', label: level };
  }

  getCardGradient(level: string): string {
    return `${this.getLevelConfig(level).color}18`;
  }

  getClientName(id: number): string {
    return this.coachClients.find(c => c.id === id)?.userName ?? `Client #${id}`;
  }

  // ── Modal VOIR ────────────────────────────────────────────────────────────

  openViewModal(prog: ProgrammeResponse) {
    this.viewProgramme = prog;
    this.viewExercises = [];
    this.viewSeances   = [];
    this.viewClients   = [];
    this.viewLoading   = true;
    this.viewModalOpen = true;

    // Récupérer exercices, séances et clients en parallèle
    forkJoin({
      seances: this.seanceService.getByProgrammeId(prog.id).pipe(catchError(() => of([]))),
      exercises: prog.exerciseIds?.length
        ? forkJoin(prog.exerciseIds.map(id =>
            this.exerciseService.getExerciseById(id).pipe(catchError(() => of(null)))))
        : of([]),
    }).subscribe({
      next: ({ seances, exercises }) => {
        this.viewSeances   = seances;
        this.viewExercises = (exercises as (Exercise | null)[]).filter(Boolean) as Exercise[];
        // Résoudre les clients depuis la liste locale
        this.viewClients   = this.coachClients.filter(c => prog.clientIds?.includes(c.id!));
        this.viewLoading   = false;
      },
      error: () => { this.viewLoading = false; }
    });
  }

  closeViewModal() {
    this.viewModalOpen = false;
    this.viewProgramme = null;
  }

  // ── Modal CRÉER ───────────────────────────────────────────────────────────

  openCreateModal() {
    this.formMode      = 'create';
    this.editingId     = null;
    this.form          = this.emptyForm();
    this.formError     = '';
    this.formSuccess   = false;
    this.activeTab     = 'info';
    this.formModalOpen = true;
  }

  // ── Modal MODIFIER ────────────────────────────────────────────────────────

  openEditModal(prog: ProgrammeResponse) {
    this.formMode  = 'edit';
    this.editingId = prog.id;
    this.form = {
      title:           prog.title,
      description:     prog.description ?? '',
      duration:        prog.duration,
      level:           prog.level,
      objective:       prog.objective,
      isGeneratedByAI: prog.isGeneratedByAI,
      exerciseIds:     prog.exerciseIds ? [...prog.exerciseIds] : [],
      clientIds:       prog.clientIds   ? [...prog.clientIds]   : [],
      seances:         [],
    };
    this.formError     = '';
    this.formSuccess   = false;
    this.activeTab     = 'info';
    this.formModalOpen = true;
  }

  closeFormModal() {
    this.formModalOpen = false;
    this.editingId     = null;
  }

  // ── Onglets ───────────────────────────────────────────────────────────────

  setTab(tab: 'info' | 'exercises' | 'clients' | 'seances') {
    this.activeTab = tab;
  }

  // ── Toggle exercices ──────────────────────────────────────────────────────

  toggleExercise(id: number) {
    const idx = this.form.exerciseIds.indexOf(id);
    idx >= 0 ? this.form.exerciseIds.splice(idx, 1) : this.form.exerciseIds.push(id);
  }

  isExerciseSelected(id: number): boolean {
    return this.form.exerciseIds.includes(id);
  }

  get globalExercises() {
    return this.allExercises.filter(ex => ex.createdByRole !== 'COACH');
  }

  get specializedExercises() {
    return this.allExercises.filter(ex => ex.createdByRole === 'COACH');
  }

  createExercise() {
    if (!this.exerciseForm.name || !this.exerciseForm.musclesGroup) return;
    
    this.exerciseForm.createdBy = this.coachProfileId!;
    this.exerciseForm.createdByRole = 'COACH';
    
    this.exerciseService.createExercise(this.exerciseForm).subscribe({
      next: (newEx) => {
        this.allExercises.push(newEx);
        this.toggleExercise(newEx.id!);
        // Keep the form open for the next exercise, just reset the inputs
        this.exerciseForm = { name: '', musclesGroup: '', difficulty: 'EASY', series: 3, repetition: 10, duration: 15, calories: 100, createdByRole: 'COACH', description: '', imageUrl: '' };
        const fileInput = document.getElementById('exerciseFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: () => {
        this.formError = "Erreur lors de la création de l'exercice personnalisé.";
      }
    });
  }

  onExerciseImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.exerciseForm.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ── Toggle clients ────────────────────────────────────────────────────────

  toggleClient(id: number) {
    const idx = this.form.clientIds.indexOf(id);
    idx >= 0 ? this.form.clientIds.splice(idx, 1) : this.form.clientIds.push(id);
  }

  isClientSelected(id: number): boolean {
    return this.form.clientIds.includes(id);
  }

  // ── Séances inline ────────────────────────────────────────────────────────

  addSeanceToForm() {
    this.form.seances.push({ ...this.seanceForm });
    this.seanceForm   = { status: 'PLANIFIEE', duration: 60, notes: '' };
    this.addingSeance = false;
  }

  removeSeance(index: number) {
    this.form.seances.splice(index, 1);
  }

  // ── Sauvegarde ────────────────────────────────────────────────────────────

  saveForm() {
    if (!this.coachProfileId) { this.formError = 'Profil coach introuvable.'; return; }
    if (!this.form.title.trim()) { this.formError = 'Le titre est requis.'; return; }

    this.formSaving = true;
    this.formError  = '';

    const request: ProgrammeRequest = {
      title:           this.form.title.trim(),
      description:     this.form.description.trim() || undefined,
      duration:        this.form.duration,
      level:           this.form.level,
      objective:       this.form.objective.trim(),
      isGeneratedByAI: this.form.isGeneratedByAI,
      coachId:         this.coachProfileId,
      exerciseIds:     this.form.exerciseIds,
      clientIds:       this.form.clientIds,
    };

    const save$ = this.formMode === 'create'
      ? this.programmeService.create(request)
      : this.programmeService.update(this.editingId!, request);

    save$.subscribe({
      next: (saved) => {
        if (this.formMode === 'create' && this.form.seances.length > 0) {
          const seanceRequests = this.form.seances.map(s => ({
            status:      s.status,
            duration:    s.duration,
            notes:       s.notes,
            coachId:     this.coachProfileId!,
            programmeId: saved.id,
          } as SeanceRequest));

          forkJoin(seanceRequests.map(sr =>
            this.seanceService.create(sr).pipe(catchError(() => of(null)))
          )).subscribe(() => this.afterSave(saved));
        } else {
          this.afterSave(saved);
        }
      },
      error: (err) => {
        this.formSaving = false;
        this.formError = err?.status === 0
          ? '⚠️ Backend inaccessible. Démarrez le serveur sur le port 8082.'
          : (err?.error?.message ?? 'Une erreur est survenue.');
      }
    });
  }

  private afterSave(saved: ProgrammeResponse) {
    this.formSaving  = false;
    this.formSuccess = true;

    if (this.formMode === 'create') {
      this.programmes.unshift(saved);
    } else {
      const idx = this.programmes.findIndex(p => p.id === saved.id);
      if (idx >= 0) this.programmes[idx] = saved;
    }

    setTimeout(() => {
      this.formSuccess   = false;
      this.formModalOpen = false;
    }, 1500);
  }

  // ── Utilitaire ───────────────────────────────────────────────────────────

  private emptyForm(): ProgrammeForm {
    return {
      title:           '',
      description:     '',
      duration:        8,
      level:           'BEGINNER',
      objective:       '',
      isGeneratedByAI: false,
      exerciseIds:     [],
      clientIds:       [],
      seances:         [],
    };
  }

  trackById(_: number, item: any) { return item.id; }
}
