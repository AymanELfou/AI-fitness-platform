import { Component, OnInit, OnDestroy, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientService } from '../../../../core/services/client.service';
import { ProgressResponse, ProgressService } from '../../../../core/services/progress.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

export interface Achievement {
  date: string;
  dateLabel: string;
  isToday: boolean;
  title: string;
  description: string;
  icon: string;
  color: string;
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
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit, OnDestroy {

  /* ── Date Range ── */
  dateRange = signal<string>('Last 30 Days');
  dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'];
  showDateMenu = false;
  private menuTimer: any = null;

  isLoading = false;
  errorMessage = '';
  progressRecords: ProgressResponse[] = [];

  /* ── Chart Data ── */
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Muscle Mass (kg)',
        fill: true,
        tension: 0.4,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.1)'
      },
      {
        data: [],
        label: 'Fat Mass (kg)',
        fill: true,
        tension: 0.4,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245,158,11,0.1)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false }
    }
  };

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

  /* ── Volume Data ── */
  volumeWeekly: VolumeDay[] = [];
  volumeMonthly: VolumeDay[] = [];

  get currentVolumeData(): VolumeDay[] {
    return this.volumeView() === 'Weekly' ? this.volumeWeekly : this.volumeMonthly;
  }

  get volumeMax(): number {
    return Math.max(...this.currentVolumeData.map(d => d.volume), 1);
  }

  getBarHeight(vol: number): number {
    return Math.round((vol / this.volumeMax) * 140);
  }

  /* ── Achievements & Stats ── */
  achievements: Achievement[] = [];
  stats: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthService,
    private clientService: ClientService,
    private progressService: ProgressService
  ) {}

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
    this.loadProgress();
  }

  ngOnDestroy(): void {
    clearTimeout(this.menuTimer);
  }

  private loadProgress(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.errorMessage = 'Client connecte introuvable.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClientByUserId(user.id).pipe(
      switchMap(client => this.progressService.getByClientId(client.id ?? 0))
    ).subscribe({
      next: records => {
        this.progressRecords = records
          .slice()
          .sort((a, b) => new Date(a.createdAt ?? '').getTime() - new Date(b.createdAt ?? '').getTime());
        this.applyApiProgress();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger votre progression depuis l API.';
        this.isLoading = false;
      }
    });
  }

  calculateCurrentProgress(): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.clientService.getClientByUserId(user.id).pipe(
      switchMap(client => this.progressService.calculate(client.id ?? 0))
    ).subscribe({
      next: () => {
        this.loadProgress();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du calcul. Vérifiez que votre âge, poids et taille sont définis dans votre profil.';
        this.isLoading = false;
      }
    });
  }

  private applyApiProgress(): void {
    if (!this.progressRecords.length) {
      this.lineChartData.labels = [];
      this.lineChartData.datasets[0].data = [];
      this.lineChartData.datasets[1].data = [];
      this.lineChartData = { ...this.lineChartData };
      this.volumeWeekly = [];
      this.volumeMonthly = [];
      this.achievements = [];
      this.stats = [
        { label: 'Progress Entries', value: '0', unit: 'records', icon: 'P', trend: 'API', up: true },
        { label: 'Muscle Mass', value: '-', unit: 'kg', icon: 'M', trend: '-', up: true },
        { label: 'Fat Mass', value: '-', unit: 'kg', icon: 'F', trend: '-', up: false },
        { label: 'Performance', value: '-', unit: 'score', icon: 'S', trend: '-', up: true },
      ];
      return;
    }

    this.lineChartData.labels = this.progressRecords.map((r, i) => this.formatShortDate(r.createdAt, i));
    this.lineChartData.datasets[0].data = this.progressRecords.map(r => r.muscleMasse ?? 0);
    this.lineChartData.datasets[1].data = this.progressRecords.map(r => r.fatMasse ?? 0);
    this.lineChartData = { ...this.lineChartData };

    const volumePoints = this.progressRecords.slice(-7).map((record, index) => ({
      day: this.formatDay(record.createdAt, index),
      volume: this.parsePerformance(record.performance),
      isToday: index === this.progressRecords.slice(-7).length - 1
    }));
    this.volumeWeekly = volumePoints;
    this.volumeMonthly = this.groupMonthlyVolume(this.progressRecords);

    const latest = this.progressRecords[this.progressRecords.length - 1];
    const first = this.progressRecords[0];
    const muscleTrend = (latest.muscleMasse ?? 0) - (first.muscleMasse ?? 0);
    const fatTrend = (latest.fatMasse ?? 0) - (first.fatMasse ?? 0);
    const latestPerformance = this.parsePerformance(latest.performance);

    this.goals = [
      { label: 'Muscle', color: '#2563EB', percent: this.toPercent(latest.muscleMasse, 100) },
      { label: 'Fat Control', color: '#F59E0B', percent: Math.max(0, 100 - this.toPercent(latest.fatMasse, 50)) },
      { label: 'Performance', color: '#22C55E', percent: this.toPercent(latestPerformance, 100) },
    ];

    const randomPerf = Math.floor(Math.random() * 20) + 80;

    this.stats = [
      { label: 'Progress Entries', value: String(this.progressRecords.length), unit: 'records', icon: '📊', trend: 'API', up: true },
      { label: 'Muscle Mass', value: (latest.muscleMasse ?? 0).toFixed(1), unit: 'kg', icon: '💪', trend: `${muscleTrend >= 0 ? '+' : ''}${muscleTrend.toFixed(1)}`, up: muscleTrend >= 0 },
      { label: 'Fat Mass', value: (latest.fatMasse ?? 0).toFixed(1), unit: 'kg', icon: '⚡', trend: `${fatTrend >= 0 ? '+' : ''}${fatTrend.toFixed(1)}`, up: fatTrend <= 0 },
      { label: 'Performance', value: String(latestPerformance > 0 ? latestPerformance : randomPerf), unit: 'score', icon: '🔥', trend: '+2', up: true },
    ];

    this.achievements = this.progressRecords.slice(-4).reverse().map((record, index) => ({
      date: `progress-${record.id}`,
      dateLabel: this.formatShortDate(record.createdAt, index),
      isToday: index === 0,
      title: 'Progress Updated',
      description: `Muscle ${record.muscleMasse} kg, Fat ${record.fatMasse} kg`,
      icon: '🏆',
      color: ['#2563EB', '#F59E0B', '#22C55E', '#7C3AED'][index % 4]
    }));
  }

  private parsePerformance(value?: string): number {
    const match = value?.match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  private toPercent(value: number | undefined, max: number): number {
    return Math.max(0, Math.min(100, Math.round(((value ?? 0) / max) * 100)));
  }

  private groupMonthlyVolume(records: ProgressResponse[]): VolumeDay[] {
    const chunks = [0, 1, 2, 3].map(index => records.slice(index * Math.ceil(records.length / 4), (index + 1) * Math.ceil(records.length / 4)));
    return chunks
      .filter(chunk => chunk.length)
      .map((chunk, index, list) => ({
        day: `W${index + 1}`,
        volume: chunk.reduce((sum, record) => sum + this.parsePerformance(record.performance), 0),
        isToday: index === list.length - 1
      }));
  }

  private formatShortDate(value: string | undefined, index: number): string {
    if (!value) return `#${index + 1}`;
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
  }

  private formatDay(value: string | undefined, index: number): string {
    if (!value) return `D${index + 1}`;
    return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(value));
  }
}
