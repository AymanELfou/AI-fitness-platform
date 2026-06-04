import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

export interface GymClub {
  id: number;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  members: number;
  coaches: number;
  rating: number;
  reviews: number;
  amenities: string[];
  specialty: string;
  image: string;
  color: string;
  initial: string;
  featured: boolean;
  openHours: string;
  priceFrom: number;
}

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss'
})
export class ClubsComponent {
  search = '';
  activeFilter = 'All';
  sortBy = 'rating';

  filters = ['All', 'Morocco', 'International', 'Enterprise', 'Pro', 'Basic'];

  clubs: GymClub[] = [
    {
      id: 1, name: 'FitZone Casablanca',
      city: 'Casablanca', country: 'Morocco', countryFlag: '🇲🇦',
      plan: 'Enterprise', members: 312, coaches: 8,
      rating: 4.9, reviews: 186,
      amenities: ['🏋️ Free Weights', '🔄 Cardio Zone', '💧 Pool', '🧖 Spa', '🥗 Nutrition Bar', '📱 App'],
      specialty: 'Strength & Hypertrophy',
      image: 'images/clubs/club_fitzone.png',
      color: '#2563EB', initial: 'F', featured: true, openHours: '05:00 – 23:00', priceFrom: 49
    },
    {
      id: 2, name: 'PowerHouse Rabat',
      city: 'Rabat', country: 'Morocco', countryFlag: '🇲🇦',
      plan: 'Pro', members: 287, coaches: 6,
      rating: 4.8, reviews: 142,
      amenities: ['🏋️ CrossFit Rig', '⚡ HIIT Studio', '🧘 Yoga Room', '🥤 Smoothie Bar', '📱 App'],
      specialty: 'CrossFit & Functional',
      image: 'images/clubs/club_powerhouse.png',
      color: '#7C3AED', initial: 'P', featured: true, openHours: '06:00 – 22:00', priceFrom: 35
    },
    {
      id: 3, name: 'EliteFit Marrakech',
      city: 'Marrakech', country: 'Morocco', countryFlag: '🇲🇦',
      plan: 'Enterprise', members: 241, coaches: 5,
      rating: 4.7, reviews: 98,
      amenities: ['💎 Premium Equipment', '🧘 Pilates Studio', '🌿 Wellness', '🏃 Track', '📱 App'],
      specialty: 'Wellness & Pilates',
      image: 'images/clubs/club_elitefit.png',
      color: '#059669', initial: 'E', featured: false, openHours: '07:00 – 22:00', priceFrom: 55
    },
    {
      id: 4, name: 'Alpha Club Dubai',
      city: 'Dubai', country: 'UAE', countryFlag: '🇦🇪',
      plan: 'Enterprise', members: 520, coaches: 12,
      rating: 4.9, reviews: 324,
      amenities: ['🏙️ Rooftop Training', '🏊 Olympic Pool', '💆 Recovery Suite', '🥗 Chef Meals', '📱 App'],
      specialty: 'Performance & Recovery',
      image: 'images/clubs/club_alpha.png',
      color: '#F59E0B', initial: 'A', featured: true, openHours: '24/7', priceFrom: 120
    },
    {
      id: 5, name: 'Titan Gym Paris',
      city: 'Paris', country: 'France', countryFlag: '🇫🇷',
      plan: 'Enterprise', members: 410, coaches: 9,
      rating: 4.8, reviews: 211,
      amenities: ['🏋️ Powerlifting Platform', '⛓️ Chains & Bands', '🔴 Combat Zone', '🧊 Ice Bath', '📱 App'],
      specialty: 'Powerlifting & Strength',
      image: 'images/clubs/club_titan.png',
      color: '#DC2626', initial: 'T', featured: false, openHours: '06:00 – 23:00', priceFrom: 75
    },
    {
      id: 6, name: 'GymPro Agadir',
      city: 'Agadir', country: 'Morocco', countryFlag: '🇲🇦',
      plan: 'Pro', members: 198, coaches: 4,
      rating: 4.6, reviews: 74,
      amenities: ['🌊 Beachfront View', '🏄 Outdoor Training', '🧘 Sunrise Yoga', '🥤 Juice Bar', '📱 App'],
      specialty: 'Outdoor & Wellness',
      image: 'images/clubs/club_gympro.png',
      color: '#0891B2', initial: 'G', featured: false, openHours: '06:00 – 21:00', priceFrom: 28
    }
  ];

  get filtered(): GymClub[] {
    let result = this.clubs.filter(c => {
      const q = this.search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q);
      const matchFilter =
        this.activeFilter === 'All' ||
        (this.activeFilter === 'Morocco' && c.country === 'Morocco') ||
        (this.activeFilter === 'International' && c.country !== 'Morocco') ||
        c.plan === this.activeFilter;
      return matchSearch && matchFilter;
    });
    if (this.sortBy === 'rating')  result = [...result].sort((a, b) => b.rating - a.rating);
    if (this.sortBy === 'members') result = [...result].sort((a, b) => b.members - a.members);
    if (this.sortBy === 'price')   result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    return result;
  }

  get featuredClubs(): GymClub[] { return this.clubs.filter(c => c.featured); }
  get totalMembers(): number { return this.clubs.reduce((s, c) => s + c.members, 0); }
  get totalCoaches(): number { return this.clubs.reduce((s, c) => s + c.coaches, 0); }
  get avgRating(): string { return (this.clubs.reduce((s, c) => s + c.rating, 0) / this.clubs.length).toFixed(1); }

  stars(n: number): number[] { return Array.from({ length: Math.round(n) }, (_, i) => i); }
}
