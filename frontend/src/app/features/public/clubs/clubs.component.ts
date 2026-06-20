import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Club } from '../../../core/models/club.model';
import { ClubService } from '../../../core/services/club.service';

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

  // ── Static coaches data ──
  coaches: Coach[] = [
    {
      id: 1, name: 'Youssef Amrani',
      specialty: 'Strength & Hypertrophy',
      experience: '8 years', avatar: '🏋️',
      rating: 4.9, clients: 120,
      certifications: ['NSCA-CSCS', 'ISSA CPT'],
      bio: 'Elite powerlifting coach specializing in progressive overload programs and competition prep.'
    },
    {
      id: 2, name: 'Sarah El Fassi',
      specialty: 'Yoga & Flexibility',
      experience: '6 years', avatar: '🧘',
      rating: 4.8, clients: 95,
      certifications: ['RYT-500', 'Yoga Alliance'],
      bio: 'Certified yoga instructor combining Vinyasa flow with mobility training for athletes.'
    },
    {
      id: 3, name: 'Karim Benali',
      specialty: 'CrossFit & HIIT',
      experience: '5 years', avatar: '⚡',
      rating: 4.7, clients: 88,
      certifications: ['CrossFit L3', 'NASM-PES'],
      bio: 'High-intensity functional training expert. Builds endurance, agility and explosive power.'
    },
    {
      id: 4, name: 'Amina Ouazzani',
      specialty: 'Nutrition & Weight Loss',
      experience: '7 years', avatar: '🥗',
      rating: 4.9, clients: 150,
      certifications: ['Precision Nutrition L2', 'ACE-HC'],
      bio: 'Holistic nutrition coach helping clients transform their body composition through sustainable plans.'
    },
    {
      id: 5, name: 'Omar Tazi',
      specialty: 'Boxing & Combat Sports',
      experience: '10 years', avatar: '🥊',
      rating: 4.8, clients: 72,
      certifications: ['AIBA Coach', 'NASM-CPT'],
      bio: 'Former national boxing champion turned coach. Expert in striking, footwork and fight conditioning.'
    },
    {
      id: 6, name: 'Leila Mansouri',
      specialty: 'Pilates & Rehabilitation',
      experience: '9 years', avatar: '💎',
      rating: 4.9, clients: 110,
      certifications: ['PMA-CPT', 'STOTT Pilates'],
      bio: 'Clinical Pilates specialist focusing on injury prevention, posture correction and core stability.'
    }
  ];

  constructor(private clubService: ClubService) {}

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
  openCoachModal(club: Club): void {
    this.selectedClub = club;
    this.selectedCoach = null;
    this.showCoachModal = true;
    document.body.style.overflow = 'hidden';
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
    if (!this.selectedCoach) return;
    this.showCoachModal = false;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.selectedClub = null;
    this.selectedCoach = null;
    document.body.style.overflow = '';
  }

  starsArray(n: number): number[] {
    return Array.from({ length: Math.round(n) }, (_, i) => i);
  }
}
