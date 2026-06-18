import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Club } from '../../../core/models/club.model';
import { ClubService } from '../../../core/services/club.service';

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

  filters = ['All', 'PREMIUM', 'BASIC'];
  clubs: Club[] = [];

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
}
