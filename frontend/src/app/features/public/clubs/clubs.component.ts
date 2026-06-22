import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Club } from '../../../core/models/club.model';
import { ClubService } from '../../../core/services/club.service';
import { AuthService } from '../../../core/services/auth.service';
import { CoachService, CoachProfileResponse } from '../../../core/services/coach.service';
import { ClientService } from '../../../core/services/client.service';

export interface Coach {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  avatar: string;
  rating: number;
  clients: number;
  certifications: string[];
  bio: string;
}

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss'
})
export class ClubsComponent implements OnInit {
  search = '';
  activeFilter = 'All';
  sortBy = 'name';
  loading = false;
  error = '';

  filters = ['All', 'PREMIUM', 'FREEMIUM'];
  clubs: Club[] = [];

  // ── Modal state ──
  showCoachModal = false;
  showSuccessModal = false;
  selectedClub: Club | null = null;
  selectedCoach: Coach | null = null;

  coaches: Coach[] = [];

  constructor(
    private clubService: ClubService,
    private authService: AuthService,
    private coachService: CoachService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.error = '';
    this.clubService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clubs from the database.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  mapCoach(backendCoach: CoachProfileResponse, index: number): Coach {
    const avatars = ['🏋️', '🧘', '⚡', '🥗', '🥊', '💎'];
    const bios = [
      'Elite coach specializing in progressive overload programs and athletic conditioning.',
      'Certified instructor combining mobility training and flexibility exercises.',
      'High-intensity functional training expert focusing on building endurance and power.',
      'Nutrition and weight management specialist helping clients transform their body composition.',
      'Experienced boxing and combat sports trainer. Expert in striking and footwork.',
      'Specialist in core stability, posture correction, and injury prevention.'
    ];
    
    let certs: string[] = [];
    if (backendCoach.certifications) {
      certs = backendCoach.certifications.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (certs.length === 0) {
      certs = ['Certified Coach'];
    }

    return {
      id: backendCoach.id,
      name: backendCoach.userName || 'Coach',
      specialty: backendCoach.speciality || 'Fitness Trainer',
      experience: `${backendCoach.experience || 0} years`,
      avatar: avatars[index % avatars.length],
      rating: backendCoach.rating || 0.0,
      clients: Math.floor(Math.random() * 80) + 20,
      certifications: certs,
      bio: bios[index % bios.length]
    };
  }

  getClubImage(c: Club): string {
    const images = [
      'images/clubs/club_fitzone.png',
      'images/clubs/club_powerhouse.png',
      'images/clubs/club_elitefit.png',
      'images/clubs/club_alpha.png',
      'images/clubs/club_titan.png',
      'images/clubs/club_gympro.png'
    ];
    return images[c.id % images.length] || 'images/clubs/club_fitzone.png';
  }

  get filtered(): Club[] {
    let result = this.clubs.filter(c => {
      const q = this.search.toLowerCase();
      const matchSearch = !q ||
        (c.clubName && c.clubName.toLowerCase().includes(q)) ||
        (c.localisation && c.localisation.toLowerCase().includes(q)) ||
        (c.contactEmail && c.contactEmail.toLowerCase().includes(q));

      const matchFilter =
        this.activeFilter === 'All' ||
        c.subscriptionPlan === this.activeFilter;

      return matchSearch && matchFilter;
    });

    if (this.sortBy === 'name') {
      result = [...result].sort((a, b) => (a.clubName || '').localeCompare(b.clubName || ''));
    } else if (this.sortBy === 'capacity') {
      result = [...result].sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }

    return result;
  }

  get featuredClubs(): Club[] {
    return this.clubs.filter(c => c.subscriptionPlan === 'PREMIUM');
  }

  get totalCapacity(): number {
    return this.clubs.reduce((s, c) => s + (c.capacity || 0), 0);
  }

  // ── Modal actions ──
  // Nouvelle modification: openCoachModal ne fait plus de fallback et affiche un message d'erreur si la liste est vide ou en cas d'erreur
  openCoachModal(club: Club): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.selectedClub = club;
    this.selectedCoach = null;
    this.showCoachModal = true;
    document.body.style.overflow = 'hidden';
    
    this.loading = true;
    this.coaches = [];
    this.error = '';
    this.coachService.getCoachesByClubId(club.id).subscribe({
      next: (data: CoachProfileResponse[]) => {
        if (data && data.length > 0) {
          // Nouvelle modification: Remplir la liste des coachs depuis la base de données
          this.coaches = data.map((bc, i) => this.mapCoach(bc, i));
        } else {
          // Nouvelle modification: Vider la liste et lever une erreur si aucun coach n'existe
          this.coaches = [];
          this.error = "Aucun coach n'est disponible dans ce club pour le moment.";
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load coaches:', err);
        // Nouvelle modification: Vider la liste et lever une erreur en cas d'erreur de serveur/réseau
        this.coaches = [];
        this.error = "Une erreur est survenue lors du chargement des coachs.";
        this.loading = false;
      }
    });
  }

  closeCoachModal(): void {
    this.showCoachModal = false;
    this.selectedClub = null;
    document.body.style.overflow = '';
  }

  selectCoach(coach: Coach): void {
    this.selectedCoach = coach;
  }

  confirmCoachSelection(): void {
    if (!this.selectedCoach || !this.selectedClub) return;

    const user = this.authService.currentUser();
    if (!user || !user.id) {
      console.error('User not authenticated properly');
      return;
    }

    this.loading = true;
    this.clientService.upgradeToPremium(user.id, this.selectedClub.id, this.selectedCoach.id).subscribe({
      next: (res) => {
        this.loading = false;
        this.showCoachModal = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Failed to upgrade to premium:', err);
        this.loading = false;
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.selectedClub = null;
    this.selectedCoach = null;
    document.body.style.overflow = '';
    this.router.navigate(['/client/dashboard']);
  }

  starsArray(n: number): number[] {
    return Array.from({ length: Math.round(n) }, (_, i) => i);
  }
}
