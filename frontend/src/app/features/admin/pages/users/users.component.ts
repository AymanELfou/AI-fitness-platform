import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number; name: string; email: string; role: 'admin'|'coach'|'club'|'client';
  status: 'active'|'pending'|'inactive'|'banned'; joined: string; initial: string; color: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class AdminUsersComponent {
  search = '';
  filterRole = 'All';
  filterStatus = 'All';
  currentPage = 1;
  pageSize = 8;

  roles = ['All','admin','coach','club','client'];
  statuses = ['All','active','pending','inactive','banned'];

  users: User[] = [
    { id:1,  name:'Alex Johnson',    email:'alex@gmail.com',      role:'client', status:'active',   joined:'Jan 12, 2026', initial:'A', color:'#2563EB' },
    { id:2,  name:'Coach Marcus',    email:'marcus@coach.com',    role:'coach',  status:'active',   joined:'Nov 3, 2025',  initial:'M', color:'#7C3AED' },
    { id:3,  name:'FitZone Club',    email:'admin@fitzone.ma',    role:'club',   status:'active',   joined:'Sep 20, 2025', initial:'F', color:'#059669' },
    { id:4,  name:'Sarah Jenkins',   email:'sarah@gmail.com',     role:'client', status:'active',   joined:'Feb 1, 2026',  initial:'S', color:'#DC2626' },
    { id:5,  name:'Coach Elena V.',  email:'elena@coach.com',     role:'coach',  status:'pending',  joined:'May 30, 2026', initial:'E', color:'#0891B2' },
    { id:6,  name:'Jordan Kim',      email:'jordan@gmail.com',    role:'client', status:'active',   joined:'Mar 14, 2026', initial:'J', color:'#F59E0B' },
    { id:7,  name:'PowerHouse Club', email:'pw@powerhouse.ma',    role:'club',   status:'pending',  joined:'Jun 1, 2026',  initial:'P', color:'#7C3AED' },
    { id:8,  name:'Lena Torres',     email:'lena@gmail.com',      role:'client', status:'inactive', joined:'Apr 5, 2026',  initial:'L', color:'#059669' },
    { id:9,  name:'Coach David',     email:'david@coach.com',     role:'coach',  status:'active',   joined:'Dec 10, 2025', initial:'D', color:'#DC2626' },
    { id:10, name:'Super Admin',     email:'admin@smart.com',     role:'admin',  status:'active',   joined:'Jan 1, 2025',  initial:'SA',color:'#0F172A' },
    { id:11, name:'Mike Torres',     email:'mike@gmail.com',      role:'client', status:'banned',   joined:'Feb 20, 2026', initial:'M', color:'#EF4444' },
    { id:12, name:'EliteFit Club',   email:'elite@elitefit.ma',   role:'club',   status:'active',   joined:'Oct 15, 2025', initial:'E', color:'#F59E0B' },
  ];

  get filtered(): User[] {
    return this.users.filter(u => {
      const matchSearch = !this.search || u.name.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = this.filterRole === 'All' || u.role === this.filterRole;
      const matchStatus = this.filterStatus === 'All' || u.status === this.filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }

  get paginated(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages(): number[] { return Array.from({length: this.totalPages}, (_, i) => i + 1); }

  setPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  toggleStatus(u: User): void {
    u.status = u.status === 'active' ? 'inactive' : 'active';
  }

  getPageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  deleteUser(u: User): void { this.users = this.users.filter(x => x.id !== u.id); }

  get clientCount(): number  { return this.users.filter(u => u.role === 'client').length; }
  get coachCount(): number   { return this.users.filter(u => u.role === 'coach').length; }
  get clubCount(): number    { return this.users.filter(u => u.role === 'club').length; }
  get pendingCount(): number { return this.users.filter(u => u.status === 'pending').length; }
}
