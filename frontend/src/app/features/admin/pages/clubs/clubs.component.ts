import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Club {
  id: number; name: string; city: string; country: string;
  plan: 'Basic'|'Pro'|'Enterprise'; status: 'active'|'pending'|'inactive';
  members: number; coaches: number; revenue: string;
  joined: string; initial: string; color: string;
}

@Component({
  selector: 'app-admin-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss'
})
export class AdminClubsComponent {
  search = '';
  filterPlan = 'All';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 6;

  plans    = ['All', 'Basic', 'Pro', 'Enterprise'];
  statuses = ['All', 'active', 'pending', 'inactive'];

  clubs: Club[] = [
    { id:1, name:'FitZone Casablanca',   city:'Casablanca', country:'MA', plan:'Enterprise', status:'active',  members:312, coaches:8,  revenue:'$4,200', joined:'Sep 2025', initial:'F', color:'#2563EB' },
    { id:2, name:'PowerHouse Rabat',      city:'Rabat',      country:'MA', plan:'Pro',        status:'active',  members:287, coaches:6,  revenue:'$3,800', joined:'Oct 2025', initial:'P', color:'#7C3AED' },
    { id:3, name:'EliteFit Marrakech',    city:'Marrakech',  country:'MA', plan:'Enterprise', status:'active',  members:241, coaches:5,  revenue:'$3,100', joined:'Nov 2025', initial:'E', color:'#059669' },
    { id:4, name:'GymPro Agadir',         city:'Agadir',     country:'MA', plan:'Pro',        status:'active',  members:198, coaches:4,  revenue:'$2,700', joined:'Jan 2026', initial:'G', color:'#F59E0B' },
    { id:5, name:'IronBody Tangier',      city:'Tangier',    country:'MA', plan:'Basic',      status:'active',  members:156, coaches:3,  revenue:'$1,200', joined:'Feb 2026', initial:'I', color:'#DC2626' },
    { id:6, name:'FlexLife Fès',          city:'Fès',        country:'MA', plan:'Basic',      status:'pending', members:0,   coaches:0,  revenue:'—',      joined:'Jun 2026', initial:'FL',color:'#0891B2' },
    { id:7, name:'Alpha Club Dubai',      city:'Dubai',      country:'AE', plan:'Enterprise', status:'active',  members:520, coaches:12, revenue:'$8,400', joined:'Aug 2025', initial:'A', color:'#7C3AED' },
    { id:8, name:'PureForm London',       city:'London',     country:'GB', plan:'Pro',        status:'pending', members:0,   coaches:0,  revenue:'—',      joined:'Jun 2026', initial:'PF',color:'#059669' },
    { id:9, name:'Titan Gym Paris',       city:'Paris',      country:'FR', plan:'Enterprise', status:'active',  members:410, coaches:9,  revenue:'$6,100', joined:'Jul 2025', initial:'T', color:'#EF4444' },
  ];

  get filtered(): Club[] {
    return this.clubs.filter(c => {
      const q = this.search.toLowerCase();
      const ms = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      const mp = this.filterPlan === 'All' || c.plan === this.filterPlan;
      const mst= this.filterStatus === 'All' || c.status === this.filterStatus;
      return ms && mp && mst;
    });
  }

  get paginated(): Club[] {
    const s = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(s, s + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  get activeCount():   number { return this.clubs.filter(c => c.status === 'active').length; }
  get pendingCount():  number { return this.clubs.filter(c => c.status === 'pending').length; }
  get totalMembers():  number { return this.clubs.reduce((s, c) => s + c.members, 0); }

  approveClub(c: Club): void { c.status = 'active'; }
  toggleStatus(c: Club): void { c.status = c.status === 'active' ? 'inactive' : 'active'; }
}
