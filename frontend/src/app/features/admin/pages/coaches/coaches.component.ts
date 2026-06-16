import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Coach {
  id: number; name: string; email: string; specialty: string; club: string;
  status: 'active'|'pending'|'inactive'; clients: number;
  rating: number; revenue: string; joined: string; initial: string; color: string;
}

@Component({
  selector: 'app-admin-coaches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.scss'
})
export class AdminCoachesComponent {
  search = '';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 8;
  statuses = ['All', 'active', 'pending', 'inactive'];

  coaches: Coach[] = [
    { id:1,  name:'Coach Marcus Chen',  email:'marcus@coach.com',  specialty:'Strength & Hypertrophy', club:'FitZone Casablanca',   status:'active',  clients:24, rating:4.9, revenue:'$3,200', joined:'Nov 2025', initial:'M', color:'#2563EB' },
    { id:2,  name:'Coach Elena Vasquez',email:'elena@coach.com',   specialty:'Nutrition & Weight Loss', club:'PowerHouse Rabat',      status:'active',  clients:18, rating:4.8, revenue:'$2,100', joined:'Dec 2025', initial:'E', color:'#059669' },
    { id:3,  name:'Coach David Park',   email:'david@coach.com',   specialty:'HIIT & Cardio',           club:'Alpha Club Dubai',      status:'active',  clients:31, rating:4.7, revenue:'$4,100', joined:'Sep 2025', initial:'D', color:'#7C3AED' },
    { id:4,  name:'Coach Aisha Lem',    email:'aisha@coach.com',   specialty:'Yoga & Flexibility',      club:'Pending Approval',      status:'pending', clients:0,  rating:0,   revenue:'—',      joined:'Jun 2026', initial:'A', color:'#F59E0B' },
    { id:5,  name:'Coach Reza Shahin',  email:'reza@coach.com',    specialty:'Powerlifting',            club:'EliteFit Marrakech',    status:'active',  clients:15, rating:4.6, revenue:'$1,800', joined:'Jan 2026', initial:'R', color:'#DC2626' },
    { id:6,  name:'Coach Luca Ferrari', email:'luca@coach.com',    specialty:'CrossFit & Functional',   club:'Titan Gym Paris',       status:'active',  clients:22, rating:4.9, revenue:'$2,900', joined:'Oct 2025', initial:'L', color:'#0891B2' },
    { id:7,  name:'Coach Nina Kovalev', email:'nina@coach.com',    specialty:'Sports Performance',      club:'Pending Approval',      status:'pending', clients:0,  rating:0,   revenue:'—',      joined:'Jun 2026', initial:'N', color:'#7C3AED' },
    { id:8,  name:'Coach Sam Tanner',   email:'sam@coach.com',     specialty:'Bodybuilding',            club:'GymPro Agadir',         status:'inactive',clients:0,  rating:4.2, revenue:'$800',   joined:'Mar 2026', initial:'S', color:'#475569' },
    { id:9,  name:'Coach Fatima Zahra', email:'fatima@coach.com',  specialty:'Women Wellness',          club:'FitZone Casablanca',    status:'active',  clients:19, rating:4.8, revenue:'$2,400', joined:'Feb 2026', initial:'F', color:'#EC4899' },
    { id:10, name:'Coach James Wright', email:'james@coach.com',   specialty:'Olympic Lifting',         club:'IronBody Tangier',      status:'active',  clients:12, rating:4.5, revenue:'$1,500', joined:'Apr 2026', initial:'J', color:'#059669' },
  ];

  get filtered(): Coach[] {
    return this.coaches.filter(c => {
      const q = this.search.toLowerCase();
      const ms = !q || c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q) || c.club.toLowerCase().includes(q);
      const mst = this.filterStatus === 'All' || c.status === this.filterStatus;
      return ms && mst;
    });
  }

  get paginated(): Coach[] {
    const s = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(s, s + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  get activeCount():  number { return this.coaches.filter(c => c.status === 'active').length; }
  get pendingCount(): number { return this.coaches.filter(c => c.status === 'pending').length; }
  get totalClients(): number { return this.coaches.reduce((s, c) => s + c.clients, 0); }
  get avgRating(): string {
    const rated = this.coaches.filter(c => c.rating > 0);
    return rated.length ? (rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(1) : '—';
  }

  stars(n: number): number[] { return n > 0 ? Array.from({ length: Math.round(n) }, (_, i) => i) : []; }
  approveCoach(c: Coach): void { c.status = 'active'; }
  toggleStatus(c: Coach): void { c.status = c.status === 'active' ? 'inactive' : 'active'; }
}
