import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class AdminReportsComponent {

  readonly chartW = 560; readonly chartH = 160; readonly padX = 20; readonly padY = 16;

  revenueData = [
    { month:'Jan', value:18200 }, { month:'Feb', value:21400 }, { month:'Mar', value:19800 },
    { month:'Apr', value:25600 }, { month:'May', value:28900 }, { month:'Jun', value:24800 },
  ];

  signupData = [
    { month:'Jan', value:142 }, { month:'Feb', value:198 }, { month:'Mar', value:175 },
    { month:'Apr', value:231 }, { month:'May', value:267 }, { month:'Jun', value:240 },
  ];

  get revMax(): number { return Math.max(...this.revenueData.map(d => d.value)); }
  get revMin(): number { return Math.min(...this.revenueData.map(d => d.value)) * 0.9; }

  getX(i: number, len: number): number {
    return this.padX + (i / (len - 1)) * (this.chartW - 2 * this.padX);
  }
  getRevY(v: number): number {
    return this.chartH - this.padY - ((v - this.revMin) / (this.revMax - this.revMin)) * (this.chartH - 2 * this.padY);
  }
  get revLinePath(): string {
    return this.revenueData.map((d,i) => `${i===0?'M':'L'} ${this.getX(i, this.revenueData.length)} ${this.getRevY(d.value)}`).join(' ');
  }
  get revAreaPath(): string {
    const last = this.revenueData.length - 1;
    return `${this.revLinePath} L ${this.getX(last, this.revenueData.length)} ${this.chartH} L ${this.getX(0, this.revenueData.length)} ${this.chartH} Z`;
  }

  topRoutes = [
    { path: '/client/workouts', hits: 14200, pct: 90 },
    { path: '/client/dashboard', hits: 12800, pct: 81 },
    { path: '/coach/clients',   hits: 9400,  pct: 60 },
    { path: '/client/progress', hits: 7600,  pct: 48 },
    { path: '/admin/dashboard', hits: 4200,  pct: 27 },
  ];

  systemStats = [
    { label:'Avg Response Time', value:'142ms',  icon:'⚡', color:'#059669' },
    { label:'Uptime (30d)',       value:'99.97%', icon:'✅', color:'#2563EB' },
    { label:'Error Rate',         value:'0.12%',  icon:'⚠️', color:'#F59E0B' },
    { label:'Active Sessions',    value:'394',    icon:'🔥', color:'#7C3AED' },
  ];
}
