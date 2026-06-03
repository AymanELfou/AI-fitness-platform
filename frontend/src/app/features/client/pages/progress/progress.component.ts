import { Component, OnInit, OnDestroy, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface Achievement {
  date: string;
  dateLabel: string;
  isToday: boolean;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface WeightPoint {
  label: string;
  value: number;
}

export interface VolumeDay {
  day: string;
  volume: number;
  isToday: boolean;
}

export interface Goal {
  label: string;
  color: string;
  percent: number;
}

@Component({
  selector: 'app-client-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit, OnDestroy {

  /* ── Date Range ── */
  dateRange = signal<string>('Last 30 Days');
  dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'];
  showDateMenu = false;
  private menuTimer: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /* Reducer helper exposed to template */
  readonly getSumReducer = (acc: number, d: VolumeDay) => acc + d.volume;

  /* ── Weight Chart Toggle ── */
  weightView = signal<'1W' | '1M' | '3M'>('1M');

  /* ── Volume Toggle ── */
  volumeView = signal<'Weekly' | 'Monthly'>('Weekly');

  /* ── Goals Donut ── */
  goals: Goal[] = [
    { label: 'Workouts',  color: '#2563EB', percent: 80 },
    { label: 'Macros',    color: '#F59E0B', percent: 65 },
    { label: 'Sleep',     color: '#22C55E', percent: 70 },
  ];

  get overallGoal(): number {
    return Math.round(this.goals.reduce((s, g) => s + g.percent, 0) / this.goals.length);
  }

  /* ── SVG Donut ── */
  readonly donutR = 70;
  readonly donutCx = 90;
  readonly donutCy = 90;
  readonly donutCircumference = 2 * Math.PI * this.donutR;

  getDonutOffset(percent: number): number {
    return this.donutCircumference * (1 - percent / 100);
  }

  getDonutRotation(index: number): number {
    let rot = -90;
    for (let i = 0; i < index; i++) {
      rot += (this.goals[i].percent / 100) * 360;
    }
    return rot;
  }

  /* ── Weight Data ── */
  weightData1W: WeightPoint[] = [
    { label: 'Mon', value: 183.2 },
    { label: 'Tue', value: 182.8 },
    { label: 'Wed', value: 183.0 },
    { label: 'Thu', value: 182.5 },
    { label: 'Fri', value: 182.1 },
    { label: 'Sat', value: 182.4 },
    { label: 'Sun', value: 182.2 },
  ];

  weightData1M: WeightPoint[] = [
    { label: 'W1',  value: 185.0 },
    { label: '',    value: 184.8 },
    { label: '',    value: 184.5 },
    { label: 'W2',  value: 184.2 },
    { label: '',    value: 183.8 },
    { label: '',    value: 183.5 },
    { label: 'W3',  value: 181.9 },
    { label: '',    value: 182.3 },
    { label: '',    value: 182.0 },
    { label: 'W4',  value: 183.2 },
    { label: '',    value: 182.8 },
    { label: 'Now', value: 182.4 },
  ];

  weightData3M: WeightPoint[] = [
    { label: 'M1',  value: 188.0 },
    { label: '',    value: 187.2 },
    { label: '',    value: 186.5 },
    { label: 'M2',  value: 185.8 },
    { label: '',    value: 184.9 },
    { label: '',    value: 184.0 },
    { label: 'M3',  value: 183.5 },
    { label: '',    value: 182.8 },
    { label: 'Now', value: 182.4 },
  ];

  get currentWeightData(): WeightPoint[] {
    return { '1W': this.weightData1W, '1M': this.weightData1M, '3M': this.weightData3M }[this.weightView()];
  }

  get currentWeight(): number { return 182.4; }
  get weightChange(): number { return -2.1; }

  /* ── SVG Line Chart ── */
  readonly chartW = 560;
  readonly chartH = 160;
  readonly chartPadX = 20;
  readonly chartPadY = 16;

  get weightMin(): number {
    return Math.min(...this.currentWeightData.map(d => d.value)) - 1;
  }

  get weightMax(): number {
    return Math.max(...this.currentWeightData.map(d => d.value)) + 1;
  }

  getWeightX(i: number): number {
    const n = this.currentWeightData.length;
    return this.chartPadX + (i / (n - 1)) * (this.chartW - 2 * this.chartPadX);
  }

  getWeightY(val: number): number {
    const range = this.weightMax - this.weightMin;
    return this.chartH - this.chartPadY - ((val - this.weightMin) / range) * (this.chartH - 2 * this.chartPadY);
  }

  get weightLinePath(): string {
    return this.currentWeightData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${this.getWeightX(i)} ${this.getWeightY(d.value)}`)
      .join(' ');
  }

  get weightAreaPath(): string {
    const pts = this.currentWeightData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${this.getWeightX(i)} ${this.getWeightY(d.value)}`)
      .join(' ');
    const last = this.currentWeightData.length - 1;
    return `${pts} L ${this.getWeightX(last)} ${this.chartH} L ${this.getWeightX(0)} ${this.chartH} Z`;
  }

  get yGridLines(): number[] {
    const range = this.weightMax - this.weightMin;
    const step = range / 4;
    return [0, 1, 2, 3, 4].map(i => this.weightMin + i * step);
  }

  /* ── Volume Chart ── */
  volumeWeekly: VolumeDay[] = [
    { day: 'Mon', volume: 18500, isToday: false },
    { day: 'Tue', volume: 23200, isToday: false },
    { day: 'Wed', volume: 31000, isToday: true  },
    { day: 'Thu', volume: 14800, isToday: false },
    { day: 'Fri', volume: 21600, isToday: false },
    { day: 'Sat', volume: 26400, isToday: false },
    { day: 'Sun', volume: 5200,  isToday: false },
  ];

  volumeMonthly: VolumeDay[] = [
    { day: 'W1', volume: 98000,  isToday: false },
    { day: 'W2', volume: 115000, isToday: false },
    { day: 'W3', volume: 87000,  isToday: false },
    { day: 'W4', volume: 131000, isToday: true  },
  ];

  get currentVolumeData(): VolumeDay[] {
    return this.volumeView() === 'Weekly' ? this.volumeWeekly : this.volumeMonthly;
  }

  get volumeMax(): number {
    return Math.max(...this.currentVolumeData.map(d => d.volume));
  }

  getBarHeight(vol: number): number {
    return Math.round((vol / this.volumeMax) * 140);
  }

  /* ── Achievements ── */
  achievements: Achievement[] = [
    {
      date: 'today', dateLabel: 'Today',
      isToday: true,
      title: 'New PR: Deadlift',
      description: 'Hit 315 lbs for 3 reps.',
      icon: '🏆', color: '#2563EB'
    },
    {
      date: 'oct-24', dateLabel: 'Jun 1',
      isToday: false,
      title: 'Consistency Streak',
      description: '14 days of logged nutrition.',
      icon: '🔥', color: '#F59E0B'
    },
    {
      date: 'oct-18', dateLabel: 'May 28',
      isToday: false,
      title: 'Completed Phase 2',
      description: 'Hypertrophy block finished.',
      icon: '✅', color: '#22C55E'
    },
    {
      date: 'oct-12', dateLabel: 'May 20',
      isToday: false,
      title: 'New PR: Bench Press',
      description: 'Pressed 225 lbs for 5 reps.',
      icon: '💪', color: '#7C3AED'
    },
  ];

  /* ── Stats strip ── */
  stats = [
    { label: 'Workouts Done', value: '24', unit: 'sessions', icon: '🏋️', trend: '+12%', up: true  },
    { label: 'Total Volume',  value: '142K', unit: 'lbs lifted', icon: '📊', trend: '+8%',  up: true  },
    { label: 'Avg. Session',  value: '58',  unit: 'min',       icon: '⏱️', trend: '-3min', up: false },
    { label: 'Body Fat',      value: '15.2', unit: '%',         icon: '⚡', trend: '-0.8%', up: true  },
  ];

  setWeightView(v: '1W' | '1M' | '3M'): void { this.weightView.set(v); }
  setVolumeView(v: 'Weekly' | 'Monthly'): void { this.volumeView.set(v); }
  setDateRange(r: string): void { this.dateRange.set(r); this.showDateMenu = false; }

  get weeklyTotal(): string {
    return (this.volumeWeekly.reduce((a, d) => a + d.volume, 0) / 1000).toFixed(0) + 'K';
  }

  get monthlyTotal(): string {
    return (this.volumeMonthly.reduce((a, d) => a + d.volume, 0) / 1000).toFixed(0) + 'K';
  }

  get currentVolumeTotal(): string {
    return this.volumeView() === 'Weekly' ? this.weeklyTotal : this.monthlyTotal;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only logic here if needed
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.menuTimer);
  }
}
